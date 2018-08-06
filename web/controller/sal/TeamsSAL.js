sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.TeamsSAL", {
		fetchTeams: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			//jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_TEAMS" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			//var aData = jModel.getProperty("/teams_Data");
			//aData = [];
			$.ajax({
				type: 'GET',
				url: URL,
				headers: {
					'Prefer': 'odata.maxpagesize=1000'
				},
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body, "TeamsList");
					//sap.ui.getCore().setModel(jModel, "TeamsList");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					//console.log("Error :" + error);
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},

		fetchTeamsById: function(jMdl, teamID) {
			var deferred = $.Deferred();
			var getThis = this;
			var jModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=GetById&sstype=U_SS_TEAMS" + "&actionUri=U_SS_TEAMS" + "(" + teamID + ")" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body);
					//getThis.getView().setModel(jModel, "TeamsModel");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchMember: function(filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			jModel.setSizeLimit(100);
			var setURL = encodeURI(
				"$crossjoin(U_SS_MEM_SERVICES,U_SS_SERVICE_ITEM,BusinessPartners)");
			var setCrossJoin = encodeURI(
				"$expand=BusinessPartners($select=CardCode,CardName,Cellular,U_Dob,EmailAddress)||$apply=groupby((BusinessPartners/CardCode,BusinessPartners/CardName,BusinessPartners/U_Dob,BusinessPartners/Cellular,BusinessPartners/EmailAddress))||$filter=U_SS_MEM_SERVICES/Code eq U_SS_SERVICE_ITEM/U_MemSerCode and BusinessPartners/CardCode eq U_SS_MEM_SERVICES/U_CardCode and U_SS_SERVICE_ITEM/U_TeamID eq '" +
				filter + "'");
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=" + setURL + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + setCrossJoin;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body);
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		updateTeams: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			//var jModel = getThis.getView().getModel("TeamsModel");
			var teamId = jModel.getProperty('/Code');
			var URL = context.baseURL + "?cmd=UpdateById&sstype=U_SS_TEAMS" + "&actionUri=U_SS_TEAMS" + "(" + teamId + ")" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			//var aData = jModel.getProperty("/teams_Data");
			//aData = [];
			$.ajax({
				type: 'PATCH',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function() {
					//getThis.MessageToastShow("Update Successfull");
					//getThis.fetchTeams(getThis);
					var jm = new JSONModel();
					getThis.getView().setModel(jm, "createTeamModel");
					deferred.resolve(0);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		/*createTeamCoaches: function(jModel,resp){
		    var ret = JSON.parse(response);
				    var code = ret.Code;
				    var objCoach = tmModel.getProperty('/');
				    for(var i=0;i < objCoach.Coaches.length;i++){
				        var CURL = context.baseURL + "?cmd=Add&sstype=U_SS_TEAMS" + "&actionUri=U_SS_TEAMS_COACHES" + "&sessionID=" + 
				        context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
				        var tmpTMCoach = {
                			Code: 0,
                			Name: "",
                			U_TeamCode: "",
                			U_CoachCode: ""
                		};
                		tmpTMCoach.Name = ret.Name + "-" + objCoach.Coaches[i].FirstName;
                		tmpTMCoach.U_TeamCode = ret.Code.toString();
                		tmpTMCoach.U_CoachCode = objCoach.Coaches[i].EmployeeID.toString();
				        $.ajax({
        				type: 'POST',
        				url: CURL,
        				data: tmpTMCoach,
        				crossDomain: true,
        				success: function(resp) {
        				    var val = resp;
        				},
        				error: function(err){
        				    var e = error;
        				}
				        });
				    }
		},*/
		createTeams: function(jModel) {
			var deferred = $.Deferred();
			var getThis = this;
			var tmModel = jModel;
			var context = getThis.getContext();
			var tmp = this.getNewModel(tmModel);
			var obj = tmp.getProperty('/');
			delete obj.Coaches;
			//	tmp.setData(tmpObj);
			//var jModel = getThis.getView().getModel("TeamsModel");
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_TEAMS" + "&actionUri=U_SS_TEAMS" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			//var aData = jModel.getProperty("/teams_Data");
			//aData = [];
			$.ajax({
				type: 'POST',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function() {
					var jm = new JSONModel();
					//var md = getThis.fetchTeams(getThis);
					getThis.getView().setModel(jm, "createTeamModel");
					deferred.resolve(0);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		sendNotificationEmail: function() {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=NotifyEmail&sstype=SendMail" + "&sessionID=" + context.SessionData.sessionID + "&routeID=" +
				context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				crossDomain: true,
				success: function(response) {
					deferred.resolve(response);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		}
	});
});