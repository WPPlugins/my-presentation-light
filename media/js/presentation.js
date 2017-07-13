document = window.document;

/* BASIC FUNCTIONS */
Number.prototype.isInteger = function() {
        return this.toString().match(/^[0-9]$/);
};
String.prototype.replaceAt = function( index , character ) {
    return this.substr( 0, index ) + character + this.substr( index + character.length );
};

function _mythemes_plg_normalize( def, opt ){
    if( opt == null )
        return def;

    if( typeof def == 'object' ){
        if( typeof opt !== 'object' ){
            return def;
        }

        for( var key in def ){
            if( !opt.hasOwnProperty( key ) ){
                opt[ key ] = def[ key ];
                continue;
            }

            if( typeof def[ key ] == 'number' ){
                if( typeof opt[ key ] !== 'number' ){
                    if( typeof parseInt( opt[ key ] ) == 'number' && !isNaN( parseInt( opt[ key ] ) ) ){
                        if( def[ key ].isInteger() )
                            opt[ key ] = parseInt( opt[ key ] );
                        else
                            opt[ key ] = parseFloat( opt[ key ] );
                    }else{
                        opt[ key ] = def[ key ];
                    }
                }
                continue;
            }

            if( typeof def[ key ] == 'function' ){
                if( typeof opt[ key ] == 'string' && opt[ key ].length ){
                    (function( opt, key ) {
                        var str = opt[ key ];
                        opt[ key ] = function( ){
                            try{
                                eval( str );
                            }catch ( e ){
                                if (e instanceof SyntaxError) {
                                    console.log( (e.message) );
                                }
                            }
                        }
                    })( opt, key );
                }
                else{
                    opt[ key ] = def[ key ];
                }
                continue;
            }

            if( typeof def[ key ] == 'string' ){
                if( typeof opt[ key ] !== 'string' ){
                    if( typeof JSON.stringify( opt[ key ] ) == 'string' ){
                        opt[ key ] = JSON.stringify( opt[ key ] );
                    }
                    else{
                        opt[ key ] = "";
                    }
                    
                        
                }
                continue;
            }

            if( typeof def[ key ] == 'object' ){
                if( typeof opt[ key ] == 'object' ){
                    opt[ key ] = _mythemes_plg_normalize( def[key] , opt[ key ] );
                }
                else{
                    opt[ key ] = def[ key ];
                }
                continue;
            }
        }
    }

    return opt;
}

function _mythemes_plg_color( hex, lum ){
    hex = String(hex).replace(/[^0-9a-f]/gi, '');

        if ( hex.length < 6 ) {
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }

        lum = lum || 0;
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt( hex.substr( i*2 , 2 ), 16);
            c = Math.round( Math.min( Math.max( 0, c + ( c * lum ) ) , 255 ) ).toString( 16 );
            rgb += ( "00" + c ).substr( c.length );
        }
        return rgb;
}

var actions = false;
var mythemes_plg_state = '';

/* DEFAULT OPTIONS */
var _mythemes_plg_default = {
    presentation : {
        slug            : 'mythemes-plg-presentation',
        tooltip_slug    : 'mythemes-plg-tooltip',
        storage_slug    : 'mythemes_plg_presentation',
        window_width    : jQuery( window ).width(),
        window_height   : jQuery( window ).height(),
        selector        : 'body',
        prefix          : 0,
        autorun         : 1,
        use_storage     : 1,
        storage         : window.localStorage,
        onLoadPage      : function(){},
        onStart         : function(){},
        layout          : 1,
        width           : 400,
        current         : 0,
        actions         : {}
    },
    tooltip : {
        id              : 0,
        next            : 1,
        title           : 'Title for new Tooltip',
        content         : '',
        type            : 'tooltip',
        imported        : '',
        arrow           : 'top-left',
        custom_layout   : 0,
        layout          : 1,
        custom_width    : 0,
        width           : 400,
        selector        : '',
        left            : 0,
        top             : 0,
        onShow          : function(){},
        onHide          : function(){}
    },
    layout : {
        id          : 0,
        title       : 'Default Layout',
        template    : '',
        color       : '#00aeef',
        contrast    : 0.2,
        pause       : 0,
        close       : 1,
        prev        : 0,
        next        : 1
    }
};
/* OPTIONS */
var _mythemes_plg_options = {
    presentation    : {},
    tooltips        : [],
    layouts         : [],
    styles          : []    
};

/* PRESENTATION */
/* PRESENTATION OPTIONS */
function _mythemes_plg_presentation( options, deff ){

    var opt  = _mythemes_plg_options;

    if( typeof deff == 'undefined' )
        deff = _mythemes_plg_default.presentation;

    /* LAYOUTS SETTINGS */
    if( options.hasOwnProperty( 'layouts' ) && typeof options.layouts == "object" ){
        for( var key  in options.layouts ){
            opt.layouts[ key ] = _mythemes_plg_normalize( _mythemes_plg_default.layout, options.layouts[ key ] );
        }
    }

    if( !options.hasOwnProperty( 'presentation' ) ){
        options.presentation = {};
    }

    /* PRESENTATION SETTINGS */
    opt.presentation = _mythemes_plg_normalize( deff , options.presentation );
    opt.styles = [];
}



/* TOOLTIP */
/* GET TOOLTIP - SETTINGS */
function _mythemes_plg_tooltip( tooltip, deff ){
    var presentation = _mythemes_plg_options.presentation;

    if( typeof deff == 'undefined' )
        deff = _mythemes_plg_default.tooltip;

    if( typeof deff == 'object' )
        deff = _mythemes_plg_normalize( deff , _mythemes_plg_default.tooltip );

    tooltip = _mythemes_plg_normalize( deff , tooltip );

    /* INIT */
    /* CHECK ID */
    if( tooltip.id === 0 ){
        var d = new Date();
        tooltip.id = d.getTime();
    }

    /* CHECK CUSTOM LAYOUT / WIDTH */
    /* CHECK CUSTOM LAYOUT */
    if( tooltip.custom_layout == 0 ){
        tooltip.layout = presentation.layout;
    }

    /* CHECK CUSTOM WIDTH */
    if( tooltip.custom_width == 0 ){
        tooltip.width = presentation.width;
    }

    return tooltip;
}

