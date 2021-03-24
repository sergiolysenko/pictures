import {Smart} from "./smart.js";
import {UserModel} from "../model/user.js";

const BLANK_PICTURE = {
  id: Math.floor(Math.random() * 100000),
  src: "",
  title: "",
  author: "",
  likes: 0,
}

const createNewPictureTemplate = (picture) => {
  return `<section class="load-new-picture">
  <form class="bg-white h-full p7 rounded-lg mx-auto">
    <div class="h-full relative flex flex-col p-4 pb-3 text-gray-400 border border-gray-200 rounded-lg">
        <div class="h-full mb-3 relative flex flex-col justify-center text-gray-400 border border-gray-200 border-dashed rounded cursor-pointer">
            <input accept="*" type="file" multiple class="absolute inset-0 z-10 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"/>
            <div class="flex flex-col items-center justify-center py-10 text-center">
                <svg class="w-6 h-6 mr-1 text-current-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="m-0">Drag your files here or click in this area.</p>
            </div>
        </div>
        <div class="flex flex-col items-center">
          <div class="flex flex-row items-center w-full border rounded-3xl h-10 px-3 pb-1 mb-3">
            <div class="w-full">
              <input type="text" class="border border-transparent w-full focus:outline-none text-sm h-7 flex items-center" placeholder="Write your description">
            </div>
          </div>
          <div class="flex flex-row w-full">
            <button type="submit" class="button-submit flex items-center justify-center mr-1 h-10 w-full rounded-3xl bg-gray-200 hover:bg-gray-300 text-indigo-800 text-white">
              Load
            </button>
            <button type="button" class="cancel-button flex items-center justify-center h-10 w-full rounded-3xl bg-red-500 hover:bg-red-600 text-indigo-800 text-white">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  </section>`
}


export class NewPictureView extends Smart {
  constructor() {
    super();
    this._data = BLANK_PICTURE;

    this._submitHandler = this._submitHandler.bind(this);
    this._cancelClickHandler = this._cancelClickHandler.bind(this);
  }

  getTemplate() {
    return createNewPictureTemplate(this._data);
  }

  _descriptionInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      title: evt.target.value
    }, true);
  }

  _cancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.cancelClick();
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._data);
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;

    this.getElement().querySelector('form')
      .addEventListener('submit', this._submitHandler);
  }

  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
    this.getElement().querySelector(`.cancel-button`)
      .addEventListener(`click`, this._cancelClickHandler);
  }
}
