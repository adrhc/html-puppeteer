if (Modernizr.template) {
    $.ajaxSetup({
        contentType: 'application/json',
        processData: false
    });
    $.ajaxPrefilter(function (options) {
        if (options.contentType === 'application/json' && options.data) {
            options.data = JSON.stringify(options.data);
        }
    });
    $(() => {
        const htmlTableAdapter = new HtmlTableAdapter("personsTable", "readOnlyRowTmpl");
        const readOnlyRow = new ReadOnlyRow(htmlTableAdapter, {rowTmplId: "readOnlyRowTmpl"});
        const editableRow = new EditableRow(htmlTableAdapter, {rowTmplId: "editableRowTmpl"});
        const buttonsRow = new ButtonsRow(htmlTableAdapter);
        const tableEditorView = new TableEditorView(readOnlyRow, editableRow, buttonsRow, htmlTableAdapter);
        const entityHelper = new EntityHelper(new FormsHelper("editorForm"));
        const personsRepository = new PersonsRepository();

        new TableEditorComponent(tableEditorView, htmlTableAdapter, entityHelper, personsRepository).init();

        const dynaSelOneView = new DynamicSelectOneView("dyna-sel-one", "the name to search for");
        const dynaSelOneState = new DynamicSelectOneState(personsRepository);
        const dynaSelOneComp = new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState);
        dynaSelOneComp.init();
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
