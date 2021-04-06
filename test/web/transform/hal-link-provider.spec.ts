
import test from "ava";

import * as transform from "../../../src/web/transform";

test("HALLinkProvider", t => {
    const halLinkProvider = new transform.HALLinkProvider({
        relation: "test",
        operator: (obj) => "/test"
    });

    halLinkProvider.write({});
    const obj = halLinkProvider.read();

    t.is(obj._links.test.href, "/test");
});