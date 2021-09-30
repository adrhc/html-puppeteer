import Scenario13App from "./ro/go/adrhc/app/Scenario13App.js";
import SimpleContainerComponent from "./ro/go/adrhc/html-puppeteer/core/component/SimpleContainerComponent.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";

$(() => {
    // the puppeteer
    const component = new SimpleContainerComponent(
        addDebugger({debuggerElemIdOrJQuery: "main-debugger"})
            .to({elemIdOrJQuery: "parent-component"})).render();

    // the application using the html-puppeteer
    new Scenario13App(component, {innerPart: "dogs"}).run();
});