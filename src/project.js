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
        function addGettersAndSettersToWritingEntity (entity, entitiesArr) {
            Object.defineProperties(entity,{
                title: {
                    set(data){
                        this._title = data
                    },
                    get(){
                        return this._title
                    }
                },

                description: {
                    set(data){
                        this._description = data
                    },
                    get(){
                        return this._description
                    }
                },

                creationDate: {
                    get(){
                        return this._creationDate.formattedDate
                    }
                },

                id: {
                    get(){
                        return this._id
                    }
                },

                priority: {
                    set(priorityType){
                        this._priority = writingEntity.defaultPriorityOptions.indexOf(priorityType)
                        writingEntity.defaultSort(entitiesArr)
                    },
                    get(){
                        return this._priority
                    }
                },
                
                dueDate: {
                    set(date){
                        if (date){
                            this._dueDate.date = date
                            this._dueDate.formattedDate = format(date,"HH:mm MMMM do, y")
                            writingEntity.defaultSort(entitiesArr);
                        }
                    },
                    get(){
                        return this._dueDate
                    }
                },

                notes: {
                    set(data){
                        this._notes = data
                    },
                    get(){
                        return this._notes
                    }
                },

                addTocheckList: {
                    value: function(data) {
                        const fullData = {content: data, complete: false}
                        this._checkList.push(fullData)
                    },
                    // set(data){
                    //     this._checkList.push(data)
                    // },
                    // get(){
                    //     return this._checkList
                    // }
                },
                
                checkList: {
                    get(){
                        return this._checkList
                    }
                },

                complete: {
                    set(data){
                        //should only be boolean, but I don't think I need to validate it here if there will be only one way to interact with it in the UI... 
                        this._complete = data
                    },
                    get(){
                        return this._complete
                    }
                },

                pin: {
                    set(data){
                        //should only be boolean
                        this._pin = data
                    },
                    get(){
                        return this._pin
                    }
                },
            })
        }



        function createTodo(title, description, priority, dueDate, notes) {
            let currentInstance = writingEntity.createInstance();
            addGettersAndSettersToWritingEntity(currentInstance, _todos)
            currentInstance.title = title
            currentInstance.description = description
            currentInstance.priority = priority
            currentInstance.dueDate = dueDate
            currentInstance.notes = notes
            writingEntity.addInstanceToArr(currentInstance, _todos)
            return currentInstance
        }

        let currentInstance = Object.assign({}, writingEntity.createInstance(), {getAllTodos, createTodo,});
        addGettersAndSettersToWritingEntity(currentInstance, _all)
        currentInstance.title = title
        currentInstance.description = description
        currentInstance.priority = priority
        currentInstance.dueDate = dueDate
        currentInstance.notes = notes
        writingEntity.addInstanceToArr(currentInstance, _all);
        return currentInstance
    }
    
    return {getAllProjects, createProject}
})()




