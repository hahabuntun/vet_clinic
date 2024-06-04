$(document).ready(function() {
    async function refresh_appointments(date){
        console.log("here")
        var parent = $(".appointments");
        $.ajax({
        url: `/appointments?confirmed=${true}&date=${date}`,
        method: 'GET',
        success: function(data) {
            parent.empty();
            data.appointments.forEach(appointment => {
                var appointment_div = $('<div></div>').addClass('appointment').attr('id', appointment._id);
                var datetime = new Date(appointment.appointment_time);
                var year = datetime.getFullYear();
                var month = datetime.getMonth() + 1;
                var day = datetime.getDate()
                var header = $('<h2></h2>').text(`Дата и Время: ${year}.${month}.${day} ${appointment.time}`);
                var doctor_p = $('<p></p>').text(`Принимающий врач: ${appointment.doctor_full_name}`);
                var animal_p = $('<p></p>').text(`Записанное животное: ${appointment.animal_data}`);
                var service_p = $('<p></p>').text(`Оказываемая услуга: ${appointment.service_name}`);
                var client_p = $('<p></p>').html(`Хозяин животного: <a href="/clients/${appointment.client_id}/pets">${appointment.client_data}</a>`);
                var client_phone_p = $('<p></p>').text(`Номер хозяина: ${appointment.client_phone}`);
                var btn_approve = $('<button></button>').addClass('approve').text(`Начать прием`);
                btn_approve.on("click", handle_start);
                var btn_decline = $('<button></button>').addClass('reject').text(`Отменить`);
                btn_decline.on("click", handle_cancel);
                appointment_div.append(header).append(doctor_p).append(animal_p).append(service_p).append(client_p).append(client_phone_p)
                .append(btn_approve).append(btn_decline);
                parent.append(appointment_div);
            })
        },
        error: function(error) {
            console.error('Ошибка при отправке данных:', error);
        }
        });
    }
    async function handle_start(event){
        var appointment_id = $(event.target).parent().attr('id');
        await fetch(`/appointments/start/${appointment_id}`, {
            method: 'POST',
        })
        .then(async (response) => {
            if(response.status == 201){
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
    async function handle_cancel(event){
        var appointment_id = $(event.target).parent().attr('id');
        await fetch(`/appointments/cancel/${appointment_id}`, {
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