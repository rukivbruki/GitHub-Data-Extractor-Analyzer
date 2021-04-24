// const express = require('express');
// const { v4: uuidv4 } = require('uuid');
//
// const app = express();
//
// app.get('/', (req, res) => {
//   const store = new Map().set('requestId', uuidv4());
//   const id = store.get('requestId');
//   setTimeout(() => {
//     console.log(`[${id}] request received`);
//   }, 0);
//   res.send('Ok');
// });
//
// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Express server listening on port ${port}`));

const fs = require('fs');
const users_GraphQL = fs.readFileSync('./users_GraphQL.txt', 'utf-8'); //?
const users_REST = fs.readFileSync('./users_REST_API.txt', 'utf-8'); //?
const users_GraphQlArr = users_GraphQL.split(','); //?
const users_RESTArr = users_REST.split(','); //?

// const users_GraphQlArr = ['b','c','d','w']; //?
// const users_RESTArr = ['b','c','d','r'] //?

let difference = users_GraphQlArr
    .filter((x) => users_RESTArr.includes(x))
    .concat(users_RESTArr.filter((x) => users_GraphQlArr.includes(x)));

let differenceGraphQL = users_GraphQlArr
    .filter((x) => !users_RESTArr.includes(x)).length
let differenceREST = users_RESTArr.filter((x) => !users_GraphQlArr.includes(x)).length

let dif = new Set(difference)
console.log(differenceREST, differenceGraphQL)


console.log("Всего REST: ", users_RESTArr.length);
console.log("Всего Graph: ", users_GraphQlArr.length);
console.log("Остаток REST: ", differenceREST / (users_RESTArr.length + users_GraphQlArr.length) * 100);
console.log("Остаток GraphQL: ", differenceGraphQL / (users_RESTArr.length + users_GraphQlArr.length) * 100);
console.log("Пересечение (коньюнкция): ", (dif.size / (users_RESTArr.length + users_GraphQlArr.length)) * 100 * 2);
