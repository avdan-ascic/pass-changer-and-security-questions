import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import ChangePassword from "./components/ChangePassword";
import ResetPassword from "./components/ResetPassword";
import AnswerSecurityQuestions from "./components/AnswerSecurityQuestions";
import YourSecurityQuestions from "./components/YourSecurityQuestions.";

const MainRouter = () => {
  const [isLoggedIn, setIsLoggedin] = useState(() => {
    const storedIsLoggedin = sessionStorage.getItem("isLoggedIn");
    return storedIsLoggedin ? JSON.parse(storedIsLoggedin) : false;
  });
  const [username, setUsername] = useState(() => {
    return sessionStorage.getItem("username") || "";
  });
  const [findEmail, setFindEmail] = useState({
    email: "",
    correct: false,
    error: "",
  });

  useEffect(() => {
    sessionStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
    sessionStorage.setItem("username", username);
  }, [isLoggedIn, username]);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              isLoggedIn={isLoggedIn}
              setIsLoggedin={setIsLoggedin}
              username={username}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login setIsLoggedin={setIsLoggedin} setUsername={setUsername} />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/updatePassword" element={<ChangePassword />} />
        <Route
          path="/resetPassword"
          element={<ResetPassword findEmail={findEmail} />}
        />
        <Route
          path="/yourSecurityQuestions"
          element={<YourSecurityQuestions />}
        />
        <Route
          path="/answerQuestions"
          element={
            <AnswerSecurityQuestions
              findEmail={findEmail}
              setFindEmail={setFindEmail}
            />
          }
        />
      </Routes>
    </>
  );
};
export default MainRouter;
