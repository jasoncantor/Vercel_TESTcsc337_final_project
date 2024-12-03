
document.addEventListener('DOMContentLoaded', () => {
    let user = null;
  
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
      const username = usernameInput.value.trim();
  
      if (!username) {
        alert('Please enter a username');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
        user = await response.json();
        usernameDisplay.textContent = user.username;
        showScreen('dashboard');
        showSection('job-board');
        loadJobBoard(); 
      } catch (error) {
        console.error(error);
        alert('An error occurred during login.');
      }
    }
  
    function handleLogout() {
      user = null;
      showScreen('login-screen');
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

    async function loadJobBoard() {
      const tasksTbody = document.getElementById('tasks-tbody');
      tasksTbody.innerHTML = '<tr><td colspan="5">Loading tasks...</td></tr>';
  
      try {
        const response = await fetch('http://localhost:3000/api/tasks');
        const tasks = await response.json();
  
        tasksTbody.innerHTML = ''; 
  
        tasks.forEach((task) => {
          const row = document.createElement('tr');

          const activityCell = document.createElement('td');
          activityCell.textContent = task.activity;
          row.appendChild(activityCell);

          const areaCell = document.createElement('td');
          areaCell.textContent = task.area;
          row.appendChild(areaCell);

          const assignedCell = document.createElement('td');
          assignedCell.textContent = task.assignedTo ? task.assignedTo.username : 'Unassigned';
          row.appendChild(assignedCell);

          const statusCell = document.createElement('td');
          statusCell.textContent = task.completed ? 'Completed' : 'Pending';
          row.appendChild(statusCell);

          const actionCell = document.createElement('td');
          if (!task.completed && task.assignedTo && task.assignedTo._id === user._id) {
            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Complete';
            completeBtn.dataset.id = task._id;
            completeBtn.classList.add('completeBtn');
            completeBtn.addEventListener('click', completeTask);
            actionCell.appendChild(completeBtn);
          } else {
            actionCell.textContent = '-';
          }
          row.appendChild(actionCell);
  
          tasksTbody.appendChild(row);
        });
      } catch (error) {
        console.error(error);
        tasksTbody.innerHTML = '<tr><td colspan="5">An error occurred while loading tasks.</td></tr>';
      }
  
      document.getElementById('createTaskBtn').addEventListener('click', createTask);
    }
  
    async function createTask() {
      const activity = document.getElementById('activity').value;
      const area = document.getElementById('area').value;
      const notes = document.getElementById('notes').value;
  
      if (!activity || !area) {
        alert('Please fill in all required fields.');
        return;
      }
  
      try {
        await fetch('http://localhost:3000/api/task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activity, area, notes, assignedTo: user._id }),
        });
        loadJobBoard();
      } catch (error) {
        console.error(error);
        alert('An error occurred while creating the task.');
      }
    }
  
    async function completeTask(event) {
      const taskId = event.target.getAttribute('data-id');
  
      try {
        await fetch(`http://localhost:3000/api/task/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true }),
        });
        loadJobBoard();
      } catch (error) {
        console.error(error);
        alert('An error occurred while completing the task.');
      }
    }

    async function loadSpecialTasks() {
      const specialTasksTbody = document.getElementById('special-tasks-tbody');
      specialTasksTbody.innerHTML = '<tr><td colspan="4">Loading special tasks...</td></tr>';
  
      try {
        const response = await fetch('http://localhost:3000/api/special-tasks');
        const specialTasks = await response.json();
  
        specialTasksTbody.innerHTML = ''; 
  
        specialTasks.forEach((task) => {
          const row = document.createElement('tr');

          const nameCell = document.createElement('td');
          nameCell.textContent = task.name;
          row.appendChild(nameCell);
  
          const areaCell = document.createElement('td');
          areaCell.textContent = task.targetArea;
          row.appendChild(areaCell);

          const notesCell = document.createElement('td');
          notesCell.textContent = task.notes;
          row.appendChild(notesCell);

          const dateCell = document.createElement('td');
          dateCell.textContent = new Date(task.applicationDate).toLocaleDateString();
          row.appendChild(dateCell);
  
          specialTasksTbody.appendChild(row);
        });
      } catch (error) {
        console.error(error);
        specialTasksTbody.innerHTML = '<tr><td colspan="4">An error occurred while loading special tasks.</td></tr>';
      }

      document.getElementById('createSpecialTaskBtn').addEventListener('click', createSpecialTask);
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
        await fetch('http://localhost:3000/api/special-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, targetArea, notes }),
        });
        loadSpecialTasks();
      } catch (error) {
        console.error(error);
        alert('An error occurred while adding the special task.');
      }
    }

    async function loadBudgetTracker() {
      const budgetTbody = document.getElementById('budget-tbody');
      budgetTbody.innerHTML = '<tr><td colspan="3">Loading budget data...</td></tr>';
  
      try {
        const response = await fetch('http://localhost:3000/api/budgets');
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
  
          budgetTbody.appendChild(row);
        });
      } catch (error) {
        console.error(error);
        budgetTbody.innerHTML = '<tr><td colspan="3">An error occurred while loading budget data.</td></tr>';
      }

      document.getElementById('addBudgetBtn').addEventListener('click', addBudget);
    }
  
    async function addBudget() {
      const category = document.getElementById('budgetCategory').value;
      const amount = document.getElementById('budgetAmount').value;
  
      if (!category || !amount) {
        alert('Please fill in all required fields.');
        return;
      }
  
      try {
        await fetch('http://localhost:3000/api/budget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, amount }),
        });
        loadBudgetTracker();
      } catch (error) {
        console.error(error);
        alert('An error occurred while adding the expense.');
      }
    }
  
    async function loadEquipmentTracker() {
      const equipmentTbody = document.getElementById('equipment-tbody');
      equipmentTbody.innerHTML = '<tr><td colspan="4">Loading equipment data...</td></tr>';
  
      try {
        const response = await fetch('http://localhost:3000/api/equipment');
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
  
          equipmentTbody.appendChild(row);
        });
      } catch (error) {
        console.error(error);
        equipmentTbody.innerHTML = '<tr><td colspan="4">An error occurred while loading equipment data.</td></tr>';
      }
  
      document.getElementById('addEquipmentBtn').addEventListener('click', addEquipment);
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
        await fetch('http://localhost:3000/api/equipment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, status, quantity, notes }),
        });
        loadEquipmentTracker();
      } catch (error) {
        console.error(error);
        alert('An error occurred while adding the equipment.');
      }
    }
  
    if (user) {
      usernameDisplay.textContent = user.username;
      showScreen('dashboard');
      showSection('job-board');
      loadJobBoard();
    } else {
      showScreen('login-screen');
    }
  });
  