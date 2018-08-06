function sendEmail12() {
	var response = "";
	var subscribers = ["rh@inflexiontechfze.com", "skanand76@gmail.com"];
	//var smtpConnection = new $.net.SMTPConnection();
	//var getRequestBody = $.request.body.asString();
	//var getBody = JSON.parse(getRequestBody);
	//var getName = getBody.Name;
	//var getMessages = getBody.messages;
	//var getStartDate = getBody.U_ScheduleSDate;
	//var getEndDate = getBody.U_ScheduleEDate;
	//var getStartTime = getBody.U_ScheduleSTime;
	//var getEndTime = getBody.U_ScheduleETime;
	//var setMessages = getMessages.replace("[[SC_Firstname]]", getName);

	var sendMailResponse = "Welcome to stryx Sports";

	var mail = new $.net.Mail({
		sender: "ska@inflexiontechfze.com",
		subject: "StryxSports",
		subjectEncoding: "UTF-8",
		parts: [
        new $.net.Mail.Part({
				type: $.net.Mail.Part.TYPE_TEXT,
				contentType: "text/html",
				text: sendMailResponse
			})]
	});

	for (var i = 0; i < subscribers.length; ++i) {
		mail.to = subscribers[i];

		var returnValue;
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
	//smtpConnection.close();
}

var conn = $.hdb.getConnection();
var rs, pstmt, pc, result, lv_host, lv_port;

function checkSMTP() {

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
}

function sendEmail() {
	var returnValue;
	var response;
	var mail = new $.net.Mail({
		sender: {
			address: "ska@inflexiontechfze.com"
		},
		to: [{
				name: "satish",
				address: "skanand76@gmail.com",
				nameEncoding: "US-ASCII"
			},
			{
				name: "satish",
				address: "ska@inflexiontechfze.com",
				nameEncoding: "US-ASCII"
			}],
		subject: "Welcom to STRYX",
		subjectEncoding: "UTF-8",
		parts: [new $.net.Mail.Part({
			type: $.net.Mail.Part.TYPE_TEXT,
			text: "Welcome to stryx sports",
			contentType: "text/plain",
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
checkSMTP();
sendEmail();