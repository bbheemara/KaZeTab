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

  changeWallpaperBtn?.addEventListener('click', (e) => {
    e.preventDefault();

    chrome.storage.local.get(['wallpaperType', 'customGenre'], async (res) => {
      try {
        const type = res.wallpaperType || 'anime';
        const query = (type === 'typeagenre') ? (res.customGenre || 'anime') : type;
        const url = `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(query)}&categories=111&purity=100&sorting=random&resolutions=1920x1080&ratios=16x9`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Fetch error: ' + response.status);

        const data = await response.json();
        const imgurl = data?.data?.[0]?.path;
        if (!imgurl) throw new Error('No wallpaper found');

        chrome.storage.local.set({ wallpaperUrl: imgurl }, () => {
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
    });
  });
}); 
