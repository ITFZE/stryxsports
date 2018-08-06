sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/SMSTemplateSAL",
	"com/ss/app/StryxSports/controller/sal/TeamsSAL",
	'sap/m/Dialog',
	'sap/m/MessageToast',
	'sap/m/Button',
	'sap/m/Text',
	"sap/ui/model/json/JSONModel",
	"com/ss/app/StryxSports/libs/ckeditor"
], function(SMSTemplateSAL,TeamsSAL, MessageToast, Dialog, Text, Button, JSONModel) {
	"use strict";
	return SMSTemplateSAL.extend("com.ss.app.StryxSports.controller.details.SendSMS", {

		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("SMSTemplate").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		_onRouteMatched: function() {
			var that = this;
			var getSessionData = this.getContext();
			var getSessionID = getSessionData.SessionData.sessionID;
			var getRouteID = getSessionData.SessionData.routeID;
			var smsModel = new JSONModel();
			smsModel.setProperty('/Code', 0);
			smsModel.setProperty('/U_Template');
			smsModel.setProperty('/U_TemplateType');
			smsModel.setProperty('/U_Status', 1);
			smsModel.setProperty('/U_TemplateFor', "2");
			that.getView().setModel(smsModel, "SMSTemplateModel");
			that.setSelBusy();
			that.fetchSMSTemplates();
			that.fetchTeamsCode();
			var selSeason = that.getView().byId("smstemplates");
			var oItem = new sap.ui.core.Item({
				text: "Select Templates",
				key: -1
			});
			selSeason.insertItem(oItem, 0);
			selSeason.setSelectedItem(oItem);
			selSeason.setBusy(false);
		},
		onBeforeRendering: function() {
			var othat = this;
			if (!this.loading) {
				if (sap.ui.getCore().getModel("SMSTemplatesTypes") === null || sap.ui.getCore().getModel("SMSTemplatesTypes") === undefined) {
					othat.fetchSMSTemplates();
				}
			}
			if (!this.loading) {
				if (sap.ui.getCore().getModel("mTeamList") === null || sap.ui.getCore().getModel("mTeamList") === undefined) {
					othat.fetchTeamsCode();
				}
			}
		},
		onAfterRendering: function() {
			var that = this;
			that.getView().byId("smsTemplateview").setVisible(true);
			var conf = this.getOwnerComponent().getManifestEntry("stryx.placeholder");
			var txt = this.getView().byId("SMSTemplateContent");
			var editor = CKEDITOR.instances[txt.sId];
			if (editor) {
				editor.destroy(true);
			}
			CKEDITOR.replace(txt.sId, conf[0]);
		},
		onChange: function(evt) {
			var that = this;
			var createBtn = that.getView().byId("saveSMSCreate");
			var updateBtn = that.getView().byId("saveSMSUpdate");
			var cancelBtn = that.getView().byId("clearSmsBtn");
			var statusId = that.getView().byId("SMSStatus");
			var sms = this.getView().byId("smsTemplateview");
			var ckObj = CKEDITOR;
			var txt = this.getView().byId("SMSTemplateContent");
			var getValues = txt.getDomRef();
			var selectItem = evt.getParameter("selectedItem").getKey();
			var conf = this.getOwnerComponent().getManifestEntry("stryx.placeholder");
			var emFilter = "$filter=U_TemplateFor%20eq%20'2'%20and%20U_TemplateType%20eq%20'" + selectItem + "'";
			if (selectItem !== "-1" && selectItem !== "") {
				sms.setBusy(true);
				this.getView().byId("smstemplates").setValueState("None");
				this.fetchSMSTemplateName(this, emFilter).done(function(obj) {
					that.getView().byId("smsTemplateview").setVisible(true);
					var ret = obj.getData();
					var str = "";
					if (ret.value.length > 0) {
						sms.setBusy(true);
						str = ret.value[0].U_Template;
						/*var getStatus = obj.oData.value[0].U_Status;
						if (getStatus === "1") {
							statusId.setValue("Active");
						} else {
							statusId.setValue("Inactive");
						}
						createBtn.setVisible(false);
						updateBtn.setVisible(true);
						cancelBtn.setVisible(true);*/
						//	that.MessageToastShow("Success");
					} else {
					/*	statusId.setValue("Active");
						createBtn.setVisible(true);
						updateBtn.setVisible(false);
						cancelBtn.setVisible(true);*/
						//	that.MessageToastShow("No Data");
					}
					var editor = ckObj.instances[txt.sId];
					if (editor) {
						editor.destroy(true);
					}
					sms.setBusy(false);
					ckObj.replace(txt.sId, conf[selectItem]);
					ckObj.instances[txt.sId].setData(str);
				}).fail(function(err) {

				});
				this.getView().byId("smstemplates").setValueState("None");
			} else {
				this.getView().byId("smstemplates").setValueState("Error");
				that.getView().byId("smsTemplateview").setVisible(true);
			}
		},

		fetchSMSTemplates: function() {
			var that = this;
			var SMS = new SMSTemplateSAL();
			var filter = "$orderby=Code%20desc";
			SMS.fetchSMSTemplatesDetail(that, filter).done(function(obj) {
				sap.ui.getCore().setModel(obj, "SMSTemplatesTypes");
				var selSeason = that.getView().byId("smstemplates");
				var oItem = new sap.ui.core.Item({
					text: "Select Templates",
					key: -1
				});
				selSeason.insertItem(oItem, 0);
				selSeason.setSelectedItem(oItem);
				selSeason.setBusy(false);
			}).fail(function(err) {
				console.log("Error: ", err);
			});
		},
		OnSaveSMS: function() {
			var that = this;
			var smsModel = new JSONModel();
			var smsType = that.getView().byId("smstemplates").getSelectedItem().getText();
			var smsTemplateHide = that.getView().byId("smsTemplateview");
			var ckFormater = that.getView().byId("SMSTemplateContent");
			var createBtn = that.getView().byId("saveSMSCreate");
			var updateBtn = that.getView().byId("saveSMSUpdate");
			var cancelBtn = that.getView().byId("clearSmsBtn");
			var instance = CKEDITOR.instances[ckFormater.sId];
			var formatted = instance.getData();
			var unFormatted = instance.document.getBody().getText();
			if (smsType === "Select Templates") {
				this.getView().byId("smstemplates").setValueState("Error");
			/*	var smssavetemplates = this.oBundle("PleaseSelectTemplates");
				cancelBtn.setVisible(false);
				createBtn.setVisible(false);
				updateBtn.setVisible(false);
				cancelBtn.setVisible(false);*/
			//	this.MessageToastShow(smssavetemplates);
			} else if (formatted === 'undefined' || formatted === null || formatted === '') {
				this.MessageToastShow("Please Enter The Template Body.");
			} else {
				var jModel = that.getView().getModel("SMSTemplateModel");
				jModel.setProperty('/U_Template', unFormatted);
				that.showLoading(false);
				var emFilter = "$filter=U_TemplateFor%20eq%20'2'";
				that.CreateSMS(jModel, emFilter).done(function(response) {
					var sTemplates = new JSONModel();
					sTemplates.setData(sTemplates);
					that.getView().setModel(sTemplates, "sTemplates");
					that.showLoading(false);
					that.fetchMessageOk("Create SMS Template", "Success", "Created Successfully", "DashBoard");
					var msg = "";
					instance.setData(msg);
					/*smsTemplateHide.setVisible(false);
					createBtn.setVisible(false);
					updateBtn.setVisible(false);
					cancelBtn.setVisible(false);*/
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "SMSTemplate");
				});
			}
		},
		setSelBusy: function() {
			var othat = this;
			var selSeason = othat.getView().byId("smstemplates");
			selSeason.setBusy(true);
		},
		onSetBusyCkEdtior: function() {
			var selSeason = this.getView().byId("SMSTemplateContent");
			selSeason.setBusy(true);
		},
		onPressCancelSMS: function() {
			var that = this;
			var ckFormater = that.getView().byId("SMSTemplateContent");
			var instance = CKEDITOR.instances[ckFormater.sId];
			var templates = this.getView().byId("smstemplates").setSelectedKey("Select Templates");
			var smsstatus = this.getView().byId("SMSStatus").setSelectedKey("Active");
			instance.setData("");

		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},
		//Here function for Update Email
		onPressUpdateSMSTemplate: function() {
			var that = this;
			var smsModel = new JSONModel();
			//var smsType = that.getView().byId("smstemplates").getSelectedItem().getText();
			var templateTypeKey = that.getView().byId("smstemplates").getSelectedItem().getKey();
			var ckFormater = that.getView().byId("SMSTemplateContent");
			var smsTemplateHide = that.getView().byId("smsTemplateview");
			var createBtn = that.getView().byId("saveSMSCreate");
			var updateBtn = that.getView().byId("saveSMSUpdate");
			var cancelBtn = that.getView().byId("clearSmsBtn");
			var instance = CKEDITOR.instances[ckFormater.sId];
			var formatted = instance.getData();
			var unFormatted = instance.document.getBody().getText();
			if (templateTypeKey === "Select Templates") {
				this.getView().byId("smstemplates").setValueState("Error");
				var smssavetemplates = this.oBundle("PleaseSelectTemplates");
				this.MessageToastShow(smssavetemplates);
			} else if (formatted === 'undefined' || formatted === null || formatted === '') {
				this.MessageToastShow("Please Enter The Template Body.");
			} else {
				var jModel = that.getView().getModel("SMSTemplateModel");
				jModel.setProperty('/U_Template', unFormatted);
				that.showLoading(true);
				var emFilter = encodeURI("$filter=(U_TemplateType eq '" + templateTypeKey + "' and U_TemplateFor eq '2')");
				that.fetchSMSTemplateName(that, emFilter).done(function(response) {
					var getSMSID = response.oData.value[0].Code;
					that.UpdateSMSDetails(jModel, getSMSID).done(function(resp) {
						that.showLoading(false);
						that.fetchMessageOk("Update SMS Template", "Success", "Updated Successfully", "DashBoard");
						var msg = "";
						instance.setData(msg);
						smsTemplateHide.setVisible(false);
					/*	createBtn.setVisible(false);
						updateBtn.setVisible(false);
						cancelBtn.setVisible(false);*/
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "SMSTemplate");
					});

				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "SMSTemplate");
				});

			}
		},
		onNavSMSBack: function() {
			var that = this;
			that.getOwnerComponent().getRouter().navTo("DashBoard");
		/*	var createBtn = that.getView().byId("saveSMSCreate");
			var updateBtn = that.getView().byId("saveSMSUpdate");
			var cancelBtn = that.getView().byId("clearSmsBtn");*/
			var ckFormater = that.getView().byId("smsTemplateview");
			var instance = CKEDITOR.instances[ckFormater.sId];
			ckFormater.setVisible(false);
		/*	createBtn.setVisible(false);
			updateBtn.setVisible(false);
			cancelBtn.setVisible(false);*/
			this.getView().byId("smstemplates").setValueState("None");

		},
		fetchTeamsCode: function() {
		   	var that = this;
			that.showLoading(true);
			var teamSAL = new TeamsSAL();
			var filter = "$filter=U_Status%20eq%20'1'";
			teamSAL.fetchTeams(that, filter).done(function(obj) {
				that.getView().setModel(obj, "mTeamList");
				//othat.getView().byId("addTeamLocation").setValueState("None");
				that.loadingMdls = false;
				// console.log("Success: ", obj.oData.value);
			}).fail(function(err) {
				console.log("Error: ", err);
			});
			that.showLoading(false);
		},
		onPressSearchTeam: function() {
			var that = this;
			var inTeam = this.getView().byId("inTeam").getValue().replace(/\s+/g, ' ');
			var teamSAL = new TeamsSAL();
			var tFilterCardType = encodeURI("$filter=Name eq '" + inTeam + "'");
			teamSAL.fetchTeams(that, tFilterCardType).done(function(obj) {
				that.getView().setModel(obj, "mTeamList");
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		}
		
	});

});