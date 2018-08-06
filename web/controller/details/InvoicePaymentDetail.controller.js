sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController"
], function(BaseController) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.details.InvoicePaymentDetail", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("InvoicePaymentDetail").attachMatched(this._onRouteMatched, this);
			this.getView().bindElement("/membership/0");
		},
		_onRouteMatched: function(oEvent) {
			var oArgs;
			oArgs = oEvent.getParameter("arguments").membershipID;
			this.getView().bindElement("/membership/" + oArgs);
		}
	});
});