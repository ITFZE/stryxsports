var baseURL = "/b1s/v1";
var libPath = "/ITSFZE/Development/stryxsports/services/";
var m = $.import(libPath + "Moment.xsjslib");
var l = $.import(libPath + "Later.xsjslib");
var cmnLib = $.import(libPath + "CommonLib.xsjslib");

function createBatchRequest(path, method, body, sessionID, routeID) {
	try {
		var destination = $.net.http.readDestination("ITSFZE.Development.stryxsports.services.destination", "Connection");
		var client = new $.net.http.Client();

		var req = new $.web.WebRequest(method, path);

		req.cookies.set("B1SESSION", sessionID);
		req.entities.create();
		req.entities[0].headers.set("Content-Type", "multipart/mixed;boundary=batch_POST_U_SS_TCAL_SCHEDULE");
		req.entities[0].setBody(body.toString());
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

function getDates(teamCalName, date1, date2, body, tmId, hId, sessionID, routeID) {

	// Get holidays based on holidaylistId
	var hdpath = "/b1s/v1/U_SS_HOLIDAYS?$filter=U_HolidayListId%20eq%20'" + hId + "'";
	var hdResp = cmnLib.createRequest(hdpath, $.net.http.GET, "", sessionID, routeID);
	var hdBody = cmnLib.getResponseJson(hdResp);
	var mSSched = [],
		mESched = [];
	var sDate = new Date(date1);
	var eDate = new Date(date2);
	var aTime = JSON.parse(body).value;
	var days = {
		Sunday: 1,
		Monday: 2,
		Tuesday: 3,
		Wednesday: 4,
		Thursday: 5,
		Friday: 6,
		Saturday: 7
	};
	l.later.date.localTime();
	var sSch = l.later.parse.recur();
	var eSch = l.later.parse.recur();
	for (var i = 0; i < aTime.length; i++) {
		if (i === 0) {
			sSch = sSch.on(aTime[i].U_StartTime).time().on(days[aTime[i].U_Days]).dayOfWeek();
			eSch = eSch.on(aTime[i].U_EndTime).time().on(days[aTime[i].U_Days]).dayOfWeek();
		} else {
			sSch = sSch.and().on(aTime[i].U_StartTime).time().on(days[aTime[i].U_Days]).dayOfWeek();
			eSch = eSch.and().on(aTime[i].U_EndTime).time().on(days[aTime[i].U_Days]).dayOfWeek();
		}
	}
	var eBody = hdBody.value;
	if(eBody.length > 0){
	    var rDates = [];
        var rMonths= [];
        var rYears = [];
	    for (var j = 0; j < eBody.length; j++) {
	        var sD = new Date(eBody[j].U_SDate);
            var eD = new Date(eBody[j].U_EDate);
            var rD = [];
            for (var d = sD; d <= eD; d.setDate(d.getDate() + 1)) {
                rD.push(new Date(d));
            }
            rD.forEach(function (ele,i){
               rDates.push(ele.getDate());
               rMonths.push(ele.getMonth()+1);
               rYears.push(ele.getFullYear());
            });
        }
        sSch = sSch.except().on(rDates).dayOfMonth().on(rMonths).month().on(rYears).year();
        eSch = eSch.except().on(rDates).dayOfMonth().on(rMonths).month().on(rYears).year();
	}
	var sSched = l.later.schedule(sSch).next(-1, sDate, eDate);
	var eSched = l.later.schedule(eSch).next(-1, sDate, eDate);

    if(Array.isArray(sSched)){
    	sSched.forEach(function(ele) {
    		mSSched.push(m.moment(ele).format("YYYY-MM-DD HH:mm:ss"));
    	});
    }else{
        mSSched.push(m.moment(sSched).format("YYYY-MM-DD HH:mm:ss"));
    }
    if(Array.isArray(eSched)){
    	eSched.forEach(function(ele) {
    		mESched.push(m.moment(ele).format("YYYY-MM-DD HH:mm:ss"));
    	});
    }else{
        mESched.push(m.moment(eSched).format("YYYY-MM-DD HH:mm:ss"));
    }
	var schJson = [];
	var tCSPath = "/b1s/v1/U_SS_TCAL_SCHEDULE?$top=1&$orderby=Code%20desc";
	var newCode = cmnLib.getNewCode(tCSPath, $.net.http.GET, "", sessionID, routeID);
	//var code = newCode + 1;
	for (var s = 0; s < mSSched.length; s++) {
		var obj = {};
		obj.Code = newCode;
		obj.Name = teamCalName;
		obj.U_TeamId = tmId.toString();
		obj.U_SDate = m.moment(mSSched[s]).format("YYYY-MM-DD");
		obj.U_STime = m.moment(mSSched[s]).format("HH:mm:ss");
		obj.U_EDate = m.moment(mESched[s]).format("YYYY-MM-DD");
		obj.U_ETime = m.moment(mESched[s]).format("HH:mm:ss");
		schJson.push(obj);
		//code += 1;
	}
	return schJson;
}

function createTCalSchedule(path, method, body, sessionID, routeID) {
	try {
	  //  body = body.split('"').join('');
	    body = JSON.parse(body);
	    var teamCalName = body.Name;
	    path += encodeURI("?$filter=Name eq '" + teamCalName + "'");
	    var tCResp = cmnLib.createRequest(path, $.net.http.GET, "", sessionID, routeID);
		var tCBody = cmnLib.getResponseJson(tCResp);
		// Get team start and end dates
		var teamId = tCBody.value[0].U_TeamId;
		var hListId = tCBody.value[0].U_HolidayListID;
		var tPath = "/b1s/v1/U_SS_TEAMS(" + teamId + ")";
		var tResp = cmnLib.createRequest(tPath, $.net.http.GET, "", sessionID, routeID);
		var tMybody = cmnLib.getResponseJson(tResp);
		var tSDate = tMybody.U_StartDate,
			tEDate = tMybody.U_EndDate;
		var sJson = getDates(teamCalName, tSDate, tEDate, JSON.stringify(tCBody), teamId, hListId, sessionID, routeID);

		if (sJson.length > 0) {
			var batchCnt = "--batch_myBatch001" + "\r\n" +
				"Content-Type: application/http" + "\r\n" +
				"Content-Transfer-Encoding: binary" + "\r\n\r\n";
			for (var j = 0; j < sJson.length; j++) {
				var n = j + 1;
				batchCnt += "--changeset_myChangeset001" + "\r\n" +
					"Content-Type: application/http\r\nContent-Transfer-Encoding: binary\r\nContent-ID:" + n + "\r\n\r\n" +
					"POST /U_SS_MCAL_SCHEDULE HTTP/1.1" + "\r\n" +
					"Accept: application/json" + "\r\n\r\n";
				batchCnt += JSON.stringify(sJson[j]) + "\r\n\r\n";
			}
			batchCnt += "--changeset_myChangeset001--" + "\r\n" + "--batch_myBatch001--";
			cmnLib.sendBatchRequest("", $.net.http.POST, batchCnt, sessionID, routeID);
		}
	} catch (e) {
		$.trace.warning("callServiceLayer Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}