<?php

if( !class_exists( 'mythemes_plg_deb' ) ){

class mythemes_plg_deb
{
    static function e( $data, $backtrace = 0 )
    {
        print '<pre style="margin:10px; border:1px dashed #999999; padding:10px; color:#333; background:#ffffff;">';
        $bt = debug_backtrace();
        $caller = $bt[ 0 ];
        print "[ File : " . self::short( $caller[ 'file' ] ) . " ][ Line : " . $caller[ 'line' ] . " ]\n";
        print "--------------------------------------------------------------\n";
        print_r( $data );
        print "</pre>";
    }

    static function dump()
    {

    }
    
    static function post()
    {
        
    }
    
    static function get()
    {
        
    }
    
    static function server()
    {
        
    }
    
    static function short( $str )
    {
        $theme = wp_get_theme();
        $str = $theme[ 'Name' ] . ':' . str_replace( str_replace( '/' , '\\' , get_template_directory() ) , '' , $str );
         
        return $str;
    }
}

} /* END IF CLASS EXISTS */
?>