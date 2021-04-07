$(() => {
    const JSON_RESULT = "[{\"id\":\"1\",\"name\":\"dog1\",\"person\":{\"id\":1,\"firstName\":\"gigi1\",\"lastName\":\"kent1\",\"friend\":{\"id\":2,\"firstName\":\"gigi2\",\"lastName\":\"kent2\",\"cats\":[]},\"cats\":[{\"id\":1,\"name\":\"cat1\",\"person\":{\"id\":1,\"firstName\":\"gigi1\",\"lastName\":\"kent1\",\"cats\":[]},\"friendId\":1},{\"id\":2,\"name\":\"cat2\",\"person\":{\"id\":1,\"firstName\":\"gigi1\",\"lastName\":\"kent1\",\"cats\":[]},\"friendId\":1},{\"id\":3,\"name\":\"cat3\",\"person\":{\"id\":1,\"firstName\":\"gigi1\",\"lastName\":\"kent1\",\"cats\":[]},\"friendId\":1}]}},{\"id\":\"3\",\"name\":\"updated dog3\"},{\"name\":\"new dog\"},{\"id\":\"2\",\"name\":\"restored dog2 with append\"}]";

    // DYNAMIC-SELECT-ONE
    DynamicSelectOneFactory.create("dyna-sel-one", DbMock.DYNA_SEL_ONE_PERS_REPOSITORY).init();

    // see interface ChildComponentFactory
    /*const dynaSelOneCompFactory = {
        /!**
         * @param idRowCompParent {IdentifiableRowComponent}
         * @return {DynamicSelectOneComponent}
         *!/
        createChildComponent: (idRowCompParent) => {
            const $parentElem = idRowCompParent.view.$elem;
            AssertionUtils.isTrue($parentElem && $parentElem.length === 1, "dynaSelOneCompFactory, DynamicSelectOneFactory");

            return DynamicSelectOneFactory.create(
                $("[data-id='dyna-sel-one']", idRowCompParent.view.$elem),
                DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {
                    childishBehaviour: new DynaSelOneOnRowChildishBehaviour(idRowCompParent, "person", Person.parse)
                });
        }
    };*/

    const ITEMS = [
        {id: 1, name: "dog1", person: DbMock.PERSONS_REPOSITORY.getById(1, true)},
        {id: 2, name: "dog2"},
        {id: 3, name: "dog3"}
    ];

    // dogs table with read-only row (default: on creation prepend to table)
    const elasticList = new ElasticListComponent({
        elemIdOrJQuery: "dogsTable",
        dontAutoInitialize: true,
        items: ITEMS,
        // rowChildCompFactories: dynaSelOneCompFactory
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
            AssertionUtils.isTrue(JSON.stringify(entities) === JSON_RESULT, "JSON check")
        });

});