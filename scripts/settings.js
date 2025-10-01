document.addEventListener('DOMContentLoaded', () => {
  const wallpaper_id = document.getElementById("Wallpaper-options");
  const type_a_genre = document.getElementById("typeagenre");
  const custom = document.getElementById("custom");
  const quote_id = document.getElementById("quote-options");
  const quote_input = document.getElementById("quote_custom_div");
  const form = document.getElementById("settings-form");
  const mode_same = document.getElementById("mode-same");
  const mode_diff = document.getElementById("mode-different");
  const custom_form = document.getElementById("custom-settings-form")
  const wallpaper_id_morning = document.getElementById("Wallpaper-options-morning")
  const wallpaper_id_afternoon = document.getElementById("Wallpaper-options-afternoon")
  const wallpaper_id_evening = document.getElementById("Wallpaper-options-evening")
  const wallpaper_id_night = document.getElementById("Wallpaper-options-night")

  const type_a_genre_morning = document.getElementById("typeagenre_morning")
  const type_a_genre_afternoon = document.getElementById("typeagenre_afternoon")
  const type_a_genre_evening = document.getElementById("typeagenre_evening")
  const type_a_genre_night = document.getElementById("typeagenre_night")


  function showForm_normal() {
    if (!form) return;
    form.classList.remove('hiddenc');
    form.classList.add('visible');
  }
  function hideForm_normal() {
    if (!form) return;
    form.classList.remove('visible');
    form.classList.add('hiddenc');
  }
  function showForm_custom() {
    if (!custom_form) return;
    custom_form.classList.remove('hiddenc');
    custom_form.classList.add('visible');
  }
  function hideForm_custom() {
    if (!custom_form) return;
    custom_form.classList.remove('visible');
    custom_form.classList.add('hiddenc');
  }

  if (mode_same) {
    mode_same.addEventListener("click", () => {
      hideForm_custom();
      showForm_normal();
      mode_same.classList.add('active');
      if (mode_diff) mode_diff.classList.remove('active');
    });
  }
  if (mode_diff) {
    mode_diff.addEventListener("click", () => {
      hideForm_normal();
      showForm_custom();
      if (mode_diff) mode_diff.classList.add('active');
      if (mode_same) mode_same.classList.remove('active');
    });
  }



  if (typeof chrome === 'undefined' || !chrome.storage) {
    console.error("Chrome extension APIs not available");
    alert("This page must be opened through the extension settings.");
    return;
  }


  // took help from ai to reframe some parts like chrome.storage and for debugging parts as am mid in js:( 
  if (!wallpaper_id || !form) {
    console.error("Required elements not found");
    return;
  }

  wallpaper_id.addEventListener("change", () => {
    if (type_a_genre) {
      type_a_genre.classList.add("hiddenc");
      type_a_genre.classList.remove("visible");
    }
    if (custom) {
      custom.classList.add("hiddenc");
      custom.classList.remove("visible");
    }

    if (wallpaper_id.value === "typeagenre" && type_a_genre) {
      type_a_genre.classList.remove("hiddenc");
      type_a_genre.classList.add("visible");
    } else if (wallpaper_id.value === "custom" && custom) {
      custom.classList.remove("hiddenc");
      custom.classList.add("visible");
    }
  });

  if (quote_id && quote_input) {
    quote_id.addEventListener("change", () => {
      quote_input.classList.add("hiddenc");
      quote_input.classList.remove("visible");

      if (quote_id.value === "Custom") {
        quote_input.classList.remove("hiddenc");
        quote_input.classList.add("visible");
      }
    });
  }

  if (!wallpaper_id_morning || !custom_form) {
    console.error("Required elements not found");
    return;
  }

  wallpaper_id_morning.addEventListener("change", () => {
    if (type_a_genre_morning) {
      type_a_genre_morning.classList.add("hiddenc");
      type_a_genre_morning.classList.remove("visible");
    }
    if (wallpaper_id_morning.value === "typeagenre_morning" && type_a_genre_morning) {
      type_a_genre_morning.classList.remove("hiddenc");
      type_a_genre_morning.classList.add("visible");
    }
  });

  wallpaper_id_afternoon.addEventListener("change", () => {
    if (type_a_genre_afternoon) {
      type_a_genre_afternoon.classList.add("hiddenc");
      type_a_genre_afternoon.classList.remove("visible");
    }
    if (wallpaper_id_afternoon.value === "typeagenre_afternoon" && type_a_genre_afternoon) {
      type_a_genre_afternoon.classList.remove("hiddenc");
      type_a_genre_afternoon.classList.add("visible");
    }
  });

  wallpaper_id_evening.addEventListener("change", () => {
    if (type_a_genre_evening) {
      type_a_genre_evening.classList.add("hiddenc");
      type_a_genre_evening.classList.remove("visible");
    }
    if (wallpaper_id_evening.value === "typeagenre_evening" && type_a_genre_evening) {
      type_a_genre_evening.classList.remove("hiddenc");
      type_a_genre_evening.classList.add("visible");
    }
  });

  wallpaper_id_night.addEventListener("change", () => {
    if (type_a_genre_night) {
      type_a_genre_night.classList.add("hiddenc");
      type_a_genre_night.classList.remove("visible");
    }
    if (wallpaper_id_night.value === "typeagenre_night" && type_a_genre_night) {
      type_a_genre_night.classList.remove("hiddenc");
      type_a_genre_night.classList.add("visible");
    }
  });


  if (custom_form) {

    custom_form.addEventListener('submit', (e) => {
      e.preventDefault();

      const morningVal = document.getElementById('Wallpaper-options-morning')?.value || '';
      const afternoonVal = document.getElementById('Wallpaper-options-afternoon')?.value || '';
      const eveningVal = document.getElementById('Wallpaper-options-evening')?.value || '';
      const nightVal = document.getElementById('Wallpaper-options-night')?.value || '';

      function readGenreIfNeeded(selectValue, inputId) {
        if (String(selectValue).includes('typeagenre')) {
          return document.getElementById(inputId)?.value?.trim() || '';
        }
        return '';
      }

      const customGenres = {
        morning: readGenreIfNeeded(morningVal, 'genre-input-morning'),
        afternoon: readGenreIfNeeded(afternoonVal, 'genre-input-afternoon'),
        evening: readGenreIfNeeded(eveningVal, 'genre-input-evening'),
        night: readGenreIfNeeded(nightVal, 'genre-input-night')
      };

      const timeSlotCategories = {
        morning: customGenres.morning ? customGenres.morning : morningVal,
        afternoon: customGenres.afternoon ? customGenres.afternoon : afternoonVal,
        evening: customGenres.evening ? customGenres.evening : eveningVal,
        night: customGenres.night ? customGenres.night : nightVal
      };

      chrome.storage.local.set({ timeSlotCategories, customGenres, mode: 'different' }, () => {
        if (chrome.runtime.lastError) {
          console.error('Save failed', chrome.runtime.lastError);
          alert('Failed to save settings');
          return;
        }
        alert('Wallpaper Set! enjoy..');
        chrome.tabs.create({ url: 'chrome://newtab' });

        try {
          chrome.runtime.sendMessage({ type: 'timeSlotsUpdated' });
        }
        catch (e) {
        }
      });
    });
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (wallpaper_id.value === "select") {
      alert("Please select a wallpaper type!");
      return;
    }

    const typeofwall = wallpaper_id.value;

    try {
      let searchQuery = "";

      switch (typeofwall) {
        case "coding":
          searchQuery = "coding";
          break;
        case "Nature":
          searchQuery = "nature";
          break;
        case "Anime":
          searchQuery = "anime";
          break;
        case "Space":
          searchQuery = "space";
          break;
        case "typeagenre":
          const genreInput = document.getElementById("genre-input");
          searchQuery = genreInput?.value || "anime";
          break;
        default:
          searchQuery = "anime";
      }

      if (typeofwall !== "custom") {
        const url = `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(searchQuery)}&categories=111&purity=100&sorting=random&resolutions=1920x1080&ratios=16x9`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!data.data || data.data.length === 0) throw new Error("No wallpapers found in API response");

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
             
        const timebasedWallpaperToggle = !!document.getElementById('timebased_wallpaper')?.checked;  

        function getTypedGenreIfNeeded(selectValue, inputId) {
          if (selectValue === 'typeagenre') {
            return document.getElementById(inputId)?.value?.trim() || 'anime';
          }
          return selectValue;
        }

        if (timebasedWallpaperToggle) {
          const slotCategory = getTypedGenreIfNeeded(typeofwall, 'genre-input');

          const timeSlotCategories = {
            morning: slotCategory,
            afternoon: slotCategory,
            evening: slotCategory,
            night: slotCategory
          };

          const customGenres = {
            morning: (typeofwall === 'typeagenre') ? (document.getElementById('genre-input')?.value?.trim() || '') : '',
            afternoon: (typeofwall === 'typeagenre') ? (document.getElementById('genre-input')?.value?.trim() || '') : '',
            evening: (typeofwall === 'typeagenre') ? (document.getElementById('genre-input')?.value?.trim() || '') : '',
            night: (typeofwall === 'typeagenre') ? (document.getElementById('genre-input')?.value?.trim() || '') : ''
          };

          const toSave = Object.assign({}, settings, {
            mode: 'different',
            timeSlotCategories,
            customGenres,
            wallpaperType: typeofwall,
            customGenre: (typeofwall === 'typeagenre') ? (document.getElementById('genre-input')?.value?.trim() || '') : '',
            timeBasedWallpaper: true
          });

          chrome.storage.local.set(toSave, () => {
            if (chrome.runtime.lastError) {
              console.error('Error saving settings:', chrome.runtime.lastError);
              alert('Error saving settings. Please try again.');
              return;
            }
            try { chrome.runtime.sendMessage({ type: 'timeSlotsUpdated' }); } catch (e) { }
            alert('Wallpaper Set! enjoy..');
            chrome.tabs.create({ url: 'chrome://newtab' });
          });

        } else {
          settings.mode = 'same';
          settings.timeBasedWallpaper = false; 

          chrome.storage.local.set(settings, () => {
            if (chrome.runtime.lastError) {
              console.error("Error saving to storage:", chrome.runtime.lastError);
              alert("Error saving settings. Please try again.");
              return;
            }
            alert('Wallpaper Set! enjoy..');
            chrome.tabs.create({ url: 'chrome://newtab' });
          });
        }  
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    }
  });

  loadSavedSettings();



});
function loadSavedSettings() {
  try {
    chrome.storage.local.get([
      'wallpaperType',
      'customGenre',
      'quoteType',
      'customQuote',
      'weatherCity',
      'timeBasedGreetings',
      'timeBasedWallpaper' 
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

      const quoteSelect = document.getElementById("quote-options");
      if (quoteSelect && result.quoteType) {
        quoteSelect.value = result.quoteType;
        quoteSelect.dispatchEvent(new Event('change'));
      }

      const quoteInput = document.getElementById("quote_input");
      if (quoteInput && result.customQuote) {
        quoteInput.value = result.customQuote;
      }

      const weatherInput = document.getElementById("weather_input");
      if (weatherInput && result.weatherCity) {
        weatherInput.value = result.weatherCity;
      }

      const greetingsCheck = document.getElementById("timebased_greetings");
      if (greetingsCheck) {
        greetingsCheck.checked = !!result.timeBasedGreetings;
      }

      const wallpaperToggle = document.getElementById("timebased_wallpaper");
      if (wallpaperToggle) {
        wallpaperToggle.checked = !!result.timeBasedWallpaper;
      }
    });

  } catch (error) {
    console.error("Error loading settings:", error);
  }
}