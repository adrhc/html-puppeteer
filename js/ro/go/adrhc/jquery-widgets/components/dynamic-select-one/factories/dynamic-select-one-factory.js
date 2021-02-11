class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param [minCharsToSearch] {number}
     * @param [useCachedSearchResult] {boolean}
     * @param [searchOnBlur] {boolean}
     * @param [reloadOptionsOnInit] {boolean}
     * @param [childishBehaviour] {ChildishBehaviour}
     * @return {DynamicSelectOneComponent}
     */
    static create(elemIdOrJQuery, repository, {
        minCharsToSearch, useCachedSearchResult, searchOnBlur, reloadOptionsOnInit, childishBehaviour
    }) {
        const props = DomUtils.jQueryOf(elemIdOrJQuery).data();
        const configFn = (config) => $.extend(config == null ? {} : config, props);
        const dynaSelOneView = new DynamicSelectOneView(elemIdOrJQuery, configFn({}));
        const dynaSelOneState = new DynaSelOneState(repository, configFn({
            minCharsToSearch: minCharsToSearch,
            useCachedSearchResult: useCachedSearchResult,
            searchOnBlur: searchOnBlur,
            reloadOptionsOnInit: reloadOptionsOnInit,
        }));
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
                AssertionUtils.isTrue($parentElem && $parentElem.length === 1,
                    `${childStateProperty} dynaSelOne child factory`);
                return DynamicSelectOneFactory.create($(dynaSelOneSelector, $parentElem),
                    repository, {
                        childishBehaviour: new DynaSelOneChildishBehaviour(parentComp,
                            childStateProperty, newChildEntityFactoryFn)
                    })
            }
        });
    }
}