class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param placeholder {string}
     * @param searchLastSearchResult {boolean|undefined}
     * @param childOperations {ChildComponent}
     * @return {DynamicSelectOneComponent}
     */
    static create({elemIdOrJQuery, repository, placeholder, searchLastSearchResult, childOperations}) {
        const dynaSelOneView = new DynamicSelectOneView(elemIdOrJQuery, {placeholder});
        const dynaSelOneState = new DynaSelOneState(repository, {searchLastSearchResult});
        const dynaSelOneComp = new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState);
        if (childOperations) {
            dynaSelOneComp.childComponent = childOperations;
        }
        return dynaSelOneComp;
    }
}