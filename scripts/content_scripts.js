form.addEventListener("submit", (e) =>
{if (wallpaper_id.value==="select"){
    alert("PLease select a wallpaper type, LOL")
}
    e.preventDefault();
    const typeofwall = wallpaper_id.value;
    
})

console.log('KaZeTab content_script.js loaded');
