import { Link, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { getUserFromSession } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "MoneyMath Blog Admin" },
    { name: "description", content: "Admin dashboard for MoneyMath blog" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Check if user is already logged in
  const user = await getUserFromSession(request);
  
  // If logged in, redirect to admin dashboard
  if (user) {
    return redirect("/admin");
  }
  
  return json({ isLoggedIn: false });
}

export default function Index() {
  const { isLoggedIn } = useLoaderData<typeof loader>();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">MoneyMath Blog Admin</h1>
          <p className="text-gray-600 mb-8">Sign in to access the admin dashboard</p>
        </div>
        
        <Link 
          to="/login" 
          className="w-full inline-block py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
