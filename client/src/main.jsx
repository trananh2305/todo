import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import TodoProvider from "./Contexts/TodoProvider.jsx";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TodoProvider>
      <App />
      <Toaster position="top-right" />
    </TodoProvider>
  </React.StrictMode>
);
