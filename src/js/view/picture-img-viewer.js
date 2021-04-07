import { AbstractView } from "./abstract";

const createImgViewerTemplate = (picture) => {
  const {src} = picture;

  return `<div class="picture-viewer">
    <div class="fixed z-50 w-screen">
      <img src=${src} class="object-cover h-screen mx-auto">
    </div>
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 z-40"></div>
  </div>`
}

export class ImgViewerView extends AbstractView {
  constructor(picture) {
    super();
    this._picture = picture;
  }

  getTemplate() {
    return createImgViewerTemplate(this._picture);
  }

  setPictureViewerClickHandler(callback) {
    this.getElement().addEventListener('click', callback)
  }
}
