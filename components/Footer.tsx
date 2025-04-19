import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="absolute w-full py-4 border-t border-gray-200 items-center bottom-0">
      <div className="container mx-auto flex items-center">
        <p className="text-sm text-gray-500 text-center flex-grow">
          All rights reserved © {new Date().getFullYear()} Enes SARIHAN
        </p>
        <div className="flex justify-end items-center">
          <Link
            href={"https://www.instagram.com/enesarihan/"}
            className="ml-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            <FaInstagram size={20} />
          </Link>
          <Link
            href={"https://github.com/enesarihan"}
            className="ml-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            <FaGithub size={20} />
          </Link>
          <Link
            href={"https://www.linkedin.com/in/enesarihan/"}
            className="ml-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            <FaLinkedin size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
