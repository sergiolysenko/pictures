import {Smart} from "./smart.js";

const BLANK_PICTURE = {
  src: "",
  title: "",
  author: "",
  likes: 0,
}

const createNewPictureTemplate = (picture) => {
  const {id = "", src = null, title} = picture;

  return `<section class="load-new-picture relative">
  <form class="bg-white h-full p7 rounded-lg mx-auto">
    <div class="h-full relative flex flex-col p-4 pb-3 text-gray-400 border border-gray-200 rounded-lg">
        <div class="h-full mb-3 relative flex flex-col justify-center text-gray-400 border border-gray-200 border-dashed rounded">
            <input accept=".jpg, .jpeg, .png" type="file" multiple class="img-input absolute inset-0 z-10 w-full h-50 p-0 m-0 outline-none opacity-0 ${id ? "" : "cursor-pointer"}" ${id ? "disabled" : ""}/>
            ${src ? `
                <img src=${src} class="object-cover w-full h-full rounded" />
              ` :
              `<div class="flex flex-col items-center justify-center py-10 text-center">
                <svg class="w-6 h-6 mr-1 text-current-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="m-0">Drag your files here or click in this area.</p>
              </div>`}
        </div>
        <div class="flex flex-col items-center">
          <div class="flex flex-row items-center w-full border rounded-3xl h-10 px-3 pb-1 mb-3">
            <div class="w-full">
              <input type="text" class="picture-title border border-transparent w-full focus:outline-none text-sm h-7 flex items-center" placeholder="Write your description" value="${title}">
            </div>
          </div>
          <div class="flex flex-row w-full">
            <button type="submit" class="button-submit flex items-center justify-center mr-1 h-10 w-full rounded-3xl bg-gray-200 hover:bg-gray-300 text-indigo-800 text-white"
            ${src ? `` : `disabled`}
            >
            ${id ? `Save` : `Load`}
            </button>
            <button type="button" class="cancel-button flex items-center justify-center h-10 w-full rounded-3xl bg-red-500 hover:bg-red-600 text-indigo-800 text-white">
              Cancel
            </button>
            ${id ? `<button type="button" class="delete-button flex items-center justify-center h-10 w-full rounded-3xl bg-red-700 hover:bg-red-800 text-indigo-800 text-white ml-1">
              DEL
            </button>` : ""}
          </div>
        </div>
      </div>
    </form>
  </section>`
}

export class NewPictureView extends Smart {
  constructor(picture = BLANK_PICTURE) {
    super();
    this._data = picture;

    this._submitHandler = this._submitHandler.bind(this);
    this._cancelClickHandler = this._cancelClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._descriptionInputHandler = this._descriptionInputHandler.bind(this);
    this._loadImgHandler = this._loadImgHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createNewPictureTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setCancelClickHandler(this._callback.cancelClick);
  }

  reset(picture) {
    this.updateData(picture);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.picture-title`)
      .addEventListener(`input`, this._descriptionInputHandler);
    this.getElement()
      .querySelector(`.img-input`)
      .addEventListener(`input`, this._loadImgHandler);
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

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  _loadImgHandler() {
    const fileChooser = this.getElement().querySelector(`.img-input`);
    const file = fileChooser.files[0];
    if (file) {
      let reader = new FileReader();

      reader.addEventListener('load', () => {
        this.updateData({
          src: reader.result,
        })
      });

      reader.readAsDataURL(file);
    }
    return file;
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

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.delete-button`).addEventListener(`click`, this._deleteClickHandler);
  }
}
