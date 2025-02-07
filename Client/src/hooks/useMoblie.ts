import React from "react";

const useMobile = (breakpoint = 1024) => {
  const [isMobile, setIsMobile] = React.useState(
    window.innerWidth < breakpoint,
  );

  const handleResize = () => {
    const checkpoint = window.innerWidth < breakpoint;
    setIsMobile(checkpoint);
  };

  React.useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return [isMobile];
};

export default useMobile;