/* TOOLTIP - CHECK POSITION */
function _mythemes_plg_tooltip_position( tooltip ){

    var options = _mythemes_plg_options.presentation;

    if( options.hasOwnProperty( 'contents' ) ){
        tooltip.selector = jQuery( tooltip.selector , options.contents );
        if( !tooltip.selector.length )
            tooltip.selector = jQuery( "body" , options.contents );
    }
    else{
        tooltip.selector = jQuery( tooltip.selector );
        if( !tooltip.selector.length )
            tooltip.selector = jQuery( "body" );
    }
    
    /* TOP / LEFT POSITIONS */    
    tooltip.pos = {
        top : parseInt( tooltip.selector.offset().top ) + tooltip.top,
        left: parseInt( tooltip.selector.offset().left ) + tooltip.left
    };

    /* TOOLTIP STYLE */
    if( tooltip.type == 'modal' ){
        var width = options.window_width;
        if( width < tooltip.width ){
            tooltip.width      = width - 20;
            tooltip.pos.left   = 10;
        }
        else{
            tooltip.pos.left   = parseInt( ( width - tooltip.width ) / 2 );
        }
    }

    return tooltip;
}

/* TOOLTIP - INLINE STYLE */
function _mythemes_plg_tooltip_style( tooltip ){

    var rett;

    if( tooltip.hasOwnProperty( 'preview' ) && tooltip.preview == 1 ){
        rett = ' width:' + tooltip.width + 'px;';
    }
    else{
        rett = ' top:' + tooltip.pos.top + 'px;'
        + ' left:' + tooltip.pos.left + 'px;'
        + ' width:' + tooltip.width + 'px;';    
    }

    if( jQuery( tooltip.selector ).css( 'position' ) == 'fixed' || tooltip.type == 'modal' )
        rett += ' position: fixed;';

    return rett;
}

/* TOOLTIP - SLUG */
function _mythemes_plg_tooltip_slug(){
    var options         = _mythemes_plg_options.presentation;
    var deff            = _mythemes_plg_default.presentation;
    var tooltip_slug    = deff.tooltip_slug;

    if( options.hasOwnProperty( 'tooltip_slug' ) )
        tooltip_slug = options.tooltip_slug;

    return tooltip_slug;
}

/* TOOLTIP - ID */
function _mythemes_plg_tooltip_ID( id ){
    return _mythemes_plg_tooltip_slug() + '-' + id;
}

/* TOOLTIP - CLASSES */
function _mythemes_plg_tooltip_classes( tooltip ){

    var options = _mythemes_plg_options.presentation;
    var rett    = _mythemes_plg_tooltip_slug() + ' ' + tooltip.type + '-view';

    /* ADDITIONAL CLASS FOR LATEST TOOLTIP FROM GROUP */
    if( tooltip.hasOwnProperty( 'end_group' ) && tooltip.end_group == 1 || 
        tooltip.hasOwnProperty( 'next' ) && tooltip.next == 0 )
    {
        rett += ' mythemes-plg-end-group';
    }

    /* ADDITIONAL CLASS FOR LATEST TOOLTIP FROM PREZENTATION */
    if( tooltip.hasOwnProperty( 'index' ) && options.hasOwnProperty( 'total' ) && tooltip.index + 1 == options.total )
        rett += ' mythemes-plg-end-group mythemes-plg-end-presentation';

    return rett;

}

/* TOOLTIP - ARROW TOP / LEFT / RIGHT */
function _mythemes_plg_tooltip_arrow_( tooltip ){

    var size        = ' width="17" height="20" ';
    var canv_style  = '';
    var show_arrow  = false;
    var rett        = '';

    if( tooltip.arrow == 'top-left' ||
        tooltip.arrow == 'top-center' ||
        tooltip.arrow == 'top-right' ){

        /* TOP OR BOTTOM ARROW */
        size = ' width="20" height="17" ';
    }

    /* ARROW STYLE */
    /* TOP */
    if( tooltip.arrow == 'top-left' )
        show_arrow = true;

    if( tooltip.arrow == 'top-center' ){
        canv_style = 'margin: -17px 0px 17px ' + parseInt( ( tooltip.width - 20 ) / 2 ) + 'px;';
        show_arrow = true;
    }

    if( tooltip.arrow == 'top-right' ){
        canv_style = 'margin: -17px 0px 17px ' + ( tooltip.width - 50 ) + 'px;';
        show_arrow = true;
    }

    /* RIGHT */
    if( tooltip.arrow == 'right-top' ){
        canv_style = 'margin: 30px 0px 0px ' + tooltip.width + 'px;';
        show_arrow = true;
    }

    if( tooltip.arrow == 'right-middle' || tooltip.arrow == 'right-bottom' ){
        canv_style = 'margin-left: ' + tooltip.width + 'px;';
        show_arrow = true;
    }

    /* LEFT */
    if( tooltip.arrow == 'left-top' ){
        canv_style = 'margin: 30px 0px 0px -17px;';
        show_arrow = true;
    }

    if( tooltip.arrow == 'left-middle' || tooltip.arrow == 'left-bottom' ){
        canv_style = 'margin: 0px 17px 0px -17px';
        show_arrow = true;
    }

    /* ARROW POSITION */
    if( show_arrow )
        rett = '<canvas class="' + _mythemes_plg_tooltip_slug() + '-arrow ' + tooltip.arrow + '" ' + size + ' style="' + canv_style + '"></canvas>';

    /* TOOLTIP - MODAL / ARROW - NONE */
    if( tooltip.type == 'modal' || tooltip.arrow == 'none' ){
        rett = '';
    }

    return rett;
}

