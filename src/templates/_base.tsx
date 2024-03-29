import { PropsWithChildren } from "@kitajs/html";

export const Base = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="stylesheet" href="/public/styles.css" />

        <title>Tele3DS</title>
      </head>
      <body>
        <main class="container">
          <h1>Tele3DS</h1>

          {children}
        </main>
      </body>
    </html>
  );
};
