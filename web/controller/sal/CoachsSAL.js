sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.CoachsSAL", {
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
			var URL = context.baseURL + "?cmd=GetById&sstype=U_SS_COACH" + "&actionUri=EmployeesInfo" + "(" + getEmployeesID + ")" + "&sessionID=" +
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
		},
		fetchEmployeeIdByFName: function(filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var setModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=EmployeesInfo" + "&filter=" + filter + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					setModel.setData(response.body, "mEmployeeInfo");
					deferred.resolve(setModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchEmployeesInfos: function(filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var setModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=EmployeesInfo" + "&filter=" + filter + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					setModel.setData(response.body);
					deferred.resolve(setModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchCoachSport: function(empId){
		    var deferred = $.Deferred();
			var getThis = this;
			var setModel = new JSONModel();
			var context = getThis.getContext();
			var filter = encodeURI("$filter=U_EmployeeCode eq '" + empId + "'");
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_COACHES_SPORTS" + "&filter=" + filter + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					setModel.setData(response.body);
					deferred.resolve(setModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		updataSportCategoryDetails: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var getPositionID = jModel.getProperty('/EmployeeID');
		    var URL = context.baseURL + "?cmd=UpdateById&sstype=U_SS_COACH" + "&actionUri=EmployeesInfo" + "(" + getPositionID + ")" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'PATCH',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function() {
					deferred.resolve(0);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		}
	});
});