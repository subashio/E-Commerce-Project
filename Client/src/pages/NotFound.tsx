import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <img src="/errorbg.svg" alt="404-error-image" className="lg:h-[80vh]" />
      <div className="flex w-full items-center justify-center gap-28 px-2.5">
        <Link
          className="group inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-primary px-4 text-center text-sm font-medium text-primary-foreground transition-all duration-500 hover:border-primary hover:bg-white hover:text-black"
          to="/login"
        >
          Login Again
        </Link>
        <Link
          className="group inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-secondary px-4 text-center text-sm font-medium text-primary-foreground transition-all duration-500 hover:border-secondary hover:bg-white hover:text-black"
          to="/"
        >
          Go Back
        </Link>
      </div>
    </section>
  );
}
