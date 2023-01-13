/*jslint devel: true, browser: true, white: true, maxerr: 50 */
/*global $,
         phpFilterSearchObj, GlobalRefresh,
         phpProductionManagementObj,
         phpPageTrackerObj, ManageToggleActivateAutoSave,
         Newspress,
         methods, set_flag, start_submit_timer, start_display_timer, requests
*/

var refresh_grid_minutes = 3;
var refresh_hooks_seconds = 1.5;
var hooks_timer;

if (typeof $ === 'function' && typeof $.colorbox === 'function') {
  $.extend($.colorbox.settings, {
    transition: 'none',
    speed: 0,
    fadeOut: 0
  });
}

if (typeof methods === 'object') {

  // [Stories And Media]
  if (typeof phpFilterSearchObj === 'object') {

    methods.StopRefresh();
    phpFilterSearchObj.config.refresh_timer_count = (refresh_grid_minutes * 60);
    methods.InitializeAutoRefresh();

    // [Page Management]
  } else if (typeof phpProductionManagementObj === 'object') {

    methods.StopRefresh();
    clearInterval(start_submit_timer);
    clearInterval(start_display_timer);
    set_flag = 1;
    setInterval(methods.ManageLoadSearchResultsPane, (refresh_grid_minutes * 60) * 1000);

    // [Page Tracker]
  } else if (typeof phpPageTrackerObj === 'object') {

    var phpProductionManagementObj = {};
    phpProductionManagementObj = {
      'translate': {
        'action_denied': ''
      }
    };

    clearInterval(start_submit_timer);
    clearInterval(start_display_timer);
    set_flag = 1;
    setInterval(methods.ManageLoadSearchResultsPane, (refresh_grid_minutes * 60) * 1000);

    // [Edit Article] Disable article autosave
  } else if (typeof Newspress === 'object') {

    // Newspress.manage_articles.config.autosave_interval = 0;
    // Newspress.manage_articles.config.save_article_alert = 0;
    ManageToggleActivateAutoSave(0);
    clearInterval(start_submit_timer);
    // IntializeAutoRefresh();

    // "Used For Page" (Article Flag) bugfix
    var $artTargetPage = $('select#ART_TARGETPAGE');

    $artTargetPage.find('option').each(function (i, e) {
      var $this = $(e);

      if ($this[0].defaultSelected) {
        $this.removeAttr('selected');
      }
    }).end().val(Newspress.manage_articles.article_target_page);
  }
}

function hooks() {
  'use strict';

  if (typeof $ !== 'function') {
    clearInterval(hooks_timer);
    return;
  }

  // [Stories And Media]
  if (typeof phpFilterSearchObj === 'object') {

    // Clicking a story opens the "view" window.
    $('.ArticleInfo').each(function () {
      var $this = $(this);

      if ($this.data('events') === undefined) {
        $this.on('click', function (e) {
          var article_id = $(this).data('article_id');

          window.open(phpFilterSearchObj.rootFolderUrl + 'app/manage_articles/manage_articles.php?action=view&id=' + article_id + '&coming_from=article_details');
          e.preventDefault();
          return false;
        });
      }
    });

    // [Stories And Media] Sorts the "section" dropdown.
    var $section = $('#FILTER_SECTION'),
      sel, options, arr;

    if ($section.length) {
      if ($section.data('hooked') === undefined) {
        $section.data('hooked', 1);
        sel = $section.val();

        $section.find('option[value="0"]').text('-');

        // @ https://stackoverflow.com/a/12073377
        options = $section.find('option');

        arr = options.map(function (_, o) {
          return {
            t: $(o).text(),
            v: o.value
          };
        }).get();

        arr.sort(function (o1, o2) {
          return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
        });

        options.each(function (i, o) {
          o.value = arr[i].v;
          $(o).text(arr[i].t);
        });

        $section.val(sel);
      }
    }
  }

  // [Page Management]
  if (typeof phpProductionManagementObj === 'object' && phpProductionManagementObj.translate.action_denied !== "") {

    // Clicking the "i" icon opens the page's monitoring log.
    $('a[class="infoIcon"]').each(function () {
      var $this = $(this);

      if ($this.data('events').click === undefined) {
        $(this).on('click', function (e) {
          var $next = $(this).next(),
            base_file_name = $next.attr('original-title'),
            pma_id = $next.attr('data-pma_id');

          if (base_file_name !== undefined && pma_id !== undefined) {
            window.open('../production_management_new/pm_logs.php?file_name=' + base_file_name + '&pma_id=' + pma_id);
          }

          e.preventDefault();
          return false;
        });
      }
    });

    // Clicking the "id" icon opens the page image in a new window.
    $('a[id^="PAGE_TEMPLATE_FILE_ICON_"]').each(function () {
      var $this = $(this);

      if ($this.data('events').click === undefined) {
        $(this).on('click', function (e) {
          var src = $(this).parents('.cf').find('.thumbPreviewSize img').attr('src');

          window.open(src.replace('_thumb', ''));
          e.preventDefault();
          return false;
        });
      }
    });
  }

  // [Page Tracker]
  if (typeof phpPageTrackerObj === 'object' && phpProductionManagementObj.translate.action_denied === "") {

    // Clicking the "i" icon opens the page's monitoring log.
    $('a[class="infoIcon"]').each(function () {
      var $this = $(this);

      if ($this.data('events').click === undefined) {
        $(this).on('click', function (e) {
          var $next = $(this).nextAll('a[data-pma_id]'),
            base_file_name = $next.attr('original-title'),
            pma_id = $next.attr('data-pma_id');

          if (base_file_name !== undefined && pma_id !== undefined) {
            window.open('../production_management_new/pm_logs.php?file_name=' + base_file_name + '&pma_id=' + pma_id);
          }

          e.preventDefault();
          return false;
        });
      }
    });

    // Clicking the "id" icon opens the page image in a new window.
    $('a[id^="PAGE_TEMPLATE_FILE_ICON_"]').each(function () {
      var $this = $(this);

      if ($this.data('events').click === undefined) {
        $(this).on('click', function (e) {
          var src = $(this).parents('.panelHeader').next().find('.articleCoverPage img').attr('src');

          window.open(src.replace('_thumb', ''));
          e.preventDefault();
          return false;
        });
      }
    });
  }
}

hooks_timer = setInterval(hooks, refresh_hooks_seconds * 1000);
