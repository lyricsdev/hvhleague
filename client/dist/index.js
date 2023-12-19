"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_socket = require("socket.io-client");

// src/handlers/keyhandler.ts
var import_readline = __toESM(require("readline"));
import_readline.default.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
var handler = (socket2) => {
  process.stdin.on("keypress", (chunk, key) => {
    if (key && key.name == "q")
      console.log("key detexct");
  });
};

// src/index.ts
var newInformation = {
  servername: "test1",
  location: "eu",
  ip: "127.0.0.1",
  port: "27015"
};
var socket = (0, import_socket.io)("http://localhost:3002", {
  auth: {
    "serverAuth": JSON.stringify({ newInformation })
  }
});
handler(socket);
