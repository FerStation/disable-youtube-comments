/**
 * To hide the comments it will be necessary to observe the entire tree of 
 * elements, until the element "comments" is created. This is necessary
 * because of the way youtube loads elements into the DOM.
 */
const observer = new MutationObserver(function () {
  //checks if the element exists in the DOM
  if (document.getElementById("comments")) {
    observer.disconnect()
    //console.log(chrome.i18n.getMessage("comments_disabled"))
    hideComments()
  }
});

observer.observe(document.documentElement, {
  attributes: true,
  childList: true,
  characterData: false,
  subtree: true
});


/**
 * Loads an HTML document that will be injected on youtube
 * @param {string} href 
 * @returns {string}
 */
function loadHTMLFile(href) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", href, false);
  xmlhttp.send();
  return xmlhttp.responseText;
}

/**
 * Inject an HTML file before an element
 * @param {object} element 
 * @param {string} page 
 */
function injectHTMLBeforeElement(element, page) {
  let div = document.createElement("div")
  div.id = "content_no_comments"
  div.innerHTML = loadHTMLFile(page)
  element.before(div)
}

/**
 * Shows or hides a DOM element
 * @param {object} element 
 */
function showHideElement(element) {
  element.style.getPropertyValue("display") === "none" ?
    element.style.display = "block" :
    element.style.display = "none"
}

/**
 * Hide youtube comments
 */
function hideComments() {
  let comments = document.getElementById("comments")

  //hide comments
  chrome.storage.local.get(['hide_comments'], function (result) {
    if (result['hide_comments'] || typeof (result['hide_comments']) === 'undefined') {

      comments.style.display = "none"
    }
  });

  //show content
  chrome.storage.local.get(['hide_content'], function (result) {
    console.log(result['hide_content'])
    if (result['hide_content'] || typeof (result['hide_content']) === 'undefined') {

      injectHTMLBeforeElement(comments, chrome.runtime.getURL("src/content/index.html"))

      document.getElementById("content_no_comments-image").src = chrome.runtime.getURL("src/content/img/brain.svg")
      document.getElementById("content_no_comments-image").alt = chrome.i18n.getMessage("alt_image_brain")
      
      document.getElementById("button-show-comments").addEventListener("click", showCommentsClick)

      localize()
    }

  });
}

/**
 * Shows youtube comments
 */
function showCommentsClick() {
  showHideElement(document.getElementById("content_no_comments"))
  showHideElement(document.getElementById("comments"))
  scroll({
    top: document.getElementById("meta-contents").offsetTop,
    behavior: 'smooth'
  })
}

function localize() {
  document.querySelectorAll('[data-locale]').forEach(elem => {
    elem.innerText = chrome.i18n.getMessage(elem.dataset.locale)
  })
}



