var destination = $.net.http.readDestination("ITSFZE.Development.stryxsports.services.destination", "Connection");
var client = new $.net.http.Client();

var req = new $.web.WebRequest($.net.http.POST, "/b1s/v1/$batch");
req.headers.set("Content-Type","multipart/mixed;charset=utf-8;boundary=batch_001");

var data = "--batch_001\n" + 
"Content-Type: application/http \n" +
"Content-Transfer-Encoding: binary\n\n" +
//"Content-ID: 1\n\n" +
"GET /b1s/v1/Items HTTP/1.1\n\n" +
"--batch_001\n" + 
"Content-Type: application/http \n" +
"Content-Transfer-Encoding: binary\n\n" +
//"Content-ID: 2\n\n" +
"GET /b1s/v1/U_SS_SPORTS HTTP/1.1\n\n" +
"--batch_001--\n\n";

req.setBody(data);

/*req.entities.create();
req.entities[0].headers.set("Content-Type","multipart/mixed;charset=utf-8;boundary=batch_001");

req.entities[0].setBody(data);*/
req.cookies.set("B1SESSION", "c14281a4-a9c4-11e8-8000-001dd8b72263");
req.cookies.set("ROUTEID", ".node0");
/*req.entities[0].setBody( 
            "--batch_myBatch001"
            + " \n" 
            + "Content-Type:application/http"
            + " \n"
            + "Content-Transfer-Encoding:binary"
            + " \n" 
            + " \n" 
            + "--changeset_myChangeset001" 
            + " \n"
            + " \n"
            + "Get /b1s/v1/U_SS_SPORTS" 
            + " \n"
            + " \n" 
            + '{ "Code": 63,"Name": "Gymnastics_BATCH1","U_SportsDescription": "Gymnastics","U_Status": "1"}'
            + " \n"
            + "--changeset_myChangeset001" 
            + " \n" 
            + "Content-Type:application/http"
            + " \n"
            + "Content-Transfer-Encoding:binary"
            + " \n"
            + " \n"
            + "POST /b1s/v1/U_SS_SPORTS" 
            + " \n"
            + " \n" 
            + '{ "Code": 60,"Name": "Gymnastics_BATCH2","U_SportsDescription": "Gymnastics","U_Status": "1"}'
            + " \n"
            + " \n" 
            + "--changeset_myChangeset001--" 
            + " \n"
            + "--batch_myBatch001--" );*/
            
var retObj = client.request(req, destination);
var response = client.getResponse();

//Variables for response handling
var myCookies = [],
    myHeader = [],
    myBody = null,
    myEntityBody = null;

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
    myBody =e;
}
var ele = [];
//Entities Body 
for (var w in response.entities) {
    if (response.entities[w].body){
        try {
            myEntityBody = JSON.parse(response.entities[w].body.asString());
            ele.push(myEntityBody);
            } catch (e) {
                myEntityBody = response.entities[w].body.asString();
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
    "entitybody": ele
}));
    