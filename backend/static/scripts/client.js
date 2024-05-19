const animalTable = document.getElementById('animalTable');
const editModal = document.getElementById('editModal');
const closeButton = document.querySelector('.close-button');
const editForm = document.getElementById('editForm');
const addForm = document.getElementById('addForm');
const filterForm = document.getElementById('filterForm');
var animalId = "";


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
        deleteClient(animalId);
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
    fetch(`/clients/${clientId}/pets/${animalId}`, {
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