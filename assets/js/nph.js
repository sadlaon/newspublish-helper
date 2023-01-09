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

  ck.on('paste', function (evt) {
    evt.data.dataValue = evt.data.dataValue.replace(/<\/p>/gi, '</p><br><br>');
  });

  $('#update').click(function () {
    for (var variableKey in HtmlSanitizer.AllowedAttributes) {
      if (HtmlSanitizer.AllowedAttributes.hasOwnProperty(variableKey)) {
        delete HtmlSanitizer.AllowedAttributes[variableKey];
      }
    }

    for (var variableKey in HtmlSanitizer.AllowedCssStyles) {
      if (HtmlSanitizer.AllowedCssStyles.hasOwnProperty(variableKey)) {
        delete HtmlSanitizer.AllowedCssStyles[variableKey];
      }
    }

    HtmlSanitizer.AllowedSchemas = [];

    js = "$('#TITLE_TEXT_EDITOR_DIV').html( $('<div/>').html( $('#TITLE_TEXT_EDITOR_DIV').html() ).text().replace(/(\\r\\n|\\n|\\r)/gm, ' ').replace(/\\s+/gm, ' ') );" +
      "$('#SUBTITLE_TEXT_EDITOR_DIV').html( $('<div/>').html( $('#SUBTITLE_TEXT_EDITOR_DIV').html() ).text().replace(/(\\r\\n|\\n|\\r)/gm, ' ').replace(/\\s+/gm, ' ') );" +
      "$('#BYLINE_TEXT_EDITOR_DIV').html( $('<div/>').html( $('#BYLINE_TEXT_EDITOR_DIV').html() ).text().replace(/(\\r\\n|\\n|\\r)/gm, ' ').replace(/\\s+/gm, ' ') );" +
      "$('#BODY_TEXT_EDITOR_DIV').html('" + smartquotes(HtmlSanitizer.SanitizeHtml(ck.getData())) + "');";

    chrome.runtime.getBackgroundPage(function (wind) {
      wind.executeScript(js);
    });

    window.close();
  });
});
