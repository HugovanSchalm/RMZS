const https = require('https')
const fs = require('fs')
window.$ = window.jQuery = require('./js/jquery-3.4.1.min.js')

var mpURL = "bruhapi.myparcel.nl";
var mpKey = "914bb634d3cf4a01ba809dd4b121e33f9d2ea50a";

getMyParcelData();

function getMyParcelData(){
  let keyBuffer = new Buffer.from(mpKey);
  let base64Key = keyBuffer.toString("base64");

  
  var data = "";

  var options = {
    hostname: mpURL,
    path: "/shipments",
    method: "GET",
    headers:{
      "Host": mpURL,
      "Authorization": "base " + base64Key,
      "Content-Type": "application/json;charset=utf-8",
      "Connection": "keep-alive",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache",
      "Upgrade-Insecure-Requests": 1,
      "Accept-Encoding": "gzip, deflate, sdch, br",
      "User-Agent": "CustomApiCall/2"
    }
  }

  var request = https.request(options, function(result){
    result.on('data', (d) => {
      data += d;
    });
    result.on("end", () => {
        let parsedData = JSON.parse(data);
        let count = parsedData.data.results;
        console.log(count);
        let zending = parsedData.data.shipments;
        for(var i = 0; i < count; i++){
          let name = "<p>Naam: " + zending[i].recipient.person + "</p>";
          let adress = "<p>Adres: " + zending[i].recipient.street + " " + zending[i].recipient.number + " " + zending[i].recipient.city + "</p>";
          $("#myparcel").append(name, adress);
        }
        
        fs.writeFile("data/zendingen.json", data, (e) => {
            if(e) throw e;
            console.log("Data opgeslagen!");
        })
    })
  })
  request.on('error', (e) => {
    console.error("KON DATA VAN MYPARCEL NIET OPHALEN \n" + e);

    if(fs.existsSync("./data/zendingen.json")){
      fs.readFile("data/zendingen.json", function(err, data){
        let parsedData = JSON.parse(data);
        let count = parsedData.data.results;
        console.log(count);
        let zending = parsedData.data.shipments;
        for(var i = 0; i < count; i++){
          let name = "<p>Naam: " + zending[i].recipient.person + "</p>";
          let adress = "<p>Adres: " + zending[i].recipient.street + " " + zending[i].recipient.number + " " + zending[i].recipient.city + "</p>";
          $("#myparcel").append(name, adress);
        }
      });
      
    }
  });
  request.end();
  
  
}