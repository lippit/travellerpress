<?php
/**
 *
 * @package   TravellerPress
 * @author    Purethemes <contact@purethemes.net>
 * @license   GPL-2.0+
 * @link      http://purethemes.net
 * @copyright 2015 Purethemes.net
 *
 * @wordpress-plugin
 * Plugin Name:       TravellerPress
 * Plugin URI:        http://purethemes.net
 * Description:       Google Maps plugin for keeping travel blog
 * Version:           1.6.2.5
 * Author:            Purethemes.net
 * Author URI:        http://purethemes.net
 * Text Domain:       traveller
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path:       /languages
 * Based on WordPress-Plugin-Boilerplate: v2.6.1
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/*----------------------------------------------------------------------------*
 * Public-Facing Functionality
 *----------------------------------------------------------------------------*/

/*
 * @TODO:
 *
 * - replace `class-plugin-name.php` with the name of the plugin's class file
 *
 */
require_once( plugin_dir_path( __FILE__ ) . 'public/class-travellerpress.php' );

/*
 * Register hooks that are fired when the plugin is activated or deactivated.
 * When the plugin is deleted, the uninstall.php file is loaded.
 *
 * @TODO:
 *
 * - replace TravellerPress with the name of the class defined in
 *   `class-plugin-name.php`
 */
register_activation_hook( __FILE__, array( 'TravellerPress', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'TravellerPress', 'deactivate' ) );

/*
 * @TODO:
 *
 * - replace TravellerPress with the name of the class defined in
 *   `class-plugin-name.php`
 */
add_action( 'plugins_loaded', array( 'TravellerPress', 'get_instance' ) );

/*----------------------------------------------------------------------------*
 * Dashboard and Administrative Functionality
 *----------------------------------------------------------------------------*/

/*
 * @TODO:
 *
 * - replace `class-plugin-name-admin.php` with the name of the plugin's admin file
 * - replace TravellerPress_Admin with the name of the class defined in
 *   `class-plugin-name-admin.php`
 *
 * If you want to include Ajax within the dashboard, change the following
 * conditional to:
 *
 * if ( is_admin() ) {
 *   ...
 * }
 *
 * The code below is intended to to give the lightest footprint possible.
 */
if ( is_admin() && ( ! defined( 'DOING_AJAX' ) || ! DOING_AJAX ) ) {

	require_once( plugin_dir_path( __FILE__ ) . 'admin/class-travellerpress-admin.php' );
	add_action( 'plugins_loaded', array( 'TravellerPress_Admin', 'get_instance' ) );

} ?>