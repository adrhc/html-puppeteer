class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param [minCharsToSearch] {number}
     * @param [useCachedSearchResult] {boolean}
     * @param [childishBehaviour] {ChildishBehaviour}
     * @return {DynamicSelectOneComponent}
     */
    static create(elemIdOrJQuery, repository, {
        minCharsToSearch, useCachedSearchResult, childishBehaviour
    }) {
        const config = DomUtils.jQueryOf(elemIdOrJQuery).data();
        const dynaSelOneView = new DynamicSelectOneView(elemIdOrJQuery, {
            tmplUrl: config.tmplUrl
        });
        const dynaSelOneState = new DynaSelOneState(repository, {
            minCharsToSearch: !!minCharsToSearch ? minCharsToSearch : config.minCharsToSearch,
            useCachedSearchResult: !!useCachedSearchResult ? useCachedSearchResult : config.useCachedSearchResult
        });
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