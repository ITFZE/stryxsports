sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.PaymentSAL", {
		fetchLeadDetails: function(getID) {
			var deferred = $.Deferred();
			var getThis = this;
			var newJMDL = new JSONModel();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=GetById&sstype=U_SS_MEMBER" + "&actionUri=BusinessPartners" + "('" + getID + "')" +
				"&sessionID=" + context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
				    newJMDL.setData(response.body);
					deferred.resolve(newJMDL);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchCreateInvoiceDetails: function(getID, filter) {
			var newJMDL = new JSONModel();
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get&actionUri=Invoices" + "(" + getID + ")" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					newJMDL.setData(response.body);
					deferred.resolve(newJMDL);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();

		},
		fetchPayTypes: function(filter) {
			var newJMDL = new JSONModel();
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get&actionUri=ChartOfAccounts&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					newJMDL.setData(response.body);
					deferred.resolve(newJMDL);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();

		},
/*		makePayment: function(getData) {
			var newJMDL = new JSONModel();
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_MEMBER&memType=Payment&actionUri=IncomingPayments&sessionID=" + context.SessionData
				.sessionID +
				"&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: getData.getJSON(),
				crossDomain: true,
				success: function(response) {
					newJMDL.setData(response.body);
					deferred.resolve(newJMDL);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();

		},*/
		makePayment: function(getData) {
			var newJMDL = new JSONModel();
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_MEMBER&memType=Payment&actionUri=IncomingPayments&sessionID=" + context.SessionData
				.sessionID +
				"&filter=''" + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: JSON.stringify(getData),
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
		fetchCreditCardTypes: function(filter) {
			var newJMDL = new JSONModel();
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get&actionUri=CreditCards&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					newJMDL.setData(response.body);
					deferred.resolve(newJMDL);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();

		},
		fetchBalanceAmount: function(obj) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Action&actionUri=PaymentCalculationService_GetPaymentAmount&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: JSON.stringify(obj),
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