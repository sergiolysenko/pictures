import { AbstractView } from "./abstract";

const createImgViewerTemplate = (picture) => {
  const {src} = picture;

  return `<div class="picture-viewer cursor-pointer">
    <div class="fixed h-screen w-screen flex z-50 align-center justify-center">
      <img src=${src} class="object-contain w-screen" width="200" height="200">
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
