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

        // dogs table with read-only row
        const tableId = "dogsTable";
        const putAtBottomIfNotExists = true;
        const elasticSimpleListComponent = ElasticSimpleListFactory.prototype.create({
            items,
            tableId,
            putAtBottomIfNotExists
        });
        elasticSimpleListComponent
            .init()
            .then(() => {
                elasticSimpleListComponent.doWithState((crudListState) => {
                    crudListState.createNewItem().name = "new dog";
                    crudListState.updateItem({id: 3, name: "updated dog3"});
                    crudListState.removeById(2);
                    crudListState.createNewItem().name = `restored dog2 (at ${putAtBottomIfNotExists ? "bottom" : "top"})`;
                });
            });
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
