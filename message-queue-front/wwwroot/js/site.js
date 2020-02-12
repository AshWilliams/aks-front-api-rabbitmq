// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

//Document is the DOM can be accessed in the console with document.window.
// Tree is from the top, html, body, p etc.

//Problem: User interaction does not provide the correct results.
//Solution: Add interactivity so the user can manage daily tasks.
//Break things down into smaller steps and take each step at a time.
var start = 0;

async function subscribe() {
	let response = await fetch("/?handler=Messages");

	if (response.status == 502) {
		// Status 502 is a connection timeout error,
		// may happen when the connection was pending for too long,
		// and the remote server or a proxy closed it
		// let's reconnect
		await subscribe();
	} else if (response.status != 200) {
		// An error - let's show it
		showMessage(response.statusText);
		// Reconnect in one second
		await new Promise(resolve => setTimeout(resolve, 1000));
		await subscribe();
	} else {
		// Get and show the message
		let message = await response.text();
		showMessage(message);
		// Call subscribe() again to get the next message
		await subscribe();
	}
}

subscribe();

var showMessage = function (messageFromQueue) {
	var messageArray = JSON.parse(messageFromQueue);
	if (messageArray.length > 0 && messageArray.length !== start) {
		incompleteTaskHolder.innerHTML = "";
		for (let i = 0; i < messageArray.length; i++) {
		
			var listItem = createNewTaskElement(messageArray[i].text);

			//Append listItem to incompleteTaskHolder

			incompleteTaskHolder.appendChild(listItem);
			bindTaskEvents(listItem, taskCompleted);
		}
		start = messageArray.length;
	}	
}

//Event handling, uder interaction is what starts the code execution.

var taskInput = document.getElementById("new-task");//Add a new task.
var addButton = document.getElementsByTagName("button")[0];//first button
var incompleteTaskHolder = document.getElementById("incomplete-tasks");//ul of #incomplete-tasks



//New task list item
var createNewTaskElement = function (taskString) {

	var listItem = document.createElement("li");

	//input (checkbox)
	var checkBox = document.createElement("input");//checkbx
	//label
	var label = document.createElement("label");//label

	//button.delete
	var deleteButton = document.createElement("button");//delete button

	label.innerText = taskString;

	//Each elements, needs appending
	checkBox.type = "checkbox";

	deleteButton.innerText = "Delete";
	deleteButton.className = "delete";



	//and appending.
	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(deleteButton);
	return listItem;
}



var addTask = function () {
	console.log("Add Task...");
	//Send the message to the queue

	var xhr = new XMLHttpRequest();
	
	xhr.open('POST', "/?handler=SendMessage");

	xhr.setRequestHeader("XSRF-TOKEN", document.getElementsByName("__RequestVerificationToken")[0].value);
	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onload = function () {
		if (xhr.status === 200) {
			taskInput.value = "";
		}
	};
	xhr.send(JSON.stringify({
		"Text": taskInput.value
	}));	
}


//Delete task.
var deleteTask = function () {
	console.log("Delete Task...");

	var listItem = this.parentNode;
	var ul = listItem.parentNode;
	//Remove the parent list item from the ul.
	ul.removeChild(listItem);

}



var ajaxRequest = function () {
	console.log("AJAX Request");
}

//The glue to hold it all together.
//Mark task completed
var taskCompleted = function () {
	console.log("Complete Task...");

	//Append the task list item to the #completed-tasks
	var listItem = this.parentNode;
	completedTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskIncomplete);

}


var taskIncomplete = function () {
	console.log("Incomplete Task...");
	//Mark task as incomplete.
	//When the checkbox is unchecked
	//Append the task list item to the #incomplete-tasks.
	var listItem = this.parentNode;
	incompleteTaskHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted);
}

//Set the click handler to the addTask function.
//addButton.onclick = addTask;
addButton.addEventListener("click", addTask);
//addButton.addEventListener("click", ajaxRequest);


var bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
	console.log("bind list item events");
	var deleteButton = taskListItem.querySelector("button.delete");
	   	
	//Bind deleteTask to delete button.
	deleteButton.onclick = deleteTask;
	
}

//cycle over incompleteTaskHolder ul list items
//for each list item
for (var i = 0; i < incompleteTaskHolder.children.length; i++) {

	//bind events to list items chldren(tasksCompleted)
	bindTaskEvents(incompleteTaskHolder.children[i], taskCompleted);
}

