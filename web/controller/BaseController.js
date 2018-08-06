sap.ui.define([
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	'sap/m/MessageToast',
	"sap/ui/model/json/JSONModel"
    ], function(Button, Dialog, Text, Controller, History, MessageToast, JSONModel) {
	"use strict";
	var getThis = null;
	return Controller.extend("com.ss.app.StryxSports.controller.BaseController", {
		initContext: function() {

			var config = {
				baseURL: '/stryx/services/B1SLProxy.xsjs',
				User: {},
				SessionData: {
					sessionID: '',
					routeID: ''
				},
				Coaches: {
					empType: 'Coach'
				},
				Location: {
					locAdmin: 'Location Admin',
					locRes: 'Location Responsible'
				},
				PageID: ""
			};
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			var contexts = oStorage.get("Contexts");
			if (contexts === null || contexts === "Contexts") {
				//Set data into Storage  
				oStorage.put("Contexts", config);
			}
		},
		setContext: function(sContext) {
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			//var contexts = oStorage.get("Contexts");
			oStorage.put("Contexts", sContext);
		},
		getContext: function() {
			jQuery.sap.require("jquery.sap.storage");
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			return oStorage.get("Contexts");
		},
		setViewModel: function(mModel, mName) {
			this.getView().setModel(mModel, mName);
			this.getView().getModel(mName).refresh(true);
		},
		showLoading: function(status) {
			this.getView().setBusy(status);
			/*if (!this._dialog) {
				this._dialog = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.Dialogs.BusyDialog", this);
			}
			if (status) {
				this._dialog.open();
			} else {
				jQuery.sap.delayedCall(200, this, function() {
					this._dialog.close();
				});
			}*/

		},
		showBusyDialogLoading: function(getStatus, getTitle, getMessage) {
			var busyDialog = new sap.m.BusyDialog({
				title: getTitle,
				text: getMessage
			});
			if (!getStatus) {
				busyDialog.close();
			} else {

				busyDialog.open();
			}
		},
		getNewModel: function(md) {
			var mdJson = md.getJSON();
			var mdStr = JSON.stringify(mdJson);
			var newMD = new sap.ui.model.json.JSONModel();
			newMD.setJSON(JSON.parse(mdStr));
			return newMD;
		},
		titleCase: function(str) {
			return str.toLowerCase().split(' ').map(function(word) {
				return (word.charAt(0).toUpperCase() + word.slice(1));
			}).join(' ');
		},
		mapJsonData: function(source, destination) {
			var sKeys = Object.keys(source);
			var dKeys = Object.keys(destination);
			for (var dKey in dKeys) {
				for (var sKey in sKeys) {
					if (dKeys[dKey] === sKeys[sKey]) {
						destination[dKeys[dKey]] = source[sKeys[sKey]];
					}
				}
			}
			return destination;
		},

		onInit: function() {
			this.initContext();
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

		},
		getRouter: function() {
			getThis = this;
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onNavBack: function() {
			// 			var oHistory, sPreviousHash;
			// 			oHistory = History.getInstance();
			// 			sPreviousHash = oHistory.getPreviousHash();

			// 			if (sPreviousHash !== undefined) {
			// 				window.history.go(-1);
			// 			} else {
			// 				this.getRouter().navTo("DashBoard", {}, true /*no history*/ );
			// 			}
			//this.getRouter().navTo("DashBoard");

			//			var oModel = this.getView().getModel();
			//			var aData = oModel.getProperty("/session_Data/0/");
			//			getSessionID =aData.sessionID;
			//			getRouteID =aData.routeID;
			//			this.getRouter().navTo("DashBoard",{
			//        		sessionID:getSessionID,
			//        		routeID:getRouteID
			//        		});

			this.getRouter().navTo("DashBoard", {}, false /*no history*/ );
		},
		sportStatus: function(sStatus) {
			if (sStatus === "1") {
				return "Success";
			} else if (sStatus === "2") {
				return "Error";
			} else {
				return "None";
			}
		},

		setStatus: function(setStatus) {
			if (setStatus === "1") {
				return "Active";
			} else if (setStatus === "2") {
				return "Inactive";
			} else {
				return "None";
			}
		},
		setPriceFormatter: function(getPrice) {
			if (getPrice !== null && getPrice !== undefined) {
				return "AED " + getPrice;
			}

		},
		setIDPriceFormatter: function(getPrice) {
			/* if(getPrice !== null && getPrice !== undefined){
		         return /^(\d*([.,](?=\d{3}))?\d+)+((?!\2)[.,]\d\d)?$/.test(getPrice);
		    }*/
		},
		returnLocation: function(value) {
			if (value === undefined) {
				return "-1";
			}
			return value;
		},
		returnCategory: function(value) {
			if (value === undefined) {
				return "-1";
			}
			return value;
		},
		returnSeason: function(value) {
			if (value === undefined) {
				return "-1";
			}
			return value;
		},
		returnSports: function(value) {
			if (value === undefined) {
				return "-1";
			}
			return value;
		},
		returnTeam: function(value) {
			return value;
		},
		returnAdmin: function(value) {
			if (value === undefined) {
				return "-1";
			}
			return value;
		},
		returnRes: function(value) {
			if (value === undefined) {
				return "-1";
			}
			return value;
		},
		setPosition: function(getPosition) {
			if (getPosition === 2) {
				return "Coach";
			} else {
				return "None";
			}
		},
		childAdultFormatter: function(value) {
			if (value === "1") {
				var valueChild = "Child";
				var getChildValue = "";
				var childConcat = getChildValue.concat("(" + valueChild + ")");
				return childConcat;
			} else {
				var valueAdult = "Adult";
				var getAdultValue = "";
				var adultConcat = getAdultValue.concat("(" + valueAdult + ")");
				return adultConcat;
			}
		},
		colorFormatter: function(value) {
			switch (value) {
				case "e":
					value = "Default";
					break;
				case "n":
					value = "Default";
					break;
				case "de":
					value = "Reject";
					break;
				case "dn":
					value = "Reject";
					break;
				default:
					break;
			}
			return value;
		},
		iconFormatter: function(value) {
			switch (value) {
				case "e":
					value = "sap-icon://sys-cancel-2";
					break;
				case "n":
					value = "sap-icon://sys-cancel-2";
					break;
				case "de":
					value = "sap-icon://accept";
					break;
				case "dn":
					value = "sap-icon://accept";
					break;
				default:
					break;
			}
			return value;
		},
		checkEmployeeStatus: function(getStatus) {
			if (getStatus === "tYES") {
				return "Success";
			} else {
				return "Error";
			}

		},
		checkEmployeeStatusText: function(getTxtStatus) {
			if (getTxtStatus === "tYES") {
				return "Active";
			} else {
				return "Inactive";
			}
		},
		templateToString: function(type) {
			if (type === "1") {
				return "Add Location Admin";
			}
			if (type === "2") {
				return "Add Location Responsible";
			}
			if (type === "3") {
				return "Add Coach to Team";
			}
			if (type === "4") {
				return "Add Assessment Schedule for Lead";
			}
			if (type === "5") {
				return "Add Assesment Schedule for Coach";
			}
			if (type === "6") {
				return "Assessment Schedule reminder for Lead";
			}
			if (type === "7") {
				return "Assessment Schedule reminder for Coach";
			}
			if (type === "8") {
				return "Assessment Coach Feedback";
			}
			if (type === "9") {
				return "Create New Membership";
			}
			if (type === "10") {
				return "Renew Membership";
			}
			if (type === "11") {
				return "Payment Done";
			}
			if (type === "12") {
				return "Payment Reminder";
			}
		},
		MessageToastShow: function(getMessages) {
			getThis = this;
			return MessageToast.show(getMessages);
		},

		checkDateFormat: function(getGetTime) {
			var oFormat = sap.ui.core.format.DateFormat.getInstance({
				pattern: "yyyy-MM-dd"
			});
			return oFormat.format(getGetTime);
		},
		setItemPricesFormat: function(getValue) {
			if (getValue !== null || getValue !== undefined) {
				var toFloat = parseFloat(getValue);
				return parseFloat(toFloat);
			}

		},

		onDialogState: function(getTitle, getState, getMessage, getRouteName) {
			var logoutDialog = new Dialog({
				title: getTitle,
				type: 'Message',
				state: getState,
				content: new Text({
					text: getMessage
				}),
				beginButton: new Button({
					text: 'Ok',
					press: function() {
						getThis.getRouter().navTo(getRouteName);
						//  		getThis.getView().byId("addSportsCategoryName").setValue("");
						//  		getThis.getView().byId("addSportsCategoryDescription").setValue("");
						//  		getThis.getView().byId("addSportCategoryStatus").setSelectedKey("Active");
						// 		logoutDialog.close();
					}

				}),

				endButton: new Button({
					text: 'Cancel',
					press: function() {
						logoutDialog.close();
					}
				}),
				afterClose: function() {
					logoutDialog.destroy();
				}

			});
			logoutDialog.open();
		},

		///Here function for location view
		locationCoach: function(location) {
			if (location === "1") {
				return "developer";
			} else if (location === "2") {
				return "Coach";
			} else if (location === "3") {
				return "Admin";
			} else if (location === "4") {
				return "Responsible";
			} else {
				return "None";
			}
		},
		fetchMessageOk: function(getTitle, getState, getMessage, getRouteName) {
			var that = this;

			if (getMessage === "Unauthorized") {
				getTitle = "Your Session Has Been Expired";
				getMessage = "Please Re-Login";
				getRouteName = "Login";
			}
			var messageOktDialog = new Dialog({
				title: getTitle,
				type: 'Message',
				state: getState,
				content: new Text({
					text: getMessage
				}),
				beginButton: new Button({
					text: 'Ok',
					press: function() {
						messageOktDialog.close();
						that.getRouter().navTo(getRouteName);
					}
				})
			});
			messageOktDialog.open();
		},
		fetchErrorMessageOk: function(getTitle, getState, getMessage) {

			var messageErrorOktDialog = new Dialog({
				title: getTitle,
				type: 'Message',
				state: getState,
				content: new Text({
					text: getMessage
				}),
				beginButton: new Button({
					text: 'Ok',
					press: function() {
						messageErrorOktDialog.close();
					}
				})
			});
			messageErrorOktDialog.open();
		},

		toDate: function(dateStr) {
			jQuery.sap.require("sap.ui.core.format.DateFormat");

			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy/MM/dd"
			});

			return oDateFormat.format(new Date(Number(dateStr)));
		},
		toDateFormat: function(value) {
			// 			jQuery.sap.require("sap.ui.core.format.DateFormat");
			// 			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			// 				pattern: "yyyy/MM/dd"
			// 			});

			// 			return oDateFormat.format(new Date(Number(value)));
			var d = new Date(value),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2) {
				month = '0' + month;
			}
			if (day.length < 2) {
				day = '0' + day;
			}

			return [year, month, day].join('-');

		},
		toTimeFormat: function(value) {
			var d = new Date(value),
				hours = '' + (d.getHours()),
				minutes = '' + d.getMinutes();
			if (hours.length === 1) {
				hours = "0" + hours;
			}
			if (minutes.length === 1) {
				minutes = "0" + minutes;
			}
			return [hours, minutes].join(':');

		},
		dateFormat: function(date) {
			var passDate = new Date(date || Date.now());
			return passDate;
		},

		planningCalenderDate: function(val1, val2) {
			var d = new Date(val1 + ' ' + val2);
			var month = '' + (d.getMonth());
			var day = '' + d.getDate();
			var year = '' + d.getFullYear();
			var hr = '' + d.getHours();
			var mm = '' + d.getMinutes();
			var ret = new Date(year, month, day, hr, mm);
			return ret;
		},

		getGender: function(gender) {
			if (gender === "gt_Male") {
				return "Male";
			} else {
				return "Female";
			}
		},
		setMonthFormatterItemDetails: function(getValue) {
			var getQuantity = sap.ui.getCore().byId("memberQuantity");
			if (getValue !== null || getValue !== undefined) {
				if (getValue === "Months") {

					getQuantity.setEnabled(true);

				} else {
					getQuantity.setEnabled(false);
				}

			}
			return getValue;
		},
		setCreateInvoice: function(getStatus) {
			var setStatus = getStatus;
			switch (getStatus) {
				case "1":
					setStatus = "Create Invoice";
					break;
				case "2":
					setStatus = "Make Payment";
					break;
				case "3":
					setStatus = "Completed";
					break;
				default:
			}
			return setStatus;

		},
		setInvoiceIcons: function(getStatus) {
			var setIcons;
			switch (getStatus) {
				case "1":
					setIcons = "sap-icon://my-sales-order";
					break;
				case "2":
					setIcons = "sap-icon://monitor-payments";
					break;
				case "3":
					setIcons = "sap-icon://customer-view";
					break;
				default:
			}
			return setIcons;

		},
		changeIcon: function(type) {
			var setIcon;
			switch (type) {
				case "cn_Conversation":
					setIcon = "sap-icon://call";
					break;
				case "cn_Meeting":
					setIcon = "sap-icon://manager";
					break;
				case "cn_Task":
					setIcon = "sap-icon://activities";
					break;
				case "pr_Normal":
					setIcon = "sap-icon://notes";
					break;
				case "cn_Campaign":
					setIcon = "sap-icon://marketing-campaign";
					break;
				case "cn_Other":
					setIcon = "sap-icon://sys-find-next";
					break;
				default:
					break;
			}
			return setIcon;

		},
		convertCardType: function(param) {
			var cardType;
			switch (param) {
				case "cCustomer":
					cardType = "Customer";
					break;
				case "cLid":
					cardType = "Lead";
					break;
				default:
					break;
			}
			return cardType;
		},
		convertMemberType: function(param) {
			var MemberType;
			switch (param) {
				case "1":
					MemberType = "Child";
					break;
				case "2":
					MemberType = "Adult";
					break;
				default:
					break;
			}
			return MemberType;
		},
		toActivity: function(param) {
			var subject;
			switch (param) {
				case "-1":
					subject = "General";
					break;
				case "1":
					subject = "Events";
					break;
				case "2":
					subject = "Sports";
					break;
				default:
					break;
			}
			return subject;
		},
		toTotalPrice: function(qty, uPrice, currType) {
			var tot;
			if (currType === null) {
				currType = "";
			}
			tot = parseFloat(qty * uPrice).toFixed(2);
			return currType + " " + tot.toString();
		},
		toCurrencyAddPrice: function(uPrice, currType) {
			if (currType === null) {
				currType = "";
			}
			uPrice = parseFloat(uPrice).toFixed(2);
			return currType + " " + uPrice.toString();
		},
		toTotalAmount: function(currType, qty, uPrice, vat) {
			var tot;
			if (currType === null) {
				currType = "";
			}
			tot = parseFloat(qty * uPrice);
			tot += vat;
			return currType + " " + tot.toFixed(2);
		},
		setServiceNames: function(getDocumentLines) {
			var getDocumentLinesText = [];

			if (getDocumentLines.length > 0 && getDocumentLines !== undefined) {
				getDocumentLines.forEach(function(values) {
					getDocumentLinesText.push(values.ItemDescription + "/");
				});
			}
			return getDocumentLinesText.toString();
		},
		/*sendEmailSMS: function(comType, template, templateValues) {
			var etFilter = "";
			var that = this;
			switch (comType) {
				case "Email":
					etFilter = encodeURI(
						"$filter=U_SS_TEMPLATES/U_TemplateType eq U_SS_TEMPLATE_TYPES/Code and U_SS_TEMPLATE_TYPES/Name eq '" + template +
						"' and U_SS_TEMPLATES/U_TemplateFor eq '1'||$expand=U_SS_TEMPLATES($select=Code,Name,U_Template,U_TemplateType,U_TemplateFor)"
					);
					break;
				case "SMS":
					etFilter = encodeURI(
						"$filter=U_SS_TEMPLATES/U_TemplateType eq U_SS_TEMPLATE_TYPES/Code and U_SS_TEMPLATE_TYPES/Name eq '" + template +
						"' and U_SS_TEMPLATES/U_TemplateFor eq '2'||$expand=U_SS_TEMPLATES($select=Code,Name,U_Template,U_TemplateType,U_TemplateFor)"
					);
					break;
				case "Both":
					etFilter = encodeURI(
						"$filter=U_SS_TEMPLATES/U_TemplateType eq U_SS_TEMPLATE_TYPES/Code and U_SS_TEMPLATE_TYPES/Name eq '" + template +
						"' and (U_SS_TEMPLATES/U_TemplateFor eq '1' or U_SS_TEMPLATES/U_TemplateFor eq '2') ||$expand=U_SS_TEMPLATES($select=Code,Name,U_Template,U_TemplateType,U_TemplateFor)"
					);
					break;
			}
			that.fetchTemplate(etFilter).done(function(res) {
				if (res.value.length > 0) {
					for (var m = 0; m < res.value.length; m++) {
						var body = res.value[m].U_SS_TEMPLATES.U_Template;
						var templateType = res.value[m].U_SS_TEMPLATES.U_TemplateType;
						var templateFor = res.value[m].U_SS_TEMPLATES.U_TemplateFor;
						switch (templateFor) {
							case "1":
								that.sendEmail(body, templateType, templateValues);
								break;
							case "2":
								that.sendSMS(body, templateType, templateValues);
								break;
						}
					}
				}
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "Location");
			});
		},*/
	/*	getCommunicaitonModel: function(body, templateType, templateValues, forComType) {
			var that = this;
			var conf = that.getOwnerComponent().getManifestEntry("stryx.placeholder");
			var ph = conf[parseInt(templateType)];
			var phVal = ph.placeholder_select.placeholders;
			var phEle = ph.placeholder_select.phValues;
			var exStr = "";
			var rpStr = "";
			var mailObj = {};
			mailObj.to = [];
			for (var j = 0; j < templateValues.length; j++) {
				for (var i = 0; i < phVal.length; i++) {
					exStr = "[[" + phVal[i] + "]]";
					if (phVal[i].startsWith(templateValues[j].startsWith)) {
						rpStr = templateValues[j].templateObj[phEle[i]];
						body = body.split(exStr).join(rpStr);
					}
				}
				if (forComType === "email") {
					mailObj.to.push(templateValues[j].templateObj[templateValues[j].email]);
				}
				if (forComType === "sms") {
					mailObj.to.push(templateValues[j].templateObj[templateValues[j].sms]);
				}
			}
			mailObj.body = body;
			mailObj.subject = "";
			return mailObj;
		},*/
/*		sendEmail: function(body, templateType, templateValues) {
		    var that = this;
			var emailObj = this.getCommunicaitonModel(body, templateType, templateValues, "email");
		    //var mData = new JSONModel();
			//mData.setData(emailObj);
			//this.getView().setModel(mData, "eMail");
			//For testing purposes
			var date = new Date();
            var arg = {
              body: "This is a test Email - " + date.getDate() + "/" + date.getMonth(),
              subject: "This is a test Email - " + date.getDate() + "/" + date.getMonth(),
              to: ["sgv@inflexiontechfze.com", "pvk@inflexiontechfze.com"]
            };
            //For testing purposes
			that.sendNotifyEmail(arg);
		},*/
/*		sendSMS: function(body, templateType, templateValues) {
		    var that = this;
			var smsObj = this.getCommunicaitonModel(body, templateType, templateValues, "sms");
		    //var mData = new JSONModel();
			//mData.setData(smsObj);
			//this.getView().setModel(mData, "SMS");
           //For testing purposes
            var date = new Date();
            var arg = {
              body: "This is a test SMS - " + date.getDate() + "/" + date.getMonth(),
              subject: "This is a test SMS - " + date.getDate() + "/" + date.getMonth(),
              to: ["919916699633"]
            };
            //For testing purposes
			that.sendNotifySMS(arg);
		},*/
/*		fetchTemplate: function(filter) {
		    var that = this;
			var deferred = $.Deferred();
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=$crossjoin(U_SS_TEMPLATES,U_SS_TEMPLATE_TYPES)" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					deferred.resolve(response.body);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},*/
		sendNotifyEmail: function(mailObj) {
		    let _data = JSON.stringify(mailObj);
/*		    var that = this;
			var deferred = $.Deferred();
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=NotifyEmail&memType=SendMail" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: mailObj.getJSON(),
				crossDomain: true,
				success: function(response) {
					deferred.resolve(response);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();*/
		},
		sendNotifySMS: function(oData) {
		    let _data = JSON.stringify(oData);
/*			var that = this;
			var deferred = $.Deferred();
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=NotifyEmail&sstype=SendSMS&sessionID=" + context.SessionData.sessionID + "&routeID=" +
				context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: JSON.stringify(oData),
				crossDomain: true,
				success: function(response) {
					deferred.resolve(response.body);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();*/
		}
	});
});