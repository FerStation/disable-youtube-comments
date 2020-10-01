/**
 * Enables or disables the "hide_content" switch based on the state 
 * of the "hide_comments" switch
 */
function enableDisableSwitch(){
  let hideComments = document.getElementById("hide_comments")
  let hideContent = document.getElementById("hide_content")

  if(!hideComments.checked){
    hideContent.checked = false
    setStorageValue("hide_content", hideComments.checked)
    hideContent.disabled=true;

  }

  if(hideComments.checked){
    hideContent.disabled=false;
  }
}

/**
 * Changes a storaged value
 * @param {string} key 
 * @param {*} value 
 */
function setStorageValue(key, value) {
  let obj = {}
  obj[key] = value
  chrome.storage.local.set(obj)
}

/**
 * Get a storaged value
 * @param {string} key 
 */
function getStorageValue(key) {
  chrome.storage.local.get([key], function (result) {
    let activated = result[key]

    if (typeof (activated) === 'undefined')
    activated = true

    document.getElementById(key).checked = activated
    enableDisableSwitch()
    return activated
  });
}

/**
 * Selected option will be saved to storage and the state will be changed
 */
function switchClick(e){
  setStorageValue(e.target.id, e.target.checked)
  getStorageValue(e.target.id)
  enableDisableSwitch()
}

//Get values from storage
getStorageValue('hide_comments')
getStorageValue('hide_content')

//Add click listener
document.getElementById("hide_comments").addEventListener("click", switchClick);
document.getElementById("hide_content").addEventListener("click", switchClick);

//Localize
document.querySelectorAll('[data-locale]').forEach(elem => {
  elem.innerText = chrome.i18n.getMessage(elem.dataset.locale)
})