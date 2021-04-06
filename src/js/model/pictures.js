import {Observer} from "../utils/observer.js";
import {deleteElementFromArray} from "../utils/common.js";

export class PicturesModel extends Observer {
  constructor() {
    super();
    this._pictures = [];
    this._userPictures = {
      loadedPic: [],
      likedPic: [],
      favoritePic: [],
    }
  }

  setPictures(updateType, pictures) {
    this._pictures = pictures.slice();

    this._notify(updateType);
  }

  setUserPictures(updateType, userPictures) {
    this._userPictures = Object.assign({}, userPictures);

    this._notify(updateType);
  }

  getPictures() {
    return this._pictures;
  }

  getUserPictures() {
    return this._userPictures;
  }

  updatePicture(updateType, update, userDataKeyUpdate) {
    const index = this._pictures.findIndex((picture) => picture.id === update.id);

    if (index === -1) {
      throw new Error("Can't update unexisting picture")
    }

    this._pictures = [
      ...this._pictures.slice(0, index),
      update,
      ...this._pictures.slice(index + 1)
    ]
    this.updateUserPictures(update, userDataKeyUpdate);

    this._notify(updateType, update);
  }

  loadPicture(updateType, update, userDataKeyUpdate) {
    this._pictures = [
      update,
      ...this._pictures
    ];
    this.updateUserPictures(update, userDataKeyUpdate);

    this._notify(updateType, update);
  }

  deletePicture(updateType, update) {
    const index = this._pictures.findIndex((picture) => picture.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._pictures = [
      ...this._pictures.slice(0, index),
      ...this._pictures.slice(index + 1)
    ];
    this._deletePictureFromAllUserPictures(update);

    this._notify(updateType);
  }

  _deletePictureFromAllUserPictures(deletedElement) {
    this._userPictures = Object.assign({}, this._userPictures, {
      loadedPic: deleteElementFromArray(this._userPictures.loadedPic, deletedElement),
      likedPic: deleteElementFromArray(this._userPictures.likedPic, deletedElement),
      favoritePic: deleteElementFromArray(this._userPictures.favoritePic, deletedElement),
    })
  }

  updateUserPictures(update, key) {
    const userPictureIndex = this._userPictures[key].findIndex((picture) => picture.id === update.id);

    if (userPictureIndex === -1) {
      const userPicturesWithElement = this._userPictures[key] = [
        ...this._userPictures[key],
        update
      ]

      return this._userPictures = Object.assign(
        {}, this._userPictures, {
          [key]: userPicturesWithElement,
        })
    }
    const userPicturesWithouElement= this._userPictures[key] = [
      ...this._userPictures[key].slice(0, userPictureIndex),
      ...this._userPictures[key].slice(userPictureIndex + 1)
    ]

    this._userPictures = Object.assign(
      {}, this._userPictures, {
        [key]: userPicturesWithouElement
      });
  }
}
