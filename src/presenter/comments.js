import {CommentsButtonView} from "../view/show-comments.js";
import {CommentsSectionView} from "../view/comments.js";
import {CommentsModel} from "../model/comments.js";
import {CommentPresenter} from "./comment.js";
import {NoCommentsView} from "../view/no-comments.js";
import {PictureView} from "../view/picture.js";
import {SocialBlockView} from "../view/social-block.js";
import {ShowMoreCommentsView} from "../view/show-more-comments.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {UpdateType, UserAction} from "../const.js";
import {allComments} from "../mock/comment.js";
import { CommentView } from "../view/comment.js";

const COMMENTS_COUNT_PER_STEP = 3;

export class CommentsSectionPresenter {
  constructor(commentsSectionContainer, picture) {
    this._picture = picture;
    this._commentsSectionContainer = commentsSectionContainer;
    this._renderedCommentsCount = COMMENTS_COUNT_PER;
    this._commentComponent = {};
    this._commentsModel = null;
  }

  init() {
    this._noCommentsComponent = new NoCommentsView();
    this._renderCommentsSection();
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
    const commentComponent = new CommentView(comment);

    render(this._commentsContainer, this._commentComponent, RenderPosition.BEFOREEND);

    this._commentComponent[comment.id] = commentComponent;
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

    Object.values(this._commentComponent)
      .forEach((component) => remove(component));
    remove(this._commentsSectionComponent);
    remove(this._showMoreCommentsComponent);

    this._commentComponent = {};
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
