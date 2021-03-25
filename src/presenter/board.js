import {NewPicturePresenter} from "./new-picture.js";
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
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pictureModel.addObserver(this._handleModelEvent);
    this._newPicturePresenter = new NewPicturePresenter(this._boardContainer, this._handleViewAction, this._userModel);
  }

  init() {
    this._renderBoard();
  }

  createPicture(callback) {
    this._newPicturePresenter.init(callback);
    this._handleModeChange();
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

  _renderPictures(pictures) {
    pictures.forEach((picture) => this._renderPicture(picture));
  }

  _renderBoard() {
    const pictures = this._pictureModel.getPictures();
    const user = this._userModel.getUser();

    const boardPictures = BoardPresenter
      .parseUserPicturesToBoardData(user, pictures);

    this._renderPictures(boardPictures);
  }

  _clearBoard() {
    this._newPicturePresenter.destroy();

    Object.values(this._picturePresenter)
      .forEach((presenter) => presenter.destroy());

    this._picturePresenter = {};
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

      case UserAction.LOAD_PICTURE:
        const currentUser = this._userModel.getUser();
        update = BoardPresenter.adaptNewPictureToBoard(currentUser, update);
        this._pictureModel.loadPicture(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._picturePresenter[data.id].init(data);
        break;
      case UpdateType.MAJOR:
        this._clearBoard();
        this._renderBoard();
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

  static adaptNewPictureToBoard(user, newPicture) {
    return Object.assign({}, newPicture, {
      id: Math.floor(Math.random() * 100000),
      author: user.name,
    })
  }
}
