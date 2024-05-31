$(document).ready(function() {
    async function refresh_doctor_div(doctor_div, doctor_id, date) {
        try {
            date.setHours(date.getHours());
            const response = await $.ajax({
                url: `/doctor_schedule/${doctor_id}?date=${date}`,
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    $(doctor_div).find('.scheduleEntry').remove();
                    var helper = $(doctor_div).find('hr');
                    var appointments = data.appointments;
                    appointments.forEach(function(appointment) {
                        if(!appointment.animal_id){
                            var schedEntry = $('<div></div>').addClass('scheduleEntry').attr('id', appointment._id);
                            var span = $('<span></span>').text(`${appointment.service_name} - ${appointment.time}`);
                            var btn = $('<button></button>').addClass('bookBtn').text('+');
                            btn.on('click', handleBooked);
                            schedEntry.append(span).append(btn);
                            helper.before(schedEntry);
                        }
                    });
                },
                error: function(error) {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    async function handleDateChange(event) {
        try {
            const selectedDate = $(event.target).val();
            const doctor_id = $(event.target).attr('id');
            var date = new Date();
            if (selectedDate != "") {
                date = new Date(selectedDate);
            }
            await refresh_doctor_div($(event.target).parent(), doctor_id, date);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    $('#clientForm').submit(function(event) {
        event.preventDefault();
        const passport = $('#passportSearch').val();
        $.ajax({
          url: `/clients/find_by_passport/${passport}`,
          method: 'GET',
          success: function(data) {
            $('#clientId').text($('#clientId').text() + ": " + data._id);
            $('#clientName').text($('#clientName').text() + ": " + data.name);
            $('#clientSecondName').text($('#clientSecondName').text() + ": " + data.second_name);
            $('#clientThirdName').text($('#clientThirdName').text() + ": " + data.third_name);
            $('#clientPassport').text($('#clientPassport').text() + ": " + data.passport);
            $('#clientPhone').text($('#clientPhone').text() + ": " + data.phone);
            $('#clientEmail').text($('#clientEmail').text() + ": " + data.email);
            data.pets.forEach(pet => {
              $('#pet-select').append(`<option value='${pet._id}'>Питомец: ${pet.name}, Название: ${pet.type}, Порода: ${pet.breed}</option>`);
            });
          },
          error: function(error) {
            console.error('Ошибка при отправке данных:', error);
          }
        });
      })
    async function handleBooked(event){
        const petId = $("#pet-select").val();
        if (petId === null || petId === undefined) {
            return; 
        }
        var url = '/make_appointment';
        const animal_id = $("#pet-select").val();
        const client_id = $("#client-id").val();
        console.log(client_id);
        if (client_id){
            url = `/clients/${client_id}/make_appointment`;
        }
        const appointment_id = $(event.target).parent().attr('id');
        const fData = new FormData();
        fData.append("animal_id", animal_id);
        fData.append("appointment_id", appointment_id);
        await fetch(url, {
            method: 'POST',
            body: fData
        })
        .then(response => {
            if(response.status == 200){
                var parent = $(event.target).parent().parent();
                var doctor_id=  parent.find('input[name="date"]').attr("id");
                var date = new Date(parent.find('input[name="date"]').val());
                refresh_doctor_div(parent, doctor_id, date);
            }
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
    }
    function set_date() {
        $('input[type="date"]').each(function() {
            var selected_date = new Date().toISOString().slice(0, 10);
            $(this).val(selected_date).trigger('change');
        });
    }
    function add_change_date_handlers() {
        $('input[type="date"]').on('change', handleDateChange);
    }
    function add_make_appointment_handlers() {
        $('.bookBtn').on('click', handleBooked);
    }
    add_change_date_handlers();
    set_date();
    add_make_appointment_handlers();
})