
import test from "ava";

import * as transform from "../../../src/web/transform";

test(t => {
    let instanceToJson = new transform.InstanceToJson();

    instanceToJson.write({toJSON: () => "instance"});
    let obj = instanceToJson.read();

    t.is(obj, "instance");
});