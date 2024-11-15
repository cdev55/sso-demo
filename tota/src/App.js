import React, { useEffect, useRef, useState } from "react";
import {
  checkAuthentication,
  getAccessToken,
  handleLogout,
  keycloakLogin,
} from "./lib";

function App() {
  const ref = useRef(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (ref.current) {
      return;
    }
    ref.current = true;

    // Check if there is a "code" parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");

    if (authorizationCode) {
      // Exchange the code for an access token
      getAccessToken(authorizationCode);
    }
    // checkAuthentication(setIsAuthenticated);
  }, []);

  return (
    <div>
      <h1>Tota Poops</h1>
      {/* <p>Authenticated as: {keycloak.tokenParsed?.preferred_username}</p> */}
      <h1>{isAuthenticated ? "Authenticated" : "Not Authenticated"}</h1>
      <button onClick={keycloakLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default App;
