const keycloakBaseUrl = "http://localhost:6060";
export const emsDomain = "http://localhost:3001";
export const atsDomain = "http://localhost:3002";
export const clientId = "ems";

// export const tokenEndPoint =
//   keycloakBaseUrl + "/realms/bassure/protocol/openid-connect/token";

export const tokenEndPoint = keycloakBaseUrl + "/auth/login";
export const refreshTokenEndPoint = keycloakBaseUrl + "/auth/reload-token";

export const redirectUrl = {
  ems: emsDomain + "/setAuth/",
  ats: atsDomain + "/setAuth/",
};
