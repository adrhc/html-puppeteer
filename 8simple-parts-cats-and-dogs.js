import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import {withPeriodicallyGenerateDogsOrCats} from "./ro/go/adrhc/app/Generators.js";
import {getTotalHeight} from "./ro/go/adrhc/html-puppeteer/util/DomUtils.js";

$(() => {
    // component creation and rendering
    const component = animate(withDebugger({elemIdOrJQuery: "debugger-component"}));

    // state changing actions (aka component's usage)
    withPeriodicallyGenerateDogsOrCats(part => {
        component.doWithState(sh => sh.replacePart(part.name, part.value));
        $('textarea').height(0);
        $('textarea').height(getTotalHeight);
    });
});