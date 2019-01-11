<?php get_header(); ?>
  <div>
    <?php getProducts(array('status' => 'IN_QUEUE', 'page', 0)); ?>
  </div>
<?php get_footer(); ?>
