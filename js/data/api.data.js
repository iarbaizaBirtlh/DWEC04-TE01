/* const ITUNES_URL = "https://itunes.apple.com/search";

export async function getTopTracks(term = "pop",limit = 20) {
    const response = await fetch(`${ITUNES_URL}?term=${encodeURIComponent(term)}&entity=song&limit=${limit}`);
    const data = await response.json();
    return data.results;
}

export async function getTrackById(id) {
    const response = await fetch(`https://itunes.apple.com/lookup?id=${id}`);
    const data = await response.json();
    return data.results?.[0] || null;
}
 */

const API_KEY = "415d613f6e05e55eec1cd9aa99744f7e";
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export async function getTopTracks(genre = "rock", limit = 10) {
    const url = `${BASE_URL}?method=tag.gettoptracks&tag=${genre}&api_key=${API_KEY}&format=json&limit=${limit}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener tracks");

    const data = await res.json();

    // Normalización para que encaje con tu modelo
    return data.tracks.track.map(t => ({
        id: t.mbid || t.url,                          // Last.fm no tiene ID real
        title: t.name,
        artist: t.artist.name,
        album: t.album?.title || "—",
        image: t.image?.[2]?.["#text"] || "img/default.jpg",
        duration: 180000,                            // No existe en Last.fm → valor estándar
        preview: null                                // No hay audio preview
    }));
}

export async function getTrackByInfo(artist, title) {
    const url = `${BASE_URL}?method=track.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&format=json`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.track) return null;

    return {
        id: data.track.mbid || data.track.url,
        title: data.track.name,
        artist: data.track.artist.name,
        album: data.track.album?.title || "—",
        image: data.track.album?.image?.[2]?.["#text"] || "img/default.jpg",
        duration: 180000,
        preview: null
    };
}


