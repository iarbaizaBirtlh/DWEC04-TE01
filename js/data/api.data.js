const ITUNES_URL = "https://itunes.apple.com/search";

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
