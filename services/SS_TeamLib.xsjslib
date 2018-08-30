var greetingPrefix = "Hello, ";
var greetingSuffix = "!";
var baseURL = "/b1s/v1";
var libPath = "/ITSFZE/Development/stryxsports/services/";
var cmnLib = $.import(libPath + "CommonLib.xsjslib");
var tCalSchLib = $.import(libPath + "SS_TCalScheduleLib.xsjslib");

function createRequest(path, method, body, sessionID, routeID) {
	try {
		var destination = $.net.http.readDestination("ITSFZE.Development.stryxsports.services.destination", "Connection");
		var client = new $.net.http.Client();
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

function createSS(path, method, body, sessionID, routeID) {
	try {
		var gPath = path;
		gPath += "?$top=1&$orderby=Code%20desc";
		var newCode = getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
		var tmpBody = JSON.parse(body);
		tmpBody.Code = newCode + 1;
		var resp = createRequest(path, $.net.http.POST, JSON.stringify(tmpBody), sessionID, routeID);
		getResponse(resp);
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function createTeam(path, method, body, sessionID, routeID) {
	var tmBody = body;
	var tmBodyJson = JSON.parse(tmBody);
	delete tmBodyJson.Coaches;
	delete tmBodyJson.Calendar;
	var tmPath = path + "?$top=1&$orderby=Code%20desc";
	var newTMCode = getNewCode(tmPath, $.net.http.GET, body, sessionID, routeID);
	tmBodyJson.Code = newTMCode + 1;
	var tmResp = createRequest(path, $.net.http.POST, JSON.stringify(tmBodyJson), sessionID, routeID);
	var tmRet = getResponseJson(tmResp);
	//check responose
	var teamMD = JSON.parse(tmBody);
	teamMD.Code = newTMCode + 1;
	for (var i = 0; i < teamMD.Coaches.length; i++) {
		var tmpTMCoach = {
			Code: 0,
			Name: "",
			U_TeamCode: "",
			U_CoachCode: ""
		};
		tmpTMCoach.Name = teamMD.Name + '-' + teamMD.Coaches[i].FirstName;
		tmpTMCoach.U_TeamCode = teamMD.Code.toString();
		tmpTMCoach.U_CoachCode = teamMD.Coaches[i].EmployeeID.toString();
		var cPath = encodeURI(baseURL + "/U_SS_TEAMS_COACHES");
		var gPath = cPath + "?$top=1&$orderby=Code%20desc";
		var newCode = getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
		tmpTMCoach.Code = newCode + 1;
		var csResp = createRequest(cPath, $.net.http.POST, JSON.stringify(tmpTMCoach), sessionID, routeID);
		getResponseJson(csResp);
	}
	getResponseWithBody(tmResp, tmRet);
}

function getTeamByID(path, method, body, sessionID, routeID) {
	var resp = createRequest(path, method, body, sessionID, routeID);
	var myBody = getResponseJson(resp);
	//fetch Category_SPORTS
	var csPath = encodeURI(baseURL + "/U_SS_CAT_SPORTS(" + myBody.U_CategorySports + ")");
	var csResp = createRequest(csPath, $.net.http.GET, body, sessionID, routeID);
	var csBody = getResponseJson(csResp);
	//fetch Category
	var catPath = encodeURI(baseURL + "/U_SS_CATEGORY(" + csBody.U_CategoryCode + ")");
	var catResp = createRequest(catPath, $.net.http.GET, body, sessionID, routeID);
	var catBody = getResponseJson(catResp);
	myBody.U_SS_CATEGORY = catBody;
	//fetch SPORTS
	var sptPath = encodeURI(baseURL + "/U_SS_SPORTS(" + csBody.U_SportsCode + ")");
	var sptResp = createRequest(sptPath, $.net.http.GET, body, sessionID, routeID);
	var sptBody = getResponseJson(sptResp);
	myBody.U_SS_SPORT = sptBody;
	//GET LOCATION
	var locPath = encodeURI(baseURL + "/U_SS_LOCATIONS(" + myBody.U_Location + ")");
	var locResp = createRequest(locPath, $.net.http.GET, body, sessionID, routeID);
	var locBody = getResponseJson(locResp);
	myBody.U_SS_LOCATION = locBody;
	//Get Coaches
	myBody.Coaches = [];
	var sPath = encodeURI(baseURL + "/U_SS_TEAMS_COACHES?$filter=U_TeamCode eq '" + myBody.Code + "'");
	var sResp = createRequest(sPath, $.net.http.GET, body, sessionID, routeID);
	var sBody = getResponseJson(sResp);
	if (sBody.value.length > 0) {
		var crt = "";
		for (var i = 0; i < sBody.value.length; i++) {
			crt += "EmployeeID eq " + sBody.value[i].U_CoachCode;
			if (i !== sBody.value.length - 1) {
				crt += " or ";
			}
		}
		var coachPath = encodeURI(baseURL + '/EmployeesInfo?$filter=' + crt);
		var tcResp = createRequest(coachPath, $.net.http.GET, body, sessionID, routeID);
		var tcBody = getResponseJson(tcResp);
		if (tcBody.value.length > 0) {
			for (var j = 0; j < tcBody.value.length; j++) {
				tcBody.value[j].rec_status = 'e';
				myBody.Coaches.push(tcBody.value[j]);
			}
			for (var m = 0; m < sBody.value.length; m++) {
				for (var n = 0; n < tcBody.value.length; n++) {
					var catSport = sBody.value[m].U_CoachCode.toString();
					var spCode = tcBody.value[n].EmployeeID.toString();
					if (catSport === spCode) {
						tcBody.value[n].tcCode = sBody.value[m].Code;
					}
				}
			}
		}
	}
	getResponseWithBody(resp, myBody);
}

function updateTeamByID(path, method, body, sessionID, routeID) {
	var comStrBody = body;
	var comObj = JSON.parse(comStrBody);
	delete comObj.Coaches;
	delete comObj.catID;
	delete comObj.sptID;

	delete comObj.U_SS_CATEGORY;
	delete comObj.U_SS_SPORT;
	delete comObj.U_SS_LOCATION;

	/*var upCat = {};
    upCat.Code = comObj.Code;
    upCat.Name = comObj.Name;
    upCat.U_CatDescpriction = comObj.U_CatDescpriction;
    upCat.U_Status = comObj.U_Status;*/
	var upStr = JSON.stringify(comObj);
	var resp = createRequest(path, method, upStr, sessionID, routeID);
	getResponseJson(resp);
	var teamMD = JSON.parse(body);
	if (teamMD.Coaches.length > 0) {
		var sPath = encodeURI(baseURL + "/U_SS_TEAMS_COACHES");
		for (var i = 0; i < teamMD.Coaches.length; i++) {
			var recAction = teamMD.Coaches[i].rec_status.toString();
			switch (recAction) {
				case "n":
					var tmpTMCoach = {
						Code: 0,
						Name: "",
						U_TeamCode: "",
						U_CoachCode: ""
					};
					tmpTMCoach.Name = teamMD.Name + '-' + teamMD.Coaches[i].Name;
					tmpTMCoach.U_TeamCode = teamMD.Code.toString();
					tmpTMCoach.U_CoachCode = teamMD.Coaches[i].EmployeeID.toString();
					var gPath = sPath + "?$top=1&$orderby=Code%20desc";
					var newCode = getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
					tmpTMCoach.Code = newCode + 1;
					var csResp = createRequest(sPath, $.net.http.POST, JSON.stringify(tmpTMCoach), sessionID, routeID);
					getResponseJson(csResp);
					break;
				case "de":
				case "dn":
					var dPath = baseURL + "/U_SS_TEAMS_COACHES(" + teamMD.Coaches[i].tcCode + ")";
					var delResp = createRequest(dPath, $.net.http.DEL, body, sessionID, routeID);
					getResponseJson(delResp);
					break;
				default:
					break;
			}
		}
	}
}

function createTeamCalendar(path, method, body, sessionID, routeID) {

	try {
		var getTeamCalender;
		var gPath = path;

		gPath += "?$top=1&$orderby=Code%20desc";
		var tmpBody = JSON.parse(body);
		if (tmpBody.value.length > 0) {
			for (var i = 0; i < tmpBody.value.length; i++) {
				var getCode;
				if (i === 0) {
					getCode = cmnLib.getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
					tmpBody.value[i].Code = getCode;
				} else {
					tmpBody.value[i].Code = getCode;
				}
			}

			if (tmpBody.value.length > 0) {
				getTeamCalender = tmpBody.value[0].Name;
				var batchCnt = "--batch_myBatch001" + "\r\n" +
					"Content-Type: application/http" + "\r\n" +
					"Content-Transfer-Encoding: binary" + "\r\n\r\n";
				for (var j = 0; j < tmpBody.value.length; j++) {
					var m = j + 1;
					batchCnt += "--changeset_myChangeset001" + "\r\n" +
						"Content-Type: application/http\r\nContent-Transfer-Encoding: binary\r\nContent-ID:" + m + "\r\n\r\n" +
						"POST /U_SS_TEAM_CALENDAR HTTP/1.1" + "\r\n" +
						"Accept: application/json" + "\r\n\r\n";
					batchCnt += JSON.stringify(tmpBody.value[j]) + "\r\n\r\n";
				}
				batchCnt += "--changeset_myChangeset001--" + "\r\n" + "--batch_myBatch001--";

				cmnLib.sendTeamRequest("", $.net.http.POST, batchCnt, sessionID, routeID);

				var chPath = encodeURI(baseURL + "/U_SS_TEAM_CALENDAR?$filter=Name eq '" + getTeamCalender + "'");
				var response = cmnLib.createRequest(chPath, $.net.http.GET, body, sessionID, routeID);
				var tcBody = cmnLib.getResponseJson(response);
				if (tcBody.value.length > 0) {
					var setBody = {
						"Name": getTeamCalender
					};
					tCalSchLib.createTCalSchedule(path, $.net.http.POST, JSON.stringify(setBody), sessionID, routeID);
				}
			}

			/*		var getCreateBodys = getCreateBody.toString();
			var dateSTR = getCreateBodys.replace(/,--changeset_myChangeset001/g, "--changeset_myChangeset001");
			cmnLib.sendBatchRequest("", $.net.http.POST, dateSTR, sessionID, routeID);*/
		}

	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}

}