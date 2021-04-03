import { Smart } from "./smart.js";

const createNoAcessAlertTemplate = () => {
  return `<div class="absolute z-20 inset-0 overflow-y-auto">
  <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    <div class="fixed inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
        <button type="button" class="sign-in-btn w-full inline-flex justify-center rounded-full px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-30 sm:text-sm">
          Sign in
        </button>
        <button type="button" class="later-btn mt-3 w-full inline-flex justify-center rounded-full px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-30 sm:text-sm">
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

    this._signInClickHandler = this._signInClickHandler.bind(this);
    this._laterClickHandler = this._laterClickHandler.bind(this);
  }

  getTemplate() {
    return createNoAcessAlertTemplate();
  }

  _signInClickHandler(evt) {
    evt.preventDefault();
    this._callback.signInClick();
  }

  _laterClickHandler(evt) {
    evt.preventDefault();
    this._callback.laterClick();
  }

  setSignInClickHandler(callback) {
    this._callback.signInClick = callback;

    this.getElement().querySelector('.sign-in-btn')
      .addEventListener('click', this._signInClickHandler);
  }

  setLaterClickHandler(callback) {
    this._callback.laterClick = callback;

    this.getElement().querySelector('.later-btn')
    .addEventListener('click', this._laterClickHandler);
  }
}
