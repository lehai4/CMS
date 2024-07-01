import Wrapper from "@/components/Wrapper";
import { useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register/Register";

const AuthForm = () => {
  const path = useLocation();
  const theme = localStorage.getItem("theme");
  return (
    <Wrapper
      className={`authenform ${
        theme === "light" ? "bg-gray-100" : "bg-gray-600"
      }`}
    >
      {path.pathname === "/auth/login" ? (
        <Login />
      ) : path.pathname === "/auth/register" ? (
        <Register />
      ) : (
        <></>
      )}
    </Wrapper>
  );
};

export default AuthForm;
