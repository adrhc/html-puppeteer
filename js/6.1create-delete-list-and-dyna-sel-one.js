$(() => {
    const DOGS = DbMocks.DOGS;
    DOGS[0] = {id: 1, name: "dog1", person: DbMocks.PERSONS_REPOSITORY.getById(1, true)};

    // by default on creation the row is prepended to table
    const newItemsGoLast = true;

    // DynamicSelectOneComponent child component factory (see ChildComponentFactory)
    const dynaSelOneCompFactory = {
        /**
         * @param idRowCompParent {IdentifiableRowComponent}
         * @return {DynamicSelectOneComponent}
         */
        createChildComponent: (idRowCompParent) => {
            const $parentElem = idRowCompParent.view.$elem;
            AssertionUtils.isTrue($parentElem.length === 1, "dynaSelOneCompFactory, DynamicSelectOneFactory");

            return DynamicSelectOneFactory.create(
                $("[data-id='dyna-sel-one']", idRowCompParent.view.$elem),
                DbMocks.DYNA_SEL_ONE_PERS_REPOSITORY, {
                    childishBehaviour: new DynaSelOneOnRowChildishBehaviour(idRowCompParent, "person", Person.parse)
                });
        }
    };

    // dogs table
    const createDeleteList = CreateDeleteListFactory.create("dogsTable", {
        items: DOGS,
        newItemsGoLast,
        bodyRowTmplId: "dogsTableRowTmpl",
        rowChildCompFactories: dynaSelOneCompFactory
    });

    // some doWithState operations on createDeleteList
    createDeleteList
        .init()
        .then(() => createDeleteList.doWithState((state) => {
            /**
             * @type {CrudListState}
             */
            const crudListState = state;
            crudListState.insertItem({
                id: EntityUtils.generateId(),
                name: "new dog"
            });
            crudListState.updateItem({id: 3, name: `updated dog3`});
            crudListState.removeById(2);
            crudListState.insertItem({
                id: 2,
                name: `restored dog2 with ${newItemsGoLast ? "append" : "prepend"}`
            });
        }))
        // showing the entire table extracted data
        .then(() => console.log("ElasticListComponent.extractAllEntities:\n",
            createDeleteList.extractAllEntities()));
});
