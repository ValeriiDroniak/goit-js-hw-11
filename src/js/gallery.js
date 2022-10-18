// import photoCardTpl from '../templates/photo-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css'

const lightbox = new SimpleLightbox('.gallery a');

export default class CreateGallery {
    constructor(galleryRef) {
        this.gallery = galleryRef;
    }

    markupCard(image) {
        const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;

        return `
    <div class="photo-card">
        <a class="photo-link" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
            <p class="info-item">
                <b>Likes</b>
                ${likes}
            </p>
            <p class="info-item">
                <b>Views</b>
                ${views}
            </p>
            <p class="info-item">
                <b>Comments</b>
                ${comments}
            </p>
            <p class="info-item">
                <b>Downloads</b>
                ${downloads}
            </p>
        </div>
    </div>`;
    }

    rendering(images) {
        this.gallery.insertAdjacentHTML('beforeend', images.map(this.markupCard).join(''));
        lightbox.refresh();
    }

    remove() {
        this.gallery.innerHTML = '';
    }
}