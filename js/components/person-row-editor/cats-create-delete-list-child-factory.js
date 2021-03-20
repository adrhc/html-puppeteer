/**
 * creates CreateDeleteListComponent to be used as a component while editing a person
 */
class CatsCreateDeleteListChildFactory extends ChildComponentFactory {
    /**
     * cats row html template
     *
     * @type {string}
     */
    bodyRowTmplHtml;
    /**
     * @type {DynaSelOneRepository}
     */
    dynaSelOnePersRepo;

    /**
     * @param dynaSelOnePersRepo {DynaSelOneRepository}
     * @param [bodyRowTmplId] {string}
     * @param [bodyRowTmplHtml] {string}
     */
    constructor(dynaSelOnePersRepo, {bodyRowTmplId, bodyRowTmplHtml}) {
        super();
        this.dynaSelOnePersRepo = dynaSelOnePersRepo;
        this.bodyRowTmplId = bodyRowTmplId;
        this.bodyRowTmplHtml = bodyRowTmplHtml;
    }

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
                AssertionUtils.isTrue($parentElem && $parentElem.length === 1, "ownerDynaSelOneCompFactory.createChildComponent");

                return DynamicSelectOneFactory.create($("[data-id='dyna-sel-one']", $parentElem),
                    this.dynaSelOnePersRepo, {
                        childishBehaviour: new DynaSelOneChildishBehaviour(idRowCompParent, "person", Person.parse)
                    })
            }
        };

        // create-delete cats list (aka table)
        return CreateDeleteListFactory.create($catsTable, {
            items: parentComp.simpleRowState.rowState.cats,
            newItemsGoToTheEndOfTheList: true,
            bodyRowTmplId: this.bodyRowTmplId,
            bodyRowTmplHtml: this.bodyRowTmplHtml,
            rowChildCompFactories: ownerDynaSelOneCompFactory,
            childishBehaviour: new DefaultTableChildishBehaviour(parentComp, {childProperty: "cats"})
        });
    }
}