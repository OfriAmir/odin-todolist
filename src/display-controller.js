import { format } from "date-fns"

export const displayControllerWithModule = function(projectModule){
    const projectsData = projectModule.getAllProjects()
    let currentProjectTodosData
    let currentProject
    let currentTodo
    const refs = {
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
    refs.main.divs = []
    refs.aside.h2 = document.querySelector("aside>h2")
    refs.aside.ul = document.querySelector("aside>ul")
    refs.aside.lis = []

    let currentActive = {
        header: {
            lis: 0
        },
        main: {
            divs: 0
        },
        aside: {
            lis: 0
        },
    }

    let formerActive = {
        header: {
            lis: 0
        },
        main: {
            divs: 0
        },
        aside: {
            lis: 0
        },
    }

    // let currentActiveHeaderLis
    // let formerActiveHeaderLis = 0
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
            // refs.header.ol.appendChild(li)
            // li.classList.add("active")
        });
        currentActive.header.lis = projectsData.length
        if (formerActive.header.lis > currentActive.header.lis){
            for (let i=currentActive.header.lis; i < formerActive.header.lis; i++){
                refs.main.divs[i].remove()
                refs.main.divs[i].classList.remove("active")
            }
        }
        formerActive.header.lis = currentActive.header.lis
    }

    
    function displayMain(instance) {
        if (instance){
            if (instance.hasOwnProperty("getAllTodos")){
                displayMainTitleAndInfo(instance)
                currentProjectTodosData = instance.getAllTodos()
                displayCards(currentProjectTodosData)
            } else {
                displayMainTitleAndInfo(instance)
            }
            displayChecklist(instance)
        } else { //display All projects
            displayMainTitleAndInfo()
            displayCards(projectsData)
        }
        
    }

    function displayMainTitleAndInfo(instance) {
        if (instance){
            refs.main.h1.textContent = instance.title
            if (!refs.main.ul.classList.contains("active")){
                refs.main.ul.classList.add("active")
                // if (refs.main.divs[0] && refs.main.divs[0].classList.contains("active")){
                //     refs.main.insert
                // }
                refs.main.insertBefore(refs.main.ul, refs.main.h1.nextSibling)
            }
            const names = ["Description", "Priority", "Due Date"]
            const content = [instance.description, instance.priority.name, instance.dueDate.formattedDate]
            refs.main.lis.forEach((li, index) => {
                li.textContent = `${names[index]}: ${content[index]}`
                li.classList.add("active")
            })
        } else {
            if (refs.main.ul.classList.contains("active")){
                refs.main.ul.classList.remove("active")
                refs.main.ul.remove()
            }
            refs.main.h1.textContent = "My Projects"
        }
    }

    // let currentActiveCards
    // let formerActiveCards = 0
    function displayCards(dataArr=[]){
        dataArr.forEach((instance, index) => {
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
            div.dataset.id = instance.id
            div.h2.textContent = instance.title
            if (!div.classList.contains("active")){
                refs.main.appendChild(div)
                div.classList.add("active")
            }
            const names = ["Description", "Priority", "Due Date"]
            const content = [instance.description, instance.priority.name, instance.dueDate.formattedDate]
            div.lis.forEach((li, index) => {
                li.textContent = `${names[index]}: ${content[index]}`
            })
        })
        currentActive.main.divs = dataArr.length
        if (formerActive.main.divs > currentActive.main.divs){
            for (let i=currentActive.main.divs; i < formerActive.main.divs; i++){
                refs.main.divs[i].remove()
                refs.main.divs[i].classList.remove("active")
            }
        }
        formerActive.main.divs = currentActive.main.divs
    }
    //added to refs

    function displayChecklist(instance){
        if (!instance.checklist) return
        instance.checklist.forEach((item, index) => {
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
        currentActive.aside.lis = instance.checklist.length
        if (formerActive.aside.lis > currentActive.aside.lis){
            for (let i=currentActive.aside.lis; i<formerActive.aside.lis; i++){
                refs.aside.lis[i].remove()
                refs.aside.lis[i].classList.remove("active")
            }
        }
        formerActive.aside.lis = currentActive.aside.lis
    }
    // Checklist should be an array of {content, complete} objects.


    function clearMain(){
        const content = document.querySelectorAll("main .active")
        content.forEach((element) => {
            element.classList.remove("active")
            element.remove()
        })
    }

    function clearAside(){
        const content = document.querySelectorAll("aside .active")
        content.forEach((element) => {
            element.classList.remove("active")
            element.remove()
        })
    }

    const eventsController = (function(){
        refs.header.addEventListener("click",(e)=>{
            if (e.target.classList.contains("my-projects-btn")){
                displayMain()
                currentProject = null
                currentTodo = null
            } else if (e.target.hasAttribute("data-id")){
                currentProject = projectsData.find(item => item.id == e.target.dataset.id)
                displayMain(currentProject)
            }
        })
        refs.main.addEventListener("click",(e)=>{
            if (e.target.hasAttribute("data-id")){
                if (refs.main.h1.textContent == "My Projects"){
                    currentProject = projectsData.find(item => item.id == e.target.dataset.id)
                    displayMain(currentProject)
                } else {
                    currentTodo = currentProjectTodosData.find(item => item.id == e.target.dataset.id)
                    displayMain(currentTodo)
                }
            }
        })
    })()
    // To fix: 
    // 1. when clicking on divs, it only launches the event when I click out of other children elements... 
    // 2. make a "removeSuperfluous()" to reduce code doubling
    return {displayProjectsNav, displayMain, clearMain, clearAside}
}


