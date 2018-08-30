var greetingPrefix = "Hello, ";
var greetingSuffix = "!";
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

function mapJSONContact(source, dest) {
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
		var destination = $.net.http.readDestination("stryx_staging.services.destination", "Connection");
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
			myHeader = [];

		//Cookies  
		for (var c in response.cookies) {
			myCookies.push(response.cookies[c]);
		}
		//Headers  
		for (var h in response.headers) {
			myHeader.push(response.headers[h]);
		}
		//response.setBody("body:");
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

function pad(num, size) {
	var s = num + "";
	while (s.length < size) {
		s = "0" + s;
	}
	return s;
}

function getNewCode(path, method, body, sessionID, routeID) {
	try {
		var resp = createRequest(path, method, body, sessionID, routeID);
		var myBody = getResponseJson(resp);
		var code = "CH000001";
		if (myBody.value.length > 0) {
			code = myBody.value[0].CardCode;
			var codeVal = parseInt(code.slice(code.length - 6, code.length), 10) + 1;
			codeVal = pad(codeVal, 6);
			var codePre = code.slice(0, code.length - 6);
			code = codePre + codeVal;
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

function getSSNewCode(path, method, body, sessionID, routeID) {
	try {
		var resp = createRequest(path, method, body, sessionID, routeID);
		var myBody = getResponseJson(resp);
		var code = 0;
		if (myBody.value.length > 0) {
			code = myBody.value[0].Code;
		} else {
			code = code;
		}
		code = code + 1;
		return code;
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function createOrder(path, method, body, sessionID, routeID, memType) {

	var tmpBody = JSON.parse(body);
	var setComments = "";
	var memService = new Object();
	tmpBody.DocumentLines.forEach(function(val1, index) {
		if (tmpBody.DocumentLines.length - 1 !== index) {
			setComments = setComments + val1.Item.ItemName + " / ";
		} else {
			setComments = setComments + val1.Item.ItemName;
		}
		delete val1.Item;
	});
	tmpBody.Comments = setComments;
	var response = createRequest(path, method, JSON.stringify(tmpBody), sessionID, routeID);
	var oRet = getResponseJson(response);

	var msPath = "/b1s/v1/U_SS_MEM_SERVICES";
	var gPath = msPath + "?$top=1&$orderby=Code%20desc";
	var newCode = getSSNewCode(gPath, $.net.http.GET, body, sessionID, routeID);

	memService.Code = newCode;
	memService.Name = oRet.DocEntry.toString() + "-" + oRet.CardCode;
	memService.U_SalesOrderID = oRet.DocEntry;
	memService.U_Status = "1";
	memService.U_CardCode = oRet.CardCode;
	var resp = createRequest(msPath, $.net.http.POST, JSON.stringify(memService), sessionID, routeID);
	var memRet = getResponseJson(resp);
	var upTmpBody = JSON.stringify(tmpBody);
	var tSItem = JSON.parse(upTmpBody);
	var stPath = "/b1s/v1/U_SS_SERVICE_ITEM";
	var tPath = stPath + "?$top=1&$orderby=Code%20desc";

	for (var j = 0; j < tSItem.DocumentLines.length; j++) {
		var tnCode = getSSNewCode(tPath, $.net.http.GET, body, sessionID, routeID);
		var serItems = new Object();
		serItems.Code = tnCode;
		serItems.Name = tSItem.DocumentLines[j].ItemCode.toString() + "-" + tSItem.DocumentLines[j].TeamID;
		serItems.U_ItemCode = tSItem.DocumentLines[j].ItemCode;
		serItems.U_TeamID = tSItem.DocumentLines[j].TeamID;
		serItems.U_StartDate = tSItem.DocumentLines[j].StartDate;
		serItems.U_MemOrderID = oRet.DocEntry;
		serItems.U_MemSerCode = memRet.Code.toString();
		var tresp = createRequest(stPath, $.net.http.POST, JSON.stringify(serItems), sessionID, routeID);
		var stRet = getResponseJson(tresp);
	}
	getResponseWithBody(resp, oRet);
}

function createInvoice(path, method, body, sessionID, routeID, memType) {

	var tmpBody = JSON.parse(body);
	delete tmpBody.U_SalesOrderID;
	delete tmpBody.Comments;
	delete tmpBody.JournalMemo;
	var response = createRequest(path, method, JSON.stringify(tmpBody), sessionID, routeID);
	var oRet = getResponseJson(response);
	var ssBody = JSON.parse(body);
	var msPath = "/b1s/v1/U_SS_MEM_SERVICES";
	var gPath = msPath + encodeURI("?$filter=U_SalesOrderID eq " + ssBody.U_SalesOrderID + " and U_CardCode eq '" + ssBody.CardCode + "'");
	var getSSMem = createRequest(gPath, $.net.http.GET, body, sessionID, routeID);
	var soRet = getResponseJson(getSSMem);
	var memService = new Object();
	memService.Code = soRet.value[0].Code;
	memService.Name = soRet.value[0].Name;
	memService.U_SalesOrderID = soRet.value[0].U_SalesOrderID;
	memService.U_CardCode = soRet.value[0].U_CardCode;
	memService.U_Status = "2";
	memService.U_InvoiceID = oRet.DocEntry;
	var memResp = createRequest(msPath + "(" + memService.Code + ")", $.net.http.PATCH, JSON.stringify(memService), sessionID, routeID);
	getResponseJson(memResp);
	getResponseWithBody(response, oRet);
}

function createPayment(path, method, body, sessionID, routeID) {
	var memService = new Object();
	try {
		var resp = createRequest(path, $.net.http.POST, body, sessionID, routeID);
		var mybody = getResponseJson(resp);

		var iPath = "/b1s/v1/Invoices(" + mybody.PaymentInvoices[0].DocEntry.toString() + ")";
		var iTempBody = {};

		var iResponse = createRequest(iPath, $.net.http.GET, JSON.stringify(iTempBody), sessionID, routeID);
		var iORet = getResponseJson(iResponse);
	//	var bPath = "/b1s/v1/PaymentCalculationService_GetPaymentAmount";

		if (iORet.DocumentStatus !== "bost_Close") {
			var bTempBody = {
				"PaymentBPCode": {
					"BPCode": mybody.CardCode,
					"Date": mybody.DocDate
				},
				"PaymentInvoiceEntries": [
					{
						"DocEntry": mybody.PaymentInvoices[0].DocEntry.toString(),
						"DocType": "itARInvoice"
					}
				]

			};
			memService.U_Status = "2";
/*			var bResponse = createRequest(bPath, method, JSON.stringify(bTempBody), sessionID, routeID);
			var bORet = getResponseJson(bResponse);

			if (bORet.PaymentAmountParamsCollection.length > 0) {
			    memService.U_Status = "2";
			}*/
		} else {
			memService.U_Status = "3";
		}

		if (mybody.DocNum !== null && mybody.DocNum !== undefined) {
			var upTmpBody = JSON.parse(body);
			var msPath = "/b1s/v1/U_SS_MEM_SERVICES";
			var gPath = msPath + encodeURI("?$filter=U_InvoiceID  eq " +mybody.PaymentInvoices[0].DocEntry.toString() + " and U_CardCode eq '" + upTmpBody.CardCode +
				"'");
			var getSSMem = createRequest(gPath, $.net.http.GET, body, sessionID, routeID);
			var soRet = getResponseJson(getSSMem);

			memService.Code = soRet.value[0].Code;
			memService.Name = soRet.value[0].Name;
			memService.U_SalesOrderID = soRet.value[0].U_SalesOrderID;
			memService.U_CardCode = soRet.value[0].U_CardCode;
			memService.U_InvoiceID = upTmpBody.PaymentInvoices[0].DocEntry;
			var memResp = createRequest(msPath + "(" + memService.Code + ")", $.net.http.PATCH, JSON.stringify(memService), sessionID, routeID);
			getResponseJson(memResp);
		}
		getResponseWithBody(resp, mybody);

	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function createChild(path, method, body, sessionID, routeID, memType) {
	try {
		//var memType = "Child";
		var tmpBody = JSON.parse(body);
		var grpPath = "/b1s/v1/BusinessPartnerGroups";
		var grpresp = createRequest(grpPath, $.net.http.GET, body, sessionID, routeID, memType);
		var grpBody = getResponseJson(grpresp);
		var grpCode;
		for (var i = 0; i < grpBody.value.length; i++) {
			if (grpBody.value[i].Name === memType) {
				grpCode = grpBody.value[i].Code;
				break;
			}
		}
		var gPath = path;
		gPath += "?$filter=GroupCode%20eq%20" + grpCode + "%20and%20CardType%20eq%20'" + tmpBody.CardType + "'&$top=1&$orderby=CardCode%20desc";
		var newCode = getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
		tmpBody.CardCode = newCode;
		tmpBody.GroupCode = grpCode;
		delete tmpBody.Father;
		delete tmpBody.Mother;
		delete tmpBody.Guardian;
		delete tmpBody.ContactEmployees;
		var resp = createRequest(path, $.net.http.POST, JSON.stringify(tmpBody), sessionID, routeID);
		var cRet = getResponseJson(resp);
		var retBody = JSON.parse(body);
		retBody.CardCode = cRet.CardCode;
		retBody.GroupCode = cRet.GroupCode;
		for (var j = 0; j < retBody.ContactEmployees.length; j++) {
			retBody.ContactEmployees[j].CardCode = cRet.CardCode;
		}
		getResponseWithBody(resp, retBody);
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function AddRelation(grpCode, path, method, body, sessionID, routeID, generalResp) {
	try {
		var gPath = path;
		var tmpBody = JSON.parse(body);
		gPath += "?$filter=GroupCode%20eq%20" + grpCode + "&$top=1&$orderby=CardCode%20desc";
		var newCode = getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
		tmpBody.CardCode = newCode;
		tmpBody.GroupCode = grpCode;
		generalResp = createRequest(path, $.net.http.POST, JSON.stringify(tmpBody), sessionID, routeID);
		return getResponseJson(generalResp);
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function AddFather(path, method, body, sessionID, routeID, memType) {
	try {
		//var memType = "Child";
		var grpPath = "/b1s/v1/BusinessPartnerGroups";
		var grpresp = createRequest(grpPath, $.net.http.GET, body, sessionID, routeID, memType);
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
		//var fRet = AddRelation(grpCode,path, $.net.http.POST, JSON.stringify(father), sessionID, routeID,generalResp);
		var gPath = path;
		gPath += "?$filter=GroupCode%20eq%20" + grpCode + "%20and%20CardType%20eq%20'" + father.CardType + "'&$top=1&$orderby=CardCode%20desc";
		var newCode = getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
		father.CardCode = newCode;
		father.GroupCode = grpCode;
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

function AddMother(path, method, body, sessionID, routeID, memType) {
	try {
		//var memType = "Child";
		var grpPath = "/b1s/v1/BusinessPartnerGroups";
		var grpresp = createRequest(grpPath, $.net.http.GET, body, sessionID, routeID, memType);
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
		//var getResp;
		//var fRet = AddRelation(grpCode,path, $.net.http.POST, JSON.stringify(mother), sessionID, routeID,getResp);
		var gPath = path;
		gPath += "?$filter=GroupCode%20eq%20" + grpCode + "%20and%20CardType%20eq%20'" + mother.CardType + "'&$top=1&$orderby=CardCode%20desc";
		var newCode = getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
		mother.CardCode = newCode;
		mother.GroupCode = grpCode;
		var finalResp = createRequest(path, $.net.http.POST, JSON.stringify(mother), sessionID, routeID);
		var fRet = getResponseJson(finalResp);
		mother.CardCode = fRet.CardCode;
		tmpBody.U_Mother = fRet.CardCode;
		tmpBody.Phone2 = fRet.Cellular;
		if (tmpBody.U_Father === "") {
			tmpBody.FatherCard = fRet.CardCode;
		}
		tmpBody.Mother = mother;
		var upBodyStr = JSON.stringify(tmpBody);
		var upBody = JSON.parse(upBodyStr);
		delete upBody.Father;
		delete upBody.Mother;
		delete upBody.Guardian;
		delete upBody.ContactEmployees;
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

function AddGuardian(path, method, body, sessionID, routeID, memType) {
	try {
		//var memType = "Child";
		var grpPath = "/b1s/v1/BusinessPartnerGroups";
		var grpresp = createRequest(grpPath, $.net.http.GET, body, sessionID, routeID, memType);
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
		var guardian = tmpBody.Guardian;
		//var getResp;
		//var fRet = AddRelation(grpCode,path, $.net.http.POST, JSON.stringify(guardian), sessionID, routeID,getResp);
		var gPath = path;
		gPath += "?$filter=GroupCode%20eq%20" + grpCode + "%20and%20CardType%20eq%20'" + guardian.CardType + "'&$top=1&$orderby=CardCode%20desc";
		var newCode = getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
		guardian.CardCode = newCode;
		guardian.GroupCode = grpCode;
		var finalResp = createRequest(path, $.net.http.POST, JSON.stringify(guardian), sessionID, routeID);
		var fRet = getResponseJson(finalResp);
		guardian.CardCode = fRet.CardCode;
		tmpBody.U_Gardian = fRet.CardCode;
		tmpBody.Cellular = fRet.Cellular;
		if (tmpBody.U_Father === "") {
			tmpBody.FatherCard = fRet.CardCode;
		}
		tmpBody.Guardian = guardian;
		var upBodyStr = JSON.stringify(tmpBody);
		var upBody = JSON.parse(upBodyStr);
		delete upBody.Father;
		delete upBody.Mother;
		delete upBody.Guardian;
		delete upBody.ContactEmployees;
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
				updateBody = tmpBody;
				memResp = createRequest(genPath + "('" + updateBody.CardCode + "')", $.net.http.PATCH, JSON.stringify(updateBody), sessionID, routeID);
				getResponseJson(memResp);
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
				memResp = createRequest(genPath + "('" + upBody.CardCode + "')", $.net.http.PATCH, JSON.stringify(upBody), sessionID, routeID);
				getResponseJson(memResp);
				break;
			case 'Contact':
				delete tmpBody.Father;
				delete tmpBody.Mother;
				delete tmpBody.Guardian;
				updateBody = tmpBody;
				memResp = createRequest(path, $.net.http.PATCH, JSON.stringify(updateBody), sessionID, routeID);
				getResponseJson(memResp);
				break;
			default:
				break;
		}

		if (memType === "Contact") {
			var cPath = path + "/ContactEmployees";
			var cResp = createRequest(cPath, $.net.http.GET, JSON.stringify(updateBody), sessionID, routeID);
			var cRet = getResponseJson(cResp);
			if (cRet.ContactEmployees.length > 0) {
				for (var i = 0; i < cRet.ContactEmployees.length; i++) {
					for (var j = 0; j < retBody.body.ContactEmployees.length; j++) {
						var rRem = cRet.ContactEmployees[i].Remarks1
						var cRem = retBody.body.ContactEmployees[j].Remarks1
						if (rRem === cRem) {
							retBody.body.ContactEmployees[j].InternalCode = cRet.ContactEmployees[i].InternalCode;
						}
					}
				}
			}
		}
		$.response.status = $.net.http.OK;
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify(retBody));

		/*$.response.status = $.net.http.OK;
		$.response.contentType = "application/json";
		$.response.setBody(JSON.parse({
			"body": body
		}));
        $.response.contentType = "application/json";	
        $.response.headers.set("Access-Control-Allow-Origin", "*");*/
		//getResponseWithBody(memResp, tmpBody);
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function createRelation(path, method, body, sessionID, routeID, memType) {
	try {
		//var memType = "Child";
		var grpPath = "/b1s/v1/BusinessPartnerGroups";
		var grpresp = createRequest(grpPath, $.net.http.GET, body, sessionID, routeID, memType);
		var grpBody = getResponseJson(grpresp);
		var memResp;
		var grpCode;
		for (var i = 0; i < grpBody.value.length; i++) {
			if (grpBody.value[i].Name === memType) {
				grpCode = grpBody.value[i].Code;
				break;
			}
		}
		var tmpBody = JSON.parse(body);
		var father = tmpBody.Father;
		var mother = tmpBody.Mother;
		var guardian = tmpBody.Guardian;
		var getResp;
		if (tmpBody.U_Father === "" && father.CardName !== "") {
			var fRet = AddRelation(grpCode, path, $.net.http.POST, JSON.stringify(father), sessionID, routeID, getResp);
			father.CardCode = fRet.CardCode;
			tmpBody.U_Father = fRet.CardCode;
			tmpBody.Father = father;
		} else {
			memResp = createRequest(path + "('" + father.CardCode + "')", $.net.http.PATCH, JSON.stringify(father), sessionID, routeID);
			getResponseJson(memResp);
			tmpBody.U_Father = father.CardCode;
			tmpBody.Father = father;
		}
		if (tmpBody.U_Mother === "" && mother.CardName !== "") {
			var mRet = AddRelation(grpCode, path, $.net.http.POST, JSON.stringify(mother), sessionID, routeID, getResp);
			mother.CardCode = mRet.CardCode;
			tmpBody.U_Mother = mRet.CardCode;
			tmpBody.Mother = mother;
		} else {
			memResp = createRequest(path + "('" + mother.CardCode + "')", $.net.http.PATCH, JSON.stringify(mother), sessionID, routeID);
			getResponseJson(memResp);
			tmpBody.U_Mother = mother.CardCode;
			tmpBody.Mother = mother;
		}
		if (tmpBody.U_Gardian === "" && guardian.CardName !== "") {
			var gRet = AddRelation(grpCode, path, $.net.http.POST, JSON.stringify(guardian), sessionID, routeID, getResp);
			guardian.CardCode = gRet.CardCode;
			tmpBody.U_Gardian = gRet.CardCode;
			tmpBody.Guardian = guardian;
		} else {
			memResp = createRequest(path + "('" + guardian.CardCode + "')", $.net.http.PATCH, JSON.stringify(guardian), sessionID, routeID);
			getResponseJson(memResp);
			tmpBody.U_Gardian = guardian.CardCode;
			tmpBody.Guardian = guardian;
		}
		var upBodyStr = JSON.stringify(tmpBody);
		var upBody = JSON.parse(upBodyStr);
		delete upBody.Father;
		delete upBody.Mother;
		delete upBody.Guardian;
		delete tmpBody.ContactEmployees;
		memResp = createRequest(path + "('" + upBody.CardCode + "')", $.net.http.PATCH, JSON.stringify(upBody), sessionID, routeID);
		getResponseJson(memResp);
		getResponseWithBody(getResp, tmpBody);
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function getMemberByID(path, method, body, sessionID, routeID) {
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

function fetchOrder(path, method, body, sessionID, routeID) {

	var foResp = createRequest(path, $.net.http.GET, body, sessionID, routeID);
	var foBody = getResponseJson(foResp);
	var upBodyStr = JSON.stringify(foBody);
	var upBody = JSON.parse(upBodyStr);
	var getValue = {};
	var arrFinal = [];
	if (upBody.value.length > 0) {
		var response = upBody.value;
		response.forEach(function(val1) {
			var DocLines = val1.DocumentLines;
			DocLines.forEach(function(val2) {
				arrFinal.push(val2);
			});
		});

	}
	getValue.value = arrFinal;
	getResponseWithBody(foResp, getValue);
}