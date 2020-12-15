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
        const dogs = [{id: 1, name: "dog1"}, {id: 2, name: "dog2"}, {id: 3, name: "dog3"}];

        // dogs table with editable row
        const dogsTableWithEdit = "dogsTableWithEdit";
        SimpleListFactory.prototype
            .create({items: dogs, tableId: dogsTableWithEdit})
            .init()
            .then(items => {
                const editableRow = SimpleRowFactory.prototype
                    .createIdentifiableRow(dogsTableWithEdit, {
                        rowTmpl: "dogsTableWithEditSelectedRowTmpl",
                        putAtBottomIfNotExists: true
                    });
                editableRow
                    // switch to existing row (aka enter "edit" mode)
                    .update(items[0], {})
                    // extracting row data for e.g. save
                    .then(() => {
                        const extractedEntity = editableRow.extractEntity();
                        console.log("extractedEntity:\n", JSON.stringify(extractedEntity));
                    })
                    // switch to new row (aka ADD then enter "edit" mode)
                    .then(() => editableRow
                        .update({id: EntityUtils.prototype.transientId, name: "new dog"}, "CREATE"))
                    .then(() => {
                        const extractedEntity = editableRow.extractEntity();
                        console.log("extractedEntity:\n", JSON.stringify(extractedEntity));
                    })
            });

        // dogs table with deleted row
        const dogsTableWithDelete = "dogsTableWithDelete";
        SimpleListFactory.prototype
            .create({items: dogs, tableId: dogsTableWithDelete})
            .init()
            .then(items => {
                const simpleRow = SimpleRowFactory.prototype.createSimpleRow(
                    dogsTableWithDelete, {});
                // switch to existing row (aka enter "edit" mode)
                simpleRow.update(items[0], {})
                    // switch to same row with delete
                    .then(() => simpleRow.update(items[0], "DELETE"));
            });
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
