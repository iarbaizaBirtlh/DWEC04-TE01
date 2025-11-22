import MusicService from "../service/music.service.js";
import { formatTime, toggleFavorite, updateFavoriteButtons, detectLongTitles, getFavorites } from "../utils/utils.js";

const main = document.getElementById("favoritos-container");

async function loadFavorites() {
    const favorites = getFavorites();
    if (favorites.length === 0) {
        main.innerHTML = "<p>No tienes canciones favoritas todavía.</p>";
        return;
    }
    main.innerHTML = "";

    for (const id of favorites) {
        const song = await MusicService.getSongDetail(id);
        if (!song)
            continue;
        const duration = formatTime(song.duration);

        main.innerHTML += `
        <article class="song-card">
            <img src="${song.image}" alt="${song.title}" class="song-img">
            <div class="song-info">
                <div class="song-title">
                    <span>${song.title}</span>
                </div>
                <p>${song.artist}</p>
                <p>Duración: ${duration}</p>
                <div class="controls">
                    <button class="btn-detail" data-id="${song.id}">Ver detalles</button>
                    <button class="btn-fav" data-id="${song.id}">⭐</button>
                </div>
            </div>
        </article>
        `;
    }
    detectLongTitles();
    updateFavoriteButtons();
}

main.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (!id)
        return;
    if (e.target.classList.contains("btn-detail")) {
        window.location.href = `detalle.html?id=${id}`;
    }
    if (e.target.classList.contains("btn-fav")) {
        toggleFavorite(id);
        loadFavorites();
    }
});

loadFavorites();
