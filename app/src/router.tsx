import { createBrowserRouter } from "react-router-dom";

import { Top } from "./pages/Top";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Top />,
    },
    // {
    //   path: "/about",
    //   element: <div>About page</div>,
    // },
  ],
  { basename: import.meta.env.BASE_URL },
);
