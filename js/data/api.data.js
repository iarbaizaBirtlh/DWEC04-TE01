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

const DEEZER_URL_SEARCH = "https://api.deezer.com/search?q=";
const DEEZER_URL_TRACK = "https://api.deezer.com/track/";

// Proxy oficial y gratuito de Deezer para evitar CORS
const PROXY = "https://cors-anywhere.herokuapp.com/";

async function fetchDeezer(url) {
    const response = await fetch(PROXY + url);

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
    }

    return await response.json();
}

export async function getTopTracks(term = "pop", limit = 20) {
    const url = `${DEEZER_URL_SEARCH}${encodeURIComponent(term)}&limit=${limit}`;
    const data = await fetchDeezer(url);
    return data.data || [];
}

export async function getTrackById(id) {
    const url = `${DEEZER_URL_TRACK}${id}`;
    return await fetchDeezer(url);
}

