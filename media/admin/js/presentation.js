/* GET SELECTOR BY CLICK */
var resource_type = '';
(function( $ ){
    var normalizeClassName = function( className ){
        var rett = className;
        var prep = className.replace( /  /g, ' ' );

        if( rett.length > prep.length )
            rett = normalizeString( prep );

        return rett.trim();
    }
    var getStringForElement = function (el) {
        var string = el.tagName.toLowerCase();

        if( string == 'body' )
            return string;

        if (el.className) {
            var className = el.className;
            if( resource_type.length ) {
                var r1 = new RegExp(/post-\d+/g);
                var r2 = new RegExp( resource_type );
                var r3 = new RegExp( "type-" + resource_type );
            
                if( r1.test( className ) && r2.test( className ) && r3.test( className ) ){
                    return string + "." + resource_type + '.type-' + resource_type;
                }else{
                    className = className.replace( /post-\d+/g , '' );
                }
            }
            string += "." + normalizeClassName( className ).replace(/ /g, '.');
        }

        if (el.id) {
            string += "#" + el.id;
        }

        return string;
    };

    $.fn.getDomPath = function(string) {
        if (typeof(string) == "undefined") {
            string = true;
        }

        var p = [],
            el = $(this).first();
        el.parents().not('html').each(function() {
            p.push(getStringForElement(this));
        });
        p.reverse();
        p.push(getStringForElement(el[0]));
        return string ? p.join(" > ") : p;
    };
})( jQuery );

var t0  = 0;
var loc = '';

var _mythemes_plg_bk_default = {
    presentation : {
        container       : '',
        layout          : 1,
        width           : 400,
        tooltip_slug    : ''
    },
    tooltip : {
        onHide : "",
        onShow : ""
    },
    arrows : {
        'none'          : 'None',
        'top-left'      : 'Top Left',
        'top-center'    : 'Top Center',
        'top-right'     : 'Top Right',
        'right-top'     : 'Right Top',
        'right-middle'  : 'Right Middle',
        'right-bottom'  : 'Right Bottom',
        'bottom-left'   : 'Bottom Left',
        'bottom-center' : 'Bottom Center',
        'bottom-right'  : 'Bottom Right',
        'left-top'      : 'Left Top',
        'left-middle'   : 'Left Middle',
        'left-bottom'   : 'Left Bottom'
    },
    types       : {
        tooltip : 'Tooltip',
        modal   : 'Modal'
    },
    actions     : [ 'stop' , 'play' ]
};
var _mythemes_plg_bk_options = {
    presentation    : {},
    tooltips        : [],
    layouts_val     : [],
    layouts         : [],
    index           : 0
};

/* PRESENTATION SETTINGS */
function _mythemes_plg_bk_presentation( options ){

    var deff = _mythemes_plg_bk_default;
    var opt  = _mythemes_plg_bk_options;

    /* INIT PRESENTATION OPTIONS */
    opt.presentation = _mythemes_plg_normalize( deff.presentation, options.presentation );

    /* INIT LAYOUTS OPTIONS */
    if( options.hasOwnProperty( 'layouts' ) && typeof options.layouts == "object"  ){
        for( var key in options.layouts ){
            opt.layouts[ key ] = _mythemes_plg_normalize( _mythemes_plg_default.layout, options.layouts[ key ] );
        }
    }

    /* INIT LAYOUTS VALUES OPTIONS */
    opt.layouts_val = options.layouts_val;
}

/* INIT AND ADD TOOLTIPS */
function _mythemes_plg_bk_add_tooltips( tooltips ){

    var total   = tooltips.length;

    var length  = 0;
    var pos     = 0;
    var nr      = 0;
    var tooltip;

    _mythemes_plg_default.tooltip.onShow = "";
    _mythemes_plg_default.tooltip.onHide = "";

    for( var i = 0; i < total; i++ ){

        if( length == 0 )
            pos = i;

        length++;

        tooltip = _mythemes_plg_tooltip( tooltips[ i ] , _mythemes_plg_bk_default.tooltip );

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
        _mythemes_plg_bk_add_tooltip( tooltips[ i ] );
    }

    _mythemes_plg_default.tooltip.onShow = function(){};
    _mythemes_plg_default.tooltip.onHide = function(){};
}

/* TOOLTIP - SLUG */
function _mythemes_plg_bk_tooltip_slug(){
    var options         = _mythemes_plg_bk_options.presentation;
    var deff            = _mythemes_plg_bk_default.presentation;
    var tooltip_slug    = deff.tooltip_slug;

    if( options.hasOwnProperty( 'tooltip_slug' ) )
        tooltip_slug = options.tooltip_slug;

    return tooltip_slug;
}

