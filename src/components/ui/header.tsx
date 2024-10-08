import { useState, useEffect } from "react";

import Logo from "./logo";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const [top, setTop] = useState<boolean>(true);

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <header className="fixed top-2 z-30 w-full md:top-6 left-1/2 translate-x-[-50%]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(theme(colors.gray.100),theme(colors.gray.200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Site branding */}
          <div onClick={() => {navigate('/')}} className="flex flex-1 items-center">
            <Logo />
          </div>

          {/* Desktop sign in divs */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            <li>
              <div
                className="btn-sm bg-white text-gray-800 shadow hover:bg-gray-50"
              >
                登录
              </div>
            </li>
            <li>
              <div
                className="btn-sm bg-gray-800 text-gray-200 shadow hover:bg-gray-900"
              >
                注册
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
