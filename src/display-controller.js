import {project} from "./project.js"
import {format} from "date-fns"

const displayController = function(){
    const refs = {
        header: {
            ol: document.querySelector("header nav>ol"),
            myProjectsBtn: document.querySelector(".my-projects-btn"),
        },
        main: {
            h1: document.querySelector("main>h1"),
            ul: document.querySelector("main>ul"),
            lis: document.querySelectorAll("main>ul>li"),
            divs: document.querySelectorAll("main>div"),
        }

    }

    function displayAllProjects () {

    }

    function displayProjectsNav(){
        projectsDataArr = project.getAllProjects()
        projectsDataArr.forEach(project => {
            const ref = document.createElement("li")
            ref.textContent = `${project.title}`
            ref.dataset.id = project.id
            refs.header.ol.appendChild("ref")
        });
    }

    function displayProject(project) {
        refs.header.h1.textContent = project.title
        const lisDataArr = [project.description, project.priority.name, format(project.dueDate)]
        refs.header.lis.forEach(element => {
            
        })
    }
}
