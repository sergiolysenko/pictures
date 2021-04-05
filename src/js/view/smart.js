import {AbstractView} from "./abstract.js";

export class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update, justDataUpdate) {
    if (!update) {
      return;
    }

    this._data = Object.assign({}, this._data, update);

    if (justDataUpdate) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method showld have been emplemented`);
  }
}
