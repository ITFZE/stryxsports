var baseURL = "/b1s/v1";
var libPath = "/ITSFZE/Development/stryxsports/services/";
var cmnLib = $.import(libPath + "CommonLib.xsjslib");
//var newSendEmail = $.import(libPath + "NewSendEmail.xsjs");

function create_UUID() {
	var dt = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}

function createEvent(path, method, body, sessionID, routeID) {
	try {
		var gPath = path;
		gPath += "?$top=1&$orderby=Code%20desc";
		var newCode = cmnLib.getNewCode(gPath, $.net.http.GET, body, sessionID, routeID);
		var tmpBody = JSON.parse(body);
		tmpBody.Code = parseInt(newCode) + 1;
		var resp = cmnLib.createRequest(path, $.net.http.POST, JSON.stringify(tmpBody), sessionID, routeID);
		var mybody = cmnLib.getResponseJson(resp);
		if (mybody.error !== undefined) {
			if (mybody.error.code === -2028) {
				var getResp = cmnLib.createRequest(gPath, $.net.http.GET, body, sessionID, routeID);
				cmnLib.getResponse(getResp);
			} else {
				cmnLib.getResponseWithBody(resp, mybody);
			}
		} else {
			cmnLib.getResponseWithBody(resp, mybody);
		}
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function createInviteMembers(path, method, body, sessionID, routeID) {
	try {
		var newTMPBody = [];
		var gPath = path;
		gPath += "?$top=1&$orderby=Code%20desc";
		var tmpBody = JSON.parse(body);
		if (tmpBody.value.length > 0) {
			var sPath = encodeURI(baseURL + "/U_SS_ET_COMMUNICATION");
			for (var i = 0; i < tmpBody.value.length; i++) {
				var memberObj = new Object();
				if (i === 0) {
					var upPath = sPath + "?$top=1&$orderby=Code%20desc";
					var getNewCode = cmnLib.getNewCode(upPath, $.net.http.GET, body, sessionID, routeID);
					memberObj.Code = parseInt(getNewCode) + 1;
				} else {
					memberObj.Code = parseInt(newTMPBody[newTMPBody.length - 1].Code) + 1;
				}
				memberObj.Name = tmpBody.value[i].BusinessPartners.CardCode + " - " + tmpBody.U_EventID;
				memberObj.U_BPCardCode = tmpBody.value[i].BusinessPartners.CardCode;
				memberObj.U_EMail = tmpBody.value[i].BusinessPartners.EmailAddress;
				memberObj.U_Moblie = tmpBody.value[i].BusinessPartners.Cellular;
				memberObj.U_EventID = tmpBody.U_EventID;
				newTMPBody.push(memberObj);
			}

			if (newTMPBody.length > 0) {
				var getCreateBody = [];

				var text = "";
				var endIn = newTMPBody.length - 1;
				var str = "--batch_myBatch001" + "\n" +
					"Content-Type: application/http" + "\n" +
					"Content-Transfer-Encoding: binary" + "\n" +
					"--changeset_myChangeset001" + "\n" +
					"POST /U_SS_ET_COMMUNICATION HTTP/1.1" + "\n" +
					"Accept: application/json" + "\n";
				var start = "--changeset_myChangeset001" + "\n" +
					"Content-Type: application/http" + "\n" +
					"Content-Transfer-Encoding: binary" + "\n" +
					"POST /U_SS_ET_COMMUNICATION HTTP/1.1" + "\n" +
					"Accept: application/json" + "\n";

				for (var j = 0; j < newTMPBody.length; j++) {
					if (endIn === j) {
						text = "";
						text += start + "\n" + JSON.stringify(newTMPBody[j]) + "\n" + "--changeset_myChangeset001--" + "\n" + "--batch_myBatch001--";
						getCreateBody.push(text);
					} else {
						if (j === 0) {
							text += str + "\n" + JSON.stringify(newTMPBody[j]) + "\n";
							getCreateBody.push(text);
						} else {
							text = "";
							text += start + "\n" + JSON.stringify(newTMPBody[j]) + "\n";
							getCreateBody.push(text);
						}

					}

				}
				var getCreateBodys = getCreateBody.toString();
				var dateSTR = getCreateBodys.replace(/,--changeset_myChangeset001/g, "--changeset_myChangeset001");
				cmnLib.sendBatchRequest("", $.net.http.POST, dateSTR, sessionID, routeID);
				//	creatScheduler(newTMPBody[0].U_EventID);
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

function getBatchRequests(path, method, body, sessionID, routeID) {
	try {
		cmnLib.getBatchRequest("", $.net.http.POST, "", sessionID, routeID);
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}

}

function updateEvent(path, method, body, sessionID, routeID) {
	try {
		var resp = cmnLib.createRequest(path, method, body, sessionID, routeID);
		cmnLib.getResponseJson(resp);

	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function creatScheduler(getCode) {
	var myjob = new $.jobs.Job({
		uri: "send_Job.xsjob"
	});
	var d = new Date();
	var day = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
	var a = d.getUTCFullYear() + " " + (d.getUTCMonth() + 1) + " " + d.getUTCDate() + " " + day[d.getUTCDay()] + " " + d.getUTCHours() + " " +
		(d.getUTCMinutes() + 1) + " " + d.getUTCSeconds();
	var id = myjob.schedules.add({
		description: "Invited Members In Event Send Email And SMS",
		xscron: a,
		parameter: {
			"EventID": getCode
		}
	});

	//	newSendEmail.sendEmail(getCode);
}