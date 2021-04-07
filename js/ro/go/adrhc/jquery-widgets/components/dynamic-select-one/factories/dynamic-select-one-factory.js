class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param [minCharsToSearch] {number}
     * @param [useCachedSearchResult] {boolean}
     * @param [searchOnBlur] {boolean}
     * @param [reloadOptionsOnInit] {boolean}
     * @param [childProperty] {string}
     * @param [childishBehaviour] {ChildishBehaviour}
     * @return {DynamicSelectOneComponent}
     */
    static create(elemIdOrJQuery, repository, {
        minCharsToSearch,
        useCachedSearchResult,
        searchOnBlur,
        reloadOptionsOnInit,
        childProperty,
        childishBehaviour,
    } = {}) {
        const props = DomUtils.dataOf(elemIdOrJQuery);
        const config = _.defaults(new DynaSelOneConfig(), {
            minCharsToSearch,
            useCachedSearchResult,
            searchOnBlur,
            reloadOptionsOnInit,
            childProperty,
        }, props);

        const dynaSelOneView = new DynamicSelectOneView(elemIdOrJQuery, config);
        const dynaSelOneState = new DynaSelOneState(repository, config);
        return new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState, config, {childishBehaviour});
    }

    /**
     * @param childProperty {string}
     * @param childEntityConverter {function(): IdentifiableEntity}
     * @param repository {DynaSelOneRepository}
     * @param [dynaSelOneSelector=[data-id='dyna-sel-one']] {string}
     */
    static createChildComponentFactory(childProperty, childEntityConverter, repository,
                                       dynaSelOneSelector = "[data-id='dyna-sel-one']") {
        return $.extend(new ChildComponentFactory(), {
            createChildComponent: (parentComp) => {
                const $parentElem = parentComp.view.$elem;
                AssertionUtils.isTrue($parentElem && $parentElem.length === 1,
                    `${childProperty} dynaSelOne child factory`);
                return DynamicSelectOneFactory.create($(dynaSelOneSelector, $parentElem),
                    repository, {
                        childishBehaviour: new DynaSelOneOnRowChildishBehaviour(
                            parentComp, childProperty, childEntityConverter)
                    })
            }
        });
    }
}