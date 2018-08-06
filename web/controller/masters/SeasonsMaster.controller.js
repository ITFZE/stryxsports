sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/SeasonSAL",
		"sap/ui/model/Filter"
], function(SeasonSAL, Filter) {
	"use strict";
	var getTitleDialog = null;
	return SeasonSAL.extend("com.ss.app.StryxSports.controller.masters.SeasonsMaster", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("Seasons").attachMatched(this._onRouteMatched, this);
		},
		onBeforeRendering: function() {
			if (sap.ui.getCore().getModel("SeasonMaster") === null || sap.ui.getCore().getModel("SeasonMaster") === undefined) {
				this.getView().setBusy(true);
				var sfilter = "$orderby=Code%20desc";
				this.fetchSeasonsList(sfilter);
			}
		},
		onPressAddSeasons:function(){
		  this.getOwnerComponent().getRouter().navTo("SeasonsDetail");
		},
		_onRouteMatched: function() {},
		onPressSeasonsList: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("SeasonMaster");
			this.getOwnerComponent().getRouter()
				.navTo("EditSeason", {
					seasonID: oCtx.getProperty("Code")
				});
		},
		//Here function for Filter Open
			onPressFilterSeasons: function() {
			if (!this._DialogAddSeasons) {
				this._DialogAddSeasons = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fSeasons",
					this);
			}
				//this._DialogAddSeasons.setModel(this.getView().getModel());
				var getBaseModel = this.getView().getModel("BaseModel");
				this._DialogAddSeasons.setModel(getBaseModel, "SeasonsFilter");
			this._DialogAddSeasons.open();
			
			//this._DialogAddSeasons.open();
		},
		//Here Filer Close
		onPressFilterSeasonsClose: function() {
			this._DialogAddSeasons.close();
		},
		getViewonSelectEvent: function(oEvent) {
			var btn = sap.ui.getCore().byId("confirmDialogBtnSeasons");
			var items = oEvent.getParameter("listItem");
			getTitleDialog = items.getTitle();
			btn.setVisible(true);
		},
		//here Function for Filter Confirm
		onPressFilterSeasonsConfirm: function() {
			var getEle = this.getVariables();
			getEle.searchField.setPlaceholder("Please Enter The " + getTitleDialog);
			this._DialogAddSeasons.close();
		},
/*		onSeasonLiveChange : function(oEvt){
		    var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery.length === 0) {
				var oModel = this.getView().getModel("SeasonMaster");
			} 
			else {
				this.onSearchSeasons(oEvt);
			}
			var list = this.getView().byId("seasonsListData");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},*/
		onSearchSeasons: function(oEvt) {
			var aFilters = [];
			var filter;
			var oModel = this.getView().getModel("SeasonMaster");
			var sQuery = oEvt.getSource().getValue();
				switch (getTitleDialog) {
					case "Season Name":
						filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Season Start Date":
						filter = new Filter("U_StartDate", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Season End Date":
						filter = new Filter("U_EndDate", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Season Description":
						filter = new Filter("U_Description", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					default:
						filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
				}
			aFilters.push(filter);
			var list = this.getView().byId("seasonsListData");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		getVariables: function() {
			var seasonsMaster = {
				seasonsMasterList: this.getView().byId("seasonsListData"),
				searchField: this.getView().byId("seasonSearch")
			};
			return seasonsMaster;
		},
		fetchSeasonsList: function(sfilter) {
			var that = this;
			this.fetchSeason(this, sfilter).done(function(getResponse) {
				sap.ui.getCore().setModel(getResponse, "SeasonMaster");
				that.getView().setBusy(false);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		onNavBackSeason : function () {
		    	var getDetailsVariables = this.getView().byId("seasonSearch");
		  		getDetailsVariables.setValue("");
		  		this.getOwnerComponent().getRouter().navTo("DashBoard");
		}

	});
});