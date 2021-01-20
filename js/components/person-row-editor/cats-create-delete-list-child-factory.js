/**
 * creates CreateDeleteListComponent to be used as a component while editing a person
 */
class CatsCreateDeleteListChildFactory extends ChildComponentFactory {
    createChildComponent(parentComp) {
        const $catsTable = $("[data-id='catsTable']", parentComp.view.$elem);

        // DynamicSelectOneComponent child component factory (see ChildComponentFactory)
        const dynaSelOneCompFactory = {
            /**
             * @param idRowCompParent {IdentifiableRowComponent}
             * @return {DynamicSelectOneComponent}
             */
            createChildComponent: (idRowCompParent) => {
                const $parentElem = idRowCompParent.view.$elem;
                AssertionUtils.isNotNull($parentElem, "dynaSelOneCompFactory, DynamicSelectOneFactory");

                return DynamicSelectOneFactory.create($("[data-id='dyna-sel-one']", $parentElem),
                    DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {
                        childishBehaviour: new DynaSelOneChildishBehaviour(idRowCompParent, "person", () => new Person())
                    })
            }
        };

        // create-delete cats list (aka table)
        return CreateDeleteListFactory.create($catsTable, "editableCatsRowTmpl", {
            items: parentComp.state.rowState.cats,
            addNewRowsAtEnd: true,
            rowChildCompFactories: dynaSelOneCompFactory,
            childishBehaviour: new DefaultTableChildishBehaviour(parentComp, "cats")
        });
    }
}