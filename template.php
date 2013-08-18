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

/**
 * Implements hook_theme().
 */
function winacc_theme_theme($existing, $type, $theme, $path) {
  return array(
    'menu_local_actions' => array(
      'variables' => array('menu_actions' => NULL, 'attributes' => NULL),
      'file' => 'includes/theme.inc',
    ),
  );
}

/**
 * Override or insert variables into the page template.
 *
 * Implements template_process_page().
 */
function winacc_theme_process_page(&$variables) {
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

  // Add local actions as the last item in the local tasks.
  if (!empty($variables['action_links'])) {
    $variables['tabs']['#primary'][]['#markup'] = theme('menu_local_actions', array('menu_actions' => $variables['action_links'], 'attributes' => $dropdown_attributes));
    $variables['action_links'] = FALSE;
  }

  // Get the entire main menu tree.
  $main_menu_tree = array();
  $main_menu_tree = menu_tree_all_data('main-menu', NULL, 2);
  // Add the rendered output to the $main_menu_expanded variable.
  $variables['main_menu_expanded'] = menu_tree_output($main_menu_tree);
  
  // Get the entire Topic menu tree.
  $topic_menu_tree = array();
  $topic_menu_tree = menu_tree_all_data('menu-topics', NULL, 2);
  // Add the rendered output to the $topic_menu_tree variable.
  $variables['topic_menu_tree'] = menu_tree_output($topic_menu_tree);

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
}
