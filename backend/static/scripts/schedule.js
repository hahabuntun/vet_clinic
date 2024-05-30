$(document).ready(function() {
    function set_date() {
        $('input[type="date"]').each(function() {
            var selected_date = new Date().toISOString().slice(0, 10);
            $(this).val(selected_date).trigger('change');
        });
    }
    async function refresh_doctor_div(doctor_div, doctor_id, date) {
        try {
            date.setHours(date.getHours());
            console.log(date);
            const response = await $.ajax({
                url: `/doctor_schedule/${doctor_id}?date=${date}`,
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    $(doctor_div).find('.scheduleEntry').remove();
                    var helper = $(doctor_div).find('hr');
                    var appointments = data.appointments;
                    appointments.forEach(function(appointment) {
                        var schedEntry = $('<div></div>').addClass('scheduleEntry').attr('id', appointment._id);
                        var span = $('<span></span>').text(`${appointment.service_name} - ${appointment.time}`);
                        var btn = $('<button></button>').addClass('deleteBtn').html('&#10006;');
                        btn.on("click", handleEntryDeleted);
                        var marker = "";
                        if(appointment.animal_card_page_id){
                            marker = $('<span></span>').addClass('blue-text').text('п');
                        }
                        else if(appointment.animal_id){
                            marker = $('<span></span>').addClass('green-text').text('з');
                        }
                        else{
                            marker = $('<span></span>').addClass('red-text').text('нз');
                        }
                        schedEntry.append(span).append(btn).append(marker);
                        helper.before(schedEntry);
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
    async function handleEntryAdded(event) {
        const selectedDate = $(event.target).parent().find('input[type="date"]').val();
        const doctor_id = $(event.target).parent().find('input[type="date"]').attr('id');
        var date = new Date();
        if (selectedDate != ""){
            date = new Date(selectedDate);
        }
        try{
            event.preventDefault();
            const formData = new FormData(event.target);
            formData.append('date', date);
            await fetch(`/doctor_schedule`, {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
            if (response.status == 201){
                await refresh_doctor_div($(event.target).parent(), doctor_id, date);
            }
            })
            .catch(error => {
                console.log(error);
            });
        }catch(error){
            console.log(error);
        }
    }
    async function handleEntryDeleted(event) {
        try {
            const selectedDate = $(event.target).parent().parent().find('input[type="date"]').val();
            const doctor_id = $(event.target).parent().parent().find('input[type="date"]').attr('id');
            const appointment_id = $(event.target).parent().attr('id');
            console.log(appointment_id);
            var date = new Date();
            if (selectedDate != ""){
                date = new Date(selectedDate);
            }
            await fetch(`/doctor_schedule/${appointment_id}`, {
                method: 'delete',
            })
            .then(async (response) => {
            if (response.status == 200){
                await refresh_doctor_div($(event.target).parent().parent(), doctor_id, date);
            }
            })
            .catch(error => {
                console.log(error);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }
    function add_change_date_handlers() {
        $('input[type="date"]').on('change', handleDateChange);
    }
    function add_insert_schedule_entry_handlers() {
        $('.add-entry-form').on('submit', handleEntryAdded);
    }
    function add_delete_schedule_entry_handlers() {
        $('.deleteBtn').on('click', handleEntryDeleted);
    }
    add_change_date_handlers();
    set_date();
    add_insert_schedule_entry_handlers();
    add_delete_schedule_entry_handlers();
});
