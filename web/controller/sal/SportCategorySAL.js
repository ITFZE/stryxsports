sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.SportCategorySAL", {
		fetchSportCategoryMasters: function(that,filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_CATEGORY" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body, "SportsCategoryMaster");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchSportCategoryByID: function(jMdl, sportsCategoryID) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_CAT_SPORTS" + "(" + sportsCategoryID + ")" +
				"&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID +"&filter=";
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
		fetchSportCategoryDetail: function(jMdl, sportsCategoryID) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=GetById&sstype=U_SS_CATEGORY" + "&actionUri=U_SS_CATEGORY" + "(" + sportsCategoryID + ")" +
				"&sessionID=" +
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
		updataSportCategoryDetails: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var sportsCategoryID = jModel.getProperty('/Code');
			var URL = context.baseURL + "?cmd=UpdateById&sstype=U_SS_CATEGORY" + "&actionUri=U_SS_CATEGORY" + "(" + sportsCategoryID + ")" +
				"&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;

			$.ajax({
				type: 'PATCH',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function() {
					var jm = new JSONModel();
					getThis.getView().setModel(jm, "SportsCategoryMaster");
					deferred.resolve(0);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		createSportCategory: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_CATEGORY" + "&actionUri=U_SS_CATEGORY" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function() {
					var jm = new JSONModel();
					getThis.fetchSportCategoryMasters(getThis);
					getThis.getView().setModel(jm, "createSportCategoryModel");
					deferred.resolve(0);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},

		// FETCH SPORTS BY CATEGORY USING U_SS_CAT_SPORTS
		fetchSportsByCat: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_CAT_SPORTS" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				headers: {
					'Prefer': 'odata.maxpagesize=1000'
				},
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body, "SubCategoryModel");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
				// 	console.log("In SAL, Error :" + error);
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		getSports: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_SPORTS" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				headers: {
					'Prefer': 'odata.maxpagesize=1000'
				},
				crossDomain: true,
				success: function(response) {
				    jModel.setData(response.body, "getSportsModel");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchTeamsName: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			//jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_TEAMS" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			//var aData = jModel.getProperty("/teams_Data");
			//aData = [];
			$.ajax({
				type: 'GET',
				url: URL,
				headers: {
					'Prefer': 'odata.maxpagesize=1000'
				},
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body, "TeamsList");
					//sap.ui.getCore().setModel(jModel, "TeamsList");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					//console.log("Error :" + error);
					deferred.reject(error);
				}
			});
			return deferred.promise();
		}
	});
});