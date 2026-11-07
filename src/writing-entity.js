import {compareAsc, format} from "date-fns"

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
            const criteria1 = defaultPriorityOptions.indexOf(a.priority) - defaultPriorityOptions.indexOf(a.priority)
            if (criteria1 != 0) return criteria1         
            else if (a.dueDate.date || b.dueDate.date){
                let criteria2
                if (a.dueDate.date && !b.dueDate.date) criteria2 = 1
                else if (!a.dueDate.date && b.dueDate.date) criteria2 = -1
                if (criteria2) return criteria2
                else {
                    const criteria3 = compareAsc(a.dueDate.date, b.dueDate.date)
                    if (criteria3 != 0) return criteria3
                }
            } else {
                const criteria4 = compareAsc(a.creationDate, b.creationDate)
                return criteria4
            } 
        })
    }
    function createInstance(){
        let _title, _description, _creationDate, _priority, _id, _dueDate, _notes, _checkList, _complete, _pin
        // _title = title
        // _description = description
        const now = new Date()
        _creationDate = {
            date: now,
            formattedDate: format(now,"HH:mm MMMM do, y"),
        }
        _id = crypto.randomUUID()
        _priority = defaultPriorityOptions[0]
        _dueDate = {
            date: null,
            formattedDate: null,
        }
        _checkList = []
        return {_title, _description, _creationDate, _id, _priority, _dueDate, _notes, _checkList, _complete, _pin}
    }
    function addInstanceToArr(instance, arr){
        arr.push(instance);
        if (arr.length > 1) writingEntity.defaultSort(arr);
    }
    return {defaultPriorityOptions, defaultSort, createInstance, addInstanceToArr}
})()