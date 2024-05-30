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
                if(appointment.animal_card_page_id){
                    var appointment_div = $('<div></div>').addClass('appointment').attr('id', appointment._id);
                    var datetime = new Date(appointment.appointment_time);
                    var year = datetime.getFullYear();
                    var month = datetime.getMonth();
                    var day = datetime.getDate()
                    var header = $('<h2></h2>').text(`Дата и Время: ${year}.${month}.${day} ${appointment.time}`);
                    appointment_div.append(header);
                    var animal_p = $('<p></p>').html(`<a href="/doctors/${doctor_id}/pets/${appointment.animal_id}/card">Животное: ${appointment.animal_data}</a>`);
                    appointment_div.append(animal_p);
                    parent.append(appointment_div);
                }
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