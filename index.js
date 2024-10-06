//CORE modules
const fs = require('fs');
const http = require('http');
const url = require('url');
//THIRD PARTY modules
const slugify = require('slugify');
//CUSTOM modules
const replaceTemplate = require('./modules/replaceTemplate');

/*
//////////////////////////////////////////////   FILES   //////////////////////////////////////////////
*/

//blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${new Date()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

//Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR 😥');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       //write file async (output file, template, textEncoding, callback)
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}` , 'utf-8', err => {
//         console.log('File generated! 😎');
//       });
//       console.log('Generating file...');
//     });
//   });
// });
// console.log('Reading file...');

/*
//////////////////////////////////////////////  SERVER   ///////////////////////////////////////////////
*/

//#region Utils //////////////////////////////////////////////

//Preload HTML templates
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

//Preload JSON data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//init slugs
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.warn(`slugs: ${slugs}`);

//#endregion

//Init server
const server = http.createServer((req, resp) => {
  const { query, pathname } = url.parse(req.url, true);

  switch (pathname) {
    case '/':
    // Products overview page
    case '/overview':
      resp.writeHead(200, {
        'content-type': 'text/html',
      });

      //for each JSON object I get the card template and replace the placeholder with the actual data of the item
      const cardsHTML = dataObj
        .map((el) => replaceTemplate(tempCard, el))
        .join('');

      //replace the {{PRODUCT_CARDS}} placeholder in the overview template with cardsHTML
      const output = tempOverview.replace('{{PRODUCT_CARDS}}', cardsHTML);
      resp.end(output);
      break;

    // Product detail page
    case '/product':
      //get selected product
      const product = dataObj[query.id];

      //replace the placeholders in the product template with actual data
      const output2 = replaceTemplate(tempProduct, product);
      resp.writeHead(200, {
        'content-type': 'text/html',
      });
      resp.end(output2);
      break;

    // API page
    case '/api':
      resp.writeHead(200, {
        'content-type': 'application/json',
      });
      resp.end(data);
      break;

    // Not found default page
    default:
      resp.writeHead(404, 'Not found', {
        'content-type': 'text/html',
      });
      resp.end('<h1> Page not found </h1>');
      break;
  }
});

const port = 8000;
const host = '127.0.0.1'; //localhost

server.listen(port, host, () => {
  console.log(`Listening to requests on port ${port} ...`);
});
