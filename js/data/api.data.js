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
} */

const DEEZER_SEARCH = "https://api.deezer.com/search";
const DEEZER_TRACK = "https://api.deezer.com/track";

export async function getTopTracks(artist = "eminem", limit = 20) {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`${DEEZER_SEARCH}?q=artist:"${artist}"&limit=${limit}`)}`);
    const data = await response.json();
    const results = JSON.parse(data.contents).data; // Deezer wrapped in proxy
    return results;
}

export async function getTrackById(id) {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`${DEEZER_TRACK}/${id}`)}`);
    const data = await response.json();
    return JSON.parse(data.contents); // Track object
}

