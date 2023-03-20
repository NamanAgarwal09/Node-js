const http = require('http');
const fs = require('fs');
const url = require('url');

//Fetching Data
const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

const TempOverview = fs.readFileSync('./templates/overview.html', 'utf-8');
const TempCard = fs.readFileSync('./templates/templates-card.html', 'utf-8');
const TempProduct = fs.readFileSync('./templates/Product.html', 'utf-8');

//replace template data with data in json file
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DISCRIPTION%}/g, product.description);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}


const server = http.createServer((req, res) => {
    // const pathname = req.url;
    // const query = new URL(req.url, 'http://localhost:8090');
    // console.log(query.searchParams);
    // console.log(query);

    const { query, pathname } = url.parse(req.url, true);

    console.log(pathname);

    //Overview Page
    if (pathname == '/overview' || pathname == '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        // console.log(cardHtml);
        const cardHtml = dataObj.map(el => replaceTemplate(TempCard, el)).join(''); //el here holds data from data.json
        const output = TempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        res.end(output);
    }

    //Blog Page
    else if (pathname == '/product.htmly') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        console.log('product:');
        console.log(query);
        const product = dataObj[query.id];
        console.log(product);
        const output = replaceTemplate(TempProduct, product);
        res.end(output);

    }

    //API
    else if (pathname == '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.write(data);
        res.end();
    }

    //Not Found
    else {
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.write('<h1>Page not is  found</h1>');
        res.end();
    }
});

server.listen('8000', '127.0.0.1', () => {
    console.log('listing radio on 8090');
});