const express = require('express');
const parser = require("body-parser");
const https = require("https");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");


const app = express();
app.use(parser.urlencoded({extended: true})); // parser HTTP form post
app.use(express.static("public")); // so that browser can access server file system under public folder
const port = 3000;

const key = "ae53435773b95ac3b8bba49b8f7359b5-us18";
const prefix = "us18"; // server prefix
const audienceID = "34f889fd3a";

mailchimp.setConfig({
  apiKey: key,
  server: prefix,
});
/*
async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}
run(); // mailchimp health check
*/

// handle get request to /
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


// handle post request to /
/*
app.post('/', (req, response) => {
  // first get geo location

  var cityName = req.body.cityName; // read from the post form
  var request = ("https://api.openweathermap.org/geo/1.0/direct?limit=1&q=" + cityName+ "&appid=" + apiKey);
  var body = "";
  https.get(request, (res)=>{
    res.on('data', function(data) { body += data; });
    res.on("end", () => {
          locObj = JSON.parse(body)[0];
          // console.log(locObj);
          const lat = locObj.lat; // number
          const lon = locObj.lon; // number
          // make second request 
          const request = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon="+ lon + "&appid=" + apiKey;
          var json = "";
          https.get(request, (weatherRes)=> {
            weatherRes.on('data', function(data) { json += data; });
            weatherRes.on('end', ()=>{
              weatherObj = JSON.parse(json);
              response.write("<p>The humidity is " + weatherObj.main.humidity + "</p>");
              response.write("<p>The temp is " + weatherObj.main.temp + "</p>");
              response.send();
            });
          });   
    });
  });

});
*/
app.post('/', (req, res)=>{
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var emailAddr = req.body.emailAddr;
  // user object
  subscribingUser = {
    _firstName: firstName,
    _lastName: lastName,
    _email: emailAddr
  };
  // add contact to the current audience id
  success = addContact(audienceID, subscribingUser);
  /*
  if (success === 0)
    res.write("Success!");
  else
    res.write("Sign up failed, please try again!");
  res.send();
  */
  res.write("Success!");
  res.send();
  
  //console.log(firstName + " " + lastName + " on " + emailAddr);
});

// add contact to a audience
async function addContact(listId, subscribingUser) {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: subscribingUser._email,
    status: "subscribed",
    merge_fields: {
      FNAME: subscribingUser._firstName,
      LNAME: subscribingUser._lastName
    }
  });
  // console.log("the response is" + JSON.stringify(response));
  
  if (response.status === "subscribed") {
    console.log(
      "Successfully added contact as an audience member. The contact's id is " + response.id
    );
    return 0;
  }
  else {
    console.log("error: " + response.status);
    return -1;
  }
  

}

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});

/*
// city name to [lat, lon]
function CityToLoc(cityName) {
  var request = ("https://api.openweathermap.org/geo/1.0/direct?limit=1&q=" + cityName+ "&appid=" + apiKey);
  var body = "";
  https.get(request, (res)=>{
    res.on('data', function(data) { body += data; });
    res.on("end", () => {
          locObj = JSON.parse(body);
          // nnnnnnnnn
    });
  });
  // use promise to get return from callback
  return [locObj.lat, locObj.lon];
}
*/