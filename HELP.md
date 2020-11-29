# js commands
### delete all rows
```javascript 1.8
var table = new HtmlTableAdapter('personsTable');
table.deleteAllRows();
```
### add rows
```javascript 1.8
new TabularComponent(DATA, "personsTable", "readOnlyRowTmpl", "editableRowTmpl").render();
```
