import { Children } from "@kitajs/html";
import { Base } from "./_base";

export const Register = ({ error }: { error?: Children }) => {
  return (
    <Base>
      <p style="margin-bottom: 16px">
        Type `/register` on a group that the bot is in place, then provide the
        response code here, with your username and password. DOES NOT USE YOUR
        TELEGRAM CREDENTIALS!!!
      </p>

      <form action="/register" method="post">
        <input name="username" type="text" placeholder="username" />
        <input name="password" type="password" placeholder="your password" />
        <input name="code" type="text" placeholder="your code" />

        <button class="btn btn-primary btn-ghost" type="submit">
          Submit
        </button>
      </form>

      { error }
    </Base>
  );
};
