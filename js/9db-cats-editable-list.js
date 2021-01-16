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
        const personsRepository = new DbCrudRepository("persons", () => new Person());
        const dynaSelOneRepository = new DbDynaSelOneRepository("person", () => new Person());

        // DYNAMIC-SELECT-ONE
        DynamicSelectOneFactory.create("dyna-sel-one", dynaSelOneRepository, {
            useLastSearchResult: false
        }).init();

        // EDITABLE-LIST
        // dogs table with both read-only and editable row
        const tableIdOrJQuery = "personsTable";
        const tableRelativePositionOnCreate = "prepend";

        // READ-ONLY ROW
        const readOnlyRow = SimpleRowFactory.createIdentifiableRow({
            tableIdOrJQuery,
            tableRelativePositionOnCreate
        });

        // EDITABLE ROW (using child component from CatsEditableListChildFactory)
        const editableRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery,
                rowTmpl: "personsTableEditableRowTmpl",
                childCompFactories: [new CatsEditableListChildFactory()]
            });

        // DELETABLE ROW
        // doesn't make sense to use tableRelativePositionOnCreate
        // because the row to delete always have to already exist
        const deletableRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery, rowTmpl: "personsTableDeletableRowTmpl"
            });

        // EDITABLE LIST
        const editableList = EditableListFactory.create({
            tableIdOrJQuery,
            repository: personsRepository,
            readOnlyRow,
            editableRow,
            deletableRow
        });

        editableList.init();
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
