import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/SimpleComponent.js";

$(() => {
    new SimpleComponent(addDebugger().to({elemIdOrJQuery: "component"})).render();
})