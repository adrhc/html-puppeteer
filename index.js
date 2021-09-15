import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/SimpleComponent.js";

$(() => {
    // $("#component").text("Hello puppeteer!");
    const component = new SimpleComponent({elemIdOrJQuery: "component"});
    component.render({text: "Hello puppeteer!"});
})