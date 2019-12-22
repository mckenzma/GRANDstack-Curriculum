"use strict";

var _apolloClient = require("apollo-client");

var _apolloClient2 = _interopRequireDefault(_apolloClient);

var _graphqlTag = require("graphql-tag");

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _seedMutations = require("./seed-mutations");

var _seedMutations2 = _interopRequireDefault(_seedMutations);

var _nodeFetch = require("node-fetch");

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _apolloLinkHttp = require("apollo-link-http");

var _apolloCacheInmemory = require("apollo-cache-inmemory");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var client = new _apolloClient2.default({
  link: new _apolloLinkHttp.HttpLink({ uri: process.env.GRAPHQL_URI, fetch: _nodeFetch2.default }),
  cache: new _apolloCacheInmemory.InMemoryCache()
});

client.mutate({
  mutation: (0, _graphqlTag2.default)(_seedMutations2.default)
}).then(function (data) {
  return console.log(data);
}).catch(function (error) {
  return console.error(error);
});