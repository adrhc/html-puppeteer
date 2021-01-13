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
        const personsRepository = DbMock.PERSONS_REPOSITORY;

        // DYNAMIC-SELECT-ONE
        DynamicSelectOneFactory.create("dyna-sel-one", personsRepository, {
            useLastSearchResult: false
        }).init();

        // EDITABLE-LIST
        // dogs table with both read-only and editable row
        const tableIdOrJQuery = "personsTable";
        const tableRelativePositionOnCreate = "prepend";

        const readOnlyRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery, tableRelativePositionOnCreate
            });
        const editableRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery,
                rowTmpl: "personsTableEditableRowTmpl",
                tableRelativePositionOnCreate
            });
        // doesn't make sense to use tableRelativePositionOnCreate
        // because the row to delete always have to already exist
        const deletableRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery,
                rowTmpl: "personsTableDeletableRowTmpl"
            });

        const component = EditableListFactory.create({
            tableIdOrJQuery,
            repository: personsRepository,
            readOnlyRow,
            editableRow,
            deletableRow
        });

        component.init();
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
