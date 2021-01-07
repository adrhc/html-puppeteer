class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param [placeholder] {string}
     * @param [useLastSearchResult] {boolean}
     * @param [childOperations] {ChildComponent}
     * @param [focusOnInit] {boolean}
     * @return {DynamicSelectOneComponent}
     */
    static create(elemIdOrJQuery, repository, {
        placeholder, useLastSearchResult, childOperations, focusOnInit
    }) {
        const dynaSelOneView = new DynamicSelectOneView(elemIdOrJQuery, {placeholder});
        const dynaSelOneState = new DynaSelOneState(repository, {useLastSearchResult});
        const dynaSelOneComp = new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState, {focusOnInit});
        if (childOperations) {
            dynaSelOneComp.childComponent = childOperations;
        }
        return dynaSelOneComp;
    }
}