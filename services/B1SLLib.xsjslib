var baseURL = "/b1s/v1";
var libPath = "/ITSFZE/Development/stryxsports/services/";
var cmnLib = $.import(libPath + "CommonLib.xsjslib");

function getNewCode(path, method, body, sessionID, routeID) {
	try {
		var resp = cmnLib.createRequest(path, method, body, sessionID, routeID);
		var myBody = cmnLib.getResponseJson(resp);
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
		var resp = cmnLib.createRequest(path, $.net.http.POST, JSON.stringify(tmpBody), sessionID, routeID);
		var mybody = cmnLib.getResponseJson(resp);
		if (mybody.error !== undefined) {
			if (mybody.error.code === -2028) {
				var getResp = cmnLib.createRequest(gPath, $.net.http.GET, body, sessionID, routeID);
				cmnLib.getResponse(getResp);
			} else {
				cmnLib.getResponseWithBody(resp, mybody);
			}
		}
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

function authenticate(path, method, body, sessionID, routeID) {

	var b1Body = JSON.stringify({
		"CompanyDB": "A20041_STRYXGULF_T01",
		"Password": "Itfz_2020",
		"UserName": "CLOUDIAX\\c20041.1"
	});
	var response = cmnLib.createRequest(path, method, b1Body, sessionID, routeID);
	var ret = getAuthResponse(response);
	for (var c in ret.cookies) {
		if (ret.cookies[c].name === "ROUTEID") {
			routeID = ret.cookies[c].value;
		}
		if (ret.cookies[c].name === "B1SESSION") {
			sessionID = ret.cookies[c].value;
		}
	}
	var ssLogin = JSON.parse(body);
	var lPath = encodeURI(baseURL + "/SS_LOGIN?$filter=U_UserName eq '" + ssLogin.username + "'");
	var lResp = cmnLib.createRequest(lPath, $.net.http.GET, JSON.stringify(ssLogin), sessionID, routeID);
	var lRet = cmnLib.getResponseJson(lResp);
	var empInfo = null;
	if (lRet.value.length > 0) {
		var lObj = lRet.value[0];
		if (lObj.U_Password === ssLogin.pwd) {
			lPath = encodeURI(baseURL + "/EmployeesInfo(" + lObj.Name + ")?$select=EmployeeID,FirstName,LastName,eMail,Gender,MobilePhone");
			lResp = cmnLib.createRequest(lPath, $.net.http.GET, JSON.stringify(ssLogin), sessionID, routeID);
			var eRet = cmnLib.getResponseJson(lResp);
			if (eRet.eMail === ssLogin.username && eRet.EmployeeID.toString() === lObj.Name) {
				empInfo = eRet;
				empInfo.status = 0;
				empInfo.routeID = routeID;
				empInfo.sessionID = sessionID;
				empInfo.Message = "Success";
			} else {
				empInfo = new Object();
				empInfo.status = -1;
				empInfo.Message = "Invalid User";
			}
		} else {
			empInfo = new Object();
			empInfo.status = -2;
			empInfo.Message = "Invalid Password";
		}
	} else {
		empInfo = new Object();
		empInfo.status = -3;
		empInfo.Message = "Invalid Username or Password";
	}
	cmnLib.getResponseWithBody(response, empInfo);
}

function createSportCategory(path, method, body, sessionID, routeID) {
	var scBody = body;
	var scBodyJson = JSON.parse(scBody);
	delete scBodyJson.sports;
	var scPath = path + "?$top=1&$orderby=Code%20desc";
	var newSCCode = getNewCode(scPath, $.net.http.GET, body, sessionID, routeID);
	scBodyJson.Code = newSCCode + 1;
	var scResp = cmnLib.createRequest(path, $.net.http.POST, JSON.stringify(scBodyJson), sessionID, routeID);
	var scRet = cmnLib.getResponseJson(scResp);
	if (scRet.error !== undefined) {
		if (scRet.error.code === -2028) {
			var getResp = cmnLib.createRequest(scPath, $.net.http.GET, body, sessionID, routeID);
			var tmp = cmnLib.getResponseJson(getResp);
			scRet.Code = tmp.value[0].Code;
		}
	}
	//check responose
	var catSportMD = JSON.parse(scBody);
	catSportMD.Code = scRet.Code;
	for (var i = 0; i < catSportMD.sports.length; i++) {
		var tmpCatSport = {
			Code: 0,
			Name: "",
			U_CategoryCode: "",
			U_SportsCode: ""
		};
		tmpCatSport.Name = catSportMD.Name + '-' + catSportMD.sports[i].Name;
		tmpCatSport.U_CategoryCode = catSportMD.Code.toString();
		tmpCatSport.U_SportsCode = catSportMD.sports[i].Code.toString();
		var sPath = encodeURI(baseURL + "/U_SS_CAT_SPORTS");
		var gPath = sPath + "?$top=1&$orderby=Code%20desc";
		var newCode = getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
		tmpCatSport.Code = newCode + 1;
		var csResp = cmnLib.createRequest(sPath, $.net.http.POST, JSON.stringify(tmpCatSport), sessionID, routeID);
		var catStBody = cmnLib.getResponseJson(csResp);
		if (catStBody.error !== undefined) {
			if (catStBody.error.code === -2028) {
				var getcsResp = cmnLib.createRequest(scPath, $.net.http.GET, body, sessionID, routeID);
				catStBody = cmnLib.getResponseJson(getcsResp);
			}
		}
	}
	cmnLib.getResponseWithBody(scResp, scRet);
}

function getCategoryByID(path, method, body, sessionID, routeID) {
	var resp = cmnLib.createRequest(path, method, body, sessionID, routeID);
	var myBody = cmnLib.getResponseJson(resp);
	myBody.sports = [];
	var sPath = encodeURI(baseURL + "/U_SS_CAT_SPORTS?$filter=U_CategoryCode eq '" + myBody.Code + "'");
	var sResp = cmnLib.createRequest(sPath, $.net.http.GET, body, sessionID, routeID);
	var sBody = cmnLib.getResponseJson(sResp);
	if (sBody.value.length > 0) {
		var crt = "";
		for (var i = 0; i < sBody.value.length; i++) {
			crt += "Code eq " + sBody.value[i].U_SportsCode;
			if (i !== sBody.value.length - 1) {
				crt += " or ";
			}
		}
		var sportPath = encodeURI(baseURL + '/U_SS_SPORTS?$filter=' + crt);
		var ssResp = cmnLib.createRequest(sportPath, $.net.http.GET, body, sessionID, routeID);
		var ssBody = cmnLib.getResponseJson(ssResp);
		if (ssBody.value.length > 0) {
			for (var j = 0; j < ssBody.value.length; j++) {
				ssBody.value[j].rec_status = 'e';
				myBody.sports.push(ssBody.value[j]);
			}
			for (var i = 0; i < sBody.value.length; i++) {
				for (var j = 0; j < ssBody.value.length; j++) {
					var catSport = sBody.value[i].U_SportsCode.toString();
					var spCode = ssBody.value[j].Code.toString();
					if (catSport === spCode) {
						ssBody.value[j].catCode = sBody.value[i].Code;
					}
				}
			}
		}
	}
	cmnLib.getResponseWithBody(resp, myBody);
}

function updateCategoryByID(path, method, body, sessionID, routeID) {
	var comStrBody = body;
	var comObj = JSON.parse(comStrBody);
	delete comObj.sports;
	/*var upCat = {};
    upCat.Code = comObj.Code;
    upCat.Name = comObj.Name;
    upCat.U_CatDescpriction = comObj.U_CatDescpriction;
    upCat.U_Status = comObj.U_Status;*/
	var upStr = JSON.stringify(comObj);
	var resp = cmnLib.createRequest(path, method, upStr, sessionID, routeID);
	cmnLib.getResponseJson(resp);
	var catSportMD = JSON.parse(body);
	if (catSportMD.sports.length > 0) {
		var sPath = encodeURI(baseURL + "/U_SS_CAT_SPORTS");
		for (var i = 0; i < catSportMD.sports.length; i++) {
			var recAction = catSportMD.sports[i].rec_status.toString();
			switch (recAction) {
				case "n":
					var tmpCatSport = {
						Code: 0,
						Name: "",
						U_CategoryCode: "",
						U_SportsCode: ""
					};
					tmpCatSport.Name = catSportMD.Name + '-' + catSportMD.sports[i].Name;
					tmpCatSport.U_CategoryCode = catSportMD.Code.toString();
					tmpCatSport.U_SportsCode = catSportMD.sports[i].Code.toString();
					var gPath = sPath + "?$top=1&$orderby=Code%20desc";
					var newCode = getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
					tmpCatSport.Code = newCode + 1;
					var csResp = cmnLib.createRequest(sPath, $.net.http.POST, JSON.stringify(tmpCatSport), sessionID, routeID);
					cmnLib.getResponseJson(csResp);
					break;
				case "de":
				case "dn":
					var dPath = baseURL + "/U_SS_CAT_SPORTS(" + catSportMD.sports[i].catCode + ")";
					var delResp = cmnLib.createRequest(dPath, $.net.http.DEL, body, sessionID, routeID);
					cmnLib.getResponseJson(delResp);
					break;
				default:
					break;
			}
		}
	}
}