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
      className={cn(
        "mx-auto w-full px-2.5 lg:max-w-screen-2xl lg:px-10 xl:max-w-[1650px]",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;

// ,
