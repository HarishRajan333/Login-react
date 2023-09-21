import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { deleteStorages } from "./KeycloakFunctions";
import axios from "axios";

const redirectUrl = {
  ems: "http://localhost:3001/setAuth/",
  ats: "http://localhost:3002/setAuth/",
};

const Logout = () => {
  const { clientId } = useParams();
  const { sessionId } = useParams();
  const cookies = new Cookies();
  const navigate = useNavigate();

  const clearCookies = () => {
    cookies.remove("atsRefreshToken", { path: "/" });
    cookies.remove("atsRefreshExpires", { path: "/" });
  };

  useEffect(() => {
    handleDelete();
  }, []);

  const signOutSession = () => {
    axios.delete(
      "http://localhost:8080/admin/realms/bassure/sessions/" + sessionId
    );
  };

  const handleDelete = async () => {
    if (redirectUrl.hasOwnProperty(clientId)) {
      clearCookies();
      navigate("/auth/" + clientId);
    }
  };

  return (
    <>
      <button onClick={() => clearCookies()}>logout</button>
    </>
  );
};

export default Logout;
