/*
Interacting with external services through RESTfull API

Make sure you read the food2fork API documentation at
http://food2fork.com/about/api   

IMPORTANT: You will need to register for a food2fork app id before
running this code. Paste the ID in the appropriate location below.    

Simple example of node.js app serving contents based 
on an available internet api service. 

To Test: Use browser to view 
http://localhost:3000/
or
http://localhost:3000/?ingredient=Basil
*/

let http = require('http')
let url = require('url')
let qstring = require('querystring')

const PORT = process.env.PORT || 3000
//Please register for your own key at food2fork.com
//and replace this with your own.
const API_KEY = '4a09762a9495a6775db6453c4ba1061a' //L.D. Nel food2fork app id

function sendResponse(data, res){
  var page = '<html><head><title>API Example</title></head>' +
    '<body>' +
    '<form method="post">' +
    'Ingredient: <input name="ingredient"><br>' +
    '<input type="submit" value="Get Recipes">' +
    '</form>'
  if(data){
    page += '<h1>Recipes' + '</h1><p>' + data +'</p>'
  }
  page += '</body></html>'    
  res.end(page);
}

function parseData(apiResponse, res) {
  let apiData = ''
  apiResponse.on('data', function (chunk) {
    apiData += chunk
  })
  apiResponse.on('end', function () {
    sendResponse(apiData, res)
  })
}

function getRecipes(ingredient, res){

//You need to provide an appid with your request.
//Many API services now require that clients register for an app id.

 
  const options = {
     host: 'www.food2fork.com',
     path: `/api/search?q=${ingredient}&key=${API_KEY}`
  }
  http.request(options, function(apiResponse){
    parseData(apiResponse, res)
  }).end()
} 

http.createServer(function (req, res) {
  let requestURL = req.url
  let query = url.parse(requestURL).query //GET method query parameters if any
  let method = req.method
  console.log(`${method}: ${requestURL}`)
  console.log(`query: ${query}`) //GET method query parameters if any
  
  if (req.method == "POST"){
    let reqData = ''
    req.on('data', function (chunk) {
      reqData += chunk
    })
    req.on('end', function() {
	  console.log(reqData);
      let queryParams = qstring.parse(reqData)
	  console.log(queryParams)
      getRecipes(queryParams.ingredient, res)
    })
  } 
  else if (req.method == "GET"){
	let queryParams = qstring.parse(query)
	console.log(queryParams)
	if(queryParams.ingredient) getRecipes(queryParams.ingredient, res)
	else sendResponse(null, res)

  }else{
    sendResponse(null, res)
  }
}).listen(PORT, (error) => {
  if (error)
    return console.log(error)
  console.log(`Server is listening on PORT ${PORT} CNTL-C to quit`)
})
