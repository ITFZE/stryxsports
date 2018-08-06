sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL",
	'sap/ui/model/json/JSONModel'
], function(CreateAssessmentsSAL,JSONModel) {
	"use strict";

	return CreateAssessmentsSAL.extend("com.ss.app.StryxSports.controller.details.CreateAssessmentsDetail", {
		onInit: function() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.jsonObj = new sap.ui.model.json.JSONModel();
		},

		onPressSearchLeads: function() {
			var that = this;
			var addFilter, addFilterType = null;

			var getSearchLeads = this.getVariables();
			if (getSearchLeads.searchLeadName.getValue() !== ""  || getSearchLeads.searchLeadEmail.getValue() !== "" || getSearchLeads.searchLeadDOB
				.getValue() !== "" || getSearchLeads.searchLeadMobile.getValue() !== "") {

				if (getSearchLeads.searchLeadName.getValue().length > 0){
					addFilterType = "CardName";
					addFilter = getSearchLeads.searchLeadName.getValue();
				} else if (getSearchLeads.searchLeadEmail.getValue().length > 0) {
					addFilterType = "EmailAddress";
					addFilter = getSearchLeads.searchLeadEmail.getValue();
				} else if (getSearchLeads.searchLeadDOB.getValue().length > 0) {
					addFilter = getSearchLeads.searchLeadDOB.getValue();

				} else if (getSearchLeads.searchLeadMobile.getValue().length > 0) {
					addFilter = getSearchLeads.searchLeadMobile.getValue();
					addFilterType = "Cellular";
				}

				that.showLoading(true);
				var createAssessmentsSAL = new CreateAssessmentsSAL();
				var tFilterCardType = "$filter=CardType%20eq%20%27cLid%27%20and%20contains(" + addFilterType + ",%27" + addFilter +
					"%27)&$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress";
				createAssessmentsSAL.fetchBusinessPartners(that, tFilterCardType).done(function(obj) {
					sap.ui.getCore().setModel(obj, "AssessmentList");
					that.showLoading(false);
					that.getView().byId("tableAssessmentBlockLayoutRow").setVisible(true);
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "DashBoard");
				});
 			} else {

			}

			// 			
		},
		handleEditDetailAssessmentPress: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("AssessmentList");
			var objLeads = oCtx.getObject();
			this.jsonObj.setData(objLeads);
			var getSelectedLeads = sap.ui.getCore().setModel(this.jsonObj, "SelectedLeads");
			
			this.getOwnerComponent().getRouter()
				.navTo("CreateAssessmentsDetail", {
					Obj:JSON.stringify(getSelectedLeads)
				}, false);
		},
		getVariables: function() {
			var getSearchLeads = {
				searchLeadName: this.getView().byId("sLeadName"),
				searchLeadEmail: this.getView().byId("sLeadEmail"),
				searchLeadDOB: this.getView().byId("sLeadDOB"),
				searchLeadMobile: this.getView().byId("sLeadMobile")
			};
			return getSearchLeads;
		}
	});

});