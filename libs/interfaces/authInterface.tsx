export interface AuthContextProps {
  children: React.ReactNode;
}

export interface AuthState {
  status: "checking" | "authenticated" | "not-authenticated";
  user: User | null;
  token: string | null;
}

export interface User {
  uid: string;
  name: string;
  email: string;
}
