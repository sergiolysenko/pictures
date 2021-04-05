import {createElement} from "../utils/render.js";

export class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error("Can't instantiate abstract class");
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error("Abstract method not emplemented: getTemplate");
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
