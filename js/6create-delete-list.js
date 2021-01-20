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
        const dogs = [{id: 1, name: "dog1", person: DbMock.PERSONS_REPOSITORY.getById(1, true)},
            {id: 2, name: "dog2"}, {id: 3, name: "dog3"}];

        // DynamicSelectOneComponent child component factory (see ChildComponentFactory)
        const dynaSelOneCompFactory = {
            /**
             * @param idRowCompParent {IdentifiableRowComponent}
             * @return {DynamicSelectOneComponent}
             */
            createChildComponent: (idRowCompParent) => {
                AssertionUtils.isNotNull(idRowCompParent.view.$elem, "dynaSelOneCompFactory, DynamicSelectOneFactory");

                return DynamicSelectOneFactory.create($("[data-id='dyna-sel-one']", idRowCompParent.view.$elem), DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {
                    childishBehaviour: new DynaSelOneChildishBehaviour(idRowCompParent, "person", () => new Person())
                })
            }
        };

        // by default on creation the row is prepended to table
        const addNewRowsAtEnd = true;

        // dogs table
        const createDeleteList = CreateDeleteListFactory.create("dogsTable", "dogsTableRowTmpl", {
            items: dogs, addNewRowsAtEnd, rowChildCompFactories: dynaSelOneCompFactory
        });

        // some doWithState operations on createDeleteList
        const TO_UPDATE_ID = 3;
        createDeleteList
            .init()
            .then(() => createDeleteList.doWithState((crudListState) => {
                crudListState.insertItem({
                    id: EntityUtils.generateId(),
                    name: "new dog"
                });
                crudListState.updateItem({id: TO_UPDATE_ID, name: `updated dog${TO_UPDATE_ID}`});
                crudListState.removeById(2);
                crudListState.insertItem({
                    id: 2,
                    name: `restored dog2 with ${addNewRowsAtEnd ? "append" : "preppend"}`
                });
            }))
            // manually init child components for the above updated id=3 entity
            .then(() =>
                Promise.allSettled(createDeleteList.compositeBehaviour
                    .findKids((kid) => EntityUtils.idsAreEqual(kid.state.currentState.id, TO_UPDATE_ID))
                    .map((kid) => kid.init())))
            // showing the entire table extracted data
            .then(() => console.log("ElasticListComponent.extractAllEntities:\n",
                createDeleteList.extractAllEntities()));
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
