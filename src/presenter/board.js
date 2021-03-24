import {PicturePresenter} from "./picture.js";
import {UserAction, UpdateType} from "../const.js";

export class BoardPresenter {
  constructor(boardContainer, pictureModel, comments, userModel) {
    this._boardContainer = boardContainer;
    this._picturePresenter = {};
    this._pictureModel = pictureModel;
    this._userModel = userModel;
    this._comments = comments;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
  }

  init() {
    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._picturePresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderPicture(picture) {
    const picturePresenter = new PicturePresenter(this._boardContainer, this._handleModeChange, this._handleViewAction);

    picturePresenter.init(picture, this._comments);
    this._picturePresenter[picture.id] = picturePresenter;
  }

  _renderPictures() {
    const pictures = this._pictureModel.getPictures();
    const user = this._userModel.getUser();

    const boardPictures = BoardPresenter
      .parseUserPicturesToBoardData(user, pictures);

    boardPictures.forEach((picture) => this._renderPicture(picture));
  }

  _renderBoard() {
    this._renderPictures(this._pictures);
  }

  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_PICTURE:
        this._pictureModel.updatePicture(updateType,
          BoardPresenter.parseBoardDataToServerPictures(update));
        break;

      case UserAction.UPDATE_USER_FAVORITE:
        this._userModel.updateFavorites(updateType, update);
        break;

      case UserAction.UPDATE_USER_LIKE:
        this._userModel.updateLiked(updateType, update);
        break;
    }
  }

  static parseUserPicturesToBoardData(user, pictures) {
    return pictures.map((picture) => {
      return Object.assign({}, picture,
       {
        isLiked: user.liked.some((item) => item === picture.id),
        isFavorite: user.favorites.some((item) => item === picture.id),
       })
    })
  }

  static parseBoardDataToServerPictures(update) {
    const adaptedPicture = Object.assign({}, update);

    delete adaptedPicture.isLiked;
    delete adaptedPicture.isFavorite;

    return adaptedPicture;
  }
}

// При клиле на лайк нужно записывать общее количество лайков в пикча модел и айди картинки в юзер модель.
// Также с фаворитс
