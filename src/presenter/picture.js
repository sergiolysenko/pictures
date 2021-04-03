import {PictureView} from "../view/picture.js";
import {NewPictureView} from "../view/new-picture.js";
import {SocialBlockView} from "../view/social-block.js";
import {render, remove, RenderPosition, replace} from "../utils/render.js";
import {UpdateType, UserAction, UserDataKey} from "../const.js";
import {CommentsSectionPresenter} from "./comments.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
};

export class PicturePresenter {
  constructor(picturesContainer, changeMode, changePicture, userModel) {
    this._picturesContainer = picturesContainer;
    this._changeMode = changeMode;
    this._changePicture = changePicture;
    this._userModel = userModel;

    this._mode = Mode.DEFAULT;

    this._pictureComponent = null;
    this._pictureEditComponent = null;
    this._socialBlockComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleLikeClick = this._handleLikeClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(picture) {
    this._picture = picture;
    this._isUserLoggedIn = this._userModel.getUser() !== null;
    this._isChangeable = this._userModel.checkIfUserCanChangePicture(this._picture);

    const prevPictureComponent = this._pictureComponent;
    const prevPictureEditComponent = this._pictureEditComponent;

    this._pictureComponent = new PictureView(this._picture, this._isChangeable);
    this._pictureEditComponent = new NewPictureView(this._picture);
    this._socialBlockComponent = new SocialBlockView(this._picture, this._isUserLoggedIn);

    this._socialBlockContainer = this._pictureComponent.getElement().querySelector('.social-block-wrapper');

    this._pictureComponent.setEditClickHandler(this._handleEditClick);
    this._socialBlockComponent.setLikeClickHandler(this._handleLikeClick);
    this._socialBlockComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pictureEditComponent.setSubmitHandler(this._handleFormSubmit);
    this._pictureEditComponent.setCancelClickHandler(this._handleCancelClick);
    this._pictureEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    this._renderSocialSection();
    this._renderCommentsSection();

    if (prevPictureComponent === null || prevPictureEditComponent === null) {
      render(this._picturesContainer, this._pictureComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(prevPictureComponent, this._pictureComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(prevPictureEditComponent, this._pictureComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPictureComponent);
    remove(prevPictureEditComponent);
  }

  destroy() {
    this._commentsSectionPresenter.destroy();
    remove(this._pictureComponent);
    remove(this._pictureEditComponent);
    remove(this._socialBlockComponent);
  }

  resetView() {
    this._commentsSectionPresenter.clearCommentsSection();
    if (this._mode === Mode.EDITING) {
      this._replaceEditToPicture();
    }
  }

  _replacePictureToEdit() {
    replace(this._pictureComponent, this._pictureEditComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditToPicture() {
    replace(this._pictureEditComponent, this._pictureComponent);
    this._mode = Mode.DEFAULT;
  }

  _handleEditClick() {
    this._replacePictureToEdit();
  }

  _handleFormSubmit(update) {
    this._changePicture(
        UserAction.UPDATE_PICTURE,
        UpdateType.PATCH,
        update
    );
  }

  _handleCancelClick() {
    this._pictureEditComponent.reset(this._picture);
    this._replaceEditToPicture();
  }

  _handleDeleteClick(picture) {
    this._changePicture(
        UserAction.DELETE_PICTURE,
        UpdateType.MAJOR,
        picture,
        UserDataKey.LOADED_PIC
    );
  }

  _handleLikeClick(update) {
    if (!this._isUserLoggedIn) {
      this._changePicture(
        UserAction.IF_NOT_LOGGED
      );
      return;
    }
    this._changePicture(
        UserAction.UPDATE_PICTURE,
        UpdateType.NONE,
        update,
        UserDataKey.LIKED_PIC
    );
  }

  _handleFavoriteClick(update) {
    if (!this._isUserLoggedIn) {
      this._changePicture(
        UserAction.IF_NOT_LOGGED
      );
      return;
    }
    this._changePicture(
      UserAction.UPDATE_USER,
      UpdateType.NONE,
      update,
      UserDataKey.FAVORITE_PIC,
    );
  }

  _renderSocialSection() {
    render(this._socialBlockContainer, this._socialBlockComponent, RenderPosition.BEFOREEND);
  }

  _renderCommentsSection() {
    this._commentsSectionPresenter = new CommentsSectionPresenter(this._socialBlockContainer, this._userModel, this._changeMode);
    this._commentsSectionPresenter.init(this._picture);
  }
}
