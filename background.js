/*jslint devel: true, browser: true, white: true, maxerr: 50 */
/*global chrome */

function inject(script, tabID) {
  'use strict';

  var wrapped_script = '(function() {' +
    'var user_data = ' + JSON.stringify(window.user_data) + ';' +
    'var chrome = undefined;' +
    script +
    'return user_data;' +
    '})();';

  chrome.tabs.executeScript(tabID, {
    file: 'assets/js/jquery-3.6.0.min.js'
  }, function () {
    chrome.tabs.executeScript(tabID, {
      code: wrapped_script
    }, function (result) {
      window.user_data = result[0];
    });
  });
}

function executeScript(code_) {
  'use strict';

  chrome.tabs.query({
    active: true
  }, function (selectedTab) {
    let url = selectedTab[0].url;

    // /newspress/app/manage_articles/manage_articles.php?action=edit&id=?
    // /newspress/app/manage_articles/manage_articles.php?action=update&id=?&coming_from=popup
    if (url.match(/\/newspress\/app\/manage_articles\/manage_articles.php\?action=(edit|update|view)&id=\d+/)) {

      // @ https://www.sung.codes/blog/2019/getting-dom-content-from-chrome-extension-2
      let code = `document.getElementById('BODY_TEXT_EDITOR_DIV')`;
      chrome.tabs.executeScript(selectedTab[0].id, {
        code
      }, function (result) {
        if (result[0] !== null) {
          var blocks = code_.split('//:load:\n');

          inject(blocks[0], selectedTab[0].id);

          var block_index = 1;
          chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
            if (changeInfo.status === 'complete' &&
              tabID == selectedTab[0].id) {
              inject(blocks[block_index], selectedTab[0].id);
              block_index++;
            }
          });
        }
      });
    }
  });
}

// @ https://developer.chrome.com/docs/extensions/mv2/background_pages/#react
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'copyHTML') {
    var wrapper = document.createElement('div');

    // @ https://stackoverflow.com/a/28570479
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

    html = HtmlSanitizer.SanitizeHtml(message.html);
    // html = html.replace(new RegExp(/<p>\s*?<span>\s*?<br>\s*?<\/span>\s*?<\/p>/, 'g'), '');
    console.log(html);

    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);

    var r = document.createRange();
    r.selectNode(wrapper);

    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);

    document.execCommand('copy');
    wrapper.remove();

    sendResponse({
      'message': 'Copied.'
    });
  }
});
