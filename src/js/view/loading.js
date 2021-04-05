import {AbstractView} from "./abstract.js";

const createLoadingTemplate = (size) => {
  const {isSmall} = size;

  return `<div class="absolute z-50 inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isSmall ? `rounded-lg` : ``}">
  <div class="absolute left-1/2 top-1/2 z-50
  ${isSmall ? `-ml-5 -mt-5 w-10 h-10` : `-ml-10 -mt-10 w-20 h-20`}
  ">
    <img class="animate-spin block h-auto w-auto" src="./img/logo-pictures.png" alt="photos">
  </div>
  </div>`;
};

export class LoadingView extends AbstractView {
  constructor(size = {isSmall: false}) {
    super();
    this._isSmall = size;
  }

  getTemplate() {
    return createLoadingTemplate(this._isSmall);
  }
}
