import "./style.css"
import {project} from "./project.js"
import {displayControllerWithModule} from "./display-controller.js"

(function () {
    let myProject1 = project.createInstance("My Title", "My Description")
    let myProject2 = project.createInstance("My Title", "My Description")
    let myProject3 = project.createInstance("My Title", "My Description")
    myProject1.createTodo("Hi", "How are you?")
    myProject1.checklist.push({content: "Do Your todos", complete: false})
    const displayController = displayControllerWithModule(project)
    displayController.displayProjectsNav()
    displayController.displayMain(myProject1)
    // displayController.clearMain()
})()

