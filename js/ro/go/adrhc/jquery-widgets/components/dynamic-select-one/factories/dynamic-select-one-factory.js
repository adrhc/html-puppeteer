class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param [useLastSearchResult] {boolean}
     * @param [childishBehaviour] {ChildishBehaviour}
     * @return {DynamicSelectOneComponent}
     */
    static create(elemIdOrJQuery, repository, {
        useLastSearchResult, childishBehaviour
    }) {
        const dynaSelOneView = new DynamicSelectOneView(elemIdOrJQuery, {});
        const dynaSelOneState = new DynaSelOneState(repository, {useLastSearchResult});
        const dynaSelOneComp = new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState);
        if (childishBehaviour) {
            dynaSelOneComp.childishBehaviour = childishBehaviour;
        }
        return dynaSelOneComp;
    }

    /**
     * @param childStateProperty {string}
     * @param newChildEntityFactoryFn {function(): IdentifiableEntity}
     * @param repository {DynaSelOneRepository}
     * @param [dynaSelOneSelector=[data-id='dyna-sel-one']] {string}
     */
    static createChildComponentFactory(childStateProperty, newChildEntityFactoryFn, repository,
                                       dynaSelOneSelector = "[data-id='dyna-sel-one']") {
        return $.extend(true, new ChildComponentFactory(), {
            createChildComponent: (parentComp) => {
                const $parentElem = parentComp.view.$elem;
                AssertionUtils.isTrue($parentElem && $parentElem.length === 1, `${childStateProperty} dynaSelOne child factory`);

                return DynamicSelectOneFactory.create($(dynaSelOneSelector, $parentElem),
                    repository, {
                        childishBehaviour: new DynaSelOneChildishBehaviour(parentComp,
                            childStateProperty, newChildEntityFactoryFn)
                    })
            }
        });
    }
}