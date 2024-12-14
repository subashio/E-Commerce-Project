import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function AuthLayout() {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";
  return (
    <div className="">
      <header className="h-16 border-b">
        <MaxWidthWrapper className="flex h-full w-full flex-row items-center justify-evenly gap-x-10 gap-y-2">
          <div className="flex w-full items-center justify-between">
            <Link to="/" className="col-span-1 py-4">
              <img src="/logo.png" className="w-44" alt="Globo-green logo" />
            </Link>

            <Link
              to={isRegisterPage ? "/register" : "/login"}
              className="flex gap-1 text-sm text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="text-foreground hover:no-underline">
                {isRegisterPage
                  ? "Already have a Account?"
                  : "Don't have an account yet?"}
              </span>
              {isRegisterPage ? "Sign in" : "Sign up"}
            </Link>
          </div>
        </MaxWidthWrapper>
      </header>
      <div className="grid-col-1 grid h-[92vh] w-full items-center dark:bg-gray-950 md:grid-cols-2">
        <div className="flex h-full w-full justify-center bg-primary/50">
          <img src={isRegisterPage ? "/signup.svg" : "/signin.svg"} alt="" />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
