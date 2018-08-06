sap.ui.define([
    "com/ss/app/StryxSports/controller/sal/LocationsSAL",
    	"sap/ui/model/Filter"
], function(LocationsSAL, Filter) {
	"use strict";
	var getTitleDialog = null;
	return LocationsSAL.extend("com.ss.app.StryxSports.controller.masters.LocationMaster", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("Location").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function() {},
		onBeforeRendering: function() {
			if (sap.ui.getCore().getModel("LocationMasters") === null || sap.ui.getCore().getModel("LocationMasters") === undefined) {
				this.getView().setBusy(true);
				var locFilter = "$orderby=Code%20desc";
				this.fetchLocationsMastersList(locFilter);
			}
		},
		onPressAddLocation: function() {
			this.getOwnerComponent().getRouter().navTo("LocationDetail");
		},
		fetchLocationsMastersList: function(locFilter) {
			var setThis = this;
			var location = new LocationsSAL();
			location.fetchLocationsMasters(this, locFilter).done(function(getResponse) {
				sap.ui.getCore().setModel(getResponse, "LocationMasters");
					sap.ui.getCore().getModel("LocationMasters").refresh(true);
				setThis.getView().setBusy(false);
			}).fail(function(err) {
				setThis.getView().setBusy(false);
				setThis.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		onPressLocation: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("LocationMasters");
			this.getOwnerComponent().getRouter()
				.navTo("EditLocation", {
					locationID: oCtx.getProperty("Code")
				});
		},
		//Here Function for Filter Open
		onPressFilterLocation: function() {
			if (!this._DialogAddLocations) {
				this._DialogAddLocations = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fLocation",
					this);
			}
				var getBaseModel = this.getView().getModel("BaseModel");
			this._DialogAddLocations.setModel(getBaseModel, "LocationFilter");
			this._DialogAddLocations.open();
				},
		//Here Function for Filter Confirm Button
		onPressSelectedLocationFilter: function() {
			var searchLocationMaster = this.getVariablesMaster();
			searchLocationMaster.searchField.setPlaceholder(" Please Enter The " + getTitleDialog);
			this._DialogAddLocations.close();
		},
		getViewonLocation: function(oEvent) {
			var btn = sap.ui.getCore().byId("confirmLocationBtn");
			var items = oEvent.getParameter("listItem");
			getTitleDialog = items.getTitle();
			btn.setVisible(true);
		},
/*		onLocationLiveChange : function(oEvt){
		    var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery.length === 0) {
				var oModel = this.getView().getModel("LocationMasters");
			} 
			else {
				this.onSearchLocation(oEvt);
			}
			var list = this.getView().byId("listMasterLocationData");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},*/
		onSearchLocation: function(oEvt) {
			var aFilters = [];
			var filter;
			var oModel = this.getView().getModel("LocationMasters");
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				switch (getTitleDialog) {
					case "Location Name":
						filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Location Responsible":
						filter = new Filter("U_LocationResponsible", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Location Admin":
						filter = new Filter("U_LocationAdmin", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					default:
						filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
				}
				aFilters.push(filter);
			}
			var list = this.getView().byId("listMasterLocationData");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		dialogLocationCloseFilter: function() {
			this._DialogAddLocations.close();
		},
		getVariablesMaster: function() {
			var locationMaster = {
				locationMasterList: this.getView().byId("listMasterLocationData"),
				searchField: this.getView().byId("searchLocationMaster")
			};
			return locationMaster;
		},
			onNavBackLocation : function () {
		    	var getDetailsVariables = this.getView().byId("searchLocationMaster");
		  		getDetailsVariables.setValue("");
		  		this.getOwnerComponent().getRouter().navTo("DashBoard");
		}
	});
});