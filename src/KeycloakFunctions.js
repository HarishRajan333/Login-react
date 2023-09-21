
export const deleteStorages = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("expiresIn");
  sessionStorage.removeItem("atsRefreshExpires");
  sessionStorage.removeItem("atsRefreshToken");
  deleteCookie("atsRefreshExpires");
  deleteCookie("atsRefreshToken");
};

export function getRemainingMilliSeconds(timestampInSeconds) {
  const currentTimestamp = Date.now();
  const remainingSeconds = Math.max(0, timestampInSeconds - currentTimestamp);
  return remainingSeconds;
}

export const getExpiredTimeStamp = (secondsToAdd) => {
  const currentTime = new Date();
  const newTime = new Date(currentTime.getTime() + secondsToAdd * 1000);
  return newTime.getTime();
};

export function setCookieWithTimestampExpiry(
  cookieKey,
  cookieValue,
  timestampInSeconds
) {
  const expirationDate = new Date(timestampInSeconds * 1000);
  const expires = `expires=${expirationDate.toUTCString()}`;
  document.cookie = `${cookieKey}=${encodeURIComponent(
    cookieValue
  )}; ${expires}; path="/";`;
}

function deleteCookie(cookieName) {
  const expirationDate = new Date("2000-01-01");
  document.cookie = `${cookieName}=; expires=${expirationDate.toUTCString()}; path=/`;
}

const getRemainingSeconds = (targetTimestamp) => {
  const currentTimestamp = Date.now();
  const remainingMilliseconds = targetTimestamp - currentTimestamp;
  if (remainingMilliseconds <= 0) {
    return 0;
  }
  return remainingMilliseconds;
};

