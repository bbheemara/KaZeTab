document.addEventListener('DOMContentLoaded', async () => {
    
    
    try {
        const result = await chrome.storage.local.get(['wallpaperUrl', 'quoteType', 'customQuote', 'timeBasedGreetings']);
        
        if (result.wallpaperUrl) {
            document.body.style.backgroundImage = `url(${result.wallpaperUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
        }
        
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
    
    
});

