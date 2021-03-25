import {Smart} from "./smart.js";
import {UserAction, UpdateType} from "../const.js";

const BLANK_COMMENT = {
  author: "",
  avatar: "",
  text: "",
  time: "",
  likeCount: 0,
}

const createCommentsSection = () => {
  return `<div>
    <div class="comments-list-wrapper">
      <div class="comments-list pt-4">
      </div>
    </div>

    <form class="flex flex-row items-center">
      <div class="flex flex-row items-center w-full border rounded-3xl h-10 px-3 pb-1">
        <div class="w-full">
          <input type="text" class="comment-input border border-transparent w-full focus:outline-none text-sm h-7 flex items-center" placeholder="Write your comment....">
        </div>
      </div>
      <div class="ml-1">
        <button class="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 text-indigo-800 text-white" type="submit">
          <svg class="w-5 h-5 transform rotate-90 -mr-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
    </form>
  </div>`
}

export class CommentsSectionView extends Smart {
  constructor() {
    super();
    this._data = BLANK_COMMENT;

    this._imputCommentHandler = this._imputCommentHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createCommentsSection();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.submit)
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.comment-input`)
      .addEventListener(`input`, this._imputCommentHandler);
  }

  _imputCommentHandler(evt) {
    evt.preventDefault();
    this.updateData({
      text: evt.target.value,
    }, true)
  }

  _submitHandler(evt) {
    evt.preventDefault();

    this._callback.submit(
      UserAction.ADD_COMMENT,
      UpdateType.MAJOR,
      this._data);
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;

    this.getElement().querySelector('form')
      .addEventListener('submit', this._submitHandler);
  }
}
