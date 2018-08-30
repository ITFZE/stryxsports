sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/ss/app/StryxSports/model/models",
	'sap/ui/model/json/JSONModel',
	"sap/ui/model/resource/ResourceModel"
], function(UIComponent, Device, models, JSONModel, ResourceModel) {
	"use strict";
	return UIComponent.extend("com.ss.app.StryxSports.Component", {
		metadata: {
			manifest: "json"
		},
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			/*var config = {
				SessionData: {
					sessionID: '',
					routeID: ''
				},
				Coaches: {
					empType: 'Coaches'
				},
				Location: {
					locAdmin: 'Location Admin',
					locRes: 'Location Responsible'
				}
			};
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			var contexts = oStorage.get("Contexts");
			if (contexts === null || contexts === "Contexts") {
				//Set data into Storage  
				oStorage.put("Contexts", config);
			}
			//pContexts = oStorage.get("Contexts");*/
			// enable routing
			//window.CKEDITOR_BASEPATH = jQuery.sap.getModulePath("com.ss.app.StryxSports", "./");
			this.getRouter().initialize();
			var pth = window.location.href;
			var sPth = pth.split("index.html");
			window.CKEDITOR_BASEPATH = sPth[0] + "libs/";
			var oModel = new JSONModel(jQuery.sap.getModulePath("com.ss.app.StryxSports.model", "/data.json"));

			var i18nModel = new ResourceModel({
				bundleName: "com/ss/app/StryxSports/i18n/i18n"
			});
			this.setModel(i18nModel, "i18n");
			// set the device model 
			this.setModel(models.createDeviceModel(), "device");
			// Check the mobile responsive 
			var checkPhoneModel = new JSONModel();
			if (sap.ui.Device.system.phone) {

				checkPhoneModel.setProperty("/CheckPhone", true);

				//	console.log("onInit : UIComponent  in Phone");

			} else {
				checkPhoneModel.setProperty("/CheckPhone", false);
				//console.log("onInit : UIComponent in PC");
			}
			this.setModel(checkPhoneModel, "checkPhoneModel");
			this.setModel(oModel, "BaseModel");
			this.setModel(oModel);
		},
		getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});