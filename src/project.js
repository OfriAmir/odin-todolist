import {writingEntity} from "./writing-entity.js"
import {format} from "date-fns"

export const project = (function(){
    let _all = []

    function getAllProjects(){
        return _all
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




