sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL"
], function(CreateAssessmentsSAL) {
	"use strict";
	var getTitleDialog = null;

	return CreateAssessmentsSAL.extend("com.ss.app.StryxSports.controller.masters.CreateAssessmentsMaster", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("CreateAssessmentsDetail").attachMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function() {},

		// START FILTER LOGIC
		handleFilterPress: function() {
			if (!this._DialogSearchLeads) {
				this._DialogSearchLeads = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fCreateAssessments",
					this);
				this._DialogSearchLeads.setModel(this.getView().getModel());
			}
			this._DialogSearchLeads.open();
		},

		onPressFilterCreateAssessmentConfirm: function() {
			var searchSeasonsMaster = this.getVariables();
			searchSeasonsMaster.searchField.setPlaceholder("Please Enter " + getTitleDialog);
			this._DialogSearchLeads.close();
		},

		onPressFilterCreateAssessmentClose: function() {
			this._DialogSearchLeads.close();
		},
		getViewonSelectEvent: function(oEvent) {
			var items = oEvent.getParameter("listItem");
			getTitleDialog = items.getTitle();
		},

		getVariables: function() {
			var assessmentsMaster = {
				seasonsMasterList: this.getView().byId("assessmentList"),
				searchField: this.getView().byId("assessmentsSearchField")
			};
			return assessmentsMaster;
		},
			handleCancelCreateAssementPress: function() {
			this.getRouter().navTo("SearchLeads");
		},
		onBeforeRendering: function() {
// 			var setThis = this;
// 			if (sap.ui.getCore().getModel("assessmentList") === null || sap.ui.getCore().getModel("assessmentList") === undefined) {
// 				this.showLoading(true);
// 				var createassessmentsSAL = new CreateAssessmentsSAL();
// 				var jModel;
// 				var filt = "$orderby=Code%20desc";
// 				createassessmentsSAL.fetchcreateassessment(this, filt).done(function(obj) {
// 					jModel = obj;
// 					sap.ui.getCore().setModel(jModel, "assessmentList");
// 					sap.ui.getCore().getModel("assessmentList").refresh(true);
// 					setThis.showLoading(false);
// 				}).fail(function(err) {
// 					setThis.showLoading(false);
// 					setThis.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "DashBoard");
// 				});
// 			}
		}
		// END FILTER LOGIC

	});
});