sap.ui.define([
"com/ss/app/StryxSports/controller/sal/AssessmentFeedbackSAL",
	"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter"
], function(AssessmentFeedbackSAL, JSONModel, Filter) {
	"use strict";
	var getTitleDialog = null;
	return AssessmentFeedbackSAL.extend("com.ss.app.StryxSports.controller.masters.AssessmentFeedbackMaster", {
		onInit: function() {
// 		    var oRouter = this.getRouter();
// 			oRouter.getRoute("AssessmentFeedback").attachMatched(this._onRouteMatched, this);
		},
		onBeforeRendering: function() {
			if (sap.ui.getCore().getModel("AssessmentFeedbacksList") === null || sap.ui.getCore().getModel("AssessmentFeedbacksList") ===
				undefined) {
				    	this.getView().setBusy(true);
				var filterFeedbacks = "$orderby=Code%20desc";
				this.fetchAssessmentFeedbackslist(filterFeedbacks);
			}
		},
		onListItemPressAssementList: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("AssessmentFeedbacksList");
			this.getOwnerComponent().getRouter()
				.navTo("AssessmentFeedbackDetail", {
					FeedbackID: oCtx.getProperty("Code")
				});
		},
		
		getVariables: function() {
			var CoachAssessmentMaster = {
				feedbackMasterList: this.getView().byId("listFeedbackAssessmentMaster"),
				searchField: this.getView().byId("searchFieldAssessmentFeedback")
			};
			return CoachAssessmentMaster;
		},

		// FILTER LOGIC
		onPressAssessmentFeedbackFilter: function() {
			if (!this._DialogFeedbackAssessment) {
				this._DialogFeedbackAssessment = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fAssessmentFeedback",
					this);
			}
			var getBaseModel = this.getView().getModel("BaseModel");
			this._DialogFeedbackAssessment.setModel(getBaseModel, "AssessmentFeedbackFilter");
			this._DialogFeedbackAssessment.open();
		},
		onPressSelectedAssessmentFilter: function() {
			var searchFieldAssessmentFeedback = this.getVariables();
			searchFieldAssessmentFeedback.searchField.setPlaceholder("Please Enter The " + getTitleDialog);
			this._DialogFeedbackAssessment.close();
		},
		onPressCloseFeedbackAssessmentFilter: function() {
			this._DialogFeedbackAssessment.close();
		},
		onNavBackFeedback : function () {
		    	var getDetailsVariables = this.getView().byId("searchFieldAssessmentFeedback");
		  		getDetailsVariables.setValue("");
		  		this.getOwnerComponent().getRouter().navTo("DashBoard");
		},
/*		onFeedbackliveChange : function(oEvt){
		    var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery.length === 0) {
				var oModel = this.getView().getModel("AssessmentFeedbacksList");
			} 
			else {
				this.onSearchAssessmentFeedback(oEvt);
			}
			var list = this.getView().byId("listFeedbackAssessmentMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},*/
		onSearchAssessmentFeedback: function(oEvt) {
			var aFilters = [];
			var filter;
			var oModel = this.getView().getModel("AssessmentFeedbacksList"); 
		//	console.log(oModel);
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				switch (getTitleDialog) {
				    case "Lead Name":
						filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
			       	case "Assessment Score":
						filter = new Filter("U_AssessmentScore", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Comments":
						filter = new Filter("U_Comments", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					default: filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
				}
				aFilters.push(filter);
			}
			var list = this.getView().byId("listFeedbackAssessmentMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
// 		onBeforeRendering: function() {
// 			if (sap.ui.getCore().getModel("AssessmentFeedbacksList") === null || sap.ui.getCore().getModel("AssessmentFeedbacksList") ===
// 				undefined) {
// 				    	this.getView().setBusy(true);
// 				var filterFeedbacks = "$orderby=Code%20desc";
// 				this.fetchAssessmentFeedbackslist(filterFeedbacks);
// 			}
// 		},
		getViewOnSelect: function(oEvent) {
			var btn = sap.ui.getCore().byId("Assessmentfeedbackfilter");
			var items = oEvent.getParameter("listItem");
			getTitleDialog = items.getTitle();
			btn.setVisible(true);
		},
		fetchAssessmentFeedbackslist: function(filterFeedbacks) {
			var that = this;
			this.fetchAssessmentFeedbacks(filterFeedbacks).done(function(getResponse) {
				sap.ui.getCore().setModel(getResponse, "AssessmentFeedbacksList");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		}

	});
});