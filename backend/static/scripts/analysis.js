$(document).ready(function() {
  // Function to fetch and display analysis data for an animal
  var animal_id = $('#animal-id').val();
  var user_type = $("#user_type").val();
  var get_all_url = `/download_animal_client/${animal_id}`;
  var download_url = '/download_client/';
  if(user_type == "doctor"){
    get_all_url = `/download_animal_doctor/${animal_id}`
    download_url = '/download_doctor/'
  }
  function fetchAnalysisData() {
    console.log(animal_id);;
    $.ajax({
      url: get_all_url,
      type: 'GET',
      success: function(response) {
        const analysisData = $('#analysisData');
        analysisData.empty();
        response.forEach(analysis => {
          analysisData.append(`
            <div class="analysis-item">
              <p><strong>Название:</strong> ${analysis.name}</p>
              <p><strong>Описание:</strong> ${analysis.description}</p>
              <p><strong>Дата:</strong> ${new Date(analysis.analysis_date).toLocaleDateString()}</p>
              <a href="${download_url}${analysis._id}">Скачать файл</a>
              <hr>
            </div>
          `);
        });
      },
      error: function(response) {
        $('#message').text('Error retrieving analysis data');
      }
    });
  }

  // Upload form submission
  $('#uploadForm').submit(function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    console.log(formData);
    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        $('#message').text('File uploaded successfully');
        fetchAnalysisData();
      },
      error: function(response) {
        $('#message').text('Error uploading file');
      }
    });
  });

  // Initial fetch of analysis data
  fetchAnalysisData();
});
