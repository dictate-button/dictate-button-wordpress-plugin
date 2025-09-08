=== Dictate Button for WordPress ===
Contributors: (kkomelin)
Donate link: https://github.com/dictate-button/dictate-button
Tags: speech-to-text, dictate, dictation, dictate-button, dictate-button-for-wordpress, dictate-button-plugin, dictate-button-wordpress
Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Adds speech-to-text dictation functionality to WordPress forms via dictate-button.io, making your site more accessible with voice input capabilities.

== Description ==

The Dictate Button for WordPress plugin enables speech-to-text functionality for various form types on your site through the dictate-button.io service. 
It allows users to dictate text rather than typing, making your site more accessible and user-friendly.

**Please note:** This plugin requires site registration on [dictate-button.io](https://dictate-button.io).

= Features =

* Adds a dictate button to WordPress forms
* Configure which form types show the dictate button
* Uses the dictate-button component in exclusive mode
* Admin settings page for easy configuration
* Works with modern browsers supporting Web Speech API

= Supported Form Types =

* WordPress comment forms
* WordPress search forms
* Contact Form 7 forms

= Requirements =

* A modern browser that supports the Web Speech API (Chrome, Edge, Safari, Firefox)
* Site registration on [dictate-button.io](https://dictate-button.io)

== Installation ==

1. Sign up and register your site on [dictate-button.io](https://dictate-button.io)
2. Upload the `dictate-button` folder to the `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Go to Settings > Dictate Button to configure which form types should show the dictate button

== Third-Party Libraries ==

The plugin includes the [dictate-button](https://www.npmjs.com/package/dictate-button) library of Apache License 2.0.

== Frequently Asked Questions ==

= What browsers are supported? =

The plugin works with modern browsers that support the Web Speech API, including Chrome, Edge, Safari, and Firefox.

= Do I need to sign up on dictate-button.io? =

Yes, you need to sign up and register your site on [dictate-button.io](https://dictate-button.io) for the plugin to work properly.

= Which form types are supported? =

Currently supported:
* WordPress comment forms
* WordPress search forms  
* Contact Form 7 forms

= How does the plugin work? =

The plugin automatically adds the necessary `data-dictate-button-on` attribute to the form elements you select in the settings and enhances those elements with the dictate button.

== Screenshots ==

1. Plugin settings page showing form type configuration options
2. Dictate button appearing on a comment form
3. Dictate button in action on a search form

== Changelog ==

= 1.0.0 =
* Initial release
* Support for WordPress comment forms
* Support for WordPress search forms
* Support for Contact Form 7
* Admin settings page
* Integration with dictate-button.io service

== Upgrade Notice ==

= 1.0.0 =
Initial release of the Dictate Button plugin with speech-to-text functionality for WordPress forms.
