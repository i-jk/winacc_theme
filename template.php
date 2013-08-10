<?php
/**
 * @file
 * Theme functions
 */

$theme_path = drupal_get_path('theme', 'winacc_theme');
require_once $theme_path . '/includes/structure.inc';
require_once $theme_path . '/includes/form.inc';
require_once $theme_path . '/includes/menu.inc';
require_once $theme_path . '/includes/comment.inc';
require_once $theme_path . '/includes/node.inc';


/**
 * Implements hook_css_alter().
 */
function winacc_theme_js_alter(&$js) {
  // Unset some panopoly css.
  $radix_path = drupal_get_path('theme', 'radix');
  if (isset($js[$radix_path . '/assets/javascripts/radix-script.js'])) {
    unset($js[$radix_path . '/assets/javascripts/radix-script.js']);
  }
}
