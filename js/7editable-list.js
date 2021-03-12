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
        // dogs table with both read-only and editable row
        const tableIdOrJQuery = "dogsTable";
        const tableRelativePositionOnCreate = "prepend";

        const readOnlyRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery, tableRelativePositionOnCreate
            });
        const editableRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery, rowTmplId: "dogsTableEditableRowTmpl"
            });
        // doesn't make sense to use tableRelativePositionOnCreate
        // because the row to delete always have to already exist
        const deletableRow = SimpleRowFactory.createIdentifiableRow(
            {
                tableIdOrJQuery, rowTmplId: "dogsTableDeletableRowTmpl"
            });

        const repository = new InMemoryCrudRepository(DbMock.DOGS, undefined, (it) => {
            it.id = Math.abs(it.id);
            return it;
        });
        const component = EditableListFactory.create({repository, tableIdOrJQuery, readOnlyRow, editableRow, deletableRow});

        component
            .init()
            .then(() => component.doWithState((state) => {
                /**
                 * @type {CrudListState}
                 */
                const crudListState = state;
                crudListState.updateItem({id: 3, name: "component only (not repository) updated dog3"});
                crudListState.removeById(2);
                crudListState.insertItem({
                    id: 2,
                    name: `component only (not repository) restored dog2 (using append)`
                }, true);
                crudListState.insertItem({
                    id: 4,
                    name: `component only (not repository) added dog4 (using prepend)`
                }, false);
                crudListState.insertItem({
                    id: 5,
                    name: `component only (not repository) added dog5 (using append)`
                }, true);
            }));
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
