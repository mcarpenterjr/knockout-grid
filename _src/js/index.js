function grid_data() {
  var self = this;
  self.grids = [];
  self.gridUIDS = {};
}
var ko_grid = new grid_data();

function magic_grid(data) {
  var self = this;
  // console.log(data);
  self.items = ko.observableArray(data.items);
  
  self.load = function() {
    var self = this;
    
    var koGrids = $('ko-table');

    if (koGrids.length > 0) {
      $(koGrids).each(function(idx, el) {

        // MIND BLOWN -
        // http://www.purplesquirrels.com.au/2013/04/getting-all-element-attribute-values-with-jquery/
        options = [];
        $.each($(el).get(0).attributes, function(i, attr) {
          options[attr.name] = attr.value;
        });
        options.dom_element = el;
        options.grid_index = idx;
        console.log(options);

        ko_grid.grids.push(new Grid(options));
      });
    }
  };

  function Grid(data) {
    var self = this;

    // Root Element
    self.dom_element = data.dom_element;
    self.grid_index = parseInt(data.grid_index);

    self.id = data.id || self.getUID();
    self.source = data.source || null;
    self.fixed = data['fixed-header'] || null;
    self.hover = data.hover || null;
    self.compact = data.compact || null;
    self.striped = data.striped || null;
    self.bordered = data.borders || null;
    self.template = data.theme || null;
  
    // Header Data For table/grid
    self.header = ko.observableArray();
    // Body Data for table/grid
    self.rows = ko.observableArray();

    /**8                     DATA MODIFIERS                     8**/
    /*                                                            */
    /* NOTE: Data modifiers are flags that indicate if an action  */
    /* is occurring. The definitions are below.                   */
    /*                                                            */
    /* @sortTog - Indicates if sorting is active on the tables    */
    /* data.                                                      */
    /* @sortDef - Indicates if the default sort is active on the  */
    /* data.                                                      */
    /* @scraping - Indicates if data is being refreshed or        */
    /* activley being retreived.                                  */
    /*                                                            */
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

    self.dataMods = {
      sortTog: ko.observable(false),
      sortDef: ko.observable(false),
      scraping: ko.observable(false)
    };
    // Filter Data
    self.filters = ko.observableArray();
    self.rows_sort_order = ko.observableArray();
    self.rows_sorted = ko.pureComputed(function() {
      var a = self.rows().slice(),
        hasSort = self.dataMods.sortTog(),
        defaultSort = self.dataMods.sortDef(),
        sp = parseInt(self.paginated.selectedPage()),
        spp = parseInt(self.paginated.selectedPerPage()),
        args = self.rows_sort_order(),
        filts = self.filters();

      if (hasSort) {
        if (defaultSort) {
          args = defaults.concat(self.market_data_sort_order());
        }
        a.sort(app.makeSort(args));
      }

      if (filts.length > 0) {
        for (var i = 0; i < filts.length; i++) {
          var filter = filts[i];
          a = a.filter(app.makeFilter(filter));
        }
        console.log(a);
      }

      var start = parseInt((sp - 1) * spp),
        end = parseInt(sp * spp);
      a = a.slice(start, end);

      return a;
    }).extend({
      deferred: true
    });
    // Pagination Model
    self.paginated = {
      perPage: ko.observableArray([5,10,20,50,100,250,500,1000]),
      selectedPerPage: ko.observable(100),
      selectedPage: ko.observable(1),
      totalResults: ko.computed(function() {
        var vis = 0;
        for (var i = 0; i < self.rows().length; ++i) {
          var row = self.rows()[i];
          vis++;
          // if (row.fm.visible()) {
          //   // visibility conditional if needed.
          // }
        }
        return vis;
      }),
      totalPagesList: ko.observableArray(),
      totalPages: ko.pureComputed(function() {
        var pp = self.paginated.selectedPerPage(),
          tr = self.paginated.totalResults(),
          tp = [];
        var tpInt = Math.ceil(parseInt(tr) / parseInt(pp));

        var i = 0;
        do {
          i += 1;
          tp.push({page: i});
        } while(i < tpInt);
        // console.log(tp)
        self.paginated.selectedPage(1);
        // Callbacks for after pagination has completed.
        // app.makeTableNice('#part-view');
        // app.makeTableNice('.watch-table');
        return tp;
      }).extend({
        deferred: true
      })
    };

    // Make Chaining work.
    return this;
  }
  Grid.prototype.getData = function() {
    var self = this;
    $.getJSON('php/getSampleData.php', function(data, textStatus) {
      // console.log(data);
      for (var i = 0; i < data.rows.length; i++) {
        var row = data.rows[i],
         cells = [];

        Object.keys(row).map(function(key) {
          // ES6 Computed Property Name.
          var cell = {
            'key': [key] || '',
            'value': row[key] || ''
          };
          cells.push(cell);
        });
        row.cells = cells;
        // console.log(Object.keys(row));

        self.rows.push(new Row(row));
      }
      for (var i = 0; i < data.header.length; i++) {
        var colHeader = data.header[i];
        // console.log(colHeader);
        self.header.push(new ColHeader(colHeader));
      }
    });

    // Make Chaining work.
    return this;
  };
  Grid.prototype.createTable = function(callback) {
    var self = this;

    var classes = [],
    thead = `<thead>
              <tr data-bind="foreach: header">
                <th data-bind="text: title"></th>
              </tr>
            </thead>`,
    tbody = `<tbody data-bind="foreach: rows_sorted">
              <tr data-bind="foreach: cell_data">
                <td data-bind="text: $data.value"></td>
              </tr>
            </tbody>`,
    tfoot = `<tfoot>
              <tr>
                <td data-bind="attr: {
                  colspan: header().length
                }" style="text-align: center;">
                <ul class="pagination" >
                  <li page-number="previous" class="disabled">
                    <a href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  <!-- ko foreach: paginated.totalPages -->
                    <li data-bind="attr: {
                      'page-number': page
                    }">
                      <a data-bind="text: page"></a>
                    </li>
                  <!-- /ko -->
                  <li page-number="next">
                    <a href="#" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
              </ul>
                </td>
              </tr>
            </tfoot>`;
    
    if (self.striped) {
      classes.push('table-striped');
    }
    if (self.bordered) {
      classes.push('table-bordered');
    }
    if (self.compact) {
      classes.push('table-condensed');
    }
    if (self.hovered) {
      classes.push('table-hover');
    }
    // have to space separate the array and then make a string.
    classes = classes.join(' ').toString();

    var table = `<table id="${self.id}"
      class="table ${classes}"
      data-bind="with: grids[${self.grid_index}]">
      ${thead} ${tbody} ${tfoot}
    </table>`;
    
    // Could be append to keep Custom Element Wrapper.
    // Incases where bootstrap is used as the theme,
    // we're going to replace the element, so we do not interfere,
    // with styling.
    $(self.dom_element).replaceWith(table);
    if (typeof callback === 'function') {
      callback();
    }
    
    // Make Chaining work.
    return self;
  };
  Grid.prototype.getUID = function() {
    // Inspired by this SOF answer https://stackoverflow.com/a/6248722/5063323
    while (true) {
      var uid = ("000000" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36)).slice(-6);
      if (!ko_grid.gridUIDS.hasOwnProperty(uid)) {
        ko_grid.gridUIDS[uid] = true;
        return uid;
      }
    }
  };
  Grid.prototype.loadEvents = function() {
    var self = this;
    // Paging event Handlers.
    $('#' + self.id).on('click', 'ul.pagination li', function(ev) {
      var pn = $(this).attr('page-number');
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      self.paginated.selectedPage(pn);
    });
  };

  function ColHeader(data) {
    var self = this;

    self.title = ko.observable(data.title);
    self.col_name = ko.observable(data.col_name);
    self.type = ko.observable(data.data_type);
    self.sort = ko.observable(data.sort);
    self.search = ko.observable(data.search);

  }

  function Row(data) {
    var self = this;

    self.cell_data = ko.observableArray(data.cells);
    // Object where all our computables are stored.
    self.fm = {
      visible: ko.computed(function() {
        // Always visbile
        return true;
      })
    };

  }

}
var grid_model = new magic_grid(ko_grid);
// init();

$(document).ready(function() {
  
  grid_model.load();
  ko_grid.grids.forEach(function(grid) {
    grid.createTable().getData().loadEvents();
  });
  
  ko.applyBindings(ko_grid);
});