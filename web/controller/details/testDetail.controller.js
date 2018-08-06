sap.ui.define([
		"com/ss/app/StryxSports/controller/BaseController",
		"com/ss/app/StryxSports/ckeditor",
		"com/ss/app/StryxSports/config",
		 "com/ss/app/StryxSports/controller/sal/CreateMembershipSAL",
		 	"sap/ui/model/json/JSONModel"
], function(BaseController, ckeditor, config, CreateMembershipSAL, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.details.testDetail", {

		onInit: function() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		_onRouteMatched: function() {

		},
		onPressParentExistingTable: function() {
			if (!this._dialogParentExistingTable) {
				this._dialogParentExistingTable = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.addParentExistingTable", this);
				this._dialogParentExistingTable.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._dialogParentExistingTable.setModel(this.getView().getModel());

			}
			var obj = new JSONModel();

			sap.ui.getCore().setModel(obj, "AssessmentList");
			this._dialogParentExistingTable.open();
		},
		onPressSearchParents: function() {

			var that = this;
			var addFilter, addFilterType = null;
			var criteria = "";
			var getSearchLeads = this.getVariables();
			if (getSearchLeads.searchLeadName.getValue() !== "" || getSearchLeads.searchLeadEmail.getValue() !== "" || getSearchLeads.searchLeadDOB
				.getValue() !== "" || getSearchLeads.searchLeadMobile.getValue() !== "") {

				if (getSearchLeads.searchLeadName.getValue().length > 0) {
					addFilterType = "CardName";
					addFilter = getSearchLeads.searchLeadName.getValue();
			
					var titleStr = this.titleCase(addFilter);
					criteria += "contains(CardName,'" + titleStr + "')";
				}
				if (getSearchLeads.searchLeadEmail.getValue().length > 0) {
					addFilterType = "EmailAddress";
					addFilter = getSearchLeads.searchLeadEmail.getValue();
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(EmailAddress,'" + getSearchLeads.searchLeadEmail.getValue() + "')";
				}
				if (getSearchLeads.searchLeadDOB.getValue().length > 0) {
					addFilter = getSearchLeads.searchLeadDOB.getValue();
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(U_Dob,'" + getSearchLeads.searchLeadDOB.getValue() + "')";
				}
				if (getSearchLeads.searchLeadMobile.getValue().length > 0) {
					addFilter = getSearchLeads.searchLeadMobile.getValue();
					addFilterType = "Cellular";
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(Cellular,'" + getSearchLeads.searchLeadMobile.getValue() + "')";
				}
			}
			if (getSearchLeads.searchLeadMobile.getValue().length > 0 || getSearchLeads.searchLeadName.getValue().length > 0 || getSearchLeads.searchLeadEmail
				.getValue().length > 0 || getSearchLeads.searchLeadDOB.getValue().length > 0) {
				that.getView().setBusy(true);
				var createMembershipSAL = new CreateMembershipSAL();
				var tFilterCardType = encodeURI("$filter=CardType eq 'cCustomer' and GroupCode eq 103 and " + criteria +
					"&$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress");
				createMembershipSAL.fetchBusinessPartners(that, tFilterCardType).done(function(obj) {
					sap.ui.getCore().setModel(obj, "AssessmentList");
					that.getView().setBusy(false);
				}).fail(function(err) {
					that.getView().setBusy(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			} else {

			}
		},
		getVariables: function() {
			var getSearchLeads = {
				searchLeadName: sap.ui.getCore().byId("pLeadName"),
				searchLeadEmail: sap.ui.getCore().byId("pLeadEmail"),
				searchLeadDOB: sap.ui.getCore().byId("pLeadDOB"),
				searchLeadMobile: sap.ui.getCore().byId("pLeadMobile")
			};
			return getSearchLeads;
		},
	
		// 		onBeforeRendering: function() {

		// 		},
		// 		onAfterRendering: function() {
		// 			var config1 = {
		// 				placeholder_select: {
		// 					placeholders: ['test', 'ttt', 'ttt'],
		// 					format: '[[%placeholder%]]'
		// 				},
		// 				extraPlugins: 'richcombo,placeholder_select',
		// 				removePlugins: 'forms'
		// 			};
		// 			var txt = this.getView().byId("emailTemp");
		// 			CKEDITOR.replace(txt.sId,config1);
		// 			window.placeHolder = "new value";
		// 		}

	});
});