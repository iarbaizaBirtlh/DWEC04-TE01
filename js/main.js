import MusicService from "./service/music.service.js";

const main = document.getElementById("detalles-cancion");

async function loadSongs() {
    try {
        const songs = await MusicService.getTopSongs("rock", 20);
        main.innerHTML = '';

        songs.forEach((song, idx) => {
            const durationMin = Math.floor((song.duration || 0) / 60000);
            const durationSec = Math.floor(((song.duration || 0) % 60000) / 1000).toString().padStart(2, "0");

            main.innerHTML += `
                <article class="song-card">
                    <img src="${song.image}" alt="${song.title}" class="song-img">
                    <div class="song-info">
                        <div class="song-title">
                            <span>${idx + 1}. ${song.title}</span>
                        </div>
                        <p>${song.artist}</p>
                        <p>Duración: ${durationMin}:${durationSec}</p>
                        <div class="controls">
                            <button class="btn-detail" data-id="${song.id}">Ver detalles</button>
                            <button class="btn-fav" data-id="${song.id}">⭐</button>
                        </div>
                    </div>
                </article>
            `;
        });

        detectLongTitles();
        updateFavoriteButtons();

        main.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-detail")) {
                window.location.href = `detalle.html?id=${e.target.dataset.id}`;
            }
            if (e.target.classList.contains("btn-fav")) {
                toggleFavorite(e.target.dataset.id);
            }
        });
    } catch(err) {
        main.innerHTML = `<p>Error cargando canciones: ${err.message}</p>`;
    }
}

function detectLongTitles() {
    const titles = document.querySelectorAll(".song-title span");

    titles.forEach((span, index) => {
        const parent = span.parentElement;
        const fullWidth = span.scrollWidth;
        const visibleWidth = parent.clientWidth;

        if (fullWidth > visibleWidth) {
            parent.classList.add("long");
            const distance = fullWidth - visibleWidth;
            const scrollTime = (distance / 20).toFixed(1) + "s";
            const animName = `marquee-${index}`;
            const style = document.createElement("style");

            style.innerHTML = `
                @keyframes ${animName} {
                    0% { transform: translateX(0); }
                    40% { transform: translateX(-${distance}px); }
                    60% { transform: translateX(-${distance}px); }
                    100% { transform: translateX(-${distance}px); }
                }
            `;
            document.head.appendChild(style);
            span.style.setProperty("--scroll-name", animName);
            span.style.setProperty("--scroll-time", scrollTime);
        }
    });
}

function toggleFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (!favorites.includes(id)) {
        favorites.push(id);
    } else {
        favorites = favorites.filter(f => f !== id);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoriteButtons(); // Actualiza visualmente los botones
}

function updateFavoriteButtons() {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    document.querySelectorAll(".btn-fav").forEach(btn => {
        if (favorites.includes(btn.dataset.id)) {
            btn.style.backgroundColor = "#09e0f4ff"; // verde Spotify
            btn.style.color = "#fff"; // texto blanco
        } else {
            btn.style.backgroundColor = "#128138"; // gris oscuro original
            btn.style.color = "#fff"; // texto blanco
        }
    });
}


loadSongs();
