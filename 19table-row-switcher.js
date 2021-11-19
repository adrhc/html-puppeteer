import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {generateString} from "./ro/go/adrhc/app/Generators.js";
import {commonOptionsOf} from "./ro/go/adrhc/app/util/Utils.js";
import {withDefaults} from "./ro/go/adrhc/html-puppeteer/core/component/options/ComponentOptionsBuilder.js";

$(() => {
    const commonOptions = commonOptionsOf("MAIN-debugger")
    const mainOptions = withDefaults(commonOptions).to({
        childStateProviderFn: () => ({id: Math.random(), name: generateString("name "), status: "readonly"})
    });
    animate({MAIN: mainOptions});
});
