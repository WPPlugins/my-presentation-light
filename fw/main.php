<?php
    include_once 'mythemes.plg.deb.class.php';
    
    include_once 'mythemes.plg.core.class.php';

    include_once 'mythemes.plg.ahtml.class.php';

    include_once 'mythemes.plg.settings.class.php';
    include_once 'mythemes.plg.meta.class.php';
    
    include_once 'resources/mythemes.plg.post.class.php';
    include_once 'resources/mythemes.plg.taxonomy.class.php';
    include_once 'resources/mythemes.plg.box.class.php';
    
    include_once 'mythemes.plg.presentation.class.php';
    
    include_once 'mythemes.plg.frontend.class.php';
    
    if( !function_exists( 'mythemes_plg_resources' ) ){
        function mythemes_plg_resources( $type )
        {
            $type       = isset( $_POST[ 'type' ] ) && !empty( $_POST[ 'type' ] ) ? $_POST[ 'type' ] : exit;
            $post_id    = isset( $_POST[ 'post_id' ] ) && (int)$_POST[ 'post_id' ] ? (int)$_POST[ 'post_id' ] : exit;
            
            if( $type !== 'url' ){
                
                $query = new WP_Query( array(
                    'post_type' => $type,
                    'posts_per_page' => 40,
                    'orderby' => 'modified',
                    'order' => 'DESC'
                ) );
            
                $rett = array( '- Not found -' , 'myThemes' );
            
                if( count( $query -> posts ) ){
                    $rett = array( );
                    foreach( $query -> posts as $p ){
                        $title = $p -> post_title;
                        if( empty( $title ) )
                            $title = __( '- Untitled -' , 'myThemes' );

                        $rett[ $p -> ID ] = $title;
                    }
                }
                

                echo mythemes_plg_ahtml::field( array(
                    'type' => array(
                        'field' => 'inline',
                        'input' => 'select'
                    ),
                    'values' => $rett,
                    'label' => __( 'Latest ' , 'myThemes' ) . $type,
                    'slug' => $type,
                    'value' => mythemes_plg_meta::val( $post_id , $type )
                ) );
            }
            else{
                if( $type == 'url' ){
                    echo mythemes_plg_ahtml::field( array(
                        'type' => array(
                            'field' => 'inline',
                            'input' => 'text'
                        ),
                        'label' => __( 'URL' , 'myThemes' ),
                        'slug' => 'url',
                        'value' => mythemes_plg_meta::val( $post_id , 'url' )
                    ) );
                }
            }
            
            echo attached_message( mythemes_plg_meta::val( $post_id , $type ) );
            
            exit();
        }
        
        add_action( 'wp_ajax_mythemes_plg_resources' , 'mythemes_plg_resources' );
    }

    if( !function_exists( 'mythemes_plg_url' ) ){
        function mythemes_plg_url()
        {
            $post_id    = isset( $_POST[ 'post_id' ] ) && (int)$_POST[ 'post_id' ] ? (int)$_POST[ 'post_id' ] : exit;

            $url = get_permalink( $post_id );

            if( !empty( $url ) ){
                echo $url;
            }
            else{
                echo home_url();
            }

            exit();
        }

        add_action( 'wp_ajax_mythemes_plg_url' , 'mythemes_plg_url' );
    }
    
    if( !function_exists( 'mythemes_plg_contact' ) ){
        function mythemes_plg_contact( )
        {
            if( is_user_logged_in() ){
                /* USER INFO */
                $user = get_userdata( get_current_user_id() );

                /* USER NAME */
                if( strlen( $user -> first_name . $user -> last_name ) ){
                    $user_name = trim( $user -> first_name . ' ' . $user -> last_name );
                }
                else{
                    $user_name = trim( $user -> user_login );
                }

                $data = get_plugin_data( MYTHEMES_PLG_DIR  . '/my-presentation.php' );

                $rett  = '<h3 class="title">' . __( 'Direct Contact' , 'myThemes' ) . '</h3>';
                
                $rett .= '<iframe src="http://contact.mythem.es/' . str_replace( ' ' , '-' , strtolower( trim( $data[ 'Name' ] ) ) ) . '?';
                $rett .= 'user=' . urlencode( $user_name ) . '&';
                $rett .= 'email=' . urlencode( trim( $user -> user_email ) ) . '&';
                $rett .= 'ver=' . trim( $data[ 'Version' ] ) . '&';
                $rett .= 'url=' . urlencode( home_url() ) . '" ';
                $rett .= 'width="100%" height="800" scrolling="no" frameborder="0"></iframe>';

                return $rett;
            }
        }
    }
    
    if( !function_exists( 'attached_message' ) ){
        function attached_message( $res )
        {

            $message = '';
            
            $regex = "((https?|ftp)\:\/\/)?"; // SCHEME 
            $regex .= "([a-z0-9+!*(),;?&=\$_.-]+(\:[a-z0-9+!*(),;?&=\$_.-]+)?@)?"; // User and Pass 
            $regex .= "([a-z0-9-.]*)\.([a-z]{2,3})"; // Host or IP 
            $regex .= "(\:[0-9]{2,5})?"; // Port 
            $regex .= "(\/([a-z0-9+\$_-]\.?)+)*\/?"; // Path 
            $regex .= "(\?[a-z+&\$_.-][a-z0-9;:@&%=+\/\$_.-]*)?"; // GET Query 
            $regex .= "(#[a-z_.-][a-z0-9+\$_.-]*)?"; // Anchor 

            $url = null;
            if( preg_match("/^$regex$/", $res ) ) 
                $url = esc_url( $res );
            
            if( !empty( $res ) ){
                $message .= '<div class="mythemes-plg-message">';
                $message .= '<p class="">' . __( 'This presentation is attached to' , 'myThemes' ) . ' : ';
                
                if( (int)$res ){
                    $p = get_post( $res );
                    if( isset( $p -> ID ) ){
                        $message .= '<strong>' . $p -> post_title . '</strong>';
                        $message .= '<span style="float: right;">';
                        ob_start();
                            edit_post_link(  __( 'Edit' , 'myThemes' ) , ' ' , '' , $p -> ID );
                        $message .= ob_get_clean();
                        $message .= ' | ';
                        $message .= '<a href="' . get_permalink( $p -> ID ) . '" target="_blank">' . __( 'Preview' , 'myTemes' ) . '</a>';
                        $message .= '</span>';
                    }
                }elseif( !empty( $url ) ){
                    $message .= '<a href="' . $url . '">' . $url . '</a>';
                }else{
                    $message .= '<strong>' . $res . '</strong>';
                }
                
                $message .= '</p>';
                $message .= '</div>';
            }
            
            return $message;
        }
    }

    if( !function_exists( 'mythemes_plg_action_links' ) ){
        add_filter( 'plugin_action_links_' . MYTHEMES_PLG_NAME , 'mythemes_plg_action_links' );

        function mythemes_plg_action_links( $links ){
            return array_merge( array(
                '<a href="' . admin_url( 'admin.php?page=mythemes-plg-general' ) . '">' . __( 'Settings', 'myThemes' ) . '</a>',
                //'<a href="">' . __( 'Docs', 'myThemes' ) . '</a>',
                '<a href="http://mythem.es/forums/topic/my-presentation-light/">' . __( 'Support', 'myThemes' ) . '</a>'
            ), $links );
        }
    }
?>