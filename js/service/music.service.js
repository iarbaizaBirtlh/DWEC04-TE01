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

import { getTopTracks, getTrackById } from "../data/api.data.js";
import { Song } from "../model/song.model.js";

export const MusicService = {
    async getTopSongs(term) {
        const raw = await getTopTracks(term, 10);

        return raw.map(song => new Song(
            song.id,
            song.title,
            song.artist.name,
            song.album.title,
            song.preview,
            song.album.cover_medium,
            song.duration * 1000
        ));
    },

    async getSongDetail(id) {
        const song = await getTrackById(id);

        return new Song(
            song.id,
            song.title,
            song.artist.name,
            song.album.title,
            song.preview,
            song.album.cover_medium,
            song.duration * 1000
        );
    }
};

