$(document).ready(function() {
    function displaySchedule(date) {
        console.log("here")
        var parent = $(".appointments");
        var doctor_id = $("#doctor-id").val();
        $.ajax({
        url: `/doctor_schedule/${doctor_id}?date=${date}`,
        method: 'GET',
        success: function(data) {
            parent.empty();
            data.appointments.forEach(appointment => {
                var appointment_div = $('<div></div>').addClass('appointment').attr('id', appointment._id);
                var datetime = new Date(appointment.appointment_time);
                var year = datetime.getFullYear();
                var month = datetime.getMonth()  + 1;
                var day = datetime.getDate()
                var header = $('<h2></h2>').text(`Дата и Время: ${year}.${month}.${day} ${appointment.time}`);
                appointment_div.append(header);
                if (appointment.animal_id){
                    var animal_p = $('<p></p>').html(`<a href="/doctors/${doctor_id}/pets/${appointment.animal_id}/card">Записанное животное: ${appointment.animal_data}</a>`);
                    var service_p = $('<p></p>').text(`Оказываемая услуга: ${appointment.service_name}`);
                    appointment_div.append(animal_p).append(service_p);
                    var client_data = $('<p></p>').text(`Клиент: ${appointment.client_data}`);
                    var client_phone = $('<p></p>').text(`Номер клиента: ${appointment.client_phone}`);
                    if(appointment.animal_card_page_id){
                        var extra = $('<p></p>').text(`Прием осуществлен(${appointment.status})`);
                        appointment_div.append(extra);
                    }
                    appointment_div.append(client_data).append(client_phone);
                }
                else{
                    var no_appointment = $('<p></p>').text('Пока нет записи');
                    appointment_div.append(no_appointment);
                }
                parent.append(appointment_div);
            })
        },
        error: function(error) {
            console.error('Ошибка при отправке данных:', error);
        }
        });
    }
    async function handleDateChange(event) {
        try {
            const selectedDate = $(event.target).val();
            var date = new Date();
            if (selectedDate != "") {
                date = new Date(selectedDate);
            }
            await displaySchedule(date);
        } catch (error) {
            console.error('Error:', error);
        }
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
    add_change_date_handlers();
    set_date();
})