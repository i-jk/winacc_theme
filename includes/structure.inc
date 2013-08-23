<?php
/**
 * @file
 * Theme and preprocess functions for breadcrumbs, messages, tabs..etc
 */

/**
 * Implements theme_breadcrumb().
 * 
 * Put Breadcrumbs in a ul li structure
 */
function winacc_theme_breadcrumb($variables) {
  echo 'here';
  $breadcrumb = $variables['breadcrumb'];
  if (!empty($breadcrumb)) {
    $output = '<h2 class="element-invisible">' . t('You are here') . '</h2>';
    $output .= '<ul class="breadcrumb">';
    foreach($breadcrumb as $value) {
      $output .= '<li>' . $value . ' <span class="divider icon-angle-right">»</span></li>';
    }
    $output .= '<li class="active">' . drupal_get_title() . '</span>';
    $output .= '</ul>';
  }
  return $output;
}
  
/**
 * Implements hook_preprocess_views_view_table().
 */
function winacc_theme_preprocess_views_view_table(&$variables) {
  $rows = array();
  foreach ($variables['row_classes'] as $row) {
    // This assume the first element of any row will be the odd/even class which we no longer need
    array_shift($row);
    $rows[] = $row;
  }
  $variables['row_classes'] = $rows;
  
  // Add in bootstrap classes
  $variables['classes_array'] = array('table', 'table-striped', 'table-bordered', 'table-hover');
}

/**
 * Override or insert variables into the page template.
 *
 * Implements theme_menu_local_tasks().
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
 * HTML for individual local task links.
 *
 * Implements theme_menu_local_task().
 */
function winacc_theme_menu_local_task($variables) {
  $link = $variables['element']['#link'];
  $children = isset($variables['element']['#children']) ? $variables['element']['#children'] : FALSE;
  $link_text = $link['title'];
  $classes = array();

  if (!empty($variables['element']['#active'])) {
    // Add text to indicate active tab for non-visual users.
    $active = '<span class="element-invisible">' . t('(active tab)') . '</span>';

    // If the link does not contain HTML already, check_plain() it now.
    // After we set 'html'=TRUE the link will not be sanitized by l().
    if (empty($link['localized_options']['html'])) {
      $link['title'] = check_plain($link['title']);
    }
    $link['localized_options']['html'] = TRUE;
    $link_text = t('!local-task-title!active', array('!local-task-title' => $link['title'], '!active' => $active));

    $classes[] = 'active';
  }

  // If the primary link has children, render them as a dropdown.
  if ($children) {
    $classes[] = 'dropdown';
    $link['localized_options']['attributes']['class'][] = 'dropdown-toggle';
    $link['localized_options']['attributes']['data-toggle'][] = 'dropdown';
    $link['href'] = '#';
    $link_text .= ' <b class="caret"></b>';
    $output = '<li class="' . implode(' ', $classes) . '">';
    $output .= l($link_text, $link['href'], $link['localized_options']);
    $output .= '<ul class="dropdown-menu">';
    $output .= drupal_render($children);
    $output .= '</ul>';
    $output .= '</li>';
    return $output;
  }
  else {
    return '<li class="' . implode(' ', $classes) . '">' . l($link_text, $link['href'], $link['localized_options']) . "</li>\n";
  }
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
