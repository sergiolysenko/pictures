import {Observer} from "../utils/observer.js";

export class UserModel extends Observer {
  constructor() {
    super();
    this._user = null;
  }

  setUser(user) {
    this._user = user;
  }

  updateUser(updateType, update) {
    this._user = update;

    this._notify(updateType, update);
  }

  getUser() {
    return this._user;
  }

  _update(userItemsID, newItemID) {
    const index = userItemsID.findIndex((item) => item === newItemID);

    if (index === -1) {
      return userItemsID = [...userItemsID, newItemID];
    }

    return userItemsID = [
      ...userItemsID.slice(0, index),
      ...userItemsID.slice(index + 1),
    ]
  }

  updateUserDataByKey(update, key) {
    return Object.assign({}, this._user, {
      [key]: this._update(this._user[key], update.id)
    })
  }

  checkIfUserCanChangePicture(picture) {
    if (this._user === null) {
      return false;
    }

    return this._user.loadedPic.some((picId) => picId === picture.id)
  }

  checkIfUserCanDeleteComment(comment) {
    if (this._user === null) {
      return false;
    }

    return this._user.createdComm.some((commId) => commId === comment.id)
  }
}
