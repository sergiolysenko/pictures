import {render, remove, RenderPosition} from "../utils/render.js";
import {CommentView} from "../view/comment.js";

export class CommentPresenter {
  constructor(commentsContainer) {
    this._commentsContainer = commentsContainer;
  }

  init(comment) {
    this._comment = comment;

    this._commentComponent = new CommentView(this._comment);

    render(this._commentsContainer, this._commentComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._commentComponent);
  }
}
