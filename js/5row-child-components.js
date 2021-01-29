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
        const items = [{id: 1, name: "dog1", person: DbMock.PERSONS_REPOSITORY.getById(1, true)},
            {id: 2, name: "dog2"}, {id: 3, name: "dog3"}];
        const newItemsGoToTheEndOfTheList = true;

        // see interface ChildComponentFactory
        const rowChildCompFactories = {
            /**
             * @param idRowCompParent {IdentifiableRowComponent}
             * @return {DynamicSelectOneComponent}
             */
            createChildComponent: (idRowCompParent) => {
                const $parentElem = idRowCompParent.view.$elem;
                AssertionUtils.isTrue($parentElem && $parentElem.length === 1, "rowChildCompFactories, DynamicSelectOneFactory");

                return DynamicSelectOneFactory.create($("[data-id='dyna-sel-one']", idRowCompParent.view.$elem), DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {
                    childishBehaviour: new DynaSelOneChildishBehaviour(idRowCompParent, "person", Person.parse)
                })
            }
        };

        // dogs table with read-only row (default: on creation prepend to table)
        const elasticList = ElasticListFactory.create("dogsTable", "dogsTableRowTmpl", {
            items, newItemsGoToTheEndOfTheList, rowChildCompFactories
        });

        elasticList
            .init()
            .then(() => elasticList.doWithState((crudListState) => {
                // elasticList.updateViewOnCREATE will init the child components
                crudListState.createNewItem().name = "new dog";
                // elasticList.updateViewOnAny won't init the child components
                crudListState.updateItem({id: 3, name: "updated dog3"});
                // this will get to SimpleRowComponent.updateViewOnDELETE
                crudListState.removeById(2); // remove from elasticList's state but not from the repository
                // elasticList.updateViewOnCREATE will init the child components
                crudListState.insertItem({
                    id: 2,
                    name: `restored dog2 with ${newItemsGoToTheEndOfTheList ? "append" : "preppend"}`
                });
            }))
            // showing the entire table extracted data
            .then(() => console.log("ElasticListComponent.extractAllEntities:\n", elasticList.extractAllEntities()));
    });
} else {
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
}
