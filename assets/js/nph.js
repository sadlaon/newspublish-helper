/*jslint devel: true, browser: true, white: true, maxerr: 50 */
/*global $, CKEDITOR, chrome */

$(document).ready(function () {
  'use strict';

  var ck = CKEDITOR.replace('art-body'),
    js;

  $('#reset').click(function () {
    ck.focus();
    ck.setData('');
  });

  $('#update').click(function () {
    js = "$('#TITLE_TEXT_EDITOR_DIV').html( $('<div/>').html( $('#TITLE_TEXT_EDITOR_DIV').html() ).text().replace(/(\\r\\n|\\n|\\r)/gm, ' ').replace(/\\s+/gm, ' ') );" +
      "$('#SUBTITLE_TEXT_EDITOR_DIV').html( $('<div/>').html( $('#SUBTITLE_TEXT_EDITOR_DIV').html() ).text().replace(/(\\r\\n|\\n|\\r)/gm, ' ').replace(/\\s+/gm, ' ') );" +
      "$('#BYLINE_TEXT_EDITOR_DIV').html( $('<div/>').html( $('#BYLINE_TEXT_EDITOR_DIV').html() ).text().replace(/(\\r\\n|\\n|\\r)/gm, ' ').replace(/\\s+/gm, ' ') );" +
      "$('#BODY_TEXT_EDITOR_DIV').html('" + ck.getData() + "');";

    chrome.runtime.getBackgroundPage(function (wind) {
      wind.executeScript(js);
    });

    window.close();
  });
});
