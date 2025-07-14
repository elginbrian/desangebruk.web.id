"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuth";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profile, user } = useAuth();
  const { logout } = useAuthActions();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  if (!profile || !user) return null;

  return (
    <div className="relative" ref={dropdownRef}>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-[#1B3A6D] px-3 py-2 text-sm font-medium smooth-transition hover-lift"
      >
        <div className="w-8 h-8 bg-[#1B3A6D] rounded-full flex items-center justify-center">
          <FiUser className="text-white" size={16} />
        </div>
        <span className="hidden md:block">{profile.name}</span>
        <FiChevronDown 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          size={16} 
        />
      </button>


      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-slide-in-left">
          <div className="py-1">

            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{profile.name}</p>
              <p className="text-xs text-gray-500">{profile.email}</p>
              <p className="text-xs text-gray-400 capitalize">{profile.role}</p>
            </div>


            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 smooth-transition"
              onClick={() => setIsOpen(false)}
            >
              <FiUser className="mr-3" size={16} />
              Dashboard
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 smooth-transition"
              onClick={() => setIsOpen(false)}
            >
              <FiSettings className="mr-3" size={16} />
              Pengaturan
            </Link>

            <hr className="my-1" />

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 smooth-transition"
            >
              <FiLogOut className="mr-3" size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

