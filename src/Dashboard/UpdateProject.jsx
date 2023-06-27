import axios from "axios";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useLoaderData } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import Swal from "sweetalert2";
const ImageHostKey = import.meta.env.VITE_IMAGE_KEY;

const UpdateProject = () => {
    const projectData = useLoaderData();
    console.log(projectData);
    const [selected, setSelected] = useState([...projectData.skills]);
    const [images, setImages] = useState([...projectData.projectSS]);
    const url = `https://api.imgbb.com/1/upload?key=${ImageHostKey}`;
    const handleImageUpload = (e) => {
      const imageSS = e.target.files;
      const formData = new FormData();
      formData.append("image", imageSS[0]);
  
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((imageData) => {
          if (imageData.success) {
            const imgUrl = imageData.data.display_url;
            setImages([...images, imgUrl]);
          }
        });
    };
    console.log(images);
  
    const handleRemoveImage = (img) => {
      console.log(img);
      const restImage = images.filter((imgs) => imgs !== img);
      setImages(restImage);
    };
  
    const handleUpdateForm = (e) => {
      e.preventDefault();
      const form = e.target;
      const title = form.title.value || "";
      const liveLink = form.liveLink.value || "";
      const clientLink = form.clientLink.value || "";
      const serverLink = form.serverLink.value || "";
      const description = form.description.value || "";
      const projectSS = images || [];
  
   
            const newProject = {
              title,
              liveLink,
              clientLink,
              serverLink,
              skills : selected,
              description,
              projectSS,
            };
            console.log(newProject);

            axios.post(`https://sourav-portfolio-server.vercel.app/projects/${projectData._id}`,newProject)
            .then(res => {
                console.log(res);
              if(res.data.modifiedCount > 0){
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Your project has been Modified',
                  showConfirmButton: false,
                  timer: 1500
                })
              }
            })
    };
    return (
        <div className="container">
      <h1 className="text-center py-5 text-5xl font-bold text-white">
        Update Project{" "}
      </h1>

      <div>
        <form onSubmit={handleUpdateForm} className="card-body">
          <div className="flex items-center justify-between gap-5">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Project Title</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                defaultValue={projectData?.title}
                className="input input-bordered"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Live Link</span>
              </label>
              <input
                type="text"
                defaultValue={projectData?.liveLink}

                name="liveLink"
                placeholder="Live Link"
                className="input input-bordered"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-5">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Client Side Code Link</span>
              </label>
              <input
                type="text"
                defaultValue={projectData?.clientLink}

                name="clientLink"
                placeholder="Client Side Code Link"
                className="input input-bordered"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Server Side Code Link</span>
              </label>
              <input
                type="text"
                name="serverLink"
                defaultValue={projectData?.serverLink}

                placeholder="Server Side Code Link"
                className="input input-bordered"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-5">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Skills</span>
              </label>

              <TagsInput
                value={selected}
                onChange={setSelected}
                name="fruits"
                className="input  input-bordered"
                placeholder="Skills"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Image</span>
              </label>
              <input
                type="file"
                onChange={(e) => setPicture(e.target.files)}
                name="picture"
                className="file-input file-input-bordered file-input-primary w-full "
              />
            </div>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              type="text"
              name="description"
              placeholder="Description"
              defaultValue={projectData?.description}

              className="input h-40 p-5 input-bordered"
            ></textarea>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Project ScreenShots</span>
            </label>
            <input
              type="file"
              name="images"
              onChange={handleImageUpload}
              multiple
              className="file-input  file-input-bordered file-input-primary w-full "
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-4">
            {images.map((img, i) => (
              <div key={i} className="avatar relative">
                <div className="w-24 rounded-xl">
                  <img src={img} />
                </div>
                <FaTrash
                  type="icon"
                  onClick={() => handleRemoveImage(img)}
                  className="absolute text-2xl top-0 right-0 text-red-500"
                ></FaTrash>
              </div>
            ))}
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary">Add Projects</button>
          </div>
        </form>
      </div>
    </div>
    );
};

export default UpdateProject;