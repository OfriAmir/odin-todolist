import { format } from "date-fns"
import { writingEntity as writingEntityModule } from "./writing-entity.js"
// This application uses class "active" to determine whether a DOM object is visible or not. This method makes it very easy to tweak the logic, by using DevTools.
// The right method is to store this informatiion in internal variables inside the script, but I didn't think about it at first.
// So as long as I don't fix this, just know that this is a major risk and that this app isn't ready to use.
// Also, you should generally store the logic on a server so that it will be even harder to access it.



export const displayControllerWithModule = function(projectModule){
    const projectsData = projectModule.getAllProjects()
    const defaultPriorityOptions = ["Unspecified", "Very Low", "Low", "Medium", "High", "Very High"]
    let currentProjectTodosData
    let currentProject
    let currentTodo
    let currentTabType
    let currentDialogType
    const refs = {
        body: document.querySelector("body"),
        header: document.querySelector("header"),
        main: document.querySelector("main"),
        aside: document.querySelector("aside"),
        addWritingEntityDialog: document.querySelector("dialog.add-writing-entity-dialog"),
        optionsDialog: document.querySelector("dialog.options-dialog")
    }
    refs.header.ol = document.querySelector("header nav>ol")
    refs.header.lis = []
    refs.header.myProjectsBtn = document.querySelector("header .my-projects-btn")
    refs.header.addPro

    // refs.main.titleDiv = document.querySelector("main>div.title")
    refs.main.optionsBtn = document.querySelector("main>button.options-btn")
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

    refs.addWritingEntityDialog.form = refs.addWritingEntityDialog.querySelector("form")
    refs.addWritingEntityDialog.h3 = refs.addWritingEntityDialog.querySelector("h3")
    refs.addWritingEntityDialog.titleInput = refs.addWritingEntityDialog.querySelector("input[id=title]")
    refs.addWritingEntityDialog.descriptionInput = refs.addWritingEntityDialog.querySelector("textarea[id=description]")
    refs.addWritingEntityDialog.priorityInputs = [...refs.addWritingEntityDialog.querySelectorAll("fieldset>input[type=radio]")]
    refs.addWritingEntityDialog.dueDateInput = refs.addWritingEntityDialog.querySelector("input[id=due-date]")
    refs.addWritingEntityDialog.notesInput = refs.addWritingEntityDialog.querySelector("textarea[id=notes]")
    refs.addWritingEntityDialog.submitBtn = refs.addWritingEntityDialog.querySelector("button[type=submit]")
    refs.addWritingEntityDialog.cancelBtn = refs.addWritingEntityDialog.querySelector("button[type=button]")

    refs.optionsDialog.pinBtn = refs.optionsDialog.querySelector("button.pinBtn")
    refs.optionsDialog.pinByPriorityBtn = refs.optionsDialog.querySelector("button.pinByPriorityBtn")

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
        displayCheckList(tabType)
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
            const description = data.description ? data.description : ""
            const priority =  data.priority !== 0 ? defaultPriorityOptions[data.priority] : ""
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
            const description = card.description ? card.description : ""
            const priority =  card.priority !== 0 ? defaultPriorityOptions[card.priority] : ""
            const dueDate = card.dueDate.formattedDate ? card.dueDate.formattedDate : ""
            const contents = [description, priority, dueDate]
            div.lis.forEach((li, index) => {
                li.textContent = `${names[index]}: ${contents[index]}`
            })
        })
        removeAndDeactivateSuperfluous(refs.main.divs, formerActive.main.divs, currentActive.main.divs, dataArr.length)
    }

    function displayCheckList(tabTypeDetermined){
        let dataArr = []
        if (tabTypeDetermined == "project"){
            dataArr = currentProject.checkList
        } else if (tabTypeDetermined == "allProjects") {
             //No checkList in this tab, skip loop.
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

    // CheckList should be an array of {content, complete} objects.
    let lastProjectLiDOMRef 
    // let editing // True when addWritingEntityDialog is shown to edit an existing entity rather than adding one
    const eventsController = (function(){
        
        function displayMainFromTarget(tabType, target){
            // if (tabType == "allProjects") {
            //     displayMain("allProjects")
            // } else
            if (tabType == "project"){
                const project = projectsData.find(item => item.id == target.dataset.id)
                displayMain(project)

                //mainly for making the current project's tab have a different color.
                // if (lastProjectLiDOMRef && lastProjectLiDOMRef !== target) {
                //     lastProjectLiDOMRef.classList.remove("current-project")
                // }
                // target.classList.add("current-project")
                // lastProjectLiDOMRef = target

            } else if (tabType == "todo"){
                const todo = currentProjectTodosData.find(item => item.id == target.dataset.id)
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
            currentDialogType = type
            // function setTypeVar(typeStr) {
            //     currentDialogType = typeStr
            // }
            // if (tabType == "project"){
            //     if (editing) {
            //         refs.addWritingEntityDialog.h3.textContent = "Edit Project"
            //         setTypeVar("edit project")
            //     } else {
            //         refs.addWritingEntityDialog.h3.textContent = "Add Project"
            //         setTypeVar("add project")
            //     }
            // } else if (tabType == "todo"){
            //     if (editing) {
            //         refs.addWritingEntityDialog.h3.textContent = "Edit Todo"
            //         setTypeVar("edit todo")
            //     } else {
            //         refs.addWritingEntityDialog.h3.textContent = "Add Todo"
            //         setTypeVar("add todo")
            //     }
            // }
            refs.addWritingEntityDialog.showModal()

        }
        refs.header.addEventListener("click",(e)=>{
            if (e.target.classList.contains("my-projects-btn")){
                // displayMain("allProjects")
                // currentProject = null
                // currentTodo = null
                displayMain("allProjects")
                
            } else if (e.target.hasAttribute("data-id")){
                // const project = projectsData.find(item => item.id == e.target.dataset.id)
                // displayMain(project)
                // if (lastProjectLiDOMRef && lastProjectLiDOMRef !== e.target) {
                //     lastProjectLiDOMRef.classList.remove("current-project")
                // }
                // e.target.classList.add("current-project")
                // lastProjectLiDOMRef = e.target
                displayMainFromTarget("project", e.target)
            } else if (e.target.classList.contains("add-project-btn")){
                showAddWritingEntityDialog("add project")
            }
        })
        refs.main.addEventListener("click",(e)=>{
            const card = e.target.closest(".card")
            if (!card) return
            if (card.hasAttribute("data-id")){
                if (currentTabType == "allProjects"){
                    // const project = projectsData.find(item => item.id == card.dataset.id)
                    // displayMain(project)
                    displayMainFromTarget("project", card)

                } else if (currentTabType == "project") {
                    // const todo = currentProjectTodosData.find(item => item.id == card.dataset.id)
                    // displayMain(todo)
                    displayMainFromTarget("todo", card)
                }
            }
        })
        refs.main.addBtn.addEventListener("click", (e) => {
            if (currentTabType == "project") showAddWritingEntityDialog("add todo")
            else showAddWritingEntityDialog("add project")
        })

        refs.main.optionsBtn.addEventListener("click", (e) => {
            refs.optionsDialog.showModal()
        })
        refs.addWritingEntityDialog.form.addEventListener("submit", (e) => {
            e.preventDefault
            const priorityValue = refs.addWritingEntityDialog.priorityInputs.find(element => element.matches(":checked")).value
            console.log(priorityValue)
            if (currentDialogType == "add project"){
                projectModule.createProject(refs.addWritingEntityDialog.titleInput.value, refs.addWritingEntityDialog.descriptionInput.value, priorityValue, refs.addWritingEntityDialog.dueDateInput.value ,refs.addWritingEntityDialog.notesInput.value)
                displayProjectsNav()
                if (currentTabType == "allProjects") {
                    displayMain("allProjects")
                }
                console.log(projectsData)
                

            } else if (currentDialogType == "add todo") {
                currentProject.createTodo(refs.addWritingEntityDialog.titleInput.value, refs.addWritingEntityDialog.descriptionInput.value, priorityValue, refs.addWritingEntityDialog.dueDateInput.value ,refs.addWritingEntityDialog.notesInput.value)
                displayMain(currentProject)//????????????????/

            } else if (currentDialogType == "edit project" || currentDialogType == "edit todo"){
                let writingEntity
                if (currentDialogType == "edit project") writingEntity = currentProject
                else writingEntity = currentTodo
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
            const writingEntity = currentTodo ? currentTodo : currentProject
            // if (currentTodo){
            //     const writingEntity = currentTodo
            // } else {
            //     const writingEntity = currentProject
            // }
            if (e.target.textContent == "Complete"){
                if (e.target.classList.contains("marked")){
                    writingEntity.complete = null
                    e.target.classList.remove("marked")
                } else {
                    writingEntity.complete = true
                    e.target.classList.add("marked")
                }



            } else if (e.target.textContent == "Pin") {
                if (e.target.classList.contains("marked")){
                    writingEntity.pin = null
                    e.target.classList.remove("marked")
                } else {
                    writingEntity.pin = "regular"
                    e.target.classList.add("marked")
                    refs.optionsDialog.pinByPriorityBtn.classList.remove("marked")                      
                }



            } else if (e.target.textContent == "Pin by priority") {
                if (e.target.classList.contains("marked")){
                    writingEntity.pin = null
                    e.target.classList.remove("marked")
                } else {
                    writingEntity.pin = "by priority"
                    e.target.classList.add("marked") 
                    refs.optionsDialog.pinBtn.classList.remove("marked")                   
                }

            } else if (e.target.textContent == "Edit") {
                    // editing = true
                    // if (currentTodo){
                    //     refs.addWritingEntityDialog.h3.textContent = "Edit Todo"
                        
                    // } 
                    // else refs.addWritingEntityDialog.h3.textContent = "Edit Project"
                    refs.addWritingEntityDialog.titleInput.value = writingEntity.title
                    refs.addWritingEntityDialog.descriptionInput.value = writingEntity.description
                    refs.addWritingEntityDialog.notesInput.value = writingEntity.notes
                    
                    for (let ref of refs.addWritingEntityDialog.priorityInputs) {

                    }
                    // Add selected radio button here
                    refs.addWritingEntityDialog.dueDateInput.value = writingEntity.dueDate.date
                    if (currentTabType == "project") showAddWritingEntityDialog("edit project")
                    else if (currentTabType == "todo") showAddWritingEntityDialog("edit todo")
                    // editing = false
                }
            refs.optionsDialog.close()
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
                    currentTabType = "todo"
                    currentTodo = instance
                    break;
                case "project":
                    currentTabType = "project"
                    currentTodo = null
                    currentProject = instance
                    currentProjectTodosData = instance.getAllTodos()
                    break;
                case "allProjects":
                    currentTabType = "allProjects"
                    currentProject = null
                    currentTodo = null
            }
        }

        function adjustDisplayToTabType(tabTypeDetermined){
            if (tabTypeDetermined == "todo" || tabTypeDetermined == "project"){
                appendAndActivate(refs.main.ul, refs.main, "insertBefore", refs.main.h1.nextSibling)
                appendAndActivate(refs.aside, refs.body)
                appendAndActivate(refs.main.optionsBtn, refs.main, "insertBefore", refs.main.h1)
            }
            if (tabTypeDetermined == "project") {
                if (lastProjectLiDOMRef) lastProjectLiDOMRef.classList.remove("current-project")
                const currentProjectLi = refs.header.lis.find(element => element.dataset.id === currentProject.id)
                currentProjectLi.classList.add("current-project")
                lastProjectLiDOMRef = currentProjectLi
                appendAndActivate(refs.main.addBtn, refs.main, "insertBefore", refs.main.ul.nextSibling)
                refs.main.addBtn.textContent = "Add Todo"
            } else if (tabTypeDetermined == "allProjects") {
                appendAndActivate(refs.main.addBtn, refs.main, "insertBefore", refs.main.h1.nextSibling)
                removeAndDeactivate(refs.aside)
                removeAndDeactivate(refs.main.ul)
                removeAndDeactivate(refs.main.optionsBtn)
                refs.main.addBtn.textContent = "Add Project"
                if (lastProjectLiDOMRef){
                    lastProjectLiDOMRef.classList.remove("current-project")
                }
            } else if (tabTypeDetermined == "todo") {
                removeAndDeactivate(refs.main.addBtn)
            }
        }
        return {determineTabType, setTabVars, adjustDisplayToTabType}
    })()
    return {displayProjectsNav, displayMain,}
}


