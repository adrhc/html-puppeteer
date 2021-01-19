class ElasticListCompositeBehaviour extends CompositeBehaviour {
    constructor(parentComp) {
        super(parentComp);
    }

    processStateChangeWithKids(stateChange,
                               kidsFilter = (kid) => EntityUtils.haveSameId(kid.simpleRowState.rowState, stateChange.data),
                               stateChangeKidAdapter) {
        return super.processStateChangeWithKids(stateChange, kidsFilter, stateChangeKidAdapter);
    }
}