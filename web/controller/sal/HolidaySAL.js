sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.HolidaySAL", {
		fetchHolidayList: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_HOLIDAY_LIST" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
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
		fetchHoliday: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_HOLIDAYS" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
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
		createHolidayList: function(hlModel) {
			var that = this;
			var deferred = $.Deferred();
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Add" + "&actionUri=U_SS_HOLIDAY_LIST" + "&sessionID=" + context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: hlModel.getJSON(),
				crossDomain: true,
				success: function(response) {
					deferred.resolve(response.body);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchHolidayById: function(jMdl, holidayID) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=GetById" + "&actionUri=U_SS_HOLIDAY_LIST" + "(" + holidayID + ")" + "&sessionID=" +
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
		updataHolidayDetails: function(jModel) {
			var that = this;
			var deferred = $.Deferred();
			var context = that.getContext();
			var holidayListByID = jModel.getProperty('/Code');
			var URL = context.baseURL + "?cmd=Update" + "&actionUri=U_SS_HOLIDAY_LIST" + "(" + holidayListByID + ")" + "&sessionID=" + context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;

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
		createHolidays: function(hMd){
		    var that = this;
			var deferred = $.Deferred();
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Add" + "&actionUri=U_SS_HOLIDAYS" + "&sessionID=" + context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: hMd.getJSON(),
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
		// Fetch holidays based on holidaylistID
		fetchHolidays: function(filter){
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_HOLIDAYS" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					deferred.resolve(response.body);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		deleteHolidays: function(id){
		    var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Delete" + "&actionUri=U_SS_HOLIDAYS(" + id + ")&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				success: function(response) {
					deferred.resolve(response);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		updateHolidays: function(jMdel){
		   	var that = this;
			var deferred = $.Deferred();
			var context = that.getContext();
			var code = jMdel.getProperty('/Code');
			var URL = context.baseURL + "?cmd=Update" + "&actionUri=U_SS_HOLIDAYS" + "(" + code + ")" + "&sessionID=" + context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'PATCH',
				url: URL,
				data: jMdel.getJSON(),
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
// 		fetchEditedHolidays: function(JMdel) {
// 		    var deferred = $.Deferred();
// 			var that = this;
// 			var jMdl = new JSONModel();
// 			var context = that.getContext();
// 			var getCode = JMdel.getProperty('/Code');
// 			var URL = context.baseURL + "?cmd=GetById" + "&actionUri=U_SS_HOLIDAYS" + "(" + getCode + ")" + "&sessionID=" +
// 				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
// 			$.ajax({
// 				type: 'GET',
// 				url: URL,
// 				crossDomain: true,
// 				success: function(response) {
// 					jMdl.setData(response.body);
// 					deferred.resolve(jMdl);
// 				},
// 				error: function(xhr, status, error) {
// 					deferred.reject(error);
// 				}
// 			});
// 			return deferred.promise();
// 		},
		fetchHolidayListById: function(getId) {
			var deferred = $.Deferred();
			var that = this;
			var jMdl = new JSONModel();
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=GetById" + "&actionUri=U_SS_HOLIDAY_LIST" + "(" + getId + ")" + "&sessionID=" +
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
		}
	});
});