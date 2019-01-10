<?php

function loadDeps() {
  wp_enqueue_style('mainstyles', get_template_directory_uri() . "/style.css", array(), microtime(true));
  wp_enqueue_script('mainscripts', get_template_directory_uri() . "/bundle.js");
}

add_action('wp_enqueue_scripts', 'loadDeps');
