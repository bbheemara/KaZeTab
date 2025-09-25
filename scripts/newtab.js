document.addEventListener('DOMContentLoaded', async () => {
    try {
        const result = await chrome.storage.local.get([
            'wallpaperUrl',
            'quoteType',
            'customQuote',
            'timeBasedGreetings'
        ]);

        if (result.wallpaperUrl) {
            document.body.style.backgroundImage = `url(${result.wallpaperUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
        }
    } catch (error) {
        console.error('Error loading settings:', error);
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
});
