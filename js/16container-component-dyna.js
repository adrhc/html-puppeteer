function findDogsListComp(comp) {
    return comp.compositeBehaviour.findKids(
        (kid) => kid instanceof SimpleListComponent).pop();
}

function procStateChgFnOf(comp) {
    return () => {
        const dogs = findDogsListComp(comp).repository.items;
        dogs.push({id: dogs.length + 1, name: `dog${dogs.length + 1}`});
        const updateAllStateChange = new StateChange("UPDATE_ALL", {dogs});
        return comp.processStateChange(updateAllStateChange);
    };
}

$(() => {
    // const comp = new ContainerComponent($("[data-jqw-type='ContainerComponent']"));
    const comp = JqueryWidgetsUtil.autoCreate();
    comp.compositeBehaviour.addChildComponentFactory([(parentComp) => {
        const tableIdOrJQuery = $("#dogsTable", parentComp.view.$elem);
        return SimpleListFactory.create({items: DbMock.DOGS, tableIdOrJQuery, childStateProperty: "dogs"});
    }, (parentComp) => {
        const elemIdOrJQuery = $("#dyna-sel-one", parentComp.view.$elem);
        return DynamicSelectOneFactory.create(elemIdOrJQuery, DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {});
    }]);
    comp.init()
        .then(() => setInterval(procStateChgFnOf(comp), comp.state.currentState.seconds * 1000))
        .then(() => console.log("16container-component-dyna.js started"));
});
