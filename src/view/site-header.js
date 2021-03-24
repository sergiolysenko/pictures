import {Smart} from "./smart.js";
import {MenuItem} from "../const.js";

const createSiteHeaderTemplate = (user) => {
  const {avatar, name} = user;

  return `<nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="flex justify-start">
          <div class="flex-shrink-0 flex items-center">
            <img class="block h-8 w-auto" src="./img/logo-pictures.png" alt="photos">
            <p class="hidden ml-2 sm:block w-auto text-sm font-medium text-white font-serif">Share your pictures - share your
              mood!</p>
          </div>
        </div>
        <button class="load-picture text-white  sm:ml-auto px-3 w-auto h-10 bg-pink-500 rounded-full hover:bg-pink-600 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
          <svg viewBox="0 0 20 20" enable-background="new 0 0 20 20" class="w-6 h-6 inline-block">
            <path fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601 C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399 C15.952,9,16,9.447,16,10z"></path>
          </svg>
          <span class="text-sm">Load picture</span>
        </button>
  <!-------------- Profile dropdown -------------->
        <div class="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div class="relative">
            <div>
              <button type="button"
                class="user-menu__button bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                id="user-menu" aria-expanded="true" aria-haspopup="true">
                <span class="sr-only">Open user menu</span>
                <img class="h-10 w-10 rounded-full"
                  src=${avatar}
                  alt="User ${name} avatar">
              </button>
            </div>
            <div
              class="user-menu__list origin-top-right z-50 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu" aria-orientation="vertical" aria-labelledby="user-menu" hidden="true">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"
              value=${MenuItem.PROFILE}
              >Your Profile</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"
              value=${MenuItem.SING_OUT}
              >Sign out</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>`
}

export class SiteHeaderView extends Smart {
  constructor(user) {
    super();
    this._user = user;

    this._userClickHandler();
    this._loadPictureClickHandler = this._loadPictureClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteHeaderTemplate(this._user);
  }

  _userClickHandler() {
    const menu = this.getElement().querySelector('.user-menu__list');

    this.getElement().querySelector('.user-menu__button')
      .addEventListener('click', () => {
        menu.hidden = !menu.hidden;
      });
  }

  _loadPictureClickHandler(evt) {
    evt.preventDefault();
    this.getElement().querySelector('.load-picture').disabled = true;
    this._callback.loadPictureClick(MenuItem.LOAD_PICTURE);
  }

  setLoadPictureClickHandler(callback) {
    this._callback.loadPictureClick = callback;

    this.getElement().querySelector('.load-picture')
      .addEventListener('click', this._loadPictureClickHandler)
  }
}
