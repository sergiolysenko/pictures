import {PicturePresenter} from "./picture.js";

export class BoardPresenter {
  constructor(boardContainer, pictures, comments) {
    this._boardContainer = boardContainer;
    this._picturePresenter = {};
    this._pictures = pictures;
    this._comments = comments;

    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init() {
    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._picturePresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderPicture(picture) {
    const picturePresenter = new PicturePresenter(this._boardContainer, this._handleModeChange);
    picturePresenter.init(picture, this._comments);
    this._picturePresenter[picture.id] = picturePresenter;
  }

  _renderPictures(pictures) {
    pictures.forEach((picture) => this._renderPicture(picture));
  }

  _renderBoard() {
    this._renderPictures(this._pictures);
  }
}
