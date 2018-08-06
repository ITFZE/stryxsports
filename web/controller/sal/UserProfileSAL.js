sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.UserProfileSAL", {
		fetchUserProfileById: function(jMdl, EmployeeId) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=EmployeesInfo" + "(" + EmployeeId + ")" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jMdl.setData(response.body);
					deferred.resolve(jMdl);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchUserMangementEmployeeMaster: function(jMdl) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var setModel = new JSONModel();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=EmployeesInfo" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					setModel.setData(response.body, "UserManagement");
					deferred.resolve(setModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchEmployeesInfoDetails: function(getEmployeesID) {
			var deferred = $.Deferred();
			var getThis = this;
			var setModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=EmployeesInfo" + "(" + getEmployeesID + ")" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					setModel.setData(response.body, "mUserProfile");
					deferred.resolve(setModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchUsers: function(filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var setModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=SS_LOGIN" + "&sessionID=" + context.SessionData.sessionID + "&routeID=" +
				context.SessionData.routeID + "&filter=" + filter;
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
		CreateUsers: function(jMd) {
			var deferred = $.Deferred();
			var getThis = this;
			var setModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add" + "&actionUri=SS_LOGIN" + "&sessionID=" + context.SessionData.sessionID + "&routeID=" +
				context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: jMd.getJSON(),
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
		UpdateUsers: function(jMd, code) {
			var deferred = $.Deferred();
			var getThis = this;
			var setModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Update" + "&actionUri=SS_LOGIN" + "('" + code + "')" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'PATCH',
				url: URL,
				data: jMd.getJSON(),
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