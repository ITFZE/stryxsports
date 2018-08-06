sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"com/ss/app/StryxSports/controller/sal/CoachAssessmentScoreSAL",
	"sap/ui/model/Filter"
], function(JSONModel, CoachAssessmentScoreSAL,Filter) {
	"use strict";
		var getTitleDialog = null;
	return CoachAssessmentScoreSAL.extend("com.ss.app.StryxSports.controller.masters.CoachAssessmentMaster", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("CoachAssessment").attachMatched(this._onRouteMatched, this);
		},
			_onRouteMatched: function() {
		},
		onBeforeRendering: function() {
			if (sap.ui.getCore().getModel("AssessmentsList") === null || sap.ui.getCore().getModel("AssessmentsList") === undefined) {
			    	var that = this;
			var filters = "$orderby=Code%20desc";
			that.showLoading(true);
				this.fetchAssessmentList(filters);
			}},
			fetchAssessmentList:function(filters){
			   var getAssessments = null;
				var coachAssessmentScore = new CoachAssessmentScoreSAL();
                var that = this;
				coachAssessmentScore.fetchAssessments(that, filters).done(function(getResponseAssessments) {
					getAssessments = getResponseAssessments;
					if (getResponseAssessments.oData.value.length > 0) {
						that.showLoading(false);
						sap.ui.getCore().setModel(getResponseAssessments, "AssessmentsList");
					} else {
						that.showLoading(false);
						that.fetchMessageOk("Node", "Warning", "No Data ", "DashBoard");
					}
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
		},
		onListItemPressAssementList: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("AssessmentsList");
			this.getOwnerComponent().getRouter()
				.navTo("CoachAssessment", {
					assessmentID: oCtx.getProperty("Code")
				});
		},
		////Here View for filter open
		onPressAddCoachAssessmentFilter: function() {
			if (!this._DialogAddAssessmentFilter) {
				this._DialogAddAssessmentFilter = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.filterCoachAssessment",
					this);
			}
        	var getBaseModel = this.getView().getModel("BaseModel");
			this._DialogAddAssessmentFilter.setModel(getBaseModel, "CoachAssessmentFilter");
			this._DialogAddAssessmentFilter.open();
		},
		onPressSelectedAssessmentFilter:function(){
		    var CoachAssessmentSearch = this.getVariables();
			CoachAssessmentSearch.searchField.setPlaceholder(" Please Enter The " + getTitleDialog);
			this._DialogAddAssessmentFilter.close();
		},
		onSearchDialogsCloseAssessmentMasterPage: function() {
			this._DialogAddAssessmentFilter.close();
		},
			getViewonCoaAssessment: function(oEvent) {
			var btn = sap.ui.getCore().byId("CoachAssessmentfilter");
			var items = oEvent.getParameter("listItem");
			getTitleDialog = items.getTitle();
			btn.setVisible(true);
		},
/*		onAssessmentliveChange : function(oEvt) {
		    var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery.length === 0) {
				var oModel = this.getView().getModel("AssessmentsList");
			} 
			else {
				this.onSearchCoachAssessment(oEvt);
			}
			var list = this.getView().byId("listCoachAssessmentMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},*/
			onSearchCoachAssessment: function(oEvt) {
			var aFilters = [];
			var filter;
			var oModel = this.getView().getModel("AssessmentsList");
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				switch (getTitleDialog) {
					case "Lead Name":
						filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Schedule Date":
						filter = new Filter("U_ScheduleSDate", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Schedule Time":
						filter = new Filter("U_ScheduleETime", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					default:
						filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
				}
				aFilters.push(filter);
			}
			var list = this.getView().byId("listCoachAssessmentMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		onNavBackAssessment : function () {
		    	var getDetailsVariables = this.getView().byId("CoachAssessmentSearch");
		  		getDetailsVariables.setValue("");
		  		this.getOwnerComponent().getRouter().navTo("DashBoard");
		},
		getVariables: function() {
			var CoachAssessmentMaster = {
				coachMasterList: this.getView().byId("CoachAssessmentScore"),
				searchField: this.getView().byId("CoachAssessmentSearch")
			};
			return CoachAssessmentMaster;
		}

	});
});