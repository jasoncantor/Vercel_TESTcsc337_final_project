/* 
Names: Connor O'Neill, Jace Sullivan, Jason Cantor
The main javscript for the front end of the server
Gets the various elements and updates the webpage accordingly
Handles creating elements, users, logging out, the help page
*/
document.addEventListener('DOMContentLoaded', () => {
  let username = null; 
    
  //DOM elements
  const loginScreen = document.getElementById('login-screen');
  const dashboard = document.getElementById('dashboard');
  const usernameDisplay = document.getElementById('usernameDisplay');
  const logoutBtn = document.getElementById('logoutBtn');
  const navButtons = document.querySelectorAll('.nav-btn');
    
  const contentSections = document.querySelectorAll('.content-section');
    
  const loginBtn = document.getElementById('loginBtn');
  loginBtn.addEventListener('click', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
  navButtons.forEach((btn) => {
    btn.addEventListener('click', handleNavigation);
  });

  const createUserBtn = document.getElementById('createUserBtn');
  createUserBtn.addEventListener('click', handleCreateUser);

  //logs in a user by sending the information to the backend
  async function handleLogin() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const enteredUsername = usernameInput.value.trim();
    const enteredPassword = passwordInput.value.trim();
    
    if (!enteredUsername || !enteredPassword) {
      alert('Please enter a username and password');
      return;
    }
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: enteredUsername, password: enteredPassword }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      username = data.username;
      usernameDisplay.textContent = username;
      showScreen('dashboard');
      showSection('job-board');
      loadJobBoard(); 
    } catch (error) {
      console.error(error);
      alert('An error occurred during login.');
    }
  }

  //creates a user by verifying the information and storing it in the backend
  async function handleCreateUser() {
    const newUsernameInput = document.getElementById('newUsername');
    const newPasswordInput = document.getElementById('newPassword');
    const newUsername = newUsernameInput.value.trim();
    const newPassword = newPasswordInput.value.trim();

    if (!newUsername || !newPassword) {
      alert('Please enter a username and password');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });
      if (!response.ok) {
        throw new Error('User creation failed');
      }
      const data = await response.json();
      alert('User created successfully');
      newUsernameInput.value = '';
      newPasswordInput.value = '';
    } catch (error) {
      console.error(error);
      alert('An error occurred during user creation.');
    }
  }
    
  //logs a user out of their account
  async function handleLogout() {
    try {
      const response = await fetch('https://cantor-oneill-sullivan-csc337-final.vercel.app/api/logout', {
        method: 'POST',
      });
      if (response.ok) {
        username = null;
        showScreen('login-screen');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during logout.');
    }
  }
    
  //handles when a tab of the webpage is selected
  function handleNavigation(event) {
    const target = event.target.getAttribute('data-target');
    showSection(target);
  
    switch (target) {
      case 'job-board':
        loadJobBoard();
        break;
      case 'special-tasks':
        loadSpecialTasks();
        break;
      case 'budget-tracker':
        loadBudgetTracker();
        break;
      case 'equipment-tracker':
        loadEquipmentTracker();
        break;
      case 'messaging':
        loadMessages();
        break;
      case 'help':
        showSection('help');
        break;
      default:
        break;
    }
  }
    
  //displays the desired screen that the user selects
  function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach((screen) => {
      screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
  }
    
  //displays the desired tab that the user selects
  function showSection(sectionId) {
    contentSections.forEach((section) => {
      section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
  }

  // Job Board Functions
  async function loadJobBoard() {
    const tasksTbody = document.getElementById('tasks-tbody');
    tasksTbody.innerHTML = '<tr><td colspan="5">Loading tasks...</td></tr>';
    
    try {
      const response = await fetch(`https://cantor-oneill-sullivan-csc337-final.vercel.app/api/tasks?username=${encodeURIComponent(username)}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasks = await response.json();
    
      tasksTbody.innerHTML = ''; 
    
      tasks.forEach((task) => {
        const row = document.createElement('tr');
  
        // Activity
        const activityCell = document.createElement('td');
        activityCell.textContent = task.activity;
        row.appendChild(activityCell);
  
        // Area
        const areaCell = document.createElement('td');
        areaCell.textContent = task.area;
        row.appendChild(areaCell);
  
        // Assigned To
        const assignedCell = document.createElement('td');
        assignedCell.textContent = task.assignedTo ? task.assignedTo : 'Unassigned';
        row.appendChild(assignedCell);
  
        // Status
        const statusCell = document.createElement('td');
        statusCell.textContent = task.completed ? 'Completed' : 'Pending';
        row.appendChild(statusCell);
  
        // Action
        const actionCell = document.createElement('td');
  
        if (!task.completed) {
          // Complete Button
          const completeBtn = document.createElement('button');
          completeBtn.textContent = 'Complete';
          completeBtn.dataset.id = task._id;
          completeBtn.classList.add('completeBtn');
          completeBtn.addEventListener('click', completeTask);
          actionCell.appendChild(completeBtn);
        }
        
        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.id = task._id;
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.addEventListener('click', deleteTask);
        actionCell.appendChild(deleteBtn);

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.dataset.id = task._id;
        editBtn.classList.add('editBtn');
        editBtn.addEventListener('click', editTask);
        actionCell.appendChild(editBtn);
  
        row.appendChild(actionCell);
    
        tasksTbody.appendChild(row);
      });
    } catch (error) {
      console.error(error);
      tasksTbody.innerHTML = '<tr><td colspan="5">An error occurred while loading tasks.</td></tr>';
    }
    //button to create a task
    const createTaskBtn = document.getElementById('createTaskBtn');
    createTaskBtn.removeEventListener('click', createTask);
    createTaskBtn.addEventListener('click', createTask);
  }
    
  //creates a task with the given information
  async function createTask() {
    const activity = document.getElementById('activity').value;
    const area = document.getElementById('area').value;
    const assignedTo = document.getElementById('assignedTo').value;
    const notes = document.getElementById('notes').value;
    
    if (!activity || !area) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      const response = await fetch('https://cantor-oneill-sullivan-csc337-final.vercel.app/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity, area, notes, assignedTo, username }),
      });
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      loadJobBoard();
      // Clear form fields
      document.getElementById('activity').value = '';
      document.getElementById('area').value = '';
      document.getElementById('assignedTo').value = '';
      document.getElementById('notes').value = '';
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the task.');
    }
  }
    
  //marks a task as completed
  async function completeTask(event) {
    const taskId = event.target.getAttribute('data-id');
    
    try {
      const response = await fetch(`https://cantor-oneill-sullivan-csc337-final.vercel.app/api/task/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true, username }),
      });
      if (!response.ok) {
        throw new Error('Failed to complete task');
      }
      loadJobBoard();
    } catch (error) {
      console.error(error);
      alert('An error occurred while completing the task.');
    }
  }

  // deletes a given task
  async function deleteTask(event) {
    const taskId = event.target.getAttribute('data-id');
  
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
  
    try {
      const response = await fetch(`https://cantor-oneill-sullivan-csc337-final.vercel.app/api/task/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      loadJobBoard();
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the task.');
    }
  }

  // edits the information for a task
  async function editTask(event) {
    const taskId = event.target.getAttribute('data-id');
    const newActivity = prompt('Enter new activity:');
    const newArea = prompt('Enter new area:');
    const newAssignedTo = prompt('Enter new assigned to:');
    const newNotes = prompt('Enter new notes:');

    if (!newActivity || !newArea) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch(`https://cantor-oneill-sullivan-csc337-final.vercel.app/api/task/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity: newActivity, area: newArea, assignedTo: newAssignedTo, notes: newNotes, username }),
      });
      if (!response.ok) {
        throw new Error('Failed to edit task');
      }
      loadJobBoard();
    } catch (error) {
      console.error(error);
      alert('An error occurred while editing the task.');
    }
  }

  // Special Task Tracker Functions
  async function loadSpecialTasks() {
    const specialTasksTbody = document.getElementById('special-tasks-tbody');
    specialTasksTbody.innerHTML = '<tr><td colspan="5">Loading special tasks...</td></tr>';
    
    try {
      const response = await fetch(`https://cantor-oneill-sullivan-csc337-final.vercel.app/api/special-tasks?username=${encodeURIComponent(username)}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch special tasks');
      }
      const specialTasks = await response.json();
    
      specialTasksTbody.innerHTML = ''; 
    
      specialTasks.forEach((task) => {
        const row = document.createElement('tr');
  
        // Name
        const nameCell = document.createElement('td');
        nameCell.textContent = task.name;
        row.appendChild(nameCell);
  
        // Target Area
        const areaCell = document.createElement('td');
        areaCell.textContent = task.targetArea;
        row.appendChild(areaCell);
  
        // Notes
        const notesCell = document.createElement('td');
        notesCell.textContent = task.notes;
        row.appendChild(notesCell);
  
        // Date
        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(task.applicationDate).toLocaleDateString();
        row.appendChild(dateCell);
  
        // Delete Button
        const actionCell = document.createElement('td');
  
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.id = task._id;
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.addEventListener('click', deleteSpecialTask);
        actionCell.appendChild(deleteBtn);
  
        row.appendChild(actionCell);
    
        specialTasksTbody.appendChild(row);
      });
    } catch (error) {
      console.error(error);
      specialTasksTbody.innerHTML = '<tr><td colspan="5">An error occurred while loading special tasks.</td></tr>';
    }
    
    const createSpecialTaskBtn = document.getElementById('createSpecialTaskBtn');
    createSpecialTaskBtn.removeEventListener('click', createSpecialTask);
    createSpecialTaskBtn.addEventListener('click', createSpecialTask);
  }
  
  //function to create a special task
  async function createSpecialTask() {
    const name = document.getElementById('specialName').value;
    const targetArea = document.getElementById('specialArea').value;
    const notes = document.getElementById('specialNotes').value;
    
    if (!name || !targetArea) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      const response = await fetch('https://cantor-oneill-sullivan-csc337-final.vercel.app/api/special-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, targetArea, notes, username }),
      });
      if (!response.ok) {
        throw new Error('Failed to create special task');
      }
      loadSpecialTasks();
      document.getElementById('specialName').value = '';
      document.getElementById('specialArea').value = '';
      document.getElementById('specialNotes').value = '';
    } catch (error) {
      console.error(error);
      alert('An error occurred while adding the special task.');
    }
  }

  // function to delete a special task
  async function deleteSpecialTask(event) {
    const taskId = event.target.getAttribute('data-id');
  
    if (!confirm('Are you sure you want to delete this special task?')) {
      return;
    }
  
    try {
      const response = await fetch(`https://cantor-oneill-sullivan-csc337-final.vercel.app/api/special-task/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete special task');
      }
      loadSpecialTasks();
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the special task.');
    }
  }
    
  // Budget Tracker Functions
  async function loadBudgetTracker() {
    const budgetTbody = document.getElementById('budget-tbody');
    budgetTbody.innerHTML = '<tr><td colspan="4">Loading budget data...</td></tr>';
    
    try {
      const response = await fetch(`https://cantor-oneill-sullivan-csc337-final.vercel.app/api/budgets?username=${encodeURIComponent(username)}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch budget data');
      }
      const budgets = await response.json();
    
      budgetTbody.innerHTML = ''; 
    
      budgets.forEach((budget) => {
        const row = document.createElement('tr');
  
        const categoryCell = document.createElement('td');
        categoryCell.textContent = budget.category;
        row.appendChild(categoryCell);
  
        const amountCell = document.createElement('td');
        amountCell.textContent = `$${parseFloat(budget.amount).toFixed(2)}`;
        row.appendChild(amountCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(budget.date).toLocaleDateString();
        row.appendChild(dateCell);

        const actionCell = document.createElement('td');
  
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.id = budget._id;
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.addEventListener('click', deleteBudget);
        actionCell.appendChild(deleteBtn);
  
        row.appendChild(actionCell);
    
        budgetTbody.appendChild(row);
      });
    } catch (error) {
      console.error(error);
      budgetTbody.innerHTML = '<tr><td colspan="4">An error occurred while loading budget data.</td></tr>';
    }

    const addBudgetBtn = document.getElementById('addBudgetBtn');
    addBudgetBtn.removeEventListener('click', addBudget);
    addBudgetBtn.addEventListener('click', addBudget);
  }
    
  //function to add an element to the budget
  async function addBudget() {
    const category = document.getElementById('budgetCategory').value;
    const amount = document.getElementById('budgetAmount').value;
    
    if (!category || !amount) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      const response = await fetch('https://cantor-oneill-sullivan-csc337-final.vercel.app/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount, username }),
      });
      if (!response.ok) {
        throw new Error('Failed to add budget');
      }
      loadBudgetTracker();
      document.getElementById('budgetCategory').value = '';
      document.getElementById('budgetAmount').value = '';
    } catch (error) {
      console.error(error);
      alert('An error occurred while adding the expense.');
    }
  }

  //function to delete an element from the budget
  async function deleteBudget(event) {
    const budgetId = event.target.getAttribute('data-id');
  
    if (!confirm('Are you sure you want to delete this budget entry?')) {
      return;
    }
  
    try {
      const response = await fetch(`https://cantor-oneill-sullivan-csc337-final.vercel.app/api/budget/${budgetId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete budget');
      }
      loadBudgetTracker();
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the budget entry.');
    }
  }

  // Equipment Tracker Functions
  async function loadEquipmentTracker() {
    const equipmentTbody = document.getElementById('equipment-tbody');
    equipmentTbody.innerHTML = '<tr><td colspan="5">Loading equipment data...</td></tr>';
    
    try {
      const response = await fetch(`https://cantor-oneill-sullivan-csc337-final.vercel.app/api/equipment?username=${encodeURIComponent(username)}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch equipment data');
      }
      const equipmentList = await response.json();
    
      equipmentTbody.innerHTML = ''; 
    
      equipmentList.forEach((equipment) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = equipment.name;
        row.appendChild(nameCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = equipment.status;
        row.appendChild(statusCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = equipment.quantity;
        row.appendChild(quantityCell);

        const notesCell = document.createElement('td');
        notesCell.textContent = equipment.notes;
        row.appendChild(notesCell);

        const actionCell = document.createElement('td');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.id = equipment._id;
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.addEventListener('click', deleteEquipment);
        actionCell.appendChild(deleteBtn);
  
        row.appendChild(actionCell);
    
        equipmentTbody.appendChild(row);
      });
    } catch (error) {
      console.error(error);
      equipmentTbody.innerHTML = '<tr><td colspan="5">An error occurred while loading equipment data.</td></tr>';
    }
    const addEquipmentBtn = document.getElementById('addEquipmentBtn');
    addEquipmentBtn.removeEventListener('click', addEquipment);
    addEquipmentBtn.addEventListener('click', addEquipment);
  }
    
  //function to add a piece of equipment
  async function addEquipment() {
    const name = document.getElementById('equipmentName').value;
    const status = document.getElementById('equipmentStatus').value;
    const quantity = document.getElementById('equipmentQuantity').value;
    const notes = document.getElementById('equipmentNotes').value;
    
    if (!name || !status || !quantity) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      const response = await fetch('https://cantor-oneill-sullivan-csc337-final.vercel.app/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status, quantity, notes, username }),
      });
      if (!response.ok) {
        throw new Error('Failed to add equipment');
      }
      loadEquipmentTracker();
      document.getElementById('equipmentName').value = '';
      document.getElementById('equipmentStatus').value = '';
      document.getElementById('equipmentQuantity').value = '';
      document.getElementById('equipmentNotes').value = '';
    } catch (error) {
      console.error(error);
      alert('An error occurred while adding the equipment.');
    }
  }

  //function to delete a piece of equipment
  async function deleteEquipment(event) {
    const equipmentId = event.target.getAttribute('data-id');
  
    if (!confirm('Are you sure you want to delete this equipment entry?')) {
      return;
    }
  
    try {
      const response = await fetch(`https://cantor-oneill-sullivan-csc337-final.vercel.app/api/equipment/${equipmentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete equipment');
      }
      loadEquipmentTracker();
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the equipment entry.');
    }
  }

  // Messaging Functions
  async function loadMessages() {
    const messageDisplay = document.getElementById('message-display');
    messageDisplay.innerHTML = '<p>Loading messages...</p>';
    
    try {
      const response = await fetch(`https://cantor-oneill-sullivan-csc337-final.vercel.app/api/messages?receiver=${encodeURIComponent(username)}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const messages = await response.json();
    
      messageDisplay.innerHTML = ''; 
    
      messages.forEach((message) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
  
        const senderP = document.createElement('p');
        senderP.textContent = `From: ${message.sender}`;
        messageDiv.appendChild(senderP);
  
        const contentP = document.createElement('p');
        contentP.textContent = message.content;
        messageDiv.appendChild(contentP);
  
        const timestampP = document.createElement('p');
        timestampP.textContent = new Date(message.timestamp).toLocaleString();
        messageDiv.appendChild(timestampP);
  
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.id = message._id;
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.addEventListener('click', deleteMessage);
        messageDiv.appendChild(deleteBtn);
    
        messageDisplay.appendChild(messageDiv);
      });
    } catch (error) {
      console.error(error);
      messageDisplay.innerHTML = '<p>An error occurred while loading messages.</p>';
    }

    const sendMessageBtn = document.getElementById('sendMessageBtn');
    sendMessageBtn.removeEventListener('click', sendMessage);
    sendMessageBtn.addEventListener('click', sendMessage);
  }
    
  //function to send a message
  async function sendMessage() {
    const receiver = document.getElementById('messageReceiver').value;
    const content = document.getElementById('messageContent').value;
    
    if (!receiver || !content) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      const response = await fetch('https://cantor-oneill-sullivan-csc337-final.vercel.app/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: username, receiver, content }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      loadMessages();
      document.getElementById('messageReceiver').value = '';
      document.getElementById('messageContent').value = '';
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending the message.');
    }
  }

  //function to delete a message
  async function deleteMessage(event) {
    const messageId = event.target.getAttribute('data-id');
  
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }
  
    try {
      const response = await fetch(`https://cantor-oneill-sullivan-csc337-final.vercel.app/api/message/${messageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
      loadMessages();
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the message.');
    }
  }

  showScreen('login-screen');
});
