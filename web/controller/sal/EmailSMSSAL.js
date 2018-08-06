sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.SendSMSSAL", {
		sendNotifyEmail: function(mailObj) {
			var deferred = $.Deferred();
			var baseCntrl = new BaseController();
			var context = baseCntrl.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=NotifyEmail&memType=SendMail" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: mailObj.getJSON(),
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
		sendSMS: function(oData) {
			var that = this;
			var deferred = $.Deferred();
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=NotifyEmail&sstype=SendSMS&sessionID=" + context.SessionData.sessionID + "&routeID=" +
				context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: JSON.stringify(oData),
				crossDomain: true,
				success: function(response) {
					deferred.resolve(response.body);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		}
	});
});