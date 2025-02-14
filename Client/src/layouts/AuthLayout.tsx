import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function AuthLayout() {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";
  return (
    <div className="grid-col-1 grid h-[92vh] w-full items-center dark:bg-gray-950 md:grid-cols-2">
      <header className="fixed top-0 h-16 w-full border-b bg-white">
        <MaxWidthWrapper className="mx-auto flex w-full items-center justify-between">
          <Link to="/" className="col-span-1 py-4">
            <img src="/logo.png" className="w-44" alt="Globo-green logo" />
          </Link>

          {/* {isRegisterPage ? (
            <div className="flex gap-1">
              <p className="text-sm text-foreground hover:no-underline">
                Already have an account!
              </p>
              <Link
                to="/login"
                className="text-sm text-blue-500 hover:text-blue-600 focus:outline-none"
              >
                Sign in
              </Link>
            </div>
          ) : (
            <Link
              to="/register"
              className="flex gap-1 text-sm text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="text-foreground hover:no-underline">
                Don't have an account yet?
              </span>
              Sign up
            </Link>
          )} */}

          {/* </div> */}
        </MaxWidthWrapper>
      </header>
      <div className="mt-32 flex h-full w-full justify-center bg-primary/50">
        <img
          src={isRegisterPage ? "/signup.svg" : "/signin.svg"}
          alt="auth image"
        />
      </div>
      <Outlet />
    </div>
  );
}
