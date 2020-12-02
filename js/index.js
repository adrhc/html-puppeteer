if (Modernizr.template) {
    $.ajaxSetup({
        contentType: 'application/json',
        processData: false
    });
    $.ajaxPrefilter(function (options) {
        if (options.data) {
            options.data = JSON.stringify(options.data);
        }
    });
    $(() => {
        const htmlTableAdapter = new HtmlTableAdapter("personsTable", "tableBodyTmpl", "readOnlyRowTmpl");
        const readOnlyRow = new ReadOnlyRow(htmlTableAdapter, "readOnlyRowTmpl");
        const editableRow = new EditableRow(htmlTableAdapter, "editableRowTmpl");
        const buttonsRow = new ButtonsRow(htmlTableAdapter, "buttonsRowTmpl");
        const entityHelper = new EntityHelper(new FormsHelper("editorForm"));
        const personsRepository = new PersonsRepository();
        new EditableTable(htmlTableAdapter, readOnlyRow, editableRow, buttonsRow, entityHelper, personsRepository).init();
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
