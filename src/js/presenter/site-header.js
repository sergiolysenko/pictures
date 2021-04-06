import {SiteHeaderView} from "../view/header-main";
import {HeaderUserOutView} from "../view/header-user-out.js";
import {HeaderUserInView} from "../view/header-user-in";
import {remove, render, RenderPosition} from "../utils/render.js";

export class SiteHeaderPresenter {
  constructor(headerContainer, siteHeaerHandler) {
    this._headerContainer = headerContainer;
    this._siteHeaderHandler = siteHeaerHandler;
    this._siteHeaderComponent = null;
    this._headerUserInComponent = null;
    this._headerUserOutComponent = null;
  }

  init(userModel, choosenMenuItem) {
    if (this._siteHeaderComponent !== null) {
      this._clearHeader();
    }
    this._user = userModel.getUser();
    this._choosenMenuItem = choosenMenuItem;

    this._siteHeaderComponent = new SiteHeaderView(this._user, this._choosenMenuItem);
    this._siteHeaderComponent.setLoadPictureClickHandler(this._siteHeaderHandler);
    this._siteHeaderComponent.setLogoClickHandler(this._siteHeaderHandler);

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

    this._headerUserInComponent = new HeaderUserInView(this._user, this._choosenMenuItem);
    this._headerUserInComponent.setSignOutClickHandler(this._siteHeaderHandler);
    this._headerUserInComponent.setProfileClickHandler(this._siteHeaderHandler);
    render(userNavContainer, this._headerUserInComponent, RenderPosition.BEFOREEND);
  }

  _clearHeader() {
    remove(this._siteHeaderComponent);
    remove(this._headerUserInComponent);
    remove(this._headerUserOutComponent);
  }
}
