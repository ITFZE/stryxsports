var baseURL = "/b1s/v1";
var libPath = "/ITSFZE/Development/stryxsports/services/";
var m = $.import(libPath + "Moment.xsjslib");
var l = $.import(libPath + "Later.xsjslib");
var cmnLib = $.import(libPath + "CommonLib.xsjslib");

function getDates(teamId, teamCalName, schType, sessionVal, date1, date2, body, memberId, hId, sessionID, routeID) {

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
	if (eBody.length > 0) {
		var rDates = [];
		var rMonths = [];
		var rYears = [];
		for (var j = 0; j < eBody.length; j++) {
			var sD = new Date(eBody[j].U_SDate);
			var eD = new Date(eBody[j].U_EDate);
			var rD = [];
			for (var d = sD; d <= eD; d.setDate(d.getDate() + 1)) {
				rD.push(new Date(d));
			}
			rD.forEach(function(ele, i) {
				rDates.push(ele.getDate());
				rMonths.push(ele.getMonth() + 1);
				rYears.push(ele.getFullYear());
			});
		}
		sSch = sSch.except().on(rDates).dayOfMonth().on(rMonths).month().on(rYears).year();
		eSch = eSch.except().on(rDates).dayOfMonth().on(rMonths).month().on(rYears).year();
	}
	var sSched = "";
	var eSched = "";
	if (schType === "1") {
		sSched = l.later.schedule(sSch).next(sessionVal, sDate);
		eSched = l.later.schedule(eSch).next(sessionVal, sDate);
	} else {
		sSched = l.later.schedule(sSch).next(-1, sDate, eDate);
		eSched = l.later.schedule(eSch).next(-1, sDate, eDate);
	}

    if(Array.isArray(sSched)){
    	sSched.forEach(function(ele) {
    		mSSched.push(m.moment(ele).format("YYYY-MM-DD HH:mm:ss"));
    	});
    } else {
        mSSched.push(m.moment(sSched).format("YYYY-MM-DD HH:mm:ss"));
    }
    if(Array.isArray(eSched)){
    	eSched.forEach(function(ele) {
    		mESched.push(m.moment(ele).format("YYYY-MM-DD HH:mm:ss"));
    	});
    } else {
        mESched.push(m.moment(eSched).format("YYYY-MM-DD HH:mm:ss"));
    }
	var schJson = [];
	var tCSPath = "/b1s/v1/U_SS_MCAL_SCHEDULE?$top=1&$orderby=Code%20desc";
	var newCode = cmnLib.getNewCode(tCSPath, $.net.http.GET, "", sessionID, routeID);
	//var code = newCode + 1;
	for (var s = 0; s < mSSched.length; s++) {
		var obj = {};
		obj.Code = newCode;
		obj.Name = teamCalName;
		obj.U_TeamId = teamId.toString();
		obj.U_MemberId = memberId;
		obj.U_SDate = m.moment(mSSched[s]).format("YYYY-MM-DD");
		obj.U_STime = m.moment(mSSched[s]).format("HH:mm:ss");
		obj.U_EDate = m.moment(mESched[s]).format("YYYY-MM-DD");
		obj.U_ETime = m.moment(mESched[s]).format("HH:mm:ss");
		schJson.push(obj);
		//code += 1;
	}
	return schJson;
}

