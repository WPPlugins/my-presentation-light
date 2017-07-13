<?php

if( !isset( mythemes_plg_cfg::$posts ) ) {
    mythemes_plg_cfg::$posts = array();
}
$post = & mythemes_plg_cfg::$posts;

$post[ 'presentation' ] = array(
    'singularTitle' => __( 'Presentation' , 'myThemes' ),
    'pluralTitle' => __( 'Presentations' , 'myThemes' ),
    'fields' => array(
        'title'
    ),
    'menu_icon' => MYTHEMES_PLG_URL . '/media/admin/images/mythemes-plg-presentation.png'
);
?>