"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Pool } = require("pg");
const connectionString = process.env.URL_DB;
console.log(process.env.URL_DB);
const pool = new Pool({
    // the line below is equivalent to connectionString: connectionString,
    connectionString,
});
// check the connection 
pool.connect((err, pool) => {
    if (err) {
        console.error("Pool error: ", err.message, err.stack);
        return;
    }
    console.error("Pool connected on: ", pool.user);
});
// export the pool to be able to use it to run Queries
module.exports = pool;
//# sourceMappingURL=db.js.map