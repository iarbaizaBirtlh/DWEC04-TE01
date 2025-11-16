import { getTopTracks, getTrackById } from "../data/api.data.js";
import { Song } from "../model/song.model.js";

const MusicService = {
    async getTopSongs(term = "pop", limit = 10) {
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

export default MusicService;
