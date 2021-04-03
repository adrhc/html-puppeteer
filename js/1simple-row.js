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

    // dogs table with editable row
    const dogsTableWithEdit = "dogsTableWithEdit";

    /**
     * @param {*} [initialData]
     * @return {IdentifiableRowComponent}
     */
    function createDogsWithEditRow(initialData) {
        return new IdentifiableRowComponent({
            elemIdOrJQuery: dogsTableWithEdit,
            bodyRowTmplId: `${dogsTableWithEdit}SelectedRowTmpl`,
            initialState: initialData ? new EntityRow(initialData) : undefined
        });
    }

    const dogsTableWithDelete = "dogsTableWithDelete";

    /**
     * @param {*} [initialData]
     * @return {IdentifiableRowComponent}
     */
    function createDogsWithDeleteRow(initialData) {
        return new IdentifiableRowComponent({
            elemIdOrJQuery: dogsTableWithDelete,
            bodyRowTmplId: `${dogsTableWithDelete}DeletedRowTmpl`,
            initialState: initialData ? new EntityRow(initialData) : undefined
        });
    }

    $(() => {
        const simpleListComponent = new SimpleListComponent({
            elemIdOrJQuery: dogsTableWithEdit,
            items: DbMock.DOGS,
        });
        simpleListComponent.init().then(updateAllStateChanges => {
            const items = updateAllStateChanges[0].stateOrPart;
            const item0 = items[0];
            const item1 = items[1];
            const rowId0 = createDogsWithEditRow(item0);
            return rowId0.init().then(() => {
                // here editableRow.view.$elem is not initialized
                const extractedEntity = rowId0.extractEntity();
                AssertionUtils.isNull(extractedEntity);
            }).then(() => {
                // besides updating the row representation this also initializes editableRow.view.$elem
                return rowId0.update(new EntityRow({id: item0.id, name: `${item0.name}-updated`}));
            }).then(() => {
                const extractedEntity = rowId0.extractEntity();
                AssertionUtils.isNotNull(extractedEntity.name === `${item0.name}-updated`);
            }).then(() => {
                // creating a new row
                const newRow = createDogsWithEditRow();
                const index = simpleListComponent.simpleListState.items.length;
                return newRow.update(new EntityRow({
                    id: IdentifiableEntity.TRANSIENT_ID,
                    name: `TRANSIENT dog (at index ${index}, aka row ${index + 1})`
                }, {index}));
            }).then(() => {
                // creating a new row
                const newRow = createDogsWithEditRow();
                return newRow.update({
                    entity: {
                        id: 777,
                        name: `new dog (id = 777, table's default positioning: ${newRow.simpleRowView.tableAdapter.rowPositionOnCreate})`
                    },
                    index: undefined
                });
            }).then(() => {
                const rowId1 = createDogsWithEditRow(item1);
                return rowId1
                    .update(new EntityRow({id: 888, name: `${item1.name} id (${item1.id}) changed to 888`}))
                    .then(() => rowId1);
            }).then((row1) => {
                const extractedEntity = row1.extractEntity();
                AssertionUtils.isTrue(extractedEntity.id === "888" && extractedEntity.name !== item1.name);
            }).then(() => {
                // creating a new row
                const newRow = createDogsWithEditRow();
                return newRow.update(new EntityRow(
                    {id: 999, name: `new dog (id = 999, added to end)`},
                    {index: TableElementAdapter.LAST_ROW_INDEX}
                )).then(() => newRow);
            }).then((newRow) => {
                const extractedEntity = newRow.extractEntity();
                const lastRowData = simpleListComponent.tableBasedView.tableAdapter.$getAllRows().last().data();
                AssertionUtils.isTrue(extractedEntity.id === "999" && lastRowData.id === 999);
            });
        });

        // dogs table with deleted row
        new SimpleListComponent({
            elemIdOrJQuery: dogsTableWithDelete,
            items: DbMock.DOGS
        }).then(updateAllStateChanges => {
            const items = updateAllStateChanges[0].stateOrPart;
            const item0 = items[0];
            const item2 = items[2];
            const rowId0 = createDogsWithDeleteRow(item0);
            // switching to "simpleRow" display type (i.e. line-through text style)
            return rowId0.remove()
                .then(() => {
                    const $tr1 = $(`#${dogsTableWithDelete} tr[data-owner='${dogsTableWithDelete}'][data-id='${item0.id}']`);
                    AssertionUtils.isFalse(!!$tr1.length);
                })
                // rendering the "delete" representation
                .then(() => rowId0.update(new EntityRow(item0, {index: 1})))
        });

    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