/* TOOLTIP - ARROW BOTTOM */
function _mythemes_plg_tooltip_arrow_bottom( tooltip ){

    /* ARROW SIZE */
    var size = ' width="20" height="17" ';
    var canv_style  = '';
    var show_arrow  = false;
    var rett        = '';

    /* ARROW STYLE */
    if( tooltip.arrow == 'bottom-left' )
        show_arrow = true;

    if( tooltip.arrow == 'bottom-center' ){
        canv_style = 'margin: 0px 0px 0px ' + parseInt( ( tooltip.width - 20 ) / 2) + 'px;';
        show_arrow = true;
    }

    if( tooltip.arrow == 'bottom-right' ){
        canv_style = 'margin: 0px 0px 0px ' + ( tooltip.width - 50 ) + 'px;';
        show_arrow = true;
    }
    
    if( show_arrow )
        rett = '<canvas class="' + _mythemes_plg_tooltip_slug() + '-arrow ' + tooltip.arrow + '" ' + size + ' style="' + canv_style + '"></canvas>';
    
    /* TOOLTIP - MODAL / ARROW - NONE */
    if( tooltip.type == 'modal' || tooltip.arrow == 'none' ){
        rett = '';
    }

    return rett;
}

/* TOOLTIP - COUNTER NR / GROUP TOTAL */
function _mythemes_plg_tooltip_counter( tooltip ){

    var number      = 0;
    var group_total = 0;
    var rett        = '';

    if( tooltip.hasOwnProperty( 'nr' ) && tooltip.nr > 0 )
        number = tooltip.nr;

    if( tooltip.hasOwnProperty( 'group_total' ) && tooltip.group_total > 0 )
        group_total = tooltip.group_total;

    if( number > 0 && group_total > 0 )
        rett = '<span class="mythemes-plg-counter">' + tooltip.nr + ' / <span>' + tooltip.group_total + '</span></span>';

    return rett;
}

/* TOOLTIP - TITLE */
function _mythemes_plg_tooltip_title( tooltip ){

    var rett = '';
    if( tooltip.title.length )
        rett = '<strong class="mythemes-plg-title">' + tooltip.title + '</strong>';

    return rett;
}

/* TOOLTIP - CONTENT */
function _mythemes_plg_tooltip_content( tooltip ){

    var rett = '';
    if( tooltip.content.length )
        rett = '<div class="mythemes-plg-description">' + tooltip.content + '</div>';

    return rett;
}

/* TOOLTIP - PAUSE */
function _mythemes_plg_tooltip_pause( tooltip ){

    var layout  = _mythemes_plg_layout( tooltip.layout );
    var rett    = '';

    if( tooltip.hasOwnProperty( 'preview' ) && tooltip.preview ){
        if( layout.hasOwnProperty( 'pause' ) && layout.pause ){
            rett = '<a href="javascript:void(null);" class="mythemes-plg-action-pause mythemes-plg-action mythemes-plg-pause"></a>';
        }else{
            rett = '<a href="javascript:void(null);" class="mythemes-plg-action-pause mythemes-plg-action mythemes-plg-hidden mythemes-plg-pause"></a>';
        } 
    }else{
        if( layout.hasOwnProperty( 'pause' ) && layout.pause ){
            rett = '<a href="javascript:void(null);" class="mythemes-plg-action-pause mythemes-plg-action mythemes-plg-pause"></a>';
        }
    }

    return rett;
}
/* TOOLTIP - CLOSE */
function _mythemes_plg_tooltip_close( tooltip ){

    var layout  = _mythemes_plg_layout( tooltip.layout );
    var rett    = '';

    if( layout.hasOwnProperty( 'close' ) && layout.close ){
        rett = '<a href="javascript:void(null);" class="mythemes-plg-action-close mythemes-plg-action mythemes-plg-close"></a>';
    }

    return rett;
}
/* TOOLTIP - NEXT */
function _mythemes_plg_tooltip_next( tooltip ){

    var layout  = _mythemes_plg_layout( tooltip.layout );
    var rett    = '';

    if( tooltip.hasOwnProperty( 'preview' ) && tooltip.preview ){
        if( layout.hasOwnProperty( 'next' ) && layout.next ){
            rett = '<span class="mythemes-plg-button-wrapper mythemes-plg-next">'
            + '<button type="button" onclikc="javascript:void(null);" class="mythemes-plg-action-next mythemes-plg-button mythemes-plg-next">Next <span></span></button>'
            + '</span>';
        }
        else{
            rett = '<span class="mythemes-plg-button-wrapper mythemes-plg-next mythemes-plg-hidden">'
            + '<button type="button" onclikc="javascript:void(null);" class="mythemes-plg-action-next mythemes-plg-button mythemes-plg-next">Next <span></span></button>'
            + '</span>';
        }
    }
    else{
        if( layout.hasOwnProperty( 'next' ) && layout.next && tooltip.nr < tooltip.group_total ){
            rett = '<span class="mythemes-plg-button-wrapper mythemes-plg-next">'
            + '<button type="button" onclikc="javascript:void(null);" class="mythemes-plg-action-next mythemes-plg-button mythemes-plg-next">Next <span></span></button>'
            + '</span>';
        }
    }

    return rett;
}

