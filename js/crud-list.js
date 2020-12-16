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
        const items = [{id: 1, name: "dog1"}, {id: 2, name: "dog2"}, {id: 3, name: "dog3"}];

        // dogs table with both read-only and editable row
        const tableId = "dogsTable";
        const tableRelativePositionOnCreate = "append";

        const readOnlyRow = SimpleRowFactory.prototype.createIdentifiableRow(
            tableId, {tableRelativePositionOnCreate});
        const editableRow = SimpleRowFactory.prototype.createIdentifiableRow(
            tableId, {
                rowTmpl: "dogsTableEditableRowTmpl",
                tableRelativePositionOnCreate
            });
        // doesn't make sense to use tableRelativePositionOnCreate
        // because the row to delete always have to already exist
        const deletableRow = SimpleRowFactory.prototype.createIdentifiableRow(
            tableId, {
                rowTmpl: "dogsTableDeletableRowTmpl"
            });

        const component = CrudListFactory.prototype
            .create({items, tableId, readOnlyRow, editableRow, deletableRow});

        component
            .init()
            .then(() => {
                component.doWithState((crudListState) => {
                    crudListState.createNewItem().name = `new dog (with table ${tableRelativePositionOnCreate})`;
                    crudListState.updateItem({id: 3, name: "updated dog3"});
                    crudListState.removeById(2);
                    crudListState.insertItem({
                            id: 2,
                            name: `restored dog2 (with table ${tableRelativePositionOnCreate})`
                        },
                        tableRelativePositionOnCreate === "append");
                });
            });
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
