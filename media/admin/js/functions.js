/* AJAX */
function mythemes_plg_resources( type ){
    jQuery(function(){
        jQuery.post( ajaxurl , {
            'action' : 'mythemes_plg_resources',
            'type' : type,
            'post_id' : jQuery( 'input#post_ID' ).val()
        }, function( result ){
            jQuery( 'div.mythemes-plg-resource' ).html( result );
        });
    });
}

jQuery(function(){
    jQuery('div.mythemes-plg-tabber').each(function(){
        var self = this;
        var current = jQuery( this ).find('div.mythemes-plg-tabber-header nav ul li.current').index();
        var current_cnt = jQuery( jQuery( this ).find('div.mythemes-plg-tabber-content div.mythemes-plg-tabber-item')[ current ] );
        var init_mirror = false;
        
        if( current_cnt.length && !current_cnt.hasClass( 'current' ) ){
            jQuery( this ).find('div.mythemes-plg-tabber-content div.mythemes-plg-tabber-item').removeClass( 'current' );
            current_cnt.addClass( 'current' );
        }
        
        jQuery( this ).find('div.mythemes-plg-tabber-header nav ul li').click(function(){
            var c = jQuery( this ).index();

            jQuery( self ).find('div.mythemes-plg-tabber-header nav ul li').removeClass( 'current' );
            jQuery( this ).addClass( 'current' );
            
            jQuery( self ).find('div.mythemes-plg-tabber-content div.mythemes-plg-tabber-item').removeClass( 'current' );
            var c_cnt = jQuery( jQuery( self ).find('div.mythemes-plg-tabber-content div.mythemes-plg-tabber-item')[ c ] );
            if( c_cnt.length ){
                c_cnt.addClass( 'current' );
                if( c == 2 && !init_mirror ){
                    
                    var editor_on_load = CodeMirror.fromTextArea(document.getElementById( 'mythemes-plg-on-load-page' ), {
                        styleActiveLine: true,
                        lineNumbers: true,
                        lineWrapping: false,
                        matchBrackets: true,
                        mode : "javascript"
                    });

                    var editor_on_start = CodeMirror.fromTextArea(document.getElementById( 'mythemes-plg-on-start' ), {
                        styleActiveLine: true,
                        lineNumbers: true,
                        lineWrapping: false,
                        matchBrackets: true,
                        mode : "javascript"
                    });

                    init_mirror = true;
                }
            }
        })
    });
    
    var type = jQuery( 'div.mythemes-plg-field-res_type select#mythemes-plg-res_type' ).val();
    mythemes_plg_resources( type );
});
