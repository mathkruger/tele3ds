import { Children } from "@kitajs/html";
import { Base } from "./_base";

export const Home = ({ error }: { error?: Children }) => {
  return (
    <Base>
      <p style="margin-bottom: 16px;">
        Login with your credentials or <a href="/register">register</a>.
      </p>

      <form action="/" method="post">
        <input name="username" type="text" placeholder="username" />
        <input name="password" type="password" placeholder="your password" />
        <button class="btn btn-primary btn-ghost" type="submit">
          Submit
        </button>
      </form>

      { error }
    </Base>
  );
};
