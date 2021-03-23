import {Smart} from "./smart.js";

const createCommentsButtonTemplate = (isCommentsOpen) => {
  return `<div class="flex justify-center">
        <button class="comments-btn font-medium text-sm" type="button">${isCommentsOpen ? `Hide` : `Show`} comments</button>
      </div>`
}

export class CommentsButtonView extends Smart {
  constructor() {
    super();
    this._data = {isCommentsOpen: false};

    this._commentsButtonHandler = this._commentsButtonHandler.bind(this);
  }

  getTemplate() {
    return createCommentsButtonTemplate(this._data.isCommentsOpen);
  }

  restoreHandlers() {
    this.setCommentsButtonHandler(this._callback.commentsClick);
  }

  _commentsButtonHandler(evt) {
    evt.preventDefault();
    this._callback.commentsClick();
    this.updateData({isCommentsOpen: !this._data.isCommentsOpen});
  }

  setCommentsButtonHandler(callback) {
    this._callback.commentsClick = callback;

    this.getElement().querySelector('.comments-btn').addEventListener('click', this._commentsButtonHandler);
  }
}
