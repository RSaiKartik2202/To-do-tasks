//CRUD(Create, Read, Update, Delete) operations using DOM
document.addEventListener("DOMContentLoaded",()=>{
    //accessing the elemnt
    const taskInput=document.getElementById("new-task");
    //the attribute 'value' stores whatever is written in the input
    //taskInput.value="Hi";
    const addTaskButton=document.getElementById("add-task-button");
    //EventListener to add the element
    addTaskButton.addEventListener("click",()=>{
        let taskText=taskInput.value.trim();
        //the trim() removes the whitespaces before and after the text if any

        //now add guard clause -->if else statement
        if(taskText!=="") {
            addTask(taskText);
            taskInput.value="";
        }
        //console.log(taskText);
    });
    const apiUrl="https://jsonplaceholder.typicode.com/todos";
    const taskList=document.getElementById("task-list");
    //this is the URL of the external API

    //function to add that element
    function addTask(taskText){
        //create the task in an object format
        const newTask={title:taskText,completed:false};
        //this object is created to ensure that the data is in the format
        //same as that of the data in database

        //this task has to be added to the database
        //database -- array of objects(JSON data)
        //Common methods:  GET (retrieve data), POST (send data),
        //PUT (update data), and DELETE (remove data), PATCH -- partially
        //update data
        fetch(apiUrl,{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            //we have to send the newTask in JSON format
            //JSON.stringify --> converts a JavaScript value
            //into JSON string.
            body:JSON.stringify(newTask)
        }).then((response)=>
            {
                return response.json();
            }).then((data)=>{
                //console.log(data);
                displayTask(data.title,data.id);
            }).catch((error)=>{
                console.error("Failed during task",error);
            });
        //fetch is used to pull the data from the database
        //and after updating the database we will fetch it
        //to display on todo app
        //we do these using external API
        function displayTask(title,id_no){
            const li=document.createElement("li");
            li.setAttribute("data-id",id_no);
            const span=document.createElement("span");
            span.textContent=title;
            const editBtn=document.createElement("button");
            editBtn.textContent="Edit";
            editBtn.className='edit-btn';
            editBtn.addEventListener("click",()=>{
                editTask(id_no,span);
            });

            const deleteBtn=document.createElement("button");
            deleteBtn.textContent="Delete";
            deleteBtn.setAttribute("class","delete-btn");
            deleteBtn.addEventListener("click",()=>{
                deleteTask(id_no,li);
            });
            li.appendChild(span);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        }

        function editTask(id_no,span){
            const newText=prompt("Edit Task",span.textContent);
            if(newText!==null && newText!==""){
                const updateTask={title:newText,completed:false};
                fetch(`${apiUrl}/${id_no}`,{
                    method:"PATCH",
                    headers:{
                        "Content-type":"application/json"
                    },
                    body:JSON.stringify(updateTask)
                }).then((response)=>{
                    //console.log(response);
                    if(response.ok===false){
                        throw new Error("Failed to edit");
                    }
                    return response.json();
                }).then(()=>{
                    span.textContent=newText;
                }).catch((error)=>{
                    console.error("Error in editing task",error);
                });
                //helps in fetching data with the given id only
            }
        }
        function deleteTask(id_no,li){
            fetch(`${apiUrl}/${id_no}`,{
                method:"DELETE"
            }).then((response)=>{
                // console.log(response)
                if(response.ok===true){
                    taskList.removeChild(li);
                }
                else{
                    throw new Error("Failed to delete task");
                }
            }).catch((error)=>{
                console.error("Error in deleting task",error);
            });
        }
    }
});
//ensures that the script runs only after all the HTML elements are rendered
//but before all images and style sheets are loaded