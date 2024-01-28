import { ReactNode, StrictMode } from "react";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Game } from "./routes/Game";
import Providers from "./providers";

const router = createBrowserRouter([
  {
    path: "/room/:roomID",
    element: <Providers><Game/></Providers>,
  },
]);

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
  );
}
