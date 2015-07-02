"use strict";

var request = require("request");
var cheerio = require("cheerio");

function parseGithubPage(index, item) {
  var li = cheerio(item);
  var location = li.attr("title");

  console.log("------------\npackage: ", this.packageName);
  console.log("author: ", this.author);
  console.log("repo: ", this.repo);
  console.log("location: ", location);
}

function parsePackageDetail(index, item) {
  var link = cheerio(item);
  var href = link.attr("href");
  var authorLink = href.match(/https:\/\/github.com\/([^\/]+)/);

  if (authorLink) {
    var author = authorLink[1];
    var repo = href;
    var packageName = this.packageName;
    request(
      authorLink[0]
      , function(error, response, body){
        var $ = cheerio.load(body);

        $(".vcard-detail[itemprop=homeLocation]").each(parseGithubPage.bind({
          packageName: packageName,
          author: author,
          repo: repo
        }));
      });
  }
}

function parsePackageList(index, item) {
  var link = cheerio(item);
  var packageName = link.text();
  var href = "https://www.npmjs.com" + link.attr("href");

  request(
    href
    , function(error, response, body) {
      var $ = cheerio.load(body);

      $(".sidebar .box:nth-child(2) a").each(parsePackageDetail.bind({
        packageName: packageName
      }));
    });
}


for (var i = 0; i < 100; i++) {
  var offset = i * 36;

  request(
    "https://www.npmjs.com/browse/depended?offset=" + offset
    , function(error, response, body) {
      var $ = cheerio.load(body);

      $(".package-details a.name").each(parsePackageList);
    });
}
