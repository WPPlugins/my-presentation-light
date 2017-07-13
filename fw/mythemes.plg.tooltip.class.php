<?php
if( !class_exists( 'mythemes_plg_frontend' ) ){
    
class mythemes_plg_tooltip
{
    static $slug    = 'mythemes-plg-tooltip';
    static $current = 0;
    static $total;
    static $styles;
    
    
    static function color( $hex , $lum )
    {
        if( $hex[ 0 ] == '#' ){
            $hex = substr( $hex , 1 );
        }
    
        if( strlen( $hex ) < 6 ){
            $hex = $hex[ 0 ] . $hex[ 0 ] . $hex[ 1 ] . $hex[ 1 ] . $hex[ 2 ] . $hex[ 2 ];
        }
    
        /* CONVERT TO DECIMAL AND CHANGE LUMINOSITY */
        $rgb = "#";
        $c = 0;
        
        for ( $i = 0; $i < 3; $i++) {
            $c = hexdec( substr( $hex , $i*2 , 2 ) );
            $c = dechex( round( min( max( 0, $c + ( $c * $lum ) ) , 255 ) ) );
            $rgb .= substr ( "00" . $c , strlen( $c ) );
        }
        return $rgb;
    }
    
    static function style( $layout )
    {
        self::$styles = array();
        
        if( isset( self::$styles[ $layout[ 'id' ] ] ) )
            return;

        $colors = array();
        $colors[ 0 ] = self::color( $layout[ 'color' ] , -1 * $layout[ 'contrast' ]  );
        $colors[ 1 ] = self::color( $layout[ 'color' ] , $layout[ 'contrast' ] );

        $border = 'border: 1px solid ' . $colors[ 0 ] . ';';

        if( isset( $layout[ 'template' ] ) && $layout[ 'template' ] == 'dark' ){
            $border = '';
        }

        $rett = $border .
                'background-color: ' . $layout[ 'color'  ] . ';' .
                '-webkit-box-shadow: inset 0 1px 0 ' . $colors[ 1 ] . ';' .
                'box-shadow: inset 0 1px 0 ' . $colors[ 1 ] . ';';

        if( isset( $layout[ 'template' ] ) && ( $layout[ 'template' ] == 'flat dark' || $layout[ 'template' ] == 'flat' ) ){
            $rett = 'background-color: ' . $layout[ 'color' ] . ';';
            $rett .= '}';
            $rett .= '.' . self::$slug . '-layout-' . $layout[ 'id' ] . ' .mythemes-plg-footer button.mythemes-plg-prev{';
            $rett .= 'border-right: 1px solid ' . $colors[ 0 ] . ' !important;';
            $rett .= '}';
            $rett .= '.' . self::$slug . '-layout-' . $layout[ 'id' ] . ' .mythemes-plg-footer button.mythemes-plg-next{';
            $rett .= 'border-left: 1px solid ' . $colors[ 1 ] . ' !important;';
        }

        return self::$styles[ $layout[ 'id' ] ] =

        '<style id="' . self::$slug . '-' . $layout[ 'id' ] . '">' .
        '.' . self::$slug . '-layout-' . $layout[ 'id' ] . ' .mythemes-plg-footer button.mythemes-plg-button{' .
        $rett .
        '}' .
        '</style>';
    }
    
    static function filter( $sett )
    {
        /* ARROW SIZE */
        /* LEFT OR RIGHT ARROW */
        $size        = ' width="17" height="20" ';
        $canv_style  = '';    

        if( $sett[ 'arrow' ] == 'top-left' ||
            $sett[ 'arrow' ] == 'top-center' ||
            $sett[ 'arrow' ] == 'top-right' ||
            $sett[ 'arrow' ] == 'bottom-left' ||
            $sett[ 'arrow' ] == 'bottom-center' ||
            $sett[ 'arrow' ] == 'bottom-right' ){

            /* TOP OR BOTTOM ARROW */
            $size = ' width="20" height="17" ';
        }

        /* ARROW STYLE */
        if( $sett[ 'arrow' ] == 'top-center' )
            $canv_style = 'margin: -17px 0px 17px ' . ((int)($sett[ 'width' ] - 20 ) / 2) . 'px;';

        if( $sett[ 'arrow' ] == 'top-right' )
            $canv_style = 'margin: -17px 0px 17px ' . ((int)$sett[ 'width' ] - 50) . 'px;';

        if( $sett[ 'arrow' ] == 'bottom-center' )
            $canv_style = 'margin: 0px 0px 0px ' . ((int)($sett[ 'width' ] - 20 ) / 2) . 'px;';

        if( $sett[ 'arrow' ] == 'bottom-right' )
            $canv_style = 'margin: 0px 0px 0px ' . ((int)$sett[ 'width' ] - 50) . 'px;';

        if( $sett[ 'arrow' ] == 'left-top' )
            $canv_style = 'margin: 30px 0px 0px -17px;';

        if( $sett[ 'arrow' ] == 'right-top' )
            $canv_style = 'margin: 30px 0px 0px ' . $sett[ 'width' ] . 'px;';

        if( $sett[ 'arrow' ] == 'right-middle' || $sett[ 'arrow' ] == 'right-bottom' )
            $canv_style = 'margin-left: ' . $sett[ 'width' ] . 'px;';

        if( $sett[ 'arrow' ] == 'left-middle' || $sett[ 'arrow' ] == 'left-bottom' )
            $canv_style = 'margin: 0px 17px 0px -17px';

        /* ARROW POSITION */
        $sett[ 'canvas' ] = array();
        $sett[ 'canvas' ][ 'top' ] = '<canvas class="' . self::$slug . '-arrow ' . $sett[ 'arrow' ] . '" ' . $size . ' style="' . $canv_style . '"></canvas>';
        $sett[ 'canvas' ][ 'bottom' ]  = '';

        if( $sett[ 'arrow' ] == 'bottom-left' ||
            $sett[ 'arrow' ] == 'bottom-center' ||
            $sett[ 'arrow' ] == 'bottom-right' ){

            $sett[ 'canvas' ][ 'top' ] = '';

            /* BOTTOM ARROW */
            $sett[ 'canvas' ][ 'bottom' ] = '<canvas class="' . self::$slug . '-arrow ' . $sett[ 'arrow' ] . '" ' . $size . ' style="' . $canv_style . '"></canvas>';
        }

        /* TOOLTIP - MODAL / ARROW - NONE */
        if( $sett[ 'type' ] == 'modal' || $sett[ 'arrow' ] == 'none' ){
            $sett[ 'canvas' ][ 'top' ]     = '';
            $sett[ 'canvas' ][ 'bottom' ]  = '';
        }

        /* TITLE */
        if( !empty( $sett[ 'title' ] ) )
            $sett[ 'title' ] = '<strong class="mythemes-plg-title">' . $sett[ 'title' ] . '</strong>';

        /* CONTENT */
        if( !empty( $sett[ 'content' ] ) )
            $sett[ 'content' ] = '<div class="mythemes-plg-description">' . $sett[ 'content' ] . '</div>';

        /* ITERATOR */
        $sett[ 'counter' ]  = '<span class="mythemes-plg-counter">' . (self::$current + 1) . ' / <span></span></span>';

        /* ATTRIBUTES */
        /* TOOLTIP ID */
        $sett[ 'ID' ]   = self::$slug . '-' . $sett[ 'id' ];

        /* TOOLTIP CLASS */
        $sett[ 'classes' ]  = self::$slug . ' '
                            . self::$slug . '-layout-' . $sett[ 'layout' ][ 'id' ] . ' '
                            . $sett[ 'layout' ][ 'template' ] . ' '
                            . $sett[ 'type' ] . '-view';

        /* ADDITIONAL CLASS FOR LATEST TOOLTIP FROM GROUP */
        if( isset( $sett[ 'end_group' ] ) && $sett[ 'end_group' ] == 1 || 
            isset( $sett[ 'next' ] ) && $sett[ 'next' ] == 0 )                  /* DEPRECATED OPTION - CHANGED WITH end_group */
        {
            $sett[ 'classes' ] .= ' mythemes-plg-end-group';
            self::$current = 0;
        }
        else{
            self::$current++;
        }

        /* ADDITIONAL CLASS FOR LATEST TOOLTIP FROM PREZENTATION */
        if( $sett[ 'index' ] + 1 == self::$total )
            $sett[ 'classes' ] .= ' mythemes-plg-end-group mythemes-plg-end-presentation';

        /* LAYOUT GENERIC STYLE */
        $sett[ 'style' ] = self::style( $sett[ 'layout' ] );

        return $sett;
    }
    
    static function tooltip( $sett )
    {
        $sett = self::filter( $sett );
        $pause = '';
        if( isset( $sett[ 'layout' ][ 'pause' ] ) && $sett[ 'layout' ][ 'pause' ] ){
            $pause = '<a href="javascript:void(null);" class="mythemes-plg-action-pause mythemes-plg-action mythemes-plg-pause"></a>';
        }
        $prev = '';
        if( isset( $sett[ 'layout' ][ 'prev' ] ) && $sett[ 'layout' ][ 'prev' ] ){
            $prev = '<span class="mythemes-plg-button-wrapper mythemes-plg-prev">'
            . '<button type="button" onclikc="javascript:void(null);" class="mythemes-plg-action-prev mythemes-plg-button mythemes-plg-prev"><span></span> Prev</button>'
            . '</span>';
        }
        return '<div class="' . $sett[ 'classes' ] . '" id="' . $sett[ 'ID' ] . '">'
            . $sett[ 'style' ]
            . $sett[ 'canvas' ][ 'top' ]
            . '<div class="mythemes-plg-header">'
            . '<a href="javascript:void(null);" class="mythemes-plg-action-close mythemes-plg-action mythemes-plg-close"></a>'
            . $pause
            . '</div>'
            . '<div class="mythemes-plg-content">'
            . $sett[ 'title' ]
            . $sett[ 'content' ]
            . '</div>'
            . '<div class="mythemes-plg-footer">'
            . $sett[ 'counter' ]
            
            . '<span class="mythemes-plg-button-wrapper mythemes-plg-next">'
            . '<button type="button" onclikc="javascript:void(null);" class="mythemes-plg-action-next mythemes-plg-button mythemes-plg-next">Next <span></span></button>'
            . '</span>'
            
            . $prev

            . '</div>'
            . $sett[ 'canvas'][ 'bottom' ]
            . '</div>';
    }
}

} /* END IF CLASS EXISTS */
?>