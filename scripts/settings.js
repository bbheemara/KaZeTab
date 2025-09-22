const wallpaper_id = document.getElementById("Wallpaper-options")
const type_a_genre = document.getElementById("typeagenre")
const custom = document.getElementById("custom")

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
