import React from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init();

const WorkOverView = () => {
  return (
    <div data-aos="fade-up" className="container backdrop-brightness-150 bg-transparent py-8 px-5 rounded-2xl">
      <div className="grid md:grid-cols-4 items-center justify-center gap-12">
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="bg-[#10E3E0] rounded-full items-center justify-center inline-flex w-24 h-24">
            <h1 className="text-4xl text-white font-semibold">1M</h1>
          </div>
          <h4 className="text-4xl text-center font-semibold text-white">User</h4>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="bg-purple-500 rounded-full items-center justify-center inline-flex w-24 h-24">
            <h1 className="text-4xl text-white font-semibold">1M</h1>
          </div>
          <h4 className="text-4xl text-center font-semibold text-white">User</h4>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="bg-pink-500 rounded-full items-center justify-center inline-flex w-24 h-24">
            <h1 className="text-4xl text-white font-semibold">1M</h1>
          </div>
          <h4 className="text-4xl text-center font-semibold text-white">User</h4>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="bg-yellow-500 rounded-full items-center justify-center inline-flex w-24 h-24">
            <h1 className="text-4xl text-white font-semibold">1M</h1>
          </div>
          <h4 className="text-4xl text-center font-semibold text-white">User</h4>
        </div>
        
      </div>
    </div>
  );
};

export default WorkOverView;
