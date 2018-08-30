sap.ui.define([
		"com/ss/app/StryxSports/controller/sal/EventsSAL",
		"sap/ui/model/json/JSONModel",
		"com/ss/app/StryxSports/controller/sal/TeamsSAL",
		'com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL',
		"com/ss/app/StryxSports/libs/ckeditor"
], function(EventsSAL, JSONModel, TeamsSAL, CreateAssessmentsSAL) {
	"use strict";
	return EventsSAL.extend("com.ss.app.StryxSports.controller.details.InviteMembers", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("InviteMembers").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this._selAccountType = this.byId("selectAccountType");
			this._inATName = this.byId("inputIMName");
			this._inATEmail = this.byId("inputIMEmail");
			this._dpATDOB = this.byId("DatePickerIMEmailDOB");
			this._inATMobile = this.byId("inputIMMobile");
			this._tAddTeamMember = this.byId("tableAddMember");
			this._tAddTeam = sap.ui.getCore().byId("tableAddTeam");
			this._bSaveMembers = this.byId("buttonSaveMembers");
			this._bCancelMembers = this.byId("buttonCancelMembers");
			this._tAddMember = this.byId("tableSeleMember");
			this._bAddMember = this.byId("buttonAddMember");
			this._iSearchTeam = this.byId("inputSearchTeam");
			this._bSendEmail = this.byId("buttonSendSMS");
			this._bSendSMS = this.byId("buttonSendEmail");
			this._pSelectTeams = this.byId("panelSelectTeams");
			this._pSelectMembers = this.byId("panelSelectMembers");
			this._tTeams = this.byId("tableTeams");

		},
		onNavBack: function() {
			this.getOwnerComponent().getRouter().navTo("EventEdit", {
				EventID: this._getEventID
			});
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
			this._getEventID = oEvent.getParameter("arguments").EventID;
			this.onSetBusyCkEdtior();
			that.fetchTeamCode();
			// 			var tab = this.getView().byId("tabParents");
			// 			tab.setSelectedKey("tabTeams");

		},
		onBeforeRendering: function() {
			var othat = this;
			if (!this.loadingMdls) {
				if (sap.ui.getCore().getModel("EmailTemplatesTypes") === null || sap.ui.getCore().getModel("EmailTemplatesTypes") === undefined) {

				}
			}
			if (!this.loadingMdls) {
				if (sap.ui.getCore().getModel("mTeamList") === null || sap.ui.getCore().getModel("mTeamList") === undefined) {
					othat.fetchTeamCode();
				}
			}
		},
		onAfterRendering: function() {
			/*	var that = this;
			that.getView().byId("htmlSimpleTemplate").setVisible(true);
			var conf = this.getOwnerComponent().getManifestEntry("stryx.placeholder");
			var txt = this.getView().byId("emailEditor");
			var editor = CKEDITOR.instances[txt.sId];
			if (editor) {
				editor.destroy(true);
			}
			CKEDITOR.replace(txt.sId, conf[0]);*/
			/*
			var view = this.getView();
			view.addDelegate({
				onsapenter: function(e) {
					view.getController().searchAccountType();
				}
			});*/

		},
		onExit: function() {
			var selectType = this.getView().byId("templatesEmail").setValueState("None");
			selectType.destroy(true);
		},
		onChange: function(evt) {
			/*	var that = this;
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
			}*/
		},

		setSelBusy: function() {
			var othat = this;
			var selSeason = othat.getView().byId("templatesEmail");
			selSeason.setBusy(true);
		},
		onSetBusyCkEdtior: function() {
			/*	var ckEditorSeason = this.getView().byId("emailEditor");
			ckEditorSeason.setBusy(true);*/
		},
		///Here function for Cancel button
		onPressCancelEmail: function() {
			/*	var that = this;
			var ckFormater = that.getView().byId("emailEditor");
			var instance = CKEDITOR.instances[ckFormater.sId];
			this.getView().byId("htmlSimpleTemplate").setVisible(true);
			//var selectType = this.getView().byId("templatesEmail").setSelectedKey("Select Templates");
			//var status = this.getView().byId("emailStatus").setSelectedKey("Active");
			instance.setData("");*/
		},
		onAction: function() {
			var oPanel = this.getView().byId("htmlSimpleTemplate");
			oPanel.setBusy(true);
		},

		fetchTeamCode: function() {
			var that = this;
			that.showLoading(true);
			var teamSAL = new TeamsSAL();
			var filter = "$filter=U_Status%20eq%20'1'";
			teamSAL.fetchTeams(that, filter).done(function(obj) {
				//	that.getView().setModel(obj, "mTeamList");
				sap.ui.getCore().setModel(obj, "mTeamList");
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
			var inTeam = sap.ui.getCore().byId("inputSearchTeam").getValue().replace(/\s+/g, ' ');
			var teamSAL = new TeamsSAL();
			var tFilterCardType = encodeURI("$filter=contains(Name,'" + inTeam + "')");
			teamSAL.fetchTeams(that, tFilterCardType).done(function(obj) {
				sap.ui.getCore().setModel(obj, "mTeamList");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		searchAccountType: function() {
			var that = this;
			var addFilter, addFilterType = null;
			var criteria = "";

			if (this._selAccountType.getSelectedItem().getText() === "Select Type") {
				this._selAccountType.setValueState("Error");
				this.MessageToastShow("Please Select Type Name");
			} else {
				this._selAccountType.setValueState("None");
				var sMemLeadName = this._inATName.getValue().replace(/\s+/g, ' ');
				if (sMemLeadName !== "" || this._inATEmail.getValue() !== "" || this._dpATDOB.getValue() !== "" || this._inATMobile.getValue() !==
					"") {
					if (sMemLeadName.length > 0) {
						addFilterType = "CardName";
						addFilter = sMemLeadName;
						criteria += "contains(CardName,'" + sMemLeadName + "')";
						if (criteria !== "") {
							criteria += " or ";
						}
						var titleStr = this.titleCase(addFilter);
						criteria += "contains(CardName,'" + titleStr + "')";
					}
					if (this._inATEmail.getValue().length > 0) {
						addFilterType = "EmailAddress";
						addFilter = this._inATEmail.getValue();
						if (criteria !== "") {
							criteria += " or ";
						}
						criteria += "contains(EmailAddress,'" + this._inATEmail.getValue() + "')";
					}
					if (this._inATMobile.getValue().length > 0) {
						addFilter = this._inATMobile.getValue();
						addFilterType = "Cellular";
						if (criteria !== "") {
							criteria += " or ";
						}
						criteria += "contains(Cellular,'" + this._inATMobile.getValue() + "')";
					}
				} else {
					this.MessageToastShow("Please Enter Any Of The Fields Before Searching..");
				}

				if (this._inATMobile.getValue().length > 0 || sMemLeadName.length > 0 || this._inATEmail.getValue().length > 0 ||
					this._dpATDOB.getValue().length > 0) {
					var createAssessmentsSAL = new CreateAssessmentsSAL();

					if (this._selAccountType.getSelectedItem().getText() === "Lead") {

						var tFilterCardType = encodeURI("$filter=CardType eq 'cLid' and (" + criteria +
							")&$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress");
						createAssessmentsSAL.fetchBusinessPartners(that, tFilterCardType).done(function(obj) {

							that.getView().setModel(obj, "MemberLists");
							that.getView().setBusy(false);
							if (obj.oData.value.length > 0) {
								that._bAddMember.setEnabled(true);
							} else {
								that._bAddMember.setEnabled(false);
							}

						}).fail(function(err) {
							that.getView().setBusy(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
						});
					} else if (this._selAccountType.getSelectedItem().getText() === "Account") {

						var tFilterCardTypes = encodeURI("$filter=GroupCode eq 102 and CardType eq 'cCustomer' and (" + criteria +
							")&$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress");
						createAssessmentsSAL.fetchBusinessPartners(that, tFilterCardTypes).done(function(obj) {
							that.getView().setModel(obj, "MemberLists");
							that.getView().setBusy(false);
							if (obj.oData.value.length > 0) {
								that._bAddMember.setEnabled(true);
							} else {
								that._bAddMember.setEnabled(false);
							}
						}).fail(function(err) {
							that.getView().setBusy(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
						});
					} else {
						return false;
					}
				} else {
					return false;
				}

			}
		},
		fetchMemberName: function() {
			var that = this;
			var memSAL = new TeamsSAL();
			memSAL.fetchMember(this._getGTeamID).done(function(obj) {
				for (var i = 0; i < obj.oData.value.length; i++) {
					obj.oData.value[i].rec_status = 'n';
				}
				sap.ui.getCore().setModel(obj, "MembersList");
				that._oSchDialog.setBusy(false);

			}).fail(function(err) {
				that._oSchDialog.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		inviteTeamMembersCancel: function() {
			//	this._tAddTeam.setVisible(true);
			this._tAddTeamMember.setVisible(false);
			this._bSaveMembers.setVisible(false);
			this._bCancelMembers.setVisible(false);
			sap.ui.getCore().getModel("MembersList").setData({});
		},
		inviteTeamMembersSave: function(oEvent) {
			var soData;
			var memberListsMDL = this.getView().getModel("SelectedMemberLists");
			if (memberListsMDL === null || memberListsMDL === undefined) {
				var memMemberMD = this.createSelectedMemberModel();
				this.getView().setModel(memMemberMD, "SelectedMemberLists");
				memberListsMDL = this.getView().getModel("SelectedMemberLists");
			}
			soData = memberListsMDL.getData();
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length > 0) {
				aContexts.forEach(function(val1) {
					var tmpBody = JSON.parse(JSON.stringify(val1.getObject()));
					tmpBody.rec_status = "n";
					soData.value.push(tmpBody);
				});
				sap.ui.getCore().getModel("MembersList").setData({});
				this._bSendEmail.setEnabled(true);
				this._bSendSMS.setEnabled(true);
				memberListsMDL.refresh(true);
			} else {
				this._bSendEmail.setEnabled(false);
				this._bSendSMS.setEnabled(false);
			}

			/*	if (getgetSelected.length > 0) {
				for (var i = 0; i < getgetSelected.length; i++) {
					this._tAddTeamMember.getSelectedItems()[i].oBindingContexts.MembersList.getObject().rec_status = 'n';
					soData.value.push(this._tAddTeamMember.getSelectedItems()[i].oBindingContexts.MembersList.getObject());
				}
				memberListsMDL.setData(soData);
				sap.ui.getCore().getModel("MembersList").setData({});
				this._bSendEmail.setEnabled(true);
				this._bSendSMS.setEnabled(true);

			} else {
				this._bSendEmail.setEnabled(false);
				this._bSendSMS.setEnabled(false);
			}*/

		},
		inviteSelectedMemberSave: function() {
			var soData;
			var that = this;
			var memberListsMDL = this.getView().getModel("SelectedMemberLists");
			if (memberListsMDL === null || memberListsMDL === undefined) {
				var memMemberMD = this.createSelectedMemberModel();
				this.getView().setModel(memMemberMD, "SelectedMemberLists");
				memberListsMDL = this.getView().getModel("SelectedMemberLists");
			}
			soData = memberListsMDL.getData();
			var getgetSelected = this._tAddMember.getSelectedItems();
			var obj = {};
			if (getgetSelected.length > 0) {
				for (var i = 0; i < getgetSelected.length; i++) {
					obj.rec_status = 'n';
					obj.BusinessPartners = that._tAddMember.getSelectedItems()[i].oBindingContexts.mTeamList.getObject();
					soData.value.push(obj);
				}
				memberListsMDL.setData(soData);
				this.getView().getModel("MemberLists").setData({});
				this._bSendEmail.setEnabled(true);
				this._bSendSMS.setEnabled(true);
			} else {
				this._bSendEmail.setEnabled(false);
				this._bSendSMS.setEnabled(false);

			}

		},
		createSelectedMemberModel: function() {
			var memberMD = new JSONModel();
			memberMD.setProperty('/Code', 0);
			memberMD.setProperty('/value', []);
			memberMD.setProperty('/U_EventID', this._getEventID);

			return memberMD;
		},
		onPressDeleteMemberListItems: function(oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext("SelectedMemberLists");
			var mdl = ctx.getModel();
			var mdData = mdl.getData();
			var path = ctx.getPath();
			var index = parseInt(path.substring(path.lastIndexOf('/') + 1));
			mdData.value.splice(index, 1);
			mdl.setData(mdData);
			if (mdData.value.length > 0) {
				this._bSendEmail.setEnabled(true);
				this._bSendSMS.setEnabled(true);
			} else {
				this._bSendEmail.setEnabled(false);
				this._bSendSMS.setEnabled(false);
			}

		},
		selectedCreateInviteMembers: function() {
			var that = this;
			var getMDL = this.getView().getModel("SelectedMemberLists");
			that.showLoading(true);
			this.createInviteMembers(getMDL).done(function(obj) {
				that.clearAllModels();
				that.showLoading(false);

			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		clearAllModels: function() {
			var newjMdl = new JSONModel();
			this.getView().setModel(newjMdl, "SelectedMemberLists");
			this.getView().setModel(newjMdl, "mTeamList");
			sap.ui.getCore().setModel(newjMdl, "MembersList");
			this.getView().setModel(newjMdl, "MemberLists");

			this.getView().getModel("mTeamList").setData({});
			sap.ui.getCore().getModel("MembersList").setData({});
			this.getView().getModel("SelectedMemberLists").setData({});
			this.getView().getModel("MemberLists").setData({});
			this.getView().setModel(null, "SelectedMemberLists");

			//this.getView().getModel("MemberServices").refresh(true);
			this.clearTheValues();
		},
		onPressSendEmail: function() {
			var URL = "/ITSFZE/Development/stryxsports/services/NewSendEmail.xsjs";
			var obj = new Object();
			obj.Name = "Harish";
			obj.Password = "Pass12345";
			$.ajax({
				type: 'POST',
				url: URL,
				data: JSON.stringify(obj),
				crossDomain: true,
				success: function(response) {

				},
				error: function(xhr, status, error) {

				}
			});
		},
		clearTheValues: function() {
			this._selAccountType.setValueState("None");
			this._inATName.setValueState("None");
			this._inATEmail.setValueState("None");
			this._dpATDOB.setValueState("None");
			this._inATMobile.setValueState("None");
			this._iSearchTeam.setValueState("None");
			this._selAccountType.setSelectedKey("-1");
			this._selAccountType.setValue("");
			this._inATName.setValue("");
			this._inATEmail.setValue("");
			this._inATMobile.setValue("");
			this._iSearchTeam.setValue("");
		},
		selecteMemberLists: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("mTeamList");
			this._getGTeamID = oCtx.getProperty("Code");
			if (!this._oSchDialog) {
				this._oSchDialog = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.addInviteMembers", this);
			}
			this.getView().addDependent(this._oSchDialog);
			this._oSchDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());

			if (!this._oSchDialog.getMultiSelect()) {
				this._oSchDialog.setMultiSelect(true);
			}
			this._oSchDialog.open();
			this._oSchDialog.setBusy(true);
			this.fetchMemberName();
		},
		onSelectSType: function(evt) {

			var selKey = evt.getSource().getSelectedKey();
			switch (selKey) {
				case "Teams":
					this._pSelectTeams.setVisible(true);
					this._pSelectMembers.setVisible(false);
					break;
				case "Members":
					this._pSelectTeams.setVisible(false);
					this._pSelectMembers.setVisible(true);
					break;
			}
		},
		selecteMemberList: function() {
			if (!this._dialogTable) {
				this._dialogTable = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.inviteTeamMembers", this);
				this._dialogTable.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._dialogTable.setModel(this.getView().getModel());
			}
			this._dialogTable.open();

			//	sap.ui.getCore().byId("tblPList").setMode("MultiSelect");
			var obj = new JSONModel();
			sap.ui.getCore().setModel(obj, "mMembersList");
			//	getEle.shLeadName.setValue("");
			//getEle.shLeadDOB.setValue("");
			//	getEle.shLeadMobile.setValue("");
		},

		fetchIviteMembers: function() {
			var selectSearchType = null;
			var getEle = sap.ui.getCore().byId("selectSearchType");
			var getSelKey = getEle.getSelectedKey();
			if (getSelKey === "-1") {
				getEle.setValueState("Error");
			} else {
				getEle.setValueState("None");
				switch (getSelKey) {
					case "1":
						selectSearchType = "cCustomer";
						break;
					case "2":
						selectSearchType = "cLid";
						break;
					default:
						break;
				}
			}

			var that = this;
			var addFilter = null;
			var addFilterType = null;
			var criteria = "";

			var sLeadName = getEle.shLeadName.getValue().replace(/\s+/g, ' ');

			if (sLeadName !== "" || getEle.shLeadEmail.getValue() !== "" || getEle.shLeadMobile.getValue() !== "") {

				if (sLeadName.length > 0) {
					addFilterType = "CardName";
					addFilter = sLeadName;
					criteria += "contains(CardName,'" + sLeadName + "')";
					if (criteria !== "") {
						criteria += " or ";
					}
					var titleStr = this.titleCase(addFilter);
					criteria += "contains(CardName,'" + titleStr + "')";
				}
				if (getEle.shLeadEmail.getValue().length > 0) {
					addFilterType = "EmailAddress";
					addFilter = getEle.shLeadEmail.getValue();
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(EmailAddress,'" + getEle.shLeadEmail.getValue() + "')";
				}
				/*	if (getEle.shLeadDOB.getValue().length > 0) {
					var getDate = getEle.shLeadDOB.getValue();
					var dobDate = this.toDateFormat(getDate);
					addFilter = dobDate;
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(U_Dob,'" + dobDate + "')";
				}*/
				if (getEle.shLeadMobile.getValue().length > 0) {
					addFilter = getEle.shLeadMobile.getValue();
					addFilterType = "Cellular";
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(Cellular,'" + getEle.shLeadMobile.getValue() + "')";
				}
			}
			if (getEle.shLeadMobile.getValue().length > 0 || sLeadName.length > 0 || getEle.shLeadEmail.getValue().length > 0) //|| getEle.shLeadDOB.getValue().length > 0) 
			{
				that.getView().setBusy(true);
				var createAssessmentsSAL = new CreateAssessmentsSAL();
				var tFilterCardType = encodeURI("$filter=CardType eq '" + selectSearchType + "' and (" + criteria +
					")||$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress,U_Dob");
				createAssessmentsSAL.fetchBusinessPartners(that, tFilterCardType).done(function(obj) {
					sap.ui.getCore().setModel(obj, "mMembersList");
					that.getView().setBusy(false);

				}).fail(function(err) {
					that.getView().setBusy(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			} else {
				that.MessageToastShow("Please Enter Atleast One Filter Field");
			}

		},
		onPressSelectConfirm: function() {
			var btn = sap.ui.getCore().byId("pLDialogConfirm");
			btn.setEnabled(true);
		},
		onPressDialogConfirm: function() {
			var soData;
			var that = this;
			var memberListsMDL = this.getView().getModel("SelectedMemberLists");
			if (memberListsMDL === null || memberListsMDL === undefined) {
				var memMemberMD = this.createSelectedMemberModel();
				this.getView().setModel(memMemberMD, "SelectedMemberLists");
				memberListsMDL = this.getView().getModel("SelectedMemberLists");
			}
			soData = memberListsMDL.getData();
			var getgetSelected = sap.ui.getCore().byId("tblPList").getSelectedItems();
			var obj = {};
			if (getgetSelected.length > 0) {

				getgetSelected.forEach(function(val1) {

					var tmpBody = {};
					tmpBody.rec_status = "n";
					tmpBody.BusinessPartners = val1.oBindingContexts.mMembersList.getObject();
					soData.value.push(tmpBody);
				});
				memberListsMDL.refresh(true);
			//	this._bSendEmail.setEnabled(true);
			
			} else {
		
			}
			this.onPressDialogClose();
		},
		onPressDialogClose: function() {
			this._dialogTable.close();
		},
		onPressDialogMembersClose: function() {
			this._oSchDialog.close();
		},
		handlePressInviteMembers: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("mTeamList");
			this._getGTeamID = oCtx.getProperty("Code");
		}
	});
});