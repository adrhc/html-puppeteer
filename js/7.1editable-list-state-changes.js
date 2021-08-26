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
                editableListState.removeById(2);
                editableListState.insertItem({
                    id: 2,
                    name: `restored dog2 with position/index changed using append`
                }, {append: true});
                editableListState.updateItem({id: 3, name: "updated dog3 (position/index not changed)"});
                editableListState.updateItem({
                    id: 4,
                    name: `changed dog4 position/index using prepend`
                }, {append: false});
                editableListState.updateItem({
                    id: 5,
                    name: `changed dog5 position/index using append`
                }, {append: true});
            }));
    })
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
