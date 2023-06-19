import React, { useCallback } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import ParticlesComponent from "../components/ParticlesComponent/ParticlesComponent";

const Main = () => {
 
  return (
    <div className="bg-[#02132B] bg-no-repeat bg-cover overflow-hidden">
      <Header></Header>
      <main className="mt-24">
      <ParticlesComponent></ParticlesComponent>
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
      
    </div>
  );
};

export default Main;
