$(() => {
    new SimpleListComponent({
        elemIdOrJQuery: "dogsTable",
        items: DbMocks.DOGS,
    });
});