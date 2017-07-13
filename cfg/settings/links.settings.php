<?php

$sett = & mythemes_plg_cfg::$pages[ 'mythemes-plg-links' ][ 'content' ];

ob_start();
?>

    <div class="mythemes-plg-contact-large">
        <a href="http://twitter.com/my_themes" target="_blank" rel="nofollow" class="twitter-large" title="Follow us on Twitter - get best deals and news via Twitter"></a>
        <a href="http://facebook.com/myThemes" target="_blank" rel="nofollow" class="facebook-large" title="Facebook fan page - like our page and become a fan"></a>
    </div>

    <div class="mythemes-plg-contact-large">
        <a href="http://mythem.es/feed/" target="_blank" class="rss-large" title="Subscribe by RSS - get updates directly to your feed"></a>
        <a href="http://mythem.es/forums/topic/my-presentation-light/" target="_blank" class="support-large" title="Support forums - get instant help and support"></a>
    </div>

<?php

$links = ob_get_clean();

$sett[ 'links' ] = array(
    'type' => array(
        'field' => 'none'
    ),
    'content' => $links
);

?>