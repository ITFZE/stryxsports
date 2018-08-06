sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/Filter"
], function(BaseController, Filter) {
	"use strict";
	var getTitleDialog = null;
	return BaseController.extend("com.ss.app.StryxSports.controller.masters.MembershipMaster", {
		onInit: function() {
		},
		onListItemPressMembershipList: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext();
			this.getOwnerComponent().getRouter()
				.navTo("EditMembership", {
					membershipID: oCtx.getProperty("membershipID")
				});
		},
		////Here View for filter open
		onPressAddCoachMembershipFilter: function() {
			if (!this._DialogAddMembershipFilter) {
				this._DialogAddMembershipFilter = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.filterMembership",
					this);
				this._DialogAddMembershipFilter.setModel(this.getView().getModel());
			}
			this._DialogAddMembershipFilter.open();
		},
		onPressSelectedMembershipFilter: function() {
			var searchFieldCoachesMasterPage = this.getVariables();
			searchFieldCoachesMasterPage.searchField.setPlaceholder("Please Enter " + getTitleDialog);
			this._DialogAddMembershipFilter.close();
		},
		onSearchDialogsCloseMembership: function() {
			this._DialogAddMembershipFilter.close();
		},
		//Start a function for filter the data for Coach assessment///
		onSearchCoachesMembershipMasterPage: function(oEvt) {
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
					case "DOB":
						filter = new Filter("DOB", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Gendar":
						filter = new Filter("Gender", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Father Mobile":
						filter = new Filter("FatherMobile", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
						break;
					case "Father Email":
						filter = new Filter("FatherEmail", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
						break;
					case "Mother Mobile":
						filter = new Filter("MotherMobile", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
						break;
					case "Mother Email":
						filter = new Filter("MotherEmail", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
						break;
					case "Nationality":
						filter = new Filter("nationalatiy", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
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
			var list = this.getView().byId("membershipListData");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		getViewonMembership: function(oEvent) {
			var items = oEvent.getParameter("listItem");
			getTitleDialog = items.getTitle();
		},
		handleMembershipRefresh: function() {
			setTimeout(jQuery.proxy(function() {
				this.getView().byId("pullMembershipRefresh").hide();
				var oList = this.getView().byId("membershipListData");
				var oSearchField = this.getView().byId("searchMembershipMaster");
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
				sportsMasterList: this.getView().byId("membershipListData"),
				searchField: this.getView().byId("searchMembershipMaster")
			};
			return CoachAssessmentMaster;
		}
	});
});