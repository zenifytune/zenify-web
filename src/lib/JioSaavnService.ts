import axios from 'axios';

const BASE_URL = 'https://saavn.me';

export interface JioSaavnSong {
    id: string;
    name: string;
    album: { name: string; id: string };
    year: string;
    releaseDate: string;
    duration: string;
    label: string;
    primaryArtists: string;
    featuredArtists: string;
    explicitContent: string;
    playCount: string;
    language: string;
    hasLyrics: string;
    url: string;
    copyright: string;
    image: { quality: string; link: string }[];
    downloadUrl: { quality: string; link: string }[];
}

export const searchSongs = async (query: string): Promise<JioSaavnSong[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/search/songs`, {
            params: { query, page: 1, limit: 20 },
        });

        if (response.data && response.data.status === 'SUCCESS' && response.data.data) {
            return response.data.data.results;
        }
        return [];
    } catch (error) {
        console.error("JioSaavn Search Error:", error);
        return [];
    }
};

export const getSongDetails = async (id: string): Promise<JioSaavnSong | null> => {
    try {
        const response = await axios.get(`${BASE_URL}/songs`, {
            params: { id }
        });
        if (response.data && response.data.status === 'SUCCESS' && response.data.data) {
            return response.data.data[0];
        }
        return null;
    } catch (error) {
        console.error("JioSaavn Details Error:", error);
        return null;
    }
}