/* TOOLTIP - INDEX */
function _mythemes_plg_bk_tooltip_index(){
    return _mythemes_plg_bk_options.index;
}

/* ADD TOOLTIP */
function _mythemes_plg_bk_add_tooltip( tooltip ){

    tooltip     = _mythemes_plg_tooltip( tooltip, _mythemes_plg_bk_default.tooltip );

    var options = _mythemes_plg_bk_options.presentation;
    var element = jQuery( _mythemes_plg_bk_tooltip_html( tooltip ) );

    var slug = _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index();

    /* SHOW / HIDE */
    element.children().children( '.' + _mythemes_plg_bk_tooltip_slug() + '-header' ).children('nav').children('ul').children('li.mythemes-plg-action-details').children( 'a.details-icon' ).click(function(){
        var icon = this;
        element.children().children( '.' + _mythemes_plg_bk_tooltip_slug() + '-content' ).toggle( 'slow' , function(){
            if( !jQuery( icon ).hasClass( 'up' ) ){
                jQuery( icon ).addClass( 'up' );

                if( !jQuery( '#' + slug + '-content' ).parent().find( 'div.CodeMirror.cm-s-default').length ){
                    
                    var mixedMode = {
                        name: "htmlmixed",
                        scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
                                       mode: null},
                                      {matches: /(text|application)\/(x-)?vb(a|script)/i,
                                       mode: "vbscript"}]
                    };
                    var editor_content = CodeMirror.fromTextArea(document.getElementById( slug + '-content' ), {
                        styleActiveLine: true,
                        lineNumbers: true,
                        lineWrapping: true,
                        matchBrackets: true,
                        mode: mixedMode
                    });

                    if( tooltip.hasOwnProperty( 'mirror' ) ){
                        tooltip.mirror.content = editor_content;
                        tooltip.mirror.onShow = '';
                        tooltip.mirror.onHide = '';
                    }else{
                        tooltip.mirror = {
                            content : editor_content,
                            onShow : '',
                            onHide : ''
                        };
                    }
                }
            }
            else{
                jQuery( icon ).removeClass( 'up' );
            }
        });
    });

    /* DELETE */
    element.children().children( '.' + _mythemes_plg_bk_tooltip_slug() + '-header' ).children('nav').children('ul').children('li.mythemes-plg-action-delete').children( 'a.delete-icon' ).click(function(){
        if( confirm( "Are you sure you want to delete this tooltip!" ) ){
            element.toggle( 'slow' , function(){
                element.remove();
            });
        }
    });
    
    /* NEXT */
    element.children().children( '.' + _mythemes_plg_bk_tooltip_slug() + '-header' ).children('nav').children('ul').children('li.mythemes-plg-next').children('a').click(function(){
        if( jQuery( this ).hasClass( 'stop' ) ){
            element.children().children('.' + _mythemes_plg_bk_tooltip_slug() + '-content').children( 'div.mythemes-plg-message' ).fadeOut('slow');
            element.children().children('.' + _mythemes_plg_bk_tooltip_slug() + '-content').find('input.mythemes-plg-next').val( 1 );
            element.removeClass( 'stop' )
            jQuery( this ).removeClass( 'stop' );
        }
        else{
            element.children().children('.' + _mythemes_plg_bk_tooltip_slug() + '-content').children( 'div.mythemes-plg-message' ).fadeIn('slow');
            element.children().children('.' + _mythemes_plg_bk_tooltip_slug() + '-content').find('input.mythemes-plg-next').val( 0 );
            element.addClass( 'stop' )
            jQuery( this ).addClass( 'stop' );
        }
    });

    element.children().children( '.' + _mythemes_plg_bk_tooltip_slug() + '-content' ).children('div.mythemes-plg-colls.right').children('button.button-advanced-tooltipings').click(function(){
        var button = this;
        element.children().children( '.' + _mythemes_plg_bk_tooltip_slug() + '-content' ).children('div.mythemes-plg-advanced-tooltipings').toggle( 'slow' , function(){
            if( jQuery( 'span' , button ).text() == 'Show' ){
                jQuery( 'span' , button ).text('Hide');

                if( !jQuery( '#' + slug + '-onShow' ).parent().find( 'div.CodeMirror.cm-s-default').length ){
                    
                    var editor_on_show = CodeMirror.fromTextArea(document.getElementById( slug + '-onShow' ), {
                        styleActiveLine: true,
                        lineNumbers: true,
                        lineWrapping: false,
                        matchBrackets: true,
                        mode : "javascript"
                    });

                    var editor_on_hide = CodeMirror.fromTextArea(document.getElementById( slug + '-onHide' ), {
                        styleActiveLine: true,
                        lineNumbers: true,
                        lineWrapping: false,
                        matchBrackets: true,
                        mode : "javascript"
                    });

                    if( tooltip.hasOwnProperty( 'mirror' ) ){
                        tooltip.mirror.onShow = editor_on_show;
                        tooltip.mirror.onHide = editor_on_hide;
                    }
                    else{
                        tooltip.mirror = {
                            onShow : editor_on_show,
                            onHide : editor_on_hide   
                        }
                    }
                }
            }
            else{
                jQuery( 'span' , button ).text('Show');
            }
        });
    });

    element.appendTo( jQuery( _mythemes_plg_bk_options.presentation.container ) );

    _mythemes_plg_bk_options.tooltips[ _mythemes_plg_bk_tooltip_index() ] = tooltip;
    _mythemes_plg_bk_options.index++;
}

