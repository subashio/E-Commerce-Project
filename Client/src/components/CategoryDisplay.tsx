import { ArrowRightCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Card } from "./ui/card";

export default function CategoryDisplay({ name }: { name: string }) {
  return (
    <MaxWidthWrapper className="my-8">
      <div>
        <Link
          to="/shop"
          className="group flex items-center gap-3 rounded-full px-2 text-3xl font-bold"
        >
          {name}
          <ArrowRightCircleIcon className="mt-2 -translate-x-5 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
        </Link>
      </div>
      <div className="rounded-md">
        {/* <h1 className="p-4">Top Brands & Related Categories</h1> */}
        <div className="grid w-full grid-flow-row grid-rows-1 items-center gap-3 p-4">
          <div className="grid-col-2 k grid items-center rounded-2xl bg-background md:h-28 md:grid-flow-col">
            <div className="w-full">
              <div className="flex flex-col items-center justify-around gap-2 p-2">
                <h1>Top Brands</h1>
                <div className="flex gap-2">
                  <Link to="/" className="flex flex-col">
                    <div className="flex h-14 w-14 items-center rounded-full border bg-white">
                      <img
                        src="/vevo.svg"
                        alt="brand"
                        className="rounded-full"
                      />
                    </div>
                  </Link>
                  <Link to="/" className="flex flex-col">
                    <div className="flex h-14 w-14 items-center rounded-full border bg-white">
                      <img
                        src="/vevo.svg"
                        alt="brand"
                        className="rounded-full"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-14">
            <div className="flex gap-4">
              <Card className="rounded-lg p-4">
                <Link
                  to="/"
                  className="flex flex-col items-center justify-center"
                >
                  <img src="/mobile.webp" alt="" className="h-32 w-32" />

                  <p className="">Smasung</p>
                </Link>
              </Card>
              <Card className="p-4">
                <Link
                  to="/"
                  className="flex flex-col items-center justify-center"
                >
                  <img src="/mobile.webp" alt="" className="h-32 w-32" />

                  <p className="">Smasung</p>
                </Link>
              </Card>
              <Card className="p-4">
                <Link
                  to="/"
                  className="flex flex-col items-center justify-center"
                >
                  <img src="/mobile.webp" alt="" className="h-32 w-32" />

                  <p className="">Smasung</p>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
