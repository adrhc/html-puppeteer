import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/SimpleComponent.js";

$(() => {
    // $("#root").text("Hello puppeteer!");
    const component = new SimpleComponent({elemIdOrJQuery: "root"});
    component.render({text: "Hello puppeteer!"});
})