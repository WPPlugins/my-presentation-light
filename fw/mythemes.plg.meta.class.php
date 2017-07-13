<?php

if( !class_exists( 'mythemes_plg_meta' ) ){

class mythemes_plg_meta
{
    static function def( $post_id, $metakey1, $metakey2 , $default = null )
    {
        $rett = null;
        
        if( self::val( $post_id , $metakey1 ) == 1 ){
            $rett = self::val( $post_id , $metakey2 ,  $default );
        }
        
        return $rett;
    }
    static function val( $post_id, $metakey, $default = null )
    {
        $metakey = 'mythemes-plg-' . $metakey;
        
        $rett = get_post_meta( $post_id , $metakey , true );
        
        if( $rett == null )
            $rett = $default;
        
        return $rett;
    }
    
    static function get( $post_id, $metakey, $default = null )
    {
        $rett = get_post_meta( $post_id , $metakey , true );
        
        if( $rett == null )
            $rett = $default;
        
        return $rett;
    }
    
    static function set( $post_id, $metakey, $value )
    {
        $metakey = 'mythemes-plg-' . $metakey;
        return update_post_meta( $post_id , $metakey , $value );
        
        
    }
}

} /* END IF CLASS EXISTS */
?>