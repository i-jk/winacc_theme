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
<header id="header" class="header" role="header">
  <div class="container clearfix">
        <?php if ($logo || $site_name): ?>
          <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home" id="logo" class="pull-left brand">
            <?php if ($logo): ?>
              <img src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" />
            <?php endif; ?>
            <?php if ($site_name): ?>
              <?php print $site_name; ?>
            <?php endif; ?>
          </a>
        <?php endif; ?>
    <nav class='navbar'>
      <div class="navbar-inner">
        <!-- .btn-navbar is used as the toggle for collapsed navbar content -->
        <a class="btn btn-navbar btn-navbar-menu" data-toggle="collapse" data-target=".nav-menu-collapse">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </a>
        <!-- .btn-navbar-search for collapsed search form -->
        <?php if ($search_form): ?>
          <a class="btn btn-navbar btn-navbar-search" data-toggle="collapse" data-target=".nav-search-collapse">
            <span class="icon-search"></span>
          </a>
        <?php endif; ?>

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
              <!--nav id="main-menu" class="main-menu pull-left" role="navigation">
                <?php //print render($main_menu); ?>
              </nav--> <!-- /#main-menu -->
          </div>
        </div>

        <div class="nav-collapse nav-search-collapse">
          <div class="inner">
            <?php if ($search_form): ?>
              <?php print $search_form; ?>
            <?php endif; ?>
          </div>
        </div>

      </div>
    </nav> <!-- /#navigation -->
  </div>
</header>

<div id="main-wrapper">
  <div id="main" class="main container">
    <?php if ($breadcrumb): ?>
      <div id="breadcrumb" class="visible-desktop">
        <div class="container">
          <?php print $breadcrumb; ?>
        </div>
      </div>
    <?php endif; ?>
    <?php if ($messages): ?>
      <div id="messages">
        <div class="container">
          <?php print $messages; ?>
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

<footer id="footer" class="footer" role="footer">
  <div class="container">
    <?php if ($copyright): ?>
      <small class="copyright pull-left"><?php print $copyright; ?></small>
    <?php endif; ?>
    <small class="pull-right"><a href="#"><?php print t('Back to Top'); ?></a></small>
  </div>
</footer>
