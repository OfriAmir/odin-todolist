import "./style.css"
import {project} from "./project.js"
import {displayControllerWithModule} from "./display-controller.js"

(function () {
    // if (storageAvailable()){
        
    // }
    project.createProjectsFromStorage()
    // let myProject1 = project.createProject("My Title", "My Description")
    // let myProject2 = project.createProject("My Title", "My Description")
    // let myProject3 = project.createProject("My Title", "My Description")
    // myProject1.createTodo("Hi", "How are you?")
    // myProject1.addToCheckList("Do Your Todos")
    // myProject2.addToCheckList("Do Your Todosfaggagagag")
    // myProject2.addToCheckList("Do Your Todosfaggagagag")
    const displayController = displayControllerWithModule(project)
    displayController.displayMain("allProjects")
    displayController.displayProjectsNav()
    // displayController.displayMain("allProjects")
    // displayController.clearMain()

    
})()

