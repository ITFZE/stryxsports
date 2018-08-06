sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.CreateAssessmentsSAL", {
		createAssessment: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add" + "&actionUri=U_SS_ASSESSMENT" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function() {
					var jm = new JSONModel();
					getThis.getView().setModel(jm, "CreateAssessments");
					deferred.resolve(0);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchBusinessPartners: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=BusinessPartners" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			//var aData = jModel.getProperty("/sports_Data");
			//aData = [];
			$.ajax({
				type: 'GET',
				url: URL,
				headers: {
					'Prefer': 'odata.maxpagesize=1000'
				},
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body, "AssessmentList");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchBusinessPartnersById: function(that, BPID) {
			var deferred = $.Deferred();
			var jMdl = new JSONModel();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=BusinessPartners" + "('" + BPID + "')" + "&sessionID=" +
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
		fetchCoachSchedule: function(filter) {
			var getThis = this;
			var deferred = $.Deferred();
			var setModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_ASSESSMENT" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					setModel.setData(response.body, "mCoachSchedules");
					deferred.resolve(setModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchCoachTeams: function(filter) {
			var getThis = this;
			var deferred = $.Deferred();
			var setModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_TEAMS_COACHES" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
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
		}

	});
});