import { cn } from "@/lib/utils";

const MaxWidthWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn("mx-auto w-full max-w-screen-2xl px-5 lg:px-10", className)}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;

// ,
