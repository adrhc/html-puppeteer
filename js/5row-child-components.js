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
        const person1 = new Person(1, "gigi1", "kent1");

        const persons = [
            $.extend(new Person(), person1, {
                cats: [{id: 1, name: "cat1"}, {id: 2, name: "cat2"}, {id: 3, name: "cat3"}]
            }),
            new Person(2, "gigi2", "kent2",
                [{id: 21, name: "cat21"}, {id: 22, name: "cat22"}, {id: 23, name: "cat23"}]),
            new Person(4, "gigi4", "kent4",
                [{id: 41, name: "cat41"}, {id: 22, name: "cat42"}, {id: 43, name: "cat43"}]),
            new Person(3, "gigi3", "kent3",
                [{id: 31, name: "cat31"}, {id: 32, name: "cat32"}, {id: 33, name: "cat33"}])
        ];
        const personsRepository = new InMemoryPersonsRepository(persons);

        const items = [{id: 1, name: "dog1", person: person1}, {id: 2, name: "dog2"}, {id: 3, name: "dog3"}];
        const addNewRowsAtEnd = true;

        // see interface ChildComponentFactory
        const rowChildCompFactories = {
            /**
             * @param idRowCompParent {IdentifiableRowComponent}
             * @return {DynamicSelectOneComponent}
             */
            createComp: (idRowCompParent) => {
                AssertionUtils.assertNotNull(idRowCompParent.view.$elem, "rowChildCompFactories, DynamicSelectOneFactory");

                return DynamicSelectOneFactory.create($("[data-id='dyna-sel-one']", idRowCompParent.view.$elem), personsRepository, {
                    placeholder: "the name to search for",
                    childOperations: new DynaSelOneChildComp(idRowCompParent)
                })
            }
        };

        // dogs table with read-only row (default: on creation prepend to table)
        const elasticList = ElasticListFactory.create("dogsTable", "dogsTableRowTmpl", {
            items, addNewRowsAtEnd, rowChildCompFactories
        });

        elasticList
            .init()
            .then(() => elasticList.doWithState((crudListState) => {
                crudListState.createNewItem().name = "new dog";
                crudListState.updateItem({id: 3, name: "updated dog3"});
                crudListState.removeById(2);
                crudListState.insertItem({
                    id: 2,
                    name: `restored dog2 with ${addNewRowsAtEnd ? "append" : "preppend"}`
                });
            }))
            .then(() => console.log("ElasticListComponent.extractAllEntities:\n",
                elasticList.extractAllEntities()));
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
