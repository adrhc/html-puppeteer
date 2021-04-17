class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param [minCharsToSearch] {number}
     * @param [cacheSearchResults] {boolean}
     * @param [searchOnBlur] {boolean}
     * @param [reloadOptionsOnInit] {boolean}
     * @param [childProperty] {string}
     * @param [childishBehaviour] {ChildishBehaviour}
     * @return {DynamicSelectOneComponent}
     */
    static create(elemIdOrJQuery, repository, {
        minCharsToSearch,
        cacheSearchResults,
        searchOnBlur,
        reloadOptionsOnInit,
        childProperty,
        childishBehaviour,
    } = {}) {
        const config = DynaSelOneConfig.configOf(elemIdOrJQuery, {
            minCharsToSearch,
            cacheSearchResults,
            searchOnBlur,
            reloadOptionsOnInit,
            childProperty,
        });
        const view = new DynamicSelectOneView(elemIdOrJQuery, config);
        const state = new DynaSelOneState(repository, config);
        return new DynamicSelectOneComponent({view, state, config, childishBehaviour});
    }

    /**
     * @param childProperty {string}
     * @param toEntityConverter {function(): IdentifiableEntity}
     * @param repository {DynaSelOneRepository}
     * @param [dynaSelOneSelector=[data-id='dyna-sel-one']] {string}
     */
    static createDynaSelOneRowChildCompFactory(childProperty, toEntityConverter, repository,
                                       dynaSelOneSelector = "[data-id='dyna-sel-one']") {
        return $.extend(new ChildComponentFactory(), {
            createChildComponent: (identifiableRowParentComponent) => {
                const $parentElem = identifiableRowParentComponent.view.$elem;
                return DynamicSelectOneFactory.create($(dynaSelOneSelector, $parentElem),
                    repository, {
                        childishBehaviour: new DynaSelOneOnRowChildishBehaviour(
                            identifiableRowParentComponent, childProperty, toEntityConverter)
                    })
            }
        });
    }
}