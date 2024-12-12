document.addEventListener('DOMContentLoaded', () => {
  let username = null; // Store the logged-in username
    
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
    
  async function handleLogin() {
    const usernameInput = document.getElementById('username');
    const enteredUsername = usernameInput.value.trim();
    
    if (!enteredUsername) {
      alert('Please enter a username');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: enteredUsername }),
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
    
  async function handleLogout() {
    try {
      const response = await fetch('http://localhost:3000/api/logout', {
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
      default:
        break;
    }
  }
    
  function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach((screen) => {
      screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
  }
    
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
      const response = await fetch(`http://localhost:3000/api/tasks?username=${encodeURIComponent(username)}`, {
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

    const createTaskBtn = document.getElementById('createTaskBtn');
    createTaskBtn.removeEventListener('click', createTask);
    createTaskBtn.addEventListener('click', createTask);
  }
    
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
      const response = await fetch('http://localhost:3000/api/task', {
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
    
  async function completeTask(event) {
    const taskId = event.target.getAttribute('data-id');
    
    try {
      const response = await fetch(`http://localhost:3000/api/task/${taskId}`, {
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

  // Delete Task Function
  async function deleteTask(event) {
    const taskId = event.target.getAttribute('data-id');
  
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/task/${taskId}`, {
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

  // Edit Task Function
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
      const response = await fetch(`http://localhost:3000/api/task/${taskId}`, {
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
      const response = await fetch(`http://localhost:3000/api/special-tasks?username=${encodeURIComponent(username)}`, {
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
  
        // Action (Delete Button)
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
    
  async function createSpecialTask() {
    const name = document.getElementById('specialName').value;
    const targetArea = document.getElementById('specialArea').value;
    const notes = document.getElementById('specialNotes').value;
    
    if (!name || !targetArea) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/special-task', {
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

  // Delete Special Task Function
  async function deleteSpecialTask(event) {
    const taskId = event.target.getAttribute('data-id');
  
    if (!confirm('Are you sure you want to delete this special task?')) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/special-task/${taskId}`, {
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
      const response = await fetch(`http://localhost:3000/api/budgets?username=${encodeURIComponent(username)}`, {
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
    
  async function addBudget() {
    const category = document.getElementById('budgetCategory').value;
    const amount = document.getElementById('budgetAmount').value;
    
    if (!category || !amount) {
      alert('Please fill in all required fields.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/budget', {
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

  async function deleteBudget(event) {
    const budgetId = event.target.getAttribute('data-id');
  
    if (!confirm('Are you sure you want to delete this budget entry?')) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/budget/${budgetId}`, {
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

  async function loadEquipmentTracker() {
    const equipmentTbody = document.getElementById('equipment-tbody');
    equipmentTbody.innerHTML = '<tr><td colspan="5">Loading equipment data...</td></tr>';
    
    try {
      const response = await fetch(`http://localhost:3000/api/equipment?username=${encodeURIComponent(username)}`, {
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
      const response = await fetch('http://localhost:3000/api/equipment', {
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

  async function deleteEquipment(event) {
    const equipmentId = event.target.getAttribute('data-id');
  
    if (!confirm('Are you sure you want to delete this equipment entry?')) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/equipment/${equipmentId}`, {
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

  showScreen('login-screen');
});
