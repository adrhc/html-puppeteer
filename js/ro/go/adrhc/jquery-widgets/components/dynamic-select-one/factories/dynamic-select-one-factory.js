class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param placeholder {string}
     * @param searchLastSearchResult {boolean|undefined}
     * @return {DynamicSelectOneComponent}
     */
    static create({elemIdOrJQuery, repository, placeholder, searchLastSearchResult}) {
        const dynaSelOneView = new DynamicSelectOneView(elemIdOrJQuery, placeholder);
        const dynaSelOneState = new DynaSelOneState(repository, {searchLastSearchResult});
        return new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState);
    }
}