/* TOOLTIP - HTML */
function _mythemes_plg_tooltip_html( tooltip ){

    var presentation = _mythemes_plg_options.presentation;
    var layout  = _mythemes_plg_layout( tooltip.layout );

    /* INIT POSITION */
    tooltip = _mythemes_plg_tooltip_position( tooltip );

    var rett = '';
        
    rett += '<div class="' + _mythemes_plg_tooltip_classes( tooltip ) + ' ' + _mythemes_plg_layout_classes( layout ) + '" ';
    rett += 'id="' + _mythemes_plg_tooltip_ID( tooltip.id ) + '" ';
    rett += 'style="' + _mythemes_plg_tooltip_style( tooltip ) + '">';

    /* LAYOUT STYLE */
    rett += _mythemes_plg_layout_style( layout );

    /* ARROW - TOP / LEFT / RIGHT */
    rett += _mythemes_plg_tooltip_arrow_( tooltip );

    /* HEADER */
    rett += '<div class="mythemes-plg-header">';
    rett += _mythemes_plg_tooltip_close( tooltip );

    if( presentation.use_storage || ( tooltip.hasOwnProperty( 'preview' ) && tooltip.preview ) ){
        rett += _mythemes_plg_tooltip_pause( tooltip );
    }

    rett += '</div>';

    var next = _mythemes_plg_tooltip_next( tooltip );

    var buttons = next.length;

    var content_class = '';
    if( !buttons ){
        content_class = 'mythemes-plg-no-border'
    }

    /* CONTENT */
    rett += '<div class="mythemes-plg-content ' + content_class + '">';
    rett += _mythemes_plg_tooltip_title( tooltip );
    rett += _mythemes_plg_tooltip_content( tooltip );
    rett += '</div>';

    
    if( buttons ){
        /* FOOTER */
        rett += '<div class="mythemes-plg-footer">';
        rett += _mythemes_plg_tooltip_counter( tooltip );

        /* NAVIGATION BUTTONS */
        rett += next;

        rett += '</div>';
    }

    /* ARROW - BOTTOM */
    rett += _mythemes_plg_tooltip_arrow_bottom( tooltip );

    rett += '</div>';

    return rett;
}



/* LAYOUT */
/* GET LAYOUT - SETTINGS */
function _mythemes_plg_layout( index ){
    var layouts = _mythemes_plg_options.layouts;
    var deff    = _mythemes_plg_default.layout;    
    var layout;

    if( layouts.hasOwnProperty( index ) ){
        layout  = _mythemes_plg_normalize( deff , layouts[ index ] );
    }
    else{
        layout  = deff;
    }

    return layout;
}

/* LAYOUT - STYLE UNIQ STYLE */
function _mythemes_plg_layout_style( layout ){
    
    if( _mythemes_plg_options.styles.hasOwnProperty( layout.id ) )
        return '';

    return _mythemes_plg_layout_all_style( layout );
}

/* LAYOUT - STYLE SHOW ALL */
function _mythemes_plg_layout_all_style( layout ){

    return _mythemes_plg_options.styles[ layout.id ] =

    '<style id="' + _mythemes_plg_layout_ID( layout.id ) + '">'
    + _mythemes_plg_layout_css( layout )
    + '</style>';
}

/* LAYOUT - CSS */
function _mythemes_plg_layout_css( layout ){

    var colors = new Array();
    var self = this;
    var rett;
    var border;

    colors = new Array();
    colors[ 0 ] = _mythemes_plg_color( layout.color , -1 * layout.contrast  );
    colors[ 1 ] = _mythemes_plg_color( layout.color , layout.contrast );

    border = 'border: 1px solid ' + colors[ 0 ] + ';';

    if( layout.hasOwnProperty( 'template' ) && layout.template == 'dark' ){
        border = '';
    }

    rett = border +
            'background-color: ' + layout.color + ';' +
            '-webkit-box-shadow: inset 0 1px 0 ' + colors[ 1 ] + ';' +
            'box-shadow: inset 0 1px 0 ' + colors[ 1 ] + ';';

    if( layout.hasOwnProperty( 'template' ) && ( layout.template == 'flat dark' || layout.template == 'flat' ) ){
        rett = 'background-color: ' + layout.color + ';';
        rett += '}';
        rett += '.' + _mythemes_plg_layout_class( layout.id ) + ' .mythemes-plg-footer button.mythemes-plg-prev{';
        rett += 'border-right: 1px solid ' + colors[ 0 ] + ' !important;';
        rett += '}';
        rett += '.' + _mythemes_plg_layout_class( layout.id ) + ' .mythemes-plg-footer button.mythemes-plg-next{';
        rett += 'border-left: 1px solid ' + colors[ 1 ] + ' !important;';
    }

    return '.' + _mythemes_plg_layout_class( layout.id ) + ' .mythemes-plg-footer button.mythemes-plg-button{'
    + rett
    + '}';
}

/* LAYOUT - CLASS */
function _mythemes_plg_layout_class( id ){
    return _mythemes_plg_tooltip_slug() + '-layout-' + id; 
}

/* LAYOUT - CLASSES */
function _mythemes_plg_layout_classes( layout ){
    return _mythemes_plg_tooltip_slug() + '-layout-' + layout.id + ' ' + layout.template; 
}

/* LAYOUT - ID */
function _mythemes_plg_layout_ID( id ){
    return _mythemes_plg_tooltip_slug() + '-layout-' + id; 
}



/* FRONT END PRESENTATION */
function _mythemes_plg_presentation_init(){
    _mythemes_plg_options.presentation.onLoadPage();
    _mythemes_plg_presentation_jquery_init();

    jQuery( window ).resize(function() {
    });
}

function _mythemes_plg_presentation_container(){

    var options = _mythemes_plg_options.presentation;
    var rett    = jQuery( '#' + options.slug );

    if( options.hasOwnProperty( 'container' ) ) {
        rett = options.container;
    }

    return rett;
}

