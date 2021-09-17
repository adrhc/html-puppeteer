import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/SimpleComponent.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";

$(() => {
    new SimpleComponent(addDebugger().to({elemIdOrJQuery: "component"}))
        .render({text: "Hello puppeteer!"});
})