import { Smart } from "./smart.js";

const createErrorAlertTemplate = () => {
  return `<div class="absolute z-20 inset-0 overflow-hidden">
  <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    <div class="fixed inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="flex flex-col items-center">
        <img class="block h-10 w-10" src="./img/logo-pictures.png" alt="pictures logo">
          <div class="mt-3 text-center">
            <h3 class="text-center text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Something bad happend! We are very sorry!
              Please try later!
            </h3>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex">
        <button type="button" class="close-error-btn w-full inline-flex justify-center rounded-full px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-30 sm:text-sm">
          Ok!
        </button>
      </div>
    </div>
  </div>
</div>`
}

export class ErrorAlertView extends Smart {
  constructor() {
    super()

    this._closeErrorClickHandler = this._closeErrorClickHandler.bind(this);
  }

  getTemplate() {
    return createErrorAlertTemplate();
  }

  _closeErrorClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeErrorClick();
  }

  setCloseErrorClickHandler(callback) {
    this._callback.closeErrorClick = callback;

    this.getElement().querySelector('.close-error-btn')
      .addEventListener('click', this._closeErrorClickHandler);
  }
}
