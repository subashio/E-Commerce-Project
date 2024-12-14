import { cn } from "@/lib/utils";

const MaxWidthWrapper = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: any;
}) => {
  return (
    <div
      style={style}
      className={cn("mx-auto w-full max-w-screen-2xl px-5 lg:px-10", className)}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;

// ,
