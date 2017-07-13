<?php

//mythemes_plg_deb::e( $_POST );
//exit();

if( !class_exists( 'mythemes_plg_main' ) ){
    
class mythemes_plg_main
{
    static function register_settings( )
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
        echo '<span class="theme"><strong>' . self::name() . '</strong> - ' . __( 'version' , 'myThemes' ) . ': ' . self::version() . '</span>';
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
        echo '</tr>';
        echo '</table>';
    }
    
    static function echoPage()
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
    
    static function pageMenu()
    {
        $parent = '';
        $pageCB = array( 'mythemes_plg_main', 'echoPage' );
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
    
    static function media()
    {
        /* CSS */
        if( is_admin() ){
            wp_register_style( 'mythemes-plg-admin' ,  MYTHEMES_PLG_URL . '/media/admin/css/admin.css' );
            wp_register_style( 'mythemes-plg-ahtml' ,  MYTHEMES_PLG_URL . '/media/admin/css/ahtml.css' );
            wp_register_style( 'mythemes-plg-box' ,  MYTHEMES_PLG_URL . '/media/admin/css/box.css' );
            wp_register_style( 'mythemes-plg-inline' ,  MYTHEMES_PLG_URL . '/media/admin/css/inline.css' );
            wp_register_style( 'mythemes-plg-template' ,  MYTHEMES_PLG_URL . '/media/admin/css/template.css' );
            
            wp_register_style( 'mythemes-plg-atooltip' ,  MYTHEMES_PLG_URL . '/media/admin/css/tooltip.css' );
            wp_register_style( 'mythemes-plg-tooltips' ,  MYTHEMES_PLG_URL . '/media/css/tooltips.css' );

            wp_enqueue_style( 'mythemes-plg-admin' );
            wp_enqueue_style( 'mythemes-plg-ahtml' );
            wp_enqueue_style( 'mythemes-plg-box' );
            wp_enqueue_style( 'mythemes-plg-inline' );
            wp_enqueue_style( 'mythemes-plg-template' );
            
            wp_enqueue_style( 'mythemes-plg-atooltip' );
            wp_enqueue_style( 'mythemes-plg-tooltips' );

            /* JavaScript */
            wp_register_script( 'mythemes-plg-tooltip' ,  MYTHEMES_PLG_URL . '/media/admin/js/tooltip.js' , array( 'jquery' , 'jquery-ui-sortable' ) );
            wp_register_script( 'mythemes-plg-layout' ,  MYTHEMES_PLG_URL . '/media/admin/js/layout.js' );
            wp_register_script( 'mythemes-plg-ahtml' ,  MYTHEMES_PLG_URL . '/media/admin/js/ahtml.js' );
            wp_register_script( 'mythemes-plg-functions' ,  MYTHEMES_PLG_URL . '/media/admin/js/functions.js' );

            wp_enqueue_script( 'mythemes-plg-resource' );
            wp_enqueue_script( 'mythemes-plg-tooltip' );
            wp_enqueue_script( 'mythemes-plg-layout' );
            wp_enqueue_script( 'mythemes-plg-ahtml' );
            
            wp_enqueue_style( 'farbtastic' );
            
            wp_register_script( 'my-farbtastic' , admin_url( '/js/farbtastic.js' ) );                
            wp_enqueue_script( 'my-farbtastic' );
            
            wp_enqueue_script( 'mythemes-plg-functions' );
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

add_action( 'init' , array( 'mythemes_plg_main' , 'media' ) );
add_action( 'admin_init', array( 'mythemes_plg_main' , 'register_settings' ) );
add_action( 'admin_menu' , array( 'mythemes_plg_main', 'pageMenu' ) );

} /* END IF CLASS EXISTS */
?>