import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import DisplayData from "./components/DisplayData.tsx";
import CreationForm from "./components/CreationForm.tsx";
import UpdateForm from "./components/UpdateForm.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DisplayData />} />
        <Route path="/create" element={<CreationForm />}/>
        <Route path="/update/:id" element={<UpdateForm />} />
      </Routes>
    </BrowserRouter>
    <App />
  </StrictMode>
);
