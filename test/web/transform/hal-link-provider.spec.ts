
import test from "ava";

import * as transform from "../../../src/web/transform";

test(t => {
    let halLinkProvider = new transform.HALLinkProvider({
        relation: "test",
        operator: (obj) => "/test"
    });

    halLinkProvider.write({});
    let obj = halLinkProvider.read();

    t.is(obj._links.test.href, "/test");
});