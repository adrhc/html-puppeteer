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
            .then(updateAllStateChange => {
                const items = updateAllStateChange.data;
                const editableRow = SimpleRowFactory.prototype
                    .createIdentifiableRow(dogsTableWithEdit, {
                        rowTmpl: "dogsTableWithEditSelectedRowTmpl",
                        tableRelativePositionOnCreate: "append"
                    });
                editableRow
                    // switch to existing row (aka enter "edit" mode)
                    .update(items[0])
                    // extracting row data for e.g. save
                    .then(() => {
                        const extractedEntity = editableRow.extractEntity();
                        console.log("1. extractedEntity:\n", JSON.stringify(extractedEntity));
                    })
                    // switch to new row (aka ADD then enter "edit" mode)
                    .then(() => editableRow
                        .update({id: EntityUtils.prototype.transientId, name: "new dog"}, "CREATE"))
                    .then(() => {
                        const extractedEntity = editableRow.extractEntity();
                        console.log("2. extractedEntity:\n", JSON.stringify(extractedEntity));
                    })
            });

        // dogs table with deleted row
        const dogsTableWithDelete = "dogsTableWithDelete";
        SimpleListFactory.prototype
            .create({items: dogs, tableId: dogsTableWithDelete, bodyRowTmplId: "dogsTableWithDeleteReadOnlyRowTmpl"})
            .init()
            .then(updateAllStateChange => {
                const items = updateAllStateChange.data;
                const simpleRow = SimpleRowFactory.prototype.createSimpleRow(
                    dogsTableWithDelete, {rowTmpl: "dogsTableWithDeleteDeletedRowTmpl"});
                // switching to "simpleRow" display type (i.e. line-through text style)
                simpleRow.update(items[0])
                    // removing the row
                    .then(() => simpleRow.update(items[1], "DELETE"));
            });
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
