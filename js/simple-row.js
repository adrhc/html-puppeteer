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
                const identifiableRow = SimpleRowFactory.prototype
                    .createIdentifiableRow(dogsTableWithEdit, {
                        rowTmpl: "dogsTableWithEditSelectedRowTmpl",
                        putAtBottomIfNotExists: true
                    });
                identifiableRow
                    .update(items[0])
                    .then(() => {
                        const extractedEntity = identifiableRow.extractEntity();
                        console.log("extractedEntity:\n", extractedEntity);
                    });
            });

        // dogs table with deleted row
        const dogsTableWithDelete = "dogsTableWithDelete";
        SimpleListFactory.prototype
            .create({items: dogs, tableId: dogsTableWithDelete})
            .init()
            .then(items => {
                const simpleRow = SimpleRowFactory.prototype.createSimpleRow(
                    dogsTableWithDelete, {removeOnEmptyState: true});
                simpleRow
                    .update(items[0])
                    .then(() => simpleRow.update(undefined));
            });
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
