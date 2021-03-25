import {CommentsButtonView} from "../view/show-comments.js";
import {CommentsContainerView} from "../view/comments-container.js";
import {PictureView} from "../view/picture.js";
import {SocialBlockView} from "../view/social-block.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {UpdateType, UserAction} from "../const.js";
import {CommentsSectionPresenter} from "./comments.js";
import {CommentsModel} from "../model/comments.js";

export class PicturePresenter {
  constructor(picturesContainer, changeMode, changePicture, userModel) {
    this._picturesContainer = picturesContainer;
    this._changeMode = changeMode;
    this._changePicture = changePicture;
    this._userModel = userModel;

    this._isCommentsOpen = false;

    this._commentsButtonComponent = null;
    this._pictureComponent = null;
    this._socialBlockComponent = null;
    this._socialBlockContainer = null;
    this._commentsContainer = null;

    this._handleCommentsClick = this._handleCommentsClick.bind(this);
    this._handleLikeClick = this._handleLikeClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(picture) {
    this._picture = picture;

    this._pictureComponent = new PictureView(this._picture);
    this._commentsButtonComponent = new CommentsButtonView();
    this._socialBlockComponent = new SocialBlockView(this._picture);
    this._commentsContainerComponent = new CommentsContainerView();
    this._commentsModel = new CommentsModel();

    this._socialBlockContainer = this._pictureComponent.getElement().querySelector('.social-block-wrapper');

    render(this._picturesContainer, this._pictureComponent, RenderPosition.BEFOREEND);
    render(this._socialBlockContainer, this._socialBlockComponent, RenderPosition.BEFOREEND);
    render(this._socialBlockContainer, this._commentsButtonComponent, RenderPosition.BEFOREEND);
    render(this._socialBlockContainer, this._commentsContainerComponent, RenderPosition.BEFOREEND)

    this._commentsButtonComponent.setCommentsButtonHandler(this._handleCommentsClick);
    this._socialBlockComponent.setLikeClickHandler(this._handleLikeClick);
    this._socialBlockComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  destroy() {
    this._clearCommentsSection();
    remove(this._pictureComponent);
    remove(this._commentsButtonComponent);
    remove(this._socialBlockComponent);
    remove(this._commentsContainerComponent);
  }

  resetView() {
    this._commentsButtonComponent.updateData({isCommentsOpen: false});
    this._isCommentsOpen = false;
    this._clearCommentsSection();
  }

  _handleCommentsClick() {
    if (this._isCommentsOpen) {
      this._clearCommentsSection();
    } else {
      this._changeMode();
      this._renderCommentsSection();
    }

    this._isCommentsOpen = !this._isCommentsOpen;
  }

  _handleLikeClick(update) {
    this._changePicture(
        UserAction.UPDATE_PICTURE,
        UpdateType.NONE,
        update
    );
    this._changePicture(
      UserAction.UPDATE_USER_LIKE,
      UpdateType.NONE,
      update
    );
  }

  _handleFavoriteClick(update) {
    this._changePicture(
      UserAction.UPDATE_USER_FAVORITE,
      UpdateType.NONE,
      update
    );
  }

  _clearCommentsSection() {
    if(!this._commentsSectionPresenter) {
      return;
    }
    this._commentsSectionPresenter.destroy();
  }

  _renderCommentsSection() {
    const commentsContainer = this._commentsContainerComponent.getElement();
    this._commentsSectionPresenter = new CommentsSectionPresenter(commentsContainer, this._commentsModel, this._userModel);
    this._commentsSectionPresenter.init(this._picture);
  }
}
