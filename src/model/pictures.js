import {Observer} from "../utils/observer.js";

export class PicturesModel extends Observer {
  constructor() {
    super();
    this._pictures = [];
  }

  setPictures(updateType, pictures) {
    this._pictures = pictures.slice();

    this._notify(updateType);
  }

  getPictures() {
    return this._pictures;
  }

  updatePicture(updateType, update) {
    const index = this._pictures.findIndex((picture) => picture.id === update.id);

    if (index === -1) {
      throw new Error("Can't update unexisting picture")
    }

    this._pictures = [
      ...this._pictures.slice(0, index),
      update,
      ...this._pictures.slice(index + 1)
    ]

    this._notify(updateType, update);
  }

  loadPicture(updateType, update) {
    this._pictures = [
      update,
      ...this._pictures
    ];

    this._notify(updateType, update);
  }
}
