class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param [placeholder] {string}
     * @param [useLastSearchResult] {boolean}
     * @param [childOperations] {ChildComponent}
     * @return {DynamicSelectOneComponent}
     */
    static create({elemIdOrJQuery, repository, placeholder, useLastSearchResult, childOperations}) {
        const dynaSelOneView = new DynamicSelectOneView(elemIdOrJQuery, {placeholder});
        const dynaSelOneState = new DynaSelOneState(repository, {useLastSearchResult});
        const dynaSelOneComp = new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState);
        if (childOperations) {
            dynaSelOneComp.childComponent = childOperations;
        }
        return dynaSelOneComp;
    }
}