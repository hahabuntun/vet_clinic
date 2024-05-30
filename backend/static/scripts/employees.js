const employeeTable = document.getElementById('employeeTable');
const editModal = document.getElementById('editModal');
const closeButton = document.querySelector('.close-button');
const editForm = document.getElementById('editForm');
const addForm = document.getElementById('addForm');
const filterForm = document.getElementById('filterForm');
var workerId = "";
employeeTable.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (clickedElement.tagName === 'BUTTON' && clickedElement.textContent.trim() === 'Изменить') {
        workerId  = clickedElement.id.substring(3);
        const employeePassport = clickedElement.parentNode.parentNode.querySelector('td:first-child').textContent;
        const employeeEmail = clickedElement.parentNode.parentNode.querySelector('td:nth-child(2)').textContent;
        const employeeName = clickedElement.parentNode.parentNode.querySelector('td:nth-child(3)').textContent;
        const employeeSecondName = clickedElement.parentNode.parentNode.querySelector('td:nth-child(4)').textContent;
        const employeeThirdName = clickedElement.parentNode.parentNode.querySelector('td:nth-child(5)').textContent;
        const employeePhone = clickedElement.parentNode.parentNode.querySelector('td:nth-child(6)').textContent;
        const employeeType = clickedElement.parentNode.parentNode.querySelector('td:nth-child(7)').textContent;
        document.getElementById('employeePassport').value = employeePassport;
        document.getElementById('employeeName').value = employeeName;
        document.getElementById('employeeSecondName').value = employeeSecondName;
        document.getElementById('employeeThirdName').value = employeeThirdName;
        document.getElementById('employeeEmail').value = employeeEmail;
        document.getElementById('employeePhone').value = employeePhone;
        document.getElementById('employeeType').value = employeeType;
        editModal.style.display = 'block';
    }
    else if(clickedElement.tagName === 'BUTTON' && clickedElement.textContent.trim() === 'Удалить'){
        workerId  = clickedElement.id.substring(3);
        deleteEmployee(workerId);
    }
});
closeButton.addEventListener('click', () => {
    editModal.style.display = 'none';
});
editForm.addEventListener('submit',  (event) => {
    event.preventDefault();
    const formData = new FormData(editForm);
    console.log(formData)
    fetch(`/workers/${workerId}`, {
        method: 'PATCH',
        body: formData
    })
        .then(response => {
        if (response.status == 200){
            console.log(response);
            editModal.style.display = 'none';
            location.reload();
        }
        })
        .catch(error => {
        });
});
window.onclick = function(event) {
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
};
function deleteEmployee(workerId){
    fetch(`/workers/${workerId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.status == 200){
            console.log("deleted successfully");
            location.reload();
        }
        })
        .catch(error => {
        console.error('Error deleting worker:', error);
        });
}
addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fData = new FormData(addForm);
    console.log(fData);
    fetch('/workers/', {
        method: 'POST',
        body: fData
    })
    .then(response => {
        if (response.status == 201){
            console.log("added successfully");
            location.reload();
        }
    })
    .catch(error => {
        console.error('Произошла ошибка:', error);
    });
});



filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(filterForm);
    const queryParams = new URLSearchParams();
    formData.forEach((value, key) => {
        if (value != ""){
            queryParams.append(key, value);
        }
    });
    console.log(queryParams.toString());
    window.location.href = `/workers?${queryParams.toString()}`
});