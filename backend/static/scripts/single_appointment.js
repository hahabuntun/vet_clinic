$(document).ready(function() {
    $("#procedureForm").on("submit", handleSubmitProcedure);
    $("#diagnosisForm").on("submit", handleSubmitDiagnosis);
    $("#symptomForm").on("submit", handleSubmitSymptom);
    if($('#btn-finish').length){
            $("#btn-finish").on("click", handle_finish);
    }
    async function handleSubmitProcedure(event){
        event.preventDefault();
        try{
            const formData = new FormData(event.target);
            await fetch(`/appointments/${$('#page-id').val()}/procedures`, {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
            if (response.status == 201){
                await refresh_procedures();
            }
            })
            .catch(error => {
                console.log(error);
            });
        }catch(error){
            console.log(error);
        }
    }
    async function handleSubmitDiagnosis(event){
        event.preventDefault();
        try{
            const formData = new FormData(event.target);
            await fetch(`/appointments/${$('#page-id').val()}/diagnosis`, {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
            if (response.status == 201){
                await refresh_diagnosis();
            }
            })
            .catch(error => {
                console.log(error);
            });
        }catch(error){
            console.log(error);
        }
    }
    async function handleSubmitSymptom(event){
        event.preventDefault();
        try{
            const formData = new FormData(event.target);
            await fetch(`/appointments/${$('#page-id').val()}/symptoms`, {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
            if (response.status == 201){
                await refresh_symptoms();
            }
            })
            .catch(error => {
                console.log(error);
            });
        }catch(error){
            console.log(error);
        }
    }
    async function refresh_symptoms(){
        var animal_card_page_id = $("#page-id").val();
        var parent = $("#symptomsList");
        await $.ajax({
        url: `/appointments/${animal_card_page_id}/symptoms`,
        method: 'GET',
        success: function(data) {
            parent.empty();
            data.symptoms.forEach(symptom => {
                parent.append($(`<li>${symptom.name}</li>`))
            })
        },
        error: function(error) {
            console.error('Ошибка при отправке данных:', error);
        }
        });
    }
    async function refresh_diagnosis(){
        var animal_card_page_id = $("#page-id").val();
        var parent = $("#diagnosisList");
        await $.ajax({
        url: `/appointments/${animal_card_page_id}/diagnosis`,
        method: 'GET',
        success: function(data) {
            parent.empty();
            data.diagnosises.forEach(diagnosis => {
                parent.append($(`<li>${diagnosis.name}</li>`))
            })
        },
        error: function(error) {
            console.error('Ошибка при отправке данных:', error);
        }
        });
    }
    async function refresh_procedures(){
        var animal_card_page_id = $("#page-id").val();
        var parent = $("#procedureList");
        await $.ajax({
        url: `/appointments/${animal_card_page_id}/procedures`,
        method: 'GET',
        success: function(data) {
            parent.empty();
            data.procedures.forEach(procedure => {
                parent.append($(`<li>${procedure.name}</li>`))
            })
        },
        error: function(error) {
            console.error('Ошибка при отправке данных:', error);
        }
        });
    }
    async function handle_finish(event){
        try{
            await fetch(`/appointments/${$('#page-id').val()}/finish`, {
                method: 'PATCH',
            })
            .then(async (response) => {
            if (response.status == 200){
                $("#status").text("Статус приема: завершен");
                $('#finish-header, #btn-finish').remove();
            }
            })
            .catch(error => {
                console.log(error);
            });
        }catch(error){
            console.log(error);
        }
    }
    refresh_symptoms()
    refresh_procedures()
    refresh_diagnosis()
});