sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/EventsSAL",
	"sap/ui/model/Filter"
], function(EventsSAL, Filter) {
	"use strict";
	return EventsSAL.extend("com.ss.app.StryxSports.controller.masters.EventsM", {
		onInit: function() {
			this._getTitleDialog = null;
			this._searchEventMaster = this.getView().byId("eventMasterSearch");
		},
		onListItemPressEventList: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("eventsLists");
			this.getOwnerComponent().getRouter()
				.navTo("EventEdit", {
					EventID: oCtx.getProperty("Code")
				});
		},
		onNavBack: function() {
			this.getOwnerComponent().getRouter().navTo("DashBoard");
		},
		onBeforeRendering: function() {
			if (sap.ui.getCore().getModel("eventsLists") === null || sap.ui.getCore().getModel("eventsLists") === undefined) {
				this.fetchEventLists();
			}
		},
		fetchEventLists: function() {
			var that = this;
			that.showLoading(true);
			//	var elFilter = encodeURI("$orderby=Code desc");
			var elFilter = "";
			this.fetchEvents(elFilter).done(function(getResponse) {
				sap.ui.getCore().setModel(getResponse, "eventsLists");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		//Here filter model
		onPressFilterEvent: function() {
			if (!this._DialogFilterEvent) {
				this._DialogFilterEvent = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fEvent",
					this);
			}
			var getBaseModel = this.getView().getModel("BaseModel");
			this._DialogFilterEvent.setModel(getBaseModel, "EventFilter");
			this._DialogFilterEvent.open();
		},
		dialogEvntCloseFilter: function() {
			this._DialogFilterEvent.close();
		},
		onPressEventSelectFilter: function() {
			var that = this;
			that._searchEventMaster.setPlaceholder("Please Enter The " + that._getTitleDialog);
			that._DialogFilterEvent.close();
		},
		getViewonEvent: function(oEvent) {
			var that = this;
			var btn = sap.ui.getCore().byId("confirmEventBtn");
			var items = oEvent.getParameter("listItem");
			that._getTitleDialog = items.getTitle();
			btn.setVisible(true);
		},
		onSearchEvent: function(oEvt) {
			var that = this;
			var aFilters = [];
			var filter;
			var sQuery = oEvt.getSource().getValue();
			switch (that._getTitleDialog) {
				case "Lead Name":
					filter = new Filter("U_Title", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
				case "Start Date":
					filter = new Filter("U_StartDate", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
				case "Start Time":
					filter = new Filter("U_StartTime", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
				default:
					filter = new Filter("U_Title", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
			}
			aFilters.push(filter);
			var list = this.getView().byId("listCoachAssessmentMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		}
	});
});