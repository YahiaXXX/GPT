chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendRequest(tabs[0].id, { action: 'getHTML' }, (response) => {
    if (response && response.html) {
      console.log(response.html);
    } else {
      console.error('Unable to get HTML content');
    }
  });
});
