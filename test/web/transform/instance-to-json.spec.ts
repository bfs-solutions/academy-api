
import test from "ava";

import * as transform from "../../../src/web/transform";

test("InstanceToJson", t => {
    const instanceToJson = new transform.InstanceToJson();

    instanceToJson.write({toJSON: () => "instance"});
    const obj = instanceToJson.read();

    t.is(obj, "instance");
});