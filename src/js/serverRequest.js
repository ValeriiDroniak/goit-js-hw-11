const axios = require('axios').default;

const API_KEY = '30577990-20685eea61ea3ba40def670da'
const BASE_URL = 'https://pixabay.com/api/';

const configDefault = {
    params: {
        key: API_KEY,
        q: null,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
    }
};

export default class ServerRequest {
    constructor(url = BASE_URL, config = configDefault) {
        this.url = url;
        this.config = config;
    }

    get searchQuery() {
        return this.config.params.q;
    }

    set searchQuery(newSearchQuery) {
        this.config.params.q = newSearchQuery;
    }

    get page() {
        return this.config.params.page;
    }

    set page(newPage) {
        this.config.params.page = newPage;
    }

    incrementPage() {
        this.config.params.page += 1;
    }

    reset() {
        this.config.params.q = null;
        this.config.params.page = 1;
    }

    async getImages(searchQuery) {
        this.config.params.q = searchQuery;

        const response = await axios.get(this.url, this.config);

        return response.data;
    }
}