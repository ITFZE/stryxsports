var destination = $.net.http.readDestination("ITSFZE.Development.stryxsports.services.destination", "Connection");
var client = new $.net.http.Client();

var req = new $.web.WebRequest($.net.http.POST, "/b1s/v1/$batch");
req.headers.set("Content-Type", "multipart/mixed;boundry=batch_myBatch001");
req.cookies.set("B1SESSION", "88fe9086-a91e-11e8-8000-001dd8b72263");
req.entities.create();
var cbody = "--batch_myBatch001" + " \n" +
	"Content-Type:application/http" + " \n" +
	"Content-Transfer-Encoding:binary" + " \n" + " \n" +
	"GET /b1s/v1/U_SS_SPORTS(35) " + " \n" + " \n" +
	"--batch_myBatch001" + " \n" +
	"Content-Type:application/http" + " \n" +
	"Content-Transfer-Encoding:binary" + " \n" + " \n" +
	"GET /b1s/v1/U_SS_SPORTS(34) " + " \n" + " \n" +
	"--batch_myBatch001--";
req.setBody(cbody.toString());

client.request(req, destination);
var response = client.getResponse();

//Variables for response handling
var myCookies = [],
	myHeader = [],
	myBody = null,
	myBodyEntities = null;

//Cookies  
for (var c in response.cookies) {
	myCookies.push(response.cookies[c]);
}

//Headers  
for (var h in response.headers) {
	myHeader.push(response.headers[h]);
}

// Body  
if (response.body)
	try {
		myBody = JSON.parse(response.body.asString());
	} catch (e) {
		myBody = e;
	}

//Entities Body 
for (var w in response.entities) {
	if (response.entities[w].body) {
		try {
			myBodyEntities = JSON.parse(response.entities[w].body.asString());
		} catch (e) {
			myBodyEntities = response.entities[w].body.asString();
		}
	}
}

$.response.contentType = "application/json";
$.response.status = response.status;
$.response.setBody(JSON.stringify({
	"status": response.status,
	"cookies": myCookies,
	"headers": myHeader,
	"body": myBody,
	"myBodyEntities": myBodyEntities
}));