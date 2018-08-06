sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.AssessmentFeedbackSAL", {
		fetchAssessmentFeedbacks: function(getFilter) {
			var deferred = $.Deferred();
			var getThis = this;
			var jModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_ASSESS_FEEDBACK" + "&filter=" + getFilter + "&sessionID=" + context.SessionData
				.sessionID +
				"&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body, "AssessmentFeedbacksList");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchAssessmentFeedbackById: function(getFilter) {
			var deferred = $.Deferred();
			var getThis = this;
			var jModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=$crossjoin(U_SS_ASSESSMENT,U_SS_ASSESS_FEEDBACK)" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + getFilter;
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
		}

	});
});