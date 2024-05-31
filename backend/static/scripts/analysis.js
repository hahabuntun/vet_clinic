$(document).ready(function() {
  // Function to fetch and display analysis data for an animal
  var animal_id = $('#animal-id').val();
  
  function fetchAnalysisData() {
    console.log(animal_id);;
    $.ajax({
      url: `/animal/${animal_id}`,
      type: 'GET',
      success: function(response) {
        const analysisData = $('#analysisData');
        analysisData.empty();
        response.forEach(analysis => {
          analysisData.append(`
            <div class="analysis-item">
              <p><strong>Name:</strong> ${analysis.name}</p>
              <p><strong>Description:</strong> ${analysis.description}</p>
              <p><strong>Analysis Date:</strong> ${new Date(analysis.analysis_date).toLocaleDateString()}</p>
              <a href="/download/${analysis._id}">Download File</a>
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
