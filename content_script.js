/*jslint devel: true, browser: true, white: true, maxerr: 50 */
/*global chrome */

window.onload = function () {
  'use strict';

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = chrome.runtime.getURL('onload.js');
  (document.body || document.head).appendChild(script);

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function prepareString(string) {
    return string.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/gm, ' ');
  }

  var titleDiv = (document.getElementById('TITLE_TEXT_EDITOR_DIV') || document.getElementById('PREVIEW_TITLE_ID')),
    lastBtn,
    bodyDiv;

  if (titleDiv) {
    var lastBtn, copyBtn;

    lastBtn = document.getElementById('SAVE_ARTICLE_BUTTON_SUBMIT');

    if (lastBtn.style === 'none') {
      lastBtn = document.getElementById('CHECKOUT_BUTTON');
    }

    copyBtn = document.createElement('button');
    copyBtn.classList.add('toLower', 'np-btn', 'np-btn-primary', 'isDark');
    copyBtn.id = 'COPY_BUTTON';
    copyBtn.innerHTML = 'Copy';
    copyBtn.name = 'COPY_BUTTON';
    copyBtn.type = 'button';

    bodyDiv = (document.getElementById('BODY_TEXT_EDITOR_DIV') || document.getElementById('PREVIEW_BODY_ID'));

    // @ https://developer.chrome.com/docs/extensions/mv3/messaging/#simple
    copyBtn.onclick = function () {
      // var kicker = prepareString(document.getElementById('31_AUTO_COMPLETE').textContent);
      var head = prepareString(titleDiv.textContent);
      // var subtitle = prepareString(document.getElementById('SUBTITLE_TEXT_EDITOR_DIV').textContent);

      chrome.runtime.sendMessage({
          type: 'copyHTML',
          html: `<p><b>${head}</b></p>${bodyDiv.innerHTML}`
        },
        function (response) {
          console.log(response.message);
        });

      return false;
    };

    insertAfter(lastBtn, copyBtn);
  }
};
