var baseURL = "/b1s/v1";
var generalResp;

function memberModel() {
	var memMD = {};
	memMD.CardCode = "";
	memMD.CardName = "";
	memMD.CardType = "cCustomer";
	memMD.GroupCode = "";
	memMD.U_Dob = "";
	memMD.U_School = "";
	memMD.U_Nationality = "";
	memMD.U_Gender = "";
	memMD.U_Ref = "";
	memMD.EmailAddress = "";
	memMD.Phone1 = "";
	memMD.Phone2 = "";
	memMD.Cellular = "";
	memMD.FatherCard = "";
	memMD.Notes = "";
	memMD.U_Father = "";
	memMD.U_Mother = "";
	memMD.U_Gardian = "";
	memMD.U_SS_MEMBER_TYPE = "";
	memMD.Address = "";
	memMD.FreeText = "";

	return memMD;
}

function childModel() {
	var child = memberModel();
	child.Father = memberModel();
	child.Mother = memberModel();
	child.Guardian = memberModel();
	child.ContactEmployees = [];
	var temp = new Object();
	temp.CardCode = "";
	temp.Name = "";
	temp.MobilePhone = "";
	temp.InternalCode = 0;
	temp.FirstName = "";
	temp.Remarks1 = "ChildPickup1";
	temp.Remarks2 = "";
	var temp1 = new Object();
	temp1.CardCode = "";
	temp1.Name = "";
	temp1.MobilePhone = "";
	temp1.InternalCode = 0;
	temp1.FirstName = "";
	temp1.Remarks1 = "ChildPickup2";
	temp1.Remarks2 = "";
	var temp2 = new Object();
	temp2.CardCode = "";
	temp2.Name = "";
	temp2.MobilePhone = "";
	temp2.InternalCode = 0;
	temp2.FirstName = "";
	temp2.Remarks1 = "Emergency";
	temp2.Remarks2 = "";
	child.ContactEmployees.push(temp, temp1, temp2);
	return child;
}

function mapJSON(source, dest) {
	var sKeys = Object.keys(source);
	var dKeys = Object.keys(dest);
	for (var dKey in dKeys) {
		for (var sKey in sKeys) {
			if (dKeys[dKey] === sKeys[sKey]) {
				dest[dKeys[dKey]] = source[sKeys[sKey]];
			}
		}
	}
	return dest;
}

