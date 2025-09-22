const wallpaper_id = document.getElementById("Wallpaper-options")
const type_a_genre = document.getElementById("typeagenre")
const custom = document.getElementById("custom")
const quote_id = document.getElementById("quote-options")
const quote_input = document.getElementById("quote_custom_div")

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

quote_id.addEventListener("change", () =>
{
    quote_input.classList.add("hiddenc");
    quote_input.classList.remove("visible")

    if (quote_id.value === "Custom"){
        quote_input.classList.remove("hiddenc")
        quote_input.classList.add("visible")
    }
    else{
         custom.classList.remove("visible");
 custom.classList.add("hiddenc");
    }

})
