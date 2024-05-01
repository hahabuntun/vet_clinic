
const serviceTable = document.getElementById('serviceTable');
const editModal = document.getElementById('editModal');
const closeButton = document.querySelector('.close-button');
const editForm = document.getElementById('editForm');
const addForm = document.getElementById('addForm');
const filterForm = document.getElementById('filterForm');
var serviceId = "";


// Open modal and populate form
serviceTable.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (clickedElement.tagName === 'BUTTON' && clickedElement.textContent.trim() === 'Изменить') {
        serviceId  = clickedElement.id.substring(3);
        const serviceName = clickedElement.parentNode.parentNode.querySelector('td:first-child').textContent;
        const servicePrice = clickedElement.parentNode.parentNode.querySelector('td:nth-child(2)').textContent;

        document.getElementById('serviceName').value = serviceName;
        document.getElementById('servicePrice').value = servicePrice;
        editModal.style.display = 'block';
    }
    else if(clickedElement.tagName === 'BUTTON' && clickedElement.textContent.trim() === 'Удалить'){
        serviceId  = clickedElement.id.substring(3);
        deleteService(serviceId);
    }
});

// Close modal
closeButton.addEventListener('click', () => {
    editModal.style.display = 'none';
});

// Handle form submission
editForm.addEventListener('submit',  (event) => {
    event.preventDefault();
    const formData = new FormData(editForm);
    console.log(formData)
    fetch(`/services/${serviceId}`, {
        method: 'PATCH',
        body: formData
    })
        .then(response => {
        // Handle successful update
        if (response.status == 200){
            console.log(response);
            editModal.style.display = 'none';
            location.reload();
        }
        })
        .catch(error => {
        });
});

// Close modal when clicking outside of modal content
window.onclick = function(event) {
if (event.target === editModal) {
    editModal.style.display = 'none';
}
};




function deleteService(serviceId){
    fetch(`/services/${serviceId}`, { // Replace with your actual endpoint
        method: 'DELETE'
    })
    .then(response => {
        // Handle successful update
        if (response.status == 200){
            console.log("deleted successfully");
            location.reload();
        }
        // You might want to refresh the table or update the UI here
        })
        .catch(error => {
        console.error('Error deleting service:', error);
        // Handle errors
        });
}



// Добавляем обработчик события клика на кнопку
addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Создаем объект с данными для отправки на сервер
    const formData = new FormData(addForm);
    console.log(formData);
    // Отправляем POST запрос на сервер с помощью fetch API
    fetch('/services/', {
        method: 'POST',
        body: formData
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

    // Создаем объект с данными для отправки на сервер
    const formData = new FormData(filterForm);
    const queryParams = new URLSearchParams();
    formData.forEach((value, key) => {
        if (value != ""){
            queryParams.append(key, value);
        }
        
    });
    console.log(queryParams.toString());
    window.location.href = `/services?${queryParams.toString()}`
});