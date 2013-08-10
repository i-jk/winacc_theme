<?php
/**
 * @file
 * Theme and preprocess functions for breadcrumbs, messages, tabs..etc
 */
function winacc_theme_menu_local_tasks(&$variables) {
  $output = '';

  if (!empty($variables['primary'])) {
    $variables['primary']['#prefix'] = '<h2 class="element-invisible">' . t('Primary tabs') . '</h2>';
    $variables['primary']['#prefix'] = '<ul class="nav nav-pills">';
    $variables['primary']['#suffix'] = '</ul>';
    if (!empty($variables['secondary'])) {
      $variables = _winacc_theme_associate_parent_tasks($variables);
    }
    $output .= drupal_render($variables['primary']);
  }

  return $output;
}

/**
 * Associate all the secondary menu tasks as #children of primary tasks.
 */
function _winacc_theme_associate_parent_tasks($variables) {
  // Assign all secondary links as children of their parent primary link.
  foreach (_winacc_theme_element_children($variables['secondary']) as $secondary_index => $secondary_link) {
    $link = $secondary_link['#link'];
    foreach (_winacc_theme_element_children($variables['primary']) as $primary_index => $primary_link) {
      if (!isset($primary_link['#markup']) && $primary_link['#link']['path'] == $link['tab_parent']) {
        $variables['primary'][$primary_index]['#children'][] = $secondary_link;
        unset($variables['secondary'][$secondary_index]);
      }
    }
  }

  // If a secondary link hasn't been assigned, make it a primary link.
  // @todo: this should never happen; consider removing?
  foreach ($variables['secondary'] as $secondary_link) {
    $variables['primary'][] = $secondary_link;
  }

  return $variables;
}

/**
 * Helper function to filter element children.
 *
 * See http://api.drupal.org/comment/34713#comment-34713
 */
function _winacc_theme_element_children($element) {
  return array_intersect_key(
    $element,
    array_flip(element_children($element))
  );
}
