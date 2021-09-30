import Scenario13App from "./ro/go/adrhc/app/Scenario13App.js";
import {addDebugger, withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import SimpleContainerComponent from "./ro/go/adrhc/html-puppeteer/core/component/SimpleContainerComponent.js";
import {createComponent} from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";

$(() => {
    // the puppeteer
    const component = createComponent($("#parent-component"),
        withDebugger({debuggerElemIdOrJQuery: "main-debugger"})).render();
    // const component = new SimpleContainerComponent(
    //     addDebugger({debuggerElemIdOrJQuery: "main-debugger"})
    //         .to({elemIdOrJQuery: "parent-component"})).render();

    // the application using the html-puppeteer
    new Scenario13App(component, {innerPart: "dogs"}).run();
});