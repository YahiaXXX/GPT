// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.type === "GET_EMAIL_CONTENT") {
//       const emailContent = document.querySelector('div').innerHTML;
//       sendResponse({ emailContent: emailContent });
//     }
//   });
chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
  if (request.action === 'getHTML') {
    const html = document.documentElement.outerHTML;
    sendResponse({ html });
  }
});