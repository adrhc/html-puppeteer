$(() => {
    new SimpleListComponent({
        elemIdOrJQuery: "dogsTable",
        items: DbMocks.dogsOf(10),
    }).autoInitializationResult.then(() => "2simple-list-read-only.js done");
})
