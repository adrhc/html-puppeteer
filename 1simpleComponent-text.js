import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/SimpleComponent.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";

$(() => {
    new SimpleComponent(addDebugger().to({elemIdOrJQuery: "component"}))
        .render({text: "Hello puppeteer!"});
})