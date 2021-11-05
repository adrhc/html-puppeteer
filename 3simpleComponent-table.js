import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/component/SimpleComponent.js";
import {getTotalHeight} from "./ro/go/adrhc/html-puppeteer/util/DomUtils.js";

$(() => {
    new SimpleComponent(addDebugger({elemIdOrJQuery: "debugger-component"})
        .to({elemIdOrJQuery: "component"})).render();

    $('textarea').height(getTotalHeight);
})