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

// api.data.js
const ITUNES_SEARCH = "https://itunes.apple.com/search";
const ITUNES_LOOKUP = "https://itunes.apple.com/lookup";

// Proxy público para evitar problemas de CORS
const PROXY = "https://cors-anywhere.herokuapp.com/";

async function fetchWithProxy(url) {
    const response = await fetch(PROXY + url);
    if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);
    const data = await response.json();
    return data;
}

export async function getTopTracks(term = "pop", limit = 20) {
    const url = `${ITUNES_SEARCH}?term=${encodeURIComponent(term)}&entity=song&limit=${limit}`;
    const data = await fetchWithProxy(url);
    return data.results || [];
}

export async function getTrackById(id) {
    const url = `${ITUNES_LOOKUP}?id=${id}`;
    const data = await fetchWithProxy(url);
    return data.results?.[0] || null;
}

