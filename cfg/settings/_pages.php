<?php

$pages = & mythemes_plg_cfg::$pages;

$pages[ 'mythemes-plg-general' ] = array(
    'menu' => array(
        'parent'  => __( 'My Presentations' , 'myThemes' ),
        'label'     => __( 'General Settings' , 'myThemes' ) ,
        'ico'	=> MYTHEMES_PLG_ICON
    ),
    'title' => __( 'General Settings for My Presentations' , 'myThemes' ),
    'description' => '',
    'content' => array()
);

$pages[ 'mythemes-plg-links' ] = array(
    'menu' => array(
        'label'     => 'myThem.es Links' ,
    ),
    'title' => 'myThem.es Links',
    'description' => '',
    'content' => array(),
    'update' => false
);
?>