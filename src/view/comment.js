import {AbstractView} from "./abstract"
import dayjs from "dayjs";

const createComment = (comment) => {
  const {avatar, author, text, time, likeCount} = comment;
  const isLikesShowing = !!likeCount;

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
            <div class="flex items-center text-xs">
            ${isLikesShowing ? `
              ${likeCount}
              <svg class="flex-shrink-0 h-3 w-3" width="5" height="5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>` : ``}
            </div>
            <a href="#" class="ml-full hover:underline">
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

  getTemplate() {
    return createComment(this._comment);
  }
}
