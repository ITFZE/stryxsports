sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
		"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.CoachAssessmentScoreSAL", {

		fetchAssessmentScore: function(that, filter) {
			var deferred = $.Deferred();
			var setThis = this;
			var context = setThis.getContext();
			var jModel = new JSONModel();
			jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_ASSESSMENT_SCORE" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
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
		fetchAssessments: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_ASSESSMENT" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
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
		fetchAssessmentById: function(jMdl, getID) {
			var deferred = $.Deferred();
			var setThis = this;
			var context = setThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_ASSESSMENT" + "(" + getID + ")" + "&sessionID=" +
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
		createFeedbackScore: function(jModel) {
			var deferred = $.Deferred();
			var setThis = this;
			var context = setThis.getContext();
			var URL = context.baseURL + "?cmd=Add" + "&actionUri=U_SS_ASSESS_FEEDBACK" + "&sessionID=" + context.SessionData
				.sessionID +
				"&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
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
		},
		upDateFeedbackScore: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var feesbackID = jModel.getProperty('/Code');
			var URL = context.baseURL + "?cmd=Update" + "&actionUri=U_SS_ASSESS_FEEDBACK" + "(" + feesbackID + ")" + "&sessionID=" +
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