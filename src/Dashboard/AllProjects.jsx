import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllProjects = () => {
    const [reFetch,setRefetch] = useState(true)
  const [Projects, setProjects] = useState([]);
  useEffect(() => {
    fetch("https://sourav-portfolio-server.vercel.app/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });
  }, [reFetch]);

  console.log(Projects);

  const handleRemoveProject = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://sourav-portfolio-server.vercel.app/projects/${id}`).then((data) => {
          if (data.data.deletedCount > 0) {
            setRefetch(!reFetch)
            Swal.fire("Deleted!", "Your Project has been deleted.", "success");
          }
        });
      }
    });
  };

  return (
    <div className="container">
      <h1 className="text-center py-5 text-5xl font-bold text-white">
        All Projects{" "}
      </h1>
      <div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th>Project</th>
                <th>Links</th>
                <th>Sills</th>
                <th>Update</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {Projects.map((project) => (
                <tr key={project._id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={project?.PhotoUrl}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{project?.title}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-ghost badge-md">
                      <Link to={project?.liveLink}> Live Link</Link>
                    </span>
                    <br />
                    <span className="badge badge-ghost badge-md">
                      <Link to={project?.clientLink}> Client Side Code</Link>
                    </span>
                    <br />
                    <span className="badge badge-ghost badge-md">
                      <Link to={project?.serverLink}> Server Side Code</Link>
                    </span>
                  </td>
                  <td className="overflow-x-scroll max-w-sm">
                    {project?.skills.map((item, i) => (
                      <span className="badge badge-sm" key={i}>
                        {item}
                      </span>
                    ))}
                  </td>

                  <th>
                    <Link to={`/update-project/${project._id}`}>
                      <button className="btn btn-primary btn-md">
                        <FaEdit></FaEdit>
                      </button>
                    </Link>
                  </th>
                  <th>
                    <button
                      onClick={() => handleRemoveProject(project._id)}
                      className="btn bg-red-600 text-white"
                    >
                      <FaTrashAlt></FaTrashAlt>
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <th>Project</th>
                <th>Links</th>
                <th>Sills</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
