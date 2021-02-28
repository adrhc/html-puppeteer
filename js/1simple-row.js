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
        return SimpleRowFactory.createIdentifiableRow({
            tableIdOrJQuery: dogsTableWithEdit,
            rowTmplId: "dogsTableWithEditSelectedRowTmpl",
            tableRelativePositionOnCreate: "prepend",
            initialState: initialData ? new RowValues(initialData, {}) : undefined
        });
    }

    const dogsTableWithDelete = "dogsTableWithDelete";

    /**
     * @param {*} [initialData]
     * @return {IdentifiableRowComponent}
     */
    function createDogsWithDeleteRow(initialData) {
        return SimpleRowFactory.createIdentifiableRow({
            tableIdOrJQuery: dogsTableWithDelete,
            rowTmplId: "dogsTableWithDeleteDeletedRowTmpl",
            initialState: initialData ? new RowValues(initialData, {}) : undefined
        });
    }

    $(() => {
        SimpleListFactory.create({
            items: DbMock.DOGS,
            tableIdOrJQuery: dogsTableWithEdit
        }).init().then(updateAllStateChanges => {
            const items = updateAllStateChanges[0].stateOrPart;
            const item0 = items[0];
            const item1 = items[1];
            const row0 = createDogsWithEditRow(item0);
            return row0.init().then(() => {
                // here editableRow.view.$elem is not initialized
                const extractedEntity = row0.extractEntity();
                AssertionUtils.isNull(extractedEntity);
            }).then(() => {
                // besides updating the row representation this also initializes editableRow.view.$elem
                return row0.update({id: item0.id, name: `${item0.name}-updated`});
            }).then(() => {
                const extractedEntity = row0.extractEntity();
                AssertionUtils.isNotNull(extractedEntity.name === `${item0.name}-updated`);
            }).then(() => {
                // creating a new row
                const newRow = createDogsWithEditRow();
                return newRow.update({id: IdentifiableEntity.TRANSIENT_ID, name: "TRANSIENT dog (after dog 3)"}, 3);
            }).then(() => {
                // creating a new row
                const newRow = createDogsWithEditRow();
                return newRow.update({
                    id: 777,
                    name: `new dog (id = 777, row's default positioning: ${newRow.simpleRowView.tableRelativePositionOnCreate})`
                });
            }).then(() => {
                const row1 = createDogsWithEditRow(item1);
                return row1.update({id: 999, name: `${item1.name} id changed to 999`}).then(() => row1);
            }).then((row1) => {
                const extractedEntity = row1.extractEntity();
                AssertionUtils.isNotNull(extractedEntity.id === 999);
            });
        });

        // dogs table with deleted row
        SimpleListFactory.create({
            items: DbMock.DOGS,
            tableIdOrJQuery: dogsTableWithDelete,
            bodyRowTmplId: "dogsTableWithDeleteReadOnlyRowTmpl"
        }).init().then(updateAllStateChanges => {
            const items = updateAllStateChanges[0].stateOrPart;
            const item0 = items[0];
            const item2 = items[2];
            const row0 = createDogsWithDeleteRow(item0);
            // switching to "simpleRow" display type (i.e. line-through text style)
            return row0.init()
                // removing the row
                .then(() => row0.update())
                .then(() => {
                    const $tr1 = $(`#${dogsTableWithDelete} tr[data-owner='${dogsTableWithDelete}'][data-id='${item0.id}']`);
                    AssertionUtils.isFalse(!!$tr1.length);
                })
                // rendering the "delete" representation
                .then(() => {
                    const row2 = createDogsWithDeleteRow();
                    return row2.update(item2);
                });
        });

    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
