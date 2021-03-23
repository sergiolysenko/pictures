import {AbstractView} from "./abstract"
import dayjs from "dayjs";

const createComment = (comment) => {
  const {avatar, author, text, time} = comment;

  return `<div class="flex items-center space-x-2 mb-3">
    <div class="group relative flex flex-shrink-0 self-start cursor-pointer">
      <img class="h-8 w-8 object-fill rounded-full"
        src=${avatar}
        alt=${author}>
    </div>
    <div class="flex items-center justify-center space-x-2">
      <div class="block">
        <div class="bg-gray-100 w-auto rounded-xl px-2 pb-2">
          <div class="font-medium">
            <a href="#" class="hover:underline text-sm">
              <small>${author}</small>
            </a>
          </div>
          <div class="text-xs">
            ${text}
          </div>
        </div>
        <div class="flex justify-start items-center text-xs w-full">
          <div class="font-semibold text-gray-700 px-2 flex items-center justify-center space-x-1">
            <a href="#" class="hover:underline">
              <small>Like</small>
            </a>
            <small class="self-center">.</small>
            <a href="#" class="hover:underline">
              <small>Delete</small>
            </a>
            <small class="self-center">.</small>
            <a href="#" class="hover:underline">
              <small>${dayjs(time).format('DD.MM.YYYY')}</small>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>`
}

export class CommentView extends AbstractView {
  constructor(comment) {
    super()
    this._comment = comment;
  }

  getTemplate() {``
    return createComment(this._comment);
  }
}
