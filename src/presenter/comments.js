import {CommentsSectionView} from "../view/comments.js";
import {NoCommentsView} from "../view/no-comments.js";
import {ShowMoreCommentsView} from "../view/show-more-comments.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {UpdateType, UserAction} from "../const.js";
import {CommentView} from "../view/comment.js";
import {CommentsModel} from "../model/comments.js";
import {CommentsButtonView} from "../view/show-comments.js";
import {CommentsContainerView} from "../view/comments-container.js";
import ContentDataApi from "../api/content-data.js";
import UserApi from "../api/user.js";

const COMMENTS_COUNT_PER_STEP = 3;

export class CommentsSectionPresenter {
  constructor(commentsWrapper, userModel, changeMode) {
    this._commentsWrapper = commentsWrapper;
    this._changeMode = changeMode;
    this._userModel = userModel;
    this._user = this._userModel.getUser();
    this._renderedCommentsCount = COMMENTS_COUNT_PER_STEP;
    this._commentComponent = {};
    this._isCommentsOpen = false;

    this._commentsSectionComponent = null;
    this._commentsModel = new CommentsModel();
    this._commentsButtonComponent = new CommentsButtonView();

    this._handleCommentsClick = this._handleCommentsClick.bind(this);
    this._handleShowMoreCommentsClick = this._handleShowMoreCommentsClick.bind(this);
    this._handleCommentsViewAction = this._handleCommentsViewAction.bind(this);
    this._handleCommentsModelEvent = this._handleCommentsModelEvent.bind(this);

    this._commentsModel.addObserver(this._handleCommentsModelEvent);
  }

  init(picture) {
    this._picture = picture;

    render(this._commentsWrapper, this._commentsButtonComponent, RenderPosition.BEFOREEND);

    this._commentsButtonComponent.setCommentsButtonHandler(this._handleCommentsClick);
  }

  destroy() {
    remove(this._commentsButtonComponent);
    this.clearCommentsSection();
    this._commentsModel.removeObserver(this._handleCommentsModelEvent);
    this._commentComponent = {};
  }

  _getComments() {
    return this._commentsModel.getComments();
  }

  clearCommentsSection({resetRenderedCoomentsCount = true} = {}) {
    if (this._isCommentsOpen) {
      const commentsCount = this._getComments().length;

      Object.values(this._commentComponent)
        .forEach((component) => remove(component));

      if (resetRenderedCoomentsCount) {
        this._renderedCommentsCount = COMMENTS_COUNT_PER_STEP;
      }

      this._isCommentsOpen = false;
      this._commentsButtonComponent.updateData({isCommentsOpen: false});
      remove(this._commentsContainerComponent)
      remove(this._commentsSectionComponent);
      remove(this._noCommentsComponent);
      remove(this._showMoreCommentsComponent);
    }
  }

  _loadPictureComments(currentPicture) {
    ContentDataApi.getComments(currentPicture, this._user)
      .then((comments) => {
        this._commentsModel.setComments(UpdateType.INIT, comments);
      })
  }

  _handleCommentsClick() {
    if (this._isCommentsOpen) {
      this.clearCommentsSection();
    } else {
      this._changeMode();
      this._loadPictureComments(this._picture);
      this._isCommentsOpen = true;
    }
  }

  updateUserData(updateType, update, userDataKeyUpdate) {
    if(!userDataKeyUpdate) {
      return;
    }
    const newUserData = this._userModel.updateUserDataByKey(update, userDataKeyUpdate);

    return UserApi.updateUserData(newUserData).then(() => {
      this._userModel.updateUser(updateType, newUserData);
    });
  }

  _handleCommentsViewAction(actionType, updateType, update, userDataKeyUpdate) {
    switch(actionType) {
      case UserAction.UPDATE_COMMENT:
        ContentDataApi.updateComment(update, this._picture)
        .then(() => {
          this._commentsModel.updateComment(updateType, update);
          this.updateUserData(updateType, update, userDataKeyUpdate);
        })
        break;

      case UserAction.ADD_COMMENT:
        ContentDataApi.addComment(update, this._picture, this._user)
        .then((loadedComment) => {
          this.updateUserData(UpdateType.NONE, loadedComment, userDataKeyUpdate).then(() => {
            this._commentsModel.addComment(updateType, loadedComment);
          })
        })
        break;

      case UserAction.DELETE_COMMENT:
        ContentDataApi.deleteComment(update, this._picture)
        .then(() => {
          this.updateUserData(UpdateType.NONE, update, userDataKeyUpdate);
          this._commentsModel.deleteComment(updateType, update);
        });
        break;
    }
  }

  _handleCommentsModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.NONE:
        break;

      case UpdateType.INIT:
        this._renderCommentsSection();
        break;

      case UpdateType.MINOR:
        this.clearCommentsSection({resetRenderedCoomentsCount: false});
        this._renderCommentsSection();
        break;

      case UpdateType.MAJOR:
        this.clearCommentsSection();
        this._renderCommentsSection();
        break;
    }
  }

  _handleShowMoreCommentsClick() {
    const commentsCount = this._getComments().length;
    const newRenderedCommentsCount = Math.min(commentsCount, this._renderedCommentsCount + COMMENTS_COUNT_PER_STEP);
    const comments = this._getComments().slice(this._renderedCommentsCount, newRenderedCommentsCount);

    this._renderComments(comments);
    this._renderedCommentsCount += COMMENTS_COUNT_PER_STEP;

    if (this._renderedCommentsCount >= commentsCount) {
      remove(this._showMoreCommentsComponent);
    }
  }

  _renderComment(comment) {
    const commentComponent = new CommentView(comment, this._userModel);
    commentComponent.setLikeClickHandler(this._handleCommentsViewAction);
    commentComponent.setDeleteHandler(this._handleCommentsViewAction);
    const commentsList = this._commentsWrapper.querySelector('.comments-list');
    render(commentsList, commentComponent, RenderPosition.BEFOREEND);

    this._commentComponent[comment.id] = commentComponent;
  }

  _renderComments(comments) {
    comments.forEach((comment) => this._renderComment(comment))
  }

  _renderShowMoreCommentsButton() {
    const commentsList = this._commentsWrapper.querySelector('.comments-list');
    const showMorebuttonContainer = commentsList.parentNode;

    this._showMoreCommentsComponent.setClickHandler(this._handleShowMoreCommentsClick);

    render(showMorebuttonContainer, this._showMoreCommentsComponent, RenderPosition.BEFOREEND);
  }

  _renderNoComments() {
    render(this._commentsContainerComponent, this._noCommentsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCommentsSection() {
    this._isCommentsOpen = true;
    this._commentsButtonComponent.updateData({isCommentsOpen: true})
    this._noCommentsComponent = new NoCommentsView();
    this._showMoreCommentsComponent = new ShowMoreCommentsView();
    this._commentsContainerComponent = new CommentsContainerView();
    this._commentsSectionComponent = new CommentsSectionView(this._user);

    const comments = this._getComments();
    const commentsCount = comments.length;

    this._commentsSectionComponent.setSubmitHandler(this._handleCommentsViewAction);

    render(this._commentsWrapper, this._commentsContainerComponent, RenderPosition.BEFOREEND);
    render(this._commentsContainerComponent, this._commentsSectionComponent, RenderPosition.BEFOREEND);

    if(!commentsCount) {
      this._renderNoComments();
      return;
    }

    this._renderComments(comments.slice(0, Math.min(commentsCount, this._renderedCommentsCount)));

    if (commentsCount > this._renderedCommentsCount) {
      this._renderShowMoreCommentsButton();
    }
  }
}
