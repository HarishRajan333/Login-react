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
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import bgimg from "./images/bgimg.svg";
import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import {
  deleteStorages,
  getExpiredTimeStamp,
  getRemainingMilliSeconds,
  setCookieWithTimestampExpiry,
} from "./KeycloakFunctions";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Logout from "./Logout";
import {
  baseUrl,
  redirectUrl,
  refreshTokenEndPoint,
  tokenEndPoint,
} from "./Const/const";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { clientId } = useParams();

  useEffect(() => {
    // check();
    console.log(getRemainingMilliSeconds(cookies.get("atsRefreshExpires")) > 0);
    if (getRemainingMilliSeconds(cookies.get("atsRefreshExpires")) > 0) {
      let formData = new URLSearchParams();
      formData.append("clientId", "ats");
      formData.append("refreshToken", cookies.get("atsRefreshToken"));
      let c = {
        clientId: "ats",
        refreshToken: cookies.get("atsRefreshToken"),
      };
      clearCookies();
      axios.post(refreshTokenEndPoint, c).then((resp) => {
        if (resp.status == 200) {
          setAuthenticated(true);
          let refreshTokenExpiresTime = getExpiredTimeStamp(
            resp.data?.value?.refresh_expires_in - 30
          );
          sessionStorage.setItem("atsRefreshExpires", refreshTokenExpiresTime);
          sessionStorage.setItem("atsRefreshToken", resp.data?.value?.refresh_token);

          // setCookieWithTimestampExpiry(
          //   "atsRefreshExpires",
          //   refreshTokenExpiresTime,
          //   refreshTokenExpiresTime
          // );
          // setCookieWithTimestampExpiry(
          //   "atsRefreshToken",
          //   resp.data?.value?.refresh_token,
          //   refreshTokenExpiresTime
          // );
          cookies.set("atsRefreshExpires", refreshTokenExpiresTime, {
            path: "/",
          });
          cookies.set("atsRefreshToken", resp.data?.value?.refresh_token, {
            path: "/",
          });
          window.location.href =
            redirectUrl[clientId] +
            resp.data?.value?.refresh_token +
            "/" +
            refreshTokenExpiresTime;
        }
      });
    }
  }, []);

  // const check = () => {
  //   axios
  //     .get(
  //       "http://localhost:8085/applicant-service/api/employee/all/view-my-profile/" +
  //         1,
  //       {
  //         headers: {
  //           Authorization:
  //             "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJoaGRqTWlmWi1uX3p0NHY5am1ialhzLU5LZmxLcTlUeUMzLVh0Z3dxVkRVIn0.eyJleHAiOjE2OTUxMzQxMjksImlhdCI6MTY5NTEzMzgyOSwianRpIjoiOGJhN2IxMWQtMTk5NC00YjZhLWI4NWEtN2Y3NDE0M2Q3NTQxIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9iYXNzdXJlIiwiYXVkIjpbInJlYWxtLW1hbmFnZW1lbnQiLCJlbXMiLCJhdHNSZWFjdCIsImFjY291bnQiXSwic3ViIjoiNWU3MTY0NTUtNzRmYy00NDAwLWJjYzktNzRmYjY0ZjQxZGUwIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXRzIiwic2Vzc2lvbl9zdGF0ZSI6ImExYWM3Nzk5LWE1OWEtNDdjNS04ZWMxLTAwZGU1MTRlZjkxNyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1iYXNzdXJlIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJtYW5hZ2UtdXNlcnMiLCJxdWVyeS11c2VycyJdfSwiZW1zIjp7InJvbGVzIjpbInBsYXRmb3JtRW1wbG95ZWUiXX0sImF0c1JlYWN0Ijp7InJvbGVzIjpbImFkbWluIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZ3JvdXAgZW1haWwiLCJzaWQiOiJhMWFjNzc5OS1hNTlhLTQ3YzUtOGVjMS0wMGRlNTE0ZWY5MTciLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImdyb3VwcyI6WyJkZWZhdWx0LXJvbGVzLWJhc3N1cmUiXSwicHJlZmVycmVkX3VzZXJuYW1lIjoiYXNpZiIsImdpdmVuX25hbWUiOiIiLCJmYW1pbHlfbmFtZSI6IiJ9.c09tu_oZWqrvrp8QQQGLNNWIUANXDUJ2ZnmKgOKPCKFuXk7haOWZ1QdMzw02IOZH2am8wv35orviYIkHep5ZIacjKyo_bqy_aVmWb8yw9ilSH2BnCaa7a8kksPYrw9zdIfqabo3vzfHf82dBxauN5DJeXCfKl4tzxQQBMk1wzu9JapdevhwS08U78xtW7veq2DjrGBDPdEWjnfF9YPAdrl1zPNy85TTnVN87Y8gQLPKmiPcc6dC_WvHIbQq4HZxq0jETXb1zo_sjeFNi20B2o8JH2XPBWk2vyYxjU9wNM9yYwOUc75zbMjUEWu39x3X0XLvMirtreHobu2TjOU13_A",
  //         },
  //       }
  //     )
  //     .then((resp) => {
  //       console.log(resp.data);
  //     });
  // };

  const onSubmit = async (e) => {
    e.preventDefault();
    let formData = new URLSearchParams();
    formData.append("client_id", "ats");
    formData.append("grant_type", "password");
    formData.append("username", username);
    formData.append("password", password);
    // console.log(formData.toString());
    let emsRoles = [
      "platformAdmin",
      "platformEmployee",
      "tenentAdmin",
      "tenentEmployee",
    ];
    deleteStorages();
    clearCookies();
    const c = {
      username: username,
      password: password,
      clientId: "ats",
    };
    try {
      await axios
        .post(tokenEndPoint, c, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((resp) => {
          console.log(resp);
          if (resp.status == 200) {
            console.log(resp.data);
            const checkRoles = emsRoles.some((r) =>
              jwtDecoder(resp.data.value?.access_token)?.Designation?.includes(
                r
              )
            );
            console.log(jwtDecoder(resp.data.value?.access_token));

            if (checkRoles) {
              setAuthenticated(true);
              sessionStorage.setItem(
                "accessToken",
                resp.data.value?.access_token
              );
              sessionStorage.setItem(
                "expiresIn",
                getExpiredTimeStamp(resp.data.value?.expires_in - 30)
              );
              let refreshTokenExpiresTime = getExpiredTimeStamp(
                resp.data.value?.refresh_expires_in - 30
              );
              sessionStorage.setItem(
                "atsRefreshExpires",
                refreshTokenExpiresTime
              );
              sessionStorage.setItem(
                "atsRefreshToken",
                resp.data.value?.refresh_token
              );
              // setCookieWithTimestampExpiry(
              //   "atsRefreshExpires",
              //   refreshTokenExpiresTime,
              //   refreshTokenExpiresTime
              // );

              // setCookieWithTimestampExpiry(
              //   "atsRefreshToken",
              //   resp.data.value?.refresh_token,
              //   refreshTokenExpiresTime
              // );
              cookies.set("atsRefreshExpires", refreshTokenExpiresTime, {
                path: "/",
              });
              cookies.set("atsRefreshToken", resp.data.value?.refresh_token, {
                path: "/",
              });
              autoLogOut(getRemainingMilliSeconds(refreshTokenExpiresTime));
              window.location.href =
                redirectUrl[clientId] +
                resp.data.value?.refresh_token +
                "/" +
                getExpiredTimeStamp(resp.data.value?.expires_in - 30);
            } else {
              alert("Not Authorized");
            }
          } else {
            alert("Invalid Credentials");
          }
        });
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  const autoLogOut = (remainingMilliSeconds) => {
    if (remainingMilliSeconds > 0) {
      setTimeout(() => {
        logout();
      }, remainingMilliSeconds);
    }
  };

  const clearCookies = () => {
    cookies.remove("atsRefreshToken");
    cookies.remove("atsRefreshExpires");
  };

  const logout = () => {
    deleteStorages();
    clearCookies();
    setAuthenticated(false);
  };

  const jwtDecoder = (token) => {
    try {
      return jwtDecode(token);
    } catch (Error) {
      alert("login failed");
    }
  };

  return !authenticated ? (
    <Box
      sx={{
        m: -1,
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#1a237e",
      }}
    >
      <Card sx={{ p: 5 }}>
        <form onSubmit={onSubmit}>
          <Grid
            container
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Grid
              item
              display={{ lg: "flex", md: "flex", sm: "none", xs: "none" }}
            >
              <CardMedia
                component={"img"}
                image={bgimg}
                sx={{ width: { lg: "80vh", md: "63vh" } }}
              />
            </Grid>
            <Grid item>
              <Grid
                container
                display={"flex"}
                flexDirection={"column"}
                alignContent={"flex-start"}
              >
                <Grid item>
                  <Typography
                    color={"#1a237e"}
                    fontWeight={"bold"}
                    fontSize={{
                      lg: "35px",
                      md: "30px",
                      sm: "25px",
                      xs: "22px",
                    }}
                  >
                    User Login
                  </Typography>
                </Grid>
                <Grid item mt={3}>
                  <Typography color={"#1a237e"} pb={1}>
                    Username
                  </Typography>
                  <TextField
                    variant="filled"
                    placeholder="Enter Your Username"
                    size="medium"
                    fullWidth
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                  />
                </Grid>
                <Grid item mt={3}>
                  <Typography color={"#1a237e"} pb={1}>
                    Password
                  </Typography>
                  <TextField
                    variant="filled"
                    placeholder="Enter Your Password"
                    size="medium"
                    type="password"
                    fullWidth
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
                </Grid>
                <Grid item mt={1}>
                  <Link component="button" underline="none" color="#1a237e">
                    Forgot Password?
                  </Link>
                </Grid>
                <Grid item mt={5}>
                  <Button
                    variant="contained"
                    sx={{
                      background: "#1a237e",
                      width: "350px",
                      height: "40px",
                      borderRadius: "20px",
                    }}
                    type="submit"
                    onClick={onSubmit}
                  >
                    Login
                  </Button>
                </Grid>
                <Grid item mt={1}>
                  <Link component="button" underline="none" color="#1a237e">
                    New User? Create An Account
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  ) : (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Login Successfully...</h1>
    </Box>
  );
}

export default App;