/* TOOLTIP HTML */
function _mythemes_plg_bk_tooltip_html( tooltip ){

    var arrows      = _mythemes_plg_bk_default.arrows;
    var types       = _mythemes_plg_bk_default.types;
    var actions     = _mythemes_plg_bk_default.actions;
    var layouts_val = _mythemes_plg_bk_options.layouts_val;

    var classes     = {
        tooltip     : _mythemes_plg_bk_tooltip_slug() + '-tooltip',
        modal       : _mythemes_plg_bk_tooltip_slug() + '-modal',
        layout      : _mythemes_plg_bk_tooltip_slug() + '-layout',
        width       : _mythemes_plg_bk_tooltip_slug() + '-width'
    };
        
    var content     = '';
    var mssg        = '';

    if( tooltip.hasOwnProperty( 'next' ) && tooltip.next == 1 )
        mssg = 'hidden';
        
    content += '<div class="mythemes-plg-message ' + mssg + '"><p>Display presentation will be made to the first element with the stop button (red button).</p></div>';
    content += '<div class="mythemes-plg-info mythemes-plg-code">You can run this tooltip, from javascript with method : <span style="color: #990000;">mythemes_plg_presentation.show( ' + tooltip.id + ' [ , true ] );</span></div>';
        
    /* HIDDEN CONTENT */
    content += mythemes_plg_ahtml.hidden({ 
        slug : 'id',
        value : tooltip.id,
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][id]',
        inputID : _mythemes_plg_bk_tooltip_slug() + '-id-' + _mythemes_plg_bk_tooltip_index()
    });
        
    content += mythemes_plg_ahtml.hidden({ 
        slug : 'next',
        value : tooltip.next,
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][next]',
        inputID : _mythemes_plg_bk_tooltip_slug() + '-next-' + _mythemes_plg_bk_tooltip_index()
    });

    content += '<div class="mythemes-plg-colls">';
        
    /* TOOLTIP TITLE */
    content += mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'text'
        },
        slug : 'title',
        label : 'Tooltip Title',
        value : tooltip.title,
        inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-title',
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][title]'
    });
    content += '<small class="mythemes-plg-tooltip-id">Tooltip ID : ' + tooltip.id + '</small>';

    /* TOOLTIP CONTENT */
    content += mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'textarea'
        },
        slug : 'content',
        label : 'Content',
        value : tooltip.content,
        inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-content',
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][content]'

    });
    
    content += '</div>';
    
    content += '<div class="mythemes-plg-colls right">'; 
    
    content += '<div class="mythemes-plg-group arrow-pos">'
    content += '<div class="colls-2">';
    
    /* TOOLTIP TYPE SAMPLE / MODAL  */
    content += mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'select'
        },
        slug : 'type',
        values : types,
        label : 'Type',
        value : tooltip.type,
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][type]',
        action : {
            hide : [ '#' + _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + ' .' + classes.tooltip , '#' + _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + ' .' + classes.modal ],
            tooltip : {
                show : [ '#' + _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + ' .' + classes.tooltip ]
            },
            modal : {
                show : [ '#' + _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + ' .' + classes.modal ]
            }
        }
    });

    var iframe_select = mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'select'
        },
        slug : 'type',
        values : types,
        label : 'Type',
        value : tooltip.type,
        inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-type',
        action : {
            hide : [ '#' + _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + ' .' + classes.tooltip , '#' + _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + ' .' + classes.modal ],
            tooltip : {
                show : [ '#' + _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + ' .' + classes.tooltip ]
            },
            modal : {
                show : [ '#' + _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + ' .' + classes.modal ]
            }
        }
    });
    
    
    if( tooltip.type == 'modal' ){
        classes.tooltip += ' hidden';
    }
    
    if( tooltip.type == 'tooltip' ){
        classes.modal += ' hidden';
    }
    
    /* TOOLTIP ARROW POSITION */
    content += mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'select'
        },
        slug : 'arrow',
        values  : arrows,
        label : 'Arrow Position',
        value : tooltip.arrow,
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][arrow]',
        fieldClass : classes.tooltip
    });

    content += '<div class="clear clearfix"></div>';
    content += '</div>';
    content += '</div>';
    
    
    content += '<div class="mythemes-plg-group">';
    
    /* TOOLTIP JQUERY SELECTOR */
    content += mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'text'
        },
        slug : 'selector',
        label : 'jQuery Selector',
        placeholder : 'Select HTML DOM Element with jQuery Selector',
        value : tooltip.selector,
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][selector]'
    });

    content += '<input type="button" class="button mythemes-plg-set-selector" onclick="javascript:_mythemes_plg_bk_set_selector(' + _mythemes_plg_bk_tooltip_index() + ') " value="Set Selector">';

    content += '<div class="mythemes-plg-iframe hidden">';
    content += '<div class="mythemes-plg-iframe-shadow"></div>';

    content += '<div class="mythemes-plg-iframe-content">';
    content += '<iframe src="" width="100%" id="location-' + _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '"></iframe>';

    content += '<div class="mythemes-plg-content-actions">';

        content += '<div class="mythemes-plg-group">';

        content += mythemes_plg_ahtml.field({
            type : {
                field : 'inlist',
                input : 'text'
            },
            slug : 'selector',
            label : 'jQuery Selector',
            placeholder : 'Select HTML DOM Element with jQuery Selector',
            value : tooltip.selector,
            inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-selector'
        });

        content += '<div class="mythemes-plg-colls-n">';

        /* TOOLTIP TYPE POSITION */
        content += iframe_select;

        content += '</div>';
        content += '<div class="mythemes-plg-colls-n">';
        
        /* TOOLTIP ARROW POSITION */
        content += mythemes_plg_ahtml.field({
            type : {
                field : 'inlist',
                input : 'select'
            },
            slug : 'arrow',
            values  : arrows,
            label : 'Arrow Position',
            value : tooltip.arrow,
            inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-arrow',
            fieldClass : classes.tooltip
        });

        content += '</div>';
        content += '<div class="mythemes-plg-colls-n">';

        /* TOOLTIP TOP POSITION */
        content += mythemes_plg_ahtml.field({
            type : {
                field : 'inlist',
                input : 'text'
            },
            slug : 'top',
            label : 'Top',
            value : tooltip.top,
            inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-top'
        });

        content += '</div>';
        content += '<div class="mythemes-plg-colls-n">';

        /* TOOLTIP LEFT POSITION */
        content += mythemes_plg_ahtml.field({
            type : {
                field : 'inlist',
                input : 'text'
            },
            slug : 'left',
            label : 'Left',
            value : tooltip.left,
            inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-left',
            fieldClass : classes.tooltip
        });

        content += '</div>';
        content += '<div class="mythemes-plg-colls-n">';
        content += '<input type="button" class="button button-primary mythemes-plg-save" value="Save" onclick="javascript:_mythemes_plg_bk_iframe_save(' + _mythemes_plg_bk_tooltip_index() + ');"> ';
        content += '<input type="button" class="button mythemes-plg-save" value="Cancel" onclick="javascript:_mythemes_plg_bk_iframe_cancel(' + _mythemes_plg_bk_tooltip_index() + ');">';
        content += '</div>';
        content += '<div class="clear clearfix"></div>';
        content += '</div>';

    content += '</div>';

    content += '</div>';
    content += '</div>';

    
    content += '<div class="colls-2">';

    /* TOOTLIP TOP POSITION */
    content += mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'text'
        },
        slug : 'top',
        label : 'Top',
        value : tooltip.top,
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][top]'
    });

    /* TOOLTIP LEFT POSITION */
    content += mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'text'
        },
        slug : 'left',
        label : 'Left',
        value : tooltip.left,
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][left]',
        fieldClass : classes.tooltip
    });
    content += '<div class="clear clearfix"></div>';
    content += '<small class="mythemes-plg-hint ' + classes.tooltip + '">';
    content += 'Tooltip positioning on the page is made over the top left corner of a particular element on the webpage. "jQuery Selector" property is used to specify that element in the page. The properties "Left" and "Top" are the shift from the upper left top (in pixels). These properties "Left" and "Top" can get positive or negative values.'
    content += '</small>';
    
    content += '<small class="mythemes-plg-hint ' + classes.modal + '">';
    content += 'Modal Tooltips have fixed positioning and are displayed exactly in the middle of the window. No matter how properties "jQuery Selector" and "Top" are filled in. In case you filled in the mentioned properties, then the browser scrolls the tooltip\'s content till the specified position.';
    content += '</small>';
    
    content += '<div class="clear clearfix"></div></div>';
    content += '</div>';
    
    content += '<button type="button" class="button button-advanced-tooltipings button-primary button-large"><span>Show</span> Advanced Settings</button>';
    content += '</div>';
    content += '<div class="clearfix clear"></div>';
    
    content += '<div class="mythemes-plg-advanced-tooltipings hidden">';
    content += '<div class="mythemes-plg-group">';
    content += '<div class="title">';
    content += '<strong>Advanced Settings</strong>';
    content += '</div>';
    
    content += '<div class="colls-2">';
    
    /* TOOLTIP CUSTOM LAYOUT */
    content += mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'logic'
        },
        slug : 'custom-layout',
        label : 'Custom Layout',
        value : tooltip.custom_layout,
        inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-custom_layout',
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][custom_layout]',
        action : {
            show : [ '#' + _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + ' .' + classes.layout ]
        }
    });
    
    if( tooltip.custom_layout == 0 )
        classes.layout += ' hidden';
    
    /* TOOLTIP LAYOUT */
    if( layouts_val.length == 0 ){
        content += '<div class="mythemes-plg-ahtml-inlist ' + classes.layout + '">'
        + '<span style="color: #990000">There are no layouts. To create a new layout see section "Layout Builder"</span>'
        + '</div>';
    }
    else{
        content += mythemes_plg_ahtml.field({
            type : {
                field : 'inlist',
                input : 'select'
            },
            values : layouts_val,
            value : tooltip.layout,
            inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-layout',
            inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][layout]',
            fieldClass : classes.layout
        });
    }
    
    content += '<div class="clear clearfix"></div></div>';
    content += '<div class="colls-2">';
    
    /* TOOLTIP CUSTOM WIDTH */
    content += mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'logic'
        },
        slug : 'custom-width',
        label : 'Custom Width',
        value : tooltip.custom_width,
        inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-custom_width',
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][custom_width]',
        action : {
            show : [ '#' + _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + ' .' + classes.width ]
        }
    });
    
    if( tooltip.custom_width == 0 )
        classes.width += ' hidden';
    
    /* TOOLTIP WIDTH */
    content += mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'text'
        },
        value : tooltip.width,
        inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-width',
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][width]',
        fieldClass : classes.width
    });
    
    content += '<div class="clear clearfix"></div></div>';
    content += '</div>';
    
    content += '<div class="mythemes-plg-group">';
    content += '<div class="title">';
    content += '<strong>Additional JavaScript</strong>';
    content += '</div>';
    
    content += mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'textarea'
        },
        label : 'On Show',
        value : tooltip.onShow,
        inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-onShow',
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][onShow]'
    });
    
    content += mythemes_plg_ahtml.field({
        type : {
            field : 'inlist',
            input : 'textarea'
        },
        label : 'On Hide',
        value : tooltip.onHide,
        inputID : _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '-onHide',
        inputName : _mythemes_plg_bk_tooltip_slug() + '[' + _mythemes_plg_bk_tooltip_index() + '][onHide]'
    });
    content += '<div class="clear clearfix"></div>';
    content += '</div>';
    
    content += '</div>';
    content += '</div>';
    
    var rett = '<div class="' + _mythemes_plg_bk_tooltip_slug() + '-wrapper ' + actions[ tooltip.next ] + '">';
    rett += '<div class="' + _mythemes_plg_bk_tooltip_slug() + '" id="' + _mythemes_plg_bk_tooltip_slug() + '-' + _mythemes_plg_bk_tooltip_index() + '">';
    rett += '<div class="mythemes-plg-time-line-arrow"></div>';
    
    /* HEADER */
    rett += '<div class="' + _mythemes_plg_bk_tooltip_slug() + '-header">';
        
    rett += '<nav>';
    
    rett += '<ul>';
    rett += '<li class="mythemes-plg-sortable"><i></i></li>';
    rett += '<li class="mythemes-plg-next"><a href="javascript:javascript:void(null);" class="' + actions[ tooltip.next ] + '"></a></li>';
    rett += '<li class="mythemes-plg-head">' + tooltip.title + ' <span class="type">' + types[ tooltip.type ] + '</span></li>';
    rett += '<li class="mythemes-plg-action-delete"><a class="delete-icon" href="javascript:void(null);"></a></li>';
    rett += '<li class="mythemes-plg-action-details"><a class="details-icon" href="javascript:void(null);"></a></li>';
    rett += '</ul>';
        
    rett += '</nav>';
    rett += '<div class="clear clearfix"></div>';
    
    rett += '</div>';

    /* CONTENT */
    rett += '<div class="' + _mythemes_plg_bk_tooltip_slug() + '-content hidden">';
    rett += content;
    rett += '</div>';
    rett += '</div>';
    rett += '</div>';

    return rett;
}

