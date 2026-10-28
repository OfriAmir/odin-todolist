import {format} from "date-fns"

export default class writingEntity {

    #title
    #description
    #dueDate
    #priority
    static #defaultPriorityOptions = ["Very low", "Low", "Medium", "High", "Very high", "unspecified"]
    #notes
    #checklist = []
    #complete

    constructor(title, description){
        this.#title = title
        this.#description = description
    }

    get title() {
        return this.#title
    }

    set title(data) {
        this.#title = data 
    }

    get description() {
        return this.#description
    }

    set description(data) {
        this.#description = data 
    }

    get dueDate(){
        return this.#dueDate
    }

    set dueDate(date){
        this.#dueDate = format(date,"MMMM do, y");
    }

    get priority(){
        return this.#priority
    }

    set priority(index){
        this.#priority = TodoItem.#defaultPriorityOptions[index]
    }

    get notes(){
        return this.#notes
    }

    set notes(data){
        this.#notes = data
    }

    get checklist(){
        return this.#checklist
    }

    addToChecklist(data, index = this.#checklist.length){
        if (index < this.#checklist.length) {
            index = this.#checklist.length
        }
        this.#checklist[index] = data
    }

    get complete(){
        return this.#complete
    }

    set complete(choice){
        this.#complete = choice
    }
}