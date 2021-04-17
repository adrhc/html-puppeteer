class DynaSelOneRowChildCompFactory extends ChildComponentFactory {
    childProperty;
    toEntityConverter;
    repository;
    dynaSelOneSelector;

    constructor(childProperty, toEntityConverter, repository,
                dynaSelOneSelector = "[data-id='dyna-sel-one']") {
        super();
        this.childProperty = childProperty;
        this.toEntityConverter = toEntityConverter;
        this.repository = repository;
        this.dynaSelOneSelector = dynaSelOneSelector;
    }

    createChildComponent(identifiableRowParentComponent) {
        const $parentElem = identifiableRowParentComponent.view.$elem;
        return new DynamicSelectOneComponent({
            elemIdOrJQuery: $(this.dynaSelOneSelector, $parentElem),
            repository: this.repository,
            childishBehaviour: new DynaSelOneOnRowChildishBehaviour(
                identifiableRowParentComponent, this.childProperty, this.toEntityConverter)
        });
    }
}