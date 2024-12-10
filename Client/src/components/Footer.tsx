"use client";
import { footerSvg, Links } from "@/constants/details";
// import Logo from "@/components/ui/Logo";

import MaxWidthWrapper from "./MaxWidthWrapper";
import { Link } from "react-router-dom";
import Logos from "./Logos";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Footer() {
  const categoryList = useSelector(
    (state: RootState) => state.product.categoryList,
  );

  return (
    <footer className="border-t">
      <MaxWidthWrapper>
        <div className="mx-auto p-2 py-6">
          <div className="grid place-content-center gap-8 md:grid-cols-1">
            <div className="">
              <Link
                to="/"
                className="mb-5 flex items-center justify-center font-semibold text-gray-900 dark:text-white sm:text-2xl"
              >
                <img
                  src="/logo.png"
                  className="mr-auto h-10 sm:h-14"
                  alt="Landwind Logo"
                />
              </Link>
              <p className="max-w-2xl text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
                beatae nisi voluptas, numquam optio aperiam esse sed dolor
                eligendi nihil hic recusandae illum. Fugit neque quam illum
                fugiat facilis consequuntur.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <nav>
                  <h1 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                    Categories
                  </h1>
                  <ul className="text-xs text-gray-500 dark:text-gray-400">
                    {categoryList.map((item) => (
                      <li key={item._id} className="mb-4">
                        <Link
                          to={item._id ? `/shop/${item._id}` : item._id}
                          className="hover:underline"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <nav>
                  <h1 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                    Company
                  </h1>
                  <ul className="text-xs text-gray-500 dark:text-gray-400">
                    {Links.map((item) => (
                      <li key={item.id} className="mb-4">
                        <Link to={item.to} className="hover:underline">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div>
                <p className="text-base font-semibold tracking-wide text-gray-900">
                  MOBILE APP IS AVAILABLE ON
                </p>
                <div className="flex items-center gap-1">
                  <a href="#" className="mt-4 max-w-md">
                    <img
                      src="https://mcqmate.com/public/images/icons/playstore.svg"
                      alt="Playstore Button"
                      className="h-10"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
          <span className="block text-center text-sm text-gray-500 dark:text-gray-400">
            © 2024. All Rights Reserved.
          </span>
          <ul className="mt-5 flex justify-center space-x-5">
            {footerSvg.map((item) => (
              <li key={item.id}>
                <Link
                  to="#"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <Logos d={item.d} className="border-none" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
