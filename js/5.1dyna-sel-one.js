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

});