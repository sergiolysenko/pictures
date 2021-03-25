import {Observer} from "../utils/observer.js";

export class UserModel extends Observer {
  constructor() {
    super();
    this._user = null;
  }

  init(user) {
    this._user = user;
  }

  getUser() {
    return this._user;
  }

  getFavorites() {
    return this._user.favorites;
  }

  getLiked() {
    return this._user.liked;
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

  updateFavorites(updateType, update) {
    this._user.favorites = this._update(this._user.favorites, update.id);

    this._notify(updateType, update);
  }

  updateLiked(updateType, update) {
    this._user.liked = this._update(this._user.liked, update.id);

    this._notify(updateType, update);
  }
}
