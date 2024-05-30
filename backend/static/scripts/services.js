
const serviceTable = document.getElementById('serviceTable');
const editModal = document.getElementById('editModal');
const closeButton = document.querySelector('.close-button');
const editForm = document.getElementById('editForm');
const addForm = document.getElementById('addForm');
const filterForm = document.getElementById('filterForm');
var serviceId = "";
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
closeButton.addEventListener('click', () => {
    editModal.style.display = 'none';
});
editForm.addEventListener('submit',  (event) => {
    event.preventDefault();
    const formData = new FormData(editForm);
    console.log(formData)
    fetch(`/services/${serviceId}`, {
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
function deleteService(serviceId){
    fetch(`/services/${serviceId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.status == 200){
            console.log("deleted successfully");
            location.reload();
        }
        })
        .catch(error => {
        console.error('Error deleting service:', error);
        });
}
addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(addForm);
    console.log(formData);
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