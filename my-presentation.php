<?php
/*
Plugin Name: My Presentation Light
Plugin URI: http://andreihusanu.ro/projects/wordpress/plugins/my-presentation-light/
Description: This is a WordPress Plugin designed to achieve interactive presentations in the web pages created using WordPress themes.
Author: myThem.es
Version: 0.1
Author URI: http://mythem.es/
*/

/*  
    Copyright 2013 myThem.es ( email: mythemes13 at gmail.com)

    This is a program designed to achieve interactive presentations in the web pages created using WordPress themes.


    My Presentation Light, Copyright 2013 myThem.es
    My Presentation Light is distributed under the terms of the GNU GPL


                     ________________
                    |_____    _______|
     ___ ___ ___   __ __  |  |  __       ____   ___ ___ ___       ____   ____ 
    |   |   |   | |_ |  | |  | |  |___  |  __| |   |   |   |     |  __| |  __|
    |   |   |   |  | |  | |  | |  __  | |  __| |   |   |   |  _  |  __| |__  |
    |___|___|___|   |  |  |__| |_ ||_ | |____| |___|___|___| |_| |____| |____|   
                    |_|


*/
    include_once( ABSPATH . 'wp-admin/includes/plugin.php' );

    if( is_plugin_active( 'my-presentation/my-presentation.php' ) ){

        function mythemes_plg_notice() {

            if ( is_multisite() ) {
                $url = network_admin_url('/plugins.php' );
            }else{
                $url = admin_url('/plugins.php' );
            }

            echo '<div class="error">';
            echo '<p>' . __( 'At the moment the plugin <strong>My Presentation</strong> ( premium version ) is active. If you want to disappear this message you need to disable the free version.' , 'myThemes' ) . '</p>';
            echo '<p><strong>' . __( 'Disable' , 'myThemes' ) . '</strong> -  <a href="' . $url . '">My Presentation Light</a></p>';
            echo '</div>';
        }

        add_action( 'admin_notices', 'mythemes_plg_notice' );
        return;
    }

    define( 'MYTHEMES_PLG_DIR'  , dirname( __FILE__ ) );
    define( 'MYTHEMES_PLG_NAME'  , plugin_basename( __FILE__ ) );

    define( 'MYTHEMES_PLG_URL'  , plugins_url( '/my-presentation-light' ) );
    
    define( 'MYTHEMES_PLG_ICON' , plugins_url( '/my-presentation-light/media/admin/images/icon.png' ) );
    define( 'MYTHEMES_PLG_LOGO' , plugins_url( '/my-presentation-light/media/admin/images/mythemes-logo.png' ) );
        
    include_once 'mythemes.plg.cfg.class.php';
    
    /* CFG - OPTIONS */
    include_once 'cfg/default.php';
    include_once 'cfg/settings/_pages.php';
    
    /* CFG - RESOURCES */
    include_once 'cfg/resources/posts.php';
    include_once 'cfg/resources/taxonomies.php';
    include_once 'cfg/resources/boxes.php';
    
    /* FRAMEWORK */
    include_once 'fw/main.php';

    add_action( 'wp_footer' , array( 'mythemes_plg_frontend' , 'presentations' ) );
?>