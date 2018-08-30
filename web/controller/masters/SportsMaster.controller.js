sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/SportsSAL",
	"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter"
], function(SportsSAL, JSONModel, Filter) {
	"use strict";
	var getTitleDialog = null;
	return SportsSAL.extend("com.ss.app.StryxSports.controller.masters.SportsMaster", {
		onInit: function() {
		/*	var oRouter = this.getRouter();
			oRouter.getRoute("Sports").attachMatched(this._onRouteMatched, this);
			this.count = 5;*/
		},

	/*	_onRouteMatched: function() {
			var that = this;
			var filt = "$top=6";
			var sportSal = new SportsSAL();
			//that.getView().setBusy(true);
			sportSal.fetchSports(this, filt).done(function(obj) {
				sap.ui.getCore().setModel(obj, "SportsList");
				sap.ui.getCore().getModel("SportsList").refresh(true);
				that.getView().setBusy(false);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},*/
        onBeforeRendering: function() {
			if (sap.ui.getCore().getModel("SportsList") === null || sap.ui.getCore().getModel("SportsList") === undefined) {
				var filt = "$orderby=Code%20desc";
				this.fetchSportsList(filt);
			} else {
				sap.ui.getCore().getModel("SportsList").refresh(true);
			}
		},
		fetchSportsList: function(filt) {
		   	var that = this;
		//	var filt = "$top=6";
			var sportSal = new SportsSAL();
			//that.getView().setBusy(true);
			sportSal.fetchSports(this, filt).done(function(obj) {
				sap.ui.getCore().setModel(obj, "SportsList");
				sap.ui.getCore().getModel("SportsList").refresh(true);
				that.getView().setBusy(false);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		
		onPressAddSports: function() {
			this.getOwnerComponent().getRouter().navTo("SportDetails");
		},

		onPressSports: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("SportsList");
			this.getOwnerComponent().getRouter()
				.navTo("EditSport", {
					SportID: oCtx.getProperty("Code")
				});
		},

	/*	onPressNextSports: function() {
			var that = this;
			var sportSal = new SportsSAL();
			that.count += 5;
			sportSal.getNewSports(that.count).done(function(obj) {
				sap.ui.getCore().setModel(obj, "SportsList");
				sap.ui.getCore().getModel("SportsList").refresh(true);
				that.getView().setBusy(false);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},*/

		//Here functio for Filter Open
		onPressFilterSports: function() {
			if (!this._DialogAddSports) {
				this._DialogAddSports = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fSports",
					this);
			}
			var getBaseModel = this.getView().getModel("BaseModel");
			this._DialogAddSports.setModel(getBaseModel, "SportFilter");
			this._DialogAddSports.open();
		},
		//Here function for Filter Close
		dialogSportsCloseFilter: function() {

			this._DialogAddSports.close();
		},
		//Here Function for Filter Confirm
		onPressSelectedFilter: function() {
			var searchSportsMaster = this.getVariablesMaster();
			searchSportsMaster.searchField.setPlaceholder("Please Enter The " + getTitleDialog);
			this._DialogAddSports.close();
		},
		getViewonSports: function(oEvent) {
			var btn = sap.ui.getCore().byId("confirmSportsBtn");
			var items = oEvent.getParameter("listItem");
			getTitleDialog = items.getTitle();
			btn.setVisible(true);

		},
		//Here call for event liveChange 
		/*		onSearchLiveSports: function(oEvt) {
			var aFilters = [];
	    	var sQuery = oEvt.getSource().getValue();
			if (sQuery.length === 0) {
				var oModel = this.getView().getModel("SportsList");
			} 
			else if(sQuery.length > 0) {
				this.onSearchSports(oEvt);
			}
			var list = this.getView().byId("listSportsMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},*/
		//Here call for event Search 
		onSearchSports: function(oEvt) {
			var aFilters = [];
			var filter;
			//	var oModel = this.getView().getModel("SportsList");
			var sQuery = oEvt.getSource().getValue();
			switch (getTitleDialog) {
				case "Sport Name":
					filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
				case "Sport Description":
					filter = new Filter("U_SportsDescription", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
				default:
					filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
			}
			aFilters.push(filter);

			var list = this.getView().byId("listSportsMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},

		getVariablesMaster: function() {
			var sportsMaster = {
				sportsMasterList: this.getView().byId("listSportsMaster"),
				searchField: this.getView().byId("searchSportsMaster")
			};
			return sportsMaster;
		},
		onNavBackSports: function() {
			var getDetailsVariables = this.getView().byId("searchSportsMaster");
			getDetailsVariables.setValue("");
			this.getOwnerComponent().getRouter().navTo("DashBoard");
		}
	});
});