function _mythemes_plg_bk_sync_tooltip( index ){

    var tooltip = _mythemes_plg_bk_options.tooltips[ index ];

    jQuery(function(){
        var slug        = '#' + _mythemes_plg_bk_tooltip_slug() + '-' + index;

        var tooltip_    = jQuery( slug );
        var iframe      = jQuery( slug + ' div.mythemes-plg-iframe div.mythemes-plg-content-actions' );

        var selector    = iframe.find( slug + '-selector' ).val();
        var type        = iframe.find( slug + '-type' ).val();
        var arrow       = iframe.find( slug + '-arrow' ).val();
        var top         = iframe.find( slug + '-top' ).val();
        var left        = iframe.find( slug + '-left' ).val();

        tooltip_.find( '#mythemes-plg-selector' ).val( selector );
        tooltip_.find( '#mythemes-plg-type' ).val( type );
        tooltip_.find( '#mythemes-plg-arrow' ).val( arrow );
        tooltip_.find( '#mythemes-plg-top' ).val( top );
        tooltip_.find( '#mythemes-plg-left' ).val( left );

        tooltip.selector    = selector;
        tooltip.type        = type;
        tooltip.arrow       = arrow;
        tooltip.top         = top;
        tooltip.left        = left;
    });
}
function _mythemes_plg_bk_isync_tooltip( id ){

    var tooltip = _mythemes_plg_bk_options.tooltips[ id ];

    jQuery(function(){
        var slug        = '#' + _mythemes_plg_bk_tooltip_slug() + '-' + id;

        var tooltip_    = jQuery( slug );
        var iframe      = jQuery( slug + ' div.mythemes-plg-iframe div.mythemes-plg-content-actions' );

        var selector    = tooltip_.find( '#mythemes-plg-selector' ).val();
        var type        = tooltip_.find( '#mythemes-plg-type' ).val();
        var arrow       = tooltip_.find( '#mythemes-plg-arrow' ).val();
        var top         = tooltip_.find( '#mythemes-plg-top' ).val();
        var left        = tooltip_.find( '#mythemes-plg-left' ).val();

        iframe.find( slug + '-selector' ).val( selector );
        iframe.find( slug + '-type' ).val( type );
        iframe.find( slug + '-arrow' ).val( arrow );
        iframe.find( slug + '-top' ).val( top );
        iframe.find( slug + '-left' ).val( left );

        tooltip.selector    = selector;
        tooltip.type        = type;
        tooltip.arrow       = arrow;
        tooltip.top         = top;
        tooltip.left        = left;
    });
}
function _mythemes_plg_bk_iframe_save( id ){
    _mythemes_plg_bk_sync_tooltip( id );
    _mythemes_plg_bk_iframe_cancel( id );
}

