import {render, remove, RenderPosition} from "../utils/render.js";
import {NewPictureView} from "../view/new-picture.js";
import {UserAction, UpdateType, UserDataKey} from "../const.js";
import authPresenter from "./auth.js";

export class NewPicturePresenter {
  constructor(picturesContainer, changeData, userModel) {
    this._picturesContainer = picturesContainer;
    this._changeData = changeData;
    this._userModel = userModel;
    this._newPictureComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
  }

  init(cancelCallback) {
    this._cancelCallback = cancelCallback;
    if (this._newPictureComponent !== null) {
      return;
    }

    this._newPictureComponent = new NewPictureView();

    this._newPictureComponent.setSubmitHandler(this._handleFormSubmit);
    this._newPictureComponent.setCancelClickHandler(this._handleCancelClick);

    render(this._picturesContainer, this._newPictureComponent, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    if (this._cancelCallback) {
      this._cancelCallback();
    }

    if (this._newPictureComponent === null) {
      return;
    }

    remove(this._newPictureComponent);
    this._newPictureComponent = null;
  }

  _handleCancelClick() {
    this.destroy();
  }

  _handleFormSubmit(picture) {
    authPresenter.showLoading(this._newPictureComponent, {isSmall: true});
    this._changeData(
        UserAction.LOAD_PICTURE,
        UpdateType.MAJOR,
        picture,
        UserDataKey.LOADED_PIC
    );
  }
}
