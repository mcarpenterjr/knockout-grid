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
    var koGrids = $('ko-table'),
      filterModal = $('body').has('div#filter-modal');

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
        // console.log(options);

        ko_grid.grids.splice(idx, 0, new Grid(options));
        // .push(new Grid(options));
      });
    }

    if (filterModal.length <= 0) {
      $.get('templates/modal.html', function(data) {
        $('body').append(data);
        self.loadModal();
      });
    }
  };

  self.loadModal = function() {
    // var self = this;
    
    /**8                 Bootstrap Modal Events                 8**/
    /*                                                            */
    /* @show.bs.modal - This event fires immediately when the     */
    /* show instance method is called. If caused by a click, the  */
    /* clicked element is available as the relatedTarget property */
    /* of the event.                                              */
    /*                                                            */
    /* @shown.bs.modal - This event is fired when the modal has   */
    /* been made visible to the user (will wait for CSS           */
    /* transitions to complete). If caused by a click, the clicked*/
    /* element is available as the relatedTarget property of the  */
    /* event.                                                     */
    /*                                                            */
    /* @hide.bs.modal - This event is fired immediately when      */
    /* the hide instance method has been called.                  */
    /*                                                            */
    /* @hidden.bs.modal - This event is fired when the modal has  */
    /* finished being hidden from the user (will wait for CSS     */
    /* transitions to complete).                                  */
    /*                                                            */
    /* @loaded.bs.modal - This event is fired when the modal has  */
    /* loaded content using the remote option.                    */
    /*                                                            */
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/

    // Create an observable for tracking the target grid for the modal.
    ko_grid.tarGrid = ko.observable();
    
    $('div#filter-modal').modal({
      backdrop: true,
      keyboard: true,
      show: false
    }).on('click', 'button.add-filter', function(e) {
      var gridIDX = $(e.originalEvent.currentTarget).data('grid_idx');

      ko_grid.grids[gridIDX].filters.push(new TableFilter());
    }).on('click', 'button.add-filter-next', function(e) {
      var gridIDX = $(e.originalEvent.currentTarget).data('grid_idx');
      var index = $(this).closest('tr').attr('index'),
        idx = parseInt(parseInt(index) + 1);

      ko_grid.grids[gridIDX].filters.splice(idx, 0, new TableFilter());
    }).on('click', 'button.remove-filter', function(e) {
      var gridIDX = $(e.originalEvent.currentTarget).data('grid_idx');
      var idx = $(this).closest('tr').attr('index');

      ko_grid.grids[gridIDX].filters.splice(idx, 1);
    }).on('show.bs.modal', function(e) {
      $('select.filter-type', this).hide();
      $('input.filter-term', this).hide();
      // console.log('Showing Modal');
    }).on('shown.bs.modal', function(e) {
      var gridIDX = $(this).data('grid_idx');
      ko_grid.tarGrid(gridIDX);
      console.log(ko_grid.tarGrid());
      
      // var grid_id = $(this).data('grid_id'),
      //   grid = ko_grid.grids.find(function(grid) {
      //     return grid.id == grid_id;
      //   });

      //   $('select.filter-column', this).append(
      //     '<option value="">Select Column...</option>'
      //   );
      //   for (let i = 0; i < grid.header().length; i++) {
      //     const column = grid.header()[i];
          
      //     $('select.filter-column', this).append(
      //       '<option value="' + column.col_name() + '">' +
      //         column.title() +
      //       '</option>'
      //     );
      //   }
      
      // console.log('Modal Shown', $('select.filter-column', this));
    }).on('hide.bs.modal', function(e) {

      console.log('Hiding Modal');
    }).on('hidden.bs.modal', function(e) {
      $('div#filter-modal').removeData('grid_id');
      $('div#filter-modal').removeData('grid_idx');
      console.log('Modal Hidden');
    });
    ko.applyBindings(ko_grid, $('#filter-modal')[0]);
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
    self.filterable = data.filterable || null;
    self.paging = data.paging || null;
  
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
          a = a.filter(self.makeFilter(filter));
        }
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

    if (self.filterable) {
      var filter = `<tr>
        <td  data-bind="colspan: header().length">
          <button class="btn btn-primary btn-xs filter">Search 
            <i class="fa fa-search"></i>
          </button>
        </td>
      </tr>`;
    }

    if (self.paging) {
      // <div class="form-group col-xs-2">
      //   <label class="col-xs-2 control-label">Page: </label>
      //   <select class="form-control col-xs-6" data-bind="
      //     value: paginated.selectedPage()
      //   ">
      //   </select>
      // </div>
      var paging = `<tr>
        <td data-bind="attr: {
          colspan: header().length
        }" style="text-align: center;">
          <ul class="pagination" >
            <li page-number="previous" class="disabled">
              <a aria-label="Previous">
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
              <a aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </td>
      </tr>`;
    }

    var classes = [],
    thead = `<thead>
              ${filter}
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
              ${paging}
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

    var tuid = '#' + self.id;
    // Paging event Handlers.
    $(tuid).on('click', 'ul.pagination li', function(ev) {
      var pn = $(this).attr('page-number'),
        spn = self.paginated.selectedPage(),
        tp = self.paginated.totalPages().length;
      
      if (pn == 'next' || pn == 'previous') {
        var npn = pn == 'next' ? ++spn : pn == 'previous' ? --spn : null;
        // console.log(npn);
        if (npn >= 1 && npn <= tp) {
          // Clear the active class from all pagers
          $(this).siblings().removeClass('active');
          $(this).removeClass('active');
          $(this).siblings('[page-number="previous"]').removeClass('disabled');
          $(this).siblings('[page-number="next"]').removeClass('disabled');
          $(this).siblings("[page-number='" + npn + "']").addClass('active');
          self.paginated.selectedPage(npn);
          if (npn == 1) {
            // console.log('BOTTOM');
            $(this).addClass('disabled');
          }
          if (npn == 10) {
            // console.log('TOP');
            $(this).addClass('disabled');
          }
        }
      }
      else {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        self.paginated.selectedPage(pn);
      }
    });

    $(tuid).on('click', 'button.filter', function(ev) {
      console.log(self.id, self.grid_index);
      $('div#filter-modal').data('grid_id', self.id);
      $('div#filter-modal').data('grid_idx', self.grid_index);
      $('div#filter-modal').modal('show');
    });
  };
  Grid.prototype.makeFilter = function(filter) {
    return function(row) {
      const t = filter.typeR(),
        tm = filter.term(),
        col = filter.column(),
        item = row.cell_data();
      var val;

      console.log(item.key);
      if (typeof item[col] === "function") {
        val = parseInt(item[col]()) || item[col]();
      }
      else {
        val = item[col];
      }
      if (t == 'eq') {
        // Equals
        return val ==  tm;
      }
      else if (t == 'ne') {
        // Not Equals
        return val !=  tm;
      }
      else if (t == 'lt') {
        // Less Than
        return val < tm;
      }
      else if (t == 'le') {
        // Less Than or Equal
        return val <= tm;
      }
      else if (t == 'gt') {
        // Greater Than
        return val > tm;
      }
      else if (t == 'ge') {
        // Greater Than or Equals
        return val >= tm;
      }
      else if (t == 'bw') {
        // Begins With
        return val.startsWith(tm);
      }
      else if (t == 'bn') {
        // Does Not Begin With
        return val.startsWith(tm);
      }
      else if (t == 'ew') {
        // Ends With
        return val.endsWith(tm);
      }
      else if (t == 'en') {
        // Does Not End With
        return val.endsWith(tm);
      }
      else if (t == 'cn') {
        // Contains
        return val.includes(tm);
      }
      else if (t == 'ce') {
        // Does Not Contain
        return val.includes(tm);
      }
    };
  };

  function TableFilter(filt) {
    // Filter Object
    var self = this;

    self.column = ko.observable();
    self.typeR = ko.observable();
    self.term = ko.observable('');

    self.methods = ko.computed(function() {
      if (typeof self.column() != 'undefined' && self.column()) {
        var cur_col = ko_grid.grids[ko_grid.tarGrid()].header().find(function(el) {
          return el.col_name() == self.column();
        });
        return cur_col.searchMethods();
      }
    });
    console.log(self.methods);
  }

  function ColHeader(data) {
    var self = this;

    self.title = ko.observable(data.title);
    self.col_name = ko.observable(data.col_name);
    self.type = ko.observable(data.data_type);
    self.sort = ko.observable(data.sort);
    self.search = ko.observable(data.search);

    self.searchMethods = ko.computed(function() {
      // Returns all the available methods for filtering.
      var methods_string = [
        'bw', // Begins With
        'bn', // Does Not Begin With
        'ew', // Ends With
        'en', // Does Not End With
        'cn', // Contains
        'ce' // Does Not Contain
      ],
        methods_int = [
        'eq', // Equals
        'ne', // Not Equal
        'lt', // Less Than
        'le', // Less Than or Equals
        'gt', // Greater Than
        'ge' // Greater Than or Equal
      ];

      if (self.search() == true) {
        if (self.type() == 'string') {
          return methods_string;
        }
        else if (self.type() == 'numeric') {
          return methods_int;
        }
        else {
          return methods_string.concat(methods_int);
        }
      }
    });

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