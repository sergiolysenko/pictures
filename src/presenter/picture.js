import {CommentsButtonView} from "../view/show-comments.js";
import {CommentsSectionView} from "../view/comments.js";
import {CommentsContainerView} from "../view/comments-container.js";
import {CommentsModel} from "../model/comments.js";
import {CommentPresenter} from "./comment.js";
import {NoCommentsView} from "../view/no-comments.js";
import {PictureView} from "../view/picture.js";
import {SocialBlockView} from "../view/social-block.js";
import {ShowMoreCommentsView} from "../view/show-more-comments.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {UpdateType, UserAction} from "../const.js";
import {allComments} from "../mock/comment.js";

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
    this._commentsModel = null;

    this._handleCommentsClick = this._handleCommentsClick.bind(this);
    this._handleShowMoreCommentsClick = this._handleShowMoreCommentsClick.bind(this);
    this._handleLikeClick = this._handleLikeClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(picture) {
    this._picture = picture;

    this._pictureComponent = new PictureView(this._picture);
    this._commentsButtonComponent = new CommentsButtonView();
    this._noCommentsComponent = new NoCommentsView();
    this._socialBlockComponent = new SocialBlockView(this._picture);
    this._commentsContainerComponent = new CommentsContainerView();

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
    const commentsCount = this._commentsModel.getComments().length;
    const newRenderedCommentsCount = Math.min(commentsCount, this._renderedCommentsCount + COMMENTS_COUNT_PER_STEP);
    const comments = this._commentsModel.getComments().slice(this._renderedCommentsCount, newRenderedCommentsCount);

    this._renderComments(comments);
    this._renderedCommentsCount = newRenderedCommentsCount;

    if (this._renderedCommentsCount >= commentsCount) {
      remove(this._showMoreCommentsComponent);
    }
  }

  _renderComment(comment) {
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

  _getPictureComments() {
    if (this._commentsModel === null) {
      this._commentsModel = new CommentsModel();
    }
    const currentPictureComments = allComments
      .filter((comments) => comments.pictureId === this._picture.id);

    if(currentPictureComments.length) {
      this._commentsModel.setComments(UpdateType.INIT, currentPictureComments[0].comments);
    }

    return this._commentsModel.getComments();
  }

  _renderNoComments() {
    render(this._commentsContainer, this._noCommentsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCommentsSection() {
    this._commentsSectionComponent = new CommentsSectionView();
    this._commentsContainer = this._commentsSectionComponent.getElement().querySelector('.comments-list');
    render(this._socialBlockContainer, this._commentsSectionComponent, RenderPosition.BEFOREEND);

    const comments = this._getPictureComments();
    const commentsCount = comments.length;

    if(!commentsCount) {
      this._renderNoComments();
    }

    this._renderComments(comments.slice(0, Math.min(commentsCount, this._renderedCommentsCount)));

    if (commentsCount > this._renderedCommentsCount) {
      this._renderShowMoreCommentsButton();
    }
  }
}
