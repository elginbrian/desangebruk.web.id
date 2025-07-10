import React from "react";

interface AuthButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "google";
  onClick?: () => void;
  mounted?: boolean;
}

const AuthButton = ({ children, type = "button", disabled = false, variant = "primary", onClick, mounted = true }: AuthButtonProps) => {
  const baseClasses = "w-full flex items-center justify-center px-4 py-2.5 rounded-md font-medium text-sm smooth-transition hover-lift btn-animate";

  const variantClasses = {
    primary: `bg-[#1B3A6D] text-white hover:bg-[#152f5a] focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:ring-offset-2 transition-colors ${disabled ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""}`,
    google: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors",
  };

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
      {children}
    </button>
  );
};

export default AuthButton;
