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
 * Preprocesses the wrapping HTML.
 *
 * @param array &$variables
 *   Template variables.
 */
function winacc_theme_preprocess_html(&$vars) {
  // Setup IE meta tag to force IE rendering mode.
  $meta_ie_render_engine = array(
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => array(
      'http-equiv' => 'X-UA-Compatible',
      'content' =>  'IE=edge,chrome=1',
    ),
    '#weight' => '-99999',
  );
  // Add header meta tag for IE to head
  drupal_add_html_head($meta_ie_render_engine, 'meta_ie_render_engine');
}


/**
 * Implements hook_js_alter().
 */
function winacc_theme_js_alter(&$js) {
  // Unset some panopoly css.
  $radix_path = drupal_get_path('theme', 'radix');
  if (isset($js[$radix_path . '/assets/javascripts/radix-script.js'])) {
    unset($js[$radix_path . '/assets/javascripts/radix-script.js']);
  }
  if (isset($js['http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js'])) {
    unset($js['http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js']);
  }
}

/**
 * Implements hook_theme().
 */
/*function winacc_theme_theme($existing, $type, $theme, $path) {
  return array(
    'menu_local_actions' => array(
      'variables' => array('menu_actions' => NULL, 'attributes' => NULL),
      'file' => 'includes/menu.inc',
    ),
  );
}*/

/**
 * Override or insert variables into the page template.
 *
 * Implements template_process_page().
 */
function winacc_theme_process_page(&$variables) {
  //drupal_add_css('http://fonts.googleapis.com/css?family=Asap:400,700,700italic,400italic', 'external');
  // Hook into color.module.
  if (module_exists('color')) {
    _color_page_alter($variables);
  }

  // Define variables to theme local actions as a dropdown.
  $dropdown_attributes = array(
    'container' => array(
      'class' => array('dropdown', 'actions', 'pull-right'),
    ),
    'toggle' => array(
      'class' => array('dropdown-toggle', 'enabled'),
      'data-toggle' => array('dropdown'),
      'href' => array('#'),
    ),
    'content' => array(
      'class' => array('dropdown-menu'),
    ),
  );
/*
  // Add local actions as the last item in the local tasks.
  if (!empty($variables['action_links'])) {
    if (!isset($variables['tabs']['#primary'])) {
      // No tabs set, and they've already been proceessed by now, so add
      // ul wrapper that would otherwise be missed.
      $variables['tabs']['primary']['#prefix'] = '<ul class="nav nav-pills">';
      $variables['tabs']['primary']['#suffix'] = '</ul>';
    }
    $variables['tabs']['primary'][]['#markup'] = theme('menu_local_actions', array('menu_actions' => $variables['action_links'], 'attributes' => $dropdown_attributes));
    $variables['action_links'] = FALSE;
  }
*/
  // Get the entire main menu tree.
  $main_menu_tree = array();
  $main_menu_tree = menu_tree_all_data('main-menu', NULL, 2);
  // Add the rendered output to the $main_menu_expanded variable.
  $variables['main_menu_expanded'] = menu_tree_output($main_menu_tree);

  // Get the entire Topic menu tree.
  $topic_menu_tree = array();
  $topic_menu_tree = menu_tree_all_data('menu-topics', NULL, 2);
  // Add the rendered output to the $topic_menu_tree variable.
  $variables['topic_menu_expanded'] = menu_tree_output($topic_menu_tree);

  // Always print the site name and slogan, but if they are toggled off, we'll
  // just hide them visually.
  $variables['hide_site_name']   = theme_get_setting('toggle_name') ? FALSE : TRUE;
  $variables['hide_site_slogan'] = theme_get_setting('toggle_slogan') ? FALSE : TRUE;
  if ($variables['hide_site_name']) {
    // If toggle_name is FALSE, the site_name will be empty, so we rebuild it.
    $variables['site_name'] = filter_xss_admin(variable_get('site_name', 'Drupal'));
  }
  if ($variables['hide_site_slogan']) {
    // If toggle_site_slogan is FALSE, the site_slogan will be empty,
    // so we rebuild it.
    $variables['site_slogan'] = filter_xss_admin(variable_get('site_slogan', ''));
  }
  // Since the title and the shortcut link are both block level elements,
  // positioning them next to each other is much simpler with a wrapper div.
  if (!empty($variables['title_suffix']['add_or_remove_shortcut']) && $variables['title']) {
    // Add a wrapper div using title_prefix and title_suffix render elements.
    $variables['title_prefix']['shortcut_wrapper'] = array(
      '#markup' => '<div class="shortcut-wrapper clearfix">',
      '#weight' => 100,
    );
    $variables['title_suffix']['shortcut_wrapper'] = array(
      '#markup' => '</div>',
      '#weight' => -99,
    );
    // Make sure the shortcut link is the first item in title_suffix.
    $variables['title_suffix']['add_or_remove_shortcut']['#weight'] = -100;
  }

  // If panels arent being used at all.
  $variables['no_panels'] = FALSE;
  if (!isset($variables['page']['content']['system_main']['main']['#markup']) || (strpos($variables['page']['content']['system_main']['main']['#markup'], 'panel-panel') === FALSE)) {
    $variables['no_panels'] = TRUE;
  }

  // form
  if (module_exists('search') && user_access('search content')) {
    $search_box_form = drupal_get_form('search_form');
    $search_box_form['#id'] = 'search-form';
    //print_r($search_box_form);
    $search_box_form['basic']['#attributes']['class'][] = 'input-append';
    $search_box_form['basic']['keys']['#title'] = '';
    $search_box_form['basic']['keys']['#attributes'] = array('placeholder' => 'Search WinACC');
    $search_box_form['basic']['keys']['#attributes']['class'][] = 'search-query';
    //$search_box_form['basic']['submit']
    $search_box_form['basic']['submit']['#access'] = FALSE;
    $search_box_form['basic']['submit2']['#prefix'] = '<button type="submit" class="btn btn-success" title="Search  WinACC">';
    $search_box_form['basic']['submit2']['#suffix'] = '</button>';
    $search_box_form['basic']['submit2']['#markup'] = '<i class="icon-search"></i>';
    //$search_box_form['basic']['submit']['#value'] = '<span class="icon-search"></span>';

    $search_box_form['#attributes']['class'] = array ('search-form');
    $search_box = drupal_render($search_box_form);
    $variables['search_form'] = (user_access('search content')) ? $search_box : NULL;
  }
}
