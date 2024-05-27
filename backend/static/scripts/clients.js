$(document).ready(function() {
    const editModal = $('#editModal');
    const closeButton = $('.close-button');
    const editForm = $('#editForm');
    const addForm = $('#addForm');
    const filterForm = $('#filterForm');
    var clientId = "";


    $('#clientTable').on('click', 'button', function(event) {
        const clickedElement = $(this);
        if (clickedElement.text().trim() === 'Изменить') {
            clientId = clickedElement.attr('id').substring(3);
            const row = clickedElement.closest('tr');
            const clientPassport = row.find('td:first-child').text();
            const clientName = row.find('td:nth-child(2)').text();
            const clientSecondName = row.find('td:nth-child(3)').text();
            const clientThirdName = row.find('td:nth-child(4)').text();
            const clientEmail = row.find('td:nth-child(5)').text();
            const clientPhone = row.find('td:nth-child(6)').text();

            $('#clientPassport').val(clientPassport);
            $('#clientName').val(clientName);
            $('#clientSecondName').val(clientSecondName);
            $('#clientThirdName').val(clientThirdName);
            $('#clientEmail').val(clientEmail);
            $('#clientPhone').val(clientPhone);
            editModal.css('display', 'block');
        } else if (clickedElement.text().trim() === 'Удалить') {
            clientId = clickedElement.attr('id').substring(3);
            deleteClient(clientId);
        }
    });

    closeButton.on('click', function() {
        editModal.css('display', 'none');
    });

    // Handle form submission
    editForm.on('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        console.log(formData)
        await fetch(`/clients/${clientId}`, {
            method: 'PATCH',
            body: formData
        })
            .then(response => {
            // Handle successful update
            if (response.status == 200){
                console.log(response);
                editModal.css('display', 'none');
                $(this)[0].reset();
                response.json().then(data => {
                    updateRowInTable(clientId, data)
                });
            }
            })
            .catch(error => {
            });
    });

    function updateRowInTable(clientId, newData) {
        console.log(newData.passport);
        const row = $(`#${clientId}`);
        row.find('td:nth-child(1)').text(newData.passport);
        row.find('td:nth-child(2)').text(newData.name);
        row.find('td:nth-child(3)').text(newData.second_name);
        row.find('td:nth-child(4)').text(newData.third_name);
        row.find('td:nth-child(5)').text(newData.email);
        row.find('td:nth-child(6)').text(newData.phone);
        row.find('td:nth-child(7)').html(`<button id="edt${newData._id}" class="editBtn">Изменить</button>`);
        row.find('td:nth-child(8)').html(`<button class="redBtn" id="del${newData._id}" class="deleteBtn">Удалить</button>`);
        row.find('td:nth-child(9)').html(`<a href="/clients/${newData._id}/pets">Больше</a>`);
    }

    

    $(window).on('click', function(event) {
        if ($(event.target).is(editModal)) {
            editModal.css('display', 'none');
        }
    });

    // Добавляем обработчик события клика на кнопку
    addForm.on('submit', function(event) {
        event.preventDefault();

        // Создаем объект с данными для отправки на сервер
        const fData = new FormData(this);
        console.log(fData);
        // Отправляем POST запрос на сервер с помощью fetch API
        fetch('/clients/', {
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
        const newRow = `<tr id=${data._id}>
            <td>${data.passport}</td>
            <td>${data.name}</td>
            <td>${data.second_name}</td>
            <td>${data.third_name}</td>
            <td>${data.email}</td>
            <td>${data.phone}</td>
            <td>
                <button id="edt${data._id}" class="editBtn">Изменить</button>
            </td>
            <td>
                <button class="redBtn" id="del${data._id}" class="deleteBtn">Удалить</button>
            </td>
            <td><a href="/clients/${data._id}/pets">Больше</a></td>
        </tr>`;
        $('#clientTable').append(newRow);
    }

    filterForm.on('submit', function(event) {
        event.preventDefault();
        const formData = $(this).serialize();
        window.location.href = `/clients?${formData}`;
    });

    function deleteClient(clientsId){
        fetch(`/clients/${clientsId}`, { // Replace with your actual endpoint
            method: 'DELETE'
        })
        .then(response => {
            // Handle successful update
            if (response.status == 200){
                console.log("deleted successfully");
                removeRowFromTable(clientsId);
            }
            // You might want to refresh the table or update the UI here
            })
            .catch(error => {
            console.error('Error deleting client:', error);
            // Handle errors
            });
    }
    function removeRowFromTable(clientId) {
        $(`#${clientId}`).remove();
    }
    
});





