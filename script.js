
// Exercise data
const exercisesData = {
  // Strength exercises
  'pushups': {
    name: 'Отжимания',
    description: 'Классическое упражнение для развития грудных мышц, трицепсов и плеч',
    difficulty: 'beginner',
    duration: '3 подхода по 15 раз',
    demoImage: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?q=80&w=1770&auto=format&fit=crop'
  },
  'squats': {
    name: 'Приседания',
    description: 'Базовое упражнение для развития мышц ног и ягодиц',
    difficulty: 'beginner',
    duration: '4 подхода по 20 раз',
    demoImage: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=1770&auto=format&fit=crop'
  },
  'pullups': {
    name: 'Подтягивания',
    description: 'Эффективное упражнение для развития мышц спины и бицепсов',
    difficulty: 'intermediate',
    duration: '3 подхода по 8-12 раз',
    demoImage: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1776&auto=format&fit=crop'
  },
  'dumbbell-press': {
    name: 'Жим гантелей',
    description: 'Упражнение для развития грудных мышц и трицепсов с использованием гантелей',
    difficulty: 'intermediate',
    duration: '4 подхода по 10-12 раз',
    demoImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1770&auto=format&fit=crop'
  },
  'deadlift': {
    name: 'Становая тяга',
    description: 'Комплексное упражнение для развития мышц спины, ног и кора',
    difficulty: 'advanced',
    duration: '3 подхода по 8-10 раз',
    demoImage: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1769&auto=format&fit=crop'
  },
  
  // Cardio exercises can be added similarly
};

// Animation for home page and category page containers
document.addEventListener('DOMContentLoaded', function() {
  const homeContainer = document.querySelector('.home-container');
  const categoryContainer = document.querySelector('.category-container');
  
  if (homeContainer) {
    setTimeout(() => {
      homeContainer.style.opacity = '1';
    }, 100);
  }
  
  if (categoryContainer) {
    setTimeout(() => {
      categoryContainer.style.opacity = '1';
    }, 100);
  }
  
  // AR view functionality
  setupARView();
});

function setupARView() {
  // Check if we're on the AR view page
  const arInactive = document.getElementById('ar-inactive');
  const arActive = document.getElementById('ar-active');
  const arLoading = document.getElementById('ar-loading');
  
  if (!arInactive || !arActive) return;
  
  // Get exercise ID from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseId = urlParams.get('exercise');
  const exerciseData = exercisesData[exerciseId];
  
  if (exerciseData) {
    // Update page title and exercise info
    document.getElementById('exercise-title').textContent = exerciseData.name;
    document.getElementById('ar-exercise-name').textContent = exerciseData.name;
    document.getElementById('ar-exercise-description').textContent = exerciseData.description;
    document.getElementById('ar-overlay-title').textContent = exerciseData.name;
    document.getElementById('ar-overlay-description').textContent = exerciseData.description;
    
    // Set demo image
    if (exerciseData.demoImage) {
      document.getElementById('demo-image').src = exerciseData.demoImage;
    }
  }
  
  // Start AR button
  const startARButton = document.getElementById('start-ar-button');
  if (startARButton) {
    startARButton.addEventListener('click', function() {
      // Hide inactive view and show active view
      arInactive.style.display = 'none';
      arActive.style.display = 'block';
      
      // Simulate AR initialization
      setTimeout(() => {
        arLoading.style.display = 'none';
      }, 2000);
    });
  }
  
  // Stop AR button
  const stopARButton = document.getElementById('stop-ar-button');
  if (stopARButton) {
    stopARButton.addEventListener('click', function() {
      // Hide active view and show inactive view
      arActive.style.display = 'none';
      arInactive.style.display = 'flex';
      
      // Reset loading state for next time
      arLoading.style.display = 'flex';
    });
  }










  // Проверка, авторизован ли пользователь
let currentUser = null;

// Загрузка данных пользователей из JSON
async function loadUsers() {
  const response = await fetch('users.json');
  const data = await response.json();
  return data.users;
}

// Сохранение данных пользователей в JSON
async function saveUsers(users) {
  await fetch('users.json', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ users })
  });
}

// Регистрация нового пользователя
async function registerUser(username, password, gender) {
  const users = await loadUsers();

  // Проверка уникальности имени
  if (users.some(user => user.username === username)) {
    alert('Имя уже занято!');
    return;
  }

  // Добавление нового пользователя
  users.push({ username, password, gender });
  await saveUsers(users);

  // Установка текущего пользователя
  currentUser = { username, gender };
  updateProfilePage();
  closeModal();
}

// Вход пользователя
async function loginUser(username, password) {
  const users = await loadUsers();
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    currentUser = { username: user.username, gender: user.gender };
    localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Сохраняем в localStorage
    updateProfilePage();
    closeModal();
  } else {
    alert('Неверное имя или пароль!');
  }
}

// Выход пользователя
function logoutUser() {
  currentUser = null;
  localStorage.removeItem('currentUser'); // Удаляем из localStorage
  window.location.href = 'index.html'; // Перенаправляем на главную страницу
}

// Обновление данных профиля
function updateProfilePage() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }

  if (!currentUser) {
    window.location.href = 'index.html'; // Если пользователь не авторизован, перенаправляем на главную
    return;
  }

  document.getElementById('profileName')?.textContent = currentUser.username;
  document.getElementById('profileGender')?.textContent = currentUser.gender;
}

// Закрытие модальных окон
function closeModal() {
  document.getElementById('genderModal')?.style.display = 'none';
  document.getElementById('registrationModal')?.style.display = 'none';
}

// Логика открытия модальных окон
document.addEventListener('DOMContentLoaded', async () => {
  const users = await loadUsers();

  if (users.length === 0 || !localStorage.getItem('currentUser')) {
    document.getElementById('genderModal')?.style.display = 'flex';
  }

  updateProfilePage(); // Обновляем данные профиля при загрузке страницы

  // Кнопка выхода
  document.getElementById('logoutButton')?.addEventListener('click', logoutUser);
});

document.querySelectorAll('.gender-button')?.forEach(button => {
  button.addEventListener('click', () => {
    const gender = button.dataset.gender;
    document.getElementById('genderModal').style.display = 'none';
    document.getElementById('registrationModal').style.display = 'flex';
  });
});

document.getElementById('registrationForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const gender = document.querySelector('.gender-button.active')?.dataset.gender;

  if (!gender) {
    alert('Выберите пол!');
    return;
  }

  registerUser(username, password, gender);
});
}
