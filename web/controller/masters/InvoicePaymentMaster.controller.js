sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/Filter"
], function(BaseController, Filter) {
	"use strict";
	var getTitleDialog = null;
	return BaseController.extend("com.ss.app.StryxSports.controller.masters.InvoicePaymentMaster", {
		onInit: function() {

		},
		onListItemPressPaymentList: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext();
			this.getOwnerComponent().getRouter()
				.navTo("InvoicePaymentDetail", {
					membershipID: oCtx.getProperty("membershipID")
				});
		},
		////Here View for filter open
		onPressInvoiceFilter: function() {
			if (!this._DialogAddMembershipFilter) {
				this._DialogAddMembershipFilter = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fInvoice",
					this);
				this._DialogAddMembershipFilter.setModel(this.getView().getModel());
			}
			this._DialogAddMembershipFilter.open();
		},
		onPressSelectedInvoiceFilter: function() {
			var searchFieldCoachesMasterPage = this.getVariables();
			searchFieldCoachesMasterPage.searchField.setPlaceholder("Please Enter " + getTitleDialog);
			this._DialogAddMembershipFilter.close();
		},
		onSearchDialogsCloseInvoice: function() {
			this._DialogAddMembershipFilter.close();
		},
		//Start a function for filter the data for Coach assessment///
		searchInvoicePayment: function(oEvt) {
			var aFilters = [];
			var filter;
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				switch (getTitleDialog) {
					case "Location":
						filter = new Filter("Location", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Activity":
						filter = new Filter("Activity", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Gendar":
						filter = new Filter("Gender", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Father Email":
						filter = new Filter("FatherEmail", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Father Occupation":
						filter = new Filter("FatherOccuption", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					default:
						filter = new Filter("Location", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
				}
				aFilters.push(filter);
			}
			var list = this.getView().byId("InvoiceMasterList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		getViewonInvoice: function(oEvent) {
			var items = oEvent.getParameter("listItem");
			getTitleDialog = items.getTitle();
		},
		handdleInvoiceRefresh: function() {
			setTimeout(jQuery.proxy(function() {
				this.getView().byId("pullPaymentRefresh").hide();
				var oList = this.getView().byId("InvoiceMasterList");
				var oSearchField = this.getView().byId("searchInvoicePayment");
				var sQuery = oSearchField.getValue();
				var aFilters = [];
				if (sQuery && sQuery.length) {
					aFilters.push(new Filter("Location", sap.ui.model.FilterOperator.Contains, sQuery));
				}
				oList.getBinding("items").filter(aFilters);
			}, this), 1000);
		},
		getVariables: function() {
			var CoachAssessmentMaster = {
				sportsMasterList: this.getView().byId("InvoiceMasterList"),
				searchField: this.getView().byId("searchInvoicePayment")
			};
			return CoachAssessmentMaster;
		}
	});
});