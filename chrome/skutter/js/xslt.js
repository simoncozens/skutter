var xslStylesheet;
var myDOM;

var xmlDoc;

function getXSLT (ss) {
  if (!ss) ss = "workship.xsl";
  var myXMLHTTPRequest = new XMLHttpRequest();
  myXMLHTTPRequest.open("GET", "chrome://songbee/content/xsl/"+ss, false);
  myXMLHTTPRequest.overrideMimeType('text/xml'); // Harder
  myXMLHTTPRequest.send(null);
  return myXMLHTTPRequest.responseXML;
}

function transformDOM(xml, xslt, owner){
    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslt);
    return xsltProcessor.transformToFragment(xml, owner);
}

//function transformXML(xsltUrl, xmlUrl){
//  var fragment = xsltProcessor.transformToFragment(xmlDoc, document);
//  var song = document.getElementById("song");
//  song.innerHTML = "";
//  song.appendChild(fragment);
// }
