/**
 * creates CreateDeleteListComponent to be used as a component while editing a person
 */
class CatsCreateDeleteListChildFactory extends ChildComponentFactory {
    static personsRepository = new InMemoryPersonsRepository([
        new Person(1, "gigi1", "kent1",
            [{id: 1, name: "cat1", person: new Person(1, "gigi1", "kent1")},
                {id: 2, name: "cat2", person: new Person(1, "gigi1", "kent1")},
                {id: 3, name: "cat3", person: new Person(1, "gigi1", "kent1")}]),
        new Person(2, "gigi2", "kent2",
            [{id: 21, name: "cat21", person: new Person(2, "gigi2", "kent2")},
                {id: 22, name: "cat22", person: new Person(2, "gigi2", "kent2")},
                {id: 23, name: "cat23", person: new Person(2, "gigi2", "kent2")}]),
        new Person(4, "gigi4", "kent4",
            [{id: 41, name: "cat41"}, {id: 22, name: "cat42"}, {id: 43, name: "cat43"}]),
        new Person(3, "gigi3", "kent3",
            [{id: 31, name: "cat31"}, {id: 32, name: "cat32"}, {id: 33, name: "cat33"}])
    ]);

    createComp(parentComp) {
        const $catsTable = $("[data-id='catsTable']", parentComp.view.$elem);

        // DynamicSelectOneComponent child component factory (see ChildComponentFactory)
        const dynaSelOneCompFactory = {
            /**
             * @param idRowCompParent {IdentifiableRowComponent}
             * @return {DynamicSelectOneComponent}
             */
            createComp: (idRowCompParent) => {
                const $parentElem = idRowCompParent.view.$elem;
                AssertionUtils.assertNotNull($parentElem, "dynaSelOneCompFactory, DynamicSelectOneFactory");

                return DynamicSelectOneFactory.create($("[data-id='dyna-sel-one']", $parentElem),
                    CatsCreateDeleteListChildFactory.personsRepository, {
                        placeholder: "the name to search for",
                        childOperations: new DynaSelOneChildComp(idRowCompParent, "person", () => new Person())
                    })
            }
        };

        // create-delete cats list (aka table)
        return CreateDeleteListFactory.create($catsTable, "editableCatsRowTmpl", {
            items: parentComp.state.rowState.cats,
            addNewRowsAtEnd: true,
            rowChildCompFactories: dynaSelOneCompFactory,
            childOperations: new CatsCreateDeleteListChildOperations(parentComp, "cats")
        });
    }
}