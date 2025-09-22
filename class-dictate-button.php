<?php
/**
 * Plugin Name: Dictate Button
 * Description: Adds speech-to-text dictation functionality to WordPress forms via dictate-button.io.
 * Tags: voice input, speech-to-text, transcription, dictation, dictate-button
 * Version: 1.0.0
 * Author: Konstantin Komelin (@kkomelin)
 * Text Domain: dictate-button
 * License: Apache-2.0
 *
 * @package dictate-button
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'DICTATE_BUTTON_JS_FALLBACK_VERSION', '1.4.1' );

// Include admin settings.
require_once plugin_dir_path( __FILE__ ) . 'admin/class-dictate-button-settings.php';

/**
 * Dictate Button class.
 */
class Dictate_Button {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Enqueue scripts and styles.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		// Enqueue scripts for admin if enabled.
		if ( Dictate_Button_Settings::get_option( 'admin_post_edit' ) === 'on' ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
		}

		// Add dictate button to comment forms if enabled.
		if ( Dictate_Button_Settings::get_option( 'comments' ) === 'on' ) {
			add_filter( 'comment_form_defaults', array( $this, 'add_dictate_button_to_comment_form' ) );
		}

		// Add dictate button to search forms if enabled.
		if ( Dictate_Button_Settings::get_option( 'search' ) === 'on' ) {
			add_filter( 'get_search_form', array( $this, 'add_dictate_button_to_search_form' ) );
			add_filter( 'render_block_core/search', array( $this, 'add_dictate_button_to_search_block' ), 10, 2 );
		}

		// Add dictate button to Contact Form 7 if enabled.
		if ( Dictate_Button_Settings::get_option( 'contact_form_7' ) === 'on' ) {
			add_filter( 'wpcf7_form_elements', array( $this, 'add_dictate_button_to_cf7' ), 10, 1 );
		}
	}

	/**
	 * Enqueue scripts and styles for frontend.
	 */
	public function enqueue_scripts() {
		$should_load = false;

		// Check if we should load the scripts based on settings.
		if ( ( is_singular() && comments_open() && 'on' === Dictate_Button_Settings::get_option( 'comments' ) ) ||
			( 'on' === Dictate_Button_Settings::get_option( 'search' ) ) ||
			( 'on' === Dictate_Button_Settings::get_option( 'contact_form_7' ) && $this->has_contact_form_7() )
		) {
			$should_load = true;
		}

		if ( $should_load ) {
			$this->register_dictate_button_scripts();
		}
	}

	/**
	 * Enqueue scripts and styles for admin pages.
	 *
	 * @param string $hook The current admin page.
	 */
	public function enqueue_admin_scripts( $hook ) {
		// Only load on post edit pages.
		if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
			return;
		}

		$this->register_dictate_button_scripts();
	}

	/**
	 * Register dictate button scripts.
	 */
	private function register_dictate_button_scripts() {
		wp_register_script(
			'dictate-button-bundle-js',
			plugin_dir_url( __FILE__ ) . 'assets/js/dictate-button-bundle.js',
			array(),
			$this->get_dictate_button_version(),
			true
		);

		wp_enqueue_script( 'dictate-button-bundle-js' );

		add_filter(
			'script_loader_tag',
			function ( $tag, $handle, $src ) {
				if ( 'dictate-button-bundle-js' === $handle ) {
					// phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript
					return '<script type="module" src="' . esc_url( $src ) . '"></script>';
				}
				return $tag;
			},
			10,
			3
		);
	}

	/**
	 * Add dictate button to comment form.
	 *
	 * @param array $defaults The comment form defaults.
	 * @return array The comment form defaults with dictate button data attribute.
	 */
	public function add_dictate_button_to_comment_form( $defaults ) {
		// Add data attribute to comment textarea.
		$defaults['comment_field'] = str_replace(
			'<textarea',
			'<textarea data-dictate-button-on',
			$defaults['comment_field']
		);

		return $defaults;
	}

	/**
	 * Add dictate button to search form.
	 *
	 * @param string $form The search form HTML.
	 * @return string The search form HTML with dictate button data attribute.
	 */
	public function add_dictate_button_to_search_form( $form ) {
		// Add data attribute to search input.
		$form = str_replace(
			'type="search"',
			'type="search" data-dictate-button-on',
			$form
		);

		return $form;
	}

	/**
	 * Add dictate button to search block.
	 *
	 * @param string $block_content The search block content.
	 * @return string The search block content with dictate button data attribute.
	 */
	public function add_dictate_button_to_search_block( $block_content ) {
		// Add data attribute to search input in block content.
		$block_content = str_replace(
			'type="search"',
			'type="search" data-dictate-button-on',
			$block_content
		);

		return $block_content;
	}

	/**
	 * Check if Contact Form 7 is active and has forms on current page.
	 */
	private function has_contact_form_7() {
		return class_exists( 'WPCF7' ) && ( has_shortcode( get_post()->post_content ?? '', 'contact-form-7' ) || is_admin() );
	}

	/**
	 * Add dictate button to Contact Form 7 textarea fields.
	 *
	 * @param string $html The Contact Form 7 HTML.
	 * @return string The Contact Form 7 HTML with dictate button data attribute.
	 */
	public function add_dictate_button_to_cf7( $html ) {
		// Add data attribute to textarea elements.
		$html = str_replace(
			'<textarea',
			'<textarea data-dictate-button-on',
			$html
		);

		return $html;
	}

	/**
	 * Get dictate-button version from package.json.
	 */
	private function get_dictate_button_version() {
		$package_json_path = plugin_dir_path( __FILE__ ) . 'package.json';

		if ( ! file_exists( $package_json_path ) ) {
			return DICTATE_BUTTON_JS_FALLBACK_VERSION;
		}

		// Initialize WordPress filesystem.
		require_once ABSPATH . 'wp-admin/includes/file.php';
		WP_Filesystem();
		global $wp_filesystem;

		$package_json_content = $wp_filesystem->get_contents( $package_json_path );
		if ( false === $package_json_content ) {
			return DICTATE_BUTTON_JS_FALLBACK_VERSION;
		}
		$package_json = json_decode( $package_json_content, true );

		if ( ! $package_json || ! isset( $package_json['dependencies']['dictate-button'] ) ) {
			return DICTATE_BUTTON_JS_FALLBACK_VERSION;
		}

		// Clean version string using regex to remove prefixes and suffixes.
		$version = $package_json['dependencies']['dictate-button'];
		return preg_replace( '/^[~^>=<]+|[-+].*$/', '', $version );
	}
}

// Initialize the plugin.
new Dictate_Button();
