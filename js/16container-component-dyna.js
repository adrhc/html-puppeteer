/**
 * @param {ContainerComponent} container
 * @return {function(): Promise<StateChange[]>}
 */
function dogsSupplierFor(container) {
    return () => {
        // const dogs = findDogsListComp(container).repository.items;
        // dogs.push({id: dogs.length + 1, name: `dog${dogs.length + 1}`});
        const oldDogs = container.findKidsByClass(SimpleListComponent).pop().state.currentState;
        const dogs = [...oldDogs, {id: oldDogs.length + 1, name: `dog${oldDogs.length + 1}`}];
        return container.update(dogs, {partName: "dogs"});
    };
}

/**
 * @param {ContainerComponent} container
 * @return {function(): Promise<StateChange[]>}
 */
function personSupplierFor(container) {
    return () => {
        const date = new Date().toLocaleTimeString();
        const person = {name: `Kent ${date}`, surname: `Gigi ${date}`};
        return container.update(person, {partName: "person"});
    };
}

$(() => {
    // const container = new ContainerComponent($("[data-jqw-type='ContainerComponent']"));
    const container = JQWUtil.createComponents();

    container.compositeBehaviour.addChildComponentFactory([(parentComp) => {
        const elemIdOrJQuery = $("#person", parentComp.view.$elem);
        return new DrawingComponent(elemIdOrJQuery, ComponentConfiguration.configOf(elemIdOrJQuery, {childProperty: "person"}));
    }, (parentComp) => {
        const elemIdOrJQuery = $("#dogsTable", parentComp.view.$elem);
        return SimpleListFactory.create({items: DbMock.DOGS, elemIdOrJQuery, childProperty: "dogs"});
    }, (parentComp) => {
        const elemIdOrJQuery = $("#dyna-sel-one", parentComp.view.$elem);
        return DynamicSelectOneFactory.create(elemIdOrJQuery, DbMock.DYNA_SEL_ONE_PERS_REPOSITORY);
        // return DynamicSelectOneFactory.create(elemIdOrJQuery, DbMock.DYNA_SEL_ONE_PERS_REPOSITORY, {childProperty: "dynaPerson"});
    }]);

    container.init()
        .then(() => setInterval(personSupplierFor(container),
            container.findKidsByClass(DrawingComponent).pop().config.seconds * 1000))
        .then(() => setInterval(dogsSupplierFor(container), container.config.seconds * 1000))
        .then(() => console.log("16container-component-dyna.js started"));
});