function _mythemes_plg_add_tooltip( tooltip ){

    if( typeof tooltip == 'undefined' )
        return;

    var options     = _mythemes_plg_options.presentation;
    var html        = _mythemes_plg_tooltip_html( tooltip );

    var container   = _mythemes_plg_presentation_container();
    var element     = jQuery( html );

    element.appendTo( container );
    
    /* MODAL CORECTION TOP POSITION */
    if( tooltip.type == 'modal' ){
        var height = parseInt( _mythemes_plg_get_tooltip( tooltip.id ).height() );
        var wind = options.window_height;

        if( wind < height ){
            _mythemes_plg_get_tooltip( tooltip.id ).css( { 'height' : ( wind - 20 ) + 'px' , 'top' : '10px' } );
        }
        else{
            var top = parseInt( ( wind - height ) / 2 );
            _mythemes_plg_get_tooltip( tooltip.id ).css( { 'top' : top + 'px' } );
        }
    }

    /* ADD ACTIONS */
    if( options.hasOwnProperty( 'actions' ) && typeof options.actions == 'object' ){
        _mythemes_plg_get_tooltip( tooltip.id ).action_next();
        _mythemes_plg_get_tooltip( tooltip.id ).action_end( true , true );
    }

    /* ARROW */
    _mythemes_plg_get_tooltip( tooltip.id ).arrow_top();
    _mythemes_plg_get_tooltip( tooltip.id ).arrow_right();
    _mythemes_plg_get_tooltip( tooltip.id ).arrow_bottom();
    _mythemes_plg_get_tooltip( tooltip.id ).arrow_left();

    _mythemes_plg_options.tooltips[ _mythemes_plg_get_tooltip( tooltip.id ).index() ] = tooltip;

    return _mythemes_plg_get_tooltip( tooltip.id );
}
function _mythemes_plg_add_tooltips( tooltips ){

    var total   = tooltips.length;

    if( total == 0 )
        return;

    var length  = 0;
    var pos     = 0;
    var nr      = 0;
    var tooltip;

    for( var i = 0; i < total; i++ ){

        if( length == 0 )
            pos = i;

        length++;

        tooltip = _mythemes_plg_tooltip( tooltips[ i ] );

        if( tooltip.next == 0 || ( tooltip.hasOwnProperty( 'end_group') && tooltip.end_group == 1 ) || ( i == total - 1 ) ){
            nr = 0;
            for( var j = pos; j < length + pos; j++ ){
                nr++;
                tooltips[ j ].nr = nr;              
                tooltips[ j ].group_total = length;
            }

            length = 0;
        }
    }
    
    for( var i = 0; i < total; i++ ){
        mythemes_plg_state += '0';
        _mythemes_plg_add_tooltip( tooltips[ i ] );
    }
}

function _mythemes_plg_presentation_jquery_init(){
    
    var options      = _mythemes_plg_options;
    var presentation = options.presentation;
    var tooltips     = options.tooltips;
    var all          = _mythemes_plg_get_tooltips();

    (function( $ , window ){
        $.fn.action_next = function(){
            var self = jQuery( this );

            return self.find('.mythemes-plg-action-next').click(function(){
                self.__next();
            });
        }
        $.fn.__next = function(){
            var self    = jQuery( this );
            var current = tooltips[ self.index() ];         /* CURENT */
            var next    = tooltips[ self.next().index() ];  /* NEXT */
            

            if( !self.hasClass('mythemes-plg-end-group') && self.next().length ){
                if( self.hasClass( 'modal-view' ) &&  !self.next().hasClass('modal-view') ){
                    _mythemes_plg_modal_shadow().fadeOut('slow');
                }
                if( !self.hasClass( 'modal-view' ) &&  self.next().hasClass('modal-view') ){
                    _mythemes_plg_modal_shadow().fadeIn('slow');
                }

                self.fadeOut();
                current.onHide();
                
                self.next()._scroll();

                self.removeClass( _mythemes_plg_tooltip_slug() + '-current' );
                self.next().addClass( _mythemes_plg_tooltip_slug() + '-current' );

                if( presentation.use_storage ){
                    var s = _mythemes_plg_get_state().replaceAt( self.index() , '1' );
                    _mythemes_plg_set_state( s );
                }
            }
        }
        $.fn.action_end = function( tooltip , group ){
            var self = jQuery( this );

            self.find('.mythemes-plg-action-close').click(function(){
                self.__end( tooltip , group );
            });

            self.find('.mythemes-plg-action-pause').click(function(){
                self.__end( );
            });
        }
        $.fn.__end = function( tooltip , group ){
            var self = jQuery( this );

            _mythemes_plg_presentation_hide();
            
            if( tooltips.hasOwnProperty( self.index() ) ){
                _mythemes_plg_tooltip_onHide( self.index() );
            }

            if( presentation.use_storage ){
                var s = _mythemes_plg_get_state();
                if( typeof group == 'boolean' && group ){
                    
                    for( var i = self.index(); i < s.length; i++ ){
                        s = s.replaceAt( i , '1' );
                        if( typeof all[ i ] != 'undefine' && jQuery( all[ i ] ).hasClass( 'mythemes-plg-end-group' ) ){
                            break;
                        }
                    }
                    _mythemes_plg_set_state( s );
                    return self;
                }
                if( typeof tooltip == 'boolean' && tooltip ){
                    _mythemes_plg_set_state( s.replaceAt( self.index() , '1' ) );
                }
            }
        }
        /* TOOLTIPS ARROW */
        /* MIDDLE POSITION */
        $.fn._middle = function(){
            var self = jQuery( this );

            if( self.hasClass( 'left-middle') || self.hasClass( 'right-middle' ) ){
                var height = parseInt( self.parent().height() );
                var top = parseInt( ( height - 20 ) / 2 );

                self.css( { 'margin-top' : top + 'px' } );
            }
            return self;
        }
        /* BOTTOM POSITION */
        $.fn._bottom = function(){
            var self = jQuery( this );

            if( self.hasClass( 'left-bottom') || self.hasClass( 'right-bottom' ) ){
                var height = parseInt( self.parent().height() );
                var footer = self.parent().children('div.mythemes-plg-footer');
                var fheight = 0;
                if( footer.length )
                    fheight = parseInt( footer.height() ) - 10;
                
                var bottom = height - fheight - 50;
                self.css( { 'margin-top' : bottom + 'px' } );
            }
        }
        /* TOP ARROW */
        $.fn.arrow_top = function(){
            var self = jQuery( this );
            var selector = 'canvas.mythemes-plg-tooltip-arrow.top-left, ' + 
                'canvas.mythemes-plg-tooltip-arrow.top-center, ' + 
                'canvas.mythemes-plg-tooltip-arrow.top-right';

            if( self.find( selector ).length ){
                var color = self.css( 'background-color' );
                self.find( selector ).drawSlice({
                    fillStyle: color,
                    x: 10, y: 0,
                    radius: 100,
                    start: 150, end: 210
                });
            }
        }
        /* RIGHT ARROW */
        $.fn.arrow_right = function(){
            var self = jQuery( this );
            var selector = 'canvas.mythemes-plg-tooltip-arrow.right-top, ' +
                'canvas.mythemes-plg-tooltip-arrow.right-middle, ' +
                'canvas.mythemes-plg-tooltip-arrow.right-bottom';

            if( self.find( selector ).length ){

                self.find( selector )._middle();
                self.find( selector )._bottom();
                
                var color = self.css( 'background-color' );
                self.find( selector ).drawSlice({
                    fillStyle: color,
                    x: 17, y: 10,
                    radius: 100,
                    start: 240, end: 300
                });
            }
        }
        /* BOTTOM ARROW */
        $.fn.arrow_bottom = function(){
            var self = jQuery( this );
            var selector = 'canvas.mythemes-plg-tooltip-arrow.bottom-left, ' +
                'canvas.mythemes-plg-tooltip-arrow.bottom-center, ' +
                'canvas.mythemes-plg-tooltip-arrow.bottom-right';

            if( self.find( selector ).length ){

                var color;
                
                if( self.children('div.mythemes-plg-footer').length ){
                    color = self.children('div.mythemes-plg-footer').css( 'background-color' );
                }else{
                    color = self.css( 'background-color' );
                }

                if( self.find( selector ).hasClass( 'bottom-right' ) && self.hasClass( 'flat' ) ){
                    color = self.find( 'button.mythemes-plg-button' ).css( 'background-color' );
                }

                self.find( selector ).drawSlice({
                    fillStyle: color,
                    x: 10, y: 17,
                    radius: 100,
                    start: -30, end: 30
                });
            }
        }
        /* LEFT ARROW */
        $.fn.arrow_left = function(){
            var self = jQuery( this );
            var selector = 'canvas.mythemes-plg-tooltip-arrow.left-top, ' +
                'canvas.mythemes-plg-tooltip-arrow.left-middle, ' +
                'canvas.mythemes-plg-tooltip-arrow.left-bottom';

            if( self.find( selector ).length ){

                self.find( selector )._middle();
                self.find( selector )._bottom();

                var color = self.css( 'background-color' );

                self.find( selector ).drawSlice({
                    fillStyle: color,
                    x: 0, y: 10,
                    radius: 100,
                    start: 60, end: 120
                });
            }
        }
        $.fn._scroll = function(){


            var self    = jQuery( this );
            var body    = jQuery( 'body' , presentation.contents );
            var height  = presentation.window_height;
            var h       = self.height();
            var id      = self.index();
            var tooltip = _mythemes_plg_reponsive_coordinated( tooltips[ id ] );

            var scroll  = tooltip.pos.top;

            if( tooltip.arrow == 'top-left' || tooltip.arrow == 'top-center' || tooltip.arrow == 'top-right' )
                scroll += 30;

            if( tooltip.arrow == 'bottom-left' || tooltip.arrow == 'bottom-center' || tooltip.arrow == 'bottom-right' )
                scroll -= 30;
            
            if( h > height ){
                body.animate({
                    scrollTop: scroll
                }, 500 , function(){
                    _mythemes_plg_responsive( tooltips[ id ] );
                    self.fadeIn( 100 , function(){
                        _mythemes_plg_tooltip_onShow( id );    
                    });
                    
                });
            }
            else{
                var scroll_h = -1 * parseInt( ( height - h ) / 2 );
                body.animate({
                    scrollTop: scroll + scroll_h
                }, 500 , function(){
                    _mythemes_plg_responsive( tooltips[ id ] );
                    self.fadeIn( 100 , function(){
                        _mythemes_plg_tooltip_onShow( id );
                    });
                    
                });
            }

            return self;
        }
    })( jQuery , window );
}