function createRequest(path, method, body, sessionID, routeID) {
	try {
		var destination = $.net.http.readDestination("ITSFZE.Production.stryxsports.services.destination", "Connection");
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

function getleadNewCode(path, method, body, sessionID, routeID) {
	try {
		var resp = createRequest(path, method, body, sessionID, routeID);
		var myBody = getResponseJson(resp);
		var code = 0;
		if (myBody.value.length > 0) {
			code = myBody.value[0].CardCode;
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

function createChild(path, method, body, sessionID, routeID) {

	var tmpBody = JSON.parse(body);
	delete tmpBody.Father;
	delete tmpBody.FatherCard;
	delete tmpBody.Mother;
	delete tmpBody.Guardian;
	delete tmpBody.sports;
	delete tmpBody.locations;

	var gPath = path;
	gPath += "?$top=1&$orderby=CardCode%20desc";
	var newCode = getleadNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
	var getOldCardCode = newCode.replace(/[^\d.]/g, '');
	var setNewCardCode = parseInt(getOldCardCode) + 1;
	var getNewCardCode = "CH00" + setNewCardCode;
	tmpBody.CardCode = getNewCardCode;
	var resp = createRequest(path, $.net.http.POST, JSON.stringify(tmpBody), sessionID, routeID);
	var getResp = getResponseJson(resp);
	var leadSports = [];
	var leadLocations = [];
	if (getResp.CardCode !== "" && getResp.CardCode !== null && getResp.CardCode !== undefined) {
		var catSportMD = JSON.parse(body);
		if (catSportMD.sports.length > 0) {
			var sPath = encodeURI(baseURL + "/U_SS_LEAD_SPORTS");
			for (var i = 0; i < catSportMD.sports.length; i++) {
				var recAction = catSportMD.sports[i].rec_status.toString();
				switch (recAction) {
					case "n":
						var temp1 = new Object();
						temp1.Name = getResp.CardCode + '-' + catSportMD.sports[i].Code;
						temp1.U_LeadCode = getResp.CardCode;
						temp1.U_SportCode = catSportMD.sports[i].Code.toString();
						var upPath = sPath + "?$top=1&$orderby=Code%20desc";
						var getNewCodes = getNewCode(upPath, $.net.http.GET, body, sessionID, routeID);
						temp1.Code = getNewCodes + 1;
						var csResp = createRequest(sPath, $.net.http.POST, JSON.stringify(temp1), sessionID, routeID);
						getResponseJson(csResp);
						break;
					case "de":
					case "dn":
						var dPath = baseURL + "/U_SS_LEAD_SPORTS(" + catSportMD.sports[i].catCode + ")";
						var delResp = createRequest(dPath, $.net.http.DEL, body, sessionID, routeID);
						getResponseJson(delResp);
						break;
					default:
						break;
				}
			}
			var lsPath = encodeURI(baseURL +
				"/$crossjoin(U_SS_LEAD_SPORTS,U_SS_SPORTS)?$expand=U_SS_LEAD_SPORTS($select=Code),U_SS_SPORTS($select=Code, Name, U_SportsDescription,U_Status)&$filter=U_SS_LEAD_SPORTS/U_SportCode eq U_SS_SPORTS/Code and U_SS_LEAD_SPORTS/U_LeadCode eq  '" +
				getResp.CardCode + "'");
			var lsResp = createRequest(lsPath, $.net.http.GET, body, sessionID, routeID);
			var lsBody = getResponseJson(lsResp);

			if (lsBody.value.length > 0) {
				for (var i = 0; i < lsBody.value.length; i++) {
					lsBody.value[i].U_SS_SPORTS.rec_status = 'e';
					lsBody.value[i].U_SS_SPORTS.LSCode = lsBody.value[i].U_SS_LEAD_SPORTS.Code;
					leadSports.push(lsBody.value[i].U_SS_SPORTS);
				}
			}
			//getResponseWithBody(resp, getResp);
		}

		if (catSportMD.locations.length > 0) {
			var llPath = encodeURI(baseURL + "/U_SS_LEAD_LOCATIONS");
			for (var li = 0; li < catSportMD.locations.length; li++) {
				var llRecAction = catSportMD.locations[li].rec_status;
				switch (llRecAction) {
					case "n":
						var tempLocation = new Object();
						tempLocation.Name = getResp.CardCode + '-' + catSportMD.locations[li].Code;
						tempLocation.U_CardCode = getResp.CardCode;
						tempLocation.U_LocationCode = catSportMD.locations[li].Code.toString();
						var llUpPath = llPath + "?$top=1&$orderby=Code%20desc";
						var getNewLLCodes = getNewCode(llUpPath, $.net.http.GET, body, sessionID, routeID);
						tempLocation.Code = parseInt(getNewLLCodes) + 1;
						var llRespL = createRequest(llPath, $.net.http.POST, JSON.stringify(tempLocation), sessionID, routeID);
						getResponseJson(llRespL);
						break;
					case "de":
					case "dn":
						var llDPath = baseURL + "/U_SS_LEAD_LOCATIONS(" + catSportMD.locations[li].Code + ")";
						var llDelResp = createRequest(llDPath, $.net.http.DEL, body, sessionID, routeID);
						getResponseJson(llDelResp);
						break;
					default:
						break;
				}
			}
			var llUpDatePath = encodeURI(baseURL +
				"/$crossjoin(U_SS_LEAD_LOCATIONS,U_SS_LOCATIONS)?$expand=U_SS_LEAD_LOCATIONS($select=Code),U_SS_LOCATIONS($select=Code, Name, U_Description,U_Status)&$filter=U_SS_LEAD_LOCATIONS/U_LocationCode eq U_SS_LOCATIONS/Code and U_SS_LEAD_LOCATIONS/U_CardCode eq  '" +
				getResp.CardCode + "'");
			var llUpdateResp = createRequest(llUpDatePath, $.net.http.GET, body, sessionID, routeID);
			var llUpdateBody = getResponseJson(llUpdateResp);

			if (llUpdateBody.value.length > 0) {
				for (var j = 0; j < llUpdateBody.value.length; j++) {
					llUpdateBody.value[j].U_SS_LOCATIONS.rec_status = 'e';
					llUpdateBody.value[j].U_SS_LOCATIONS.LSCode = llUpdateBody.value[j].U_SS_LEAD_LOCATIONS.Code;
					leadLocations.push(llUpdateBody.value[j].U_SS_LOCATIONS);
				}
			}
			//getResponseWithBody(resp, getResp);
		}

	}
	var retBody = JSON.parse(body);
	retBody.CardCode = getResp.CardCode;
	retBody.GroupCode = getResp.GroupCode;
	retBody.sports = leadSports;
	retBody.locations = leadLocations;
	getResponseWithBody(resp, retBody);

}

function AddFather(path, method, body, sessionID, routeID) {
	try {
		//var memType = "Child";
		var grpPath = "/b1s/v1/BusinessPartnerGroups";
		var grpresp = createRequest(grpPath, $.net.http.GET, body, sessionID, routeID);
		var grpBody = getResponseJson(grpresp);
		var memResp;
		var grpCode;
		for (var i = 0; i < grpBody.value.length; i++) {
			if (grpBody.value[i].Name === "Parents") {
				grpCode = grpBody.value[i].Code;
				break;
			}
		}
		var tmpBody = JSON.parse(body);
		var father = tmpBody.Father;
		delete father.sports;
		delete father.locations;
		father.CardType = "cCustomer";
		var gPath = path;
		gPath += "?$filter=GroupCode%20eq%20" + grpCode + "%20and%20CardType%20eq%20'" + father.CardType + "'&$top=1&$orderby=CardCode%20desc";
		var newCode = getleadNewCode(gPath, $.net.http.GET, body, sessionID, routeID);

		var getOldCardCode = newCode.replace(/[^\d.]/g, '');
		var setNewCardCode = parseInt(getOldCardCode) + 1;

		father.CardCode = "CH00" + setNewCardCode;

		father.GroupCode = grpCode;
		//father.Series = 69;
		var finalResp = createRequest(path, $.net.http.POST, JSON.stringify(father), sessionID, routeID);
		var fRet = getResponseJson(finalResp);
		father.CardCode = fRet.CardCode;
		tmpBody.U_Father = fRet.CardCode;
		tmpBody.Phone1 = fRet.Cellular;
		tmpBody.Father = father;
		tmpBody.FatherCard = fRet.CardCode;

		var upBodyStr = JSON.stringify(tmpBody);
		var upBody = JSON.parse(upBodyStr);
		delete upBody.Father;
		delete upBody.Mother;
		delete upBody.Guardian;
		delete upBody.ContactEmployees;
		delete upBody.sports;
		delete upBody.locations;
		delete upBody.FatherCard;
		memResp = createRequest(path + "('" + upBody.CardCode + "')", $.net.http.PATCH, JSON.stringify(upBody), sessionID, routeID);
		getResponseJson(memResp);

		getResponseWithBody(finalResp, tmpBody);
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function AddMother(path, method, body, sessionID, routeID) {
	try {
		var grpPath = "/b1s/v1/BusinessPartnerGroups";
		var grpresp = createRequest(grpPath, $.net.http.GET, body, sessionID, routeID);
		var grpBody = getResponseJson(grpresp);
		var memResp;
		var grpCode;
		for (var i = 0; i < grpBody.value.length; i++) {
			if (grpBody.value[i].Name === "Parents") {
				grpCode = grpBody.value[i].Code;
				break;
			}
		}
		var tmpBody = JSON.parse(body);
		var mother = tmpBody.Mother;
		delete mother.sports;
		delete mother.locations;
		delete mother.FatherCard;
		mother.CardType = "cCustomer";
		var gPath = path;
		gPath += "?$filter=GroupCode%20eq%20" + grpCode + "%20and%20CardType%20eq%20'" + mother.CardType + "'&$top=1&$orderby=CardCode%20desc";
		var newCode = getleadNewCode(gPath, $.net.http.GET, body, sessionID, routeID);

		var getOldCardCode = newCode.replace(/[^\d.]/g, '');
		var setNewCardCode = parseInt(getOldCardCode) + 1;

		mother.CardCode = "CH00" + setNewCardCode;
		mother.GroupCode = grpCode;
		//mother.Series = 69;
		var finalResp = createRequest(path, $.net.http.POST, JSON.stringify(mother), sessionID, routeID);
		var fRet = getResponseJson(finalResp);
		mother.CardCode = fRet.CardCode;
		tmpBody.U_Mother = fRet.CardCode;
		tmpBody.Phone2 = fRet.Cellular;
		tmpBody.Mother = mother;
		// 		if (tmpBody.U_Father === "") {
		// 			tmpBody.FatherCard = fRet.CardCode;
		// 		}

		var upBodyStr = JSON.stringify(tmpBody);
		var upBody = JSON.parse(upBodyStr);
		delete upBody.Father;
		delete upBody.Mother;
		delete upBody.Guardian;
		delete upBody.ContactEmployees;
		delete upBody.sports;
		delete upBody.locations;
		delete upBody.FatherCard;
		var getMotherResp = createRequest(path + "('" + upBody.CardCode + "')", $.net.http.PATCH, JSON.stringify(upBody), sessionID, routeID);
		getResponseJson(getMotherResp);
		getResponseWithBody(finalResp, tmpBody);
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function AddGuardian(path, method, body, sessionID, routeID) {
	try {
		var grpPath = "/b1s/v1/BusinessPartnerGroups";
		var grpresp = createRequest(grpPath, $.net.http.GET, body, sessionID, routeID);
		var grpBody = getResponseJson(grpresp);
		var grpCode;
		for (var i = 0; i < grpBody.value.length; i++) {
			if (grpBody.value[i].Name === "Parents") {
				grpCode = grpBody.value[i].Code;
				break;
			}
		}
		var tmpBody = JSON.parse(body);
		var guardian = tmpBody.Guardian;
		delete guardian.sports;
		delete guardian.locations;
		delete guardian.FatherCard;
		// 		var getMother = tmpBody.U_Mother;
		guardian.CardType = "cCustomer";

		var gPath = path;
		gPath += "?$filter=GroupCode%20eq%20" + grpCode + "%20and%20CardType%20eq%20'" + guardian.CardType + "'&$top=1&$orderby=CardCode%20desc";
		var newCode = getleadNewCode(gPath, $.net.http.GET, body, sessionID, routeID);

		var getOldCardCode = newCode.replace(/[^\d.]/g, '');
		var setNewCardCode = parseInt(getOldCardCode) + 1;

		guardian.CardCode = "CH00" + setNewCardCode;
		guardian.GroupCode = grpCode;
		//guardian.Series = 69;
		var finalResp = createRequest(path, $.net.http.POST, JSON.stringify(guardian), sessionID, routeID);
		var fRet = getResponseJson(finalResp);
		guardian.CardCode = fRet.CardCode;
		tmpBody.U_Gardian = fRet.CardCode;
		tmpBody.Phone2 = fRet.Cellular;
		tmpBody.Guardian = guardian;
		var upBodyStr = JSON.stringify(tmpBody);
		var upBody = JSON.parse(upBodyStr);
		delete upBody.Father;
		delete upBody.Mother;
		delete upBody.Guardian;
		delete upBody.ContactEmployees;
		delete upBody.sports;
		delete upBody.locations;
		delete upBody.FatherCard;
		var memResp = createRequest(path + "('" + upBody.CardCode + "')", $.net.http.PATCH, JSON.stringify(upBody), sessionID, routeID);
		getResponseJson(memResp);
		getResponseWithBody(finalResp, tmpBody);
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function getLeadByID(path, method, body, sessionID, routeID) {
	var memMD = childModel();
	var resp = createRequest(path, method, body, sessionID, routeID);
	var myBody = getResponseJson(resp);
	if (myBody.ContactEmployees.length > 0) {
		for (var i = 0; i < memMD.ContactEmployees.length; i++) {
			for (var j = 0; j < myBody.ContactEmployees.length; j++) {
				var mCE = memMD.ContactEmployees[i].Remarks1;
				var bCE = myBody.ContactEmployees[j].Remarks1;
				if (mCE === bCE) {
					memMD.ContactEmployees[i] = mapJSON(myBody.ContactEmployees[j], memMD.ContactEmployees[i]);
				}
			}
		}
	}
	delete myBody.ContactEmployees;
	memMD = mapJSON(myBody, memMD);
	var pPath = "/b1s/v1/BusinessPartners";
	if (memMD.CardCode !== "") {
		if (memMD.U_Father !== "") {
			var fPath = pPath + "('" + memMD.U_Father + "')";
			var fResp = createRequest(fPath, $.net.http.GET, body, sessionID, routeID);
			var fBody = getResponseJson(fResp);
			memMD.Father = mapJSON(fBody, memMD.Father);
		}
		if (memMD.U_Mother !== "") {
			var mPath = pPath + "('" + memMD.U_Mother + "')";
			var mResp = createRequest(mPath, $.net.http.GET, body, sessionID, routeID);
			var mBody = getResponseJson(mResp);
			memMD.Mother = mapJSON(mBody, memMD.Mother);
		}
		if (memMD.U_Gardian !== "") {
			var gPath = pPath + "('" + memMD.U_Gardian + "')";
			var gResp = createRequest(gPath, $.net.http.GET, body, sessionID, routeID);
			var gBody = getResponseJson(gResp);
			memMD.Guardian = mapJSON(gBody, memMD.Guardian);
		}
	}
	getResponseWithBody(resp, memMD);
}

function updateChild(path, method, body, sessionID, routeID, memType) {
	try {
		//var memType = "Child";
		var genPath = "/b1s/v1/BusinessPartners";
		var tmpBody = JSON.parse(body);
		var updateBody = "";
		var retBody = {
			"body": ""
		};
		var memResp = null;
		retBody.body = JSON.parse(body);
		switch (memType) {
			case 'Child':
				delete tmpBody.Father;
				delete tmpBody.Mother;
				delete tmpBody.Guardian;
				delete tmpBody.ContactEmployees;
				delete tmpBody.sports;
				delete tmpBody.locations;
				updateBody = tmpBody;
				var leadSports = [];
				var leadLocations = [];
				memResp = createRequest(genPath + "('" + updateBody.CardCode + "')", $.net.http.PATCH, JSON.stringify(updateBody), sessionID, routeID);
				getResponseJson(memResp);
				var leadSportMD = JSON.parse(body);

				if (tmpBody.CardCode !== "" && tmpBody.CardCode !== null && tmpBody.CardCode !== undefined) {

					if (leadSportMD.sports.length > 0) {
						var sPath = encodeURI(baseURL + "/U_SS_LEAD_SPORTS");
						for (var i = 0; i < leadSportMD.sports.length; i++) {
							var recAction = leadSportMD.sports[i].rec_status.toString();
							switch (recAction) {
								case "n":
									var temp1 = new Object();
									temp1.Name = leadSportMD.CardCode + '-' + leadSportMD.sports[i].Code;
									temp1.U_LeadCode = leadSportMD.CardCode;
									temp1.U_SportCode = leadSportMD.sports[i].Code.toString();
									var upPath = sPath + "?$top=1&$orderby=Code%20desc";
									var getNewCodes = getNewCode(upPath, $.net.http.GET, body, sessionID, routeID);
									temp1.Code = getNewCodes + 1;
									var csResp = createRequest(sPath, $.net.http.POST, JSON.stringify(temp1), sessionID, routeID);
									getResponseJson(csResp);
									break;
								case "de":
								case "dn":
									var dPath = baseURL + "/U_SS_LEAD_SPORTS(" + leadSportMD.sports[i].LSCode + ")";
									var delResp = createRequest(dPath, $.net.http.DEL, body, sessionID, routeID);
									getResponseJson(delResp);
									break;
								default:
									break;
							}
						}

						var lsPath = encodeURI(baseURL +
							"/$crossjoin(U_SS_LEAD_SPORTS,U_SS_SPORTS)?$expand=U_SS_LEAD_SPORTS($select=Code),U_SS_SPORTS($select=Code, Name, U_SportsDescription,U_Status)&$filter=U_SS_LEAD_SPORTS/U_SportCode eq U_SS_SPORTS/Code and U_SS_LEAD_SPORTS/U_LeadCode eq  '" +
							leadSportMD.CardCode + "'");
						var lsResp = createRequest(lsPath, $.net.http.GET, body, sessionID, routeID);
						var lsBody = getResponseJson(lsResp);

						if (lsBody.value.length > 0) {
							for (var i = 0; i < lsBody.value.length; i++) {
								lsBody.value[i].U_SS_SPORTS.rec_status = 'e';
								lsBody.value[i].U_SS_SPORTS.LSCode = lsBody.value[i].U_SS_LEAD_SPORTS.Code;
								leadSports.push(lsBody.value[i].U_SS_SPORTS);
							}
						}
						//	getResponseWithBody(memResp, getResp);
					}

					if (leadSportMD.locations.length > 0) {
						var llPath = encodeURI(baseURL + "/U_SS_LEAD_LOCATIONS");
						for (var li = 0; li < leadSportMD.locations.length; li++) {
							var llRecAction = leadSportMD.locations[li].rec_status;
							switch (llRecAction) {
								case "n":
									var tempLocation = new Object();
									tempLocation.Name = tmpBody.CardCode + '-' + leadSportMD.locations[li].Code;
									tempLocation.U_CardCode = tmpBody.CardCode;
									tempLocation.U_LocationCode = leadSportMD.locations[li].Code.toString();
									var llUpPath = llPath + "?$top=1&$orderby=Code%20desc";
									var getNewLLCodes = getNewCode(llUpPath, $.net.http.GET, body, sessionID, routeID);
									tempLocation.Code = parseInt(getNewLLCodes) + 1;
									var llRespL = createRequest(llPath, $.net.http.POST, JSON.stringify(tempLocation), sessionID, routeID);
									getResponseJson(llRespL);
									break;
								case "de":
								case "dn":
									var llDPath = baseURL + "/U_SS_LEAD_LOCATIONS(" + leadSportMD.locations[li].LSCode + ")";
									var llDelResp = createRequest(llDPath, $.net.http.DEL, body, sessionID, routeID);
									getResponseJson(llDelResp);
									break;
								default:
									break;
							}
						}
						var llUpDatePath = encodeURI(baseURL +
							"/$crossjoin(U_SS_LEAD_LOCATIONS,U_SS_LOCATIONS)?$expand=U_SS_LEAD_LOCATIONS($select=Code),U_SS_LOCATIONS($select=Code, Name, U_Description,U_Status)&$filter=U_SS_LEAD_LOCATIONS/U_LocationCode eq U_SS_LOCATIONS/Code and U_SS_LEAD_LOCATIONS/U_CardCode eq  '" +
							tmpBody.CardCode + "' & $select=Code");
						var llUpdateResp = createRequest(llUpDatePath, $.net.http.GET, body, sessionID, routeID);
						var llUpdateBody = getResponseJson(llUpdateResp);

						if (llUpdateBody.value.length > 0) {
							for (var j = 0; j < llUpdateBody.value.length; j++) {
								llUpdateBody.value[j].U_SS_LOCATIONS.rec_status = 'e';
								llUpdateBody.value[j].U_SS_LOCATIONS.LSCode = llUpdateBody.value[j].U_SS_LEAD_LOCATIONS.Code;
								leadLocations.push(llUpdateBody.value[j].U_SS_LOCATIONS);
							}
						}
						//getResponseWithBody(resp, getResp);
					}

				}
				retBody.body.sports = leadSports;
				retBody.body.locations = leadLocations;
				break;
			case 'Father':
				updateBody = tmpBody.Father;
				memResp = createRequest(path, $.net.http.PATCH, JSON.stringify(updateBody), sessionID, routeID);
				var fRet = getResponseJson(memResp);
				tmpBody.U_Father = updateBody.CardCode;
				tmpBody.Phone1 = updateBody.Cellular;
				tmpBody.FatherCard = updateBody.CardCode;
				retBody.body.U_Father = updateBody.CardCode;
				retBody.body.Phone1 = updateBody.Cellular;
				retBody.FatherCard = updateBody.CardCode;
				var upBodyStr = JSON.stringify(tmpBody);
				var upBody = JSON.parse(upBodyStr);
				delete upBody.Father;
				delete upBody.Mother;
				delete upBody.Guardian;
				delete upBody.ContactEmployees;
				delete upBody.sports;
				delete upBody.locations;
				delete upBody.FatherCard;
				memResp = createRequest(genPath + "('" + upBody.CardCode + "')", $.net.http.PATCH, JSON.stringify(upBody), sessionID, routeID);
				getResponseJson(memResp);
				break;
			case 'Mother':
				updateBody = tmpBody.Mother;
				memResp = createRequest(path, $.net.http.PATCH, JSON.stringify(updateBody), sessionID, routeID);
				getResponseJson(memResp);
				tmpBody.U_Mother = updateBody.CardCode;
				tmpBody.Phone2 = updateBody.Cellular;
				retBody.body.U_Mother = updateBody.CardCode;
				retBody.body.Phone2 = updateBody.Cellular;
				if (tmpBody.U_Father === "") {
					tmpBody.FatherCard = updateBody.CardCode;
					retBody.FatherCard = updateBody.CardCode;
				}
				var upBodyStr = JSON.stringify(tmpBody);
				var upBody = JSON.parse(upBodyStr);
				delete upBody.Father;
				delete upBody.Mother;
				delete upBody.Guardian;
				delete upBody.ContactEmployees;
				delete upBody.sports;
				delete upBody.locations;
				delete upBody.FatherCard;
				memResp = createRequest(genPath + "('" + upBody.CardCode + "')", $.net.http.PATCH, JSON.stringify(upBody), sessionID, routeID);
				getResponseJson(memResp);
				break;
			case 'Guardian':
				updateBody = tmpBody.Guardian;
				memResp = createRequest(path, $.net.http.PATCH, JSON.stringify(updateBody), sessionID, routeID);
				getResponseJson(memResp);
				tmpBody.U_Gardian = updateBody.CardCode;
				tmpBody.Cellular = updateBody.Cellular;
				retBody.body.U_Gardian = updateBody.CardCode;
				retBody.body.Cellular = updateBody.Cellular;
				if (tmpBody.U_Father === "") {
					tmpBody.FatherCard = updateBody.CardCode;
					retBody.FatherCard = updateBody.CardCode;
				}
				var upBodyStr = JSON.stringify(tmpBody);
				var upBody = JSON.parse(upBodyStr);
				delete upBody.Father;
				delete upBody.Mother;
				delete upBody.Guardian;
				delete upBody.ContactEmployees;
				delete upBody.sports;
				delete upBody.locations;
				delete upBody.FatherCard;
				memResp = createRequest(genPath + "('" + upBody.CardCode + "')", $.net.http.PATCH, JSON.stringify(upBody), sessionID, routeID);
				getResponseJson(memResp);
				break;
			default:
				break;
		}

		$.response.status = $.net.http.OK;
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify(retBody));
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}