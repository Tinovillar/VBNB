"use client";
import Link from "next/link";

export function Button({
  href,
  asChild = false,
  variant = "default",
  className = "",
  children,
  ...props
}) {
  const baseClasses =
    "inline-block px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer border border-gray-200 shadow-sm";

  const variants = {
    default: "bg-black text-white hover:bg-gray-800 focus:ring-blue-500",
    ghost: "bg-white text-black hover:bg-gray-100 focus:ring-gray-400",
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
