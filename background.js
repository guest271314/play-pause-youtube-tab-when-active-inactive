chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.url.startsWith('https://www.youtube.com/watch?')) {
    console.log(tab.url, changeInfo);
  }
});

async function playPauseYouTubeWhenActiveInactive(arg) {
  const video = document.querySelector('video');
  await video[arg]();
  return !video.paused;
}

async function executeScript(id, arg) {
  return await chrome.scripting.executeScript({
    target: {
      tabId: id,
    },
    world: 'MAIN',
    args: [arg],
    func: playPauseYouTubeWhenActiveInactive
  });
}

async function queryTab(active, audible = false) {
  return await chrome.tabs.query({
    active,
    audible,
    url: '*://*.youtube.com/*',
  });
}

chrome.tabs.onActivated.addListener(async (tab) => {
  let [currentTab] = await queryTab(true);
  if (currentTab && !currentTab.audible) {
    console.log(`YouTube video playing: ${(await executeScript(currentTab.id, 'play'))[0].result}`);
  } else {
    [currentTab] = await queryTab(false, true);
    if (currentTab) {
      console.log(`YouTube video playing: ${(await executeScript(currentTab.id, 'pause'))[0].result}`);
    }
  }
});
