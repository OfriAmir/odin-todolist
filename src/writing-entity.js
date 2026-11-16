import {compareAsc, format} from "date-fns"
import {project} from "./project.js"
export const writingEntity = (function() {
    // const defaultPriorityOptions = [
    //     {
    //         name: "unspecified",
    //         number: 0,
    //     },
    //     {
    //         name: "very-high",
    //         number: 1,
    //     },
    //     {
    //         name: "high",
    //         number: 2,
    //     },
    //     {
    //         name: "medium",
    //         number: 3,
    //     },
    //     {
    //         name: "low",
    //         number: 4,
    //     },   
    //     {
    //         name: "very-low",
    //         number: 5,
    //     },
    // ]
    const defaultPriorityOptions = ["unspecified", "very-low", "low", "medium", "high", "very-high"]
    function defaultSort(Arr) {
        Arr.sort((a,b) => {
            const criteria1 = a.priority - b.priority
            if (criteria1 != 0) return criteria1         
            if (a.dueDate.date || b.dueDate.date){
                let criteria2
                if (a.dueDate.date && !b.dueDate.date) criteria2 = 1
                else if (!a.dueDate.date && b.dueDate.date) criteria2 = -1
                if (criteria2) return criteria2
                else {
                    const criteria3 = compareAsc(a.dueDate.date, b.dueDate.date)
                    if (criteria3 != 0) return criteria3
                }
            }
            const criteria4 = compareAsc(a.creationDate, b.creationDate)
            return criteria4 
        })
    }
    function createInstance(){
        let _title, _description, _creationDate, _priority, _id, _dueDate, _notes, _checkList, _complete, _pin
        _title = null
        _description = null
        const now = new Date()
        _creationDate = {
            date: now,
            formattedDate: format(now,"HH:mm MMMM do, y"),
        }
        _id = crypto.randomUUID()
        _priority = 0
        _dueDate = {
            date: null,
            formattedDate: null,
        }
        _notes = null
        _checkList = []
        _complete = null
        _pin = null
        return {_title, _description, _creationDate, _id, _priority, _dueDate, _notes, _checkList, _complete, _pin}
    }
    function addGettersAndSettersToInstance (entity, entitiesArr) {
        Object.defineProperties(entity,{
            title: {
                set(data){
                    this._title = data
                    project.addProjectsToStorage()
                },
                get(){
                    return this._title
                }
            },

            description: {
                set(data){
                    this._description = data
                    project.addProjectsToStorage()
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
                // set(priorityType){
                //     this._priority = writingEntity.defaultPriorityOptions.indexOf(priorityType)
                //     writingEntity.defaultSort(entitiesArr)
                // },
                set(num){
                    this._priority = num
                    writingEntity.defaultSort(entitiesArr)
                    project.addProjectsToStorage()
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
                        project.addProjectsToStorage()
                    }
                },
                get(){
                    return this._dueDate
                }
            },

            notes: {
                set(data){
                    this._notes = data
                    project.addProjectsToStorage()
                },
                get(){
                    return this._notes
                }
            },

            addToCheckList: {
                value: function(data) {
                    const fullData = {content: data, completed: false, id: crypto.randomUUID()}
                    this._checkList.push(fullData)
                    project.addProjectsToStorage()
                },
                // set(data){
                //     this._checkList.push(data)
                // },
                // get(){
                //     return this._checkList
                // }
            },
            
            completeCheckFromCheckList: {
                value: function(item){
                    item.completed = true
                    project.addProjectsToStorage()
                }
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
                    project.addProjectsToStorage()
                },
                get(){
                    return this._complete
                }
            },

            pin: {
                set(data){
                    //should only be boolean
                    this._pin = data
                    project.addProjectsToStorage()
                },
                get(){
                    return this._pin
                }
            },

            remove: {
                value: function(index) {
                    entitiesArr.splice(index, 1)
                    project.addProjectsToStorage()
                }
            }
        })
    }
    function addInstanceToArr(instance, arr){
        arr.push(instance);
        if (arr.length > 1) writingEntity.defaultSort(arr);
    }
    return {defaultPriorityOptions, defaultSort, createInstance, addGettersAndSettersToInstance, addInstanceToArr}
})()