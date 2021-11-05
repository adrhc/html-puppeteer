import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/component/SimpleComponent.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";

$(() => {
    new SimpleComponent(addDebugger({elemIdOrJQuery: "debugger-component"})
        .to({elemIdOrJQuery: "component"}))
        .render({text: "Hello puppeteer!"});
});