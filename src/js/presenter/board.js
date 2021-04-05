import {NewPicturePresenter} from "./new-picture.js";
import {PicturePresenter} from "./picture.js";
import {NoAccessAlertView} from "../view/no-access-alert.js";
import {UserAction, UpdateType} from "../const.js";
import ContentDataApi from "../api/content-data.js";
import UserApi from "../api/user.js";
import authPresenter from "./auth.js";

export class BoardPresenter {
  constructor(boardContainer, picturesModel, userModel) {
    this._boardContainer = boardContainer;
    this._picturePresenter = {};
    this._picturesModel = picturesModel;
    this._userModel = userModel;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._noAccessAlertComponent = new NoAccessAlertView();
    this._newPicturePresenter = new NewPicturePresenter(this._boardContainer, this._handleViewAction, this._userModel);

    this._picturesModel.addObserver(this._handleModelEvent);
    this._userModel.addObserver(this._handleModelEvent);
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
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const pictures = this._picturesModel.getPictures();
    this._renderPictures(pictures);
  }

  _clearBoard() {
    this._newPicturePresenter.destroy();

    Object.values(this._picturePresenter)
      .forEach((presenter) => presenter.destroy());

    this._picturePresenter = {};
  }

  updateUserData(updateType, update, userDataKeyUpdate) {
    if(!userDataKeyUpdate) {
      return;
    }
    const newUserData = this._userModel.updateUserDataByKey(update, userDataKeyUpdate);

    UserApi.updateUserData(newUserData).then(() => {
      this._userModel.updateUser(updateType, newUserData);
      authPresenter.destroyLoading();
    });
  }

  _handleViewAction(actionType, updateType, update, userDataKeyUpdate) {
    switch(actionType) {
      case UserAction.IF_NOT_LOGGED:
        authPresenter.showNoAccess();
      break;

      case UserAction.UPDATE_PICTURE:
        ContentDataApi.updatePicture(update)
        .then(() => {
          this._picturesModel.updatePicture(updateType, update);
          this.updateUserData(updateType, update, userDataKeyUpdate);
          authPresenter.destroyLoading();
        })
        break;

      case UserAction.UPDATE_USER:
        this.updateUserData(updateType, update, userDataKeyUpdate);
        break;

      case UserAction.LOAD_PICTURE:
        ContentDataApi.loadPicture(update, this._userModel.getUser())
          .then((loadedData) => {
            this._picturesModel.loadPicture(UpdateType.NONE, loadedData);
            this.updateUserData(updateType, loadedData, userDataKeyUpdate);
            authPresenter.destroyLoading();
          })
        break;

      case UserAction.DELETE_PICTURE:
        ContentDataApi.deletePicture(update)
          .then(() => {
            this._picturesModel.deletePicture(updateType, update);
            this.updateUserData(updateType, update, userDataKeyUpdate);
            authPresenter.destroyLoading();
          })
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.NONE:
        break;
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