function _mythemes_plg_bk_iframe_cancel( id ){
    jQuery(function(){
        var slug = _mythemes_plg_bk_tooltip_slug() + '-' + id;
        jQuery( '#' + slug + ' div.mythemes-plg-iframe' ).hide();
        jQuery( 'div.mythemes-plg-iframe iframe#location-' + slug ).contents().find('html').html('');
        jQuery( 'div.mythemes-plg-iframe iframe#location-' + slug ).unbind( 'load' );
    });
}
/* INIT BACK END PRESENTATION */
function mythemes_plg_bk_presentation( options, tooltips ){

    _mythemes_plg_bk_presentation( options );

    jQuery('document').ready( function( ){
    
        /* ADD TOOLTIPS */
        _mythemes_plg_bk_add_tooltips( tooltips );

        /* INIT SORTABLE */
        jQuery( _mythemes_plg_bk_options.presentation.container ).sortable({
            handle : 'div.' +  _mythemes_plg_bk_tooltip_slug() + '-header nav ul li.mythemes-plg-sortable'
        }, function(){

        });
    });
}

function _mythemes_plg_bk_set_selector( id ){

    var slug = _mythemes_plg_bk_tooltip_slug() + '-' + id;

    jQuery(function(){

        jQuery( '#' + slug + ' div.mythemes-plg-iframe' ).show();
        var h = jQuery( '#' + slug + ' div.mythemes-plg-iframe-content' ).height();
        var hh = jQuery( '#' + slug + ' div.mythemes-plg-iframe div.mythemes-plg-content-actions').height();
        var ifr_height = parseInt( h - hh );
        jQuery( '#' + slug + ' div.mythemes-plg-iframe iframe' ).css({ 'height' : ifr_height + 'px' });

        var type = jQuery( 'select#mythemes-plg-res_type' ).val();
        
        if( type == 'url' ){
            var url = jQuery( 'input#mythemes-plg-url' ).val() + '?nopresentation=true';
            document.getElementById( 'location-' + slug ).src = url;
        }
        else{

            if( jQuery( 'select#mythemes-plg-' + type ).val() == 'all' ){
                resource_type = type;
            }

            jQuery.post( ajaxurl , {
                'action'        : 'mythemes_plg_url',
                'res_type'      : type,
                'post_id'       : jQuery( 'select#mythemes-plg-' + type ).val()
            }, function( result ){
                document.getElementById( 'location-' + slug ).src = result + '?nopresentation=true';
            });
        }
        

        // IFRAME CONTENT
        jQuery( 'div.mythemes-plg-iframe iframe#location-' + slug ).load(function(){
            jQuery( 'div.mythemes-plg-iframe iframe#location-' + slug ).contents().find('body *').hover(function(){

                jQuery( this ).unbind( 'click' );
                jQuery( this ).unbind( 'submit' );

                if( jQuery( this ).attr( "href" ) !== undefined ){
                    jQuery( this ).attr( "href" , "javascript:void(null);" );
                }

                if( jQuery( this ).attr( "onclick" ) !== undefined ){
                    jQuery( this ).attr( "onclick" , "javascript:void(null);" );
                }

                jQuery( this ).submit(function( event ) {
                    event.preventDefault();
                });

                jQuery( this ).css({ "cursor" : "pointer" });
                
                var d = jQuery( this ).data('events');
                if( d ) {
                    if( !d.click || d.click.length == 0 ) {
                        jQuery( this ).click( function(){ _mythemes_plg_bk_get_selector( id, this ); } );
                    }
                    else {
                        var ok = true;
                        for( var i in d.click ) {
                            if( d.click[ i ].handler &&
                                d.click[ i ].handler === function(){ _mythemes_plg_bk_get_selector( id, this ); } )
                            {
                                ok = false;
                                break;
                            }
                            else{
                                delete d.click[ i ];
                            }
                        }
                        if( ok ) {
                            jQuery( this ).click( function(){ _mythemes_plg_bk_get_selector( id, this ); });
                        }
                    }
                }
            });

            var tooltip = _mythemes_plg_bk_reset_tooltip( id );
            
            if( tooltip.selector.length ){
                _mythemes_plg_bk_isync_tooltip( id );
                _mythemes_plg_bk_create_tooltip( id );
            }

            jQuery( '#' + slug + ' div.mythemes-plg-content-actions select.mythemes-plg-type' ).change(function(){
                _mythemes_plg_bk_sync_tooltip( id );
                _mythemes_plg_bk_create_tooltip( id );   
            });

            jQuery( '#' + slug + ' div.mythemes-plg-content-actions select.mythemes-plg-arrow' ).change(function(){
                _mythemes_plg_bk_sync_tooltip( id );
                _mythemes_plg_bk_create_tooltip( id );
            });

            jQuery( '#' + slug + ' div.mythemes-plg-content-actions input.mythemes-plg-top' ).keyup(function(){
                _mythemes_plg_bk_sync_tooltip( id );
                _mythemes_plg_bk_create_tooltip( id );   
            });

            jQuery( '#' + slug + ' div.mythemes-plg-content-actions input.mythemes-plg-left' ).keyup(function(){
                _mythemes_plg_bk_sync_tooltip( id );
                _mythemes_plg_bk_create_tooltip( id );   
            });

            jQuery( 'div.mythemes-plg-iframe iframe#location-' + id ).contents().find('body div#mythemes-plg-presentation *').unbind('click');
        });
    });
}

