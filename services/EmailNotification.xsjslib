function createRequest(path, method, body, sessionID, routeID) {
	try {
		var destination = $.net.http.readDestination("stryx.services.destination", "SMSGlobal");
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

/*var conn = $.hdb.getConnection();
var rs, pstmt, pc, result, lv_host, lv_port;

function checkSMTP(path, method, body, sessionID, routeID) {

	try {
		//Check if the the index server parameters for smtp host and port are set
		var query = 'select * from PUBLIC.M_INIFILE_CONTENTS WHERE FILE_NAME = ? AND LAYER_NAME = ? AND SECTION = ? AND KEY = ?';
		rs = conn.executeQuery(query, 'xsengine.ini', 'SYSTEM', 'smtp', 'server_host');

		if (rs.length < 1) {
			// if no entry, throw a response as 'SMTP Host is not configured'
			$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
			//$.response.setBody(bundle.getText("SMTP_CONFIG"));
		} else {
			// read the host name
			lv_host = rs[0].VALUE;

			// If host is empty ,throw a response as 'SMTP Host is not configured'
			if (lv_host === "" || lv_host === "localhost") {
				$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
				//$.response.setBody(bundle.getText("SMTP_CONFIG"));
			} else {
				query = 'select * from PUBLIC.M_INIFILE_CONTENTS WHERE FILE_NAME = ? AND LAYER_NAME = ? AND SECTION = ? AND KEY = ?';
				rs = conn.executeQuery(query, 'xsengine.ini', 'SYSTEM', 'smtp', 'server_port');
				if (rs.length > 1) {
					lv_port = rs[0].VALUE;

					//If port is empty ,throw a response as 'SMTP Port is not configured'
					if (lv_port === "") {
						$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
						//$.response.setBody(bundle.getText("SMTP_PORT_CONFIG"));
					}

				}
			}
			conn.close();
		}

	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		//$.response.setBody(bundle.getText("SMTP_MAIL_NOT_SEND"));
	}
}*/

function sendEmail(path, method, body, sessionID, routeID) {
	var returnValue;
	var response;
	var mObj = JSON.parse(body);
	var mail = new $.net.Mail({
		sender: {
			address: "sgv@inflexiontechfze.com"
		},
		to: mObj.to,
		subject: mObj.subject,
		subjectEncoding: "UTF-8",
		parts: [new $.net.Mail.Part({
			type: $.net.Mail.Part.TYPE_TEXT,
			text: mObj.body,
			contentType: "text/HTML",
			encoding: "UTF-8"
		})]
	});
	try {
		//returnValue = smtpConnection.send(mail);
		returnValue = mail.send();
		$.response.contentType = "application/json";
		$.response.status = $.net.http.OK;
		$.response.setBody(JSON.stringify("MessageId = " + returnValue.messageId + ", final reply = " + returnValue.finalReply));
	} catch (err) {
		response = "Error occurred:" + err.message;
		$.response.contentType = "application/json";
		$.response.status = $.net.http.OK;
		$.response.setBody(JSON.stringify('Invalid Command ' + response));
	}
}