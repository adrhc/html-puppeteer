class DynamicSelectOneFactory {
    /**
     * @param elemId {string}
     * @param repository {DynaSelOneRepository}
     * @param placeholder {string}
     * @return {DynamicSelectOneComponent}
     */
    create({elemId, repository, placeholder}) {
        const dynaSelOneView = new DynamicSelectOneView(elemId, placeholder);
        const dynaSelOneState = new DynamicSelectOneState(repository, {});
        return new DynamicSelectOneComponent(dynaSelOneView, dynaSelOneState);
    }
}