import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Main from './layout/Main.jsx'
import Home from './components/Home/Home.jsx'
import AddAProject from './Dashboard/AddAProject.jsx'
import AllProjects from './Dashboard/AllProjects.jsx'
import UpdateProject from './Dashboard/UpdateProject.jsx'
import ProjectDetails from './components/ProjectDetails/ProjectDetails.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<Main></Main>,
    children:[
      {
        path:"/",
        element:<Home></Home>
      },
      {
        path:"/add-project",
        element:<AddAProject></AddAProject>
      },
      {
        path:"/all-projects",
        element:<AllProjects></AllProjects>
      },{
        path:"/update-project/:id",
        element: <UpdateProject></UpdateProject>,
        loader:({params}) => fetch(`http://localhost:5000/projects/${params.id}`)
      },{
        path:"/projectDetail/:id",
        element: <ProjectDetails></ProjectDetails>,
        loader:({params}) => fetch(`http://localhost:5000/projects/${params.id}`)
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
