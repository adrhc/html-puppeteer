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
        const elemIdOrJQuery = "dogsTable";

        const component = new EditableListComponent({
            elemIdOrJQuery,
            items: DbMocks.DOGS,
            bodyRowTmplId: "dogsTableRowTmpl",
            offRow: new IdentifiableRowComponent({
                elemIdOrJQuery,
                bodyRowTmplId: "dogsTableRowTmpl"
            }),
            onRow: new IdentifiableRowComponent({
                elemIdOrJQuery,
                bodyRowTmplId: "dogsTableEditableRowTmpl"
            }),
            deletableRow: new IdentifiableRowComponent({
                elemIdOrJQuery,
                bodyRowTmplId: "dogsTableDeletableRowTmpl"
            }),
            errorRow: new IdentifiableRowComponent({
                elemIdOrJQuery,
                bodyRowTmplId: "dogsTableErrorRowTmpl"
            }),
            dontAutoInitialize: true
        });

        component
            .init()
            .then(() => component.doWithState((state) => {
                /**
                 * @type {EditableListState}
                 */
                const editableListState = state;
                editableListState.updateItem({id: 3, name: "component only (not repository) updated dog3"});
                editableListState.removeById(2);
                editableListState.insertItem({
                    id: 2,
                    name: `component only (not repository) restored dog2 (using append)`
                }, {append: true});
                editableListState.insertItem({
                    id: 4,
                    name: `component only (not repository) added dog4 (using prepend)`
                }, {append: false});
                editableListState.insertItem({
                    id: 5,
                    name: `component only (not repository) added dog5 (using append)`
                }, {append: true});
            }));
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
