import { format } from "date-fns"

export const displayControllerWithModule = function(projectModule){
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
    refs.main.lis = document.querySelectorAll("main>ul>li")
    refs.main.divs = []
    refs.aside.h2 = document.querySelector("aside>h2")
    refs.aside.ul = document.querySelector("aside>ul")
    refs.aside.lis = []
    function displayProjectsNav(){
        const projectsDataArr = projectModule.getAllProjects() 
        projectsDataArr.forEach((project, index)=> {
            let li
            if (index < refs.header.lis.length - 1) li = refs.header.lis[index]
            else {
                li = document.createElement("li")
                refs.header.lis.push(li)
            } 
            li.textContent = `${project.title}`
            li.dataset.id = project.id
            refs.header.ol.appendChild(li)
            li.classList.add("active")
        });
    }

    
    function displayMain(instance) {
        if (instance){
            if (instance.hasOwnProperty("getAllTodos")){
                displayMainTitleAndInfo(instance)
                const todosData = instance.getAllTodos()
                displayCards(todosData)
            } else {
                displayMainTitleAndInfo(instance)
            }
            displayChecklist(instance)
        } else { //display All projects
            displayMainTitleAndInfo()
            const projectsData = projectModule.getAllProjects()
            displayCards(projectsData)
        }
        
    }

    function displayMainTitleAndInfo(instance) {
        if (instance){
            refs.main.h1.textContent = instance.title
            refs.main.ul.classList.add("active")
            const names = ["Description", "Priority", "Due Date"]
            const content = [instance.description, instance.priority.name, instance.dueDate.formattedDate]
            refs.main.lis.forEach((li, index) => {
                li.textContent = `${names[index]}: ${content[index]}`
                li.classList.add("active")
            })
        } else {
            refs.main.h1.textContent = "My Projects"
        }
    }

    function displayCards(dataArr){
        dataArr.forEach((instance, index) => {
            let div
            if (index < refs.main.divs.length - 1) {
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
                refs.main.appendChild(div)
            } 
            div.dataset.id = instance.id
            div.h2.textContent = instance.title
            div.classList.add("active")
            const names = ["Description", "Priority", "Due Date"]
            const content = [instance.description, instance.priority.name, instance.dueDate.formattedDate]
            div.lis.forEach((li, index) => {
                li.textContent = `${names[index]}: ${content[index]}`
            })
        })
    }
    //added to refs

    function displayChecklist(instance){
        if (!instance.checklist) return
        instance.checklist.forEach((item, index) => {
            let li
            if (index < refs.aside.lis.length - 1) {
                li = refs.aside.lis[index]
            } else {
                li = document.createElement("li")
                refs.aside.lis.push(li)
                refs.aside.ul.appendChild(li)
            }
            li.textContent = item.content
            li.classList.add("active")
            
        })
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

    return {displayProjectsNav, displayMain, clearMain, clearAside}
}
