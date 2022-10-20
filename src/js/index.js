import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './refs';
import photoCardTpl from '../templates/photo-card.hbs';
import ServerRequest from './serverRequest';
import CreateGallery from './gallery';
import '../sass/index.scss';

const ERROR_MESSAGE = "Sorry, there are no images matching your search query. Please try again.";
const INFO_MESSAGE = "We're sorry, but you've reached the end of search results.";

const pixabay = new ServerRequest();
const gallery = new CreateGallery(refs.gallery, photoCardTpl);

hiddenLoadMore();

/* Default search query */
refs.form[0].value = 'bubble';
/*  */
refs.form.addEventListener('submit', onSearch);

async function onSearch(event) {
    event.preventDefault();
    factoryResetHTML();

    const searchQuery = event.target.firstElementChild.value.trim();
    // console.log(event.target[0].value);
    // let searchQuery = null;
    // new FormData(event.currentTarget).forEach(value => searchQuery = value.trim());

    if (!searchQuery) {
        return;
    }

    try {
        await renderingImagesBySearchQuery(searchQuery);
    } catch (error) {
        Notify.failure(ERROR_MESSAGE);
    }
}

async function renderingImagesBySearchQuery(searchQuery) {
    const { hits, totalHits } = await pixabay.getImages(searchQuery);

    if (hits.length) {
        gallery.rendering(hits);

        if (pixabay.page === 1) {
            const endPage = Math.ceil(totalHits / pixabay.per_page);

            Notify.success(`Hooray! We found ${totalHits} images.`);

            if (pixabay.page !== endPage) {
                showLoadMoreAndAddListner();
            }
        }
    } else {
        throw new Error(INFO_MESSAGE);
    }
}

function showLoadMoreAndAddListner() {
    refs.loadMoreBtn.classList.remove('is-hidden');
    refs.loadMoreBtn.addEventListener('click', onShowNextPage);
}

async function onShowNextPage() {
    pixabay.incrementPage();

    try {
        await renderingImagesBySearchQuery(pixabay.searchQuery);
    } catch (error) {
        Notify.info(error.message);
        hiddenLoadMore();
    }
}

function hiddenLoadMore() {
    refs.loadMoreBtn.classList.add('is-hidden');
}

function factoryResetHTML() {
    hiddenLoadMore();
    gallery.remove();
    pixabay.reset();
}