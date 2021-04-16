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
        // DYNAMIC-SELECT-ONE
        DynamicSelectOneFactory.create("dyna-sel-one", DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {
            cacheSearchResults: false
        }).init();

        // EDITABLE-LIST
        // dogs table with both read-only and editable row
        const elemIdOrJQuery = "personsTable";
        const tableRelativePositionOnCreate = "prepend";

        const readOnlyRow = SimpleRowFactory.createIdentifiableRow(
            {
                elemIdOrJQuery, tableRelativePositionOnCreate
            });
        const editableRow = SimpleRowFactory.createIdentifiableRow(
            {
                elemIdOrJQuery, rowTmplId: "personsTableEditableRowTmpl"
            });
        // doesn't make sense to use tableRelativePositionOnCreate
        // because the row to delete always have to already exist
        const deletableRow = SimpleRowFactory.createIdentifiableRow(
            {
                elemIdOrJQuery, rowTmplId: "personsTableDeletableRowTmpl"
            });

        const component = EditableListFactory.create({
            elemIdOrJQuery,
            repository: DbMock.PERSONS_REPOSITORY,
            readOnlyRow,
            editableRow,
            deletableRow,
            extractedEntityConverterFn: Person.parse
        });

        component.init();
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
