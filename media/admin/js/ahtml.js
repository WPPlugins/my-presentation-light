Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}
var mythemes_plg_ahtml = {
    deff : {
        prefix : {
            input : 'mythemes-plg-',
            field : 'mythemes-plg-field-'  
        }
    },
    id : function( sett ){
        if( sett.hasOwnProperty( 'inputID' ) && sett.inputID.length )
            return  sett.inputID;

        if( sett.hasOwnProperty( 'slug' ) && sett.slug.length )
            return  this.deff.prefix.input + sett.slug;

        return null;
    },
    name : function( sett ){
        if( sett.hasOwnProperty( 'inputName' ) && sett.inputName.length )
            return  sett.inputName;
        
        if( sett.hasOwnProperty( 'slug' ) && sett.slug.length )
            return  this.deff.prefix.input + sett.slug;
        
        return null;
    },
    op_name : function( sett ){
        if( sett.hasOwnProperty( 'opName' ) && sett.opName.length )
            return  sett.opName;
        
        if( sett.hasOwnProperty( 'slug' ) && sett.slug.length )
            return  this.deff.prefix.input + sett.slug;
        
        return null;
    },
    classes : function( sett ){
        var rett = '';
        
        if( sett.hasOwnProperty( 'inputClass' ) && sett.inputClass.length )
            rett = sett.inputClass + ' ';

        if( sett.hasOwnProperty( 'slug' ) && sett.slug.length )
            rett += this.deff.prefix.input + sett.slug;

        return rett;
    },
    placeholder : function( sett ){
        var rett = '';
        
        if( sett.hasOwnProperty( 'placeholder' ) && sett.placeholder.length )
            rett = 'placeholder="' + sett.placeholder + '"';

        return rett;
    },
    attr : function( sett , attr ){
        var value   = null;
        var rett    = '';

        switch( attr ){
            case 'for':
            case 'id' :{
                value = this.id( sett );
                break;
            }
            case 'name' :{
                value = this.name( sett );
                break;
            }
            case 'class' :{
                value = this.classes( sett );
                break;
            }
        }

        if( sett.hasOwnProperty( 'type' ) &&
            sett.type.hasOwnProperty( 'input' ) &&
            sett.type.input == 'mselect' )
                value += '[]';


        if( value )
            rett = attr + '="' + value + '"';

        return rett;
    },
    field : function( sett ){
        if( sett.hasOwnProperty( 'type' ) &&  
            sett.type.hasOwnProperty( 'field' ) &&
            this.hasOwnProperty( sett.type.field )
        ){
            return this[ sett.type.field ]( sett );
        }
        else{
            console.log( '-- ahtml Object ----------------------------------' );
            console.log( 'Field not exist : [ ' + this.name( sett ) + ' ]' );
            console.log( '--------------------------------------------------' );
            console.log( sett );
        }
    },
    fieldID : function( sett ){
        if( sett.hasOwnProperty( 'fieldID' ) &&
            sett.fieldID.length 
        )
            return sett.fieldID;
        
        if( sett.hasOwnProperty( 'slug' ) &&
            sett.hasOwnProperty( 'slug' )
        )
            return this.deff.prefix.field + sett.slug;
        
        return '';
    },
    fieldClasses : function( sett ){
        if( sett.hasOwnProperty( 'fieldClass' ) &&
            typeof sett.fieldClass != 'undefined' &&
            sett.fieldClass.length 
        )
            return sett.fieldClass;
        
        if( sett.hasOwnProperty( 'slug' ) &&
            sett.hasOwnProperty( 'slug' )
        )
            return  this.deff.prefix.field + sett.slug;
        
        return '';
    },
    /* DISPLAY MODE */
    inlist: function( sett ){
        var type = null;
        var rett = '';
        
        if( this.hasOwnProperty( sett.type.input ) )
            type = sett.type.input;
        
        if( type ){
            rett += '<div class="mythemes-plg-ahtml-inlist ' + this.fieldClasses( sett ) + '">';
            
            rett += '<div class="label">';
            rett += this.label( sett );
            rett += '</div>';
            
            rett += '<div class="input">';
            rett += this[ type ]( sett );
            rett += '</div>';
            
            rett += this.hint( sett );
            
            rett += '<div class="clear"></div>';
            rett += '</div>';
        }
        
        
        return rett;
    },
    inline : function( sett ){
        var type = null;
        var rett = '';
        
        if( this.hasOwnProperty( sett.type.input ) )
            type = sett.type.input;
        
        if( type ){
            rett += '<div class="mythemes-plg-ahtml-inline ' + this.fieldClasses( sett ) + '">';
            
            rett += '<div class="label">';
            rett += this.label( sett );
            rett += '</div>';
            
            rett += '<div class="input">';
            rett += this[ type ]( sett );
            rett += '</div>';
            
            rett += this.hint( sett );
            
            rett += '<div class="clear"></div>';
            rett += '</div>';
        }
        
        return rett;
    },
    none : function( sett ){
        var rett = '';
        if( sett.hasOwnProperty( 'content' ) )
            rett = sett.content;
        
        return rett;
    },
    /* LABEL */
    label : function( sett ){
        var rett = '';
        
        if( sett.hasOwnProperty( 'label' ) )
            rett = '<label ' + this.attr( sett , 'for' ) + '">' + sett.label + '</label>';
        
        return rett; 
    },
    /* HINT */
    hint : function( sett ){
        var rett = '';
        if( sett.hasOwnProperty( 'hint' ) ){
            rett += '<div class="hint">';
            rett += '<small>' + sett.hint + '</small>';
            rett += '</div>';
        }
        
        return rett;
    },
    /* HIDE */
    hidden : function( sett ){
        return '<input type="hidden" '
            + this.attr( sett , 'id' ) + ' '
            + this.attr( sett , 'class' ) + ' '
            + this.attr( sett , 'name' ) + ' '
            + this.textValue( sett ) + ' >';
    },
    /* TEXT */
    text : function( sett ){
        return '<input type="text" '
            + this.attr( sett , 'id' ) + ' '
            + this.attr( sett , 'class' ) + ' '
            + this.attr( sett , 'name' ) + ' '
            + this.placeholder( sett ) + ' '
            + this.textValue( sett ) + ' >';
    },
    textValue : function( sett )
    {
        var value = '';
        
        if( sett.hasOwnProperty( 'value' ) )
            value = sett.value;
        
        return 'value="' + value + '"';
    },
    /* TEXT AREA */
    textarea : function( sett ){
        return '<textarea '
            + this.attr( sett , 'id' ) + ' '
            + this.attr( sett , 'class' ) + ' '
            + this.attr( sett , 'name' ) + '>'
            + this.textareaValue( sett ) 
            + '</textarea>';
    },
    textareaValue : function( sett )
    {
        var value = '';
        
        if( sett.hasOwnProperty( 'value' ) )
            value = sett.value;
        
        return value;
    },
    /* SELECT  */
    select : function( sett ){
        return '<select '
        + this.attr( sett , 'id' ) + ' '
        + this.attr( sett , 'class' ) + ' '
        + this.attr( sett , 'name' ) +  ' '
        + this.selectAction( sett ) + '>'
        + this.selectValue( sett ) 
        + '</select>';
    },
    selectValue : function( sett ){
        var value = null;
        var rett = '';
        
        if( sett.hasOwnProperty( 'value' ) )
            value = sett.value;
        
        if( sett.hasOwnProperty( 'values' ) )
            for( var index in sett.values ){
                rett += '<option value="' + index + '" ' + this.selected( value , index ) + '>' + sett.values[ index ] + '</option>';
            }
            
        return rett;
    },
    selectAction : function( sett ){
        
        if( sett.hasOwnProperty( 'action' ) && typeof sett.action == 'function' )
            return 'onchange="javascript:' + sett.action() + '"';

        if( sett.hasOwnProperty( 'action' ) )
            return 'onchange="javascript:mythemes_plg_ahtml.is_selected( this , ' + JSON.stringify( sett.action ).replace( /"/g , "'" ) + ');"';
        
        return '';
    },
    /* MULTIPLE SELECT */
    mselect : function( sett ){
        return '<select '
        + this.attr( sett , 'id' ) + ' '
        + this.attr( sett , 'class' ) + ' '
        + this.attr( sett , 'name' ) +  ' multiple="multiple">'
        + this.mselectValue( sett )
        + '</select>';
    },
    mselectValue : function( sett ){
        var values  = new Array();
        var rett    = '';
        
        if( sett.hasOwnProperty( 'value' ) )
            values = sett.value;
        
        
        if( sett.hasOwnProperty( 'values' ) )
            for( var index in sett.values ){ //v
                if( values.contains( index ) ){
                    rett += '<option value="' + index + '" ' + this.selected( index , index ) + '>' . values[ index ] + '</option>';
                }else{
                    rett += '<option value="' + index + '">' . values[ index ] + '</option>';
                }
            }
            
            
        return rett;
    },
    /* LOGIC */
    logic : function( sett ){
        return '<input type="checkbox" value="1" '
        + this.attr( sett , 'id' ) + ' '
        + this.attr( sett , 'class' ) + ' '
        + this.attr( sett , 'name' ) + ' '
        + this.logicAction( sett ) + ' '        
        + this.logicCheck( sett ) + '>';
    },
    logicCheck : function( sett )
    {
        var value = null;
        
        if( sett.hasOwnProperty( 'value' ) )
            value = sett.value;
        
        return this.checked( '1' , value );
    },
    logicAction : function( sett )
    {
        var action = '';
        
        if( sett.hasOwnProperty( 'action' ) )
            action = 'onclick="javascript:mythemes_plg_ahtml.is_checked( this , ' + JSON.stringify( sett.action ).replace( /"/g , "'" ) + ');"';
        
        return action;
    },
    /* COLOR */
    color : function( sett )
    {   
        var action = '';
        
        if( sett.hasOwnProperty( 'action' ) ){
            action = " rel='" + sett.action + "' ";
        }
        
        if( sett.hasOwnProperty( 'inputClass' ) ){
            sett.inputClass += ' mythemes-plg-pickcolor';
        }else{
            sett.inputClass = 'mythemes-plg-pickcolor';
        }
     
        var inputName = this.op_name( sett );
        
        return '<input type="text" '
        + action
        + this.attr( sett , 'id' ) + ' '
        + this.attr( sett , 'class' ) + ' '
        + this.attr( sett , 'name' ) + ' '
        + 'op_name="' + inputName + '" '
        + this.textValue( sett ) + '>'
        + '<a href="javascript:void(0);" class="pickcolor hide-if-no-js" id="link-pick-' + inputName + '"></a>'
        + '<div id="color-panel-' + inputName + '" class="color-panel"></div>';
    },
    init : {
        color : function( )
        {
            jQuery(function(){
                jQuery('input.mythemes-plg-pickcolor').each(function( index ) {
                    var farbtastic;
                    var $obj = this;
                    var self = this;
                    (function(jQuery){
                        var pickColor = function( a ) {
                            farbtastic.setColor( a );
                            jQuery( '#' + jQuery( $obj ).attr( 'op_name' ) ).val( a );
                            jQuery( '#link-pick-' + jQuery( $obj ).attr( 'op_name' ) ).css( 'background-color' , a );
                            if( jQuery( self ).attr( 'rel' ) !== undefined ){
                                var attr = jQuery( self ).attr( 'rel' );
                                fn_attr = function(){
                                    try{
                                        //console.log( attr );
                                        eval( attr );
                                    }catch ( e ){
                                        if (e instanceof SyntaxError) {
                                            console.log( (e.message) );
                                        }
                                    }
                                };
                                fn_attr();
                                
                            }
                        };

                        jQuery(document).ready( function() {

                            farbtastic = jQuery.farbtastic( '#color-panel-'  + jQuery( $obj ).attr( 'op_name' ) , pickColor );

                            pickColor( jQuery( '#' + jQuery( $obj ).attr( 'op_name' ) ).val() );

                            jQuery( '#link-pick-' + jQuery( $obj ).attr( 'op_name' ) ).click( function( e ) {
                                jQuery( '#color-panel-'  + jQuery( $obj ).attr( 'op_name' ) ).show();
                                e.preventDefault();
                            });

                            jQuery( '#' + jQuery( $obj ).attr( 'op_name' ) ).keyup( function() {
                                var a = jQuery( '#pick-' + jQuery($obj).attr('op_name') ).val(),
                                    b = a;

                                a = a.replace( /[^a-fA-F0-9]/ , '');
                                if ( '#' + a !== b )
                                    jQuery( '#' + jQuery($obj).attr( 'op_name' ) ).val( a );
                                if ( a.length === 3 || a.length === 6 )
                                    pickColor( '#' + a );
                            });

                            jQuery(document).mousedown( function() {
                                jQuery('#color-panel-'  + jQuery( $obj ).attr( 'op_name' ) ).hide();
                            });
                        });
                    })(jQuery);
                });
            });
        },
        all : function(){
            this.color();
        }
    },
    
    
    /* SELECTED */
    selected : function( value, selected ){
        var rett = '';
        if( value == selected ){
            rett = 'selected="selected"';
        }
    
        return rett;
    },
    is_selected : function( selector , args ){
        jQuery(function(){
            jQuery( 'option' , jQuery( selector ) ).each(function(){
                if( jQuery( this ).is(':selected') ){
                    var val = jQuery( this ).val().trim();
                    for ( var key in args ) {
                        if( key == 'show' ){
                            for( var i = 0; i < args[ key ].length; i++ ){
                                if( !(args[ val ] && typeof args[ val ].hide == 'array' &&
                                    args[ val ].hide.contain( args[ key ][ i ] )) ){
                                    jQuery( args[ key ][ i ] ).show('slow');
                                }
                            }
                            continue;
                        }

                        if( key == 'hide' ){
                            for( var i = 0; i < args[ key ].length; i++ ){
                                if( !(args[ val ] && typeof args[ val ].show == 'object' &&
                                    args[ val ].show.contains( args[ key ][ i ] )) ){
                                    jQuery( args[ key ][ i ] ).hide('slow');
                                }
                            }
                            continue;
                        }
                        if( key == val ){
                            if( args[ key ].hasOwnProperty( 'show' ) ){
                                for( var i = 0; i < args[ key ].show.length; i++ ){
                                    jQuery( args[ key ].show[ i ] ).show('slow');
                                }
                            }
                            if( args[ key ].hasOwnProperty( 'hide' ) ){
                                for( var i = 0; i < args[ key ].hide.length; i++ ){
                                    jQuery( args[ key ].hide[ i ] ).hide('slow');
                                }
                            }
                        }
                        else{
                            if( args[ key ].hasOwnProperty( 'hide' ) ){
                                for( var i = 0; i < args[ key ].hide.length; i++ ){
                                    jQuery( args[ key ].hide[ i ] ).hide('slow');
                                }
                            }
                        }
                    }
                }
            });
        });
    },
    /* CHECKED */
    checked : function( value, checked ){
        var rett = '';
        if( value == checked ){
            rett = 'checked="checked"';
        }
    
        return rett;
    },
    is_checked : function( selector , args ){
        jQuery(function(){
            if( jQuery( selector ).is(':checked') ){
                if( args.show && args.show.length ){
                    for( var i = 0; i < args.show.length; i++ ){
                        jQuery( args.show[ i ] ).show('slow');
                    }
                }

                if( args.hide && args.hide.length ){
                    for( var i= 0; i < args.hide.length; i++ ){
                        jQuery( args.hide[ i ] ).hide('slow');
                    }
                }
            }
            else{
                if( args.hide && args.hide.length ){
                    for( var i = 0; i < args.hide.length; i++ ){
                        jQuery( args.hide[ i ] ).show('slow');
                    }
                }

                if( args.show && args.show.length ){
                    for( var i= 0; i < args.show.length; i++ ){
                        jQuery( args.show[ i ] ).hide('slow');
                    }
                }
            }
        });
    }
};

mythemes_plg_ahtml.init.all();