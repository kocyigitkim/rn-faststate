import FastState from "..";

export default class AuthenticationState extends FastState {
  user = null;
  isLoggedIn = false;
  constructor() {
    super();
  }
  login(user) {
    this.user = user;
    this.isLoggedIn = true;
  }
  logout() {
    this.isLoggedIn = false;
    this.user = null;
  }
}
