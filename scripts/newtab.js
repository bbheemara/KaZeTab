function getStorage(keys) {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get(keys, (res) => resolve(res || {}));
    } catch (e) {
      resolve({});
    }
  });
}

function setWallpaperUrl(url) {
  if (!url) return;
  const container = document.getElementById('wallpaper') || document.body;
  container.style.backgroundImage = `url("${url}")`;
  container.style.backgroundSize = 'cover';
  container.style.backgroundPosition = 'center';
  container.style.backgroundRepeat = 'no-repeat';
}

function getSlotForHour(h) {
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  if (h < 22) return 'evening';
  return 'night';
}

async function loadWallpaperOnStart() {
  const res = await getStorage(['wallpaperUrl', 'timeBasedGreetings', 'timeSlotCategories', 'mode']);
  const h = new Date().getHours();
  // the below lines are for testing purpose of wallpaper set from settings-form
  // const urlParams = new URLSearchParams(window.location.search); 
  // const debugHour = urlParams.has('hour') ? Number(urlParams.get('hour')) : null;
  // const h = (debugHour !== null && !isNaN(debugHour)) ? debugHour : new Date().getHours();
  const slot = getSlotForHour(h);

  if (res.mode === 'different' && res.timeSlotCategories) {
    const key = `wallpaper_${slot}`;
    const slotRes = await getStorage([key]);
    if (slotRes && slotRes[key]) {
      setWallpaperUrl(slotRes[key]);
      return;
    }


    if (res.wallpaperUrl) {
      setWallpaperUrl(res.wallpaperUrl);
      return;
    }


    return;
  }


  if (res.wallpaperUrl) {
    setWallpaperUrl(res.wallpaperUrl);
    return;
  }

}


function showGreetingIfNeeded() {
  chrome.storage.local.get(['timeBasedGreetings'], (result) => {
    const timebased = !!result.timeBasedGreetings;
    if (!timebased) return;

    const time = new Date();
    const h = time.getHours();
    const greetings = h < 12
      ? 'Morning Champ!'
      : h < 18
        ? 'Afternoon!'
        : h <= 22
          ? 'Evening'
          : 'Night, Go Sleep!';

    const greetingDisplay = document.getElementById('greeting-text');
    if (greetingDisplay) greetingDisplay.textContent = greetings;
  });
}


chrome.runtime.onMessage.addListener((msg) => {
  if (!msg || typeof msg !== 'object') return;
  if (msg.type === 'wallpaper-updated' && msg.url) {

    setWallpaperUrl(msg.url);
  }

  if (msg.type === 'mode-changed') {
    loadWallpaperOnStart();
  }
});

//used ai here(didn't know much about bookmarks and all)
class BookmarkManager {
  constructor() {
    this.loadingElement = document.getElementById('bookmarks-loading');
    this.bookmarksContainer = document.getElementById('bookmarks-list');
    this.init();
  }

  async init() {
    try {
      const tree = await chrome.bookmarks.getTree();
      const bookmarksBar = this.findBookmarksBar(tree[0]);
      if (bookmarksBar && bookmarksBar.children) {
        this.renderBookmarks(bookmarksBar.children);
      } else {
        this.loadingElement.textContent = 'No bookmarks found';
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      this.loadingElement.textContent = 'Error loading bookmarks';
    }
  }

  findBookmarksBar(root) {
    if (!root.children) return null;
    for (const child of root.children) {
      if (child.title === 'Bookmarks bar' || child.title === 'Bookmarks Bar') {
        return child;
      }
    }
    return root.children[0] || null;
  }

  renderBookmarks(bookmarks) {
    this.loadingElement.style.display = 'none';
    this.bookmarksContainer.style.display = 'flex';
    this.bookmarksContainer.innerHTML = '';
   

    bookmarks.forEach(bookmark => {
      const el = this.createBookmarkElement(bookmark);
      this.bookmarksContainer.appendChild(el);
      
    });
  }

  createBookmarkElement(bookmark) {
    if (bookmark.url) {
      const link = document.createElement('a');
      link.href = bookmark.url;
      link.target = '_self';
      link.className = 'bookmark-item'; 

      const favicon = document.createElement('img');
      favicon.className = 'bookmark-favicon';
      favicon.src = this.getFaviconUrl(bookmark.url);
      favicon.onerror = () => {
        favicon.src = 'data:image/svg+xml;base64,...';  
      };

      const title = document.createElement('span');
      title.textContent = bookmark.title || 'Untitled';
      title.className = 'bookmark-title';

      link.appendChild(favicon);
      link.appendChild(title);
      return link;
    } else if (bookmark.children) {
      const folder = document.createElement('span');
      folder.textContent = bookmark.title || 'Folder';
      folder.className = 'bookmark-folder';
      return folder;
    }
  }

  getFaviconUrl(url) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return '';
    }
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  const res = await getStorage(['showBookmarks']);
  const show = res.showBookmarks !== false;
  applyShowBookmarksSetting(show);
  
  try {
    await loadWallpaperOnStart();
  } catch (err) {
    console.error('Error while loading wallpaper on start:', err);
  }

  try {
    showGreetingIfNeeded();
  } catch (e) {
    console.error('Greeting error', e);
  }


  const searchForm = document.getElementById('searchForm');
  const searchBox = document.getElementById('searchBox');

  if (searchForm && searchBox) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchBox.value.trim();
      if (!query) return;
      try {
        if (window.chrome && chrome.search && typeof chrome.search.query === 'function') {
          chrome.search.query({ text: query });
        } else {
          window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
        }
      } catch (err) {
        window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
      }
    });
  }
  new BookmarkManager();
});

const show_bookmarks  = document.getElementById("Show_Bookmakrs")

function applyShowBookmarksSetting(show){
  bookmarks_div = document.getElementById("bookmarks-container")
  if (!bookmarks_div) return;
  bookmarks_div.style.display = show?  'flex' : 'none';
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area!== 'local') return;

  if (changes.showBookmarks){
    applyShowBookmarksSetting(!!changes.showBookmarks.newValue);
  }
})