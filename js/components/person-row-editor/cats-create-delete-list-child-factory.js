/**
 * creates CreateDeleteListComponent to be used as a component while editing a person
 */
class CatsCreateDeleteListChildFactory extends ChildComponentFactory {
    /**
     * @param parentComp {IdentifiableRowComponent}
     * @return {ElasticListComponent}
     */
    createChildComponent(parentComp) {
        const $catsTable = $("[data-id='catsTable']", parentComp.view.$elem);

        // see ChildComponentFactory
        const ownerDynaSelOneCompFactory = {
            /**
             * @param idRowCompParent {IdentifiableRowComponent}
             * @return {DynamicSelectOneComponent}
             */
            createChildComponent: (idRowCompParent) => {
                const $parentElem = idRowCompParent.view.$elem;
                AssertionUtils.isNotNull($parentElem, "ownerDynaSelOneCompFactory.createChildComponent");

                return DynamicSelectOneFactory.create($("[data-id='dyna-sel-one']", $parentElem),
                    DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {
                        childishBehaviour: new DynaSelOneChildishBehaviour(idRowCompParent, "person", () => new Person())
                    })
            }
        };

        // create-delete cats list (aka table)
        return CreateDeleteListFactory.create($catsTable, {
            items: parentComp.simpleRowState.rowState.cats,
            addNewRowsAtEnd: true,
            bodyRowTmplId: "editableCatsRowTmpl",
            rowChildCompFactories: ownerDynaSelOneCompFactory,
            childishBehaviour: new DefaultTableChildishBehaviour(parentComp, "cats")
        });
    }
}