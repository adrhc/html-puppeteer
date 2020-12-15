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

        // dogs table with editable row
        const tableId = "dogsTable";
        const notSelectedRow = SimpleRowFactory.prototype.createIdentifiableRow(
            tableId, {});
        const selectedRow = SimpleRowFactory.prototype.createIdentifiableRow(
            tableId, {
                rowTmpl: "dogsTableEditableRowTmpl"
            });

        SelectableListFactory.prototype
            .create({items, tableId, notSelectedRow, selectedRow})
            .init();
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
