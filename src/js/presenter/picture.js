import authPresenter from "./auth.js";
import {CommentsSectionPresenter} from "./comments.js";
import {PictureView} from "../view/picture.js";
import {ImgViewerView} from "../view/picture-img-viewer.js";
import {NewPictureView} from "../view/new-picture.js";
import {SocialBlockView} from "../view/social-block.js";
import {render, remove, RenderPosition, replace} from "../utils/render.js";
import {UpdateType, UserAction, UserDataKey} from "../const.js";

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
    this._handlePictureClick = this._handlePictureClick.bind(this);
    this._handlePictureViewerClick = this._handlePictureViewerClick.bind(this);
  }

  init(picture) {
    this._user = this._userModel.getUser();
    this._picture = this._modifyPictureDataWithUserData(picture, this._user);

    const prevPictureComponent = this._pictureComponent;
    const prevPictureEditComponent = this._pictureEditComponent;

    this._pictureComponent = new PictureView(this._picture, this._isChangeable);
    this._pictureEditComponent = new NewPictureView(this._picture);
    this._socialBlockComponent = new SocialBlockView(this._picture);

    this._socialBlockContainer = this._pictureComponent.getElement().querySelector('.social-block-wrapper');

    this._pictureComponent.setEditClickHandler(this._handleEditClick);
    this._pictureComponent.setPictureClickHandler(this._handlePictureClick);
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

  _renderSocialSection() {
    render(this._socialBlockContainer, this._socialBlockComponent, RenderPosition.BEFOREEND);
  }

  _renderCommentsSection() {
    this._commentsSectionPresenter = new CommentsSectionPresenter(this._socialBlockContainer, this._userModel, this._changeMode);
    this._commentsSectionPresenter.init(this._picture);
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

  _handlePictureClick() {
    const imgViewContainer = document.querySelector('body');
    this._imgViewerComponent = new ImgViewerView(this._picture);
    this._imgViewerComponent.setPictureViewerClickHandler(this._handlePictureViewerClick);
    render(imgViewContainer, this._imgViewerComponent, RenderPosition.AFTERBEGIN);
  }

  _handlePictureViewerClick() {
    remove(this._imgViewerComponent);
  }

  _handleEditClick() {
    this._replacePictureToEdit();
  }

  _handleFormSubmit(update) {
    this._changePicture(
        UserAction.UPDATE_PICTURE,
        UpdateType.PATCH,
        this._deleteUserData(update),
    );
  }

  _handleCancelClick() {
    this._pictureEditComponent.reset(this._picture);
    this._replaceEditToPicture();
  }

  _handleDeleteClick(picture) {
    authPresenter.showLoading(this._pictureEditComponent, {isSmall: true});
    this._changePicture(
        UserAction.DELETE_PICTURE,
        UpdateType.MAJOR,
        this._deleteUserData(picture),
        UserDataKey.LOADED_PIC
    );
  }

  _handleLikeClick(update) {
    if (!this._picture.isUserLoggedIn) {
      this._changePicture(
        UserAction.IF_NOT_LOGGED
      );
      return;
    }
    authPresenter.showLoading(this._pictureComponent, {isSmall: true});
    this._changePicture(
        UserAction.UPDATE_PICTURE,
        UpdateType.NONE,
        this._deleteUserData(update),
        UserDataKey.LIKED_PIC
    );
  }

  _handleFavoriteClick(update) {
    if (!this._picture.isUserLoggedIn) {
      this._changePicture(
        UserAction.IF_NOT_LOGGED
      );
      return;
    }
    authPresenter.showLoading(this._pictureComponent, {isSmall: true});
    this._changePicture(
      UserAction.UPDATE_USER,
      UpdateType.NONE,
      this._deleteUserData(update),
      UserDataKey.FAVORITE_PIC,
    );
  }

  _modifyPictureDataWithUserData(picture, user) {
    return Object.assign({}, picture, {
      isUserLoggedIn: user !== null,
      isChangeable: this._userModel.checkIfUserCanChangePicture(picture),
      isLiked: user ? user.likedPic.some((item) => item === picture.id) : false,
      isFavorite: user ? user.favoritePic.some((item) => item === picture.id) : false,
    })
  }

  _deleteUserData(picture) {
    const adaptedData = Object.assign({}, picture);

    delete adaptedData.isUserLoggedIn;
    delete adaptedData.isChangeable;
    delete adaptedData.isLiked;
    delete adaptedData.isFavorite;

    return adaptedData;
  }
}
