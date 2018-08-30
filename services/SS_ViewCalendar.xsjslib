var greetingPrefix = "Hello, ";
var baseURL = "/b1s/v1";
var libPath = "/ITSFZE/Development/stryxsports/services/";
var cmnLib = $.import(libPath + "CommonLib.xsjslib");

function getResponseJson(response) {
    var myEntityBody;
	var ele = [];
	//Entities Body 
	for (var w in response.entities) {
		if (response.entities[w].body) {
			try {
				myEntityBody = JSON.parse(response.entities[w].body.asWebRequest().body.asString());
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
    "body": ele
}));
    

}

function fetchViewCalendar(path, method, body, sessionID, routeID) {

	try {
		var tmpBody = JSON.parse(body);

		if (tmpBody.value.length > 0) {
			var batchCnt = "--batch_myBatch001" + "\r\n" +
				"Content-Type: application/http" + "\r\n" +
				"Content-Transfer-Encoding: binary" + "\r\n\r\n";
			for (var j = 0; j < tmpBody.value.length; j++) {
				var m = j + 1;
				batchCnt += "--batch_myBatch001" + "\r\n" +
					"Content-Type: application/http\r\nContent-Transfer-Encoding: binary\r\nContent-ID:" + m + "\r\n\r\n" +
					"GET /U_SS_MCAL_SCHEDULE?$filter=U_MemberId eq '" + tmpBody.value[j].BusinessPartners.CardCode + "' and Name eq '"+tmpBody.teamsCalenderName+"' HTTP/1.1" + "\r\n" +
					"Accept: application/json" + "\r\n\r\n";
			}
			batchCnt += "--batch_myBatch001--";

			var response = cmnLib.getBatchRequest("", $.net.http.POST, batchCnt, sessionID, routeID);
			getResponseJson(response);

		}

		/*		var getCreateBodys = getCreateBody.toString();
			var dateSTR = getCreateBodys.replace(/,--changeset_myChangeset001/g, "--changeset_myChangeset001");
			cmnLib.sendBatchRequest("", $.net.http.POST, dateSTR, sessionID, routeID);*/

	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}

}