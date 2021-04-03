import {SiteHeaderView} from "../view/site-header";
import {HeaderUserOutView} from "../view/header-user-out.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {HeaderUserInView} from "../view/header-user-in";

export class SiteHeaderPresenter {
  constructor(headerContainer, siteHeaerHandler) {
    this._headerContainer = headerContainer;
    this._siteHeaderHandler = siteHeaerHandler;
    this._siteHeaderComponent = null;
    this._headerUserInComponent = null;
    this._headerUserOutComponent = null;
  }

  init(userModel) {
    if (this._siteHeaderComponent !== null) {
      this._clearHeader();
    }
    this._user = userModel.getUser();

    this._siteHeaderComponent = new SiteHeaderView(this._user);
    this._siteHeaderComponent.setLoadPictureClickHandler(this._siteHeaderHandler);

    render(this._headerContainer, this._siteHeaderComponent, RenderPosition.BEFOREEND);
    this._renderHeader();
  }

  _renderHeader() {
    const userNavContainer = this._siteHeaderComponent.getElement().querySelector('.header-user-nav');

    if (this._user === null) {
      this._headerUserOutComponent = new HeaderUserOutView();
      this._headerUserOutComponent.setSignInClickHandler(this._siteHeaderHandler);
      render(userNavContainer, this._headerUserOutComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._headerUserInComponent = new HeaderUserInView(this._user);
    this._headerUserInComponent.setSignOutClickHandler(this._siteHeaderHandler);
    render(userNavContainer, this._headerUserInComponent, RenderPosition.BEFOREEND);
  }

  _clearHeader() {
    remove(this._siteHeaderComponent);
    remove(this._headerUserInComponent);
    remove(this._headerUserOutComponent);
  }
}
