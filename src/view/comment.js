import dayjs from "dayjs";
import { Smart } from "./smart";
import {UserAction, UpdateType} from "../const.js";

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
            <label class="cursor-pointer hover:underline">
              <input type="checkbox" href="#" class="comment-like hidden group">
              <small>Like</small>
            </label>
            <small class="self-center">.</small>
            <button class="delete-btn hover:underline">
              <small>Delete</small>
            </button>
            <small class="self-center">.</small>
            <small>${dayjs.unix(time.seconds).format('DD.MM.YYYY')}</small>
          </div>
        </div>
      </div>
    </div>
  </div>`
}

export class CommentView extends Smart {
  constructor(comment) {
    super()
    this._data = comment;

    this._likeClickHandler = this._likeClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  getTemplate() {
    return createComment(this._data);
  }

  restoreHandlers() {
    this.setLikeClickHandler(this._callback.likeClick);
  }

  _likeClickHandler(evt) {
    const sign = evt.target.checked ? 1 : -1;
    this.updateData({
      likeCount: this._data.likeCount + sign,
      isLiked: !this._data.isLiked,
    });

    this._callback.likeClick(
      UserAction.UPDATE_COMMENT,
      UpdateType.NONE,
      this._data
      );
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.delete(
      UserAction.DELETE_COMMENT,
      UpdateType.MAJOR,
      this._data);
  }

  setDeleteHandler(callback) {
    this._callback.delete = callback;

    this.getElement().querySelector('.delete-btn')
      .addEventListener('click', this._deleteClickHandler);
  }

  setLikeClickHandler(callback) {
    this._callback.likeClick = callback;

    this.getElement().querySelector('.comment-like')
      .addEventListener('click', this._likeClickHandler);
  }
}
