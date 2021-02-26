/**
 * @param {ContainerComponent} comp
 * @return {AbstractComponent}
 */
function getDogsListCompFrom(comp) {
    return comp.compositeBehaviour.findKids(
        (kid) => kid instanceof SimpleListComponent).pop();
}

function getPersonCompFrom(comp) {
    return comp.compositeBehaviour.findKids(
        (kid) => kid instanceof DrawingComponent).pop();
}

function newPerson() {
    const date = new Date().toLocaleTimeString();
    return {
        name: `Kent ${date}`,
        surname: `Gigi ${date}`
    };
}

/**
 * @param {ContainerComponent} comp
 * @return {function(): Promise<StateChange[]>}
 */
function dogsSupplierFor(comp) {
    return () => {
        // const dogs = findDogsListComp(comp).repository.items;
        // dogs.push({id: dogs.length + 1, name: `dog${dogs.length + 1}`});
        const oldDogs = getDogsListCompFrom(comp).state.currentState;
        const dogs = [...oldDogs, {id: oldDogs.length + 1, name: `dog${oldDogs.length + 1}`}];
        return comp.processStateChange(new StateChange("UPDATE_ALL", {dogs}), {});
    };
}

/**
 * @param {ContainerComponent} comp
 * @return {function(): Promise<StateChange[]>}
 */
function personSupplierFor(comp) {
    return () => {
        return comp.processStateChange(new StateChange("RENDER",{person: newPerson()}), {});
    };
}

$(() => {
    // const comp = new ContainerComponent($("[data-jqw-type='ContainerComponent']"));
    const comp = JQueryWidgetsUtil.autoCreate();

    comp.compositeBehaviour.addChildComponentFactory([(parentComp) => {
        const elemIdOrJQuery = $("#person", parentComp.view.$elem);
        return new DrawingComponent(elemIdOrJQuery);
    }, (parentComp) => {
        const tableIdOrJQuery = $("#dogsTable", parentComp.view.$elem);
        return SimpleListFactory.create({items: DbMock.DOGS, tableIdOrJQuery});
    }, (parentComp) => {
        const elemIdOrJQuery = $("#dyna-sel-one", parentComp.view.$elem);
        return DynamicSelectOneFactory.create(elemIdOrJQuery, DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {});
    }]);

    comp.init()
        .then(() => setInterval(dogsSupplierFor(comp), comp.config.seconds * 1000))
        .then(() => setInterval(personSupplierFor(comp), getPersonCompFrom(comp).config.seconds * 1000))
        .then(() => console.log("16container-component-dyna.js started"));
});
