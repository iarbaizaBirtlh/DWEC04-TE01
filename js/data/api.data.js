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

const ITUNES_URL = "https://itunes.apple.com/search";
const LOOKUP_URL = "https://itunes.apple.com/lookup";

// Proxy CORS
const PROXY = "https://api.allorigins.win/get?url=";

async function fetchWithProxy(url) {
    const response = await fetch(`${PROXY}${encodeURIComponent(url)}`);
    const text = await response.text();
    // AllOrigins devuelve { contents: "..." }
    const data = JSON.parse(text);
    return JSON.parse(data.contents);
}

export async function getTopTracks(term = "pop", limit = 20) {
    const url = `${ITUNES_URL}?term=${encodeURIComponent(term)}&entity=song&limit=${limit}`;
    const data = await fetchWithProxy(url);
    return data.results;
}

export async function getTrackById(id) {
    const url = `${LOOKUP_URL}?id=${id}`;
    const data = await fetchWithProxy(url);
    return data.results?.[0] || null;
}

