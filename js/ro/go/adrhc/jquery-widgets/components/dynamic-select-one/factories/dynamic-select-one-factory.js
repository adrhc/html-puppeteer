class DynamicSelectOneFactory {
    /**
     * @param elemId {string}
     * @param repository {DynaSelOneRepository}
     * @param placeholder {string}
     * @param searchLastSearchResult {boolean|undefined}
     * @return {DynamicSelectOneComponent}
     */
    static create({elemId, repository, placeholder, searchLastSearchResult}) {
        const dynaSelOneView = new DynamicSelectOneView(elemId, placeholder);
        const dynaSelOneState = new DynaSelOneState(repository, {searchLastSearchResult});
        return new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState);
    }
}