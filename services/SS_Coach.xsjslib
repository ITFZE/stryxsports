var baseURL = "/b1s/v1";

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

function getAuthResponse(resp) {
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

		return response;

		$.trace.debug("callServiceLayer response status: " + $.response.status);
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function getCoachID(path, method, body, sessionID, routeID) {
	var resp = createRequest(path, method, body, sessionID, routeID);
	var myBody = getResponseJson(resp);
	myBody.CoachSports = [];
	var sPath = encodeURI(baseURL +
		"/$crossjoin(U_SS_COACHES_SPORTS,U_SS_SPORTS)?$expand=U_SS_COACHES_SPORTS($select=Code,Name,U_EmployeeCode, U_SportCode )" +
		",U_SS_SPORTS($select=Code, Name, U_SportsDescription,U_Status)&" + 
		"$filter=U_SS_COACHES_SPORTS/U_SportCode eq U_SS_SPORTS/Code and U_SS_COACHES_SPORTS/U_EmployeeCode eq '" + 
		myBody.EmployeeID + "'");
	var sResp = createRequest(sPath, $.net.http.GET, body, sessionID, routeID);
	var sBody = getResponseJson(sResp);
	if (sBody !== null && sBody.value.length > 0) {
		var tmpBody = JSON.stringify(sBody);
		var tmpJson = JSON.parse(tmpBody);
		for (var i = 0; i < sBody.value.length; i++) {
		    sBody.value[i].U_SS_COACHES_SPORTS.sports = tmpJson.value[i].U_SS_SPORTS;
		    sBody.value[i].U_SS_COACHES_SPORTS.rec_status = 'e';
		    delete sBody.value[i].U_SS_SPORTS;
		    myBody.CoachSports.push(sBody.value[i].U_SS_COACHES_SPORTS);
		}
	}
	getResponseWithBody(resp, myBody);
}

function updateCoachByID(path, method, body, sessionID, routeID) {
	var comStrBody = body;
	var comObj = JSON.parse(comStrBody);
    var coachSport = comObj.CoachSports
    if (coachSport.length > 0) {
        var sPath = encodeURI(baseURL + "/U_SS_COACHES_SPORTS");
        for (var i = 0; i < coachSport.length; i++) {
            var tmpCSStr = JSON.stringify(coachSport[i]);
            var tmpCS = JSON.parse(tmpCSStr);
            var recAction = coachSport[i].rec_status.toString();
			switch (recAction) {
				case "n":
				    var gPath = sPath + "?$top=1&$orderby=Code%20desc";
					var newCode = getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
					tmpCS.Code = newCode + 1;
					delete tmpCS.sports;
					delete tmpCS.rec_status;
					var csResp = createRequest(sPath, $.net.http.POST, JSON.stringify(tmpCS), sessionID, routeID);
					getResponseJson(csResp);
					break;
				case "de":
				case "dn":
					var dPath =sPath + "(" + tmpCS.Code + ")";
					var delResp = createRequest(dPath, $.net.http.DEL, body, sessionID, routeID);
					getResponseJson(delResp);
					break;
				default:
					break;
			}
        }
    }
}