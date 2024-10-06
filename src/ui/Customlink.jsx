import { Link } from "react-router-dom";

export default function CustomLink({ to, children, currentPath }) {
  return (
    <Link
      to={to}
      className={`relative px-2 py-1 text-white no-underline transition-all duration-300 ease-in-out`}
    >
      {children}

      <span
        className={`bg-red-logo absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transform transition-transform duration-300 ${
          currentPath === to ? "scale-x-100" : "group-hover:scale-x-100"
        }`}
      ></span>
    </Link>
  );
}
