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
        const persons = [
            new Person(1, "gigi1", "kent1",
                [{id: 1, name: "cat1"}, {id: 2, name: "cat2"}, {id: 3, name: "cat3"}]),
            new Person(2, "gigi2", "kent2",
                [{id: 21, name: "cat21"}, {id: 22, name: "cat22"}, {id: 23, name: "cat23"}]),
            new Person(4, "gigi4", "kent4",
                [{id: 41, name: "cat41"}, {id: 22, name: "cat42"}, {id: 43, name: "cat43"}]),
            new Person(3, "gigi3", "kent3",
                [{id: 31, name: "cat31"}, {id: 32, name: "cat32"}, {id: 33, name: "cat33"}])
        ];
        const personsRepository = new InMemoryPersonsRepository(new EntityHelper(), persons);

        const items = [{id: 1, name: "dog1"}, {id: 2, name: "dog2"}, {id: 3, name: "dog3"}];
        const addNewRowsAtEnd = true;

        // see interface ChildComponentFactory
        const rowChildCompFactories = {
            createComp: (idRowCompParent) => {
                AssertionUtils.assertNotNull(idRowCompParent.view.$elem, "rowChildCompFactories, DynamicSelectOneFactory");
                return DynamicSelectOneFactory.create({
                    elemIdOrJQuery: $("[data-id='dyna-sel-one']", idRowCompParent.view.$elem),
                    placeholder: "the name to search for",
                    repository: personsRepository
                })
            }
        };

        // dogs table with read-only row (default: on creation prepend to table)
        const component = ElasticListFactory.create("dogsTable", "dogsTableRowTmpl", {
            items, addNewRowsAtEnd, rowChildCompFactories
        });

        component
            .init()
            .then(() => {
                component.doWithState((crudListState) => {
                    crudListState.createNewItem().name = "new dog";
                    crudListState.updateItem({id: 3, name: "updated dog3"});
                    crudListState.removeById(2);
                    crudListState.insertItem({
                        id: 2,
                        name: `restored dog2 with ${addNewRowsAtEnd ? "append" : "preppend"}`
                    });
                });
            })
            .then(() => console.log("component.extractAllEntities:\n", component.extractAllEntities(true)));
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
