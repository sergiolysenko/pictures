import {AbstractView} from "./abstract.js";

const createSectionTemplate = (section) => {
  const {title} = section;

  return `<div class="${title}-container relative grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-10">
    <h1 class="absolute -top-3 left-12 font-brushwell text-3xl">${title}</h1>
  </div>`
}

export class ProfileSectionView extends AbstractView {
  constructor(section) {
    super();

    this._section = section;
  }

  getTemplate() {
    return createSectionTemplate(this._section);
  }
}
