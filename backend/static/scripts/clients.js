const clientTable = document.getElementById('clientTable');
const editModal = document.getElementById('editModal');
const closeButton = document.querySelector('.close-button');
const editForm = document.getElementById('editForm');
const addForm = document.getElementById('addForm');
const filterForm = document.getElementById('filterForm');
var clientId = "";


clientTable.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (clickedElement.tagName === 'BUTTON' && clickedElement.textContent.trim() === 'Изменить') {
        clientId  = clickedElement.id.substring(3);
        const clientPassport = clickedElement.parentNode.parentNode.querySelector('td:first-child').textContent;
        const clientName = clickedElement.parentNode.parentNode.querySelector('td:nth-child(2)').textContent;
        const clientSecondName = clickedElement.parentNode.parentNode.querySelector('td:nth-child(3)').textContent;
        const clientThirdName = clickedElement.parentNode.parentNode.querySelector('td:nth-child(4)').textContent;
        const clientEmail = clickedElement.parentNode.parentNode.querySelector('td:nth-child(5)').textContent;
        const clientPhone = clickedElement.parentNode.parentNode.querySelector('td:nth-child(6)').textContent;

        document.getElementById('clientPassport').value = clientPassport;
        document.getElementById('clientName').value = clientName;
        document.getElementById('clientSecondName').value = clientSecondName;
        document.getElementById('clientThirdName').value = clientThirdName;
        document.getElementById('clientEmail').value = clientEmail;
        document.getElementById('clientPhone').value = clientPhone;
        editModal.style.display = 'block';
    }
    else if(clickedElement.tagName === 'BUTTON' && clickedElement.textContent.trim() === 'Удалить'){
        clientId  = clickedElement.id.substring(3);
        deleteClient(clientId);
    }
});


closeButton.addEventListener('click', () => {
    editModal.style.display = 'none';
});


// Handle form submission
editForm.addEventListener('submit',  (event) => {
    event.preventDefault();
    const formData = new FormData(editForm);
    console.log(formData)
    fetch(`/clients/${clientId}`, {
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

function deleteClient(clientsId){
    fetch(`/clients/${clientsId}`, { // Replace with your actual endpoint
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
        console.error('Error deleting client:', error);
        // Handle errors
        });
}



// Добавляем обработчик события клика на кнопку
addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Создаем объект с данными для отправки на сервер
    const fData = new FormData(addForm);
    console.log(fData);
    // Отправляем POST запрос на сервер с помощью fetch API
    fetch('/clients/', {
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

    // Создаем объект с данными для отправки на сервер
    const formData = new FormData(filterForm);
    const queryParams = new URLSearchParams();
    formData.forEach((value, key) => {
        if (value != ""){
            queryParams.append(key, value);
        }
        
    });
    console.log(queryParams.toString());
    window.location.href = `/clients?${queryParams.toString()}`
});