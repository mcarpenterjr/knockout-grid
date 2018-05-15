# ko-table

>>>
The ko-table project attempts to be a library for creating `<table></table>` from
custom elements in the dom.
>>>

## spec -

* The element shall be specified by `ko-table`
* Attributes shall define the properties of the table.
  * No attribute with the exception of the `source` attribute shall be required.
  * Custom attributes shall be allowed only if the instance of the `ko-table`
    library has been extended to accept the custom attributes.
  * [Read More...](#attributes)

## attributes

The current default set of attributes -

* `source="/path/to/a/json/source"`
  * The source attribute should specify a location that returns JSON. [Sample Structure](#json)
* `responsive="BOOL"`
  * Specifies if a table should behave in a responsive manner, mostly handy
    in places where the data will be accessed by tablet users.
* `hover="BOOL"`
  * Turns row highlighting on hover on or off.
* `borders="BOOL"`
  * Toggles cell borders.
* `fixed-header="BOOL"`
  * Determines if the header is in an affixed position at the top of the table.
* `striped="BOOL"`
  * Toggles row stripping.
* `compact="BOOL"`
  * Uses a theme's compact table class if available.
* `theme="STRING"`
  * Currently `boot-strap` is the only available theme. When set the table will
    have the default classes and layout of the theme.

## data structure

### JSON

>>>
The JSON data structure should have 2 main nodes, once node shall contain the
header/column specifications of the table and the other node shall contain the
data to be displayed.
>>>

```json
{
  "header": [
    {
      "title": "Col 1",
      "col_name": "column_1_string",
      "data_type": "string"
    }, {
      "title": "Col 2",
      "col_name": "column_2",
      "data_type": "int"
    }, {
      "title": "Col 3",
      "col_name": "column_3",
      "data_type": "mixed"
    }
  ],
  "data": [
    {
      "column_1_string": "aname",
      "column_2": "450",
      "column_3": "some other data"
    }, {
      "column_1_string": "aname",
      "column_2": "450",
      "column_3": "some other data"
    }, {
      "column_1_string": "aname",
      "column_2": "450",
      "column_3": "some other data"
    }, {
      "column_1_string": "aname",
      "column_2": "450",
      "column_3": "some other data"
    }, {
      "column_1_string": "aname",
      "column_2": "450",
      "column_3": "some other data"
    }, {
      "column_1_string": "aname",
      "column_2": "450",
      "column_3": "some other data"
    }, {
      "column_1_string": "aname",
      "column_2": "450",
      "column_3": "some other data"
    }
  ]
}
```