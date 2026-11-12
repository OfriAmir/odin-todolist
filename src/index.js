import "./style.css"
import {project} from "./project.js"
import {displayControllerWithModule} from "./display-controller.js"

(function () {
    let myProject1 = project.createProject("My Title", "My Description")
    let myProject2 = project.createProject("My Title", "My Description")
    let myProject3 = project.createProject("My Title", "My Description")
    myProject1.createTodo("Hi", "How are you?")
    myProject1.addToCheckList("Do Your Todos")
    const displayController = displayControllerWithModule(project)
    displayController.displayProjectsNav()
    displayController.displayMain("allProjects")
    // displayController.clearMain()
})()

