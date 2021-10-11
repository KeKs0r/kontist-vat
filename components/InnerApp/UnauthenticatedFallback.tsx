import { useKontistContext } from "./KontistContext";

export function Unauthenticated() {
  const { login } = useKontistContext();
  return (
    <button className="btn btn-primary" onClick={login}>
      Login
    </button>
  );
}