function _mythemes_plg_bk_get_selector( id, self ){

    var slug    = _mythemes_plg_bk_tooltip_slug() + '-' + id;
    var iframe  = jQuery( 'div.mythemes-plg-iframe iframe#location-' + slug );
    var t1      = Math.round( ( new Date( ) ).getTime( ) );

    if( t1 - t0 > 100 ) {

        var tooltip = _mythemes_plg_bk_options.tooltips[ id ];
        var selector = jQuery( self ).getDomPath();
        
        _mythemes_plg_bk_options.tooltips[ id ].selector = selector;
        
        jQuery( iframe ).parent().children( 'div.mythemes-plg-content-actions' ).find('input.mythemes-plg-selector').val( selector );
        jQuery( iframe ).parent().children( 'div.mythemes-plg-content-actions' ).find('input.mythemes-plg-selector').attr( "value" , selector );

        _mythemes_plg_bk_sync_tooltip( id );

        _mythemes_plg_bk_create_tooltip( id );
    }
    
    t0 = t1;
}

function _mythemes_plg_bk_create_tooltip( id ){

    var slug    = _mythemes_plg_bk_tooltip_slug() + '-' + id;

    jQuery( 'div.mythemes-plg-iframe iframe#location-' + slug ).contents().find('div#mythemes-plg-presentation').html('');

    var tooltip = _mythemes_plg_bk_reset_tooltip( id );

    // GENERAL CUSTOM LAYOUT
    var _layout = _mythemes_plg_bk_options.presentation.layout;
    if( jQuery( 'input#mythemes-plg-custom-layout:checked').length ){
        _layout = jQuery('select#mythemes-plg-layout').val();
    }

    // GENERAL CUSTOM WIDTH
    var _width = _mythemes_plg_bk_options.presentation.width;
    if( jQuery( 'input#mythemes-plg-custom-width:checked').length ){
        _width = jQuery('input#mythemes-plg-width').val();
    }
    // TOOLTIP TITLE
    tooltip.title = jQuery( '#' + slug ).find( 'input#' + slug + '-title' ).val();

    // TOOLTIP CONTENT
    tooltip.content = tooltip.mirror.content.getValue();

    // TOOLTIP CUSTOM LAYOUT
    if( jQuery( '#' + slug ).find( 'input#' + slug + '-custom_layout:checked' ).length ){
        tooltip.custom_layout = 1;
        tooltip.layout = jQuery( '#' + slug ).find( 'select#' + slug + '-layout' ).val();
    }
    else{
        tooltip.custom_layout = 0;
    }

    // TOOLTIP CUSTOM WIDTH
    if( jQuery( '#' + slug ).find( 'input#' + slug + '-custom_width:checked' ).length ){
        tooltip.custom_width = 1;
        tooltip.width = jQuery( '#' + slug ).find( 'input#' + slug + '-width' ).val();
    }
    else{
        tooltip.custom_width = 0;
    }

    _mythemes_plg_presentation({
        presentation : {
            prefix : (new Date()).getTime(),
            layout : _layout,
            width : _width,
            window_width : jQuery( 'div.mythemes-plg-iframe iframe#location-' + slug ).width(),
            window_height : jQuery( 'div.mythemes-plg-iframe iframe#location-' + slug ).height(),
            contents : jQuery( 'div.mythemes-plg-iframe iframe#location-' + slug ).contents(),
            container : jQuery( 'div.mythemes-plg-iframe iframe#location-' + slug ).contents().find('div#mythemes-plg-presentation'),
            actions : 0
        },
        layouts : _mythemes_plg_bk_options.layouts
    });

    _mythemes_plg_presentation_init();

    tooltip = _mythemes_plg_tooltip( tooltip );

    tooltip.onShow = function(){
        try{
            eval( tooltip.mirror.onShow.getValue() );
        }catch ( e ){
            if (e instanceof SyntaxError) {
                console.log( (e.message) );
            }
        }
    };

    tooltip.onHide = function(){
        try{
            eval( tooltip.mirror.onHide.getValue() );
        }catch ( e ){
            if (e instanceof SyntaxError) {
                console.log( (e.message) );
            }
        }
    };

    var t = _mythemes_plg_add_tooltip( tooltip );

    t._scroll();

    if( tooltip.type == 'modal' )
        _mythemes_plg_modal_shadow().show();
    else
        _mythemes_plg_modal_shadow().hide();

    _mythemes_plg_modal_shadow().click(function(){
        jQuery( this ).hide();
    });
}

