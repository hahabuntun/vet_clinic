$(document).ready(function() {
    function findPets(searchType) {
        const url = '/find_pets';
        const queryParams = { search_type: searchType };
        if (searchType === 'client') {
            queryParams.email = $('#emailSearch').val();
            queryParams.passport = $('#passportSearch').val();
            queryParams.phone = $('#phoneSearch').val();
        } else if (searchType === 'animal') {
            queryParams.type = $('#typeSearch').val();
            queryParams.breed = $('#breedSearch').val();
            queryParams.name = $('#nameSearch').val(); 
            queryParams.animal_passport = $('#animalPassportSearch').val();
        }
        $.ajax({
        url: url,
        type: 'GET',
        data: queryParams,
        success: function(data) {
            $('#pet').empty();
            $('#pet').append('<option value="Не выбрано">Не выбрано</option>')
            $.each(data.animals, function(index, animal) {
                $('#pet').append('<option value="' + animal._id + '">' + animal.type + " " + animal.breed + " " + animal.name + " " + animal.animal_passport + '</option>'); // Используем animal.id, если есть
            });
        },
        error: function(error) {
            console.error('Ошибка при получении данных:', error);
        }
        });
    }
    function goToPetPage() {
        const petId = $('#pet').val();
        if (petId !== "Не выбрано") {
            window.location.href = `/doctors/${$('#doctor-id').val()}/pets/${petId}/card`;
        } else {
            alert('Пожалуйста, выберите питомца.');
        }
    }
    $('#find-animal-by-client').submit(function(event) {
        event.preventDefault();
        findPets('client');
    });
    $('#find-animal-by-pet').submit(function(event) {
        event.preventDefault();
        findPets('animal');
    });
    $("#pet").on("change", goToPetPage)
});