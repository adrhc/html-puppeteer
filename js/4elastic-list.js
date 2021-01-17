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
        const addNewRowsAtEnd = true;

        // dogs table with read-only row (default: on creation prepend to table)
        const component = ElasticListFactory.create("dogsTable", "dogsTableRowTmpl", {
            items, addNewRowsAtEnd
        });

        component
            .init()
            .then(() => component.doWithState((crudListState) => {
                // creating a new item with a transient id
                crudListState.createNewItem().name = "new dog";
                crudListState.updateItem({id: 3, name: "updated dog3"});
                crudListState.removeById(2);
                // creating a new item with a not transient id (here id=2)
                crudListState.insertItem({
                    id: 2,
                    name: `restored dog2 with ${addNewRowsAtEnd ? "append" : "preppend"}`
                });
            }))
            .then(() => console.log("component.extractAllEntities:\n",
                component.extractAllEntities(true)));
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
