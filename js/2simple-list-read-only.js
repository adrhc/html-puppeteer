$(() => {
    new SimpleListComponent({
        elemIdOrJQuery: "dogsTable",
        items: DbMocks.DOGS,
    }).then(() => "2simple-list-read-only.js done");
})
