=== Dictate Button ===
Contributors: dictatebutton, kkomelin
Donate link: https://github.com/dictate-button/dictate-button-wordpress-plugin
Tags: voice input, speech-to-text, transcription, dictation, dictate-button
Requires at least: 5.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.1.0
License: Apache-2.0
License URI: https://www.apache.org/licenses/LICENSE-2.0

Adds speech-to-text dictation functionality to WordPress forms via dictate-button.io, making your site more accessible with voice input capabilities.

== Description ==

The Dictate Button plugin enables speech-to-text functionality for various form types on your site by adding a dictate button which performs the transcription via the dictate-button.io service. 
It allows users to dictate text rather than type it, making your site more accessible and user-friendly.

**Please note:** This plugin requires an account and site registration on [dictate-button.io](https://dictate-button.io).

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

== External Services ==

This plugin performs audio transcription through the Dictate Button API.

When requested by the user, it records the user's voice and sends the recording to the Dictate Button API for transcription.

Please note that the Dictate Button service is still in Beta, so we may store some of your data temporary, 
such as your browser user agent and the voice recording with transcription, for the sake of testing and improving the service.

Currently this service is provided "AS IS" and free of charge (up to certain limits): 
[terms of service](https://dictate-button.io/docs/tos), [privacy policy](](https://dictate-button.io/docs/privacy).

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

== Development ==

The plugin development repository is available on [GitHub](https://github.com/dictate-button/dictate-button-wordpress-plugin).

We locally bundle the JS code from Apache-2.0-licensed [dictate-button](https://www.npmjs.com/package/dictate-button) library to the `assets/js` folder this way:

`pnpm install`
`pnpm run build`

The source code of the dictate-button library is available on [GitHub](https://github.com/dictate-button/dictate-button).

== Changelog ==

= 1.1.0 =
* dictate-button library update to 1.6.0: Added support for the long press flow.
You long press the button, it starts recording. You release the button, it stops recording. The experience is similar to the audio/video recording in messengers.
Please note, the short tap flow remains in place.

= 1.0.3 =
* fix: Updated the dictate-button library to version 1.5.1 which addresses the issue with the microphone is not being released after use.

= 1.0.2 =
* chore: Trying to get used to WordPress.org SVN plugin deployment.

= 1.0.1 =
* docs: Fixed code block formatting in the readme.

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
