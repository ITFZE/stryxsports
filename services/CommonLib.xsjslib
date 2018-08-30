function createRequest(path, method, body, sessionID, routeID) {
	try {
		var destination = $.net.http.readDestination("ITSFZE.Development.stryxsports.services.destination", "Connection");
		var client = new $.net.http.Client();
		//var cSession = $.Session();

		var header = "";
		if (method === $.net.http.PATCH) {
			method = $.net.http.POST;
			header = "X-HTTP-Method-Override: PATCH";
		}
		var req = new $.web.WebRequest(method, path);
		if (method === $.net.http.GET) {
			req.headers.set("Prefer", "odata.maxpagesize=1000");
			req.headers.set("B1S-CaseInsensitive", "true");
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

function getResponse(resp) {
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
		if (response.body) {
			try {
				myBody = JSON.parse(response.body.asString());
			} catch (e) {
				myBody = response.body.asString();
			}
		}

		$.response.contentType = "application/json";

		$.response.status = response.status;

		$.response.setBody(JSON.stringify({
			"status": response.status,
			"cookies": myCookies,
			"headers": myHeader,
			"body": myBody
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

function getResponseJson(resp) {
	try {
		var response = resp;
		var myBody = null;
		//Body  
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
			code = myBody.value[0].Code;
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

function sendTeamRequest(path, method, body, sessionID, routeID) {

	try {
		var destination = $.net.http.readDestination("ITSFZE.Development.stryxsports.services.destination", "Connection");
		var client = new $.net.http.Client();
		var req = new $.net.http.Request($.net.http.POST, "/b1s/v1/$batch");
		req.headers.set("Content-Type", "multipart/mixed;charset=utf-8;boundary=batch_myBatch001");
		req.cookies.set("B1SESSION", sessionID);
		req.setBody(body.toString());
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

function sendBatchRequest(path, method, body, sessionID, routeID) {

	try {
		var destination = $.net.http.readDestination("ITSFZE.Development.stryxsports.services.destination", "Connection");
		var client = new $.net.http.Client();
		var req = new $.net.http.Request($.net.http.POST, "/b1s/v1/$batch");
		req.headers.set("Content-Type", "multipart/mixed;charset=utf-8;boundary=batch_myBatch001");
		req.cookies.set("B1SESSION", sessionID);
		req.setBody(body.toString());
		client.request(req, destination);
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
				$.trace.warning("callServiceLayer Exception: " + e.message);
				$.response.contentType = "application/json";
				$.response.setBody(JSON.stringify({
					"error": e.message
				}));
			}
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function getBatchRequest(path, method, body, sessionID, routeID) {

	try {
		var destination = $.net.http.readDestination("ITSFZE.Development.stryxsports.services.destination", "Connection");
		var client = new $.net.http.Client();
		var req = new $.net.http.Request($.net.http.POST, "/b1s/v1/$batch");
		req.headers.set("Content-Type", "multipart/mixed;charset=utf-8;boundary=batch_myBatch001");
		req.cookies.set("B1SESSION", sessionID);
		req.setBody(body);
		client.request(req, destination);
		var response = client.getResponse();
		return response;
	/*	//Variables for response handling
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
				$.trace.warning("callServiceLayer Exception: " + e.message);
				$.response.contentType = "application/json";
				$.response.setBody(JSON.stringify({
					"error": e.message
				}));
			}

		//Entities Body 
		for (var w in response.entities) {
			if (response.entities[w].body) {
				try {
					myEntityBody = JSON.parse(response.entities[w].body.asString());
				} catch (e) {
					myEntityBody = response.entities[w].body.asString();
				}
			}
		}*/
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}