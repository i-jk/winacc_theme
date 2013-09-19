<?php

/**
 * @file
 * Default theme implementation to display a single Drupal page.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see template_process()
 * @see html.tpl.php
 */
?>
<div id="primary-page">
  <header id="header" class="header" role="header">
    <div class="container clearfix">
      <?php if ($logo || $site_name): ?>
        <a href="<?php print $front_page; ?>" title="<?php print t('Home') . ' - ' . $site_name; ?>" rel="home" class="brand pull-right" data-toggle="tooltip">
          <?php if ($logo): ?>
            <img id="logo" src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" />
          <?php endif; ?>
          <h1 id="site-name" class="element-invisible"><?php print $site_name; ?></h1>
        </a>
      <?php endif; ?>
      <nav class='navbar navbar-main'>
        <div class="navbar-inner">

          <!-- .btn-navbar is used as the toggle for collapsed navbar content -->
          <a class="btn btn-navbar btn-navbar-menu" data-toggle="collapse" data-target=".nav-menu-collapse">
            <?php print t('Menu'); ?>
            <span class="icon-reorder"></span>
          </a>

          <div class="nav-collapse nav-menu-collapse">
            <div class="inner">
              <?php if ($main_menu_expanded): ?>
                <?php print theme('links__system_main_menu', array(
                  'links' => $main_menu_expanded,
                  'attributes' => array(
                    'class' => array('main-menu nav pull-left'),
                    'id' => array('main-menu'),
                    'role' => array('navigation'),
                  ),
                  'heading' => array(
                    'text' => t('Main menu'),
                    'level' => 'h2',
                    'class' => array('element-invisible'),
                  ),
                )); ?>
              <?php endif; ?>
            </div>
          </div>

        </div>
      </nav>
      <nav class='navbar navbar-topics pull-left'>
        <div class="navbar-inner">

          <!-- .btn-navbar-topics for collapsed topic menu content -->
          <?php if ($topic_menu_expanded): ?>
            <a class="btn btn-navbar btn-navbar-topics" data-toggle="collapse" data-target=".nav-topics-collapse">
              <?php print t('Topics'); ?>
              <span class="icon-lightbulb"></span>
            </a>
          <?php endif; ?>
          <div class="nav-collapse nav-topics-collapse">
            <div class="inner">
              <?php if ($topic_menu_expanded): ?>
                <?php print theme('links__system_main_menu', array(
                  'links' => $topic_menu_expanded,
                  'attributes' => array(
                    'class' => array('topic-menu nav pull-left'),
                    'id' => array('topic-menu'),
                    'role' => array('navigation'),
                  ),
                  'heading' => array(
                    'text' => t('Topic menu'),
                    'level' => 'h2',
                    'class' => array('element-invisible'),
                  ),
                )); ?>
              </div>
            </div>
          <?php endif; ?>
        </div>
      </nav> <!-- /# topic nav -->
    </div>
  </header>

  <div id="main-wrapper">
    <div id="main" class="main container">
      <?php if ($messages): ?>
        <div id="messages">
          <div class="container">
            <?php print $messages; ?>
          </div>
        </div>
      <?php endif; ?>
      <?php if ($breadcrumb || $search_form): ?>
        <div id="breadcrumb" class="navbar">
          <div class="container">
            <!-- .btn-navbar-search for collapsed search form -->
            <?php if ($search_form): ?>
              <a class="btn btn-navbar btn-navbar-searcher" data-toggle="collapse" data-target=".nav-search-collapse">
                <?php print t('Search'); ?>
                <span class="icon-search"></span>
              </a>
            <?php endif; ?>
            <div class="nav-collapse nav-search-collapse">
              <div class="inner">
                <?php if ($search_form): ?>
                  <?php print $search_form; ?>
                <?php endif; ?>
              </div>
            </div>
            <?php if ($breadcrumb): ?>          
              <?php print $breadcrumb; ?>
            <?php endif; ?>
          </div>
        </div>
      <?php endif; ?>
      <div id="content">
        <a id="main-content"></a>
        <div id="page-header">
            <div class="container">
              <?php if ($title): ?>
                <div class="page-header">
                  <h1 class="title"><?php print $title; ?></h1>
                </div>
              <?php endif; ?>
              <?php if ($tabs): ?>
                <div class="tabs">
                  <?php print render($tabs); ?>
                </div>
              <?php endif; ?>
              <?php if ($action_links): ?>
                <ul class="nav nav-pills action-links">
                  <?php print render($action_links); ?>
                </ul>
              <?php endif; ?>
            </div>
        </div>
        <?php print render($page['content']); ?>
      </div>
    </div>
  </div> <!-- /#main-wrapper -->
  <div id="primary-end">
    <div class="container"><small class="pull-right"><a href="#"><?php print t('Back to Top'); ?></a></small></div>
  </div>
  <div id="grass-bright"></div>
  <div id="grass-dark"></div>
</div>
<footer id="footer" class="footer" role="footer">
  <div class="container">
    <small class="copyright pull-left">&copy; <?php print date('Y'); ?>
      WinACC - <?php print $site_slogan; ?> | <a href="/contact">Contact</a> |
      <a href="/privacy-policy">Privacy Policy</a> | Powered by
      <a href="http://drupal.org">Drupal</a> | Website by
      <a href="http://www.i-jk.co.uk/"><strong>i-JK Drupal Solutions</strong></a>
    </small>
  </div>
</footer>