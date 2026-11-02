import {format} from "date-fns"

export const displayControllerWithModule = function(projectModule){
    const refs = {
        header: {
            header: document.querySelector("header"), //Not sure I'll use it but for completeness I added it...
            ol: document.querySelector("header nav>ol"),
            lis: [],
            myProjectsBtn: document.querySelector(".my-projects-btn"),
        },

        main: {
            main: document.querySelector("main"),
            h1: document.querySelector("main>h1"),
            // ul: document.querySelector("main>ul"),
            // lis: document.querySelectorAll("main>ul>li"),
            // divs: document.querySelectorAll("main>div"),
        },

        aside: {
            aside: document.querySelector("aside"),
            h2: document.querySelector("aside>h2"),
            // ul: document.querySelector("aside>ul"),
        }

    }

    function displayProjectsNav(){
        const projectsDataArr = projectModule.getAllProjects() 
        projectsDataArr.forEach((project, index)=> {
            let ref
            if (index < refs.header.lis.length - 1) ref = refs.header.lis[index]
            else {
                ref = document.createElement("li")
                refs.header.lis.push(ref)
            } 
            ref.textContent = `${project.title}`
            ref.dataset.id = project.id
            refs.header.ol.appendChild(ref)
        });
    }
    //added to refs
    
    function displayMain(instance) {
        // refs.header.h1.textContent = instance.title
        // const lisDataArr = [instance.description, instance.priority.name, format(instance.dueDate,"HH:mm MMMM do, y")]
        // refs.header.lis.forEach((element,index) => {
        //     element.textContent = `${lisDataArr[index]}`
        // })
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
            const ul = document.createElement("ul")
            refs.main.main.appendChild(ul)
            const lis = []
            for (let i=0; i<3; i++){
                lis.push(document.createElement("li"))
            }
            const names = ["Description", "Priority", "Due Date"]
            const content = [instance.description, instance.priority.name, instance.dueDate.formattedDate]
            lis.forEach((li, index) => {
                li.textContent = `${names[index]}: ${content[index]}`
                ul.appendChild(li)
            })
        } else {
            refs.main.h1.textContent = "My Projects"
        }
    }

    function displayCards(dataArr){
        dataArr.forEach(instance => {
            const div = document.createElement("div")
            div.classList.toggle("card")
            div.dataset.id = instance.id
            refs.main.main.appendChild(div)
            const h2 = document.createElement("h2")
            h2.textContent = instance.title
            div.appendChild(h2)
            const ul = document.createElement("ul")
            div.appendChild(ul)
            const lis = []
            for (let i=0; i<3; i++){
                lis.push(document.createElement("li"))
            }
            const names = ["Description", "Priority", "Due Date"]
            const content = [instance.description, instance.priority.name, instance.dueDate.formattedDate]
            lis.forEach((li, index) => {
                li.textContent = `${names[index]}: ${content[index]}`
                ul.appendChild(li)
            })
        })
    }

    function displayChecklist(instance){
        if (!instance.checklist) return
        const ul = document.createElement("ul")
        refs.aside.aside.appendChild(ul)
        instance.checklist.forEach(item => {
            const li = document.createElement("li")
            li.textContent = item.content
            ul.appendChild(li)
        })
    }
    // Checklist should be an array of {content, complete} objects.

    function clearMain(){
        const content = document.querySelectorAll("main *:not(h1)")
        content.forEach((element) => refs.main.main.removeChild(element))
    }

    function clearAside(){
        const content = document.querySelectorAll("aside *:not(h2)")
        content.forEach((element) => refs.aside.aside.removeChild(element))       
    }

    return {displayProjectsNav, displayMain, clearMain, clearMain}
}
