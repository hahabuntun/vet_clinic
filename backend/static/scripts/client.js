


document.addEventListener('DOMContentLoaded', () => {
    const animalTable = document.getElementById('animalTable');
    const editModal = document.getElementById('editModal');
    const closeButton = document.querySelector('.close-button');
    const editForm = document.getElementById('editForm');
    const addForm = document.getElementById('addForm');
    const filterForm = document.getElementById('filterForm');
    var animalId = "";


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
        const clientIdElement = document.querySelector('.client-id');
        const clientId = clientIdElement.textContent;
        console.log(queryParams.toString());
        console.log(clientId);
        window.location.href = `/clients/${clientId}/pets?${queryParams.toString()}`
    });
    
    animalTable.addEventListener('click', (event) => {
        const clickedElement = event.target;
        if (clickedElement.tagName === 'BUTTON' && clickedElement.textContent.trim() === 'Изменить') {
            animalId  = clickedElement.id.substring(3);
            const animalType = clickedElement.parentNode.parentNode.querySelector('td:first-child').textContent;
            const animalName = clickedElement.parentNode.parentNode.querySelector('td:nth-child(2)').textContent;
            const animalBreed = clickedElement.parentNode.parentNode.querySelector('td:nth-child(3)').textContent;
            const animalPassport = clickedElement.parentNode.parentNode.querySelector('td:nth-child(4)').textContent;
            const animalAge = clickedElement.parentNode.parentNode.querySelector('td:nth-child(5)').textContent;
    
            document.getElementById('animalType').value = animalType;
            document.getElementById('animalName').value = animalName;
            document.getElementById('animalBreed').value = animalBreed;
            document.getElementById('animalPassport').value = animalPassport;
            document.getElementById('animalAge').value = animalAge;
            editModal.style.display = 'block';
        }
        else if(clickedElement.tagName === 'BUTTON' && clickedElement.textContent.trim() === 'Удалить'){
            animalId  = clickedElement.id.substring(3);
            deleteAnimal(animalId);
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
        fetch(`/pets/${animalId}`, {
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
    
    window.onclick = function(event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    };
    
    function deleteAnimal(petId){
        fetch(`/pets/${petId}`, { // Replace with your actual endpoint
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
    
    
    addForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        // Создаем объект с данными для отправки на сервер
        const fData = new FormData(addForm);
        console.log(fData);
        // Отправляем POST запрос на сервер с помощью fetch API
        fetch('/pets', {
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
    
  });





