import {Smart} from "./smart.js";
import {MenuItem} from "../const.js";

const createSiteHeaderTemplate = (user, isMainPage) => {
  return `<nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="header-user-nav relative flex items-center justify-between h-16">
        <div class="flex justify-start">
          <div class="flex-shrink-0 flex items-center">
            <a
              ${isMainPage ? `` : `href="#"`} class="logo-menu-main">
              <img class="block h-10 w-auto" src="./img/logo-pictures.png" alt="photos">
            </a>
            <p class="hidden ml-2 w-auto text-2xl text-white font-brushwell sm:block md:text-3xl">Share your pictures - share your
              mood!</p>
          </div>
        </div>
        <button
          ${user && isMainPage ? "" : "hidden"}
          class="load-picture text-white  sm:ml-auto px-3 w-auto h-10 bg-pink-500 rounded-full hover:bg-pink-600 active:shadow-lg mouse shadow transition ease-in duration-200 disabled:bg-grey-500 focus:outline-none">
          <svg viewBox="0 0 20 20" enable-background="new 0 0 20 20" class="w-6 h-6 inline-block">
            <path fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601 C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399 C15.952,9,16,9.447,16,10z"></path>
          </svg>
          <span class="text-sm">Load picture</span>
        </button>
      </div>
    </div>
  </nav>`
}

export class SiteHeaderView extends Smart {
  constructor(user, choosenMenuItem) {
    super();
    this._user = user;
    this._isMainPage = choosenMenuItem === MenuItem.MAIN;

    this._loadPictureClickHandler = this._loadPictureClickHandler.bind(this);
    this._logoClickHandler = this._logoClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteHeaderTemplate(this._user, this._isMainPage);
  }

  _loadPictureClickHandler(evt) {
    evt.preventDefault();
    this.getElement().querySelector('.load-picture').disabled = true;
    this._callback.loadPictureClick(MenuItem.LOAD_PICTURE);
  }

  setLoadPictureClickHandler(callback) {
    this._callback.loadPictureClick = callback;

    this.getElement().querySelector('.load-picture')
      .addEventListener('click', this._loadPictureClickHandler);
  }

  _logoClickHandler(evt) {
    evt.preventDefault();
    this._callback.logoClick(MenuItem.MAIN);
  }

  setLogoClickHandler(callback) {
    if (this._isMainPage) {
      return;
    }

    this._callback.logoClick = callback;
    this.getElement().querySelector('.logo-menu-main')
      .addEventListener('click', this._logoClickHandler);
  }
}
