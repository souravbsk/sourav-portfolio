import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import SectionTitle from "../Shared/SectionTitle";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const ProjectDetails = () => {
    const project = useLoaderData();
    console.log(project);



  return (
    <section className="container mt-32 ">
      <div className="card lg:card-side overflow-hidden border bg-[#020F22] shadow-xl">
      
      <div className="flex-shrink-0">
      <img
        className="max-w-full object-top hover:object-bottom duration-1000 w-[400px] h-fit object-cover "
          src={project?.PhotoUrl}
          alt="Album"
        />
      </div>
   
      <div className="card-body p-5">
        <div>
        <h2 className="card-title text-3xl font-bold text-white">{project?.title}</h2>
        <p className="text-white mt-5 text-sm md:text-base font-light ">{project?.description}</p>
        <p className="text-white mt-5 ">Technologies: {project?.skills.map((item, i) => (
            <span
              key={i}
              className="badge bg-[#ba8bfc69] mr-3 mb-2 badge-primary"
            >
              {item}
            </span>
          ))}</p>
        </div>
       
        <div className="card-actions mt-auto justify-end">

        <div className=" flex flex-wrap items-center gap-3">
      <Link target="_blank" to={project?.clientLink}><button className=" border-2 text-base px-2 py-2 hover:border-[#aafaff] border-[#aafaff]  rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
         client code
          </button></Link>
      <Link target="_blank" to={project?.serverLink}><button className=" border-2  text-base px-2 py-2 hover:border-[#aafaff] border-[#aafaff]  rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
         server code
          </button></Link>
      <Link target="_blank" to={project?.liveLink}><button className=" border-2 text-base px-2 py-2 hover:border-[#aafaff] border-[#aafaff]  rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
       Live Link
          </button></Link>
      </div>

        </div>
      </div>
    </div>

    <div className="mt-8 md:mt-32">
    <SectionTitle title={`${project?.title} Screen Shots`}></SectionTitle>
    
    <div className="mt-12 bg-[#020F22] p-5 border rounded-xl">
    <Swiper
        effect={"coverflow"}
      
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        coverflowEffect={{
          rotate: 50,
          stretch: 1,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
        loop={true}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper "
      >
        {
            project?.projectSS.map((img,i) => <SwiperSlide key={i}>



    <img className="w-full h-[700px]  object-contain rounded-3xl " src={img} />



          </SwiperSlide>)
        }
        
        
      </Swiper>
    </div>
    </div>
    </section>
  );
};

export default ProjectDetails;
