import {CommentsSectionView} from "../view/comments.js";
import {NoCommentsView} from "../view/no-comments.js";
import {ShowMoreCommentsView} from "../view/show-more-comments.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {UpdateType, UserAction} from "../const.js";
import {allComments} from "../mock/comment.js";
import { CommentView } from "../view/comment.js";

const COMMENTS_COUNT_PER_STEP = 3;

export class CommentsSectionPresenter {
  constructor(commentsSectionContainer, commentsModel) {
    this._commentsSectionContainer = commentsSectionContainer;
    this._commentsModel = commentsModel;
    this._renderedCommentsCount = COMMENTS_COUNT_PER_STEP;
    this._commentComponent = {};

    this._noCommentsComponent = new NoCommentsView();
    this._showMoreCommentsComponent = new ShowMoreCommentsView();
    this._commentsSectionComponent = new CommentsSectionView();

    this._handleShowMoreCommentsClick = this._handleShowMoreCommentsClick.bind(this);
    this._handleCommentsViewAction = this._handleCommentsViewAction.bind(this);
    this._handleCommentsModelEvent = this._handleCommentsModelEvent.bind(this);

    this._commentsModel.addObserver(this._handleCommentsModelEvent);
  }

  init(picture) {
    this._picture = picture;
    this._loadPictureComments(this._picture);
  }

  destroy() {
    if(!this._commentsSectionComponent) {
      return;
    }

    Object.values(this._commentComponent)
      .forEach((component) => remove(component));
    remove(this._noCommentsComponent);
    remove(this._commentsSectionComponent);
    remove(this._showMoreCommentsComponent);
    this._commentsModel.removeObserver(this._handleCommentsModelEvent);
    this._commentComponent = {};
  }

  _loadPictureComments(currentPicture) {
    console.log('load');
    this._setPictureComments();
  }

  _setPictureComments() {
    let currentPictureComments = allComments
      .filter((comments) => comments.pictureId === this._picture.id);

    if (currentPictureComments.length) {
      currentPictureComments = currentPictureComments[0].comments;
    }
    this._commentsModel.setComments(UpdateType.INIT, currentPictureComments);
  }

  _handleCommentsViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_COMMENT:
        this._commentsModel.updateComment(updateType, update);
        break;

      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
    }
  }

  _handleCommentsModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._picturePresenter[data.id].init(data);
        break;
      case UpdateType.MAJOR:
        console.log(123)
        break;
      case UpdateType.INIT:
        this._renderCommentsSection();
        break;
    }
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
    const commentComponent = new CommentView(comment);
    const commentsList = this._commentsSectionContainer.querySelector('.comments-list');
    render(commentsList, commentComponent, RenderPosition.BEFOREEND);

    this._commentComponent[comment.id] = commentComponent;
  }

  _renderComments(comments) {
    comments.forEach((comment) => this._renderComment(comment))
  }

  _renderShowMoreCommentsButton() {
    const commentsList = this._commentsSectionContainer.querySelector('.comments-list');
    const showMorebuttonContainer = commentsList.parentNode;

    this._showMoreCommentsComponent.setClickHandler(this._handleShowMoreCommentsClick);

    render(showMorebuttonContainer, this._showMoreCommentsComponent, RenderPosition.BEFOREEND);
  }

  _renderNoComments() {
    render(this._commentsSectionContainer, this._noCommentsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCommentsSection() {
    render(this._commentsSectionContainer, this._commentsSectionComponent, RenderPosition.BEFOREEND);

    this._comments = this._commentsModel.getComments();
    const commentsCount = this._comments.length;

    if(!commentsCount) {
      this._renderNoComments();
    }

    this._renderComments(this._comments.slice(0, Math.min(commentsCount, this._renderedCommentsCount)));

    if (commentsCount > this._renderedCommentsCount) {
      this._renderShowMoreCommentsButton();
    }
  }
}

// Вернуть все состояние обновление сюда
