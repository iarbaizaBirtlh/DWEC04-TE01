/* import MusicService from "./service/music.service.js";
import { renderCarousel } from "./ui/home-carousel.js";

const genres = ["rock", "pop", "rap", "metal", "indie", "reggaeton"];

document.addEventListener("DOMContentLoaded", loadHome);

async function loadHome() {
    try {
        const results = await Promise.all(
            genres.map(g => MusicService.getTopSongs(g, 10))
        );

        genres.forEach((genre, index) => {
            renderCarousel(genre, results[index]);
        });

    } catch (err) {
        console.error("Error cargando canciones:", err);
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

loadHome(); */

import MusicService from "./service/music.service.js";

async function loadHome() {
    try {
        const [rock, pop, metal, rap, indie] = await Promise.all([
            MusicService.getTopSongs("rock"),
            MusicService.getTopSongs("pop"),
            MusicService.getTopSongs("metal"),
            MusicService.getTopSongs("rap"),
            MusicService.getTopSongs("indie")
        ]);

        renderCarousel("rock", rock);
        renderCarousel("pop", pop);
        renderCarousel("metal", metal);
        renderCarousel("rap", rap);
        renderCarousel("indie", indie);

    } catch (err) {
        console.error("Error cargando canciones:", err);
    }
}

function renderCarousel(id, list) {
    const cont = document.getElementById(`carousel-${id}`);
    if (!cont) return;

    cont.innerHTML = list.map(s => `
        <div class="card" onclick="location.href='detalle.html?id=${s.id}'">
            <img src="${s.image}">
            <h4>${s.title}</h4>
            <p>${s.artist}</p>
        </div>
    `).join("");
}

loadHome();

