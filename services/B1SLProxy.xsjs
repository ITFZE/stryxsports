var libPath = "/ITSFZE/Production/stryxsports/services/";
var cmnLib = $.import(libPath + "CommonLib.xsjslib");
var B1LIB = $.import(libPath + "B1SLLib.xsjslib");
var en = $.import(libPath + "SS_Events.xsjslib");
var coachLib = $.import(libPath + "SS_Coach.xsjslib");
var tm = $.import(libPath + "SS_TeamLib.xsjslib");
var mem = $.import(libPath + "SS_MemberLib.xsjslib");
var lc = $.import(libPath + "SS_LeadCreate.xsjslib");
var ca = $.import(libPath + "SS_CreateActivity.xsjslib");
var emailNotifyLib = $.import(libPath + "EmailNotification.xsjslib");
var cmnLib = $.import(libPath + "CommonLib.xsjslib");
var schLib = $.import(libPath + "SS_Schedule.xsjslib");
var tCalSchLib = $.import(libPath + "SS_TCalScheduleLib.xsjslib");
var mCalSchLib = $.import(libPath + "SS_MCalScheduleLib.xsjslib");
var viewCalLib = $.import(libPath + "SS_ViewCalendar.xsjslib");

/*var emailNotifyLib = $.import(libPath + "EmailNotification.xsjslib");
var smsGlobalLib = $.import(libPath + "SMSGlobal.xsjslib");
*/
function callServiceLayer(path, method, body, sessionID, routeID) {
	//var ssLib = $.stryxsports.client.services.B1SLLib;
	var response = cmnLib.createRequest(path, method, body, sessionID, routeID);
	cmnLib.getResponse(response);
}

function callLogout(path, method, body, sessionID, routeID) {
	//var ssLib = $.stryxsports.client.services.B1SLLib;
	var response = cmnLib.createRequest(path, method, body, sessionID, routeID);
	cmnLib.getResponse(response);
}

var B1SLAddress = "/b1s/v1/";
var aCmd = $.request.parameters.get('cmd');
var actionURI = $.request.parameters.get('actionUri');
var sessionID = $.request.parameters.get('sessionID');
var routeID = $.request.parameters.get('routeID');
var filter = encodeURI($.request.parameters.get('filter'));
var sstype = $.request.parameters.get('sstype');
var memType = $.request.parameters.get('memType');
//var crossJoin = $.request.parameters.get('crossJoin');

var path = B1SLAddress + actionURI;
var body = null;
var body1 = null;
//var B1LIB = $.stryxsports.client.services.B1SLLib;

if (filter === 'undefined' || filter === '' || filter === null) {
	filter = "";
} else {
	filter = filter.replace(/%7C%7C/g, "&");
	//filter = filter.replace(/||/g,"&");
}
if ($.request.body) {
	body = $.request.body.asString();
}

