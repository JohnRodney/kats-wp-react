<?php

include('theme-config.php');

function loadDeps() {
  wp_enqueue_style('mainstyles', get_template_directory_uri() . "/style.css", array(), microtime(true));
  wp_enqueue_script('mainscripts', get_template_directory_uri() . "/bundle.js");
}

function getProducts($query) {
  $status = $query['status'];
  $page = $query['page'];
  $eforoUrl = 'https://onlineposting.e-foro.com/items_api/get_items';
  $options = array(
    'headers' => array(
      'User-Agent' => 'allpawn-autobot-optimus-prime',
      'X-Authorization' => 'TOKEN ' . PRODUCTS_API_TOKEN
    )
  );
  $response = wp_remote_get($eforoUrl . '?status=' . $status . '&page=' . $page, $options);

  if (is_array($response) && ! is_wp_error($response)) {
    $headers = $response['headers']; // array of http header lines
    $body    = $response['body']; // use the content
  }

  return $body;
}

add_action('rest_api_init', function() {
  register_rest_route('allpawn/v1', '/products', array(
    'methods' => 'GET',
    'callback' => 'getProducts',
  ));
});

add_action('wp_enqueue_scripts', 'loadDeps');

/*

const { PRODUCTS_API_TOKEN } = Meteor.settings;

export default function getEforoProducts(page) {
  const options = {
    uri: 'https://onlineposting.e-foro.com/items_api/get_items',
    qs: { status: 'IN_QUEUE', page },
    headers: {
      'User-Agent': 'allpawn-autobot-optimus-prime',
      'X-Authorization': `TOKEN ${PRODUCTS_API_TOKEN}`,
    },
    json: true,
  };

  return new Promise((resolve, reject) => {
    rp(options)
      .then((results) => {
        resolve({ items: results.items, pageCount: results.page_count, page });
      }).catch(err => reject(err));
  });
}
 */
