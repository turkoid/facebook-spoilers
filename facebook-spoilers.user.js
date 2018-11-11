// ==UserScript==
// @name Hide Facebook Spoilers
// @namespace turkoid
// @author turkoid
// @include /^http[s]?:\/\/(www)?\.facebook\.com*/
// @grant none
// ==/UserScript==

(function () {
  'use strict';

  var spoilers = [
    '' // don't remove this
  ];

  spoilers = spoilers.map(spoiler => spoiler.trim());
  spoilers = spoilers.filter(spoiler => spoiler.length > 0);
  if (spoilers.length == 0) return;

  var spoilerCss = `
      .spoiler {
        filter         : blur(10px);
        -webkit-filter : blur(10px);
        -moz-filter    : blur(10px);
        -o-filter      : blur(10px);
        -ms-filter     : blur(10px);
      }
      .stopclicks {
        pointer-events: none;
      }`;

  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(spoilerCss));
  document.head.appendChild(style);

  var observer = new MutationObserver(findSpoilers);

  function findSpoilers() {
    var posts = document.querySelectorAll('.userContentWrapper');
    posts.forEach(post => {
      var txt = post.textContent.toLowerCase();
      spoilers.forEach(spoiler => {
        if (txt.includes(spoiler)) {
          post.querySelectorAll(
            '.userContent:not([data-unspoiled]),' +
            '.mtm:not([data-unspoiled]),' +
            '.UFICommentBody:not([data-unspoiled])'
          ).forEach(unspoil);
        }
      });
    });
  }

  function toggleClicks(el) {
    el.querySelectorAll('a').forEach(link => {
      toggleClass(link, 'stopclicks');
    });
  }

  function unspoil(el) {
    el.setAttribute('data-unspoiled', 'true');
    el.classList.toggle('spoiler');
    el.addEventListener('click', () => {
      this.classList.toggle('spoiler');
      toggleClicks(this);
    }, false);
    toggleClicks(el);
  }

  findSpoilers();

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
})();