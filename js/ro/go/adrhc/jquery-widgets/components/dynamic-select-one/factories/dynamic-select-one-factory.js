class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param [useLastSearchResult] {boolean}
     * @param [childishBehaviour] {ChildishBehaviour}
     * @param [focusOnInit] {boolean}
     * @return {DynamicSelectOneComponent}
     */
    static create(elemIdOrJQuery, repository, {
        useLastSearchResult, childishBehaviour, focusOnInit
    }) {
        const dynaSelOneView = new DynamicSelectOneView(elemIdOrJQuery, {});
        const dynaSelOneState = new DynaSelOneState(repository, {useLastSearchResult});
        const dynaSelOneComp = new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState, {focusOnInit});
        if (childishBehaviour) {
            dynaSelOneComp.childishBehaviour = childishBehaviour;
        }
        return dynaSelOneComp;
    }
}