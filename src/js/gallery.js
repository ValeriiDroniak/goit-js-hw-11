// import photoCardTpl from '../templates/photo-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css'

const lightbox = new SimpleLightbox('.gallery a');

export default class CreateGallery {
    constructor(galleryRef, template) {
        this.gallery = galleryRef;
        this.template = template;
    }

    rendering(images) {
        const markupCard = images.map(this.template).join('');

        this.gallery.insertAdjacentHTML('beforeend', markupCard);
        lightbox.refresh();
    }

    remove() {
        this.gallery.innerHTML = '';
    }
}