function _mythemes_plg_modal_shadow(){
    var options = _mythemes_plg_options.presentation;
    var rett = jQuery( '#mythemes-plg-modal-panel' );
    if( options.hasOwnProperty( 'contents' ) )
        rett = jQuery( '#mythemes-plg-modal-panel' , options.contents );

    return rett;
}

/* STORAGE */
/* SET FUNCTION */
function _mythemes_plg_set_state( value ){
    var options = _mythemes_plg_options.presentation;
    var e, keyName;
    
    if ( options.storage ) {
        keyName = "" + options.storage_slug + "_" + options.prefix;
        try {
            options.storage.setItem( keyName, value );
        } catch ( error ) {
            e = error;
            if ( e.code === DOMException.QUOTA_EXCEEDED_ERR ) {
                this.debug( "LocalStorage quota exceeded. setState failed." );
            }
        }
    } else {
        if ( this._state == null ) {
            this._state = {};
        }
        return this._state[ options.prefix ] = value;
    }
}

/* REMOVE FUNCTION */
function _mythemes_plg_remove_state(){
    var options = _mythemes_plg_options.presentation;
    var e, keyName;
    
    if ( options.storage ) {
        keyName = "" + options.storage_slug + "_" + options.prefix;
        options.storage.removeItem( keyName );
    } else {
        if ( this._state != null ) {
            return delete this._state[ options.prefix ];
        }
    }
}

/* GET FUNCTION */
function _mythemes_plg_get_state(){
    var options = _mythemes_plg_options.presentation;
    var keyName, value;
    if( options.storage ){
        keyName = "" + options.storage_slug + "_" + options.prefix;
        value = options.storage.getItem( keyName );
        if( typeof value == 'undefined' || value == null || value.length == 0 ){
            value = mythemes_plg_state;
        }
    }
    else{
        if( this._state != null ){
            value = this._state[ options.prefix ];
        }
        else{
            value = mythemes_plg_state;
        }
    }
    if ( value === void 0 || value === "null" ) {
        value = mythemes_plg_state;
    }
    return value;
}



/* DEVELOPERS PACK */
function _mythemes_plg_get_tooltip( id ){
    var self = _mythemes_plg_presentation_container();

    return self.children( '#' + _mythemes_plg_tooltip_ID( id ) );
}
function _mythemes_plg_get_tooltips(){
    return _mythemes_plg_presentation_container().find( '.' + _mythemes_plg_tooltip_slug() );
}

