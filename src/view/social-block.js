import {Smart} from "./smart.js";

const createSocialBlockTemplate = (picture) => {
  const {likes, isFavorite, isLiked} = picture;

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
            <input type="checkbox" class="favorite appearance-none" aria-label="favorite" ${isFavorite ? `checked`: ``}>
            <svg class="flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </label>
          <label class="flex-none flex items-center justify-center cursor-pointer hover:text-red-500">
            <input class="like appearance-none" type="checkbox" aria-label="like" ${isLiked ? `checked`: ``}>
            <svg class="flex-shrink-0" width="25" height="25" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </label>
        </div>`
}

export class SocialBlockView extends Smart {
  constructor(picture, isUserLoggedIn) {
    super();
    this._data = picture;
    this._isUserLoggedIn = isUserLoggedIn;

    this._likeClickHandler = this._likeClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createSocialBlockTemplate(this._data);
  }

  restoreHandlers() {
    this.setLikeClickHandler(this._callback.likeClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  }

  _likeClickHandler(evt) {
    if (this._isUserLoggedIn) {
      const sign = evt.target.checked ? 1 : -1;
      this.updateData({
        likes: this._data.likes + sign,
        isLiked: !this._data.isLiked,
      });
    }
    evt.preventDefault();
    this._callback.likeClick(this._data);
  }

  _favoriteClickHandler(evt) {
    if (this._isUserLoggedIn) {
      this.updateData({
        isFavorite: !this._data.isFavorite,
      });
    }
    evt.preventDefault();
    this._callback.favoriteClick(this._data);
  }

  setLikeClickHandler(callback) {
    this._callback.likeClick = callback;

    this.getElement().querySelector('.like')
      .addEventListener('click', this._likeClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;

    this.getElement().querySelector('.favorite').addEventListener('click', this._favoriteClickHandler);
  }
}
