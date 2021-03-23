import {CommentsButtonView} from "../view/show-comments.js";
import {CommentView} from "../view/comment.js";
import {CommentsSectionView} from "../view/comments.js";
import {PictureView} from "../view/picture.js";
import {SocialBlockView} from "../view/social-block.js";
import {ShowMoreCommentsView} from "../view/show-more-comments.js";
import {render, remove, RenderPosition} from "../utils/render.js";

const COMMENTS_COUNT_PER_STEP = 3;

export class PicturePresenter {
  constructor(picturesContainer, changeMode) {
    this._picturesContainer = picturesContainer;
    this._changeMode = changeMode;
    this._isCommentsOpen = false;
    this._renderedCommentsCount = COMMENTS_COUNT_PER_STEP;

    this._commentsButtonComponent = null;
    this._commentsSectionComponent = null;
    this._showMoreCommentsComponent = null;
    this._pictureComponent = null;
    this._socialBlockComponent = null;
    this._socialBlockContainer = null;
    this._commentsContainer = null;

    this._handleCommentsClick = this._handleCommentsClick.bind(this);
    this._handleShowMoreCommentsClick = this._handleShowMoreCommentsClick.bind(this);
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
  }

  resetView() {
    this._commentsButtonComponent.updateData({isCommentsOpen: false});
    this._clearCommentsSection();
    this._isCommentsOpen = false;
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

  _renderComment(comment) {
    this._commentsContainer = this._commentsSectionComponent.getElement().querySelector('.comments-list');

    const commentComponent = new CommentView(comment);
    render(this._commentsContainer, commentComponent, RenderPosition.BEFOREEND)
  }

  _renderComments(comments) {
    comments.forEach((comment) => this._renderComment(comment))
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
    remove(this._commentsSectionComponent);
    // У каждого презентера коммента вызывается метод дестрой который все чистит. Список презентеров будет также создаваться при рендаре.
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