function _mythemes_plg_presentation_hide(){

    var all = _mythemes_plg_get_tooltips();

    all.fadeOut( 'slow' );
    all.removeClass( _mythemes_plg_tooltip_slug() + '-current' );
    _mythemes_plg_modal_shadow().fadeOut('slow');
}
function _mythemes_plg_tooltip_onShow( id ){
    var tooltip = _mythemes_plg_options.tooltips[ id ];

    if( tooltip.hasOwnProperty( 'onShow' ) ){
        tooltip.onShow();
    }
}
function _mythemes_plg_tooltip_onHide( id ){
    var tooltip = _mythemes_plg_options.tooltips[ id ];

    if( tooltip.hasOwnProperty( 'onHide' ) ){
        tooltip.onHide();
    }
}
/* RESPONSIVE  */
function _mythemes_plg_responsive( tooltip ){
    tooltip = _mythemes_plg_reponsive_coordinated( tooltip );
    _mythemes_plg_responsive_css( tooltip )
}


function _mythemes_plg_reponsive_coordinated( tooltip ){
    var presentation = _mythemes_plg_options.presentation;
    var w,h,left,top,x,y,new_x,new_y;

    if( tooltip.type == 'modal' ){

        var wind_width  = presentation.window_width;
        var height = parseInt( _mythemes_plg_get_tooltip( tooltip.id ).height() );

        if( wind_width < tooltip.width ){
            tooltip.width       = wind_width - 20;
            tooltip.pos.left    = 10;
        }
        else{
            tooltip.pos.left    = parseInt( ( wind_width - tooltip.width ) / 2 );
        }

    }else{

        tlp_w   = tooltip.width;
        tlp_h   = _mythemes_plg_get_tooltip( tooltip.id ).height();

        w       = jQuery( tooltip.selector ).outerWidth();
        h       = jQuery( tooltip.selector ).outerHeight();

        left    = tooltip.left;
        top     = tooltip.top;

        x       = parseInt( jQuery( tooltip.selector ).offset().left );
        y       = parseInt( jQuery( tooltip.selector ).offset().top );

        if( jQuery( tooltip.selector ).css( 'position' ) == 'fixed' ){
            y   = tooltip.pos.top;
            top = 0; 
        }
        
        if( jQuery( tooltip.selector ).prop("tagName").toLowerCase() == 'body' ){
            tooltip.pos.left    = 30;
            tooltip.pos.top     = 30;

            return tooltip;
        }

        if( tooltip.arrow == 'none' ){
            new_x = x + parseInt( ( w - tlp_w ) / 2 ) + left;
            new_y = y + parseInt( ( h - tlp_h ) / 2 ) + top ;
        }
        if( tooltip.arrow == 'top-left' ){
            new_x = x + left;
            new_y = y + h + top + 30;
        }
        if( tooltip.arrow == 'top-center' ){
            new_x = x + parseInt( ( w - tlp_w ) / 2 ) + left;
            new_y = y + h + top + 30;
        }
        if( tooltip.arrow == 'top-right' ){
            new_x = x + ( w - tlp_w ) + left;
            new_y = y + h + top + 30;
        }
        if( tooltip.arrow == 'left-top' ){
            new_x = x + w + left + 30;
            new_y = y + top;
        }
        if( tooltip.arrow == 'left-middle' ){
            new_x = x + w + left + 30;
            new_y = y + parseInt( ( h - tlp_h ) / 2 ) + top;
        }
        if( tooltip.arrow == 'left-bottom' ){
            new_x = x + w + left + 30;
            new_y = y + ( h - tlp_h ) + top;
        }
        if( tooltip.arrow == 'bottom-left' ){
            new_x = x + left;
            new_y = y - tlp_h - 30 + top;
        }
        if( tooltip.arrow == 'bottom-center' ){
            new_x = x + parseInt( ( w - tlp_w ) / 2 ) + left;
            new_y = y - tlp_h - 30 + top;
        }
        if( tooltip.arrow == 'bottom-right' ){
            new_x = x + ( w - tlp_w ) + left;
            new_y = y - tlp_h - 30 + top;
        }
        if( tooltip.arrow == 'right-top' ){
            new_x = x - tlp_w - 30 + left;
            new_y = y + top;
        }
        if( tooltip.arrow == 'right-middle' ){
            new_x = x - tlp_w - 30 + left;
            new_y = y + parseInt( ( h - tlp_h ) / 2 ) + top;
        }
        if( tooltip.arrow == 'right-bottom' ){
            new_x = x - tlp_w - 30 + left;
            new_y = y + ( h - tlp_h ) + top;
        }

        tooltip.pos.left    = new_x;
        tooltip.pos.top     = new_y;
    }

    return tooltip;
}

function _mythemes_plg_responsive_css( tooltip ){

    var presentation = _mythemes_plg_options.presentation;

    if( tooltip.type == 'modal' ){

        var wind_height = presentation.window_height;
        var height = parseInt( _mythemes_plg_get_tooltip( tooltip.id ).height() );

        if( wind_height < height ){
            _mythemes_plg_get_tooltip( tooltip.id ).css({ 
                'height' : ( wind_height - 20 ) + 'px',
                'top' : '10px' 
            });
        }
        else{
            var top = parseInt( ( wind_height - height ) / 2 );
            _mythemes_plg_get_tooltip( tooltip.id ).css({ 'top' : top + 'px' });
        }

        _mythemes_plg_get_tooltip( tooltip.id ).css({ 'left' : tooltip.pos.left + 'px' });
    }else{
        _mythemes_plg_get_tooltip( tooltip.id ).css({
            'left' : tooltip.pos.left + 'px',
            'top' : tooltip.pos.top + 'px'
        });
    }
}

