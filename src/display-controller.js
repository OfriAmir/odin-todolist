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
        addWritingEntityDialog: document.querySelector("dialog.add-project-dialog")
    }
    refs.header.ol = document.querySelector("header nav>ol")
    refs.header.lis = []
    refs.header.myProjectBtn = document.querySelector("header .my-projects-btn")
    refs.header.addPro

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

    refs.addWritingEntityDialog.titleInput = refs.addWritingEntityDialog.querySelector("input[id=title]")
    refs.addWritingEntityDialog.descriptionInput = refs.addWritingEntityDialog.querySelector("textarea[id=description]")
    refs.addWritingEntityDialog.priorityInputs = refs.addWritingEntityDialog.querySelector("fieldset>input[type=radio]")
    refs.addWritingEntityDialog.dueDateInput = refs.addWritingEntityDialog.querySelector("input[id=due-date]")
    refs.addWritingEntityDialog.notesInput = refs.addWritingEntityDialog.querySelector("textarea[id=notes]")
    refs.addWritingEntityDialog.submitBtn = refs.addWritingEntityDialog.querySelector("button[type=submit]")
    refs.addWritingEntityDialog.cancelBtn = refs.addWritingEntityDialog.querySelector("button[type=button]")
    console.log(refs.addWritingEntityDialog.cancelBtn)

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
            const names = ["Description", "Priority", "Due Date"]
            const content = [data.description, data.priority.name, data.dueDate.formattedDate]
            for (let i=0; i<3; i++){
                refs.main.lis[i].textContent = `${names[i]}: ${content[i]}`           
            }
        } else if (tabTypeDetermined == "allProjects"){
            refs.main.h1.textContent = "My Projects"
        }
    }

    function displayCards(tabTypeDetermined){
        let dataArr = []
        if (tabTypeDetermined == "project"){
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
        if (tabTypeDetermined == "project"){
            dataArr = currentProject.checkList
        } else if (tabTypeDetermined == "allProjects") {
             //No checklist in this tab, skip loop.
        } else if (tabTypeDetermined == "todo") {
            dataArr = currentTodo.checkList
        } else return


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

    let lastProjectLiDOMRef
    const eventsController = (function(){
        function displayTab(tabType, target){
            if (tabType == "allProjects") {
                displayMain("allProjects")
                currentProject = null
                currentTodo = null
            } else if (tabType == "project"){
                const project = projectsData.find(item => item.id == target.dataset.id)
                displayMain(project)
                if (lastProjectLiDOMRef && lastProjectLiDOMRef !== target) {
                    lastProjectLiDOMRef.classList.remove("current-project")
                }
                target.classList.add("current-project")
                lastProjectLiDOMRef = target
            } else if (tabType == "todo"){
                const todo = currentProjectTodosData.find(item => item.id == target.dataset.id)
                displayMain(todo)
            }
        }
        refs.header.addEventListener("click",(e)=>{
            if (e.target.classList.contains("my-projects-btn")){
                // displayMain("allProjects")
                // currentProject = null
                // currentTodo = null
                displayTab("allProjects")
                
            } else if (e.target.hasAttribute("data-id")){
                // const project = projectsData.find(item => item.id == e.target.dataset.id)
                // displayMain(project)
                // if (lastProjectLiDOMRef && lastProjectLiDOMRef !== e.target) {
                //     lastProjectLiDOMRef.classList.remove("current-project")
                // }
                // e.target.classList.add("current-project")
                // lastProjectLiDOMRef = e.target
                displayTab("project", e.target)
            } else if (e.target.classList.contains("add-project-btn")){
                refs.addWritingEntityDialog.showModal()
            }
        })
        refs.main.addEventListener("click",(e)=>{
            const card = e.target.closest(".card")
            if (!card) return
            if (card.hasAttribute("data-id")){
                if (refs.main.h1.textContent == "My Projects"){
                    // const project = projectsData.find(item => item.id == card.dataset.id)
                    // displayMain(project)
                    displayTab("project", card)

                } else {
                    // const todo = currentProjectTodosData.find(item => item.id == card.dataset.id)
                    // displayMain(todo)
                    displayTab("todo", card)
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
        currentAmountCounter.counter = currentAmountValue
        if (FormerAmountCounter.counter > currentAmountCounter.counter){
            for (let i=currentAmountCounter.counter; i<FormerAmountCounter.counter; i++){
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
        }
        return {determineTabType, setTabVars, adjustDisplayToTabType}
    })()

    return {displayProjectsNav, displayMain,}
}


