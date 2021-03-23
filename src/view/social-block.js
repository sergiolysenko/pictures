import {Smart} from "./smart.js";

const createSocialBlockTemplate = (picture) => {
  const {likes} = picture;

  return `<div class="flex">
          <div class="flex items-center text-sm font-medium">
            <div class="">
              <span class="text-black">Likes</span>
            </div>
            <div class="text-base font-normal mx-2">·</div>
            <div class="">
              <span class="text-black">${likes}</span>
            </div>
          </div>
          <label class="flex-none flex ml-auto items-center justify-center cursor-pointer hover:text-yellow-500">
            <input type="checkbox" class="favorite appearance-none" aria-label="favorite">
            <svg class="flex-shrink-0 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </label>
          <label class="flex-none flex items-center justify-center cursor-pointer hover:text-red-500 ml-1">
            <input class="like appearance-none" type="checkbox" aria-label="like">
            <svg class="flex-shrink-0 h-5 w-5" width="20" height="20" fill="currentColor">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </label>
        </div>`
}

export class SocialBlockView extends Smart {
  constructor(picture) {
    super();

    this._picture = picture;

    this._likeClickHandler = this._likeClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createSocialBlockTemplate(this._picture);
  }

  _likeClickHandler() {
    this._callback.likeClick();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }

  setLikeClickHandler(callback) {
    this._callback.likeClick = callback;

    this.getElement().querySelector('.like').addEventListener('click', this._likeClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;

    this.getElement().querySelector('.favorite').addEventListener('click', this._favoriteClickHandler);
  }
}
