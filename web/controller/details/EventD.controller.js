sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"com/ss/app/StryxSports/controller/sal/LocationsSAL",
	"com/ss/app/StryxSports/controller/sal/EventSAL",
	  "sap/ui/model/json/JSONModel"
], function(EventSAL, LocationsSAL, JSONModel) {
	"use strict";
	return EventSAL.extend("com.ss.app.StryxSports.controller.details.EventsD", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("CreateEvent").attachMatched(this._onRouteMatched, this);

		},
		_onRouteMatched: function() {
			var edMD = new JSONModel();
			this.getView().setModel(edMD,"CreateEvent");
			
			this.showLoading(true);
			this.fetchLocations();
		},

		onPressCreateEvent: function() {
		    var getMDL = this.getView().getModel("CreateEvent");
		    var getMDLData = getMDL.getData();
		    
		},
		fetchLocations: function() {
			var that = this;
			var selLoc = that.getView().byId("edAddLocation");
			var locSAL = new LocationsSAL();
			selLoc.setBusy(true);
			locSAL.fetchLocationsMasters(that).done(function(obj) {
				that.getView().setModel(obj, "mdlLocation");
				var oItem = new sap.ui.core.Item({
					text: "Select The  Location",
					key: -1
				});
				selLoc.insertItem(oItem, 0);
				selLoc.setSelectedItem(oItem);
				selLoc.setBusy(false);
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		}
	});
});