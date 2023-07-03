import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import SectionTitle from "../Shared/SectionTitle";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper";
import LightGallery from "lightgallery/react";
// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import LazyLoad from "react-lazy-load";
const ProjectDetailsModal = ({ project, id }) => {
  console.log(project);
  const onBeforeSlide = (detail) => {
    const { index, prevIndex } = detail;
  };

  return (
    <>
      <input type="checkbox" id={`my_modal_${id}`} className="modal-toggle" />
      <div className="modal">
        <label
          htmlFor={`my_modal_${id}`}
          className="btn hover:border-[#aafaff] border-[#aafaff]   text-black text-2xl font-extrabold  bg-gradient-to-r rounded-3xl from-[#aafaff] to-[#b5acff]  btn-md btn-circle btn-ghost absolute right-0 md:right-24 z-50 top-5"
        >
          ✕
        </label>
        <div className="modal-box  border w-full bg-transparent backdrop-blur-xl p-3 max-w-7xl">
          {/* ________________ */}

          <section className="">
            <div className="card group md:h-[500px] lg:card-side overflow-hidden border bg-[#020F22] shadow-xl">
              <div className="flex-shrink-0">
                <LazyLoad>
                  <img
                    className="max-w-full group-hover:object-bottom object-top duration-1000 w-[400px]  object-contain "
                    src={project?.PhotoUrl}
                    alt="Album"
                  />
                </LazyLoad>
              </div>

              <div className="card-body p-5">
                <div>
                  <h2 className="card-title text-3xl font-bold text-white">
                    {project?.title}
                  </h2>
                  <p className="text-white mt-5 text-sm md:text-base font-light ">
                    {project?.description}
                  </p>
                  <p className="text-white mt-5 ">
                    Technologies:{" "}
                    {project?.skills.map((item, i) => (
                      <span
                        key={i}
                        className="badge bg-[#ba8bfc69] mr-3 mb-2 badge-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="card-actions mt-auto justify-end">
                  <div className=" flex flex-wrap items-center gap-3">
                    <Link target="_blank" to={project?.clientLink}>
                      <button className=" flex items-center gap-2  border-2 text-base px-2 py-2 hover:border-[#aafaff] border-[#aafaff]  rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
                        <FaGithub className="text-white"></FaGithub> client code
                      </button>
                    </Link>
                    <Link target="_blank" to={project?.serverLink}>
                      <button className=" flex items-center gap-2  border-2  text-base px-2 py-2 hover:border-[#aafaff] border-[#aafaff]  rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
                        <FaGithub className="text-white"></FaGithub> server code
                      </button>
                    </Link>
                    <Link target="_blank" to={project?.liveLink}>
                      <button className=" flex items-center gap-2 border-2 text-base px-2 py-2 hover:border-[#aafaff] border-[#aafaff]  rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
                        Live Link{" "}
                        <FaExternalLinkAlt className="text-white"></FaExternalLinkAlt>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <SectionTitle
                title={`${project?.title} Screen Shots`}
              ></SectionTitle>

              <div className="mt-8 bg-[#020F22] p-5 border rounded-xl">
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
                  className="mySwiper h-[500px]"
                >
                  {project?.projectSS.map((img, i) => (
                    <SwiperSlide key={i}>
                      <LightGallery
                        onInit={onBeforeSlide}
                        speed={500}
                        plugins={[lgThumbnail, lgZoom]}
                      >
                        <a target="_blank" href={img}>
                          <img
                            className="w-full scale-[0.6] h-[500px]  object-top object-contain rounded-3xl "
                            src={img}
                          />
                        </a>
                      </LightGallery>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </section>
          {/* ___________ */}
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsModal;
