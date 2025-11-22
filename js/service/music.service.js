/* import { getTopTracks, getTrackById } from "../data/api.data.js";
import { Song } from "../model/song.model.js";

const MusicService = {
    async getTopSongs(term = "rock", limit = 10) {
        const rawSongs = await getTopTracks(term, limit);
        return rawSongs.map(song => new Song(
            song.trackId,
            song.trackName,
            song.artistName,
            song.collectionName,
            song.previewUrl,
            song.artworkUrl100,
            song.trackTimeMillis
        ));
    },

    async getSongDetail(id) {
        const song = await getTrackById(id);
        if(!song)
            return null;
        return new Song(
            song.trackId,
            song.trackName,
            song.artistName,
            song.collectionName,
            song.previewUrl,
            song.artworkUrl100,
            song.trackTimeMillis
        );
    }
};

export default MusicService; */

import { getTopTracks, getTrackByInfo } from "../data/api.data.js";

export default {
    async getTopSongs(genre, limit = 10) {
        const songs = await getTopTracks(genre, limit);

        // Guardamos en localStorage para poder acceder después desde detalle
        const cached = JSON.parse(localStorage.getItem("cached_tracks") || "[]");
        const merged = [...cached, ...songs];

        // Evitar duplicados
        const unique = merged.filter((s, i, arr) =>
            arr.findIndex(x => x.id === s.id) === i
        );

        localStorage.setItem("cached_tracks", JSON.stringify(unique));

        return songs;
    },

    async getSongDetail(id) {
        const cached = JSON.parse(localStorage.getItem("cached_tracks") || "[]");
        const base = cached.find(s => s.id === id);
        if (!base) return null;

        const detailed = await getTrackByInfo(base.artist, base.title);
        return detailed || base;
    }
};



