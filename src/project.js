import {writingEntity} from "./writing-entity.js"
import {format} from "date-fns"

export const project = (function(){
    let _all = []

    function getAllProjects(){
        return _all
    }

    function isStorageAvailable(type) {
        let storage;
        try {
            storage = window[type];
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
            );
        }
    }

    const storageAvailable = isStorageAvailable()
    
    function addProjectToStorage(){
        let arrForStorage
        getAllProjects().forEach(project => {
            let storageProject
            // project.forEach(prop => {
                
            // })
            for (let prop in project){
                if (prop.at(0) === "_"){
                    storageProject[prop] = project[prop]
                }
            }
            let todos = project.getAllTodos()
            storageProject.todos = []
            todos.forEach(todo => {
                let storageTodo
                for (let prop in todo){
                    if (prop.at(0) === "_"){
                        storageTodo[prop] = todo[prop]
                    }
                }
                storageProject.todos.push(storageTodo)
            })
            arrForStorage.push(storageProject)
        })
        localStorage.allProjects = arrForStorage

    }

    function createProject(title, description, priority, dueDate, notes){
        let _todos = []
        function getAllTodos() {
            return _todos
        }



        function createTodo(title, description, priority, dueDate, notes) {
            let currentInstance = writingEntity.createInstance();
            writingEntity.addGettersAndSettersToInstance(currentInstance, _todos)
            if (title) currentInstance.title = title
            if (description) currentInstance.description = description
            if (priority) currentInstance.priority = priority
            if (dueDate) currentInstance.dueDate = dueDate
            if (notes) currentInstance.notes = notes
            writingEntity.addInstanceToArr(currentInstance, _todos)
            return currentInstance
        }

        let currentInstance = Object.assign({}, writingEntity.createInstance(), {getAllTodos, createTodo,});
        writingEntity.addGettersAndSettersToInstance(currentInstance, _all)
        if (title) currentInstance.title = title
        if (description) currentInstance.description = description
        if (priority) currentInstance.priority = priority
        if (dueDate) currentInstance.dueDate = dueDate
        if (notes) currentInstance.notes = notes
        writingEntity.addInstanceToArr(currentInstance, _all);
        return currentInstance
    }
    
    return {getAllProjects, createProject}
})()




