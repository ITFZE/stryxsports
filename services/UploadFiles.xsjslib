var baseURL = "/b1s/v1";

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
		}
		if (header !== "") {
			req.headers.set("X-HTTP-Method-Override", "PATCH");
			req.headers.set("B1S-CaseInsensitive","true");
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

function uploadFiles(path, method, body, sessionID, routeID) {
	
	var getRes = createRequest(path, $.net.http.GET, body, sessionID, routeID);
	var getResponse = getResponseJson(getRes);
	
	try {
		var conn = $.db.getConnection();
	/*	pstmt;
		if ($.request.entities.length > 0) {
			data = $.request.body.asArrayBuffer();
			var select_all_sales_orders_query = "UPDATE \"USER\".\"IMAGETABL\" SET IMAGE_CONTENT = ? " +

				" where ID='" + ID + "'";
			var pstmt = conn.prepareStatement(select_all_sales_orders_query);
			pstmt.setBlob(1, data);
			pstmt.execute();

			$.response.contentType = 'text/plain';

			$.response.setBody('Upload ok');

			$.response.status = 200;
		} else {

			$.response.setBody("No Entries");

		}

		pstmt.close();
		conn.commit();

		conn.close();*/
		
	} catch (err) {
	/*	if (pstmt !== null) {
			pstmt.close();
		}
		if (conn !== null) {
			conn.close();
		}*/
		$.response.setBody(err.message);
	}
}