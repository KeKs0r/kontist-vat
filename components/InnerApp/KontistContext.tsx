import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client } from "kontist";

type KontistContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  client: Client;
  onUnauthorized: () => void;
};

const KontistContext = createContext<KontistContextType | undefined>(undefined);

export function KontistAuthProvider({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const kontistRef = useRef(getClient());

  useEffect(() => {
    const kontist = kontistRef.current;
    const existingToken = sessionStorage.getItem("token");
    const code = new URL(document.location.toString()).searchParams.get("code");
    if (code) {
      kontist.auth.tokenManager
        .fetchToken(document.location.href)
        .then((token) => {
          sessionStorage.setItem("token", token.accessToken);
          history.replaceState(null, "", location.pathname);
          setIsAuthenticated(true);
        });
    } else if (existingToken) {
      kontist.auth.tokenManager.setToken(existingToken);
      setIsAuthenticated(true);
    }
  }, []);

  async function login() {
    const client = kontistRef.current;
    const authUri = await client.auth.tokenManager.getAuthUri();
    console.log("authUri", authUri);
    window.location.href = authUri;
  }

  function logout() {
    window.location.href = "https://api.kontist.com/api/oauth/logout";
  }

  function onUnauthorized() {
    setIsAuthenticated(false);
    sessionStorage.removeItem("token");
  }

  const value = {
    isAuthenticated,
    login,
    logout,
    client: kontistRef.current,
    onUnauthorized,
  };

  return (
    <KontistContext.Provider value={value}>
      {isAuthenticated ? children : fallback}
    </KontistContext.Provider>
  );
}

export function useKontistContext(): KontistContextType {
  return useContext(KontistContext)!;
}

export function useKontist() {
  return useKontistContext().client;
}

function getClient() {
  // persist two random values
  sessionStorage.setItem(
    "state",
    sessionStorage.getItem("state") || (Math.random() + "").substring(2)
  );
  sessionStorage.setItem(
    "verifier",
    sessionStorage.getItem("verifier") || (Math.random() + "").substring(2)
  );
  const client = new Client({
    clientId: "b8a51b3b-5616-46a7-9f5a-7c9d7482024d",
    redirectUri: "http://localhost:3003",
    scopes: ["transactions", "statements"],
    state: sessionStorage.getItem("state")!,
    verifier: sessionStorage.getItem("verifier")!,
  });
  //@ts-ignore
  window.konist = client;
  return client;
}
