<?php

/**
 * Plugin Name: Dictate Button for WordPress
 * Description: Adds a dictate button to various form types using the dictate-button npm package in exclusive mode.
 * Version: 1.0.0
 * Author: Konstantin Komelin (@kkomelin)
 * Text Domain: dictate-button
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Include admin settings
require_once plugin_dir_path(__FILE__) . 'admin/settings.php';

class Dictate_Button
{
    /**
     * Constructor
     */
    public function __construct()
    {
        // Enqueue scripts and styles
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));

        // Add dictate button to comment forms if enabled
        if (Dictate_Button_Settings::get_option('comments') === 'on') {
            add_filter('comment_form_defaults', array($this, 'add_dictate_button_to_comment_form'));
        }

        // Add dictate button to search forms if enabled
        if (Dictate_Button_Settings::get_option('search') === 'on') {
            add_filter('get_search_form', array($this, 'add_dictate_button_to_search_form'));
            add_filter('render_block_core/search', array($this, 'add_dictate_button_to_search_block'), 10, 2);
        }

        // Add dictate button to Contact Form 7 if enabled
        if (Dictate_Button_Settings::get_option('contact_form_7') === 'on') {
            add_filter('wpcf7_form_elements', array($this, 'add_dictate_button_to_cf7'), 10, 1);
        }
    }

    /**
     * Enqueue scripts and styles for frontend
     */
    public function enqueue_scripts()
    {
        $should_load = false;

        // Check if we should load the scripts based on settings
        if ((is_singular() && comments_open() && Dictate_Button_Settings::get_option('comments') === 'on') ||
            (Dictate_Button_Settings::get_option('search') === 'on') ||
            (Dictate_Button_Settings::get_option('contact_form_7') === 'on' && $this->has_contact_form_7())
        ) {
            $should_load = true;
        }

        if ($should_load) {
            $this->register_dictate_button_scripts();
        }
    }

    /**
     * Register dictate button scripts
     */
    private function register_dictate_button_scripts()
    {
        wp_register_script(
            'dictate-button-bundle-js',
            plugin_dir_url(__FILE__) . 'assets/js/dictate-button-bundle.js',
            array(),  // No dependencies
            $this->get_dictate_button_version(),
            true
        );

        wp_enqueue_script('dictate-button-bundle-js');

        add_filter('script_loader_tag', function ($tag, $handle, $src) {
            if ('dictate-button-bundle-js' === $handle) {
                return '<script type="module" src="' . esc_url($src) . '"></script>';
            }
            return $tag;
        }, 10, 3);
    }

    /**
     * Add dictate button to comment form
     */
    public function add_dictate_button_to_comment_form($defaults)
    {
        // Add data attribute to comment textarea
        $defaults['comment_field'] = str_replace(
            '<textarea',
            '<textarea data-dictate-button-on',
            $defaults['comment_field']
        );

        return $defaults;
    }

    /**
     * Add dictate button to search form
     */
    public function add_dictate_button_to_search_form($form)
    {
        // Add data attribute to search input
        $form = str_replace(
            'type="search"',
            'type="search" data-dictate-button-on',
            $form
        );

        return $form;
    }

    /**
     * Add dictate button to search block
     */
    public function add_dictate_button_to_search_block($block_content, $block)
    {
        // Add data attribute to search input in block content
        $block_content = str_replace(
            'type="search"',
            'type="search" data-dictate-button-on',
            $block_content
        );

        return $block_content;
    }

    /**
     * Check if Contact Form 7 is active and has forms on current page
     */
    private function has_contact_form_7()
    {
        return class_exists('WPCF7') && (has_shortcode(get_post()->post_content ?? '', 'contact-form-7') || is_admin());
    }

    /**
     * Add dictate button to Contact Form 7 textarea fields
     */
    public function add_dictate_button_to_cf7($html)
    {
        // Add data attribute to textarea elements
        $html = str_replace(
            '<textarea',
            '<textarea data-dictate-button-on',
            $html
        );
        
        return $html;
    }

    /**
     * Get dictate-button version from package.json
     */
    private function get_dictate_button_version()
    {
        $package_json_path = plugin_dir_path(__FILE__) . 'package.json';

        $fallback_version = '1.4.1';

        if (!file_exists($package_json_path)) {
            return $fallback_version;
        }

        $package_json = json_decode(file_get_contents($package_json_path), true);

        if (!$package_json || !isset($package_json['dependencies']['dictate-button'])) {
            return $fallback_version;
        }

        // Clean version string using regex to remove prefixes and suffixes.
        $version = $package_json['dependencies']['dictate-button'];
        return preg_replace('/^[~^>=<]+|[-+].*$/', '', $version);
    }
}

// Initialize the plugin
new Dictate_Button();
