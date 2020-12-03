# js commands
### delete all rows
```javascript 1.8
var htmlTableAdapter = new HtmlTableAdapter('personsTable');
htmlTableAdapter.deleteAllRows();
```
### add rows
```javascript 1.8
new EditableTableComponent(DATA, "personsTable", "readOnlyRowTmpl", "editableRowTmpl").render();
```
