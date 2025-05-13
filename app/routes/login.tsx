import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { signIn } from "~/utils/supabase.server";
import { createUserSession, getUserFromSession } from "~/utils/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  // If user is already logged in, redirect to admin
  const user = await getUserFromSession(request);
  if (user) {
    return redirect("/admin");
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirectTo") as string || "/admin";
  
  // Validate form
  const errors: Record<string, string> = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  
  try {
    // Sign in with Supabase
    const { session } = await signIn(email, password);
    
    if (!session) {
      return json({ formError: "Invalid login credentials" });
    }
    
    // Create user session
    return createUserSession(
      session.access_token,
      session.refresh_token,
      redirectTo
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return json({ formError: error.message || "Failed to login" });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">MoneyMath Admin</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        
        <Form method="post" className="mt-8 space-y-6" onSubmit={() => setIsLoading(true)}>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          
          {actionData?.formError ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
              {actionData.formError}
            </div>
          ) : null}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {actionData?.errors?.email && (
                <p className="text-red-500 text-sm mt-1">{actionData.errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {actionData?.errors?.password && (
                <p className="text-red-500 text-sm mt-1">{actionData.errors.password}</p>
              )}
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
