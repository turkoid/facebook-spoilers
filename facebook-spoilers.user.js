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
      }
      .spoiler-eye {
        background:
          url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAECklEQVRYhe2WTYiVVRjHf//LxfcyDENMg4iIi+GedyEyiYsWJRUuTCIxY/qgRRBhZQtBJEQiXMTkQkpDVEJJq0X2hWJiH4iFhVhIzEJC3nMJkRYyxCAyTO87XObf4n2vjo0fl7Bs4bM95zz/3/Oc5zzPkTF30mp3VP0uwP8BoH67HBUhrRseBxCcSGJ2uZtz+ievIA9pn2Ce7V4kgEuCXttfIs0TnACe6QaiqwwUzdALDFlaLnhUMIg9R1IdwNCutg5gg9SL3b6xxy4BipDWgAds1klaKei/sii1saeRakDdNpIwXAJ2Jq042Q3ADYswb4aFhm3Ad5Kes91fXVYOvG94GOle22+pBCq54ChwGKBohp4ipM8XIe3rGqAIaa0I6WJJHwnWA+eBTyvnk8AIsLm68xFg2IBsgDFgexKzKQBLw8Ae7PfykM7rNgNLgE+AZcBJYJXtMZURnsJ+B3gFOCRpvaRF4kodHADOdhwJWsB5pKcF+/OQLrgpQNEMQ8B+26nt3dhPARclDQFgf4Y0CKwz9HTOGUBqGXZ2os9DuiyJ2SlgDXAMWCHYW4R0/nUBipD2IW0FFiF9LmlL0orjQI/tRiV0GRgCejVDXNAW7GnE7PfK11LBCwBJzDJgg+EMsBzYVIS0cb0MvAo8hn0K2JDEbLwSmECaLIPULuBdoNdXxbH9PXCwirzPsBmY6jhOYtYC1gIXKp1lswBs30ep8o3KYurYhGAUG5fPcKA6QJWFScrCGwOQvQJ7peEHrrVzwBlDHXvxLABJh7Db2C9SFiIAjZhNAx8gTWiGt+rNAxwHvgYoQnqPYaOki4JvO3uLkNZUZneF4JLLTnktAPYRSzsMCyiLZfHVJZ8FtgATtrHdycAFYKTRitNFSOvAS5IWAJsM4wB52cwesb3HZefcLOnXWQBJK+aCbZKOYS+xvasI6ZIipLVGK7YN+2zvkISkTuM5iD1aQc4HVgFvAEcbMZvOm6EOrAR2SRoQ7AM+TGLWngUAkMRszPCy4bDKQvnK9nAe0p5GzC4j/Tlj+wXbbyetOFVdST+wNonZgSRmU3lI+5HWq+wpg8AOYEsSs2ta9HWnYR7SAewRSc9WlX4S+KKKbtCQY78m2J204vSMczXBXOB+7E2WlqqcDduB3UnMJv6udcNxXIS0B3jCsFWwEJh2meuapB8Naxox+6NohpqlpiC1/SDwkKSlhjmCUWADcLrToLoGmAEyALxJ2X7BnrS0uhGz49X6k9gfz5iK40i/CPa6rIWbTsVb/wdKwf7qCU4jHRGcrsT7sVchjQK/AT9J+hk412lkt7JbZ6AZ6kjD2K9TFtrqJGZnunF+WwAA8maoSZprmCs4m5TN6b8D+Dftjn/L7wLcBfgLo23T1Mn05rcAAAAASUVORK5CYII=) no-repeat;
        width: 32px;
        height: 32px;
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
            '.userContent:not([data-spoil-protected]),' +
            '.mtm:not([data-spoil-protected]),' +
            '.UFICommentBody:not([data-spoil-protected])'
          ).forEach(spoilProtect);
        }
      });
    });
  }

  function toggleSpoilProtection(el) {
    el.classList.toggle('spoiler');
    el.querySelectorAll('a').forEach(link => {
      link.classList.toggle('stopclicks');
    });
  }

  function spoilProtect(el) {
    el.setAttribute('data-spoil-protected', 'true');
    toggleSpoilProtection(el);
    var elements = [el];
    if (el.classList.contains('UFICommentBody')) {
      elements = [el.closest('.UFICommentActorAndBodySpacing')];
    } else if (el.classList.contains('mtm')) {
      var spoilerEye = document.createElement('div');
      spoilerEye.classList.add('spoiler-eye');
      el.appendChild(spoilerEye);
    }
    elements.forEach(element => {
      element.addEventListener('click', evt => {
        toggleSpoilProtection(el);
      });
    });
  }

  findSpoilers();

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
})();