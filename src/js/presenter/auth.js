import AuthApi from "../api/auth.js";
import {NoAccessAlertView} from "../view/no-access-alert.js";
import {AuthUiWrapperView} from "../view/auth-ui-wrapper.js";
import {LoadingView} from "../view/loading.js";
import {remove, render, RenderPosition} from "../utils/render";

class AuthPresenter {
  constructor() {
    this._noAccessAlertComponent = null;
    this._authUiWrapperComponet = null;
    this._loadingComponent = null;
    this._noAccessContainer = document.querySelector('body');

    this._handleLaterClick = this._handleLaterClick.bind(this);
    this._handleSignInClick = this._handleSignInClick.bind(this);
    this._handleCloseAuthClick = this._handleCloseAuthClick.bind(this);
  }

  showNoAccess() {
    this._noAccessAlertComponent = new NoAccessAlertView();
    this._noAccessAlertComponent.setSignInClickHandler(this._handleSignInClick);
    this._noAccessAlertComponent.setLaterClickHandler(this._handleLaterClick);

    render(this._noAccessContainer, this._noAccessAlertComponent, RenderPosition.AFTERBEGIN);
  }

  showSignIn() {
    this._authUiWrapperComponet = new AuthUiWrapperView();
    this._authUiWrapperComponet.setCloseClickHandler(this._handleCloseAuthClick)

    render(this._noAccessContainer, this._authUiWrapperComponet, RenderPosition.AFTERBEGIN);

    AuthApi.showSignIn();
  }

  showLoading(container, isSmall) {
    this._loadingComponent = new LoadingView(isSmall);

    render(container, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  destroyLoading() {
    remove(this._loadingComponent);
  }

  destroyAuthComponent() {
    remove(this._authUiWrapperComponet);
  }

  _handleCloseAuthClick() {
    this.destroyAuthComponent();
  }

  _handleSignInClick() {
    this._destroyNoAccessAlert();
    this.showSignIn();
  }

  _handleLaterClick() {
    this._destroyNoAccessAlert();
  }

  _destroyNoAccessAlert() {
    remove(this._noAccessAlertComponent);
  }
}

export default new AuthPresenter();
