var baseURL = "/b1s/v1";
var generalResp;

function createRequest(path, method, body, sessionID, routeID) {
	try {
		var destination = $.net.http.readDestination("stryx.services.destination", "Connection");
		var client = new $.net.http.Client();
		var header = "";
		if (method === $.net.http.PATCH) {
			method = $.net.http.POST;
			header = "X-HTTP-Method-Override: PATCH";
		}
		var req = new $.web.WebRequest(method, path);
		if (method === $.net.http.GET) {
			req.headers.set("Prefer", "odata.maxpagesize=1000");
			req.headers.set("B1S-CaseInsensitive","true");
		}
		if (header !== "") {
			req.headers.set("X-HTTP-Method-Override", "PATCH");
		}
		if (body) {
			req.setBody(body);
		}
		if (sessionID) {
			req.cookies.set("B1SESSION", sessionID);
		}
		if (routeID) {
			req.cookies.set("ROUTEID", routeID);
		}
		client.request(req, destination);
		var response = client.getResponse();
		return response;
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function getResponseJson(resp) {
	try {
		var response = resp;
		var myBody = null;
		if (response.body) {
			try {
				myBody = JSON.parse(response.body.asString());
			} catch (e) {
				$.trace.warning("callServiceLayer Exception: " + e.message);
				$.response.contentType = "application/json";
				$.response.setBody(JSON.stringify({
					"error": e.message
				}));
			}
		}
		return myBody;
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function getNewCode(path, method, body, sessionID, routeID) {
	try {
		var resp = createRequest(path, method, body, sessionID, routeID);
		var myBody = getResponseJson(resp);
		var code = 0;
		if (myBody.value.length > 0) {
			code = myBody.value[0].ActivityCode;
		} else {
			code = code;
		}
		return code;
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function getResponseWithBody(resp, mybody) {
	try {
		var response = resp;
		var myCookies = [],
			myHeader = [],
			myBody = null;

		//Cookies  
		for (var c in response.cookies) {
			myCookies.push(response.cookies[c]);
		}
		//Headers  
		for (var h in response.headers) {
			myHeader.push(response.headers[h]);
		}
		//Body  
		/*if (response.body) {
            try {
                myBody = JSON.parse(response.body.asString());
            } catch (e) {
            myBody = response.body.asString();
            }
        }*/
		//myBody = JSON.parse(mybody.toString());
		$.response.contentType = "application/json";

		$.response.status = response.status;

		$.response.setBody(JSON.stringify({
			"status": response.status,
			"cookies": myCookies,
			"headers": myHeader,
			"body": mybody
		}));

		$.trace.debug("callServiceLayer response status: " + $.response.status);
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function createActivity(path, method, body, sessionID, routeID) {

  var tmpBody = JSON.parse(body);
  //delete tmpBody.State;
	var gPath = path;
	gPath += "?$top=1&$orderby=ActivityCode%20desc";
	var newCode = getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
	var setNewCardCode = newCode + 1;
	tmpBody.ActivityCode = setNewCardCode;

	var resp = createRequest(path, $.net.http.POST, JSON.stringify(tmpBody), sessionID, routeID);
	var getResp = getResponseJson(resp);
    getResponseWithBody(resp, getResp);
}
function getActivities(path, method, body, sessionID, routeID){
	var resp = createRequest(path, method, body, sessionID, routeID);
	var getResp = getResponseJson(resp);
	var myBody = getResp.value;
	var retVal = [];
	if(myBody.length > 0){
	    myBody.forEach(function(ele){
	        var apath = encodeURI(baseURL + "/Activities?$filter=HandledByEmployee eq " + ele.Activities.HandledByEmployee + " and CardCode eq '" + ele.BusinessPartners.CardCode + "'&$select=StartDate,StartTime,EndTime,EndDueDate,Subject,Notes,Details,ActivityType,ActivityCode");
	        var aResp = createRequest(apath, method, body, sessionID, routeID);
	        var act = getResponseJson(aResp);
	        ele.BusinessPartners.Activities= act.value;
	        retVal.push(ele.BusinessPartners);
	    });
	}
	getResponseWithBody(resp, retVal);
}

function updateActivityID(path, method, body, sessionID, routeID){ 
    
}