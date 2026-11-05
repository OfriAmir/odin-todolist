import { format } from "date-fns"

export const displayControllerWithModule = function(projectModule){
    const projectsData = projectModule.getAllProjects()
    let currentProjectTodosData
    let currentProject
    let currentTodo
    const refs = {
        body: document.querySelector("body"),
        header: document.querySelector("header"),
        main: document.querySelector("main"),
        aside: document.querySelector("aside"),

    }
    refs.header.ol = document.querySelector("header nav>ol")
    refs.header.lis = []
    refs.header.myProjectBtn = document.querySelector("header .my-projects-btn")
    refs.main.h1 = document.querySelector("main>h1")

    refs.main.ul = document.querySelector("main>ul")
    refs.main.ul.classList.add("active")
    refs.main.lis = document.querySelectorAll("main>ul>li")
    refs.main.addBtn = document.querySelector("main .add-btn")
    refs.main.divs = []

    refs.aside.classList.add("active")
    refs.aside.h2 = document.querySelector("aside>h2")
    refs.aside.ul = document.querySelector("aside>ul")
    refs.aside.lis = []

    let currentActive = {
        header: {
            lis: {
                counter: 0 
            } 
        },
        main: {
            divs: {
                counter: 0
            }
        },
        aside: {
            lis: {
                counter: 0
            } 
        },
    }

    let formerActive = {
        header: {
            lis: {
                counter: 0
            } 
        },
        main: {
            divs: {
                counter: 0
            } 
        },
        aside: {
            lis: {
                counter: 0
            } 
        },
    }

    function displayProjectsNav(){
        projectsData.forEach((project, index)=> {
            let li
            if (index < refs.header.lis.length) li = refs.header.lis[index]
            else {
                li = document.createElement("li")
                refs.header.lis.push(li)
            } 
            li.textContent = `${project.title}`
            li.dataset.id = project.id
            if (!li.classList.contains("active")){
                refs.header.ol.appendChild(li)
                li.classList.add("active")
            }
        });
        removeAndDeactivateSuperfluous(refs.header.lis, formerActive.header.lis, currentActive.header.lis, projectsData.length)
    }

    
    function displayMain(instance) {
        const tabType = tabs.determineTabType(instance)
        tabs.setTabVars(instance, tabType)
        tabs.adjustDisplayToTabType(tabType)
        displayCards(tabType)
        displayMainTitleAndInfo(tabType)
        displayChecklist(tabType)
        // if (instance){
        //     if (instance.hasOwnProperty("getAllTodos")){
        //         currentProjectTodosData = instance.getAllTodos()
        //         displayCards(currentProjectTodosData)
        //     } else {
        //         displayCards() //removes Cards, when there's no need for ones (when entering a todo)
        //     }
        //     displayMainTitleAndInfo(instance)
        //     displayChecklist(instance.checkList)
        //     removeAndDeactivateSuperfluous(refs.main.lis[3])
        // } else { //display All projects
        //     displayMainTitleAndInfo()
        //     displayCards(projectsData)
        //     displayChecklist()
        //     removeAndDeactivateSuperfluous(refs.aside)
        // }
        
    }

    function displayMainTitleAndInfo(tabTypeDetermined) {
        let data
        if (tabTypeDetermined == "project"){
            data = currentProject
        } else if (tabTypeDetermined == "todo"){
            data = currentTodo
        }
        if (tabTypeDetermined == "project" || tabTypeDetermined == "todo"){
            refs.main.h1.textContent = data.title
            // if (!refs.main.ul.classList.contains("active")){
            //     refs.main.ul.classList.add("active")
            //     refs.main.insertBefore(refs.main.ul, refs.main.h1.nextSibling)
            // }
            // if (!refs.main.lis[3].classList.contains("active")){
            //     refs.main.lis[3].classList.add("active")
            //     refs.main.ul.appendChild(refs.main.lis[3])
            // }
            const names = ["Description", "Priority", "Due Date"]
            const content = [data.description, data.priority.name, data.dueDate.formattedDate]
            for (let i=0; i<3; i++){
                refs.main.lis[i].textContent = `${names[i]}: ${content[i]}`
                // refs.main.lis[i].classList.add("active")                
            }
            // refs.main.lis.forEach((li, index) => {
            //     li.textContent = `${names[index]}: ${content[index]}`
            //     li.classList.add("active")
            // })
        } else if (tabTypeDetermined == "allProjects"){
            // if (refs.main.ul.classList.contains("active")){
            //     refs.main.ul.classList.remove("active")
            //     refs.main.ul.remove()
            // }
            refs.main.h1.textContent = "My Projects"
        }
    }

    function displayCards(tabTypeDetermined){
        let dataArr = []
        // const chosenTab = determineTabType(instance)
        if (tabTypeDetermined == "project"){
        // currentProjectTodosData = instance.getAllTodos()
            dataArr = currentProjectTodosData
        } else if (tabTypeDetermined == "allProjects") {
            dataArr = projectsData
        } else if (tabTypeDetermined == "todo") {
            //skip the loop, no need for cards
        } else return //don't accept other types.
        
        dataArr.forEach((card, index) => {
            let div
            if (index < refs.main.divs.length) {
                div = refs.main.divs[index]
            } else {
                div = document.createElement("div")
                div.h2 = document.createElement("h2")
                div.ul = document.createElement("ul")
                div.lis = [document.createElement("li"), document.createElement("li"), document.createElement("li")]
                div.classList.toggle("card")
                refs.main.divs.push(div)
                div.appendChild(div.h2)
                div.appendChild(div.ul)
                div.lis.forEach(li => div.ul.appendChild(li))
            }
            div.dataset.id = card.id
            div.h2.textContent = card.title
            if (!div.classList.contains("active")){
                refs.main.appendChild(div)
                div.classList.add("active")
            }
            const names = ["Description", "Priority", "Due Date"]
            const content = [card.description, card.priority.name, card.dueDate.formattedDate]
            div.lis.forEach((li, index) => {
                li.textContent = `${names[index]}: ${content[index]}`
            })
        })
        removeAndDeactivateSuperfluous(refs.main.divs, formerActive.main.divs, currentActive.main.divs, dataArr.length)
    }

    function displayChecklist(tabTypeDetermined){
        let dataArr = []
        // const chosenTab = determineTabType(instance)
        if (tabTypeDetermined == "project"){
        // currentProjectTodosData = instance.getAllTodos()
            dataArr = currentProject.checkList
            // appendAndActivate(refs.aside, refs.body)
        } else if (tabTypeDetermined == "allProjects") {
             //No checklist in this tab, skip loop.
            // removeAndDeactivate(refs.aside)
        } else if (tabTypeDetermined == "todo") {
            dataArr = currentTodo.checkList
            // appendAndActivate(refs.aside, refs.body)
        } else return


        // if (!refs.aside.classList.contains("active")){
        //     refs.body.appendChild(refs.aside)
        //     refs.aside.classList.add("active")
        // }
        dataArr.forEach((item, index) => {
            let li
            if (index < refs.aside.lis.length) {
                li = refs.aside.lis[index]
            } else {
                li = document.createElement("li")
                refs.aside.lis.push(li)
            }
            li.textContent = item.content
            if (!li.classList.contains("active")){
                refs.aside.ul.appendChild(li)
                li.classList.add("active")
            }
        })
        removeAndDeactivateSuperfluous(refs.aside.lis, formerActive.aside.lis, currentActive.aside.lis, dataArr.length)
    }
    // Checklist should be an array of {content, complete} objects.


    // function clearMain(){
    //     const content = document.querySelectorAll("main .active")
    //     content.forEach((element) => {
    //         element.classList.remove("active")
    //         element.remove()
    //     })
    // }

    // function clearAside(){
    //     const content = document.querySelectorAll("aside .active")
    //     content.forEach((element) => {
    //         element.classList.remove("active")
    //         element.remove()
    //     })
    // }

    const eventsController = (function(){
        refs.header.addEventListener("click",(e)=>{
            if (e.target.classList.contains("my-projects-btn")){
                displayMain("allProjects")
                currentProject = null
                currentTodo = null
                
            } else if (e.target.hasAttribute("data-id")){
                const project = projectsData.find(item => item.id == e.target.dataset.id)
                displayMain(project)
            }
        })
        refs.main.addEventListener("click",(e)=>{
            const card = e.target.closest(".card")
            if (!card) return
            if (card.hasAttribute("data-id")){
                if (refs.main.h1.textContent == "My Projects"){
                    const project = projectsData.find(item => item.id == card.dataset.id)
                    displayMain(project)
                } else {
                    const todo = currentProjectTodosData.find(item => item.id == card.dataset.id)
                    displayMain(todo)
                }
            }
        })
    })()
    function appendAndActivate(element, parentElement, insertBefore, siblingElement){
        element.classList.add("active")
        if (insertBefore == "insertBefore"){
            parentElement.insertBefore(element, siblingElement)
        } else {
            parentElement.appendChild(element)
        }
    }

    function removeAndDeactivate(element){
        element.remove()
        element.classList.remove("active")
    }

    function removeAndDeactivateSuperfluous(elements, FormerAmountCounter, currentAmountCounter, currentAmountValue){
        // if (arguments.length == 1){
        //     if (Array.isArray(elements)){
        //         elements.forEach(item => {
        //         item.remove()
        //         item.classList.remove("active")                    
        //         })
        //     } else {
        //         elements.remove()
        //         elements.classList.remove("active")
        //     }
        // } else {
        currentAmountCounter.counter = currentAmountValue
        if (FormerAmountCounter.counter > currentAmountCounter.counter){
            for (let i=currentAmountCounter.counter; i<FormerAmountCounter.counter; i++){
                // elements[i].remove()
                // elements[i].classList.remove("active")
                removeAndDeactivate(elements[i])
            }
        }
        FormerAmountCounter.counter = currentAmountCounter.counter
        // }
    }

    const tabs = (function(){

        function determineTabType(instance) {
            if (typeof instance == "object" && instance.hasOwnProperty("getAllTodos")){
                return "project"
            } else if (typeof instance == "object" && currentProjectTodosData.includes(instance)) {
                return "todo"
            } else if (typeof instance == "string" && instance == "allProjects"){
                return instance
            }
        }

        function setTabVars(instance, tabTypeDetermined){
            switch (tabTypeDetermined){
                case "todo":
                    currentTodo = instance
                    break;
                case "project":
                    currentProject = instance
                    currentProjectTodosData = instance.getAllTodos()
                    break;  
            }
        }

        function adjustDisplayToTabType(tabTypeDetermined){
            if (tabTypeDetermined == "todo" || tabTypeDetermined == "project"){
                appendAndActivate(refs.main.ul, refs.main, "insertBefore", refs.main.h1.nextSibling)
                appendAndActivate(refs.aside, refs.body)
            }
            if (tabTypeDetermined == "project") {
               appendAndActivate(refs.main.addBtn, refs.main, "insertBefore", refs.main.ul.nextSibling) 
            } else if (tabTypeDetermined == "allProjects") {
                appendAndActivate(refs.main.addBtn, refs.main, "insertBefore", refs.main.h1.nextSibling)
                removeAndDeactivate(refs.aside)
            } else if (tabTypeDetermined == "todo") {
                removeAndDeactivate(refs.main.addBtn)
            }

            // switch (tabTypeDetermined){
            //         case "todo":
            //         case "project": 
            //         appendAndActivate(refs.main.ul, refs.main, "insertBefore", refs.main.h1.nextSibling)
            //         appendAndActivate(refs.aside, refs.body)
            //         console.log(tabTypeDetermined)
            //     case "project":
            //         appendAndActivate(refs.main.addBtn, refs.main, "insertBefore", refs.main.ul.nextSibling)
            //         break;
            //     case "allProjects":
            //         appendAndActivate(refs.main.addBtn, refs.main, "insertBefore", refs.main.h1.nextSibling)
            //         removeAndDeactivate(refs.aside)
            //         break;
            //     case "todo":
            //         console.log(tabTypeDetermined)
            //         removeAndDeactivate(refs.main.addBtn)
            //         break;
            // }
        }
        return {determineTabType, setTabVars, adjustDisplayToTabType}
    })()

    return {displayProjectsNav, displayMain,}
}


