var baseURL = "/b1s/v1/";
var libPath = "/ITSFZE/Development/stryxsports/services/";
var cmnLib = $.import(libPath + "CommonLib.xsjslib");

function sendEmail() {
	// var getEventID = getCode;
	var getEventID = $.request.parameters.get("EventID");

	var path = baseURL +
		"$crossjoin(U_SS_ET_COMMUNICATION,U_SS_EVENTS)?$expand=U_SS_EVENTS($select=Name,U_StartDate,U_EndDate,U_StartTime,U_EndTime,U_Location,U_Title,U_EmailContent,U_SMSContent)&$filter=U_SS_EVENTS/Code eq U_SS_ET_COMMUNICATION/U_EventID and U_SS_ET_COMMUNICATION/U_EventID eq '" +
		"6" + "'";
	var sessionID = "6bb22406-a9ec-11e8-8000-001dd8b72263";
	var routeID = ".node2";
	var tmpBody = {"":""};
	try {
		var resp = cmnLib.createRequest(path, $.net.http.GET, JSON.stringify(tmpBody), sessionID, routeID);
		var myBody = cmnLib.getResponseJson(resp);

	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}

}
sendEmail();