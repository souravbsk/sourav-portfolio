import React from "react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#020F22] mt-12 ">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <p>
            <small>
              Created with ♥️ by{" "}
              <Link to="https://souravbsk.netlify.app/">Souravbsk</Link>
            </small>
          </p>
          <ul className="flex  items-center gap-4">
            <li>
              <Link
                to="https://github.com/souravbsk"
                target="_blank"
                className="text-xl text-[#d3ceff]"
              >
                <FaGithub></FaGithub>
              </Link>
            </li>
            <li>
              <Link
                to="https://www.linkedin.com/in/souravbsk/"
                target="_blank"
                className="text-xl text-[#d3ceff]"
              >
                <FaLinkedin></FaLinkedin>
              </Link>
            </li>
            <li>
              <Link
                to="https://www.facebook.com/sourav.Alien"
                target="_blank"
                className="text-xl text-[#d3ceff]"
              >
                <FaFacebook></FaFacebook>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
