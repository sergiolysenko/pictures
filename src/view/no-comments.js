import {AbstractView} from "./abstract.js";

const createNoCommentsTemplate = () => {
  return `<div class="flex items-center justify-center text-xs mb-5">
    <div class="bg-gray-100 w-auto rounded-xl p-2">
      No comments yet. You will be first!
    </div>
  </div>`
}
export class NoCommentsView extends AbstractView {
  getTemplate() {
    return createNoCommentsTemplate();
  }
}
