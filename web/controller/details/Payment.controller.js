sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL",
		"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(CreateAssessmentsSAL, MessageToast, MessageBox) {
	"use strict";
	return CreateAssessmentsSAL.extend("com.ss.app.StryxSports.controller.details.Payment", {
		onInit: function() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		     	var oRouter = this.getRouter();
				oRouter.getRoute("Payment").attachMatched(this._onRouteMatched, this);

		},
		_onRouteMatched: function() {
		    

		},
		getSelectedItem: function() {
			var getItem = this.getView().byId("PTSegmentedButton").getSelectedKey();

			switch (getItem) {
				case "1":
					this.getView().byId("card").setVisible(true);
					this.getView().byId("Bank").setVisible(false);
					this.getView().byId("Cash").setVisible(false);
					break;
				case "2":
					this.getView().byId("card").setVisible(false);
					this.getView().byId("Bank").setVisible(true);
					this.getView().byId("Cash").setVisible(false);

					break;
				case "3":
					this.getView().byId("card").setVisible(false);
					this.getView().byId("Bank").setVisible(false);
					this.getView().byId("Cash").setVisible(true);
					break;
				default:
					this.getView().byId("card").setVisible(false);
					this.getView().byId("Bank").setVisible(false);
					this.getView().byId("Cash").setVisible(false);
			}

		},
		onBack: function() {
			this.getOwnerComponent().getRouter().navTo("CrInvoices");
		}
	});
});