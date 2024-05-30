$(document).ready(function() {
    const editModal = $('#editModal');
    const closeButton = $('.close-button');
    const editForm = $('#editForm');
    const addForm = $('#addForm');
    const filterForm = $('#filterForm');
    var animalId = "";
    closeButton.on('click', function() {
        editModal.css('display', 'none');
    });
    $(window).on('click', function(event) {
        if ($(event.target).is(editModal)) {
            editModal.css('display', 'none');
        }
    });
    filterForm.on('submit', function(event) {
        event.preventDefault();
        const formData = $(this).serialize();
        const clientIdElement = $('.client-id');
        const clientId = clientIdElement.text();
        console.log(formData);
        window.location.href = `/clients/${clientId}/pets?${formData}`
    });
    $('#animalTable').on('click', 'button', async function(event) {
        const clickedElement = $(this);
        if (clickedElement.text().trim() === 'Изменить') {
            animalId  = clickedElement.attr('id').substring(3);
            const row = clickedElement.closest('tr');
            const animalType = row.find('td:first-child').text();
            const animalName =  row.find('td:nth-child(2)').text();
            const animalBreed = row.find('td:nth-child(3)').text();
            const animalPassport = row.find('td:nth-child(4)').text();
            const animalAge = row.find('td:nth-child(5)').text();
            $('#animalType').val(animalType);
            $('#animalName').val(animalName);
            $('#animalBreed').val(animalBreed);
            $('#animalPassport').val(animalPassport);
            $('#animalAge').val(animalAge);
            editModal.css('display', 'block');
        }
        else if (clickedElement.text().trim() === 'Удалить') {
            animalId  = clickedElement.attr('id').substring(3);
            deleteAnimal(animalId);
        }
    });
    editForm.on('submit', async function(event) {
        event.preventDefault();
        console.log(animalId);
        const formData = new FormData(this);
        console.log(formData)
        await fetch(`/pets/${animalId}`, {
            method: 'PATCH',
            body: formData
        })
            .then(response => {
            if (response.status == 200){
                console.log(response);
                editModal.css('display', 'none');
                $(this)[0].reset();
                response.json().then(data => {
                    updateRowInTable(animalId, data)
                });
            }
            })
            .catch(error => {
            });
    });
    function updateRowInTable(animalId, newData) {
        const row = $(`#${animalId}`);
        const clientIdElement = $('.client-id');
        const clientId = clientIdElement.text();
        row.find('td:nth-child(1)').text(newData.type);
        row.find('td:nth-child(2)').text(newData.name);
        row.find('td:nth-child(3)').text(newData.breed);
        row.find('td:nth-child(4)').text(newData.animal_passport);
        row.find('td:nth-child(5)').text(newData.age);
        row.find('td:nth-child(6)').html(`<button id="edt${newData._id}" class="editBtn">Изменить</button>`);
        row.find('td:nth-child(7)').html(`<button class="redBtn" id="del${newData._id}" class="deleteBtn">Удалить</button>`);
    }
    async function deleteAnimal(petId){
        await fetch(`/pets/${petId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.status == 200){
                console.log("deleted successfully");
                removeRowFromTable(petId);
            }
            })
            .catch(error => {
            console.error('Error deleting client:', error);
            });
    }
    addForm.on('submit', async function(event) {
        event.preventDefault();
        const fData = new FormData(this);
        console.log(fData);
        await fetch('/pets', {
            method: 'POST',
            body: fData
        })
        .then(response => {
            if (response.status == 201){
                console.log("added successfully");
                response.json().then(data => {
                    addRowToTable(data);
                });
                $(this)[0].reset();
            }
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
    });
    function addRowToTable(data) {
        console.log("here")
        const clientIdElement = $('.client-id');
        const clientId = clientIdElement.text();
        console.log(data);
        const newRow = `<tr id=${data._id}>
            <td>${data.type}</td>
            <td>${data.name}</td>
            <td>${data.breed}</td>
            <td>${data.animal_passport}</td>
            <td>${data.age}</td>
            <td>
                <button id="edt${data._id}" class="editBtn">Изменить</button>
            </td>
            <td>
                <button class="redBtn" id="del${data._id}" class="deleteBtn">Удалить</button>
            </td>
        </tr>`;
        $('#animalTable').append(newRow);
    }
    function removeRowFromTable(petId) {
        $(`#${petId}`).remove();
    }
});