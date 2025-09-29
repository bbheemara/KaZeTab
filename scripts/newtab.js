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
    
   chrome.storage.local.get(['timeBasedGreetings'], (result) => {
    const timebased = !!result.timeBasedGreetings;
    if (timebased){
        const time = new Date();
        const h = time.getHours();
        const greetings = h < 12 ? 'Morning Champ!' : h < 18 ? 'Afternoon!' : h <= 22? 'Evening' : 'Night, Go Sleep!'
        greeting_display = document.getElementById('greeting-text')
        greeting_display.textContent = greetings
    }
   });
   


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
