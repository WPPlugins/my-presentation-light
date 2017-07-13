<?php

if( !class_exists( 'mythemes_plg_core' ) ){

class mythemes_plg_core
{
    static function getAttachedPresentID()
    {
        global $post;

        /* CREATE PERMALINK */
        $host   = $_SERVER[ 'HTTP_HOST' ];
        $uri    = $_SERVER[ 'REQUEST_URI' ];
        $url    = explode( $host , get_permalink() );
        
        $permalink = $url[ 0 ] . $host . $uri;
        
        /* SHOW BY URL */
        $relations = mythemes_plg_settings::val( 'relations' );
        $id = null;
        
        /* ATTACHED TO URL */
        if( isset( $relations[ $permalink ] ) && !empty( $relations[ $permalink ] ) ){
            $data = $relations[ $permalink ];
            $id = isset( $data[ count( $data ) - 1 ] ) && (int)$data[ count( $data ) - 1 ] ? $data[ count( $data ) - 1  ] : (int)$data;
        }
        
        /* ATTACHED TO RESOURCES */
        if( empty( $id ) && is_singular( $post -> post_type ) ){
            $data = mythemes_plg_meta::val( $post -> ID , 'presentations' );
            $id = is_array( $data ) && (int)$data[ count( $data ) - 1 ] ? $data[ count( $data ) - 1  ] : (int)$data;
        }

        return $id;
    }

    /* GET DEFAULT LAYOUT AND WIDTH FOR PRESENTATION ID */
    static function getDefLW( $id )
    {
        $rett = array();
        $layouts = self::getLayouts();

        /* LAYOUT */
        $l = mythemes_plg_meta::val( $id , 'layout' , mythemes_plg_settings::val( 'layout' ) );

        if( !empty( $l ) && isset( $layouts[ $l ] ) ){
            $rett[ 'layout' ] = $layouts[ $l ];
        }
        else{
            $rett[ 'layout' ] = mythemes_plg_cfg::$deff[ 'settings' ][ 'mythemes-plg-layouts' ][ 1 ];
        }

        /* WIDTH */
        $rett[ 'width' ]  = mythemes_plg_meta::val( $id , 'width' , mythemes_plg_settings::val( 'width' ) );

        return $rett;
    }

    /* GET ALL LAYOUTS DEFAULT AND CUSTOM */
    static function getLayouts()
    {
        //$layouts = mythemes_plg_settings::val( 'layouts' );
        $layouts = mythemes_plg_cfg::$deff[ 'settings' ][ 'mythemes-plg-layouts' ];
        $rett    = array();

        /* LAYOUTS */
        if( !empty( $layouts ) )
            foreach( $layouts as $index => $l ){
                $rett[ $l[ 'id' ] ] = $l;
            }

        return $rett;
    }
    
    static function media()
    {
        /* ADMIN JavaScript */
        if( is_admin() ){
            
            /* INCLUDE FRONT END SCRIPTS */
            mythemes_plg_frontend::media();

            /* CODEMIRROR */
            wp_register_style( 'mythemes-plg-codemirror-css' ,  MYTHEMES_PLG_URL . '/media/admin/css/codemirror.css' );
            wp_enqueue_style( 'mythemes-plg-codemirror-css' );

            wp_register_script( 'mythemes-plg-codemirror' ,  MYTHEMES_PLG_URL . '/media/admin/js/codemirror.js' );

            wp_register_script( 'mythemes-plg-addon-comment' ,  MYTHEMES_PLG_URL . '/media/admin/js/addon/comment.js' );
            wp_register_script( 'mythemes-plg-matchbrackets' ,  MYTHEMES_PLG_URL . '/media/admin/js/addon/matchbrackets.js' );
            wp_register_script( 'mythemes-plg-active-line' ,  MYTHEMES_PLG_URL . '/media/admin/js/addon/active-line.js' );

            wp_register_script( 'mythemes-plg-mode-xml' ,  MYTHEMES_PLG_URL . '/media/admin/js/mode/xml.js' );
            wp_register_script( 'mythemes-plg-mode-javascript' ,  MYTHEMES_PLG_URL . '/media/admin/js/mode/javascript.js' );
            wp_register_script( 'mythemes-plg-mode-css' ,  MYTHEMES_PLG_URL . '/media/admin/js/mode/css.js' );
            wp_register_script( 'mythemes-plg-mode-vbscript' ,  MYTHEMES_PLG_URL . '/media/admin/js/mode/vbscript.js' );
            wp_register_script( 'mythemes-plg-mode-htmlmixed' ,  MYTHEMES_PLG_URL . '/media/admin/js/mode/htmlmixed.js' );
            

            wp_enqueue_script( 'mythemes-plg-codemirror' );

            wp_enqueue_script( 'mythemes-plg-addon-comment' );
            wp_enqueue_script( 'mythemes-plg-matchbrackets' );
            wp_enqueue_script( 'mythemes-plg-active-line' );

            wp_enqueue_script( 'mythemes-plg-mode-xml' );
            wp_enqueue_script( 'mythemes-plg-mode-javascript' );
            wp_enqueue_script( 'mythemes-plg-mode-css' );
            wp_enqueue_script( 'mythemes-plg-mode-vbscript' );
            wp_enqueue_script( 'mythemes-plg-mode-htmlmixed' );


            wp_register_script( 'mythemes-plg-ahtml' ,  MYTHEMES_PLG_URL . '/media/admin/js/ahtml.js' );
            wp_register_script( 'mythemes-plg-admin-presentation' ,  MYTHEMES_PLG_URL . '/media/admin/js/presentation.js' );
            wp_register_script( 'mythemes-plg-functions' ,  MYTHEMES_PLG_URL . '/media/admin/js/functions.js' );
            
            wp_enqueue_script( 'mythemes-plg-ahtml' );
            wp_enqueue_script( 'mythemes-plg-admin-presentation' );
            wp_enqueue_script( 'mythemes-plg-functions' );
            
            wp_enqueue_style( 'farbtastic' );
            
            wp_register_script( 'mythemes-plg-farbtastic' , admin_url( '/js/farbtastic.js' ) );                
            wp_enqueue_script( 'mythemes-plg-farbtastic' );

            /* ADMIN CSS */
            wp_register_style( 'mythemes-plg-admin-css' ,  MYTHEMES_PLG_URL . '/media/admin/css/admin.css' );
            wp_register_style( 'mythemes-plg-ahtml-css' ,  MYTHEMES_PLG_URL . '/media/admin/css/ahtml.css' );
            wp_register_style( 'mythemes-plg-box-css' ,  MYTHEMES_PLG_URL . '/media/admin/css/box.css' );
            wp_register_style( 'mythemes-plg-inline-css' ,  MYTHEMES_PLG_URL . '/media/admin/css/inline.css' );
            wp_register_style( 'mythemes-plg-template-css' ,  MYTHEMES_PLG_URL . '/media/admin/css/template.css' );
            
            wp_register_style( 'mythemes-plg-admin-tooltip-css' ,  MYTHEMES_PLG_URL . '/media/admin/css/tooltip.css' );
            

            wp_enqueue_style( 'mythemes-plg-admin-css' );
            wp_enqueue_style( 'mythemes-plg-ahtml-css' );
            wp_enqueue_style( 'mythemes-plg-box-css' );
            wp_enqueue_style( 'mythemes-plg-inline-css' );
            wp_enqueue_style( 'mythemes-plg-template-css' );
            
            wp_enqueue_style( 'mythemes-plg-admin-tooltip-css' );
        }
    }
    
    static function name()
    {
        $data = get_plugin_data( MYTHEMES_PLG_DIR  . '/my-presentation.php' );
        $rett = 'undefined';
        
        if( isset( $data[ 'Name' ] ) )
            $rett = $data[ 'Name' ];
        
        return $rett;
    }
    
    static function version()
    {
        $data = get_plugin_data( MYTHEMES_PLG_DIR  . '/my-presentation.php' );
        $rett = 'undefined';
        
        if( isset( $data[ 'Version' ] ) )
            $rett = $data[ 'Version' ];
        
        return $rett;
    }
}

add_action( 'init' , array( 'mythemes_plg_core' , 'media' ) );
} /* END IF CLASS EXISTS */
?>