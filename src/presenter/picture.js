import {CommentsButtonView} from "../view/show-comments.js";
import {CommentsSectionView} from "../view/comments.js";
import {CommentPresenter} from "./comment.js";
import {PictureView} from "../view/picture.js";
import {SocialBlockView} from "../view/social-block.js";
import {ShowMoreCommentsView} from "../view/show-more-comments.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {UpdateType, UserAction} from "../const.js";

const COMMENTS_COUNT_PER_STEP = 3;

export class PicturePresenter {
  constructor(picturesContainer, changeMode, changePicture) {
    this._picturesContainer = picturesContainer;
    this._changeMode = changeMode;
    this._changePicture = changePicture;
    this._commentPresenter = {};
    this._renderedCommentsCount = COMMENTS_COUNT_PER_STEP;
    this._isCommentsOpen = false;

    this._commentsButtonComponent = null;
    this._showMoreCommentsComponent = null;
    this._pictureComponent = null;
    this._socialBlockComponent = null;
    this._socialBlockContainer = null;
    this._commentsContainer = null;

    this._handleCommentsClick = this._handleCommentsClick.bind(this);
    this._handleShowMoreCommentsClick = this._handleShowMoreCommentsClick.bind(this);
    this._handleLikeClick = this._handleLikeClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(picture, comments) {
    this._picture = picture;
    this._comments = comments;

    this._pictureComponent = new PictureView(this._picture);
    this._commentsButtonComponent = new CommentsButtonView();
    this._socialBlockComponent = new SocialBlockView(this._picture);

    this._socialBlockContainer = this._pictureComponent.getElement().querySelector('.social-block-wrapper');

    this._commentsButtonComponent.setCommentsButtonHandler(this._handleCommentsClick);

    render(this._picturesContainer, this._pictureComponent, RenderPosition.BEFOREEND);
    render(this._socialBlockContainer, this._socialBlockComponent, RenderPosition.BEFOREEND);
    render(this._socialBlockContainer, this._commentsButtonComponent, RenderPosition.BEFOREEND);

    this._socialBlockComponent.setLikeClickHandler(this._handleLikeClick);
    this._socialBlockComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  resetView() {
    this._commentsButtonComponent.updateData({isCommentsOpen: false});
    this._isCommentsOpen = false;
    this._renderedCommentsCount = COMMENTS_COUNT_PER_STEP;
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

  _handleShowMoreCommentsClick() {
    const commentsCount = this._comments.length;
    const newRenderedCommentsCount = Math.min(commentsCount, this._renderedCommentsCount + COMMENTS_COUNT_PER_STEP);
    const comments = this._comments.slice(this._renderedCommentsCount, newRenderedCommentsCount);

    this._renderComments(comments);
    this._renderedCommentsCount = newRenderedCommentsCount;

    if (this._renderedCommentsCount >= commentsCount) {
      remove(this._showMoreCommentsComponent);
    }
  }

  _renderComment(comment) {
    this._commentsContainer = this._commentsSectionComponent.getElement().querySelector('.comments-list');

    const commentPresenter = new CommentPresenter(this._commentsContainer);

    commentPresenter.init(comment);
    this._commentPresenter[comment.id] = commentPresenter;
  }

  _renderComments(comments) {
    comments.forEach((comment) => this._renderComment(comment))
  }

  _renderShowMoreCommentsButton() {
    if (this._showMoreCommentsComponent !== null) {
      this._showMoreCommentsComponent = null;
    }

    const showMorebuttonContainer = this._commentsContainer.parentNode;

    this._showMoreCommentsComponent = new ShowMoreCommentsView();
    this._showMoreCommentsComponent.setClickHandler(this._handleShowMoreCommentsClick);

    render(showMorebuttonContainer, this._showMoreCommentsComponent, RenderPosition.BEFOREEND);
  }

  _clearCommentsSection() {
    if(!this._commentsSectionComponent) {
      return;
    }

    Object.values(this._commentPresenter)
      .forEach((presenter) => presenter.destroy());
    remove(this._commentsSectionComponent);
    remove(this._showMoreCommentsComponent);

    this._commentPresenter = {};
  }

  _renderCommentsSection() {
    this._commentsSectionComponent = new CommentsSectionView();
    render(this._socialBlockContainer, this._commentsSectionComponent, RenderPosition.BEFOREEND);

    const comments = this._comments;
    const commentsCount = comments.length;

    this._renderComments(comments.slice(0, Math.min(commentsCount, this._renderedCommentsCount)));

    if (commentsCount > this._renderedCommentsCount) {
      this._renderShowMoreCommentsButton();
    }
  }
}
