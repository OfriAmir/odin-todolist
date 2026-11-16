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

    const storageAvailable = isStorageAvailable("localStorage")

    function addProjectsToStorage(){
        if (!storageAvailable) return
        let arrForStorage = []
        getAllProjects().forEach(project => {
            let storageProject = {}
            // project.forEach(prop => {
                
            // })
            for (let prop in project){
                if (prop.at(0) === "_"){
                    if (prop === "_todos") continue
                    if (!project[prop]) project[prop] = null
                    storageProject[prop] = project[prop]
                }
            }
            let todos = project.getAllTodos()
            storageProject._todos = []
            todos.forEach(todo => {
                let storageTodo = {}
                for (let prop in todo){
                    if (prop.at(0) === "_"){
                        if (!todo[prop]) todo[prop] = null 
                        storageTodo[prop] = todo[prop]
                    }
                }
                storageProject._todos.push(storageTodo)
            })
            arrForStorage.push(storageProject)
        })
        localStorage.allProjects = JSON.stringify(arrForStorage)
    }

    // function getProjectsFromStorage() {
    //     const arrFromStorage = JSON.parse(localStorage.allProjects)
    //     arrFromStorage.forEach(project => {
    //         let createProjectArgsTemplate = ["_title", "_description", "_priority", "_dueDate", "_notes"]
    //         let createProjectArgs = [null, null, null, null, null]
    //         let otherProps = []            
    //         for (let prop in project){
    //             if (createProjectArgsTemplate.includes(prop)){
    //                 createProjectArgs[createProjectArgsTemplate.indexOf(prop)] = project[prop]
    //             } else {
    //                 otherProps.push(project[prop])
    //             }
    //         }
    //         const currentProject = createProject(...createProjectArgs)
    //         const otherPropsKeys = Object.keys(otherProps)
            
    //         // otherProps.forEach((prop, index) => currentProject[otherPropskeys[index]] = )
    //         // }
    //         // const createTodoArgs = [project._title, project]
    //         // createTodo
    //     })
    // }
    function createProjectsFromStorage(){
        if (!storageAvailable || localStorage.length === 0) return
        const arrFromStorage = JSON.parse(localStorage.allProjects)
        arrFromStorage.forEach((project, index) => {
            let _todos = project._todos
            function getAllTodos() {
                return project._todos
            }
            function createTodo(title, description, priority, dueDate, notes){
                _createTodo(title, description, priority, dueDate, notes, _todos)
            } 
            let currentInstance = Object.assign({}, project, {getAllTodos, createTodo,})
            console.log(currentInstance)
            writingEntity.addGettersAndSettersToInstance(currentInstance, _all, addProjectsToStorage)
            writingEntity.addInstanceToArr(currentInstance, _all);
            _todos.forEach(todo => {
                writingEntity.addGettersAndSettersToInstance(todo, _todos, addProjectsToStorage)
                writingEntity.addInstanceToArr(todo, _todos);                
            })
        })


        // arrFromStorage.forEach(project => {
        //     for (let key in project) {
        //         currentInstance[key] = project
        //     }
        // })

    }


    function createProject(title, description, priority, dueDate, notes){
        let _todos = []
        function getAllTodos() {
            return _todos
        }


        function createTodo(title, description, priority, dueDate, notes){
            _createTodo(title, description, priority, dueDate, notes, _todos)
        } 
        // function createTodo(title, description, priority, dueDate, notes) {
        //     let currentInstance = writingEntity.createInstance();
        //     writingEntity.addGettersAndSettersToInstance(currentInstance, _todos)
        //     if (title) currentInstance.title = title
        //     if (description) currentInstance.description = description
        //     if (priority) currentInstance.priority = priority
        //     if (dueDate) currentInstance.dueDate = dueDate
        //     if (notes) currentInstance.notes = notes
        //     writingEntity.addInstanceToArr(currentInstance, _todos)
        //     return currentInstance
        // }

        let currentInstance = Object.assign({}, writingEntity.createInstance(), {_todos, getAllTodos, createTodo,});
        writingEntity.addGettersAndSettersToInstance(currentInstance, _all, addProjectsToStorage)
        writingEntity.addInstanceToArr(currentInstance, _all);
        if (title) currentInstance.title = title
        if (description) currentInstance.description = description
        if (priority) currentInstance.priority = priority
        if (dueDate) currentInstance.dueDate = dueDate
        if (notes) currentInstance.notes = notes
        
        return currentInstance
    }

    function _createTodo(title, description, priority, dueDate, notes, arr) {
        let currentInstance = writingEntity.createInstance();
        writingEntity.addGettersAndSettersToInstance(currentInstance, arr, addProjectsToStorage)
        writingEntity.addInstanceToArr(currentInstance, arr)
        if (title) currentInstance.title = title
        if (description) currentInstance.description = description
        if (priority) currentInstance.priority = priority
        if (dueDate) currentInstance.dueDate = dueDate
        if (notes) currentInstance.notes = notes
        return currentInstance
    }    
    
    return {getAllProjects, createProject, addProjectsToStorage, createProjectsFromStorage}
})()




