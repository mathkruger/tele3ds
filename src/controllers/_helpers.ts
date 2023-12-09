import { compareHash } from "../_utils";
import UsersService from "../services/users.service";
import { CookiesAlias } from "../types/cookies";

async function isUserLogged(cookies: CookiesAlias) {
  const sessionToken = cookies["sessionId"].value;
  const userId = cookies["userId"].value;
  if (!sessionToken || !userId) {
    return false;
  }

  const session = UsersService.getUserSession(userId);
  if (!session) {
    return false;
  }

  const isSessionValid = compareHash(sessionToken, session.sessionId);
  return isSessionValid;
}

function goToLogout(set: any) {
  set.redirect = "/logout";
}

export { isUserLogged, goToLogout };
