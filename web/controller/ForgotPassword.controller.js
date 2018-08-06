sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/AuthenticationSAL"
], function(AuthenticationSAL) {
	"use strict";
	return AuthenticationSAL.extend("com.ss.app.StryxSports.controller.ForgotPassword", {
		onPressLogin: function() {
			var sessionID = "",
				routeID = "";
			var that = this;
			var getValueName = that.getView().byId("inputUserName").getValue();
		
			if (getValueName === "") {
				that.getView().byId("inputUserName").setValueState("Error");
				var name = that.oBundle("PleaseEnterTheUserName");
				that.MessageToastShow(name);
			} else {
				that.getView().byId("inputUserName").setValueState("None");
				that.showLoading(true);
				var authenticationSAL = new AuthenticationSAL();
				authenticationSAL.logAuthentication().done(function(getResponse) {

					for (var i in getResponse.cookies) {
						if (getResponse.cookies[i].name === "B1SESSION") {
							sessionID = getResponse.cookies[i].value;
						} else if (getResponse.cookies[i].name === "ROUTEID") {
							routeID = getResponse.cookies[i].value;
						}
					}
					if (sessionID !== null || routeID !== null) {
						var contexts = that.getContext();
						contexts.SessionData.sessionID = sessionID;
						contexts.SessionData.routeID = routeID;
						that.setContext(contexts);
						that.showLoading(false);
						that.getRouter().navTo("DashBoard");
					}

				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString() ,"DashBoard");
				});
			}
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		}
	});
});