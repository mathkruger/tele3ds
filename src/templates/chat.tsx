import { Base } from "./_base";
import { Message } from "../types/message";

export const Chat = ({
  roomname,
  messages,
  chatId,
  discordUsername,
}: {
  roomname: string;
  messages: Message[];
  chatId: string;
  discordUsername: string;
}) => {
  return (
    <Base>
      <a style="margin-bottom: 16px; display: block;" href="/rooms">
        All rooms
      </a>
      <h2>{ roomname }</h2>
      <form action="/chat" method="post">
        <input type="hidden" name="chatId" value={chatId} />
        <input type="text" readonly name="userName" value={discordUsername} />

        <input
          required
          name="message"
          type="text"
          placeholder="type a message"
        />
        <button class="btn btn-primary btn-ghost" type="submit">
          Submit
        </button>
      </form>

      <h2>Messages: </h2>
      <ul>
        {messages.reverse().map((x) => (
          <li>
            <strong>{x.username}</strong>: {x.message}
          </li>
        ))}
      </ul>
    </Base>
  );
};
