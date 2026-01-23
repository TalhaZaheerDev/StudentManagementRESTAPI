// ============================================
// API Configuration
// ============================================
const API_BASE_URL = '/api/students';

// ============================================
// DOM Elements
// ============================================
const studentForm = document.getElementById('studentForm');
const studentTableBody = document.getElementById('studentTableBody');
const studentIdInput = document.getElementById('studentId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const refreshBtn = document.getElementById('refreshBtn');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const totalStudentsEl = document.getElementById('totalStudents');
const avgAgeEl = document.getElementById('avgAge');
const toast = document.getElementById('toast');

// ============================================
// Event Listeners
// ============================================
document.addEventListener('DOMContentLoaded', loadStudents);
studentForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', resetForm);
refreshBtn.addEventListener('click', loadStudents);

// ============================================
// API Functions
// ============================================

async function loadStudents() {
    showLoading(true);
    try {
        const response = await fetch(API_BASE_URL);
        const result = await response.json();

        if (result.success) {
            renderStudents(result.data);
            updateStats(result.data);
        } else {
            showToast('Failed to load students', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Cannot connect to server', 'error');
        studentTableBody.innerHTML = '';
        showEmptyState(true);
    } finally {
        showLoading(false);
    }
}

async function createStudent(student) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast('Student created!', 'success');
            resetForm();
            loadStudents();
        } else {
            handleApiError(result);
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error creating student', 'error');
    }
}

async function updateStudent(id, student) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast('Student updated!', 'success');
            resetForm();
            loadStudents();
        } else {
            handleApiError(result);
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error updating student', 'error');
    }
}

async function deleteStudent(id) {
    if (!confirm('Delete this student?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        const result = await response.json();

        if (response.ok && result.success) {
            showToast('Student deleted!', 'success');
            loadStudents();
        } else {
            showToast('Failed to delete', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error deleting student', 'error');
    }
}

// ============================================
// Form Handlers
// ============================================

function handleFormSubmit(e) {
    e.preventDefault();
    clearErrors();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const age = ageInput.value.trim();

    // Validation
    let valid = true;

    if (!name || name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        valid = false;
    }

    if (!email || !isValidEmail(email)) {
        showError('emailError', 'Enter a valid email');
        valid = false;
    }

    if (!age || parseInt(age) < 1 || parseInt(age) > 150) {
        showError('ageError', 'Age must be 1-150');
        valid = false;
    }

    if (!valid) return;

    const student = {
        name: name,
        email: email,
        age: parseInt(age)
    };

    const studentId = studentIdInput.value;

    if (studentId) {
        updateStudent(studentId, student);
    } else {
        createStudent(student);
    }
}

function editStudent(id, name, email, age) {
    studentIdInput.value = id;
    nameInput.value = name;
    emailInput.value = email;
    ageInput.value = age;

    formTitle.textContent = 'Edit Student';
    submitBtn.textContent = 'Update Student';
    cancelBtn.style.display = 'inline-flex';

    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    studentForm.reset();
    studentIdInput.value = '';
    formTitle.textContent = 'Add Student';
    submitBtn.textContent = 'Save Student';
    cancelBtn.style.display = 'none';
    clearErrors();
}

// ============================================
// UI Functions
// ============================================

function renderStudents(students) {
    if (!students || students.length === 0) {
        studentTableBody.innerHTML = '';
        showEmptyState(true);
        return;
    }

    showEmptyState(false);

    studentTableBody.innerHTML = students.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${escapeHtml(s.name)}</td>
            <td>${escapeHtml(s.email)}</td>
            <td>${s.age}</td>
            <td class="actions">
                <button class="btn btn-edit" onclick="editStudent(${s.id}, '${escapeJs(s.name)}', '${escapeJs(s.email)}', ${s.age})">Edit</button>
                <button class="btn btn-delete" onclick="deleteStudent(${s.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function updateStats(students) {
    const total = students ? students.length : 0;
    const avg = total > 0 ? Math.round(students.reduce((sum, s) => sum + s.age, 0) / total) : 0;

    totalStudentsEl.textContent = total;
    avgAgeEl.textContent = avg;
}

function showLoading(show) {
    loadingState.style.display = show ? 'block' : 'none';
    if (show) {
        studentTableBody.innerHTML = '';
        emptyState.style.display = 'none';
    }
}

function showEmptyState(show) {
    emptyState.style.display = show ? 'block' : 'none';
}

function showToast(message, type = 'success') {
    toast.querySelector('.toast-message').textContent = message;
    toast.className = 'toast ' + type + ' show';
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = message;

    const inputId = elementId.replace('Error', '');
    const input = document.getElementById(inputId);
    if (input) input.classList.add('error');
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input.error').forEach(el => el.classList.remove('error'));
}

function handleApiError(result) {
    if (result.errors) {
        Object.entries(result.errors).forEach(([field, msg]) => {
            showError(field + 'Error', msg);
        });
    } else if (result.message) {
        showToast(result.message, 'error');
    }
}

// ============================================
// Utilities
// ============================================

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeJs(text) {
    return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
