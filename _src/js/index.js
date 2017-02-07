$(document).ready(function() {
  $('#load').click(function() {
    ko.applyBindings(viewModel);
  });
});

function model() {
  var self = this;
  self.data = [];
  $.getJSON('php/getSampleData.php', function(data, textStatus) {
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        self.data.push(data[i]);
      }
  });
}
var model = new model();

function koGrid(data) {
  var self = this;
  // console.log(data);
  self.items = ko.observableArray(data);

}
var viewModel = new koGrid(model.data);
// init();
