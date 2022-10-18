import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './refs';
import ServerRequest from './serverRequest';
import CreateGallery from './gallery';
import '../sass/index.scss';

// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// const lighfbox = new SimpleLightbox('.gallery a', {
//     captionSelector: 'img',
//     captionsData: 'alt',
//     caption: true,
//     captionPosition: 'bottom',
//     captionDelay: 250,
// });

const ERROR_MESSAGE = "Sorry, there are no images matching your search query. Please try again.";
const INFO_MESSAGE = "We're sorry, but you've reached the end of search results.";
const pixabay = new ServerRequest();
const gallery = new CreateGallery(refs.gallery);

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
        onFetchError();
    }
}

async function renderingImagesBySearchQuery(searchQuery) {
    const { hits, totalHits } = await pixabay.getImages(searchQuery);

    if (hits.length) {
        if (pixabay.page === 1) {
            Notify.success(`Hooray! We found ${totalHits} images.`);
        }

        gallery.rendering(hits);
        showLoadMoreAndAddListner();
    } else {
        throw new Error();
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
        Notify.info(INFO_MESSAGE);
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

function onFetchError() {
    Notify.failure(ERROR_MESSAGE);
}







// function markupPhotoCard(image) {
//     const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;

//     return `
//     <div class="photo-card">
//         <a class="photo-link" href="${largeImageURL}">
//             <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//         </a>
//         <div class="info">
//             <p class="info-item">
//                 <b>Likes</b>
//                 <span>${likes}</span>
//             </p>
//             <p class="info-item">
//                 <b>Views</b>
//                 <span>${views}</span>
//             </p>
//             <p class="info-item">
//                 <b>Comments</b>
//                 <span>${comments}</span>
//             </p>
//             <p class="info-item">
//                 <b>Downloads</b>
//                 <span>${downloads}</span>
//             </p>
//         </div>
//     </div>`;
// }