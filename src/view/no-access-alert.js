import userAuthApi from "../userAuthApi.js";
import { Smart } from "./smart.js";
export {AbstractView} from "./abstract.js";

const createNoAcessAlertTemplate = () => {
  return `<div class="absolute z-20 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="flex flex-col items-center">
        <img class="block h-10 w-10" src="./img/logo-pictures.png" alt="pictures logo">
          <div class="mt-3 text-center">
            <h3 class="text-center text-lg leading-6 font-medium text-gray-900" id="modal-title">
              If you want to load pictures and leave comments you must to Sign in
            </h3>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex">
        <button type="button" class="sign-in-btn w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-30 sm:text-sm">
          Sign in
        </button>
        <button type="button" class="later-btn mt-3 w-full inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-gray-700 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-30 sm:text-sm">
          Later
        </button>
      </div>
    </div>
  </div>
</div>`
}

export class NoAccessAlertView extends Smart {
  constructor() {
    super()

    this._destroy = this._destroy.bind(this);
    this._signInClickHandler = this._signInClickHandler.bind(this);
    this.setInnerHandlers();
  }

  getTemplate() {
    return createNoAcessAlertTemplate();
  }

  _destroy() {
    this.getElement().remove();
    this.removeElement();
  }

  _signInClickHandler(evt) {
    userAuthApi.showSignIn();
    this._destroy();
  }

  setInnerHandlers() {
    this.getElement().querySelector('.sign-in-btn')
      .addEventListener('click', this._signInClickHandler);

    this.getElement().querySelector('.later-btn')
      .addEventListener('click', this._destroy);
  }
}
