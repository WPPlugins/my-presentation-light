<?php

if( !class_exists( 'mythemes_plg_box' ) ){

class mythemes_plg_box
{
    static function run( )
    {
        if( empty( mythemes_plg_cfg::$boxes ) || 
            !is_array( mythemes_plg_cfg::$boxes ) )
        {
            return null;
        }
        
        foreach( mythemes_plg_cfg::$boxes as $postSlug => & $boxes ) {
            foreach( $boxes as $boxSlug => $box ) {
                add_meta_box( $boxSlug
                    , $box[ 'title' ] 
                    , $box[ 'callback' ] 
                    , $postSlug 
                    , $box[ 'context' ] 
                    , $box[ 'priority' ] 
                    , $box[ 'args' ] 
                );
				
                if( isset( $box[ 'onSave' ] ) ) {
                    add_action( 'save_post', $box[ 'onSave' ], 10, 1 );
                }
            }
        }
    }
}

add_action( 'admin_init', array( 'mythemes_plg_box' , "run" ) );

} /* END IF CLASS EXISTS */
?>