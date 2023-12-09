import { Cookie } from "elysia";
import UsersService from "../services/users.service";
import { Home } from "../templates/home";
import { CookiesAlias } from "../types/cookies";

export default class HomeController {
  static get(set: any, cookie: CookiesAlias) {
    const sessionToken = cookie.sessionId.value;
    const userId = cookie.userId.value;

    if (sessionToken && userId) {
      set.redirect = "/rooms";
      return;
    }

    return <Home></Home>;
  }

  static async post(
    body: { username: string; password: string },
    cookie: CookiesAlias,
    set: any
  ) {
    const { username, password } = body;
    const loginResult = await UsersService.login(username, password);

    if (loginResult.isCorrect) {
      const result = await UsersService.generateNewSession(loginResult.id);

      if (!result) {
        return (
          <Home error={<p>You are already logged in another device!</p>}></Home>
        );
      }

      cookie.sessionId.value = result;
      cookie.userId.value = loginResult.id;

      set.redirect = "/rooms";
    } else {
      return <Home error={<p>Your username/password is wrong!</p>}></Home>;
    }
  }
}
