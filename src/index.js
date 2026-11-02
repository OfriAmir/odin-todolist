import "./style.css"
import {project} from "./project.js"
import {displayControllerWithModule} from "./display-controller.js"

// let myItem = new TodoItem("Hello", "World")
// // myItem.dueDate = new Date(2014,1,11)
// console.log(myItem.dueDate)
// const initializeScreen = (function() {
//     let myProject = new Project("My Task1", "It's mine")
//     myProject.dueDate = new Date(2027, 2, 1)
//     let myProject2 = new Project("My Task2", "It's mine")
//     myProject2.dueDate = new Date(2027, 3, 1)
//     let myProject3 = new Project("My Task3", "It's mine")
//     myProject3.dueDate = new Date(2027, 4, 1)
//     // Project.defaultSort(Project.all)
//     console.log(Project.all)
//     // myProject.dueDate = new Date(2027, 2, 1)
//     // console.log({Project})    
// })()

(function () {
    let myProject1 = project.createInstance("My Title", "My Description")
    let myProject2 = project.createInstance("My Title", "My Description")
    let myProject3 = project.createInstance("My Title", "My Description")
    myProject1.createTodo("Hi", "How are you?")
    myProject1.checklist.push({content: "Do Your todos", complete: false})
    const displayController = displayControllerWithModule(project)
    displayController.displayProjectsNav()
    displayController.displayMain(myProject1)
    // console.log(myProject1)
    
    // myProject1.dueDate = new Date(2027, 1, 9)
    // myProject2.dueDate = new Date(2017, 4, 4)
    // myProject3.dueDate = new Date(2037, 2, 5)
    // console.log(project.getAllProjects())

})()

