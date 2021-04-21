const JSON_RESULT = "[{\"id\":\"1\",\"name\":\"dog1\",\"person\":{\"id\":1,\"firstName\":\"gigi1\",\"lastName\":\"kent1\",\"friend\":{\"id\":2,\"firstName\":\"gigi2\",\"lastName\":\"kent2\",\"cats\":[]},\"cats\":[{\"id\":1,\"name\":\"cat1\",\"person\":{\"id\":1,\"firstName\":\"gigi1\",\"lastName\":\"kent1\",\"cats\":[]},\"friendId\":1},{\"id\":2,\"name\":\"cat2\",\"person\":{\"id\":1,\"firstName\":\"gigi1\",\"lastName\":\"kent1\",\"cats\":[]},\"friendId\":1},{\"id\":3,\"name\":\"cat3\",\"person\":{\"id\":1,\"firstName\":\"gigi1\",\"lastName\":\"kent1\",\"cats\":[]},\"friendId\":1}]}},{\"id\":\"3\",\"name\":\"updated dog3\"},{\"name\":\"new dog with append\"},{\"id\":\"2\",\"name\":\"restored dog2 with append\"}]";

$(() => {
    // DYNAMIC-SELECT-ONE
    new DynamicSelectOneComponent({
        elemIdOrJQuery: "dyna-sel-one",
        repository: DbMocks.DYNA_SEL_ONE_PERS_REPOSITORY
    });

    // dogs table with read-only row (default: on creation prepend to table)
    const elasticList = new ElasticListComponent({
        elemIdOrJQuery: "dogsTable",
        dontAutoInitialize: true,
        items: [
            {id: 1, name: "dog1", person: DbMocks.PERSONS_REPOSITORY.getById(1, true)},
            {id: 2, name: "dog2"},
            {id: 3, name: "dog3"}
        ],
        rowChildCompFactories: new DynaSelOneRowChildCompFactory(
            "person", Person.parse, DbMocks.DYNA_SEL_ONE_PERS_REPOSITORY)
    });

    const rowPositionOnCreate = elasticList.tableBasedView.tableAdapter.rowPositionOnCreate;
    elasticList
        .init()
        .then(() => elasticList.doWithState((state) => {
            /**
             * @type {CrudListState}
             */
            const crudListState = state;
            // elasticList.updateViewOnCREATE will init the child components
            crudListState.createNewItem({name: `new dog with ${rowPositionOnCreate}`}); // transient id
            // elasticList.updateViewOnAny won't init the child components
            crudListState.updateItem({id: 3, name: "updated dog3"});
            // this will get to SimpleRowComponent.updateViewOnDELETE
            crudListState.removeById(2); // remove from elasticList's state but not from the repository
            // elasticList.updateViewOnCREATE will init the child components
            crudListState.insertItem({
                id: 2,
                name: `restored dog2 with ${rowPositionOnCreate}`
            });
        }))
        // showing the entire table extracted data
        .then(() => {
            const entities = elasticList.extractAllEntities(true);
            console.log("ElasticListComponent.extractAllEntities:\n", entities);
            AssertionUtils.isTrue(entities.length === 4, "entities.length === 4");
            AssertionUtils.isTrue(JSON.stringify(entities) === JSON_RESULT, "JSON doesn't match!")
        });
});