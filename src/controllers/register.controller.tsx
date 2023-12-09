import UsersService from "../services/users.service.js";
import { Register } from "../templates/register.js";
import { UserActivate } from "../types/user.js";
import { CookiesAlias } from "../types/cookies.js";

export default class RegisterController {
  static get(set: any, cookie: CookiesAlias) {
    const sessionToken = cookie.sessionId.value;
    const userId = cookie.userId.value;

    if (sessionToken && userId) {
      set.redirect = "/rooms";
      return;
    }

    return <Register />;
  }

  static async post(set: any, body: UserActivate) {
    const { username, password, code } = body;
    const result = await UsersService.activateUser(username, password, code);

    if (result) {
      set.redirect = "/";
      return;
    }

    return (
      <Register
        error={
          <p>
            User already activated, please go to <a href="/">login</a>
          </p>
        }
      />
    );
  }
}
