import {AbstractView} from "./abstract.js";

const createCommentsContainerTemplate = () => {
  return `<div class="comments-section"></div>`
}
export class CommentsContainerView extends AbstractView {
  getTemplate() {
    return createCommentsContainerTemplate();
  }
}
