class DynamicSelectOneFactory {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param repository {DynaSelOneRepository}
     * @param [placeholder] {string}
     * @param [useLastSearchResult] {boolean}
     * @param [childishBehaviour] {ChildishBehaviour}
     * @param [focusOnInit] {boolean}
     * @return {DynamicSelectOneComponent}
     */
    static create(elemIdOrJQuery, repository, {
        placeholder, useLastSearchResult, childishBehaviour, focusOnInit
    }) {
        const dynaSelOneView = new DynamicSelectOneView(elemIdOrJQuery, {placeholder});
        const dynaSelOneState = new DynaSelOneState(repository, {useLastSearchResult});
        const dynaSelOneComp = new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState, {focusOnInit});
        if (childishBehaviour) {
            dynaSelOneComp.childishBehaviour = childishBehaviour;
        }
        return dynaSelOneComp;
    }
}