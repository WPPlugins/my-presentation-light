<?php

if( !class_exists( 'mythemes_plg_frontend' ) ){
    
class mythemes_plg_frontend
{
    static function presentations()
    {
        global $post;
        
        wp_reset_query();

        if( isset( $_GET[ 'nopresentation' ] ) && $_GET[ 'nopresentation' ] == 'true' ){
            echo '<style>';
            echo 'html,body{ margin: 0px !important;}';
            echo 'body *:hover{';
            echo '-moz-box-shadow: inset 0px 0px 10px rgba(0, 136, 255, 0.8);';
            echo '-webkit-box-shadow: inset 0px 0px 10px rgba(0, 136, 255, 0.8);';
            echo 'box-shadow: inset 0px 0px 10px rgba(0, 136, 255, 0.8);';
            echo '}';
            echo 'body div#mythemes-plg-presentation *:hover{';
            echo '-moz-box-shadow: inset 0px 0px 0px rgba(0, 136, 255, 0.8);';
            echo '-webkit-box-shadow: inset 0px 0px 0px rgba(0, 136, 255, 0.8);';
            echo 'box-shadow: inset 0px 0px 0px rgba(0, 136, 255, 0.8);';
            echo '}';
            echo '</style>';
            echo '<div id="mythemes-plg-modal-panel" class="min-width-' . mythemes_plg_settings::val( 'devices-min-width' ) . '"></div>';
            echo '<div id="mythemes-plg-presentation" class="min-width-' . mythemes_plg_settings::val( 'devices-min-width' ) . '"></div>';
            add_filter( 'show_admin_bar', '__return_false' );
            return;
        }
        
        $ID = mythemes_plg_core::getAttachedPresentID();
        
        if( !empty( $ID ) ){
            
            /* in next version include others presentations */
            $presentations = array( $ID );
            
            $rett   = '<div id="mythemes-plg-modal-panel"></div>';
            $rett  .= '<div id="mythemes-plg-presentation"></div>';
            $rett  .= '<script>';
            $rett  .= 'jQuery(document).ready(function(){';
            
            $opt = array();
            $layouts = mythemes_plg_core::getLayouts();
            
            foreach( $presentations as $index => $id ){
                
                $presentation = get_post( $id );
                
                if( !isset( $presentation -> post_status ) || $presentation -> post_status !== 'publish' || $presentation -> post_type !== 'presentation' )
                    continue;

                /* PRESENTATION PREFIX / STORAGE PREFIX */
                $prefix = strtotime( $presentation -> post_modified );

                /* DEFAULT WIDTH && LAYOUT */
                $def = mythemes_plg_core::getDefLW( $id );

                
                /* TOOLTIPS SETTINGS */
                $tooltips = json_encode( (array)mythemes_plg_meta::val( $id , 'tooltips' ) );

                $options = json_encode( array(
                    'presentation' => array(
                        'prefix'        => $prefix,
                        'autorun'       => mythemes_plg_meta::val( $id , 'autorun' ),
                        'onStart'       => mythemes_plg_meta::val( $id , 'on-start' ),
                        'onLoadPage'    => mythemes_plg_meta::val( $id , 'on-load-page' ),
                        'use_storage'   => mythemes_plg_meta::val( $id , 'use-storage' , (int)mythemes_plg_settings::val( 'use-storage' ) ),
                        'layout'        => $def[ 'layout']['id'],
                        'width'         => $def[ 'width']
                    ),
                    'layouts' => $layouts
                ) );

                $rett .= 'var mythemes_plg_presentation = new myThemes_plg_presentation( ' . $options . ' , ' . $tooltips . ' );';
            }
            $rett .= '});';
            $rett .= '</script>';
            
            echo $rett;
        }
    }

    /* INCLUDE MEDIA CSS AND JS FILES */
    static function media()
    {
        /* GENERAL CSS */
        wp_register_style( 'mythemes-plg-tooltips-css' ,  MYTHEMES_PLG_URL . '/media/css/tooltips.css' );
        wp_enqueue_style( 'mythemes-plg-tooltips-css' );

        /* GENERAL JavaScript */
        wp_register_script( 'mythemes-plg-presentation' ,  MYTHEMES_PLG_URL . '/media/js/presentation.js' , array( 'jquery' , 'jquery-ui-sortable' ) );
        wp_register_script( 'mythemes-plg-jcanvas' ,  MYTHEMES_PLG_URL . '/media/js/jcanvas.min.js' );

        wp_enqueue_script( 'mythemes-plg-presentation' );
        wp_enqueue_script( 'mythemes-plg-jcanvas' );
    }
}

add_action( 'wp_enqueue_scripts', array( 'mythemes_plg_frontend' , 'media' ) );

} /* END IF CLASS EXISTS */
?>