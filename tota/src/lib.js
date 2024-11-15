export const checkAuthentication = async (setIsAuthenticated) => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    console.log("No access token found");
    setIsAuthenticated(false);
    return;
  }

  const clientId = "batman-portal";
  const clientSecret = "dJmmW17IUmlKLIAck7odw4NoxYTlroQa"; // Replace with your client secret
  const introspectUrl =
    "https://keycloak-dqs.mogiio.com/realms/sso-demo/protocol/openid-connect/token/introspect";

  try {
    const response = await fetch(introspectUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        token: accessToken,
      }),
    });

    const data = await response.json();
    if (data.active) {
      console.log("User is authenticated");
      setIsAuthenticated(true);
    } else {
      console.log("User is not authenticated");
      setIsAuthenticated(false);
    }
  } catch (error) {
    console.error("Error during token introspection:", error);
    setIsAuthenticated(false);
  }
};

export const keycloakLogin = () => {
  const keycloakServer = "https://keycloak-dqs.mogiio.com/";
  const realm = "sso-demo";
  const clientId = "batman-portal";
  const redirectUri = encodeURIComponent(window.location.origin); // Replace "/callback" with your redirect path

  const authorizationUrl =
    `${keycloakServer}realms/${realm}/protocol/openid-connect/auth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=openid` +
    `&state=${generateRandomString(12)}` +
    `&nonce=${generateRandomString(12)}`;

  // Redirect the user to Keycloak login page
  window.location.href = authorizationUrl;
};

// Utility function to generate a random string (for state & nonce)
function generateRandomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const getAccessToken = async (code) => {
  const keycloakServer = "https://keycloak-dqs.mogiio.com";
  const realm = "sso-demo";
  const clientId = "batman-portal";
  const redirectUri = window.location.origin;

  const tokenUrl = `${keycloakServer}/realms/${realm}/protocol/openid-connect/token`;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: clientId,
    redirect_uri: redirectUri,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Access Token:", data.access_token);
      console.log("Refresh Token:", data.refresh_token);
      console.log("ID Token:", data.id_token);

      // Store the tokens as needed
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      console.error("Failed to fetch access token");
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
};

// Logout function
export const handleLogout = () => {
  const keycloakServer = "https://keycloak-dqs.mogiio.com";
  const realm = "sso-demo";
  const clientId = "batman-portal";
  const redirectUri = encodeURIComponent(window.location.origin);
  const logoutUrl =
    `${keycloakServer}/realms/${realm}/protocol/openid-connect/logout` +
    `?client_id=${clientId}` +
    `&post_logout_redirect_uri=${redirectUri}`;

  // Clear any stored tokens
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  // Redirect to Keycloak logout endpoint
  window.location.href = logoutUrl;
};
