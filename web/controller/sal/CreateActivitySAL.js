sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.CreateActivitySAL", {
		createActivity: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_CreateActivity&actionUri=Activities" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function() {
					/*	var jm = new JSONModel();
					getThis.getView().setModel(jm, "createActivityModel");*/
					deferred.resolve(0);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchActivityTypes: function(filter) {
			var that = this;
			var jModel = new JSONModel();
			var deferred = $.Deferred();
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=ActivityTypes" + "&filter=" + filter + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID;
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
		fetchActivityLocations: function(filter) {
			var that = this;
			var jModel = new JSONModel();
			var deferred = $.Deferred();
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=ActivityLocations" + "&filter=" + filter + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID;
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
		fetchActivityId: function(getID, filter) {
			var that = this;
			var jModel = new JSONModel();
			var deferred = $.Deferred();
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=Activities(" + getID + ")" + "&filter=" + filter + "&sessionID=" + context.SessionData
				.sessionID +
				"&routeID=" + context.SessionData.routeID;
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
		updataActivityByID: function(jModel, getID) {
			var that = this;
			var deferred = $.Deferred();
			var jMdl = new JSONModel();
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Update" + "&actionUri=Activities(" + getID + ")" + "&filter= &sessionID=" + context.SessionData
				.sessionID +
				"&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'PATCH',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function(response) {
					jMdl.setData(response);
					deferred.resolve(jMdl);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		}
	});
});