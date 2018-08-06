sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/CoachsSAL",
		"sap/ui/model/Filter"
], function(CoachsSAL, Filter) {
	"use strict";
	var getTitleDialog = null;
	return CoachsSAL.extend("com.ss.app.StryxSports.controller.masters.CoachesMaster", {
		onInit: function() {},
		_onRouteMatched: function() {},
		setFilterTitle: null,
		setFilterName: "Name",
		onListItemPressCoachesList: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("CoachsMaster");
			this.getOwnerComponent().getRouter()
				.navTo("CoachesDetail", {
					EmployeeID: oCtx.getProperty("EmployeeID")
				});
		},
		onBeforeRendering: function() {
			var getContext = this.getContext();
			if (sap.ui.getCore().getModel("CoachsMaster") === null || sap.ui.getCore().getModel("CoachsMaster") === undefined) {
				this.getView().setBusy(true);
				var filterPosition = "$filter=Name%20eq%20" + "%27" + getContext.Coaches.empType + "%27";
				this.fetchCoachAfterFilter(filterPosition);
			}
		},
		onPressAddFilter: function() {
			if (!this._DialogAddCoach) {
				this._DialogAddCoach = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fCoaches",
					this);
			}
			var getBaseModel = this.getView().getModel("BaseModel");
			this._DialogAddCoach.setModel(getBaseModel, "CoachFilter");
			this._DialogAddCoach.open();
		},
		onPressDialogClose: function() {
			this._DialogAddCoach.close();
		},
		//Here function for Coach Filter Frgaments
		getViewonCoachs: function(oEvent) {
		    var btn = sap.ui.getCore().byId("confirmDialogBtn");
			var items = oEvent.getParameter("listItem");
			getTitleDialog = items.getTitle();
			btn.setVisible(true);
		},
		//Here filter Confirm button
		onPressFilterConfirm: function() {
			var coachSearchFiled = this.getVariables();
			coachSearchFiled.searchField.setPlaceholder("Please Enter The " + getTitleDialog);
			this._DialogAddCoach.close();
		},
		/////Here function for Filter Search Filed Master Page
/*		onCoachLiveChange : function(oEvt){
		    var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery.length === 0) {
				var oModel = this.getView().getModel("CoachsMaster");
			} 
			else {
				this.onSearchCoachesListMasterPage(oEvt);
			}
			var list = this.getView().byId("listCoachsMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},*/
		onSearchCoachesListMasterPage: function(oEvt) {
			var aFilters = [];
			var filter;
			var oModel = this.getView().getModel("CoachsMaster");
			var sQuery = oEvt.getSource().getValue();
				switch (getTitleDialog) {
					case "Coach First Name":
						filter = new Filter("FirstName", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Coach Last Name":
						filter = new Filter("LastName", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Contact Number":
						filter = new Filter("MobilePhone", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Coach Email":
						filter = new Filter("eMail", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					default:
						filter = new Filter("FirstName", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
				}
				aFilters.push(filter);
			var list = this.getView().byId("listCoachsMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		
		onNavBackCoach : function () {
		    	var getDetailsVariables = this.getView().byId("searchCoachesMasterPage");
		  		getDetailsVariables.setValue("");
		  		this.getOwnerComponent().getRouter().navTo("DashBoard");
		},
		
		getVariables: function() {
			var items = {
				sportsMasterList: this.getView().byId("listCoachsMaster"),
				searchField: this.getView().byId("searchCoachesMasterPage")
			};
			return items;
		},
		//Here Fetch API 
		fetchCoachAfterFilter: function(filterPosition) {
			var setThis = this;
			var coachsSAL = new CoachsSAL();
			coachsSAL.fetchEmployeePosition(filterPosition).done(function(getID) {
				coachsSAL.fetchEmployeesPositionInfo(getID).done(function(getResponse) {
					sap.ui.getCore().setModel(getResponse, "CoachsMaster");
					setThis.showLoading(false);

				}).fail(function(err) {
					setThis.showLoading(false);
					setThis.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});

			}).fail(function(err) {
				setThis.showLoading(false);
				setThis.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		}

	});
});