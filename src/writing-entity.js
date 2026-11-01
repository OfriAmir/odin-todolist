import {format, compareAsc} from "date-fns"

export const writingEntity = (function() {
    const defaultPriorityOptions = [
        {
            name: "Unspecified",
            number: 0,
        },
        {
            name: "Very high",
            number: 1,
        },
        {
            name: "High",
            number: 2,
        },
        {
            name: "Medium",
            number: 3,
        },
        {
            name: "Low",
            number: 4,
        },   
        {
            name: "Very low",
            number: 5,
        },
    ]
    function defaultSort(Arr) {
        Arr.sort((a,b) => {
            if ((a.priority.number < b.priority.number) && a.priority.number > 0) return 1;
            else if ((a.priority.number > b.priority.number) && b.priority.number > 0) return -1;
            if (a.dueDate || b.dueDate){
                if (a.dueDate && !b.dueDate) return 1
                else if (!a.dueDate && b.dueDate) return -1
                else if (compareAsc(a.dueDate, b.dueDate) == 1) return 1;
                else if (compareAsc(a.dueDate, b.dueDate) == -1) return -1;
            } else if (a.creationDate < b.creationDate) return 1;
            else if (a.creationDate > b.creationDate) return -1;
            // else if (a.priority.number == 0) return -1
            // else if (b.priority.number == 0) return 1;
            else return 0;
        })
    }
    function createInstance(title, description){
        let creationDate, _priority, _dueDate, notes, checklist, complete, pin
        creationDate = Date.now()
        _priority = defaultPriorityOptions[0]
        return {title, description, creationDate, _priority, _dueDate, notes, checklist, complete, pin}
    }
    function addInstanceToArr(instance, arr){
        arr.push(instance);
        if (arr.length > 1) writingEntity.defaultSort(arr);
    }
    return {defaultPriorityOptions, defaultSort, createInstance, addInstanceToArr}
})()