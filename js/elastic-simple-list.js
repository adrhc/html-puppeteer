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
        const elasticSimpleListComponent = ElasticSimpleListFactory.prototype.create({items, tableId});
        elasticSimpleListComponent
            .init()
            .then(() => {
                elasticSimpleListComponent.doWithState((crudListState) => {
                    crudListState.createNewItem().name = `new dog<BR><BR>${new Date()}`;
                    crudListState.updateItem({id: 3, name: `updated dog3<BR><BR>${new Date()}`});
                });
            });
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
