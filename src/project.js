import {writingEntity} from "./writing-entity.js"
import {format} from "date-fns"

export const project = (function(){
    let _all = []

    function getAllProjects(){
        return _all
    }

    function createInstance(title, description){
        let _todos = []
        function getAllTodos() {
            return _todos
        }
        function createTodo(title, description) {
            let currentInstance = writingEntity.createInstance(title, description);
            Object.defineProperties(currentInstance,{
                dueDate: {
                    set(date){
                        this._dueDate = date
                        writingEntity.defaultSort(_todos);
                    },
                    get(){
                        return this._dueDate
                    }
                },
                priority: {
                    set(number){
                        this._priority = writingEntity.defaultPriorityOptions.at(number)
                        writingEntity.defaultSort(_todos)
                    },
                    get(){
                        return this._priority
                    }
                }
            })
            writingEntity.addInstanceToArr(currentInstance, _todos)
            return currentInstance
        }

        let currentInstance = Object.assign({}, writingEntity.createInstance(title, description), {getAllTodos, createTodo,});
        Object.defineProperties(currentInstance,{
            dueDate: {
                set(date){
                    this._dueDate.date = date
                    this._dueDate.formattedDate = format(date,"HH:mm MMMM do, y")
                    writingEntity.defaultSort(_all);
                },
                get(){
                    return this._dueDate
                }
            },
            priority: {
                set(number){
                    this._priority = writingEntity.defaultPriorityOptions.at(number)
                    writingEntity.defaultSort(_all)
                },
                get(){
                    return this._priority
                }
            }
        })
        writingEntity.addInstanceToArr(currentInstance, _all);
        return currentInstance
    }
    
    return {getAllProjects, createInstance}
})()




