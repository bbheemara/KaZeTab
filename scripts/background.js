function getStorage(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

async function fetchWallpaperCategory(category) {
  const searchQuery = encodeURIComponent(String(category).toLowerCase());
  const url = `https://wallhaven.cc/api/v1/search?q=${searchQuery}&categories=111&purity=100&sorting=random&resolutions=1920x1080&ratios=16x9`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Fetch failed: ' + res.status);
  const json = await res.json();
  return json?.data?.[0]?.path || null;
}
// took help from ai here
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const slot = alarm.name; 
  try {
    const state = await getStorage(['timeSlotCategories']);
    const mapping = state.timeSlotCategories || {};
    const category = mapping[slot] || 'space';

    const img = await fetchWallpaperCategory(category);
    if (!img) {
      
      console.warn('No image found for', category);
      return;
    }

    const key = `wallpaper_${slot}`;
    const obj = {};
    obj[key] = img;
    await new Promise((res) => chrome.storage.local.set(obj, res));

    chrome.tabs.query({ url: 'chrome://newtab/*' }, (tabs) => {
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, { type: 'wallpaper-updated', slot, url: img }, () => {});
      }
    });
  } catch (err) {
    console.error('Alarm handler error', err);
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === 'timeSlotsUpdated') {
    (async () => {
      try {
        const state = await getStorage(['timeSlotCategories']);
        const mapping = state.timeSlotCategories || {};
        const slots = ['morning', 'afternoon', 'evening', 'night'];
        for (const s of slots) {
          const cat = mapping[s] || 'space';
          try {
            const img = await fetchWallpaperCategory(cat);
            if (img) {
              const obj = {};
              obj[`wallpaper_${s}`] = img;
              chrome.storage.local.set(obj, () => {});
            }
          } catch (e) {
            console.warn('Preload failed for', s, e);
          }
        }
      } catch (e) {
        console.error('Prefetch listener error', e);
      }
    })();
  }
});