$.trace.debug("B1SLogic cmd: " + aCmd);
switch (aCmd) {
	case 'Login':
		path = B1SLAddress + "Login";
		//callServiceLayer(path, $.net.http.POST, body, sessionID, routeID);
		B1LIB.authenticate(path, $.net.http.POST, body, sessionID, routeID);
		break;
	case 'Logout':
		path = B1SLAddress + "Logout";
		callLogout(path, $.net.http.POST, body, sessionID, routeID);
		break;
	case 'Add':
		switch (sstype) {
			case 'U_SS_CATEGORY':
				B1LIB.createSportCategory(path, $.net.http.POST, body, sessionID, routeID);
				break;
			case 'U_SS_TEAMS':
				switch (memType) {
					case 'CREATE_TEAM':
						tm.createTeam(path, $.net.http.POST, body, sessionID, routeID);
						break;
					case 'CREATE_CALENDAR_TEAM':
						tm.createTeamCalendar(path, $.net.http.POST, body, sessionID, routeID, memType);
						break;
					default:
						break;

				}
			case 'U_SS_MEMBER_CALENDAR':
				switch (memType) {
					case 'CREATE_MEMBER_CALENDAR':
						mem.createMemberCalendar(path, $.net.http.POST, body, sessionID, routeID);
						break;

					default:
						break;
				}
				break;

			case 'U_SS_MEMBER':
				switch (memType) {
					case 'Child':
						mem.createChild(path, $.net.http.POST, body, sessionID, routeID, memType);
						break;
					case 'Father':
						mem.AddFather(path, $.net.http.POST, body, sessionID, routeID, memType);
						break;
					case 'Mother':
						mem.AddMother(path, $.net.http.POST, body, sessionID, routeID, memType);
						break;
					case 'Guardian':
						mem.AddGuardian(path, $.net.http.POST, body, sessionID, routeID, memType);
						break;
					case 'Order':
						mem.createOrder(path, $.net.http.POST, body, sessionID, routeID, memType);
						break;
					case 'Invoices':
						mem.createInvoice(path, $.net.http.POST, body, sessionID, routeID, memType);
						break;
					case 'Payment':
						mem.createPayment(path, $.net.http.POST, body, sessionID, routeID);
						break;
					default:
						break;
				}
				break;
			case 'U_SS_LeadCreate':
				switch (memType) {
					case 'Child':
						lc.createChild(path, $.net.http.POST, body, sessionID, routeID);
						break;
					case 'Father':
						lc.AddFather(path, $.net.http.POST, body, sessionID, routeID);
						break;
					case 'Mother':
						lc.AddMother(path, $.net.http.POST, body, sessionID, routeID);
						break;
					case 'Guardian':
						lc.AddGuardian(path, $.net.http.POST, body, sessionID, routeID);
						break;

				}
				break;
			case 'U_SS_CreateActivity':
				ca.createActivity(path, $.net.http.POST, body, sessionID, routeID);
				break;
			case 'U_SS_EVENTS':
				switch (memType) {
					case 'U_CREATEEVENT':
						en.createEvent(path, $.net.http.POST, body, sessionID, routeID);
						break;
					case 'U_INVITE_MEMBER':
						en.createInviteMembers(path, $.net.http.POST, body, sessionID, routeID);
						break;
				}
				break;
			case 'U_SS_MCAL_SCHEDULE':
				mCalSchLib.createMCalSchedule(path, $.net.http.POST, body, sessionID, routeID);
				break;
			case 'U_SS_TCAL_SCHEDULE':
				tCalSchLib.createTCalSchedule(path, $.net.http.POST, body, sessionID, routeID);
				break;
			default:
				B1LIB.createSS(path, $.net.http.POST, body, sessionID, routeID);
				break;
		}
		break;
	case 'Update':
		callServiceLayer(path, $.net.http.PATCH, body, sessionID, routeID);
		break;
	case 'UpdateById':
		switch (sstype) {
			case 'U_SS_CATEGORY':
				B1LIB.updateCategoryByID(path, $.net.http.PATCH, body, sessionID, routeID);
				break;
			case 'U_SS_COACH':
				coachLib.updateCoachByID(path, $.net.http.PATCH, body, sessionID, routeID);
				break;
			case 'U_SS_UpdateActivity':
				ca.updateActivityID(path, $.net.http.PATCH, body, sessionID, routeID);
				break;
			case 'U_SS_TEAMS':
				tm.updateTeamByID(path, $.net.http.PATCH, body, sessionID, routeID);
				break;
			case 'U_SS_MEMBER':
				switch (memType) {
					case 'Child':
					case 'Contact':
						mem.updateChild(path, $.net.http.Patch, body, sessionID, routeID, memType);
						break;
					case 'Father':
					case 'Mother':
					case 'Guardian':
						mem.updateChild(path, $.net.http.Patch, body, sessionID, routeID, memType);
						break;

					default:
						break;
				}
				//mem.updateChild(path, $.net.http.Patch, body, sessionID, routeID, memType);
				break;
			case 'U_SS_LeadCreate':
				switch (memType) {
					case 'Child':
					case 'Father':
					case 'Mother':
					case 'Guardian':
						lc.updateChild(path, $.net.http.Patch, body, sessionID, routeID, memType);
						break;
					default:
						break;
				}
				break;

			case 'U_SS_EVENTS':
				switch (memType) {
					case 'U_SS_UPDATE':
						en.updateEvent(path, $.net.http.PATCH, body, sessionID, routeID);
						break;
					default:
						break;
				}
				break;
			default:
				callServiceLayer(path, $.net.http.PATCH, body, sessionID, routeID);
				break;
		}
		break;
	case 'Delete':
		callServiceLayer(path, $.net.http.DEL, body, sessionID, routeID);
		break;
	case 'GetById':
		switch (sstype) {
			case 'U_SS_CATEGORY':
				B1LIB.getCategoryByID(path, $.net.http.GET, body, sessionID, routeID);
				break;
			case 'U_SS_COACH':
				coachLib.getCoachID(path, $.net.http.GET, body, sessionID, routeID);
				break;
			case 'U_SS_TEAMS':
				tm.getTeamByID(path, $.net.http.GET, body, sessionID, routeID);
				break;
			case 'U_SS_MEMBER':
				mem.getMemberByID(path, $.net.http.GET, body, sessionID, routeID, memType);
				break;
			case 'U_SS_LeadCreate':
				lc.getLeadByID(path, $.net.http.GET, body, sessionID, routeID);
				break;
			case 'fetchOrder':
				if (filter !== "") {
					path += "?" + filter;
				}
				mem.fetchOrder(path, $.net.http.POST, body, sessionID, routeID, memType);
				break;
			case 'U_MEMBER':
				viewCalLib.fetchViewCalendar(path, $.net.http.GET, body, sessionID, routeID);
				break;
			default:
				callServiceLayer(path, $.net.http.GET, body, sessionID, routeID);
				break;
		}
		break;
	case 'Get':
		if (filter !== "") {
			path += "?" + filter;
		}
		/*	if(crossJoin !== ""){
    	    path += "?"  + crossJoin;
    	}*/
		switch (sstype) {
			case "FetchActivities":
				ca.getActivities(path, $.net.http.GET, body, sessionID, routeID);
				break;
			case 'U_SS_Moment':
				schLib.getMomentDateTime();
				break;
			case 'U_SS_Later':
				schLib.getLaterDateTime();
				break;
			case 'U_SS_CATEGORY':
			default:
				callServiceLayer(path, $.net.http.GET, body, sessionID, routeID);
				break;
		}
		break;
	case 'Action':
		callServiceLayer(path, $.net.http.POST, body, sessionID, routeID);
		break;
	case 'NotifyEmail':
		switch (sstype) {
			case "SendMail":
				/*emailNotifyLib.sendEmail(path, $.net.http.POST, body, sessionID, routeID);*/
				break;
			case "SendSMS":
				/*path = "/v2/sms";
				var resp = smsGlobalLib.createRequest(path, $.net.http.POST, body, sessionID, routeID);
				smsGlobalLib.getResponse(resp);*/
				break;
			default:
				break;
		}
		break;
	case 'Delete':
		cmnLib.createRequest(path, $.net.http.DEL, body, sessionID, routeID);
		break;
	default:
		$.trace.warning("B1SLProxy: No valid aCmd parameter found: " + aCmd);
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"Unknown command": aCmd
		}));
		break;
}