sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.CreateInvoiceSAL", {
		fetchOrderById: function(jMdl, getID) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=Orders" + "(" + getID + ")" +
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
		fetchInvoiceById: function(jMdl, getID) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=Invoices" + "(" + getID + ")" +
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
		createInvoice: function(jModel, filter) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_MEMBER&memType=Invoices" + "&actionUri=Invoices" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'POST',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function(response) {
					var respJson = response.body;
					deferred.resolve(respJson);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchInvoiceStatusByID: function(filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jMdl = new JSONModel();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_MEM_SERVICES" +
				"&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
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
		fetchInvoices: function(filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jMdl = new JSONModel();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=$crossjoin(U_SS_MEM_SERVICES,Orders)" +
				"&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
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
		fetchAccountDetails: function(getID) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=BusinessPartners" + "('" + getID + "')" +
				"&sessionID=" + context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
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
		}

	});

});