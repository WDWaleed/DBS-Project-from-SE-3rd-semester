function setToken(user: Object, expiresInDays: number) {
  const now = new Date();
  const expiry = now.getTime() + expiresInDays * 24 * 60 * 60 * 1000;

  const tokenData = {
    user,
    expiry,
  };

  localStorage.setItem("userToken", JSON.stringify(tokenData));
}

function getToken() {
  const user = localStorage.getItem("userToken");
  if (!user) return null;

  const tokenData = JSON.parse(user);
  const now = new Date();

  if (now.getTime() > tokenData.expiry) {
    // Token expired
    localStorage.removeItem("userToken");
    return null;
  }

  return tokenData.user;
}

export { setToken, getToken };
