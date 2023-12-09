import { UserChatRoom } from "../types/user";
import { Base } from "./_base";

export const Rooms = ({ rooms }: { rooms: UserChatRoom[] }) => {
  return (
    <Base>
      <a href="/logout">Logout</a>

      <h2>Select you room: </h2>

      <ul>
        {rooms.map((x) => (
          <li>
            <a href={`/chat/${x.chatId}`}>{x.chatName}</a>
          </li>
        ))}
      </ul>
    </Base>
  );
};
