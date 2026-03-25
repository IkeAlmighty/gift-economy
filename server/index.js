const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create route for posting a blob

// create a route for retrieving a blob

// create a route for posting a delete record for a blog

// create a cron that periodically deletes expired blobs
