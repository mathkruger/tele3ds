import { goToLogout, isUserLogged } from "./_helpers.js";
import UsersService from "../services/users.service.js";
import { CookiesAlias } from "../types/cookies.js";
import { Rooms } from "../templates/rooms.js";

export default class RoomsController {
  static async get(set: any, cookie: CookiesAlias) {
    const isLogged = await isUserLogged(cookie);
    if (!isLogged) {
      goToLogout(set);
      return;
    }

    const { userId: { value: userId } } = cookie;
    
    const rooms = UsersService.getUserRooms(userId);
    
    return <Rooms rooms={rooms} />;
  }
}
