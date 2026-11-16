import { format } from "date-fns"
import { writingEntity as writingEntityModule } from "./writing-entity.js"
// This application uses class "active" to determine whether a DOM object is visible or not. This method makes it very easy to tweak the logic, by using DevTools.
// The right method is to store this informatiion in internal variables inside the script, but I didn't think about it at first.
// So as long as I don't fix this, just know that this is a major risk and that this app isn't ready to use.
// Also, you should generally store the logic on a server so that it will be even harder to access it.



export const displayControllerWithModule = function(projectModule){
    const caches = (function(){
        const projectsData = projectModule.getAllProjects()
        const defaultPriorityOptions = ["Unspecified", "Very Low", "Low", "Medium", "High", "Very High"]
        let currentWritingEntity
        let currentProjectTodosData
        let currentProject
        let currentTodo
        let currentTabType
        let currentDialogType
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
                lis1: {
                    counter: 0
                },
                lis2: {
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
                lis1: {
                    counter: 0
                },
                lis2: {
                    counter: 0
                }
            },
        }
        let lastProjectLiDOMRef
        let checkListShowCompleted
        return {projectsData, defaultPriorityOptions, currentWritingEntity, currentProjectTodosData, currentProject, currentTodo, currentTabType, currentDialogType, currentActive, formerActive, lastProjectLiDOMRef, checkListShowCompleted}
    })()
    // const caches.projectsData = projectModule.getAllProjects()
    // const caches.defaultPriorityOptions = ["Unspecified", "Very Low", "Low", "Medium", "High", "Very High"]
    // let caches.currentProjectTodosData
    // let currentProject
    // let caches.currentTodo
    // let caches.currentTabType
    // let caches.currentDialogType
    const refs = {
        body: document.querySelector("body"),
        header: document.querySelector("header"),
        main: document.querySelector("main"),
        aside: document.querySelector("aside"),
        addWritingEntityDialog: document.querySelector("dialog.add-writing-entity-dialog"),
        optionsDialog: document.querySelector("dialog.options-dialog"),
        infoDialog: document.querySelector("dialog.info-dialog"),
        removalDialog: document.querySelector("dialog.removal-dialog"),
        checkListDialog: document.querySelector("dialog.checklist-dialog"),
        addToCheckListDialog: document.querySelector("dialog.add-to-checklist")
    }
    refs.header.ol = document.querySelector("header nav>ol")
    refs.header.lis = []
    refs.header.myProjectsBtn = document.querySelector("header .my-projects-btn")
    refs.header.addPro

    refs.main.optionsBtn = document.querySelector("main>button.options-btn")
    refs.main.h1 = document.querySelector("main>h1")
    refs.main.ul = document.querySelector("main>ul")
    refs.main.ul.classList.add("active")
    refs.main.lis = document.querySelectorAll("main>ul>li")
    refs.main.addBtn = document.querySelector("main .add-btn")
    refs.main.divs = []

    refs.aside.classList.add("active")
    refs.aside.h2 = document.querySelector("aside>h2")
    refs.aside.ul1 = document.querySelector("aside>ul")
    refs.aside.lis1 = []
    refs.aside.textSpans1 = []
    refs.aside.h3Completed = document.createElement("h3")
    refs.aside.h3Completed.textContent = "Completed:"
    refs.aside.ul2 = document.createElement("ul")
    refs.aside.lis2 = []
    refs.aside.textSpans2 = []


    refs.addWritingEntityDialog.form = refs.addWritingEntityDialog.querySelector("form")
    refs.addWritingEntityDialog.h3 = refs.addWritingEntityDialog.querySelector("h3")
    refs.addWritingEntityDialog.titleInput = refs.addWritingEntityDialog.querySelector("input[id=title]")
    refs.addWritingEntityDialog.descriptionInput = refs.addWritingEntityDialog.querySelector("textarea[id=description]")
    refs.addWritingEntityDialog.priorityInputs = [...refs.addWritingEntityDialog.querySelectorAll("fieldset>input[type=radio]")]
    refs.addWritingEntityDialog.dueDateInput = refs.addWritingEntityDialog.querySelector("input[id=due-date]")
    refs.addWritingEntityDialog.notesInput = refs.addWritingEntityDialog.querySelector("textarea[id=notes]")
    refs.addWritingEntityDialog.submitBtn = refs.addWritingEntityDialog.querySelector("button[type=submit]")
    refs.addWritingEntityDialog.cancelBtn = refs.addWritingEntityDialog.querySelector("button[type=button]")


    refs.optionsDialog.options = [...refs.optionsDialog.querySelectorAll("button")];
    refs.optionsDialog.complete = refs.optionsDialog.options[0]
    refs.optionsDialog.pin = refs.optionsDialog.options[1]
    refs.optionsDialog.pinByPriority = refs.optionsDialog.options[2]
    refs.optionsDialog.edit = refs.optionsDialog.options[3]
    refs.optionsDialog.info = refs.optionsDialog.options[4]
    refs.optionsDialog.removeBtn = refs.optionsDialog.options[5]
    // [refs.optionsDialog.complete, refs.optionsDialog.pin, refs.optionsDialog.pinByPriority, refs.optionsDialog.edit, refs.optionsDialog.info, refs.optionsDialog, refs.optionsDialog.removeBtn] = [...refs.optionsDialog.querySelectorAll("button")]
    // refs.optionsDialog.pinBtn = refs.optionsDialog.querySelector("button.pinBtn")
    // refs.optionsDialog.pinByPriorityBtn = refs.optionsDialog.querySelector("button.pinByPriorityBtn")

    refs.infoDialog.cancelBtn = refs.infoDialog.querySelector("button.cancel-button")
    refs.infoDialog.lis = [...refs.infoDialog.querySelectorAll("li")]
    refs.infoDialog.creationDate = refs.infoDialog.lis[0]
    refs.infoDialog.notes = refs.infoDialog.lis[1]

    refs.removalDialog.h3 = refs.removalDialog.querySelector("h3")
    refs.removalDialog.btns = [...refs.removalDialog.querySelectorAll("button")]
    refs.removalDialog.cancelBtn = refs.removalDialog.btns[0]
    refs.removalDialog.deleteBtn = refs.removalDialog.btns[1]

    // refs.checkListDialog.cancelBtn = refs.checkListDialog.querySelector("button.cancel-button")
    refs.checkListDialog.btns = [...refs.checkListDialog.querySelectorAll("button")]
    refs.checkListDialog.addToCheckList = refs.checkListDialog.btns[0]
    refs.checkListDialog.showCompleted = refs.checkListDialog.btns[1]

    refs.addToCheckListDialog.form = refs.addToCheckListDialog.querySelector("form")
    refs.addToCheckListDialog.input = refs.addToCheckListDialog.querySelector("textarea")
    // let currentActive = {
    //     header: {
    //         lis: {
    //             counter: 0 
    //         } 
    //     },
    //     main: {
    //         divs: {
    //             counter: 0
    //         }
    //     },
    //     aside: {
    //         lis: {
    //             counter: 0
    //         } 
    //     },
    // }

    // let formerActive = {
    //     header: {
    //         lis: {
    //             counter: 0
    //         } 
    //     },
    //     main: {
    //         divs: {
    //             counter: 0
    //         } 
    //     },
    //     aside: {
    //         lis: {
    //             counter: 0
    //         } 
    //     },
    // }

    function displayProjectsNav(){
        caches.projectsData.forEach((project, index)=> {
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
        removeAndDeactivateSuperfluous(refs.header.lis, caches.formerActive.header.lis, caches.currentActive.header.lis, caches.projectsData.length)
    }

    
    function displayMain(instance) {
        const tabType = tabs.determineTabType(instance)
        tabs.setTabVars(instance, tabType)
        tabs.adjustDisplayToTabType(tabType)
        displayCards(tabType)
        displayMainTitleAndInfo(tabType)
        displayCheckList(tabType)
    }

    function displayMainTitleAndInfo(tabTypeDetermined) {
        let data
        if (tabTypeDetermined == "project"){
            data = caches.currentProject
        } else if (tabTypeDetermined == "todo"){
            data = caches.currentTodo
        }
        if (tabTypeDetermined == "project" || tabTypeDetermined == "todo"){
            refs.main.h1.textContent = data.title
            const names = ["Description", "Priority", "Due Date"]
            const description = data.description ? data.description : ""
            const priority =  data.priority !== 0 ? caches.defaultPriorityOptions[data.priority] : ""
            const dueDate = data.dueDate.formattedDate ? data.dueDate.formattedDate : ""
            const contents = [description, priority, dueDate]
            for (let i=0; i<3; i++){
                refs.main.lis[i].textContent = `${names[i]}: ${contents[i]}`           
            }
        } else if (tabTypeDetermined == "allProjects"){
            refs.main.h1.textContent = "My Projects"
        }
    }

    function displayCards(tabTypeDetermined){
        let dataArr = []
        if (tabTypeDetermined == "project"){
            dataArr = caches.currentProjectTodosData
        } else if (tabTypeDetermined == "allProjects") {
            dataArr = caches.projectsData
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
            const description = card.description ? card.description : ""
            const priority =  card.priority !== 0 ? caches.defaultPriorityOptions[card.priority] : ""
            const dueDate = card.dueDate.formattedDate ? card.dueDate.formattedDate : ""
            const contents = [description, priority, dueDate]
            div.lis.forEach((li, index) => {
                li.textContent = `${names[index]}: ${contents[index]}`
            })
        })
        removeAndDeactivateSuperfluous(refs.main.divs, caches.formerActive.main.divs, caches.currentActive.main.divs, dataArr.length)
    }

    function displayCheckList(tabTypeDetermined){
        function checksLoop(checksArr, ul, lis, textSpans, btnClass){
            checksArr.forEach((item, index) => {
                let li
                let Btn
                let textSpan
                if (index < lis.length) {
                    li = lis[index]
                    textSpan = textSpans[index]
                } else {
                    li = document.createElement("li")
                    lis.push(li)
                    textSpan = document.createElement("span")
                    textSpan.classList.add("text-span")
                    textSpans.push(textSpan)
                    Btn = document.createElement("button")
                    Btn.classList.add(`${btnClass}`)
                    li.appendChild(textSpan)
                    li.appendChild(Btn)
                }
                
                if (!li.classList.contains("active")){
                    ul.appendChild(li)
                    li.classList.add("active")
                    
                    // if (completeBtn) li.appendChild(completeBtn)
                    textSpan.textContent = item.content
                }

                li.dataset.id = item.id
            })            
        }


        let checks = []
        if (tabTypeDetermined == "project"){
            checks = caches.currentProject.checkList
        } else if (tabTypeDetermined == "allProjects") {
             //No checkList in this tab, skip loop.
        } else if (tabTypeDetermined == "todo") {
            checks = caches.currentTodo.checkList
        } else return
        let completedChecks = []
        let incompletedChecks = []
        if (checks.length > 0){
            incompletedChecks = checks.filter(check => check.completed === false)

            if (caches.checkListShowCompleted){
                checksLoop(incompletedChecks, refs.aside.ul1, refs.aside.lis1, refs.aside.textSpans1, "complete-btn")
                
                appendAndActivate(refs.aside.h3Completed, refs.aside)
                appendAndActivate(refs.aside.ul2, refs.aside)
                completedChecks = checks.filter(check => check.completed === true)
                if (completedChecks.length > 0){        
                    checksLoop(completedChecks, refs.aside.ul2, refs.aside.lis2, refs.aside.textSpans2, "undo-btn")
                    console.log("hello")
                }
            } else {
                removeAndDeactivate(refs.aside.h3Completed)
                removeAndDeactivate(refs.aside.ul2)
                checksLoop(incompletedChecks, refs.aside.ul1, refs.aside.lis1, refs.aside.textSpans1, "complete-btn")
                removeAndDeactivateSuperfluous(refs.aside.lis1, caches.formerActive.aside.lis1, caches.currentActive.aside.lis1, incompletedChecks.length)
            }
        }
        removeAndDeactivateSuperfluous(refs.aside.lis1, caches.formerActive.aside.lis1, caches.currentActive.aside.lis1, incompletedChecks.length)
        removeAndDeactivateSuperfluous(refs.aside.lis2, caches.formerActive.aside.lis2, caches.currentActive.aside.lis2, completedChecks.length)


        // checks.forEach((item, index) => {
        //     let li
        //     let completeBtn
        //     let textSpan
        //     if (index < refs.aside.lis.length) {
        //         li = refs.aside.lis[index]
        //         textSpan = refs.aside.textSpans[index]
        //     } else {
        //         li = document.createElement("li")
        //         refs.aside.lis.push(li)
        //         textSpan = document.createElement("span")
        //         textSpan.classList.add("text-span")
        //         refs.aside.textSpans.push(textSpan)
        //         completeBtn = document.createElement("button")
        //         completeBtn.classList.add("complete-btn")
        //         li.appendChild(textSpan)
        //         li.appendChild(completeBtn)
        //     }
            
        //     if (!li.classList.contains("active")){
        //         refs.aside.ul.appendChild(li)
        //         li.classList.add("active")
                
        //         // if (completeBtn) li.appendChild(completeBtn)
        //         textSpan.textContent = item.content
        //     }
        // })
        // removeAndDeactivateSuperfluous(refs.aside.lis, caches.formerActive.aside.lis, caches.currentActive.aside.lis, checks.length)
    }

    // CheckList should be an array of {content, completed} objects.
     
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
    }

    const tabs = (function(){

        function determineTabType(instance) {
            if (typeof instance == "object" && instance.hasOwnProperty("getAllTodos")){
                return "project"
            } else if (typeof instance == "object" && caches.currentProjectTodosData.includes(instance)) {
                return "todo"
            } else if (typeof instance == "string" && instance == "allProjects"){
                return instance
            }
        }

        function setTabVars(instance, tabTypeDetermined){
            switch (tabTypeDetermined){
                case "todo":
                    caches.currentTabType = "todo"
                    caches.currentTodo = instance
                    caches.currentWritingEntity = instance
                    break;
                case "project":
                    caches.currentTabType = "project"
                    caches.currentTodo = null
                    caches.currentProject = instance
                    caches.currentProjectTodosData = instance.getAllTodos()
                    caches.currentWritingEntity = instance
                    break;
                case "allProjects":
                    caches.currentTabType = "allProjects"
                    caches.currentProject = null
                    caches.currentTodo = null
                    caches.currentWritingEntity = null

            }
        }

        function adjustDisplayToTabType(tabTypeDetermined){
            if (tabTypeDetermined == "todo" || tabTypeDetermined == "project"){
                appendAndActivate(refs.main.ul, refs.main, "insertBefore", refs.main.h1.nextSibling)
                appendAndActivate(refs.aside, refs.body)
                appendAndActivate(refs.main.optionsBtn, refs.main, "insertBefore", refs.main.h1)
            }
            if (tabTypeDetermined == "project") {
                if (caches.lastProjectLiDOMRef) caches.lastProjectLiDOMRef.classList.remove("current-project")
                const currentProjectLi = refs.header.lis.find(element => element.dataset.id === caches.currentProject.id)
                console.log(refs.header.lis)
                currentProjectLi.classList.add("current-project") // current projects li's background is lighter.
                caches.lastProjectLiDOMRef = currentProjectLi
                
                appendAndActivate(refs.main.addBtn, refs.main, "insertBefore", refs.main.ul.nextSibling)
                refs.main.addBtn.textContent = "Add Todo"
            } else if (tabTypeDetermined == "allProjects") {
                appendAndActivate(refs.main.addBtn, refs.main, "insertBefore", refs.main.h1.nextSibling)
                removeAndDeactivate(refs.aside)
                removeAndDeactivate(refs.main.ul)
                removeAndDeactivate(refs.main.optionsBtn)
                refs.main.addBtn.textContent = "Add Project"
                if (caches.lastProjectLiDOMRef){
                    caches.lastProjectLiDOMRef.classList.remove("current-project")
                }
            } else if (tabTypeDetermined == "todo") {
                removeAndDeactivate(refs.main.addBtn)
            }
        }
        return {determineTabType, setTabVars, adjustDisplayToTabType}
    })()

    const eventsController = (function(){
        
        function displayMainFromTarget(tabType, target){
            if (tabType == "project"){
                const project = caches.projectsData.find(item => item.id == target.dataset.id)
                displayMain(project)
            } else if (tabType == "todo"){
                const todo = caches.currentProjectTodosData.find(item => item.id == target.dataset.id)
                displayMain(todo)
            }
        }

        function showAddWritingEntityDialog(type) {
            let types = ["edit project", "add project", "edit todo", "add todo"]
            if (types.includes(type)){
                if (type == types[0]) refs.addWritingEntityDialog.h3.textContent = "Edit Project"
                else if (type == types[1]) refs.addWritingEntityDialog.h3.textContent = "Add Project"
                else if (type == types[2]) refs.addWritingEntityDialog.h3.textContent = "Edit Todo"
                else if (type == types[3]) refs.addWritingEntityDialog.h3.textContent = "Add Todo"
            }
            caches.currentDialogType = type
            refs.addWritingEntityDialog.showModal()

        }

        // Event Listeners

        refs.header.addEventListener("click",(e)=>{
            if (e.target.classList.contains("my-projects-btn")){
                displayMain("allProjects")               
            } else if (e.target.hasAttribute("data-id")){
                displayMainFromTarget("project", e.target)
            } else if (e.target.classList.contains("add-project-btn")){
                console.log("hel")
                showAddWritingEntityDialog("add project")
            }
        })

        refs.main.addEventListener("click",(e)=>{
            const card = e.target.closest(".card")
            if (!card) return
            if (card.hasAttribute("data-id")){
                if (caches.currentTabType == "allProjects"){
                    displayMainFromTarget("project", card)
                } else if (caches.currentTabType == "project") {
                    displayMainFromTarget("todo", card)
                }
            }
        })

        refs.main.addBtn.addEventListener("click", (e) => {
            if (caches.currentTabType == "project") showAddWritingEntityDialog("add todo")
            else showAddWritingEntityDialog("add project")
        })

        refs.main.optionsBtn.addEventListener("click", (e) => {
            refs.optionsDialog.showModal()
        })

        refs.addWritingEntityDialog.form.addEventListener("submit", (e) => {
            e.preventDefault()
            const priorityValue = refs.addWritingEntityDialog.priorityInputs.find(element => element.matches(":checked")).value
            if (caches.currentDialogType == "add project"){
                projectModule.createProject(refs.addWritingEntityDialog.titleInput.value, refs.addWritingEntityDialog.descriptionInput.value, priorityValue, refs.addWritingEntityDialog.dueDateInput.value ,refs.addWritingEntityDialog.notesInput.value)
                displayProjectsNav()
                if (caches.currentTabType == "allProjects") {
                    displayMain("allProjects")
                }
                

            } else if (caches.currentDialogType == "add todo") {
                caches.currentProject.createTodo(refs.addWritingEntityDialog.titleInput.value, refs.addWritingEntityDialog.descriptionInput.value, priorityValue, refs.addWritingEntityDialog.dueDateInput.value ,refs.addWritingEntityDialog.notesInput.value)
                displayMain(caches.currentProject)//????????????????/

            } else if (caches.currentDialogType == "edit project" || caches.currentDialogType == "edit todo"){
                let writingEntity
                if (caches.currentDialogType == "edit project") writingEntity = caches.currentProject
                else writingEntity = caches.currentTodo
                writingEntity.title = refs.addWritingEntityDialog.titleInput.value
                writingEntity.description = refs.addWritingEntityDialog.descriptionInput.value
                writingEntity.priority = priorityValue
                writingEntity.dueDate = refs.addWritingEntityDialog.dueDateInput.value
                writingEntity.notes = refs.addWritingEntityDialog.notesInput.value
                displayMain(writingEntity)//????????????????????
            }
            refs.addWritingEntityDialog.close()
            refs.addWritingEntityDialog.form.reset()
        })

        refs.addWritingEntityDialog.cancelBtn.addEventListener("click", (e) => {
            refs.addWritingEntityDialog.close()     
        })

        refs.optionsDialog.addEventListener("click", (e) => {
            const writingEntity = caches.currentTodo ? caches.currentTodo : caches.currentProject
            // if (e.target.textContent == "Complete"){
            if (e.target === refs.optionsDialog.complete){
                if (e.target.classList.contains("marked")){
                    writingEntity.complete = null
                    e.target.classList.remove("marked")
                } else {
                    writingEntity.complete = true
                    e.target.classList.add("marked")
                }



            } else if (e.target === refs.optionsDialog.pin) {
                if (e.target.classList.contains("marked")){
                    writingEntity.pin = null
                    e.target.classList.remove("marked")
                } else {
                    writingEntity.pin = "regular"
                    e.target.classList.add("marked")
                    refs.optionsDialog.pinByPriority.classList.remove("marked")                      
                }



            } else if (e.target === refs.optionsDialog.pinByPriority) {
                if (e.target.classList.contains("marked")){
                    writingEntity.pin = null
                    e.target.classList.remove("marked")
                } else {
                    writingEntity.pin = "by priority"
                    e.target.classList.add("marked") 
                    refs.optionsDialog.pin.classList.remove("marked")                   
                }

            } else if (e.target === refs.optionsDialog.edit) {
                refs.addWritingEntityDialog.titleInput.value = writingEntity.title
                refs.addWritingEntityDialog.descriptionInput.value = writingEntity.description
                refs.addWritingEntityDialog.notesInput.value = writingEntity.notes
                refs.addWritingEntityDialog.priorityInputs[writingEntity.priority].checked = true
                refs.addWritingEntityDialog.dueDateInput.value = writingEntity.dueDate.date
                if (caches.currentTabType == "project") showAddWritingEntityDialog("edit project")
                else if (caches.currentTabType == "todo") showAddWritingEntityDialog("edit todo")
                refs.optionsDialog.close()
            
            } else if (e.target === refs.optionsDialog.info){
                refs.infoDialog.creationDate.textContent = `Creation Date: ${writingEntity.creationDate}`
                refs.infoDialog.notes.textContent = `Notes: ${writingEntity.notes}`
                refs.infoDialog.showModal()
                refs.optionsDialog.close()
            } else if (e.target === refs.optionsDialog.removeBtn){
                refs.removalDialog.h3.textContent = `Are you sure you want to remove ${writingEntity.title}?`
                refs.removalDialog.showModal()
                refs.optionsDialog.close()
                // if (caches.currentTabType == "project"){
                //     caches.projectsData.splice(0, 1, writingEntity)
                // }
            }
            
        })
    })()

    refs.infoDialog.cancelBtn.addEventListener("click", (e) => {
        refs.infoDialog.close()
    })

    refs.removalDialog.addEventListener("click", (e) => {
        if (e.target === refs.removalDialog.cancelBtn){
            refs.removalDialog.close()
        } else if (e.target === refs.removalDialog.deleteBtn) {
            if (caches.currentTabType == "project"){
                const index = caches.projectsData.findIndex(item => item.id == caches.currentProject.id)
                // caches.projectsData.splice(index, 1)
                caches.currentProject.remove()
                displayProjectsNav()
                displayMain("allProjects")
                console.log(caches.projectsData)
            } else if (caches.currentTabType == "todo"){
                const index = caches.currentProjectTodosData.findIndex(item => item.id == caches.currentTodo.id)
                // caches.currentProjectTodosData.splice(index, 1)
                caches.currentTodo.remove()
                displayMain(caches.currentProject)
            }
            refs.removalDialog.close()
        }
    })

    refs.aside.addEventListener("click", (e) => {
        if (e.target.matches(".options-btn")){
            refs.checkListDialog.showModal()
        }
        if (e.target.matches("button.complete-btn")){
            const checkId = e.target.closest("li").dataset.id
            caches.currentWritingEntity.checkList.find(check => check.id === checkId).completed = true
            displayCheckList(caches.currentTabType)
        }
        if (e.target.matches("button.undo-btn")){
            const checkId = e.target.closest("li").dataset.id
            caches.currentWritingEntity.checkList.find(check => check.id === checkId).completed = false
            displayCheckList(caches.currentTabType)

        }
    })

    refs.checkListDialog.addEventListener("click", (e) => {
        if (e.target.matches("button.cancel-button")){
            refs.checkListDialog.close()
        }
        if (e.target.matches("button.add-to-checklist")){
            refs.addToCheckListDialog.showModal()
        } else if (e.target.matches(".show-completed") ){
            if (e.target.classList.contains("marked")){
                caches.checkListShowCompleted = false
                displayCheckList(caches.currentTabType)
                e.target.classList.remove("marked")

            } else {
                caches.checkListShowCompleted = true
                displayCheckList(caches.currentTabType)
                e.target.classList.add("marked")
            }
        }
    })

    refs.addToCheckListDialog.form.addEventListener("submit", (e) => {
        console.log("dssf")
        e.preventDefault()
        const input = refs.addToCheckListDialog.input.value
        if (input){
            caches.currentWritingEntity.addToCheckList(input)
            displayCheckList(caches.currentTabType)
        }
        refs.addToCheckListDialog.close()
        refs.addToCheckListDialog.form.reset()
        refs.checkListDialog.close()
    })
    return {displayProjectsNav, displayMain,}
}


