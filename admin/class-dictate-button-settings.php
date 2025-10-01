<?php
/**
 * Dictate Button Settings.
 *
 * @package dictate-button
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dictate Button Settings
 */
class Dictate_Button_Settings {

	/**
	 * Option name.
	 */
	const OPTION_NAME = 'dictate_button_options';

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Register settings.
		add_action( 'admin_init', array( $this, 'register_settings' ) );

		// Add settings page to admin menu.
		add_action( 'admin_menu', array( $this, 'add_settings_page' ) );

		// Add settings link to plugins page.
		add_filter( 'plugin_action_links_' . plugin_basename( plugin_dir_path( __DIR__ ) . 'class-dictate-button.php' ), array( $this, 'add_settings_link' ) );
	}

	/**
	 * Register settings.
	 */
	public function register_settings() {
		register_setting(
			'dictate_button_settings',
			self::OPTION_NAME,
			array( $this, 'sanitize_settings' )
		);

		add_settings_section(
			'dictate_button_domain_verification',
			__( 'Site Registration', 'dictate-button' ),
			array( $this, 'domain_verification_section_callback' ),
			'dictate_button_settings'
		);

		add_settings_field(
			'domain_verified',
			__( 'Site Registration', 'dictate-button' ),
			array( $this, 'domain_verified_field_callback' ),
			'dictate_button_settings',
			'dictate_button_domain_verification'
		);

		add_settings_section(
			'dictate_button_form_types',
			__( 'Form Types', 'dictate-button' ),
			array( $this, 'form_types_section_callback' ),
			'dictate_button_settings'
		);

		add_settings_field(
			'form_types',
			__( 'Enable for', 'dictate-button' ),
			array( $this, 'form_types_field_callback' ),
			'dictate_button_settings',
			'dictate_button_form_types'
		);
	}

	/**
	 * Add settings page to admin menu.
	 */
	public function add_settings_page() {
		add_options_page(
			__( 'Dictate Button Settings', 'dictate-button' ),
			__( 'Dictate Button', 'dictate-button' ),
			'manage_options',
			'dictate-button-settings',
			array( $this, 'settings_page_callback' )
		);
	}

	/**
	 * Settings page callback.
	 */
	public function settings_page_callback() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<form action="options.php" method="post">
		<?php
		settings_fields( 'dictate_button_settings' );
		do_settings_sections( 'dictate_button_settings' );
		submit_button();
		?>
			</form>
		</div>
		<?php
	}

	/**
	 * Domain verification section callback.
	 */
	public function domain_verification_section_callback() {
		echo '<p>' . esc_html__( 'The dictate button requires site registration on dictate-button.io. If you have already registered and verified your site, please check the box below.', 'dictate-button' ) . '</p>';
	}

	/**
	 * Domain verified field callback.
	 */
	public function domain_verified_field_callback() {
		$options = get_option( self::OPTION_NAME, array() );
		$checked = isset( $options['domain_verified'] ) && 'on' === $options['domain_verified'] ? 'checked' : '';

		echo '<div style="margin-bottom: 10px;">';
		echo '<label>';
		echo '<input type="checkbox" name="' . esc_attr( self::OPTION_NAME ) . '[domain_verified]" ' . esc_attr( $checked ) . '> ';
		echo esc_html__( 'I have registered and verified my site on dictate-button.io', 'dictate-button' );
		echo '</label>';
		echo '</div>';
	}

	/**
	 * Form types section callback.
	 */
	public function form_types_section_callback() {
		echo '<p>' . esc_html__( 'Choose which form types should display the dictate button.', 'dictate-button' ) . '</p>';
	}

	/**
	 * Form types field callback.
	 */
	public function form_types_field_callback() {
		$options = get_option( self::OPTION_NAME, array( 'comments' => 'on' ) );

		$form_types = array(
			'comments'       => __( 'Comment forms', 'dictate-button' ),
			'search'         => __( 'Search forms', 'dictate-button' ),
			'contact_form_7' => __( 'Contact Form 7', 'dictate-button' ),
		);

		foreach ( $form_types as $id => $label ) {
			$checked = isset( $options[ $id ] ) && 'on' === $options[ $id ] ? 'checked' : '';
			echo '<div style="margin-bottom: 10px;">';
			echo '<label>';
			echo '<input type="checkbox" name="' . esc_attr( self::OPTION_NAME ) . '[' . esc_attr( $id ) . ']" ' . esc_attr( $checked ) . '> ';
			echo esc_html( $label );
			echo '</label>';
			echo '</div>';
		}
	}

	/**
	 * Sanitize settings.
	 *
	 * @param array $input The input array.
	 * @return array The sanitized input array.
	 */
	public function sanitize_settings( $input ) {
		$sanitized_input = array();

		// Domain verification checkbox.
		$sanitized_input['domain_verified'] = isset( $input['domain_verified'] ) ? 'on' : 'off';

		// Form types checkboxes.
		$form_types = array(
			'comments',
			'search',
			'contact_form_7',
		);

		foreach ( $form_types as $type ) {
			$sanitized_input[ $type ] = isset( $input[ $type ] ) ? 'on' : 'off';
		}

		return $sanitized_input;
	}

	/**
	 * Get option.
	 *
	 * @param string $key The option key.
	 * @param mixed  $default_value The default value.
	 * @return mixed The option value.
	 */
	public static function get_option( $key = null, $default_value = null ) {
		$options = get_option( self::OPTION_NAME, array() );

		if ( null === $key ) {
			return $options;
		}

		return isset( $options[ $key ] ) ? $options[ $key ] : $default_value;
	}

	/**
	 * Add settings link to plugin page.
	 *
	 * @param array $links Array of plugin action links.
	 * @return array Modified array of plugin action links.
	 */
	public function add_settings_link( $links ) {
		$settings_link = '<a href="' . menu_page_url( 'dictate-button-settings', false ) . '">' . esc_html__( 'Settings', 'dictate-button' ) . '</a>';
		array_unshift( $links, $settings_link );
		return $links;
	}
}

// Initialize settings.
new Dictate_Button_Settings();
