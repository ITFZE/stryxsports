sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.SeasonSAL", {
		fetchSeason: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_SEASONS" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body, "SeasonMaster");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchSeasonById: function(jMdl, getSeasonID) {
			var deferred = $.Deferred();
			var getThis = this;
			var jModel = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_SEASONS" + "(" + getSeasonID + ")" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
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
		updateSeason: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var sportId = jModel.getProperty('/Code');
			var URL = context.baseURL + "?cmd=Update" + "&actionUri=U_SS_SEASONS" + "(" + sportId + ")" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'PATCH',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function() {
					getThis.fetchSeason(getThis);
					var jm = new JSONModel();
					getThis.getView().setModel(jm, "SeasonEdit");
					getThis.getView().setModel(jm, "createSeasonModel");
					deferred.resolve(0);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		createSeason: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add" + "&actionUri=U_SS_SEASONS" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function() {
					var jm = new JSONModel();
					getThis.getView().setModel(jm, "createSeasonModel");
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