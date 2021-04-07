import { AbstractView } from "./abstract.js";

const createPictureTemplate = (picture) => {
  const {src, title, author, isChangeable} = picture;

  return `<section class="picture relative">
  <div class="grid">
    <div class="w-full h-80 relative">
      <button class="edit w-7 h-7 sm:w-5 sm:h-7 absolute flex items-center justify-center right-4 bottom-4 z-20 ${isChangeable ? "" : "hidden"}">
        <svg fill="white" xmlns="http://www.w3.org/2000/svg"  height="25" width="25" viewBox="0 0 383.947 383.947">
          <polygon fill="white" points="0,303.947 0,383.947 80,383.947 316.053,147.893 236.053,67.893"></polygon>
          <path fill="white" d="M377.707,56.053L327.893,6.24c-8.32-8.32-21.867-8.32-30.187,0l-39.04,39.04l80,80l39.04-39.04 C386.027,77.92,386.027,64.373,377.707,56.053z"></path>
        </svg>
      </button>
      <div class="picture-view-box w-full h-80 relative">
        <img src="${src}" alt="${title}" class="object-cover w-full h-full bg-gray-100 rounded-t-lg" />
        <div class="absolute bottom-0 z-10 w-full px-4 pt-40 pb-3 bg-gradient-to-t from-black">
          <p class="text-sm font-medium text-white">${author}</p>
          <h2 class="text-xl font-semibold text-white">${title}</h2>
        </div>
      </div>
    </div>
    <div class="social-block-wrapper bg-white rounded-b-lg py-3 px-4">

    </div>
  </div>
</section>`
}

export class PictureView extends AbstractView {
  constructor(picture) {
    super();
    this._picture = picture;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._pictureClickHandler = this._pictureClickHandler.bind(this);
  }

  getTemplate() {
    return createPictureTemplate(this._picture);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;

    this.getElement().querySelector(`.edit`).addEventListener(`click`, this._editClickHandler);
  }

  _pictureClickHandler(evt) {
    evt.preventDefault();
    this._callback.pictureClick();
  }

  setPictureClickHandler(callback) {
    this._callback.pictureClick = callback;

    this.getElement().querySelector(`.picture-view-box`).addEventListener(`click`, this._pictureClickHandler);
  }
}

