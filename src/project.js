import WritingEntity from "./writing-entity.js"
import TodoItem from "./todo-item.js"

export default class Project extends WritingEntity {
    #todos = []

    constructor(){
        super()
    }

    addTodo(obj){
        this.#todos.append(obj)
    }

}




