sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.AssessmentSAL", {
		fetchEmployeePosition: function(getFilter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();

			var URL = context.baseURL + "?cmd=Get" + "&actionUri=EmployeePosition" + "&filter=" + getFilter + "&sessionID=" + context.SessionData
				.sessionID +
				"&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					var getPositionID = response.body.value[0].PositionID;
					//	getThis.fetchEmployeesPositionInfo(getPositionID);
					deferred.resolve(getPositionID);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchEmployeesPositionInfo: function(getPositionID) {
			var deferred = $.Deferred();
			var getThis = this;
			var setModel = new JSONModel();
			var setFilter = "$filter=Position%20eq%20" + getPositionID + "%20";
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=EmployeesInfo" + "&filter=" + setFilter + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					setModel.setData(response.body, "CoachsMaster");
					deferred.resolve(setModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchEmployeesInfo: function(getEmployeesID) {
			var deferred = $.Deferred();
			var getThis = this;
			var setModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=EmployeesInfo" + "(" + getEmployeesID +")"+ "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					setModel.setData(response.body, "CoachDetail");
					deferred.resolve(setModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		}
	});
});