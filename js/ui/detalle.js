import MusicService from "../service/music.service.js";
import { formatTime, toggleFavorite, updateFavoriteButtons, detectLongTitles } from "../utils/utils.js";

const container = document.getElementById("detalle-container");
const tableState = {
    songs: [],
    sortCol: 'title',
    sortOrder: 'asc'
};
let currentSongId = null;

export async function loadDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
        container.innerHTML = "<p>Error: no se ha proporcionado ID.</p>";
        return;
    }
    const currentSong = await MusicService.getSongDetail(id);
    if (!currentSong) {
        container.innerHTML = "<p>No se encontró la canción.</p>";
        return;
    }
    currentSongId = String(currentSong.id);
    const topSongs = await MusicService.getTopSongs(currentSong.artist, 10);
    const unique = [];
    const seen = new Set();

    for (const s of topSongs) {
        const sid = String(s.id);
        if (seen.has(sid)) continue;
        seen.add(sid);
        unique.push({
        id: sid,
        title: s.title,
        album: s.album,
        artist: s.artist,
        duration: s.duration || 0,
        image: s.image,
        isCurrent: sid === currentSongId
        });
    }

    if (!unique.some(u => u.id === currentSongId)) {
        unique.unshift({
        id: currentSongId,
        title: currentSong.title,
        album: currentSong.album,
        artist: currentSong.artist,
        duration: currentSong.duration || 0,
        image: currentSong.image,
        isCurrent: true
        });
    }
    tableState.songs = unique;

    renderBaseLayout(currentSong);
    renderTable();
    detectLongTitles();
    updateFavoriteButtons();
}

function renderBaseLayout(song) {
    container.innerHTML = `
        <div class="detail-box">
            <img src="${song.image}" alt="${song.title}">
            <div class="detail-info">
                <h2>${song.title}</h2>
                <button id="fav-btn-detail" class="detail-fav btn-fav" data-id="${song.id}">⭐</button>
                <p><strong>Artista:</strong> ${song.artist}</p>
                <p><strong>Álbum:</strong> ${song.album || '—'}</p>
                <p><strong>Duración:</strong> ${formatTime(song.duration)}</p>
                <audio controls preload="none" style="margin-bottom: 20px;">
                    ${song.preview ? `<source src="${song.preview}" type="audio/mpeg">` : ''}
                </audio>
            </div>
        </div>

        <div class="data-table-container" style="margin-top: 10px;">
            <h3>Tabla Comparativa del Artista</h3>
            <div style="overflow-x: auto; background: #222; border-radius: 8px; padding: 10px;">
                <table id="compTable" style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 1px solid #444; color: #b3b3b3;">
                            <th style="padding: 10px; cursor: pointer;" data-sort="title">Canción <span id="sort-icon-title">↕</span></th>
                            <th style="padding: 10px; cursor: pointer;" data-sort="album">Álbum <span id="sort-icon-album">↕</span></th>
                            <th style="padding: 10px; cursor: pointer; text-align: right;" data-sort="duration">Duración <span id="sort-icon-duration">↕</span></th>
                        </tr>
                    </thead>
                    <tbody id="comparison-table-body"></tbody>
                </table>
            </div>
        </div>

        <div class="other-tracks">
            <h3>Más del artista</h3>
            <div id="other-tracks-list"></div>
        </div>
    `;

    detectLongTitles();

    const favBtn = container.querySelector("#fav-btn-detail");
    if (favBtn) {
        favBtn.addEventListener("click", () => {
        toggleFavorite(favBtn.dataset.id);
        updateFavoriteButtons();
        });
    }

    const compTable = container.querySelector("#compTable");
    if (compTable) {
        compTable.querySelector("thead").addEventListener("click", (e) => {
        const th = e.target.closest("th");
        if (!th)
            return;
        const col = th.dataset.sort;
        if (!col)
            return;
        if (tableState.sortCol === col) {
            tableState.sortOrder = tableState.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            tableState.sortCol = col;
            tableState.sortOrder = 'asc';
        }
        renderTable();
        });
    }
}

function renderTable() {
    const tbody = container.querySelector('#comparison-table-body');
    const { songs, sortCol, sortOrder } = tableState;
    if (!tbody)
        return;

    const sorted = [...songs].sort((a, b) => {
        let valA = a[sortCol];
        let valB = b[sortCol];

        if (valA == null)
            valA = sortCol === 'duration' ? 0 : '';
        if (valB == null)
            valB = sortCol === 'duration' ? 0 : '';
        if (typeof valA === 'string')
            valA = valA.toLowerCase();
        if (typeof valB === 'string')
            valB = valB.toLowerCase();
        if (valA < valB)
            return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB)
            return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    tbody.innerHTML = sorted.map(s => {
        const bgColor = s.isCurrent ? 'rgba(29, 185, 84, 0.08)' : 'transparent';
        const textColor = s.isCurrent ? '#1db954' : '#fff';
        const fontWeight = s.isCurrent ? '600' : '400';
        const maxDur = 300000;
        const barWidth = Math.min(( (s.duration || 0) / maxDur) * 100, 100);

        return `
            <tr style="border-bottom: 1px solid #333; background-color: ${bgColor}; transition: background 0.2s;">
                <td style="padding: 10px; color: ${textColor}; font-weight: ${fontWeight};">${s.title}</td>
                <td style="padding: 10px; color: #b3b3b3;">${s.album || 'Sencillo'}</td>
                <td style="padding: 10px; text-align: right;">
                    <div style="display:flex; align-items:center; justify-content:flex-end; gap:8px;">
                        <span>${formatTime(s.duration)}</span>
                        <div style="width:50px; height:4px; background:#444; border-radius:2px;">
                        <div style="width:${barWidth}%; height:100%; background:#1db954; border-radius:2px;"></div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    ['title','album','duration'].forEach(col => {
        const icon = container.querySelector(`#sort-icon-${col}`);
        if (icon) {
        if (tableState.sortCol === col) {
            icon.textContent = tableState.sortOrder === 'asc' ? '▲' : '▼';
            icon.style.color = '#1db954';
        } else {
            icon.textContent = '↕';
            icon.style.color = '#555';
        }
        }
    });

    renderOtherTracksList(sorted);
}

function renderOtherTracksList(songsSorted) {
    const listElem = container.querySelector("#other-tracks-list");
    const other = songsSorted.filter(s => String(s.id) !== String(currentSongId)).slice(0, 5);

    if (!listElem)
        return;
    listElem.innerHTML = "";
    other.forEach(track => {
        const div = document.createElement("div");
        div.className = "track-item";
        div.innerHTML = `
            <img src="${track.image}" alt="${track.title}">
            <div class="track-item-info">
                <p>${track.title}</p>
                <p class="duration">${formatTime(track.duration)}</p>
            </div>
        `;
        div.addEventListener("click", () => window.location.href = `detalle.html?id=${track.id}`);
        listElem.appendChild(div);
    });
}

loadDetail();
