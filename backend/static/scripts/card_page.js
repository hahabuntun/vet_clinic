$(document).ready(function() {
            
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
    refresh_symptoms()
    refresh_procedures()
    refresh_diagnosis()
});