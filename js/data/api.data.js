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

const DEEZER_SEARCH_URL = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q="; // solo si pruebas local, para GH Pages usar proxy propio o JSON temporal
const DEEZER_TRACK_URL = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/track/"; 

// Obtener canciones por término
export async function getTopTracks(term = "pop", limit = 20) {
    try {
        const response = await fetch(`${DEEZER_SEARCH_URL}${encodeURIComponent(term)}&limit=${limit}`);
        const data = await response.json();
        return data.data || [];
    } catch (err) {
        console.error("Error al obtener canciones:", err);
        return [];
    }
}

// Obtener detalle de canción por id
export async function getTrackById(id) {
    try {
        const response = await fetch(`${DEEZER_TRACK_URL}${id}`);
        const data = await response.json();
        return data || null;
    } catch (err) {
        console.error("Error al obtener detalle:", err);
        return null;
    }
}
