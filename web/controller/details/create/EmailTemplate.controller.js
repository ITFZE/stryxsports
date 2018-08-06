/* global ckeditor:true */
sap.ui.define([
		"com/ss/app/StryxSports/controller/sal/EmailTemplateSAL",
		"sap/ui/model/json/JSONModel",
	   	"sap/m/MessageToast",
		"com/ss/app/StryxSports/libs/ckeditor"
], function(EmailTemplateSAL, JSONModel, MessageToast) {
	"use strict";
	return EmailTemplateSAL.extend("com.ss.app.StryxSports.controller.details.create.EmailTemplate", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("EmailTemplate").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		_onRouteMatched: function() {
			var that = this;
			var templateModel = new JSONModel();
			templateModel.setProperty('/Code', 0);
			templateModel.setProperty('/U_Template');
			templateModel.setProperty('/U_TemplateType');
			templateModel.setProperty('/U_Status', "1");
			that.getView().setModel(templateModel, "EmailTemplateModel");
			that.setSelBusy();
			that.fetchTemplatesEmail();
			this.onSetBusyCkEdtior();

			// 			var getDeviceMdl = this.getView().getModel("checkPhoneModel");
			// 			var getCheckPhone = getDeviceMdl.getProperty("/CheckPhone");
			// 			if (getCheckPhone !== false) {

			// 			}
			/*	sap.ui.Device.orientation.attachHandler(function(mParams) {
				if (mParams.landscape) {
					alert('in landscape mode');
				} else {
					alert('in portrait mode');
				}
			});*/
		},
		onBeforeRendering: function() {
			var othat = this;
			if (!this.loadingMdls) {
				if (sap.ui.getCore().getModel("EmailTemplatesTypes") === null || sap.ui.getCore().getModel("EmailTemplatesTypes") === undefined) {
					othat.fetchTemplatesEmail();
				}
			}
		},
		onAfterRendering: function() {
			var that = this;
			that.getView().byId("htmlSimpleTemplate").setVisible(false);
			var conf = this.getOwnerComponent().getManifestEntry("stryx.placeholder");
			var txt = this.getView().byId("emailEditor");
			var editor = CKEDITOR.instances[txt.sId];
			if (editor) {
				editor.destroy(true);
			}
			CKEDITOR.replace(txt.sId, conf[0]);
		},
		onExit: function() {
			var selectType = this.getView().byId("templatesEmail").setValueState("None");
			selectType.destroy(true);
		},
		onChange: function(evt) {
			var that = this;
			var ckobj = CKEDITOR;
			var conf = that.getOwnerComponent().getManifestEntry("stryx.placeholder");
			var statusId = that.getView().byId("emailStatus");
			var createBtn = that.getView().byId("saveEmailCreat");
			var updateBtn = that.getView().byId("saveEmailUpdate");
			var cancelBtn = that.getView().byId("clearEmailBtn");
			var oPanel = that.getView().byId("htmlSimpleTemplate");
			var txt = that.getView().byId("emailEditor");
			var selectItem = evt.getParameter("selectedItem").getKey();
			//	oPanel.setBusy(true);
			var emFilter = "$filter=U_TemplateFor%20eq%20'1'%20and%20U_TemplateType%20eq%20'" + selectItem + "'";
			if (selectItem !== "-1" && selectItem !== "") {
				oPanel.setBusy(true);
				//	this.getView().byId("htmlSimpleTemplate").setValueState("None");
				this.fetchEmailTemplateName(that, emFilter).done(function(obj) {
					that.getView().byId("htmlSimpleTemplate").setVisible(true);
					var ret = obj.getData();
					var str = "";
					if (ret.value.length > 0) {
						str = ret.value[0].U_Template;
						var getStatus = obj.oData.value[0].U_Status;
						if (getStatus === "1") {
							statusId.setValue("Active");
						} else {
							statusId.setValue("Inactive");
						}
						oPanel.setBusy(true);
						createBtn.setVisible(false);
						updateBtn.setVisible(true);
						cancelBtn.setVisible(true);
						//	that.MessageToastShow("Success");
					} else {
						statusId.setValue("Active");
						createBtn.setVisible(true); // We do not need this button as we are not showing editor for "selectItem = -1" 
						updateBtn.setVisible(false);
						cancelBtn.setVisible(true);
						//	that.MessageToastShow("No Data");
					}
					var editor = ckobj.instances[txt.sId];
					if (editor) {
						editor.destroy(true);
					}
					oPanel.setBusy(false);
					ckobj.replace(txt.sId, conf[selectItem]);
					ckobj.instances[txt.sId].setData(str);
					that.showLoading(false);
				}).fail(function(err) {});
				this.getView().byId("templatesEmail").setValueState("None");
			} else {
				this.getView().byId("templatesEmail").setValueState("Error");
				that.getView().byId("htmlSimpleTemplate").setVisible(false);
			}
		},

		//API CALL TO FETCH TEMPLATES NAME
		fetchTemplatesEmail: function() {
			var that = this;
			var templatesName = new EmailTemplateSAL();
			var templates = "$orderby=Code%20desc";
			templatesName.fetchTemplatesDetail(that, templates).done(function(obj) {
				sap.ui.getCore().setModel(obj, "EmailTemplatesTypes");
				var onSetBusyCkEdtior = that.getView().byId("templatesEmail");
				var oItem = new sap.ui.core.Item({
					text: "Select Templates",
					key: -1
				});
				onSetBusyCkEdtior.insertItem(oItem, 0);
				onSetBusyCkEdtior.setSelectedItem(oItem);
				onSetBusyCkEdtior.setBusy(false);
			}).fail(function(err) {
				console.log("Error: ", err);
			});
		},

		//Here function for Add save button
		onPressEmailTemplateSave: function() {
			var that = this;
			var templateModel = new JSONModel();
			var templateType = that.getView().byId("templatesEmail").getSelectedItem().getText();
			var ckFormaterHide = that.getView().byId("htmlSimpleTemplate");
			var ckFormater = that.getView().byId("emailEditor");
			var createBtn = that.getView().byId("saveEmailCreat");
			var updateBtn = that.getView().byId("saveEmailUpdate");
			var cancelBtn = that.getView().byId("clearEmailBtn");
			var instance = CKEDITOR.instances[ckFormater.sId];
			var formatted = instance.getData();
			//var unFormatted= instance.document.getBody().getText();
			if (templateType === "Select Templates") {
				this.getView().byId("templatesEmail").setValueState("Error");
				createBtn.setVisible(false);
				updateBtn.setVisible(false);
				cancelBtn.setVisible(false);
				MessageToast.show("Please Select Templates");
			} else if (formatted == 'undefined' || formatted == null || formatted == '') {
				MessageToast.show("Please Enter The Template Body.");
			} else {
				var jModel = that.getView().getModel("EmailTemplateModel");
				jModel.setProperty('/U_Template', formatted);
				that.showLoading(true);
				var emFilter = "$filter=U_TemplateFor%20eq%20'1'";
				that.createTemplateEmail(jModel, emFilter).done(function(response) {
					var mTemplates = new JSONModel();
					mTemplates.setData(mTemplates);
					that.getView().setModel(mTemplates, "mTemplates");
					that.showLoading(false);
					that.fetchMessageOk("Create Email Template", "Success", "Created Successfully", "DashBoard");
					var msg = "";
					instance.setData(msg);
					ckFormaterHide.setVisible(false);
					createBtn.setVisible(false);
					updateBtn.setVisible(false);
					cancelBtn.setVisible(false);
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "EmailTemplate");
				});
			}
		},
		setSelBusy: function() {
			var othat = this;
			var selSeason = othat.getView().byId("templatesEmail");
			selSeason.setBusy(true);
		},
		onSetBusyCkEdtior: function() {
			var ckEditorSeason = this.getView().byId("emailEditor");
			ckEditorSeason.setBusy(true);
		},
		///Here function for Cancel button
		onPressCancelEmail: function() {
			var that = this;
			var ckFormater = that.getView().byId("emailEditor");
			var instance = CKEDITOR.instances[ckFormater.sId];
			this.getView().byId("htmlSimpleTemplate").setVisible(true);
			var selectType = this.getView().byId("templatesEmail").setSelectedKey("Select Templates");
			var status = this.getView().byId("emailStatus").setSelectedKey("Active");
			instance.setData("");
		},
		onAction: function() {
			var oPanel = this.getView().byId("htmlSimpleTemplate");
			oPanel.setBusy(true);
		},
		//Here function for Update Email
		onPressUpdateEmailTemplate: function() {
			var that = this;
			var templateType = that.getView().byId("templatesEmail").getSelectedItem().getText();
			var templateTypeKey = that.getView().byId("templatesEmail").getSelectedItem().getKey();
			var ckFormaterHide = that.getView().byId("htmlSimpleTemplate");
			var ckFormater = that.getView().byId("emailEditor");
			var createBtn = that.getView().byId("saveEmailCreat");
			var updateBtn = that.getView().byId("saveEmailUpdate");
			var cancelBtn = that.getView().byId("clearEmailBtn");
			var instance = CKEDITOR.instances[ckFormater.sId];
			var formatted = instance.getData();
			//var unFormatted= instance.document.getBody().getText();
			if (templateType === "Select Templates") {
				this.getView().byId("templatesEmail").setValueState("Error");
				MessageToast.show("Please Select Templates");
			} else if (formatted == 'undefined' || formatted == null || formatted == '') {
				this.MessageToastShow("Please Enter The Template Body.");
			} else {
				var jModel = that.getView().getModel("EmailTemplateModel");
				jModel.setProperty('/U_Template', formatted);
				that.showLoading(true);
				var emFilter = encodeURI("$filter=(U_TemplateType eq '" + templateTypeKey + "' and U_TemplateFor eq '1')");
				that.fetchEmailTemplateName(that, emFilter).done(function(response) {
					var code = response.oData.value[0].Code;
					that.updateTemplateEmail(jModel, code).done(function(resp) {
						that.showLoading(false);
						that.fetchMessageOk("Update Email Template", "Success", "Updated Successfully", "DashBoard");
						var msg = "";
						instance.setData(msg);
						ckFormaterHide.setVisible(false);
						createBtn.setVisible(false);
						updateBtn.setVisible(false);
						cancelBtn.setVisible(false);
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "EmailTemplate");
					});

				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "Fetch Templates");
				});

			}
		},
		onNavEmailBack: function() {
			var that = this;
			// 	  window.location.reload();
			that.getOwnerComponent().getRouter().navTo("DashBoard");
			var createBtn = that.getView().byId("saveEmailCreat");
			var updateBtn = that.getView().byId("saveEmailUpdate");
			var cancelBtn = that.getView().byId("clearEmailBtn");
			var ckFormater = that.getView().byId("htmlSimpleTemplate");
			var instance = CKEDITOR.instances[ckFormater.sId];
			ckFormater.setVisible(false);
			createBtn.setVisible(false);
			updateBtn.setVisible(false);
			cancelBtn.setVisible(false);
			this.getView().byId("templatesEmail").setValueState("None");

		}
	});
});