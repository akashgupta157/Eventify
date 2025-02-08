import React from "react";
import Navbar from "@/components/Navbar";
import banner from "../assets/banner.webp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Dashboard from "@/components/Dashboard";
export default function Home() {
  return (
    <div>
      <div
        className={`h-[70svh]`}
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navbar />
        <div className="flex justify-center items-center h-[70%]">
          <div className="flex h-10 items-center">
            <Input
              type="text"
              className="w-96 px-5 h-full bg-white rounded-none rounded-l-md"
              placeholder="Search for events..."
            />
            <Button className="bg-black px-5 h-full text-white rounded-none rounded-r-md">
              Search
            </Button>
          </div>
        </div>
      </div>
      <Dashboard />
      <Footer />
    </div>
  );
}
