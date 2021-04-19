$(() => {

    // DYNAMIC-SELECT-ONE
    new DynamicSelectOneComponent({
        elemIdOrJQuery: "dyna-sel-one1",
        repository: DbMocks.DYNA_SEL_ONE_PERS_REPOSITORY
    });

    new DynamicSelectOneComponent({
        elemIdOrJQuery: "dyna-sel-one2",
        repository: DbMocks.DYNA_SEL_ONE_PERS_REPOSITORY
    });

    const dyna3 = new DynamicSelectOneComponent({
        elemIdOrJQuery: "dyna-sel-one3",
        repository: DbMocks.DYNA_SEL_ONE_PERS_REPOSITORY,
        loadOptionsOnInit: true,
        initialState: new DynaSelOneState("gigi3", undefined, undefined, false)
    });

    const selectedItem4 = DbMocks.PERSONS_REPOSITORY.getById(4, true);
    const updateUsingSpecificItem = () => dyna3.doWithState(() =>
        dyna3.dynaSelOneState.updateUsingDynaSelOneItem(selectedItem4));
    const changeToId5 = () => dyna3.doWithState(() => dyna3.dynaSelOneState.updateById(5))
        .then(() => setTimeout(updateUsingSpecificItem, 1000));
    const searchByGigi = () => dyna3._onEnter("gigi")
        .then(() => setTimeout(changeToId5, 1000));
    dyna3.init().then(() => setTimeout(searchByGigi, 1000));

});