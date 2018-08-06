sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.EmailTemplateSAL", {
		fetchEmailTemplateName: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_TEMPLATES" + "&filter=" + filter + "&sessionID=" + context.SessionData
				.sessionID + "&routeID=" + context.SessionData.routeID;
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
			return deferred.promise(jModel);
		},
		fetchTemplatesDetail: function(that, choice) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_TEMPLATE_TYPES" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + choice;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body, "EmailTemplatesTypes");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise(jModel);
		},
		updateTemplateEmail: function(jModel, code) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Update" + "&actionUri=U_SS_TEMPLATES" + "(" + code + ")" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'PATCH',
				url: URL,
				data: jModel.getJSON(),
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
		createTemplateEmail: function(jModel, filter) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add" + "&actionUri=U_SS_TEMPLATES" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'POST',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function(response) {
					getThis.getView().setModel(response.body, "mTemplates");
					deferred.resolve(0);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		sentMail: function(jModel) {
			var deferred = $.Deferred();
			var URL = "/stryxsports/client/services/SendEmail.xsjs";
			$.ajax({
				type: 'POST',
				data: jModel.getJSON(),
				url: URL,
				crossDomain: true,
				success: function(response) {
					deferred.resolve(response);
				},
				error: function(xhr, status, error) {
					deferred.resolve(error);
				}
			});
			return deferred.promise();

		}

	});
});