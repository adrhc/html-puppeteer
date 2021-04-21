$(() => {
    new SimpleListComponent({
        elemIdOrJQuery: "dogsTable",
        items: DbMocks.dogsOf(10),
    }).then(() => "2simple-list-read-only.js done");
})
