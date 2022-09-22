import { useState } from "react";
import ReactDom from "react-dom";
import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./pages/login/login";
import Home from "./pages/home/home";

function App() {
  return (
    <div className="App flex justify-center items-center min-h-screen min-w-screen bg-gray-200">
      <BrowserRouter>
        <Routes>
          <Route element={<Login></Login>} path="/login"></Route>
          <Route element={<Home></Home>} path="*"></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
