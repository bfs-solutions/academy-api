
import * as path from "path";

import * as express from "express";

export default express.static(path.join(
    path.dirname(require.resolve('@smart-academy/academy/package.json')),
    'build'
));