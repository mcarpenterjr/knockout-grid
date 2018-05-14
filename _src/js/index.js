function grid_data() {
  var self = this;
  self.items = [];
  $.getJSON('php/getSampleData.php', function(data, textStatus) {
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        self.items.push(data[i]);
      }
  });
}
var grid = new grid_data();

function magic_grid(data) {
  var self = this;
  // console.log(data);
  self.items = ko.observableArray(data.items);
  
  self.load = function() {
    var self = this;
    
    var grids = $('ko-table');

    if (grids.length > 0) {
      $(grids).each(function(idx, el) {
        var table;
        if ($(el).attr('theme') == 'boot-strap') {
          var hover = $(el).attr('hover') ? 'table-hover' : null,
          bordered = $(el).attr('borders') ? 'table-bordered' : null,
          compact = $(el).attr('compact') ? 'table-condensed' : null,
          striped = $(el).attr('striped') ? 'table-striped' : null,
          id = $(el).attr('table-id') ? $(el).attr('table-id') : null;

          if ($(el).attr('responsive')) {
            table = `<div class="table-responsive"><table id="${id}" class="table ${hover} ${bordered} ${compact} ${striped}"></table></div>`;
          }
          else {
            table = `<table id="${id}" class="${hover} ${bordered} ${compact} ${striped}"></table>`;
          }
        }
        $(el).append(table);
      });
    }
  };
}
var grid_model = new magic_grid(grid);
// init();

$(document).ready(function() {
  
  grid_model.load();
});