<?php

if( !class_exists( 'mythemes_plg_presentation' ) ){

class mythemes_plg_presentation
{    
    static function manager( $post = null )
    {
        $layouts_       = mythemes_plg_core::getLayouts();
        $layouts_val_   = array();

        foreach( $layouts_ as $index => $l ){
            $layouts_val_[ $index ] = $l[ 'title' ]; 
        }

        $layouts        = json_encode( mythemes_plg_core::getLayouts() );
        $layouts_val    = json_encode( $layouts_val_ );

        $layout         = mythemes_plg_meta::def( $post -> ID, 'custom-layout', 'layout', mythemes_plg_settings::val( 'layout' ) );
        $width          = mythemes_plg_meta::val( $post -> ID, 'custom-width', 'width', mythemes_plg_settings::val( 'width' ) );
        
        $tooltips       = json_encode( (array)mythemes_plg_meta::val( $post -> ID, 'tooltips' ) );
        
    ?>
        <div id="mythemes-plg-tooltips"></div>
        <script>
            
            mythemes_plg_bk_presentation({
                presentation :{
                    container   : '#mythemes-plg-tooltips',
                    tooltip_slug: 'mythemes-plg-tooltips',
                    layout      : '<?php echo $layout; ?>',
                    width       : '<?php echo $width; ?>'
                },
                layouts_val  : <?php echo $layouts_val; ?>, 
                layouts  : <?php echo $layouts; ?>, 
            } , <?php echo $tooltips; ?>);
            
        </script>
        <br>
        <button type="button" class="button button-primary button-large" onclick="javascript:_mythemes_plg_bk_add_tooltip({});"><?php _e( 'Add New Tooltip' , 'myThemes' ); ?></button>
    <?php
    }
    
    static function save( $post_id = null )
    {
        if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
            return;
        
        if( !isset( $_POST[ 'mythemes-plg-tooltips' ] ) )
            return;
        
        $present = get_post( $post_id );
        
        if( !isset( $present -> ID ) || $present -> post_type !== 'presentation' )
            return;
        
        $values = array();
        
        if( !empty( $_POST[ 'mythemes-plg-tooltips' ] ) ){
            foreach( $_POST[ 'mythemes-plg-tooltips' ] as $key => &$d ){
                $values[] = $d;
            }
        }
        
        mythemes_plg_meta::set( $post_id, 'tooltips', $values );
    }
    static function attach( $post = null )
    {
        $custom_posts[ 'url' ]  = __( 'URL' , 'myThemes' );
        
        $res_types = array(
            'post'  => __( 'Post' , 'myThemes' ),
            'page'  => __( 'Page' , 'myThemes' ),
            'url'   => __( 'URL' , 'myThemes' )
        );
        
        $res_type = mythemes_plg_meta::val( $post -> ID , 'res_type' , 'post' );
        
        
        echo mythemes_plg_ahtml::field( array(
            'type' => array(
                'field' => 'inline',
                'input' => 'select'
            ),
            'values' => $res_types,
            'label' => __( 'Resource Type' , 'myThemes' ),
            'slug' => 'res_type',
            'value' => $res_type,
            'ajax' => "mythemes_plg_resources( this.value );"
        ) );
        
        echo '<div class="mythemes-plg-resource"></div>';
    }
    static function attach_save( $post_id = null )
    {
        if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
            return;
        
        if( isset( $_POST[ 'mythemes-plg-res_type' ] ) ){
            $relations  = (array)mythemes_plg_settings::val( 'relations' );
            
            $new_type   = $_POST[ 'mythemes-plg-res_type' ];
            $old_type   = mythemes_plg_meta::val( $post_id, 'res_type' );
            
            /* SET NEW TYPE */
            mythemes_plg_meta::set( $post_id, 'res_type' , $new_type );
            
            /* DELETE POST META presentations / single type FROM RESOURCE */
            $old = mythemes_plg_meta::val( $post_id, $old_type );
            
            if( isset( $relations[ $old_type ] ) ){
                unset( $relations[ $old_type ] );
            }
            if( (int) $old ){
                mythemes_plg_meta::set( (int)$old , 'presentations' , null );
            }
            mythemes_plg_meta::set( $post_id, $old_type , null );
            if( isset( $relations[ esc_url( $old ) ] ) ){
                unset( $relations[ esc_url( $old ) ] );
            }
            
            if( $new_type !== 'url' ){
                if( isset( $_POST[ 'mythemes-plg-' . $new_type ] ) ){
                    $new = $_POST[ 'mythemes-plg-' . $new_type ];
                    mythemes_plg_meta::set( $post_id, $new_type , $new );
                    if( (int)$new ){
                        /* SET POST META presentations */
                        mythemes_plg_meta::set( $new , 'presentations' , $post_id );
                    }
                    if( $new == 'all' ){
                        $relations[ $new_type ] = $post_id;
                    }
                }
            }
            else{
                if( isset( $_POST[ 'mythemes-plg-' . $new_type ] ) ){
                    $new_url = esc_url( $_POST[ 'mythemes-plg-' . $new_type ] );
                    
                    if( !empty( $new_url ) ){
                        mythemes_plg_meta::set( $post_id, $new_type , $new_url );
                        
                        /* SET POST META presentations */
                        $relations[ $new_url ] = $post_id;
                    }
                }
            }

            mythemes_plg_settings::set( 'mythemes-plg-relations' , $relations );
        }
    }
    
    static function settings( $post = null )
    {
        $general_cnt = mythemes_plg_ahtml::field( array(
            'type' => array(
                'field' => 'inline',
                'input' => 'logic'
            ),
            'label' => __( 'Autorun' , 'myThemes' ),
            'slug' => 'autorun',
            'value' => (int)mythemes_plg_meta::val( $post -> ID, 'autorun' ),
            'hint' => __( 'will be displayed first tooltip from presentation.' , 'myThemes' )
        ) );
        
        $overwrite_storage = (int)mythemes_plg_meta::val( $post -> ID, 'overwrite-storage' );
        $cl_overwrite_storage = 'mythemes-overwrite-storage hidden';
        
        if( $overwrite_storage )
            $cl_overwrite_storage = 'mythemes-overwrite-storage';
        
        $general_cnt .= mythemes_plg_ahtml::field( array(
            'type' => array(
                'field' => 'inline',
                'input' => 'logic'
            ),
            'label' => __( 'Overwrite Storage Settings' , 'myThemes' ),
            'slug' => 'overwrite-storage',
            'value' => $overwrite_storage,
            'hint' => __( 'overwrite general storage settings for this presentation.' , 'myThemes' ),
            'action' => "{ show : [ '.mythemes-overwrite-storage' ] }"
        ) );
        
        $use_storage = (int)mythemes_plg_meta::val( $post -> ID , 'use-storage' , (int)mythemes_plg_settings::val( 'use-storage' ) );
        $cl_use_storage = $cl_overwrite_storage . ' mythemes-use-storage hidden';
        
        if( $use_storage )
            $cl_use_storage = $cl_overwrite_storage . ' mythemes-use-storage';
        
        $general_cnt .= mythemes_plg_ahtml::field( array(
            'type' => array(
                'field' => 'inline',
                'input' => 'logic'
            ),
            'fieldClass' => $cl_overwrite_storage,
            'label' => __( 'Use Storage' , 'myThemes' ),
            'slug' => 'use-storage',
            'value' => $use_storage,
            'action' => "{ show : [ '.mythemes-use-storage' ] }"
        ) );
        /* END GENERAL */
        
        $custom_cnt = '';
        $layouts = mythemes_plg_core::getLayouts();
        
        $l = array();
        foreach( $layouts as $d ){
            $l[ $d[ 'id' ] ] = $d[ 'title' ];
        }
        
        /* LAYOUT */
        if( empty( $l ) ){
            $custom_cnt .= '<p><span style="color: #990000">' . __( 'There are no layouts. To create a new layout see section "Layout Builder"' , 'myThemes' ) . '</span></p><br>';
        }
        else{
            
            $custom = (int)mythemes_plg_meta::val( $post -> ID, 'custom-layout' );
            
            if( $custom ){
                $classes = 'mythemes-plg-layouts-list';
            }
            else{
                $classes = 'mythemes-plg-layouts-list hidden';
            }
            
            $custom_cnt .= mythemes_plg_ahtml::field( array(
                'type' => array(
                    'field' => 'inline',
                    'input' => 'logic'
                ),
                'label' => __( 'Custom Layout' , 'myThemes' ),
                'slug' => 'custom-layout',
                'action' => "{ show : [ '.mythemes-plg-layouts-list' ] }",
                'value' => $custom,
                'hint' => __( 'if you want to use custom layuout for tooltips' , 'myThemes' )
            ) );
            
            $custom_cnt .= mythemes_plg_ahtml::field( array(
                'type' => array(
                    'field' => 'inline',
                    'input' => 'select'
                ),
                'values' => $l,
                'label' => __( 'Layout' , 'myThemes' ),
                'fieldClass' => $classes,
                'slug' => 'layout',
                'value' => mythemes_plg_meta::val( $post -> ID, 'layout' , mythemes_plg_settings::val( 'layout' ) )
            ) );
        }
        
        
        /* WIDTH */
        $custom = (int)mythemes_plg_meta::val( $post -> ID, 'custom-width' );
            
        if( $custom ){
            $classes = 'mythemes-plg-tooltip-width';
        }
        else{
            $classes = 'mythemes-plg-tooltip-width hidden';
        }

        $custom_cnt .= mythemes_plg_ahtml::field( array(
            'type' => array(
                'field' => 'inline',
                'input' => 'logic'
            ),
            'label' => __( 'Custom Width' , 'myThemes' ),
            'slug' => 'custom-width',
            'action' => "{ show : [ '.mythemes-plg-tooltip-width' ] }",
            'value' => $custom,
            'hint' => __( 'if you want to use custom width for tooltips' , 'myThemes' )
        ) );
            
        $custom_cnt .= mythemes_plg_ahtml::field( array(
            'type' => array(
                'field' => 'inline',
                'input' => 'text'
            ),
            'label' => __( 'Width' , 'myThemes' ),
            'slug' => 'width',
            'fieldClass' => $classes,
            'value' => mythemes_plg_meta::val( $post -> ID, 'width', (int)mythemes_plg_settings::val( 'width' )  ),
        ) );
        
        /* END CUSTOM */
        
        $code_cnt = mythemes_plg_ahtml::field( array(
            'type' => array(
                'field' => 'inlist',
                'input' => 'textarea'
            ),
            'label' => __( 'On Load Page JavaScript Code' , 'myThemes' ),
            'slug' => 'on-load-page',
            'value' => mythemes_plg_meta::val( $post -> ID, 'on-load-page' ),
            'hint' => __( 'Here put your additional JavaScript code what will be runed on load page.' , 'myThemes' )
        ) );
        
        $code_cnt .= mythemes_plg_ahtml::field( array(
            'type' => array(
                'field' => 'inlist',
                'input' => 'textarea'
            ),
            'label' => __( 'On Start JavaScript Code' , 'myThemes' ),
            'slug' => 'on-start',
            'value' => mythemes_plg_meta::val( $post -> ID, 'on-start' ),
            'hint' => __( 'Here put your additional JavaScript code what will be runed on start presentation.' , 'myThemes' )
        ) );
        
        echo mythemes_plg_ahtml::tabber( array(
            array(
                'current' => true,
                'title' => __( 'General' , 'myThemes' ),
                'content' => $general_cnt
            ),
            array(
                'title' => __( 'Custom' , 'myThemes' ),
                'content' => $custom_cnt
            ),
            array(
                'title' => __( 'JavaScript' , 'myThemes' ),
                'content' => $code_cnt
            ),
        ) );
    }
    
    static function settings_save( $post_id = null )
    {
        if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
            return;
            
        if( isset( $_POST[ 'mythemes-plg-custom-layout' ] ) ){
            mythemes_plg_meta::set( $post_id, 'custom-layout' , $_POST[ 'mythemes-plg-custom-layout' ] );
        
            if( isset( $_POST[ 'mythemes-plg-layout' ] ) )
                mythemes_plg_meta::set( $post_id, 'layout' , $_POST[ 'mythemes-plg-layout' ] );
        }else{
            mythemes_plg_meta::set( $post_id, 'custom-layout' , null );
            mythemes_plg_meta::set( $post_id, 'layout' , null );
        }
        
        if( isset( $_POST[ 'mythemes-plg-custom-width' ] ) ){
            mythemes_plg_meta::set( $post_id, 'custom-width' , $_POST[ 'mythemes-plg-custom-width' ] );
        
            if( isset( $_POST[ 'mythemes-plg-width' ] ) )
                mythemes_plg_meta::set( $post_id, 'width' , (int)$_POST[ 'mythemes-plg-width' ] );
        }
        else{
            mythemes_plg_meta::set( $post_id, 'custom-width' , null );
            mythemes_plg_meta::set( $post_id, 'width' , null );
        }
        
        if( isset( $_POST[ 'mythemes-plg-autorun' ] ) ){
            mythemes_plg_meta::set( $post_id, 'autorun' , $_POST[ 'mythemes-plg-autorun' ] );
        }
        else{
            $val = mythemes_plg_meta::val( $post_id, 'autorun' );
            
            if( is_null( $val ) ){
                mythemes_plg_meta::set( $post_id, 'autorun' , (int)  mythemes_plg_settings::val( 'autorun' ) );
            }
            else{
                mythemes_plg_meta::set( $post_id, 'autorun' , 0 );
            }
        }
        
        if( isset( $_POST[ 'mythemes-plg-on-load-page' ] ) ){
            mythemes_plg_meta::set( $post_id, 'on-load-page' , $_POST[ 'mythemes-plg-on-load-page' ] );
        }
        
        if( isset( $_POST[ 'mythemes-plg-on-start' ] ) ){
            mythemes_plg_meta::set( $post_id, 'on-start' , $_POST[ 'mythemes-plg-on-start' ] );
        }
        
        if( isset( $_POST[ 'mythemes-plg-overwrite-storage' ] ) ){
            mythemes_plg_meta::set( $post_id, 'overwrite-storage' , (int)$_POST[ 'mythemes-plg-overwrite-storage' ] );
            
            /* USE COOKIE */
            if( isset( $_POST[ 'mythemes-plg-use-storage' ] ) ){
                mythemes_plg_meta::set( $post_id, 'use-storage' , (int)$_POST[ 'mythemes-plg-use-storage' ] );
            }
            else{
                $use_cookie = mythemes_plg_meta::val( $post_id, 'use-storage' );
                
                if( is_null( $use_cookie ) ){
                    mythemes_plg_meta::set( $post_id, 'use-storage' , (int)  mythemes_plg_settings::val( 'use-storage' ) );
                }
                else{
                    mythemes_plg_meta::set( $post_id, 'use-storage' , 0 );
                }
            }
        }
        else{
            mythemes_plg_meta::set( $post_id, 'overwrite-storage' , 0 );
            mythemes_plg_meta::set( $post_id, 'use-storage' , (int)  mythemes_plg_settings::val( 'use-storage' ) );
        }
    }
}

} /* END IF CLASS EXISTS */
?>