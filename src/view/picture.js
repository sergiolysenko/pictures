import { AbstractView } from "./abstract.js";

const createPictureTemplate = (picture) => {
  const {src, title, author} = picture;
  return `<section class="picture">
  <div class="grid">
    <div class="w-full h-80 relative">
      <img src=${src} alt=${title} class="object-cover w-full h-full bg-gray-100 rounded-t-lg" />
      <div class="absolute bottom-0 z-10 w-full px-4 pt-40 pb-3 bg-gradient-to-t from-black">
        <p class="text-sm font-medium text-white">${author}</p>
        <h2 class="text-xl font-semibold text-white">${title}</h2>
      </div>
    </div>
    <div class="social-block-wrapper bg-white rounded-b-lg py-3 px-4">

    </div>
  </div>
</section>`
}

export class PictureView extends AbstractView {
  constructor(picture) {
    super();
    this._picture = picture;
  }

  getTemplate() {
    return createPictureTemplate(this._picture);
  }
}
