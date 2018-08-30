sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/HolidaySAL",
	"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
], function(HolidaySAL, JSONModel, Filter, ValueState, Validator) {
	"use strict";
	return HolidaySAL.extend("com.ss.app.StryxSports.controller.masters.HolidayListMaster", {
		onInit: function() {
		    var oRouter = this.getRouter();
			oRouter.getRoute("HolidayListMaster").attachMatched(this._onRouteMatched, this);
		    this._getTitleDialog = null;
		    this._searchHolidayMaster = this.getView().byId("searchHolidayMaster");
		},
		_onRouteMatched: function() {
		    this._searchHolidayMaster.setValue("");
		},
		onBeforeRendering: function() {
		if (sap.ui.getCore().getModel("HolidayModel") === null || sap.ui.getCore().getModel("HolidayModel") === undefined) {
			var filter = "$orderby=Code%20desc";
			this.fetchHolidayList(filter);
	    	}
		},
		onHolidayNavBack: function() {
		    var that = this;
		    that._searchHolidayMaster.setValue("");
		    that.getOwnerComponent().getRouter().navTo("DashBoard");
		},
		onPressHolidayList: function(evt) {
    		var oItem, oCtx;
    		oItem = evt.getSource();
    		oCtx = oItem.getBindingContext("HolidayModel");
    		this.getOwnerComponent().getRouter()
    			.navTo("EditHolidayListDetail", {
    				holidayID: oCtx.getProperty("Code")
    			});
		},
		fetchHolidayList: function(filter){
		   	var that = this;
			var holidaySAL = new HolidaySAL();
			holidaySAL.fetchHolidayList(that, filter).done(function(getResponse) {
				sap.ui.getCore().setModel(getResponse, "HolidayModel");
				sap.ui.getCore().getModel("HolidayModel").refresh(true);
				that.getView().setBusy(false);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			}); 
		},
		onPressFilterHoliday: function() {
		   if (!this._DialogFilterHoliday) {
				this._DialogFilterHoliday = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fHolidayList",
					this);
			}
			var getBaseModel = this.getView().getModel("BaseModel");
			this._DialogFilterHoliday.setModel(getBaseModel, "HolidayFilter");
			this._DialogFilterHoliday.open();
		},
		dialogLocationCloseFilter: function() {
		    this._DialogFilterHoliday.close();
		},
		onPressHolidaySelectFilter: function() {
		    var that = this;
			that._searchHolidayMaster.setPlaceholder("Please Enter The " + that._getTitleDialog);
			that._DialogFilterHoliday.close();
		},
		getViewonHoliday: function(oEvent) {
		    var that = this;
			var btn = sap.ui.getCore().byId("confirmHolidayBtn");
			var items = oEvent.getParameter("listItem");
			that._getTitleDialog = items.getTitle();
			btn.setVisible(true);
		},
		onSearchHoliday: function(oEvt) {
		    var that = this;
			var aFilters = [];
			var filter;
			var sQuery = oEvt.getSource().getValue();
			switch (that._getTitleDialog) {
				case "Holiday Name":
					filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
				default:
					filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
			}
			aFilters.push(filter);
			var list = this.getView().byId("listHolidayMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		onPressAddHoliday: function() {
		   this.getOwnerComponent().getRouter().navTo("HolidayListDetail");
		}
	});

});