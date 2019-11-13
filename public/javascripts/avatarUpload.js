let icon = $('#showUpload i')

$('#showUpload').click(function() {
  $('#uploadForm').toggle(1000)
  icon.toggleClass('fa-chevron-up')
  icon.toggleClass('fa-chevron-down')
})
