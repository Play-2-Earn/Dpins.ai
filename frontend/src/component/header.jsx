import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import mainlogo from "/mainLogo.png";
import "../component/styles//header.css";
import SignUpPopUp from "./popups/signUpPopUp";
import LogInPopUp from "./popups/logInPopUp";
import ForgetPasswordPopup from "./popups/forgetPasswordPopup";
import profilePic from "../images/profileIcon.png";
import { HiOutlineMenuAlt4, HiX } from "react-icons/hi";

const Header = () => {
  const [signUpPopUp, setsSignUpPopUp] = useState(false);
  const [logInPopUp, setlogInPopUp] = useState(false);
  const [forgetPass, setforgetPass] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const signUpPopUpOpen = () => {
    setsSignUpPopUp(true);
  };

  const onCloseSignUp = () => {
    setsSignUpPopUp(false);
  };

  const logInPopUpOpen = () => {
    setlogInPopUp(true);
  };

  const OnCloselogInPopUp = () => {
    setlogInPopUp(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    OnCloselogInPopUp();
  };

  const AlreadyUserClick = () => {
    setlogInPopUp(true);
    setsSignUpPopUp(false);
  };

  const NewToGame = () => {
    setlogInPopUp(false);
    setsSignUpPopUp(true);
  };

  const forgetPassOpen = () => {
    setforgetPass(true);
    setlogInPopUp(false);
  };

  const forgetPassClose = () => {
    setforgetPass(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="hover:cursor-pointer">
              <img
                src={mainlogo}
                alt="Dpins.ai"
                className="w-28 transform hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-4">
              {isLoggedIn ? (
                <Link
                  to="/userdashboard"
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={profilePic}
                    alt="userDashboard"
                    className="w-10 h-10 rounded-full border-2 border-cyan-500/50 hover:border-cyan-400"
                  />
                </Link>
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={signUpPopUpOpen}
                    className="px-6 py-2 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 animate-glow"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={logInPopUpOpen}
                    className="px-6 py-2 rounded-full border border-cyan-500 text-white font-semibold hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                {isMenuOpen ? (
                  <HiX className="w-8 h-8" />
                ) : (
                  <HiOutlineMenuAlt4 className="w-8 h-8" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-4 py-6 space-y-4 bg-black backdrop-blur-lg border-t border-gray-700">
              {isLoggedIn ? (
                <Link
                  to="/userdashboard"
                  className="flex justify-center"
                  onClick={toggleMenu}
                >
                  <img
                    src={profilePic}
                    alt="userDashboard"
                    className="w-12 h-12 rounded-full border-2 border-cyan-500/50"
                  />
                </Link>
              ) : (
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => {
                      signUpPopUpOpen();
                      toggleMenu();
                    }}
                    className="w-full px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-all duration-300"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      logInPopUpOpen();
                      toggleMenu();
                    }}
                    className="w-full px-6 py-3 rounded-full border border-cyan-500 text-white font-semibold hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Add spacer to prevent content from hiding behind fixed header */}
      <div className="h-20"></div>

      {/* Popups */}
      <SignUpPopUp
        signUpPopUpOpen={signUpPopUpOpen}
        onClose={onCloseSignUp}
        isOpen={signUpPopUp}
        AlreadyUserClick={AlreadyUserClick}
        onRegisterSuccess={logInPopUpOpen}
      />
      <LogInPopUp
        logInPopUpOpen={logInPopUpOpen}
        isOpen={logInPopUp}
        onClose={OnCloselogInPopUp}
        NewToGame={NewToGame}
        forgetPassOpen={forgetPassOpen}
        onLoginSuccess={handleLoginSuccess}
      />
      <ForgetPasswordPopup isOpen={forgetPass} onClose={forgetPassClose} />
    </>
  );
};

export default Header;