/* FRONT END OBJECT */
function myThemes_plg_presentation( options, tooltips ){

    var _presentation = function(){
    }

    _presentation.prototype = new _mythemes_plg_presentation( options );
    _presentation.prototype.init = _mythemes_plg_presentation_init;

    /* ADDITIONAL FUNCTIONS */
    _presentation.prototype.start = function( id , ignore_storage ){
        var options = _mythemes_plg_options.presentation;
        var self    = _mythemes_plg_presentation_container();
        var all     = this.getTooltips();
        
        /* IF IS DISABLED AUTORUN */
        if( typeof id == 'undefined' && typeof ignore_storage == 'undefined' && options.autorun ==  0 ){
            return null;
        }
        
        this.hide();
        options.onStart();
        
        var tooltip;
        var s = _mythemes_plg_get_state();
        
        if( ( typeof ignore_storage == 'boolean' && ignore_storage ) ||
            ( typeof ignore_storage == 'number' && ignore_storage == 1 )
        ){
            if( typeof id == 'number' && id > 0 && this.getTooltip( id ).length ){
                tooltip = this.getTooltip( id );
                for( var i = tooltip.index(); i < s.length; i++ ){
                    s = s.replaceAt( i , '0' );
                    if( typeof all[ i ] != 'undefine' && jQuery( all[ i ] ).hasClass( 'mythemes-plg-end-group' ) ){
                        break;
                    }
                }
                _mythemes_plg_set_state( s );
            }
            else{
                for( var i = 0; i < s.length; i++ ){
                    s = s.replaceAt( i , '0' );
                    if( typeof all[ i ] != 'undefine' && jQuery( all[ i ] ).hasClass( 'mythemes-plg-end-group' ) ){
                        break;
                    }
                }
                _mythemes_plg_set_state( s );
                tooltip = jQuery( all[ 0 ] );
            }
        }
        else{
            if( typeof id == 'number' && id > 0 && this.getTooltip( id ).length ){
                tooltip = this.getTooltip( id );
                for( var i = tooltip.index(); i < s.length; i++ ){
                    if( s[ i ] == '0' && typeof all[ i ] != 'undefine' ){
                        tooltip = jQuery( all[ i ] );
                        break;
                    }
                    if( jQuery( all[ i ] ).hasClass( 'mythemes-plg-end-group' ) ){
                        break;
                    }
                }
            }
            else{
                for( var i = 0; i < s.length; i++ ){
                    if( s[ i ] == '0' && typeof all[ i ] != 'undefine' ){
                        tooltip = jQuery( all[ i ] );
                        break;
                    }
                    if( jQuery( all[ i ] ).hasClass( 'mythemes-plg-end-group' ) ){
                        break;
                    }
                }
            }
        }
        
        if( typeof tooltip == 'undefined' )
            return null;
        
        tooltip._scroll();
        tooltip.addClass( _mythemes_plg_tooltip_slug() + '-current' );

        if( tooltip.hasClass( 'modal-view' ) ){
            _mythemes_plg_modal_shadow().fadeIn( 'slow' );
        }
    }
    _presentation.prototype.show = function( id , ignore_storage ){
        var options = _mythemes_plg_options.presentation;
        var self    = _mythemes_plg_presentation_container();
        var all     = this.getTooltips();
        
        /* IF IS DISABLED AUTORUN */
        if( typeof id == 'undefined' ){
            return null;
        }
        
        this.hide();
        
        var tooltip;
        
        var s = _mythemes_plg_get_state();
        
        if( ( typeof ignore_storage == 'boolean' && ignore_storage ) ||
            ( typeof ignore_storage == 'number' && ignore_storage == 1 )
        ){
            if( this.getTooltip( id ).length ){
                tooltip = this.getTooltip( id );
            }
        }
        else{
            tooltip = this.getTooltip( id );
            if( s[ tooltip.index() ] == '1' ){
                tooltip = null;
            }
        }
        
        if( typeof tooltip == 'undefined' || tooltip == null )
            return null;
        
        tooltip._scroll();
        tooltip.addClass( _mythemes_plg_tooltip_slug() + '-current' );

        if( tooltip.hasClass( 'modal-view' ) ){
            _mythemes_plg_modal_shadow().fadeIn( 'slow' );
        }
    }
    _presentation.prototype.hide = function(){
        _mythemes_plg_modal_shadow().fadeOut('slow');
        this.getTooltips().fadeOut('slow');
        this.getTooltips().removeClass( _mythemes_plg_tooltip_slug() + '-current' );
    }
    _presentation.prototype.close = function( tooltip , group ){

        var self = this;
        if( self.exists_current() ){
            jQuery( self.current() ).__end( tooltip , group );
        }
        else{
            jQuery( self.current() ).__end( tooltip , group );
        }
    }
    _presentation.prototype.getTooltip = _mythemes_plg_get_tooltip;
    _presentation.prototype.getTooltips = _mythemes_plg_get_tooltips;
    _presentation.prototype.is_current = function( id ){
        var rett = false;
        if( this.getTooltip( id ).hasClass( _mythemes_plg_tooltip_slug() + '-current' ) ){
            rett = true;
        }
        
        return rett;
    }
    _presentation.prototype.exists_current = function(){
        var rett = false;

        if( this.getTooltips().hasClass( _mythemes_plg_tooltip_slug() + '-current' ) ){
            rett = true;
        }
        
        return rett;
    }
    _presentation.prototype.current = function(){
        var tooltip = null;
        
        this.getTooltips().each(function(){
            if( jQuery( this ).hasClass( _mythemes_plg_tooltip_slug() + '-current' ) )
                tooltip = jQuery( this );
        });
        
        return tooltip;
    }
    _presentation.prototype.resetStorage = _mythemes_plg_remove_state;

    var presentation = new _presentation( options );

    presentation.init();
    _mythemes_plg_add_tooltips( tooltips );
    presentation.start();

    jQuery(window).resize(function() {
        if( presentation.exists_current() ){
            presentation.current()._scroll();
        }
    });

    return presentation;
}

document = window.document;
window.myThemes_plg_presentation = myThemes_plg_presentation;
window.mythemes_plg_presentation = myThemes_plg_presentation;

var mythemes_plg_presentation = new myThemes_plg_presentation( {} , [] );