var reset = false;

function _mythemes_plg_bk_reset_tooltip( id ){
    var tooltip = _mythemes_plg_bk_options.tooltips[ id ];

    jQuery(function(){
        var slug = '#' + _mythemes_plg_bk_tooltip_slug() + '-' + id;

        var tooltip_ = jQuery( slug );
        var iframe  = jQuery( slug + ' div.mythemes-plg-iframe div.mythemes-plg-content-actions' );

        var iselector   = iframe.find( slug + '-selector' ).val();
        var itype       = iframe.find( slug + '-type' ).val();
        var iarrow      = iframe.find( slug + '-arrow' ).val();
        var itop        = iframe.find( slug + '-top' ).val();
        var ileft       = iframe.find( slug + '-left' ).val();

        var tselector   = tooltip_.find( '#mythemes-plg-selector' ).val();
        var ttype       = tooltip_.find( '#mythemes-plg-type' ).val();
        var tarrow      = tooltip_.find( '#mythemes-plg-arrow' ).val();
        var ttop        = tooltip_.find( '#mythemes-plg-top' ).val();
        var tleft       = tooltip_.find( '#mythemes-plg-left' ).val();

        if( tselector !== iselector )
            reset = true;

        if( ttype !== itype )
            reset = true;

        if( tarrow !== iarrow )
            reset = true;

        if( ttop !== itop )
            reset = true;

        if( tleft !== ileft )
            reset = true;

        tooltip.selector    = tselector;
        tooltip.type        = ttype;
        tooltip.arrow       = tarrow;
        tooltip.top         = ttop;
        tooltip.left        = tleft;
    });

    return tooltip;
}