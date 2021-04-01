import {Smart} from "./smart.js";
import {MenuItem} from "../const.js";

const createHeaderUserOutTemplate = () => {
  return `<button class="sign-in text-white px-3 w-auto h-10 bg-purple-700 rounded-full hover:bg-purple-800 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
    <span class="text-sm">Sign in</span>
  </button>`;
}

export class HeaderUserOutView extends Smart {
  constructor() {
    super();

    this._signInClickHandler = this._signInClickHandler.bind(this);
  }

  getTemplate() {
    return createHeaderUserOutTemplate();
  }

  _signInClickHandler(evt) {
    evt.preventDefault();
    this._callback.signInClick(MenuItem.SING_IN);
  }

  setSignInClickHandler(callback) {
    this._callback.signInClick = callback;

    this.getElement().addEventListener('click', this._signInClickHandler);
  }
}
