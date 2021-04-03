import {Smart} from "./smart";

const createAuthUiWrapperTemplate = () => {
  return `<div class="absolute z-20 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="fixed sm:max-w-lg sm:w-full">
        <div id="firebaseui-auth-container" class="relative">
          <button type="button" class="close-auth-btn absolute right-24 top-4 z-20 w-5">
          <svg class="svg-icon" viewBox="0 0 20 20">
							<path fill="red" d="M11.469,10l7.08-7.08c0.406-0.406,0.406-1.064,0-1.469c-0.406-0.406-1.063-0.406-1.469,0L10,8.53l-7.081-7.08
							c-0.406-0.406-1.064-0.406-1.469,0c-0.406,0.406-0.406,1.063,0,1.469L8.531,10L1.45,17.081c-0.406,0.406-0.406,1.064,0,1.469
							c0.203,0.203,0.469,0.304,0.735,0.304c0.266,0,0.531-0.101,0.735-0.304L10,11.469l7.08,7.081c0.203,0.203,0.469,0.304,0.735,0.304
							c0.267,0,0.532-0.101,0.735-0.304c0.406-0.406,0.406-1.064,0-1.469L11.469,10z"></path>
						</svg>
          </button>
        </div>
      </div>
    </div>
  </div>`
}

export class AuthUiWrapperView extends Smart {
  constructor() {
    super();

    this._closeClickHandler = this._closeClickHandler.bind(this);
  }

  getTemplate() {
    return createAuthUiWrapperTemplate();
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;

    this.getElement().querySelector('.close-auth-btn')
      .addEventListener('click', this._closeClickHandler);
  }
}

