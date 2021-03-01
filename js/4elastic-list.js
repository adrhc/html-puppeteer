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
        const newItemsGoToTheEndOfTheList = true;

        // dogs table with read-only row (default: on creation prepend to table)
        const component = ElasticListFactory.create("dogsTable", "dogsTableRowTmpl", {
            items: DbMock.DOGS, newItemsGoToTheEndOfTheList
        });

        component
            .init()
            .then(() => component.doWithState((crudListState) => {
                crudListState.createNewItem({name: "new dog"}); // transient id
                crudListState.updateItem({id: 3, name: "updated dog3"});
                crudListState.removeById(2);
                // creating a new item with a not transient id (here id=2)
                crudListState.insertItem({
                    id: 2,
                    name: `restored dog2 with ${newItemsGoToTheEndOfTheList ? "append" : "preppend"}`
                });
            }))
            .then(() => {
                const entities = component.extractAllEntities(true);
                console.log("component.extractAllEntities:\n", entities);
                AssertionUtils.isTrue(entities.length === 4);
                AssertionUtils.isTrue(JSON.stringify(entities) === "[{\"id\":\"1\",\"name\":\"dog1\"},{\"id\":\"3\",\"name\":\"updated dog3\"},{\"name\":\"new dog\"},{\"id\":\"2\",\"name\":\"restored dog2 with append\"}]")
            });
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
