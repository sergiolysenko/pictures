import { AbstractView } from "./abstract.js";

const createPictureTemplate = (picture, isChangeable) => {
  const {src, title, author} = picture;

  return `<section class="picture">
  <div class="grid">
    <div class="w-full h-80 relative">
      <button class="edit absolute flex items-center justify-center right-4 bottom-4 z-20 ${isChangeable ? "" : "hidden"}">
        <svg width="15" height="15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 383.947 383.947" style="enable-background:new 0 0 383.947 383.947;" xml:space="preserve">
          <polygon fill="white" points="0,303.947 0,383.947 80,383.947 316.053,147.893 236.053,67.893"></polygon>
          <path fill="white" d="M377.707,56.053L327.893,6.24c-8.32-8.32-21.867-8.32-30.187,0l-39.04,39.04l80,80l39.04-39.04 C386.027,77.92,386.027,64.373,377.707,56.053z"></path>
        </svg>
      </button>
      <img src="${src}" alt="${title}" class="object-cover w-full h-full bg-gray-100 rounded-t-lg" />
      <div class="absolute bottom-0 z-10 w-full px-4 pt-40 pb-3 bg-gradient-to-t from-black">
        <p class="text-sm font-medium text-white">${author}</p>
        <h2 class="text-xl font-semibold text-white">${title}</h2>
      </div>
    </div>
    <div class="social-block-wrapper bg-white rounded-b-lg py-3 px-4">

    </div>
  </div>
</section>`
}

export class PictureView extends AbstractView {
  constructor(picture, isChangeable) {
    super();
    this._picture = picture;
    this._isChangeable = isChangeable;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createPictureTemplate(this._picture, this._isChangeable);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;

    this.getElement().querySelector(`.edit`).addEventListener(`click`, this._editClickHandler);
  }
}

