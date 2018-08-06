sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.SearchActivitySAL", {
	   		fetchHandledByEmployee: function(filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=$crossjoin(EmployeesInfo,Activities)" +
			"&sessionID=" + context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID  + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					deferred.resolve(response.body);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchActivities: function(filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get&sstype=FetchActivities" + "&actionUri=$crossjoin(BusinessPartners,Activities)" +
			"&sessionID=" + context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID  + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
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