import AuthApi from "../api/auth.js";
import {AuthUiWrapperView} from "../view/auth-ui-wrapper.js";
import {ErrorAlertView} from "../view/error-alert.js";
import {LoadingView} from "../view/loading.js";
import {NoAccessAlertView} from "../view/no-access-alert.js";
import {remove, render, RenderPosition} from "../utils/render";

class AuthPresenter {
  constructor() {
    this._noAccessAlertComponent = new NoAccessAlertView();
    this._authUiWrapperComponet = new AuthUiWrapperView();
    this._errorAlertComponent = new ErrorAlertView();
    this._loadingComponent = null;
    this._mainContainer = document.querySelector('body');

    this._handleLaterClick = this._handleLaterClick.bind(this);
    this._handleSignInClick = this._handleSignInClick.bind(this);
    this._handleCloseAuthClick = this._handleCloseAuthClick.bind(this);
    this._handleErrorCloseClick = this._handleErrorCloseClick.bind(this);
  }

  showNoAccess() {
    this._noAccessAlertComponent.setSignInClickHandler(this._handleSignInClick);
    this._noAccessAlertComponent.setLaterClickHandler(this._handleLaterClick);

    render(this._mainContainer, this._noAccessAlertComponent, RenderPosition.AFTERBEGIN);
  }

  showSignIn() {
    this._authUiWrapperComponet.setCloseClickHandler(this._handleCloseAuthClick);

    render(this._mainContainer, this._authUiWrapperComponet, RenderPosition.AFTERBEGIN);
    AuthApi.showSignIn();
  }

  showLoading(container, isSmall) {
    this._loadingComponent = new LoadingView(isSmall);

    render(container, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  showErrorAlert() {
    this._errorAlertComponent.setCloseErrorClickHandler(this._handleErrorCloseClick);
    render(this._mainContainer, this._errorAlertComponent, RenderPosition.AFTERBEGIN);
  }

  destroyLoading() {
    remove(this._loadingComponent);
  }

  destroyAuthComponent() {
    remove(this._authUiWrapperComponet);
  }

  destroyErrorAlert() {
    remove(this._errorAlertComponent);
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

  _handleErrorCloseClick() {
    this.destroyErrorAlert();
  }

  _destroyNoAccessAlert() {
    remove(this._noAccessAlertComponent);
  }
}

export default new AuthPresenter();
