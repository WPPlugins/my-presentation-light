<?php
$sett = & mythemes_plg_cfg::$pages[ 'mythemes-plg-general' ][ 'content' ];

$layouts = mythemes_plg_core::getLayouts();

if( !empty( $layouts ) ){
    foreach( $layouts as $key => &$d )
        $l[ $d[ 'id' ]  ] = $d[ 'title' ];
}
if( empty( $l ) ){
    
    $sett[ 'layout' ] = array(
        'type' => array(
            'field' => 'none',
            'validator' => 'noneValidator'
        ),
        'content' => '<p><span style="color: #990000">' . __( 'There are no layouts. To create a new layout see section "Layout Builder"' , 'myThemes' ) . '</span></p><br>'
    );
}
else{
    $sett[ 'layout' ] = array(
        'type' => array(
            'field' => 'inline',
            'input' => 'select'
        ),
        'values' => $l,
        'label' => __( 'Default Layout for Tooltips' , 'myThemes' )
    );
}

$sett[ 'width' ] = array(
    'type' => array(
        'field' => 'inline',
        'input' => 'text'
    ),
    'label' => __( 'Default Tooltip Width ( px )' , 'myThemes' )
);
$sett[ 'use-storage' ] = array(
    'type' => array(
        'field' => 'inline',
        'input' => 'logic'
    ),
    'label' => __( 'Use Storage' , 'myThemes' )
);

?>