class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param [useLastSearchResult] {boolean}
     * @param [childishBehaviour] {ChildishBehaviour}
     * @return {DynamicSelectOneComponent}
     */
    static create(elemIdOrJQuery, repository, {
        useLastSearchResult, childishBehaviour
    }) {
        const dynaSelOneView = new DynamicSelectOneView(elemIdOrJQuery, {});
        const dynaSelOneState = new DynaSelOneState(repository, {useLastSearchResult});
        const dynaSelOneComp = new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState);
        if (childishBehaviour) {
            dynaSelOneComp.childishBehaviour = childishBehaviour;
        }
        return dynaSelOneComp;
    }
}