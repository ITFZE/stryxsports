sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.SportsSAL", {
		fetchSports: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			//jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_SPORTS" + "&sessionID=" + context.SessionData.sessionID +
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
					jModel.setData(response.body);
					//sap.ui.getCore().setModel(jModel, "SportsList");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					//console.log("Error :" + error);
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		getNewSports: function(query) {
			var deferred = $.Deferred();
			var getThis = this;
			var jsonModel = new JSONModel();
			var context = getThis.getContext();
			var pageing = "$top=" + query;
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_SPORTS" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + pageing;
			URL = encodeURI(URL);
			$.ajax({
				type: 'GET',
				url: URL,
				headers: {
					'Prefer': 'odata.maxpagesize=1000'
				},
				crossDomain: true,
				success: function(response) {
					jsonModel.setData(response.body);
					deferred.resolve(jsonModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchSportsById: function(jMdl, sportId) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=GetById" + "&actionUri=U_SS_SPORTS" + "(" + sportId + ")" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			//var aData = jModel.getProperty("/sports_Data");
			//aData = [];
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jMdl.setData(response.body);
					//getThis.getView().setModel(jModel, "SportsModel");
					deferred.resolve(jMdl);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		updateSports: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			//var jModel = getThis.getView().getModel("SportsModel");
			var sportId = jModel.getProperty('/Code');
			var URL = context.baseURL + "?cmd=Update" + "&actionUri=U_SS_SPORTS" + "(" + sportId + ")" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			//var aData = jModel.getProperty("/sports_Data");
			//aData = [];
			$.ajax({
				type: 'PATCH',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function() {
					//getThis.MessageToastShow("Update Successfull");
					//getThis.fetchSports(getThis);
					var jm = new JSONModel();
					getThis.getView().setModel(jm, "SportsModel");
					deferred.resolve(0);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		createSports: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			//var jModel = getThis.getView().getModel("SportsModel");
			var URL = context.baseURL + "?cmd=Add" + "&actionUri=U_SS_SPORTS" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			//var aData = jModel.getProperty("/sports_Data");
			//aData = [];
			$.ajax({
				type: 'POST',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function() {
					//getThis.MessageToastShow("Update Successfull");
					//getThis.fetchSports(getThis);
					var jm = new JSONModel();
					getThis.getView().setModel(jm, "SportsModel");
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