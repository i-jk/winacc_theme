<?php
/**
 * @file
 * Theme and preprocess functions for nodes
 */

/**
 * Implements theme_field__field_type().
 */
function winacc_theme_field__taxonomy_term_reference($variables) {
  $output = '';

  // Render the label, if it's not hidden.
  if (!$variables['label_hidden']) {
    $output .= '<strong class="field-label">' . $variables['label'] . ':&nbsp;</strong>';
  }

  $style = array(
    'container prefix' => '<ul class="links inline nav-pills">',
    'container suffix' => '</ul>',
    'list' => TRUE,
  );
  if ($variables['element']['#field_name'] == 'field_featured_categories') {
    $style = array(
      'container prefix' => '<div class="links">',
      'container suffix' => '</div>',
      'list' => FALSE,
      'a classes' => 'btn btn-block btn-info',
    );
  }

  // Render the items.
  //$output .= ($variables['element']['#label_display'] == 'inline') ?
  $output .= $style['container prefix'];
  foreach ($variables['items'] as $delta => $item) {
    if (isset($style['a classes'])) {
      // Ensure classes are added to 'a'.
      $item['#attributes']['class'][] = $style['a classes'];
    }
    $title = drupal_html_class($variables['element'][$delta]['#title']) ;
    if ($style['list'] === TRUE) {
      $output .= '<li class="' . $variables['item_attributes'][$delta] . '">' . drupal_render($item) . '</li>';
    }
    else {
      $output .= drupal_render($item);
    }
    //if ($variables['element']['#field_name'] == 'field_featured_categories') { print_r($item); exit; }
  }
  $output .= $style['container suffix'];

  // Render the top-level DIV.
  $output = '<div class="' . $variables['classes'] . (!in_array('clearfix', $variables['classes_array']) ? ' clearfix' : '') . '"' . $variables['attributes'] .'>' . $output . '</div>';

  return $output;
}
