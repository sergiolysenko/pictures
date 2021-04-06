import {Smart} from "./smart.js";
import {MenuItem} from "../const.js";

const createHeaderUserInTemplate = (user, isMainPage) => {
  const {avatar, name} = user;

  return `<div class="inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div class="relative">
            <button type="button"
              class="user-menu__button bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white relative z-20"
              id="user-menu" aria-expanded="true" aria-haspopup="true">
              <span class="sr-only">Open user menu</span>
              <img class="h-10 w-10 rounded-full"
                src=${avatar}
                alt="${name}">
            </button>
            <div
              class="user-menu__list origin-top-right z-10 absolute top-0 right-0 w-48 rounded-md rounded-tr-3xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" hidden>
                <a href="#" class="user-profile relative flex pl-10 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md rounded-tr-3xl"
                >${isMainPage ? `Your Profile` :
                `<svg class="absolute left-2 top-2" height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130">
                  <path stroke="#2f3435" d="M87.5 111l-47-47m0 0l47-47" stroke-width="8"></path>
                </svg> <span>Go back</span>`}</a>
                <a href="#" class="sign-out block pl-10 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Sign out</a>
            </div>
        </div>
      </div>`
}

export class HeaderUserInView extends Smart {
  constructor(user, choosenMenuItem) {
    super();
    this._user = user;
    this._isMainPage = choosenMenuItem === MenuItem.MAIN;

    this._userClickHandler();
    this._signOutClickHandler = this._signOutClickHandler.bind(this);
    this._profileClickHandler = this._profileClickHandler.bind(this);
  }

  getTemplate() {
    return createHeaderUserInTemplate(this._user, this._isMainPage);
  }

  _userClickHandler() {
    const button = this.getElement().querySelector('.user-menu__button');
    const menu = this.getElement().querySelector('.user-menu__list');

    button.addEventListener('click', (evt) => {
      evt.preventDefault();
      menu.hidden = !menu.hidden;
    });
  }

  _signOutClickHandler(evt) {
    evt.preventDefault();
    this._callback.signOutClick(MenuItem.SING_OUT);
  }

  setSignOutClickHandler(callback) {
    this._callback.signOutClick = callback;

    this.getElement().querySelector('.sign-out')
      .addEventListener('click', this._signOutClickHandler);
  }

  _profileClickHandler(evt) {
    evt.preventDefault();
    if (this._isMainPage) {
      this._callback.profileClick(MenuItem.PROFILE);
      return;
    }
    this._callback.profileClick(MenuItem.MAIN);
  }

  setProfileClickHandler(callback) {
    this._callback.profileClick = callback;

    this.getElement().querySelector('.user-profile')
      .addEventListener('click', this._profileClickHandler);
  }
}
