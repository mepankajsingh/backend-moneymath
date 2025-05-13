import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { supabase } from "./supabase.server";

// Create session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "moneymath_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cr3t"], // Replace with a real secret in production
    secure: process.env.NODE_ENV === "production",
  },
});

// Get the session from the request
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// Create a session with the Supabase token
export async function createUserSession(accessToken: string, refreshToken: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("accessToken", accessToken);
  session.set("refreshToken", refreshToken);
  
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// Get the user from the session
export async function getUserFromSession(request: Request) {
  const session = await getSession(request);
  const accessToken = session.get("accessToken");
  
  if (!accessToken) return null;
  
  // Set the auth token in Supabase
  supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: session.get("refreshToken") || "",
  });
  
  // Get the user
  const { data } = await supabase.auth.getUser();
  return data?.user;
}

// Require authentication for a route
export async function requireAuth(request: Request, redirectTo: string = "/login") {
  const user = await getUserFromSession(request);
  
  if (!user) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  
  return user;
}

// Log out the user
export async function logout(request: Request) {
  const session = await getSession(request);
  
  // Sign out from Supabase
  await supabase.auth.signOut();
  
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
