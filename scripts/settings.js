
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('Wallpaper-options')) {
  return;
}
  

  if (typeof chrome === 'undefined' || !chrome.storage) {
    console.error("Chrome extension APIs not available");
    alert("This page must be opened through the extension settings.");
    return;
  }

  const wallpaper_id = document.getElementById("Wallpaper-options");
  const type_a_genre = document.getElementById("typeagenre");
  const custom = document.getElementById("custom");
  const quote_id = document.getElementById("quote-options");
  const quote_input = document.getElementById("quote_custom_div");
  const form = document.getElementById("settings-form");
  // took help from ai to reframe some parts like chrome.storage and for debugging parts as am mid in js:( 
  if (!wallpaper_id || !form) {
    console.error("Required elements not found");
    return;
  }

  wallpaper_id.addEventListener("change", () => {
    type_a_genre.classList.add("hiddenc");
    type_a_genre.classList.remove("visible");
    custom.classList.add("hiddenc");
    custom.classList.remove("visible");

    if (wallpaper_id.value === "typeagenre") {
      type_a_genre.classList.remove("hiddenc");
      type_a_genre.classList.add("visible");
    } else if (wallpaper_id.value === "custom") {
      custom.classList.remove("hiddenc");
      custom.classList.add("visible");
    }
  });

  quote_id?.addEventListener("change", () => {
    quote_input.classList.add("hiddenc");
    quote_input.classList.remove("visible");

    if (quote_id.value === "Custom") {
      quote_input.classList.remove("hiddenc");
      quote_input.classList.add("visible");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (wallpaper_id.value === "select") {
      alert("Please select a wallpaper type!, LOL");
      return;
    }

    const typeofwall = wallpaper_id.value;

    try {
      let searchQuery = "";

      switch (typeofwall) {
        case "tech":
          searchQuery = "tech";
          break;
        case "Nature":
          searchQuery = "nature";
          break; 
        case "Anime":
          searchQuery = "anime";
          break;
        case "Movie":
          searchQuery = "movie";
          break;
        case "typeagenre":
          const genreInput = document.getElementById("genre-input");
          searchQuery = genreInput?.value || "anime";
          break;
        default:
          searchQuery = "anime";
      }
    
      if (typeofwall !== "custom") {
        const url = `https://wallhaven.cc/api/v1/search?q=${searchQuery}&categories=111&purity=100&sorting=random&resolutions=1920x1080&ratios=16x9`;
      
        

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
          throw new Error("No wallpapers found in API response");
        }

        const imgurl = data.data[0].path;
        

        const settings = {
          wallpaperType: typeofwall,
          wallpaperUrl: imgurl,
          quoteType: quote_id?.value || "none",
          customQuote: document.getElementById("quote_input")?.value || "",
          weatherCity: document.getElementById("weather_input")?.value || "",
          timeBasedGreetings: document.getElementById("timebased_greetings")?.checked || false
        };

        if (typeofwall === "typeagenre") {
          settings.customGenre = document.getElementById("genre-input")?.value || "";
        }

        chrome.storage.local.set(settings, () => {
          if (chrome.runtime.lastError) {
            console.error("Error saving to storage:", chrome.runtime.lastError);
            alert("Error saving settings. Please try again.");
            return;
          }

          
          alert("Settings saved successfully!");

          chrome.tabs.create({ url: 'chrome://newtab' });
        });
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    }
  });

  loadSavedSettings();
});

async function loadSavedSettings() {
  try {
    chrome.storage.local.get([
      'wallpaperType',
      'customGenre',
      'quoteType',
      'customQuote',
      'weatherCity',
      'timeBasedGreetings'
    ], (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error loading settings:", chrome.runtime.lastError);
        return;
      }

      if (result.wallpaperType) {
        const wallpaperSelect = document.getElementById("Wallpaper-options");
        if (wallpaperSelect) {
          wallpaperSelect.value = result.wallpaperType;
          wallpaperSelect.dispatchEvent(new Event('change'));
        }
      }

      if (result.customGenre) {
        const genreInput = document.getElementById("genre-input");
        if (genreInput) genreInput.value = result.customGenre;
      }


    });

  } catch (error) {
    console.error("Error loading settings:", error);
  }
}
