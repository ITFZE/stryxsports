sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/SportCategorySAL",
		"sap/ui/model/Filter"
], function(SportCategorySAL, Filter) {
	"use strict";
	var getTitleDialog = null;
	return SportCategorySAL.extend("com.ss.app.StryxSports.controller.masters.SportCategoryMaster", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("SportsCategory").attachMatched(this._onRouteMatched, this);
		},
		onBeforeRendering: function() {
			if (sap.ui.getCore().getModel("SportsCategoryMaster") === null || sap.ui.getCore().getModel("SportsCategoryMaster") === undefined) {
				this.getView().setBusy(true);
				var sportFilter = "$orderby=Code%20desc";
				this.fetchSportCategory(sportFilter);
			}
		},
		_onRouteMatched: function() {},
		refreshModel: function() {
			this.getView().getModel("SportsCategoryMaster").refresh(true);
		},
		onPressSportsCategory: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("SportsCategoryMaster");
			this.getOwnerComponent().getRouter()
				.navTo("EditSportsCategory", {
					sportsCategoryID: oCtx.getProperty("Code")
				});
		},
		//Here function for Filter Open
		onPressFilterSportsCategory: function() {
			if (!this._DialogAddSportsCategory) {
				this._DialogAddSportsCategory = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fSportsCategory",
					this);
				//this._DialogAddSportsCategory.setModel(this.getView().getModel());
			}
			var getBaseModel = this.getView().getModel("BaseModel");
			this._DialogAddSportsCategory.setModel(getBaseModel, "SportCategoryFilter");
			this._DialogAddSportsCategory.open();
		},
		//Here function for Filter Close
		dialogSportsCategoryCloseFilter: function() {
			this._DialogAddSportsCategory.close();
		},
		onPressAddSportsCategory: function() {
			this.getOwnerComponent().getRouter().navTo("SportsCategoryDetail");
		},
		//Here funciton for Filter Confirm
		onPressSportsCategoryFilterConfirm: function() {
			var searchSportsCategoryMaster = this.getVariables();
			searchSportsCategoryMaster.searchField.setPlaceholder("Please Enter The " + getTitleDialog);
			this._DialogAddSportsCategory.close();
		},
		getViewonSelectEvent: function(oEvent) {
			var btn = sap.ui.getCore().byId("confirmCategoryBtn");
			var items = oEvent.getParameter("listItem");
			getTitleDialog = items.getTitle();
			btn.setVisible(true);
		},
		//Here Function for Search Filter list
		/*	    onLiveChange : function(oEvt){
	        var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery.length === 0) {
				var oModel = this.getView().getModel("SportsCategoryMaster");
			} 
			else {
				this.onSearchSportsCategory(oEvt);
			}
			var list = this.getView().byId("listSportsCategoryMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
	    },*/
		onSearchSportsCategory: function(oEvt) {
			var aFilters = [];
			var filter;
			var oModel = this.getView().getModel("SportsCategoryMaster");
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				switch (getTitleDialog) {
					case "Sport Category Name":
						filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Sport Category Description":
						filter = new Filter("U_CatDescpriction", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					default:
						filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
				}
				aFilters.push(filter);
			}
			var list = this.getView().byId("listSportsCategoryMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		getVariables: function() {
			var categoryMaster = {
				categoryMasterList: this.getView().byId("listSportsCategoryMaster"),
				searchField: this.getView().byId("searchSportsCategoryMaster")
			};
			return categoryMaster;
		},
		fetchSportCategory: function(sportFilter) {
			var that = this;
			var category = new SportCategorySAL();
			category.fetchSportCategoryMasters(that, sportFilter).done(function(getResponse) {
				sap.ui.getCore().setModel(getResponse, "SportsCategoryMaster");
				sap.ui.getCore().getModel("SportsCategoryMaster").refresh(true);
				that.getView().setBusy(false);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		onNavBackCategory: function() {
			var getDetailsVariables = this.getView().byId("searchSportsCategoryMaster");
			getDetailsVariables.setValue("");
			this.getOwnerComponent().getRouter().navTo("DashBoard");
		}
	});
});