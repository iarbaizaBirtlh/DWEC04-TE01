import MusicService from "./service/music.service.js";
import { formatTime, toggleFavorite, updateFavoriteButtons, detectLongTitles } from "./utils/utils.js";

const main = document.getElementById("detalles-cancion");

const GENRES = ["rock", "pop", "metal", "rap", "indie", "reggaeton"];

async function loadHome() {
    main.innerHTML = '<p style="text-align:center; width:100%;">Cargando tu música...</p>';

    try {
        const promises = GENRES.map(async (genre) => {
            const songs = await MusicService.getTopSongs(genre, 10);
            return { genre, songs };
        });
        const results = await Promise.all(promises);
        main.innerHTML = "";
        results.forEach(({ genre, songs }) => {
            renderGenreSection(genre, songs);
        });
        detectLongTitles();
        updateFavoriteButtons();
    } catch (error) {
        console.error("Error cargando canciones:", error);
        main.innerHTML = '<p style="color:red; text-align:center;">Error al cargar la música. Intenta recargar.</p>';
    }
}

function renderGenreSection(genre, songs) {
    if (!songs || songs.length === 0)
        return;
    const section = document.createElement("section");
    section.className = "genre-section";
    const title = document.createElement("h2");
    title.textContent = genre.toUpperCase();
    section.appendChild(title);
    const carousel = document.createElement("div");
    carousel.className = "carousel";
    let cardsHTML = "";

    songs.forEach((song, idx) => {
        const duration = formatTime(song.duration);
        cardsHTML += `
        <article class="song-card">
            <img src="${song.image}" alt="${song.title}" class="song-img">
            <div class="song-info">
                <div class="song-title"><span>${idx + 1}. ${song.title}</span></div>
                <p>${song.artist}</p>
                <p>⏱ ${duration}</p>
                <div class="controls">
                    <button class="btn-detail" data-id="${song.id}">Ver detalles</button>
                    <button class="btn-fav" data-id="${song.id}">⭐</button>
                </div>
            </div>
        </article>
        `;
    });
    carousel.innerHTML = cardsHTML;
    section.appendChild(carousel);
    main.appendChild(section);
}

main.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-detail")) {
        window.location.href = `detalle.html?id=${e.target.dataset.id}`;
    }
    if (e.target.classList.contains("btn-fav")) {
        toggleFavorite(e.target.dataset.id);
        updateFavoriteButtons();
    }
});

loadHome();
