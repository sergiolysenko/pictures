import {Smart} from "./smart.js";
import {MenuItem} from "../const.js";

const createHeaderUserInTemplate = (user) => {
  const {avatar, name} = user;

  return `<div class="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
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
            <a href="#" class="sign-out block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"
            value=${MenuItem.SING_OUT}
            >Sign out</a>
          </div>
        </div>
      </div>`
}

export class HeaderUserInView extends Smart {
  constructor(user) {
    super();
    this._user = user;

    this._userClickHandler();
    this._signOutClickHandler = this._signOutClickHandler.bind(this);
  }

  getTemplate() {
    return createHeaderUserInTemplate(this._user);
  }

  _userClickHandler() {
    const menu = this.getElement().querySelector('.user-menu__list');

    this.getElement().querySelector('.user-menu__button')
      .addEventListener('click', () => {
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
}
