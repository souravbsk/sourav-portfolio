/* eslint-disable react/no-unescaped-entities */
import React, { useRef } from 'react';
import { FaHome, FaPhoneVolume } from "react-icons/fa";
import {HiOutlineMailOpen} from "react-icons/hi"
import { Link } from "react-router-dom";
import ParticlesComponent from "../ParticlesComponent/ParticlesComponent";
import emailjs from '@emailjs/browser';
const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    console.log(form);
    emailjs.sendForm(import.meta.env.VITE_SEVICE_KEY, import.meta.env.VITE_TEMPLATE_KEY, form.current, import.meta.env.VITE_PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          
      }, (error) => {
          console.log(error.text);
      });
  };

  return (
    <section className="pt-16 md:pt-32 container">
      <div data-aos="fade-left" className="flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row mb-8 md:items-center gap-4">
            <button className=" border-2  text-lg hover:border-[#aafaff] border-[#aafaff] btn px-3 rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
             <HiOutlineMailOpen className="text-[#B2BCFF] text-2xl font-medium"></HiOutlineMailOpen>
            </button>
            <div className="text-white">
            <h2 className="text-[#B2BCFF]">Email:</h2>
            <p className="text-lg md:text-xl font-medium"><Link to={"mailto:souravbsk01@gmail.com"}>souravbsk01@gmail.com</Link></p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row mb-8 md:items-center gap-4">
            <button className=" border-2  text-lg hover:border-[#aafaff] border-[#aafaff] btn px-3 rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
             <FaPhoneVolume className="text-[#B2BCFF] text-2xl font-medium"></FaPhoneVolume>
            </button>
            <div className="text-white">
            <h2 className="text-[#B2BCFF]">Phone:</h2>
            <p className="text-lg md:text-xl font-medium"><Link to={"tel:01629351823"}
            >+8801629351823</Link></p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row mb-8 md:items-center gap-4">
            <button className=" border-2  text-lg hover:border-[#aafaff] border-[#aafaff] btn px-3 rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
             <FaHome className="text-[#B2BCFF] text-2xl font-medium"></FaHome>
            </button>
            <div className="text-white">
            <h2 className="text-[#B2BCFF]">Address:</h2>
            <p className="text-lg md:text-xl font-medium">kishoreganj,Dhaka,Bangladesh</p>
            </div>
          </div>
          
        </div>
        <div  data-aos="fade-left" className="flex-1 rounded-lg p-6 md:p-16 bg-[rgba(0,0,0,.2)]">
          <h2
            className="text-lg md:text-4xl mb-5 font-semibold bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400 
            "
          >
            Let's talk
          </h2>
          <p className="text-white">
            Get in touch with me! Reach out using the contact form below and
            let's discuss your project requirements, collaborations, or any
            inquiries you may have. I look forward to hearing from you
          </p>

          <form ref={form} onSubmit={sendEmail}>
            <div className="mt-8">
              <div className="form-control mb-4">
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="Name*"
                  className="input bg-transparent input-bordered"
                />
              </div>
              <div className="flex flex-col md:flex-row items-center mb-4 gap-4">
                <div className="form-control w-full">
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="Email*"
                    className="input  bg-transparent input-bordered w-full"
                  />
                </div>
                <div className="form-control w-full">
                  <input
                    type="text"
                    required
                    name="phone"
                    placeholder="Phone*"
                    className="input  bg-transparent input-bordered w-full"
                  />
                </div>
              </div>
              <div className="form-control mb-4">
                <input
                  type="text"
                  required
                  name="subject"
                  placeholder="subject*"
                  className="input bg-transparent input-bordered"
                />
              </div>
              <div className="form-control w-full">
                <textarea
                  type="text"
                  required
                  name="message"
                  placeholder="Tell Us About Project"
                  className="input  bg-transparent p-5 resize-none  h-48 input-bordered w-full"
                ></textarea>
              </div>
              <div className="form-control mt-6">
                <button className=" border-2 text-lg hover:border-[#aafaff] border-[#aafaff] btn  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
                  Send Message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
