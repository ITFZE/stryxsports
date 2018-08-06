sap.ui.define([
    "sap/ui/core/routing/History",
	"com/ss/app/StryxSports/controller/sal/AuthenticationSAL"
], function(History, AuthenticationSAL) {
	"use strict";

	return AuthenticationSAL.extend("com.ss.app.StryxSports.controller.Login", {
		onAfterRendering: function() {
			var view = this.getView();
			view.addDelegate({
				onsapenter: function(e) {
					view.getController().onPressLogin();
				}
			});

			/*			window.addEventListener("popstate", function(event) {
			    var url = window.location.href;
			    var arr = url.split('/');
			    var lastsegment = arr[arr.length-1];
                console.log("Last Segment: ", lastsegment);
                var oHistory = History.getInstance();
                // var prevHash = oHistory.getPreviousHash();
        		if(oHistory._getDirection() == "Forwards" && lastsegment == "DashBoard"){
                    history.pushState(null, null, "index.html#");
                if(oHistory.aHistory.length == 1){
        		       history.pushState(null, null, "index.html#");
        		    }   
        		}

            });*/
		},

		onPressLogin: function() {
			var sessionID = "",
				routeID = "";
			var that = this;
			var getValueName = that.getView().byId("inputUserName").getValue();
			var getValuePassword = that.getView().byId("inputPassword").getValue();
			if (getValueName === "") {
				that.getView().byId("inputUserName").setValueState("Error");
				var name = that.oBundle("PleaseEnterTheUserName");
				that.MessageToastShow(name);
			} else if (getValuePassword === "") {
				that.getView().byId("inputUserName").setValueState("None");
				that.getView().byId("inputPassword").setValueState("Error");
				var password = that.oBundle("PleaseEnterThePassword");
				that.MessageToastShow(password);
			} else {
				that.getView().byId("inputUserName").setValueState("None");
				that.getView().byId("inputPassword").setValueState("None");
				that.showLoading(true);
				var auth = new Object();
				auth.username = that.getView().byId("inputUserName").getValue();
				auth.pwd = that.getView().byId("inputPassword").getValue();
				var authenticationSAL = new AuthenticationSAL();
				authenticationSAL.logAuthentication(auth).done(function(getResponse) {

					if (getResponse.body.status === 0) {
						var contexts = that.getContext();
						contexts.User = getResponse.body;
						contexts.SessionData.sessionID = getResponse.body.sessionID;
						contexts.SessionData.routeID = getResponse.body.routeID;
						that.setContext(contexts);
						that.showLoading(false);
						that.getRouter().navTo("DashBoard");
						that.MessageToastShow("Login Successfull");
						// SETTING LOGIN FILEDS TO EMPTY VALUES
						that.getView().byId("inputUserName").setValue("");
						that.getView().byId("inputPassword").setValue("");
					} else {
						that.showLoading(false);
						that.fetchErrorMessageOk("Error", "Error", getResponse.body.Message.toString());
					}

					// 	for (var i in getResponse.cookies) {
					// 		if (getResponse.cookies[i].name === "B1SESSION") {
					// 			sessionID = getResponse.cookies[i].value;
					// 		} else if (getResponse.cookies[i].name === "ROUTEID") {
					// 			routeID = getResponse.cookies[i].value;
					// 		}
					// 	}
					// 	if (sessionID !== null || routeID !== null) {

					// 		that.getRouter().navTo("DashBoard");
					// 	}

				}).fail(function(err) {
					that.showLoading(false);
					that.fetchErrorMessageOk("Error", "Error", err.toString());
				});
			}
		},
		onPressShowHide: function() {
			var pass = this.getView().byId("inputPassword");
			var isIcon = this.getView().byId("showHideIcon");
			if (pass.getType() == "Text") {
				pass.setType("Password");
				isIcon.setSrc("sap-icon://hide");
			} else {
				pass.setType("Text");
				isIcon.setSrc("sap-icon://show");
			}
		},
		onPressForgetPassword: function() {
			var that = this;
			that.showLoading(false);
			that.getRouter().navTo("ForgotPassword");
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		}
	});
});