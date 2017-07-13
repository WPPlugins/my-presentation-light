<?php
if( !class_exists( 'mythemes_plg_ahtml' ) ){

class mythemes_plg_ahtml
{
    /* ID */
    static function id( $sett )
    {
        if( isset( $sett[ 'inputID' ] ) && !empty( $sett[ 'inputID' ] ) )
            return  $sett[ 'inputID' ];
        
        if( isset( $sett[ 'slug' ] ) && !empty( $sett[ 'slug' ] ) )
            return 'mythemes-plg-' . $sett[ 'slug' ];
        
        return null;
    }
    
    /* NAME */
    static function name( $sett )
    {
        if( isset( $sett[ 'inputName' ] ) && !empty( $sett[ 'inputName' ] ) )
            return  $sett[ 'inputName' ];
        
        if( isset( $sett[ 'slug' ] ) && !empty( $sett[ 'slug' ] ) )
            return 'mythemes-plg-' . $sett[ 'slug' ];
        
        return null;
    }
    
    /* CLASS */
    static function classes( $sett )
    {
        $rett = '';
        
        if( isset( $sett[ 'inputClass' ] ) && !empty( $sett[ 'inputClass' ] ) )
            $rett = $sett[ 'inputClass' ] . ' ';
        
        if( isset( $sett[ 'slug' ] ) && !empty( $sett[ 'slug' ] ) )
            $rett .= 'mythemes-plg-' . $sett[ 'slug' ];
        
        return $rett;
    }
    
    /* ATTR FOR ID, NAME, CLASS */
    static function attr( $sett , $attr )
    {
        $value = null;
        
        switch( $attr ){
            case 'for':
            case 'id' :{
                $value = self::id( $sett );
                break;
            }
            case 'name' :{
                $value = self::name( $sett );
                break;
            }
            case 'class' :{
                $value = self::classes( $sett );
                break;
            }
        }
        
        if( isset( $sett[ 'type' ][ 'input' ] ) &&  $sett[ 'type' ][ 'input' ] == 'mselect' )
            $value .= '[]';
        
        $rett = null;
        if( !empty( $value ) )
            $rett = $attr . '="' . $value . '"';
        
        return $rett;
    }
    
    /* FIELD */
    static function field( $sett )
    {
        if( isset( $sett[ 'type' ][ 'field' ] ) && method_exists( new mythemes_plg_ahtml() , $sett[ 'type' ][ 'field' ] ) ) {
            return call_user_func_array( array( new mythemes_plg_ahtml() , $sett[ 'type' ][ 'field' ] ) , array( $sett ) );
        }
        else{
            ob_start();
            print_r( $sett );
            $data = ob_get_clean();
            
            $bt = debug_backtrace();
            $caller = array_shift( $bt );
            
            $result  = '<pre>' . $caller[ 'file' ] . ' : ' . $caller[ 'line' ];
            $result .= '<br>Field not exist : [ ' . self::name( $sett ) . ' ]';
            $result .= '<br>' . $data .'</pre>';
            return $result;
        }
    }
    
    /* FIELD ID */
    static function fieldID( $sett )
    {
        if( isset( $sett[ 'fieldID' ] ) && !empty( $sett[ 'fieldID' ] ) )
            return  $sett[ 'fieldID' ];
        
        if( isset( $sett[ 'slug' ] ) && !empty( $sett[ 'slug' ] ) )
            return 'mythemes-plg-field-' . $sett[ 'slug' ];
        
        return null;
    }
    
    /* FIELD CLASS */
    static function fieldClasses( $sett )
    {
        
        if( isset( $sett[ 'fieldClass' ] ) && !empty( $sett[ 'fieldClass' ] ) )
            return  $sett[ 'fieldClass' ];
        
        if( isset( $sett[ 'slug' ] ) && !empty( $sett[ 'slug' ] ) )
            return 'mythemes-plg-field-' . $sett[ 'slug' ];
        
        return null;
    }
    
    static function inlist( $sett )
    {
        $type = null;
        if( method_exists( new mythemes_plg_ahtml() , $sett[ 'type' ][ 'input' ] ) )
                $type = $sett[ 'type' ][ 'input' ];
        
        $rett = '';
        
        if( !empty( $type ) ){
            $rett .= '<div class="inlist-type ' . self::fieldClasses( $sett ) . '">';
            
            $rett .= '<div class="label">';
            $rett .= self::label( $sett );
            $rett .= '</div>';
            $rett .= '<div class="input">';
            
            $rett .= call_user_func_array( array( new mythemes_plg_ahtml() , $type ) , array( $sett ) );
            $rett .= self::hint( $sett );
            $rett .= '</div>';
            $rett .= '<div class="clear"></div>';
            $rett .= '</div>';
        }
        
        return $rett;
    }
    
    static function inline( $sett )
    {
        $type = null;
        if( method_exists( new mythemes_plg_ahtml() , $sett[ 'type' ][ 'input' ] ) )
                $type = $sett[ 'type' ][ 'input' ];
        
        $rett = '';
        
        if( !empty( $type ) ){
            $rett .= '<div class="inline-type ' . self::fieldClasses( $sett ) . '">';
            
            $rett .= '<div class="label">';
            $rett .= self::label( $sett );
            $rett .= '</div>';
            $rett .= '<div class="input">';
            
            $rett .= call_user_func_array( array( new mythemes_plg_ahtml() , $type ) , array( $sett ) );
            $rett .= self::hint( $sett );
            $rett .= '</div>';
            $rett .= '<div class="clear"></div>';
            $rett .= '</div>';
        }
        
        return $rett;
    }
    
    static function none( $sett )
    {
        $rett = null;
        if( isset( $sett[ 'content' ] ) )
            $rett = $sett[ 'content' ];
        
        return $rett;
    }
    
    static function label( $sett )
    {   
        $rett = '';
        
        if( isset( $sett[ 'label' ] ) )
            $rett = '<label ' . self::attr( $sett, 'for' ) . '">' . $sett[ 'label' ] . '</label>';
        
        return $rett; 
    }
    
    static function hint( $sett )
    {
        if( isset( $sett[ 'hint' ] ) && !empty( $sett[ 'hint' ] ) ){
            return '<small class="mythemes-plg-hint">' . $sett[ 'hint' ] . '</small>';
        }
    }
    
    /* TEXT */
    static function text( $sett )
    {
        return '<input type="text" '
                . self::attr( $sett , 'id' ) . ' '
                . self::attr( $sett , 'class' ) . ' '
                . self::attr( $sett , 'name' ) . ' '
                . self::textValue( $sett ) . ' >';
    }
    
    static function textValue( $sett )
    {
        $value = null;
        
        if( isset( $sett[ 'value' ] ) )
            $value = $sett[ 'value' ];
        
        return 'value="' . $value . '"';
    }
    
    /* TEXTAREA */
    static function textarea( $sett )
    {
        return '<textarea '
                . self::attr( $sett , 'id' ) . ' '
                . self::attr( $sett , 'class' ) . ' '
                . self::attr( $sett , 'name' ) . '>'
                . self::textareaValue( $sett ) 
                . '</textarea>';
    }
    
    static function textareaValue( $sett )
    {
        $value = null;
        
        if( isset( $sett[ 'value' ] ) )
            $value = $sett[ 'value' ];
        
        return $value;
    }

    static function code_js( $sett )
    {
        return '<div><textarea '
                . self::attr( $sett , 'id' ) . ' '
                . self::attr( $sett , 'class' ) . ' '
                . self::attr( $sett , 'name' ) . '>'
                . self::textareaValue( $sett ) 
                . '</textarea></div>' . 
                '<script>'.
                'var editor_' . str_replace( '-', '_' , self::id( $sett ) ) . ' = CodeMirror.fromTextArea(document.getElementById( \'' . self::id( $sett ) . '\' ), {
                    styleActiveLine: true,
                    lineNumbers: true,
                    lineWrapping: false,
                    matchBrackets: true,
                    mode : "javascript"
                });'.
                '</script>';
    }

    static function code_css( $sett )
    {
        return '<div><textarea '
                . self::attr( $sett , 'id' ) . ' '
                . self::attr( $sett , 'class' ) . ' '
                . self::attr( $sett , 'name' ) . '>'
                . self::textareaValue( $sett ) 
                . '</textarea></div>' . 
                '<script>'.
                'var editor_' . str_replace( '-', '_' , self::id( $sett ) ) . ' = CodeMirror.fromTextArea(document.getElementById( \'' . self::id( $sett ) . '\' ), {
                    styleActiveLine: true,
                    lineNumbers: true,
                    lineWrapping: false,
                    matchBrackets: true,
                    mode : "text/css"
                });'.
                '</script>';
    }
    
    /* MULTIPLE SELECT */
    static function mselect( $sett ){
        return '<select '
            . self::attr( $sett , 'id' ) . ' '
            . self::attr( $sett , 'class' ) . ' '
            . self::attr( $sett , 'name' ) .  ' multiple="multiple">'
            . self::mselectValue( $sett ) 
            . '</select>';
    }
    
    static function mselectValue( $sett )
    {
        $values = array();
        
        if( isset( $sett[ 'value' ] ) )
            $values = (array)$sett[ 'value' ];
        
        $rett = '';
        if( isset( $sett[ 'values' ] ) )
            foreach( $sett[ 'values' ] as $index => $v ){
                if( in_array( $index , $values ) ){
                    $rett .= '<option value="' . $index . '" ' . selected( $index , $index , false ) . '>' . $v . '</option>';
                }else{
                    $rett .= '<option value="' . $index . '">' . $v . '</option>';
                }
            }
            
            
        return $rett;
    }
    
    /* SELECT */
    static function select( $sett )
    {
        return '<select '
                . self::attr( $sett , 'id' ) . ' '
                . self::attr( $sett , 'class' ) . ' '
                . self::attr( $sett , 'name' ) .  ' '
                . self::selectAction($sett) . '>'
                . self::selectValue( $sett ) 
                . '</select>';
    }
    
    static function selectValue( $sett )
    {
        $value = null;
        
        if( isset( $sett[ 'value' ] ) )
            $value = $sett[ 'value' ];
        
        $rett = '';
        if( isset( $sett[ 'values' ] ) )
            foreach( $sett[ 'values' ] as $index => $v ){
                $rett .= '<option value="' . $index . '" ' . selected( $value , $index , false ) . '>' . $v . '</option>';
            }
            
        return $rett;
    }
    static function selectAction( $sett )
    {
        $action = '';
        
        if( isset( $sett[ 'action' ] ) )
            $action = 'onchange="javascript:mythemes_plg_ahtml.is_selected( this , ' . $sett[ 'action' ] . ');"';
        
        if( isset( $sett[ 'ajax' ] ) )
            $action = 'onchange="javascript:' . $sett[ 'ajax' ] . '"';
        
        return $action;
    }
    
    /* LOGIC */
    static function logic( $sett )
    {
        return '<input type="checkbox" value="1" '
            . self::attr( $sett , 'id' ) . ' '
            . self::attr( $sett , 'class' ) . ' '
            . self::attr( $sett , 'name' ) . ' '
            . self::logicAction( $sett ) . ' '        
            . self::logicCheck( $sett ) . '>';
    }
    
    static function logicCheck( $sett )
    {
        $value = null;
        
        if( isset( $sett[ 'value' ] ) )
            $value = $sett[ 'value' ];
        
        return checked( '1' , $value , false);
    }
    
    static function logicAction( $sett )
    {
        $action = '';
        
        if( isset( $sett[ 'action' ] ) )
            $action = 'onclick="javascript:mythemes_plg_ahtml.is_checked( this , ' . $sett[ 'action' ] . ');"';
        
        return $action;
    }
    
    /* COLOR */
    static function color( $sett )
    {   
        $action = null;
        
        if( isset( $sett[ 'action' ] ) ){
            $action = ' rel="' . $sett[ 'action' ] . '" ';
        }
        
        if( isset( $sett[ 'inputClass' ] ) )
            $sett[ 'inputClass' ] .= ' mythemes-plg-pickcolor';
        else
            $sett[ 'inputClass' ] = 'mythemes-plg-pickcolor';
     
        $inputName = self::name( $sett );
        
        return '<input type="text" '
            . $action
            . self::attr( $sett , 'id' ) . ' '
            . self::attr( $sett , 'class' ) . ' '
            . self::attr( $sett , 'name' ) . ' '
            . 'op_name="' . $inputName . '" '
            . self::textValue( $sett ) . '>'
            . '<a href="javascript:void(0);" class="pickcolor hide-if-no-js" id="link-pick-' . $inputName . '"></a>'
            . '<div id="color-panel-' . $inputName . '" class="color-panel"></div>';
    }
    static function key( $sett )
    {   
        if( isset( $sett[ 'inputClass' ] ) )
            $sett[ 'inputClass' ] .= ' mythemes-plg-key-chars';
        else
            $sett[ 'inputClass' ] = 'mythemes-plg-key-chars';
        
        return '<input type="hidden" '
            . self::attr( $sett , 'id' ) . ' '
            . self::attr( $sett , 'class' ) . ' '
            . self::attr( $sett , 'name' ) . ' '
            . self::textValue( $sett ) . '>'
            . '<input type="text" '
            . 'id="' . self::id( $sett ) . '-key-chars"/>';
    }
    
    /* UPLOAD */
    static function upload( $sett )
    {
        
    }
    
    /* SEARCH */
    static function search( $sett )
    {
        
    }
    
    /* VALIDATOR */
    static function validator( $val )
    {
        return esc_attr( $val );
    }
    static function logicValidator( $val )
    {
        return (int)$val ? 1 : 0;
    }
    static function digitValidator( $val )
    {
        return (int)$val;
    }
    static function urlValidator( $val )
    {
        return esc_url( $val );
    }
    static function noneValidator( $val )
    {
        $rett = array();
        
        if( is_array( $val ) ){
            foreach( $val as $key => & $d ){
                $rett[] = $d;
            }
        }
        else{
            $rett = $val;
        }
        return $rett;
    }
    static function getValidatorType( $sett )
    {
        if( !isset( $sett[ 'type' ][ 'validator' ] ) && !isset( $sett[ 'type' ][ 'input' ] ) ){
            return 'noneValidator';
        }
        
        if( !isset( $sett[ 'type' ][ 'validator' ] ) ){ /* DEFAULT VALIDATOR TYPE */
            switch( $sett[ 'type' ][ 'input' ] ){
                case 'search':
                case 'digit' : {
                    return 'digitValidator';
                }
                case 'logic' : {
                    return 'logicValidator';
                }
                case 'upload': {
                    return 'urlValidator';
                }
                default : {
                    return 'validator';
                }
            }
        }
        else{
            return $sett[ 'type' ][ 'validator' ];
        }
    }
    
    /* ADITIONAL ELEMENTS */
    /* $sett = array(
        array(
            'title' => ''
            'current' => true
        )
    ); */
    static function tabber( $sett )
    {
        $rett = '';
        $content = '';
        
        $rett .= '<div class="mythemes-plg-tabber">';
        
        $rett .= '<div class="mythemes-plg-tabber-header">';
        $rett .= '<nav>';
        $rett .= '<ul>';
        
        foreach( $sett as $k => $s ){
            $classes = '';
            if( isset( $s[ 'current' ] ) && $s[ 'current' ] )
                $classes = 'current';
            
            $rett .= '<li class="' . $classes . '">' . $s[ 'title' ] . '</li>';
            $content .= '<div class="mythemes-plg-tabber-item ' . $classes . '">';
            $content .= $s[ 'content' ];
            $content .= '</div>';
        }
        
        $rett .= '</ul>';
        $rett .= '</nav>';
        $rett .= '</div>';
        
        $rett .= '<div class="mythemes-plg-tabber-content">';
        $rett .= $content;
        $rett .= '</div>';
        
        $rett .= '</div>';
        
        return $rett;
    }
}

} /* END IF CLASS EXISTS */
?>