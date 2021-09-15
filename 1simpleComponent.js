import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/SimpleComponent.js";

$(() => {
    const simple = new SimpleComponent({elemIdOrJQuery: "component"});
    simple.render({text: "Hello puppeteer!"});
})