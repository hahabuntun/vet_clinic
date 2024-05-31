$(document).ready(function() {
    async function refresh_appointments(date){
        var parent = $(".appointments");
        var client_id = $("#client-id").val();
        $.ajax({
        url: `/clients/${client_id}/all_appointments?date=${date}`,
        method: 'GET',
        success: function(data) {
            parent.empty();
            data.appointments.forEach(appointment => {
                var appointment_div = $('<div></div>').addClass('appointment').attr('id', appointment._id);
                var datetime = new Date(appointment.appointment_time);
                var year = datetime.getFullYear();
                var month = datetime.getMonth();
                var day = datetime.getDate()
                var header = $('<h2></h2>').text(`Дата и Время: ${year}.${month}.${day} ${appointment.time}`);
                var doctor_p = $('<p></p>').text(`Принимающий врач: ${appointment.doctor_full_name}`);
                var animal_p = $('<p></p>').text(`Записанное животное: ${appointment.animal_data}`);
                var btn_cancel = $('<button></button>').addClass('reject').text(`Отменить`);
                btn_cancel.on("click", handle_cancel);
                appointment_div.append(header).append(doctor_p).append(animal_p).append(btn_cancel);
                parent.append(appointment_div);
            })
        },
        error: function(error) {
            console.error('Ошибка при отправке данных:', error);
        }
        });
    }
    async function handle_cancel(event){
        var appointment_id = $(event.target).parent().attr('id');
        var client_id = $("#client-id").val();
        await fetch(`/clients/${client_id}/appointments/cancel/${appointment_id}`, {
            method: 'PATCH',
        })
        .then(async (response) => {
            if(response.status == 200){
                const selectedDate = $("#date-filter").val();
                var date = new Date();
                if (selectedDate != "") {
                    date = new Date(selectedDate);
                }
                await refresh_appointments(date);
            }
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
    }
    async function handleDateChange(event) {
        try {
            const selectedDate = $(event.target).val();
            var date = new Date();
            if (selectedDate != "") {
                date = new Date(selectedDate);
            }
            await refresh_appointments(date);
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
});