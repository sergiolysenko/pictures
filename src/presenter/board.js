import {NewPicturePresenter} from "./new-picture.js";
import {PicturePresenter} from "./picture.js";
import {UserAction, UpdateType} from "../const.js";
import firebaseApi from "../api.js";


export class BoardPresenter {
  constructor(boardContainer, picturesModel, userModel) {
    this._boardContainer = boardContainer;
    this._picturePresenter = {};
    this._picturesModel = picturesModel;
    this._userModel = userModel;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._newPicturePresenter = new NewPicturePresenter(this._boardContainer, this._handleViewAction);

    this._picturesModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderBoard();
  }

  createPicture(callback) {
    this._handleModeChange();
    this._newPicturePresenter.init(callback);
  }

  _handleModeChange() {
    this._newPicturePresenter.destroy();
    Object
      .values(this._picturePresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderPicture(picture) {
    const picturePresenter = new PicturePresenter(this._boardContainer, this._handleModeChange, this._handleViewAction, this._userModel);

    picturePresenter.init(picture);
    this._picturePresenter[picture.id] = picturePresenter;
  }

  _renderPictures(pictures) {
    pictures.forEach((picture) => this._renderPicture(picture));
  }

  _renderBoard() {
    const pictures = this._picturesModel.getPictures();
    this._renderPictures(pictures);
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
        firebaseApi.updatePicture(update)
        .then(() => {
          this._picturesModel.updatePicture(updateType, update);
        })
        break;

      case UserAction.UPDATE_USER_FAVORITE:
        this._userModel.updateFavorites(updateType, update);
        break;

      case UserAction.UPDATE_USER_LIKE:
        firebaseApi.updatePicture(update)
        .then(() => {
          this._userModel.updateLiked(updateType, update);
        })
        break;

      case UserAction.LOAD_PICTURE:
        firebaseApi.loadPicture(update)
          .then((loadedData) => {
            this._picturesModel.loadPicture(updateType, loadedData);
          })
        break;

      case UserAction.DELETE_PICTURE:
        firebaseApi.deletePicture(update)
          .then(() => {
            this._picturesModel.deletePicture(updateType, update)
          })
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
      case UpdateType.INIT:
        this._renderBoard();
        break;
    }
  }
}
