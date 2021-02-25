class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param [minCharsToSearch] {number}
     * @param [useCachedSearchResult] {boolean}
     * @param [searchOnBlur] {boolean}
     * @param [reloadOptionsOnInit] {boolean}
     * @param [childProperty] {string}
     * @param [newChildEntityFactoryFn] {function(): IdentifiableEntity}
     * @param [childishBehaviour] {ChildishBehaviour}
     * @return {DynamicSelectOneComponent}
     */
    static create(elemIdOrJQuery, repository, {
        minCharsToSearch,
        useCachedSearchResult,
        searchOnBlur,
        reloadOptionsOnInit,
        childProperty,
        newChildEntityFactoryFn,
        childishBehaviour,
    }) {
        const props = DomUtils.jQueryOf(elemIdOrJQuery).data();
        const configFn = (config) => $.extend(new DynaSelOneConfig(), props, config);
        const config = configFn({
            minCharsToSearch,
            useCachedSearchResult,
            searchOnBlur,
            reloadOptionsOnInit,
            childProperty,
            newChildEntityFactoryFn
        });

        const dynaSelOneView = new DynamicSelectOneView(elemIdOrJQuery, config);
        const dynaSelOneState = new DynaSelOneState(repository, config);
        const dynaSelOneComp = new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState, config);

        if (childishBehaviour) {
            dynaSelOneComp.childishBehaviour = childishBehaviour;
        }

        return dynaSelOneComp;
    }

    /**
     * @param childProperty {string}
     * @param newChildEntityFactoryFn {function(): IdentifiableEntity}
     * @param repository {DynaSelOneRepository}
     * @param [dynaSelOneSelector=[data-id='dyna-sel-one']] {string}
     */
    static createChildComponentFactory(childProperty, newChildEntityFactoryFn, repository,
                                       dynaSelOneSelector = "[data-id='dyna-sel-one']") {
        return $.extend(true, new ChildComponentFactory(), {
            createChildComponent: (parentComp) => {
                const $parentElem = parentComp.view.$elem;
                AssertionUtils.isTrue($parentElem && $parentElem.length === 1,
                    `${childProperty} dynaSelOne child factory`);
                return DynamicSelectOneFactory.create($(dynaSelOneSelector, $parentElem),
                    repository, {
                        childishBehaviour: new DynaSelOneChildishBehaviour(
                            parentComp, childProperty, newChildEntityFactoryFn)
                    })
            }
        });
    }
}