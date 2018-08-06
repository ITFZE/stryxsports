sap.ui.define([
		"com/ss/app/StryxSports/controller/sal/EmailTemplateSAL",
		"sap/ui/model/json/JSONModel",
		"com/ss/app/StryxSports/controller/sal/TeamsSAL",
	   	"sap/m/MessageToast",
		"com/ss/app/StryxSports/libs/ckeditor"
], function(EmailTemplateSAL, JSONModel, TeamsSAL, MessageToast) {
	"use strict";
	return EmailTemplateSAL.extend("com.ss.app.StryxSports.controller.details.SendEmail", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("SendEmail").attachMatched(this._onRouteMatched, this);
			this._getTeamId = "";
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		onNavEmailBack: function() {
			this.getOwnerComponent().getRouter().navTo("DashBoard");
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
			this._getTeamId = oEvent.getParameter("arguments").TeamID;
			var templateModel = new JSONModel();
			templateModel.setProperty('/Code', 1);
			templateModel.setProperty('/U_Template');
			templateModel.setProperty('/U_TemplateType');
			//templateModel.setProperty('/U_Status', "1");
			that.getView().setModel(templateModel, "EmailTemplateModel");
			that.fetchTemplatesEmail();
			this.onSetBusyCkEdtior();
			that.fetchTeamCode();
		},
		onBeforeRendering: function() {
			var othat = this;
			if (!this.loadingMdls) {
				if (sap.ui.getCore().getModel("EmailTemplatesTypes") === null || sap.ui.getCore().getModel("EmailTemplatesTypes") === undefined) {
					othat.fetchTemplatesEmail();
				}
			}
			if (!this.loadingMdls) {
				if (sap.ui.getCore().getModel("mTeamList") === null || sap.ui.getCore().getModel("mTeamList") === undefined) {
					othat.fetchTeamCode();
				}
			}
		},
		onAfterRendering: function() {
			var that = this;
			that.getView().byId("htmlSimpleTemplate").setVisible(true);
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
			//var statusId = that.getView().byId("emailStatus");
			var createBtn = that.getView().byId("saveEmailCreat");
			var updateBtn = that.getView().byId("saveEmailUpdate");
			var cancelBtn = that.getView().byId("clearEmailBtn");
			var oPanel = that.getView().byId("htmlSimpleTemplate");
			var txt = that.getView().byId("emailEditor");
			var selectItem = evt.getParameter("selectedItem").getKey();
			//	oPanel.setBusy(true);
			var emFilter = "$filter=U_TemplateFor%20eq%20'1'%20and%20U_TemplateType%20eq%20'" + selectItem + "'";
			if (selectItem !== null) {
				oPanel.setBusy(true);
				//	this.getView().byId("htmlSimpleTemplate").setValueState("None");
				this.fetchEmailTemplateName(that, emFilter).done(function(obj) {
					that.getView().byId("htmlSimpleTemplate").setVisible(true);
					var ret = obj.getData();
					var str = "";
					if (ret.value.length > 0) {
						str = ret.value[0].U_Template;
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
				that.getView().byId("htmlSimpleTemplate").setVisible(true);
			}
		},

		//API CALL TO FETCH TEMPLATES NAME
		fetchTemplatesEmail: function() {
			var that = this;
			var templatesName = new EmailTemplateSAL();
			var templates = "$orderby=Code%20desc";
			templatesName.fetchTemplatesDetail(that, templates).done(function(obj) {
				if (obj.oData.value.length > 0) {
					that.getView().byId("templatesEmail").setSelectedKey(obj.oData.value[0].Code);
					that.getView().setModel(obj, "EmailTemplatesTypes");
				}
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
				/*	this.getView().byId("templatesEmail").setValueState("Error");
				createBtn.setVisible(true);
				updateBtn.setVisible(true);
				cancelBtn.setVisible(true);
				MessageToast.show("Please Select Templates");*/
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
					ckFormaterHide.setVisible(true);
					createBtn.setVisible(true);
					updateBtn.setVisible(true);
					cancelBtn.setVisible(true);
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
			//var selectType = this.getView().byId("templatesEmail").setSelectedKey("Select Templates");
			//var status = this.getView().byId("emailStatus").setSelectedKey("Active");
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
				/*	this.getView().byId("templatesEmail").setValueState("Error");
				MessageToast.show("Please Select Templates");*/
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
						ckFormaterHide.setVisible(true);
						createBtn.setVisible(true);
						updateBtn.setVisible(true);
						cancelBtn.setVisible(true);
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
		fetchTeamCode: function() {
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
// 			var addFilter = null,
// 				addFilterType = null;
// 			var criteria = "";
			var inTeam = that.getView().byId("inTeam").getValue().replace(/\s+/g, ' ');
			var teamSAL = new TeamsSAL();
// 			addFilterType = "Name";
// 			addFilter = inTeam;
// 			criteria += "contains(Name,'" + inTeam + "')";
// 			if (criteria !== "") {
// 				criteria += " or ";
// 			}
// 			var titleStr = that.titleCase(addFilter);
// 			criteria += "contains(Name,'" + titleStr + "')";
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