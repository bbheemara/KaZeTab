document.addEventListener('DOMContentLoaded', () => {
  const openSettingsBtn = document.getElementById('open-settings');
  const changeWallpaperBtn = document.getElementById('change-wallpaper');

  openSettingsBtn?.addEventListener('click', () => {
    if (chrome?.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage(() => {
        if (chrome.runtime.lastError) {
          chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
        }
      });
    } else {
      chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
    }
  });

  function getSlotForHour(h) {
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    if (h < 21) return 'evening';
    return 'night';
  }

  changeWallpaperBtn?.addEventListener('click', (e) => {
    e.preventDefault();

  
    chrome.storage.local.get(  
      ['wallpaperType', 'customGenre', 'timeSlotCategories', 'customGenres', 'mode'],
      async (res) => { 
        try {
          const now = new Date();
          const slot = getSlotForHour(now.getHours());  

         
          if (res.mode === 'different' || res.timeSlotCategories) {
            let category = (res.customGenres && res.customGenres[slot]) || (res.timeSlotCategories && res.timeSlotCategories[slot]) || res.wallpaperType || 'anime';

            
            if (String(category).includes('typeagenre') && res.customGenres && res.customGenres[slot]) {
              category = res.customGenres[slot];
            }

            const query = encodeURIComponent(category);
            const fetchUrl = `https://wallhaven.cc/api/v1/search?q=${query}&categories=111&purity=100&sorting=random&resolutions=1920x1080&ratios=16x9`;
            const response = await fetch(fetchUrl);
            if (!response.ok) throw new Error('Fetch error: ' + response.status);  

            const data = await response.json();
            const imgurl = data?.data?.[0]?.path; 
            if (!imgurl) throw new Error('No wallpaper found');

            const toSave = {};
            toSave[`wallpaper_${slot}`] = imgurl;
            toSave.wallpaperUrl = imgurl;
            chrome.storage.local.set(toSave, () => {
              if (chrome.runtime.lastError) {
                console.error('Storage set error:', chrome.runtime.lastError);
                alert('Could not save wallpaper.');
                return;
              }

              chrome.tabs.query({ url: 'chrome://newtab/*' }, (tabs) => {
                for (const tab of tabs) {
                  chrome.tabs.sendMessage(tab.id, { type: 'wallpaper-updated', slot, url: imgurl }, () => {});
                }
              });

              chrome.tabs.create({ url: 'chrome://newtab' });
            });

            return;
          }

            
          const type = res.wallpaperType || 'anime';
          const query = (type === 'typeagenre') ? (res.customGenre || 'anime') : type;
          const url = `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(query)}&categories=111&purity=100&sorting=random&resolutions=1920x1080&ratios=16x9`;

          const response2 = await fetch(url);
          if (!response2.ok) throw new Error('Fetch error: ' + response2.status);

          const data2 = await response2.json();
          const imgurl2 = data2?.data?.[0]?.path; 
          if (!imgurl2) throw new Error('No wallpaper found');
          
          chrome.storage.local.set({ wallpaperUrl: imgurl2 }, () => { 
            if (chrome.runtime.lastError) {
              console.error('Storage set error:', chrome.runtime.lastError);
              alert('Could not save wallpaper.'); 
              return;
            }
            chrome.tabs.create({ url: 'chrome://newtab' });
          });
        } catch (err) {
          console.error(err);
          alert('Error: ' + err.message);
        }
      }
    );  
  });
});