function createMCalSchedule(path, method, body, sessionID, routeID) {
	try {
		var sJson = "";
		body = JSON.parse(body);
		//API1
		var aPath = encodeURI(
			"/b1s/v1/$crossjoin(U_SS_MEM_SERVICES,U_SS_SERVICE_ITEM,U_SS_TEAMS)?$filter=U_SS_SERVICE_ITEM/U_MemOrderID eq U_SS_MEM_SERVICES/U_SalesOrderID and U_SS_SERVICE_ITEM/U_TeamID eq U_SS_TEAMS/Code and U_SS_SERVICE_ITEM/U_TeamID ne null and U_SS_SERVICE_ITEM/U_TeamID eq '" +
			body.teamID + "' and U_SS_MEM_SERVICES/U_CardCode eq '" + body.cardCode +
			"' &$apply=groupby((U_SS_MEM_SERVICES/Code,U_SS_MEM_SERVICES/Name,U_SS_SERVICE_ITEM/U_ItemCode,U_SS_SERVICE_ITEM/U_StartDate,U_SS_SERVICE_ITEM/U_MemOrderID))"
		);
		var aResp = cmnLib.createRequest(aPath, $.net.http.GET, "", sessionID, routeID);
		var aBody = cmnLib.getResponseJson(aResp);
		var sItemCode = aBody.value[0].U_SS_SERVICE_ITEM.U_ItemCode;
		var sStartDate = new Date(aBody.value[0].U_SS_SERVICE_ITEM.U_StartDate);
		var sMemOrderID = aBody.value[0].U_SS_SERVICE_ITEM.U_MemOrderID;
		var sEndDate = new Date();
		//API2
		var dPath = encodeURI("/b1s/v1/Orders(" + sMemOrderID + ")/DocumentLines");
		var dResp = cmnLib.createRequest(dPath, $.net.http.GET, "", sessionID, routeID);
		var dBody = cmnLib.getResponseJson(dResp);
		var orderBody = dBody.DocumentLines;
		//API3
		var bPath = encodeURI("/b1s/v1/Items('" + sItemCode + "')");
		var bResp = cmnLib.createRequest(bPath, $.net.http.GET, "", sessionID, routeID);
		var bBody = cmnLib.getResponseJson(bResp);
		var itemBody = bBody;
		var ordQty = 0;
		var session = 0;
		orderBody.forEach(function(ele) {
			if (ele.ItemCode === sItemCode) {
				ordQty = ele.Quantity;
			}
		});
		//API4
		var cPath = encodeURI("/b1s/v1/U_SS_TEAM_CALENDAR?$filter=U_TeamId eq '" + body.teamID + "'");
		var cResp = cmnLib.createRequest(cPath, $.net.http.GET, "", sessionID, routeID);
		var cBody = cmnLib.getResponseJson(cResp);
		var tCalName = cBody.value[0].Name;
		var hListId = cBody.value[0].U_HolidayListID;

		//API5
		var ePath = encodeURI("/b1s/v1/U_SS_MEMBER_CALENDAR?$filter=Name eq '" + tCalName + "' and  U_MemberId eq '" + body.cardCode + "'");
		var eResp = cmnLib.createRequest(ePath, $.net.http.GET, "", sessionID, routeID);
		var eBody = cmnLib.getResponseJson(eResp);

		if (itemBody.U_Subscription === "1") {
			//Session
			switch (itemBody.U_Duration) {
				case "1": //Hour
					session = itemBody.U_Time * ordQty;
					break;
				case "2": //Day
					session = itemBody.U_Time * ordQty;
					break;
				case "3": //Week
					session = itemBody.U_Time * ordQty;
					break;
				case "4": //Month
					session = itemBody.U_Time * ordQty;
					break;
			}
		} else {
			//Fixed
			switch (itemBody.U_Duration) {
				case "1": //Hour --- add days to get end date
					sEndDate.setDate(sStartDate.getDate() + itemBody.U_Time);
					break;
				case "2": //Day --- add days to get end date
					sEndDate.setDate(sStartDate.getDate() + itemBody.U_Time);
					break;
				case "3": //Week
					sEndDate.setDate(sStartDate.getDate() + itemBody.U_Time * 7);
					break;
				case "4": //Month
					var dd = sStartDate.getDate();
					var mm = sStartDate.getMonth() + itemBody.U_Time;
					var y = sStartDate.getFullYear();
					sEndDate = new Date(y, mm, dd);
					break;
			}
		}
		if (itemBody.U_Subscription === "1") {
			sJson = getDates(body.teamID, tCalName, "1", session, sStartDate, "", JSON.stringify(eBody), body.cardCode, hListId, sessionID,
				routeID);
		} else {
			sJson = getDates(body.teamID, tCalName, "2", 0, sStartDate, sEndDate, JSON.stringify(eBody), body.cardCode, hListId, sessionID,
				routeID);
		}
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