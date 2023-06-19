import React from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init();

const WorkOverView = () => {
  return (
    <div   className=" mt-16 md:mt-32">
      <div
       data-aos="fade-up"
        className="container backdrop-brightness-150 bg-transparent py-12 px-5 rounded-2xl"
      >
        <div className="grid md:grid-cols-3 items-center justify-center gap-6 md:gap-12">
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="bg-[#10E3E0] rounded-full items-center justify-center inline-flex w-24 h-24">
              <h1 className="text-4xl text-white font-semibold">20</h1>
            </div>
            <h4 className="text-2xl text-center font-semibold bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400 ">
             Happy Clients
            </h4>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="bg-purple-500 rounded-full items-center justify-center inline-flex w-24 h-24">
              <h1 className="text-4xl text-white font-semibold">26+</h1>
            </div>
            <h4 className="text-2xl text-center font-semibold bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400 ">
              Project Complete
            </h4>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="bg-pink-500 rounded-full items-center justify-center inline-flex w-24 h-24">
              <h1 className="text-4xl text-white font-semibold">2+</h1>
            </div>
            <h4 className="text-2xl text-center font-semibold bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400 ">
             Years of Experience
            </h4>
          </div>
          {/* <div className="flex flex-col gap-2 items-center justify-center">
            <div className="bg-yellow-500 rounded-full items-center justify-center inline-flex w-24 h-24">
              <h1 className="text-4xl text-white font-semibold">1M</h1>
            </div>
            <h4 className="text-2xl text-center font-semibold bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400 ">
             Years of Experience
            </h4>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default WorkOverView;
