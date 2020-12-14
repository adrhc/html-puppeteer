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
        const dogsTable = "dogsTable";
        SimpleListFactory.prototype
            .create({items: dogs, tableId: dogsTable})
            .init()
            .then(items => {
                const identifiableRow = SimpleRowFactory.prototype
                    .createIdentifiableRow(dogsTable, {
                        putAtBottomIfNotExists: true
                    });
                identifiableRow
                    // switch to existing row (aka enter "edit" mode)
                    .update(items[0])
                    // extracting row data for e.g. save
                    .then(() => {
                        const extractedEntity = identifiableRow.extractEntity();
                        console.log("extractedEntity:\n", JSON.stringify(extractedEntity));
                    })
                    // switch to new row (aka ADD then enter "edit" mode)
                    .then(() => identifiableRow
                        .update({id: EntityUtils.prototype.transientId, name: "new dog"}))
                    .then(() => {
                        const extractedEntity = identifiableRow.extractEntity();
                        console.log("extractedEntity:\n", JSON.stringify(extractedEntity));
                    })
            });
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
