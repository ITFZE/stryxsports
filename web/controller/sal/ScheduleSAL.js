sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.ScheduleSAL", {
	    CreateTmCal: function(oData){
            var that = this;
            var deferred = $.Deferred();
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_TEAM_CALENDAR" + "&actionUri=U_SS_TEAM_CALENDAR" + "&sessionID=" + context.SessionData.sessionID + "&routeID=" +
				context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: JSON.stringify(oData),
				crossDomain: true,
				success: function(response) {
					deferred.resolve(response);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
	    },
	    getMoment: function() {
			var deferred = $.Deferred();
			var that = this;
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Get&sstype=U_SS_Moment&actionUri=" + "&sessionID=" + context.SessionData.sessionID + "&routeID=" +
				context.SessionData.routeID;
			$.ajax({
				type: 'GET',
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
		},
		getLater: function() {
			var deferred = $.Deferred();
			var that = this;
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Get&sstype=U_SS_Later&actionUri=" + "&sessionID=" + context.SessionData.sessionID + "&routeID=" +
				context.SessionData.routeID;
			$.ajax({
				type: 'GET',
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