import {AbstractView} from "./abstract.js";

const createShowMoreComments = () => {
  return `<div class="flex justify-center pt-3 mb-3">
      <button class="show-more-comments font-medium text-sm" type="button">Show more comments</button>
    </div>`
}

export class ShowMoreCommentsView extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreComments();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.show-more-comments')
      .addEventListener('click', this._clickHandler);
  }
}
