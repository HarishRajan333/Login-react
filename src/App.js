import logo from "./logo.svg";
import "./App.css";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import bgimg from "./images/bgimg.svg";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import {
  deleteStorages,
  getExpiredTimeStamp,
  getRemainingMilliSeconds,
  setCookieWithTimestampExpiry,
} from "./KeycloakFunctions";
import axios from "axios";
import Login from "./login";
import jwtDecode from "jwt-decode";
import Logout from "./Logout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/:clientId/*" element={<Login />} />
          <Route
            path="/auth/:clientId/logout/:sessionId"
            element={<Logout />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
