<?php

if( !class_exists( 'mythemes_plg_settings' ) ){
    
class mythemes_plg_settings
{

    static function set( $option, $value, $validator = null )
    {
        if( !empty( $validator ) ){
            $valid = mythemes_plg_ahtml::validator( $value , $validator );
        }
        else{
            $valid = $value;
        }
        update_option( $option , $valid );
    }
    
    static function get( $option , $strip = false )
    {
        if( $strip )
            return stripcslashes ( get_option( $option , self::deff( $option ) ) );
        else
            return get_option( $option , self::deff( $option ) );
    }
    
    static function val( $optionSlug , $strip = false )
    {
        $option = 'mythemes-plg-' . $optionSlug;
        
        if( $strip )
            return stripcslashes ( get_option( $option , self::deff( $option ) ) );
        else
            return get_option( $option , self::deff( $option ) );
    }
    
    static function deff( $option )
    {   
        if( isset( mythemes_plg_cfg::$deff[ 'settings' ][ $option ] ) ){
            return mythemes_plg_cfg::$deff[ 'settings' ][ $option ];
        }else{
            return null;
        }
    }

    static function register( )
    {
        $pages = & mythemes_plg_cfg::$pages;
        
        foreach( $pages as $pageSlug => & $sett ){
            $file = MYTHEMES_PLG_DIR . '/cfg/settings/' . str_replace( 'mythemes-plg-' , '' , $pageSlug ) . '.settings.php';

            if( file_exists( $file ) ){
                include_once $file;
            }
          
            foreach( $sett as $slug => & $d ){
                register_setting( $pageSlug , 'mythemes-plg-' . $slug , array( 'mythemes_plg_ahtml' , mythemes_plg_ahtml::getValidatorType( $d  ) ) );
            }
        }
    }
    
    static function pageHeader( $pageSlug )
    {
        echo '<div class="mytheme-admin-header">';
        echo '<span class="theme">Plugin <strong>' . mythemes_plg_core::name() . '</strong> - ' . __( 'version' , 'myThemes' ) . ': ' . mythemes_plg_core::version() . '</span>';
        echo '<a href="http://mythem.es" target="_blank" title="Affordable WordPress Themes For Your Website or Blog"><img src="' . MYTHEMES_PLG_LOGO . '" /></a>';
        echo '<p><a href="http://mythem.es" target="_blank" title="Affordable WordPress Themes For Your Website or Blog">Affordable WordPress Themes For Your Website or Blog</a></p>';
        echo '</div>';

        echo '<table class="admin-body">';
        echo '<tr>';
        echo '<td class="admin-menu">';
        echo '<ul>';

        $current_title = '';

        foreach( mythemes_plg_cfg::$pages as $slug => &$d ) {
            
            $title = $d[ 'menu' ][ 'label' ];
            $class = '';

            if( $slug == $pageSlug ) {	
                $class = 'current';
                $subClass = $slug;
                $current_title = $title;
            }
            else{
                $subClass = $slug . ' hidden';
            }

            echo '<li class="' . $class . '">';

            if( isset( $d[ 'subpages' ] ) ){

                echo '<a href="javascript:(function(){jQuery( \'ul.' . $slug . '\' ).toggle( \'slow\' ); })()">' . $title . '</a>';
                echo '<ul class="' . $subClass . '">';
                foreach( $d[ 'subpages' ] as $subpage => & $s ){
                    echo '<li><a href="?page=' . $slug . '&subpage=' . $subpage . '">' . $s[ 'menu' ][ 'label' ] . '</a></li>';
                }
                echo '</ul>';
            }else{
                echo '<a href="?page=' . $slug . '">' . $title . '</a>';
            }

            echo '</li>';
        }

        echo '</ul>';
        echo '</td>';
    }
    
    static function pageContent( $pageSlug )
    {   
        $cfgs = & mythemes_plg_cfg::$pages[ $pageSlug ];
        
        $file = MYTHEMES_PLG_DIR . '/cfg/settings/' . str_replace( 'mythemes-plg-' , '' , $pageSlug ) . '.settings.php';
       
        if( file_exists( $file ) ){
            include_once $file;
        }
        
        $options = $cfgs[ 'content' ];
        
        echo '<td class="admin-content">';
        echo '<div class="title">';
				
        if( isset( $cfgs[ 'title' ] ) )
            echo '<h2>' . $cfgs[ 'title' ] . '</h2>';

        if( isset( $cfgs[ 'description' ] ) )
            echo '<p>' . $cfgs[ 'description' ] . '</p>';

        echo '</div>';
			
        /* SUBMIT FORM */
        if( !isset( $cfgs[ 'update' ] ) || ( isset( $cfgs[ 'update' ] ) && $cfgs['update'] ) ){
            echo '<form method="post" action="options.php">';
            wp_nonce_field( 'update-options' );
        }
			
        settings_fields( $pageSlug );
        
        if( !empty( $options ) ) {
            foreach( $options  as $inputSlug => $sett ) {
                $sett[ 'slug' ]     = $inputSlug;
                $sett[ 'value' ]    = mythemes_plg_settings::val( $inputSlug );
                echo mythemes_plg_ahtml::field( $sett );
            }
        }
			
        if( !isset( $cfgs[ 'update' ] ) || ( isset( $cfgs[ 'update' ] ) && $cfgs['update'] ) ){
            echo '<div class="standart-generic-field submit top_delimiter">';
            echo '<div class="field">';
            echo '<input type="submit" class="button button-primary my-submit button-hero" value="' . __( 'Update Settings' , "myThemes" ) . '"/>';
            echo '</div>';
            echo '</div>';
            echo '</form>';
        }
            
        echo '</td>';
        echo '<td class="mythemes-credits">';
        echo '<div class="title">';
        echo '<h3>myThem.es Links</h3>';
        echo '</div>';
        echo '<ul style="margin-top: -5px;">';
        //echo '<li><a target="_blank" href="http://mythem.es/" title="myThem.es - HTML5, CSS3, creative design and premium WordPress themes">Home Page</a></li>';
        echo '<li><a target="_blank" href="http://test.mythem.es/my-presentation-light/" title="My Presentation Light Free WordPress Plugin details">Plugin Details</a></li>';
        echo '<li><a target="_blank" href="http://mythem.es/forums/topic/my-presentation-light/" title="My Presentation Light support Forum">Plugin Support</a></li>';
        echo '</ul>';
        echo '<ul class="with-border">';
        echo '<li><a target="_blank" href="http://facebook.com/myThemes" title="Follow myThem.es on Facebook">Follow us on Facebook</a></li>';
        echo '<li><a target="_blank" href="http://twitter.com/my_themes" title="Follow myThem.es on Twitter">Follow us on Twitter</a></li>';
        echo '</ul>';
        echo '</td>';
        echo '</tr>';
        echo '</table>';
    }
    
    static function pageMenu()
    {
        $parent = '';
        $pageCB = array( 'mythemes_plg_settings', 'displayPage' );
        foreach( mythemes_plg_cfg::$pages as $slug => &$d ) {	
            if( isset( $d[ 'menu' ] ) ) {
                $m = $d[ 'menu' ];
                if( strlen( $parent ) == 0 ) {
                    add_menu_page(
                        $m[ 'label' ]                                           /* page_title   */
                        , $m[ 'parent' ]                                        /* menu_title   */
                        , 'administrator'                                       /* capability   */
                        , $slug                                                 /* menu_slug    */
                        , $pageCB                                               /* function     */
                        , $m[ 'ico' ]                                           /* icon_url     */
                    );
                    $parent = $slug;
                }
                else {
                    add_submenu_page(
                        $parent    
                        , $m[ 'label' ]                                         /* page_title   */
                        , $m[ 'label' ]                                         /* menu_title   */
                        , 'administrator'                                       /* capability   */
                        , $slug                                                 /* menu_slug    */
                        , $pageCB                                               /* function     */
                    );
                }
            }
        }
    }

    static function displayPage()
    {   
        if( !isset( $_GET ) || !isset( $_GET[ 'page' ] ) ){
            wp_die( 'Invalid page name', 'myThemes' );
            return;
        }

        $pageSlug = $_GET[ 'page' ];

        /* NOTIFICATION */
        if( isset( $_GET[ 'settings-updated' ] ) && $_GET[ 'settings-updated' ] == 'true' ){
            echo '<div class="updated settings-error myThemes" id="setting-error-settings_updated">';
            echo '<p>' . __( 'options has been updated successfully' , 'myThemes' ) . '</p>';
            echo '</div>';
        }

        echo '<div class="admin-page">';
        echo self::pageHeader( $pageSlug );
        self::pageContent( $pageSlug );
        echo '</div>';
    }
}

add_action( 'admin_init', array( 'mythemes_plg_settings' , 'register' ) );
add_action( 'admin_menu' , array( 'mythemes_plg_settings', 'pageMenu' ) );

} /* END IF CLASS EXISTS */
?>