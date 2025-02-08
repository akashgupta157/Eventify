import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { logout } from "@/redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Plus, UserRound } from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="text-white flex justify-between items-center p-4 lg:px-10 lg:py-5">
      <h1
        className="text-lg lg:text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Eventify
      </h1>
      <div className="flex items-center space-x-4 lg:space-x-6">
        {user ? (
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Button
              className="p-2 lg:px-4 lg:py-2 lg:border"
              onClick={() => navigate("/create-event")}
            >
              <Plus className="w-5 h-5 lg:w-6 lg:h-6" />
              <p className="hidden lg:block ml-2">Create Event</p>
            </Button>
            <div className="flex items-center justify-center size-8 lg:size-10 rounded-full bg-gray-200 ">
              <span className="font-medium text-gray-800 text-sm lg:text-base">
                {user.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </span>
            </div>
            <h3 className="hidden lg:block text-sm lg:text-base">
              {user.name}
            </h3>
            <Button
              className="p-2 lg:px-4 lg:py-2 bg-white text-black"
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
            >
              <LogOut className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="hidden lg:block ml-2">Logout</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Button
              className="hidden lg:block border"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              className="hidden lg:block bg-white text-black"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
            <UserRound
              size={24}
              className="lg:hidden cursor-pointer"
              onClick={() => navigate("/login")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
