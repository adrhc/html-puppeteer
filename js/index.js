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
        const personsRepository = new PersonsRepository();

        const tableElementAdapter = new TableElementAdapter("personsTable", "readOnlyRowTmpl");
        const readOnlyRow = new ReadOnlyRow(tableElementAdapter, {rowTmplId: "readOnlyRowTmpl"});
        const editableRow = new EditableRow(tableElementAdapter, {rowTmplId: "editableRowTmpl"});
        const buttonsRow = new ButtonsRow(tableElementAdapter);
        const tableEditorView = new TableEditorView(readOnlyRow, editableRow, buttonsRow, tableElementAdapter);
        const entityHelper = new EntityHelper(new FormsHelper("editorForm"));
        new TableEditorComponent(tableEditorView, tableElementAdapter, entityHelper, personsRepository).init();

        const dynaSelOneView = new DynamicSelectOneView("dyna-sel-one", "the name to search for");
        const dynaSelOneState = new DynamicSelectOneState(personsRepository);
        const dynaSelOneComp = new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState);
        dynaSelOneComp.init();
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
