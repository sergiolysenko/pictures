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

  getUpdatedFavorites(update) {
    return Object.assign({}, this._user, {
      favoritePic: this._update(this._user.favoritePic, update.id)
    })
  }

  getUpdatedLiked(update) {
    return Object.assign({}, this._user, {
      likedPic: this._update(this._user.likedPic, update.id)
    })
  }
}
