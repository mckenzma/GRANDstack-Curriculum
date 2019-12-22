"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = undefined;

var _neo4jGraphqlJs = require("neo4j-graphql-js");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Check for GRAPHQL_SCHEMA environment variable to specify schema file
 * fallback to schema.graphql if GRAPHQL_SCHEMA environment variable is not set
 */

var typeDefs = exports.typeDefs = _fs2.default.readFileSync(process.env.GRAPHQL_SCHEMA || _path2.default.join(__dirname, "schema.graphql")).toString("utf-8");