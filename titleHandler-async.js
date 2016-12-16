var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var url = require("url");
var app = express();
var async = require("async");


/*
Validates whether the string is a valid url
*Params*
*value* *string* *url string*
*/
function validateUrl(value){
  return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}

/*
Adds title in a list to be returned
*Params*
*res* *object handler* *handler to render the html*
*url* *string* *the input url*
*title* *string* * title of the input url page*
*/
function addTitleToList(res , url, title)
{
  res.write('<ul><li>Title of Url: <strong> ' + url + ' </strong> is - <strong>' + title + '</strong></li></ul>');
  return;
}

/*
Get Title of the Given Url
*Params*
*inputUrl* *string* *input url*
*callback* *function* *Callback function*
*/
function getTitleOfUrl(inputUrl, callback) {

  if (!inputUrl) { // do nothing in case of empty string
    return;
  }
  var tempUrl = url.parse(inputUrl);
  if (tempUrl.protocol === null) {
    inputUrl = "http://" + inputUrl;
  }
  if(validateUrl(inputUrl)) {
    request(inputUrl, function(err, resp, body) {
      if (err) {
        urlTitle = 'INVAILD URL';
        callback(urlTitle);
        return;
      }
      $ = cheerio.load(body);
      urlTitle =  $('title').text();
      callback(urlTitle);
    });
  } else {
    urlTitle=  'NO RESPONSE';
    callback(urlTitle);
  }
}

// Definition of the API
app.get('/I/want/title/', function(req, res) {
  var requestUrl =  req.url, urlParam, urlTitle;
  res.write('<html><title>CareAxiom Task</title><body>');
  res.write('<h1> Following are the titles of given websites: </h1>');
  if (requestUrl.indexOf('&') > -1) {
    async.each(req.query.address, function (inputUrl, callback_e) {
      getTitleOfUrl(inputUrl, function (urlTitle) {
        addTitleToList(res, inputUrl, urlTitle);
      });
    }, function (err) {
      if (err) {
        console.log(err);
      }
    });
  } else {
    inputUrl = req.query.address;
    getTitleOfUrl(inputUrl, function (urlTitle) {
      addTitleToList(res, inputUrl, urlTitle);
    });
  }
});

// Print this message in case of any other API URL
app.get('*', function(req, res) {
  res.status(404).send('<html><title>CareAxiom Task</title><head></head><body><h1> 404 - Page Not Found </he></body></html>');
});

// opening connection on port 8080
app.listen(8080, function () {
  console.log('Listening on port: 8080');
});