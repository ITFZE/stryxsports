var baseURL = "/b1s/v1";
var libPath = "/ITSFZE/Development/stryxsports/services/";
var cmnLib = $.import(libPath + "CommonLib.xsjslib");

function createBatchRequest(path, method, body, sessionID, routeID) {
	try {
		var destination = $.net.http.readDestination("ITSFZE.Development.stryxsports.services.destination", "Connection");
		var client = new $.net.http.Client();

		var req = new $.web.WebRequest(method, path);
        req.headers.set("Content-Type", "multipart/mixed;charset=utf-8;boundary=batch_POST_U_SS_TEAM_CALENDAR");
        
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

function createTeamCalendar(path, method, body, sessionID, routeID) {
	try {
	    var bReqBody = "";
		var hPath = path;
		hPath += "?$top=1&$orderby=Code%20desc";
		var newCode = cmnLib.getNewCode(hPath, $.net.http.GET, body, sessionID, routeID);
		var tmpBody = JSON.parse(body);
        for(var i=0; i<tmpBody.length; i++){
            tmpBody[i].Code = newCode + i + 1;
        }
		//tmpBody.Code = newCode + 1;
		var bPath = "/b1s/v1/$batch";
        for(var i=0; i<tmpBody.length; i++){
            var prefix = "--batch_POST_U_SS_TEAM_CALENDAR" + "\r\n" + "\r\n" +
            "Content-Type: application/http" + "\r\n" +
            "Content-Transfer-Encoding: binary" + "\r\n" +
            "POST /U_SS_TEAM_CALENDAR HTTP/1.1" + "\r\n" + "\r\n" +
            JSON.stringify(tmpBody[i]);
            bReqBody += "\r\n" + prefix + "\r\n";
            if(i === tmpBody.length-1){
                bReqBody += "\r\n" + "--batch_POST_U_SS_TEAM_CALENDAR--";
            }
        }
        var reqBody = bReqBody;
/*		var resp = createBatchRequest(bPath, $.net.http.POST, bReqBody, sessionID, routeID);
		var mybody = cmnLib.getResponseJson(resp);
		if (mybody.error !== undefined) {
			if (mybody.error.code === -2028) {
				var getResp = cmnLib.createRequest(hPath, $.net.http.GET, body, sessionID, routeID);
				cmnLib.getResponse(getResp);
			} else {
				cmnLib.getResponseWithBody(resp, mybody);
			}
		} else {
		    cmnLib.getResponseWithBody(resp, mybody);
		}*/
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}