import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

const Header = () => {
  const [navBarShow, setNavbarShow] = useState(false);

  return (
    <header className="fixed z-50 right-0 left-0 backdrop-blur-lg top-0 text-white shadow-xl shadow-secondary rounded-b-3xl">
      <div className="container mx-auto flex items-center justify-between py-6">
        <h1 className="text-3xl font-bold transform rotate-3 translate-y-4 animate-bounce">
          Sourav B_s_k
        </h1>
        <nav className="space-x-4">
          <div className="block md:hidden">
            <button
              className="text-xl bg-secondary px-2 rounded-md py-2"
              onClick={() => setNavbarShow(!navBarShow)}
            >
              {navBarShow ? <RxCross1></RxCross1> : <FaBars></FaBars>}
            </button>
          </div>
          <ul
            style={{ margin: "0" }}
            className={`flex md:static absolute h-screen md:h-auto shadow-lg md:shadow-none shadow-secondary md:shadow-transparent px-16 py-10 md:py-0 md:px-0 bg-transparent backdrop-blur-md flex-col md:flex-row items-center top-20 duration-300 md:gap-8 gap-6 ${
              navBarShow ? "right-0" : "-right-56"
            } `}
          >
            <li>
              <Link to="/" className="hover:text-gray-400 text-lg font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-gray-400 text-lg font-medium">
                About
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-gray-400 text-lg font-medium">
                Project
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-gray-400 text-lg font-medium">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
