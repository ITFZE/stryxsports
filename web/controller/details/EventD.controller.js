sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/EventsSAL",
	"com/ss/app/StryxSports/controller/sal/LocationsSAL",
	"sap/ui/model/json/JSONModel", 'sap/m/Button', 'sap/m/Dialog',
	'sap/m/Text',
	"com/ss/app/StryxSports/controller/sal/TeamsSAL",
	'com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL',
	"com/ss/app/StryxSports/libs/ckeditor"
], function(EventsSAL, LocationsSAL, JSONModel, Button, Dialog, Text, TeamsSAL, CreateAssessmentsSAL) {
	"use strict";
	return EventsSAL.extend("com.ss.app.StryxSports.controller.details.EventsD", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("CreateEvent").attachMatched(this._onRouteMatched, this);
			oRouter.getRoute("EventEdit").attachMatched(this._onRouteEventEditMatched, this);
			this._iTitle = this.getView().byId("eInputTitle");
			this._dPStartDate = this.getView().byId("eDatePickerStartDate");
			this._dPEndDate = this.getView().byId("eDatePickerEndDate");
			this._tPStartTime = this.getView().byId("eTimePickerStartTime");
			this._tPEndTime = this.getView().byId("eTimePickerEndTime");
			this._cbLocation = this.getView().byId("eComboBoxLocation");
			this._bCreate = this.getView().byId("eButtonCreate");
			this._bCancel = this.getView().byId("eButtonCancel");
			this._bUpdateCancel = this.getView().byId("eUpdateButtonCancel");
			this._PEventDetails = this.getView().byId("eventPageDetails");
			this._bInviteMembers = this.getView().byId("eButtonInviteMembers");
			this._taContentEmail = this.getView().byId("emailEditor");
			this._tabBarEvant = this.getView().byId("tabEvant");
			this._ITFInvite = this.getView().byId("IconTabFilterInvite");
			//  Add Members //
			this._selAccountType = sap.ui.getCore().byId("selectAccountType");
			this._inATName = sap.ui.getCore().byId("inputIMName");
			this._inATEmail = sap.ui.getCore().byId("inputIMEmail");
			this._inATMobile = sap.ui.getCore().byId("inputIMMobile");

			//	this._emailTemplate = this.getView().byId("emailEditor");
			//	this._smsTemplate = this.getView().byId("simpleFormSMS");

		},

		onAfterRendering: function() {
			var conf = this.getOwnerComponent().getManifestEntry("stryx.placeholder");
			var txt = this.getView().byId("emailEditor");
			var editor = CKEDITOR.instances[txt.sId];
			if (editor) {
				editor.destroy(true);
			}
			CKEDITOR.replace(txt.sId, conf[0]);
			/*	CKEDITOR.replace(txt.sId,{
				extraPlugins: 'image2',
				config:conf[0]
			});*/
			this.createEventModel();
		},

		_onRouteMatched: function() {
			this.clearStateValue();
			this._PEventDetails.setTitle("Create Event");
			this._bCreate.setText("Create");
			this._bInviteMembers.setVisible(false);
			this._bCancel.setVisible(true);
			this._bUpdateCancel.setVisible(false);
			this._ITFInvite.setVisible(false);
			this.fetchLocationList();
			this.createEventModel();
		},

		_onRouteEventEditMatched: function(oEvt) {
			this.clearStateValue();
			this._bCreate.setText("Update");
			this._PEventDetails.setTitle("Edit Event");
			this._bInviteMembers.setVisible(true);
			this._bCancel.setVisible(false);
			this._bUpdateCancel.setVisible(true);
			this._ITFInvite.setVisible(true);
			var conf = this.getOwnerComponent().getManifestEntry("stryx.placeholder");
			var txt = this.getView().byId("emailEditor");
			var editor = CKEDITOR.instances[txt.sId];
			if (editor) {
				editor.destroy(true);
			}
			CKEDITOR.replace(txt.sId, conf[0]);
			/*	CKEDITOR.replace(txt.sId,{
				extraPlugins: 'image2',
				config:conf[0]
			});*/
			this.createEventModel();
			var that = this;
			this._eventID = oEvt.getParameter("arguments").EventID;
			$.when(that.fetchLocationList()).then(function(obj) {
				that.getView().setModel(obj, "mdlLocation");
				$.when(that.fetchEvent()).then(function() {});

			});
		},
		onPressCreateEvent: function() {
			var that = this;
			var instance = CKEDITOR.instances[this._taContentEmail.sId];
			var formatted = instance.getData();
			if (this._iTitle.getValue() === "") {
				this._iTitle.setValueState("Error");
			} else if (this._dPStartDate.getValue() === "") {
				this._dPStartDate.setValueState("Error");
				this._iTitle.setValueState("None");
			} else if (this._dPEndDate.getValue() === "") {
				this._dPEndDate.setValueState("Error");
				this._iTitle.setValueState("None");
				this._dPStartDate.setValueState("None");

			} else if (this._tPStartTime.getValue() === "") {
				this._tPStartTime.setValueState("Error");
				this._iTitle.setValueState("None");
				this._dPStartDate.setValueState("None");
				this._dPEndDate.setValueState("None");
			} else if (this._tPEndTime.getValue() === "") {
				this._tPEndTime.setValueState("Error");
				this._iTitle.setValueState("None");
				this._dPStartDate.setValueState("None");
				this._dPEndDate.setValueState("None");
				this._tPStartTime.setValueState("None");
			} else if (this._cbLocation.getSelectedKey() === "-1") {
				this._cbLocation.setValueState("Error");
				this._iTitle.setValueState("None");
				this._dPStartDate.setValueState("None");
				this._dPEndDate.setValueState("None");
				this._tPStartTime.setValueState("None");
				this._tPEndTime.setValueState("None");
			} else {
				this.clearStateValue();
				var getMDL = this.getView().getModel("CreateEvent");
				var getMDLData = getMDL.getData();
				var startDate = this.toDateFormat(getMDLData.U_StartDate);
				var endDate = this.toDateFormat(getMDLData.U_EndDate);
				getMDLData.U_StartDate = startDate;
				getMDLData.U_EndDate = endDate;
				getMDLData.Name = that._iTitle.getValue();
				getMDLData.U_EmailContent = formatted;
				this.showLoading(true);
				switch (this._PEventDetails.getTitle()) {
					case "Edit Event":
						that.updateEvent(getMDL).done(function() {
							that.showLoading(false);
							that.fetchEventLists();
							that.fetchErrorMessageOk("Update", "Success", " Updated Successfully");
							that.getRouter().navTo("CreateEvent", {
								PageID: 2
							});
						}).fail(function(err) {
							that.showLoading(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
						});

						break;
					case "Create Event":
						var filter = encodeURI("$filter=U_Title eq '" + getMDLData.U_Title + "'");
						this.fetchEvents(filter).done(function(getRes) {
							if (getRes.oData.value.length <= 0) {
								that.createEvent(getMDL).done(function(getObj) {
									that.showLoading(false);
									that.fetchEventLists();
									that.createEventModel();
									that._getCreateID = getObj.Code;
									that.fetchErrorMessageOk("Create Event", "Success", "Created Successfully");
									that.getRouter().navTo("EventEdit", {
										EventID: that._getCreateID
									});
									that.clearCkEditor();
								}).fail(function(err) {
									that.showLoading(false);
									that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
								});

							} else {
								that._iTitle.setValueState(sap.ui.core.ValueState.Error);
								that._iTitle.setValueStateText("Entered Year name already exists!");
								that.showLoading(false);
								that.fetchErrorMessageOk("Error", "Error", "Record already exixts");
							}

						}).fail(function(err) {
							that.showLoading(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
						});
						break;
				}
			}
		},
		fetchLocationList: function() {
			var that = this;
			this._cbLocation.setBusy(true);
			var elFilter = "$orderby=Code%20desc";
			this.fetchLocations(elFilter).done(function(obj) {
				that.getView().setModel(obj, "mdlLocation");
				var oItem = new sap.ui.core.Item({
					text: "Select The  Location",
					key: -1
				});
				that._cbLocation.insertItem(oItem, 0);
				that._cbLocation.setSelectedItem(oItem);
				that._cbLocation.setBusy(false);
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		createEventModel: function() {
			var setEvent = new Object();
			setEvent.Code = 0;
			setEvent.Name = '';
			setEvent.U_EmailContent = '';
			var eventMD = new JSONModel();
			eventMD.setData(setEvent);
			this.getView().setModel(eventMD, "CreateEvent");
		},
		onPressUpdateCancelEvent: function() {
			this.dialogStateNavTo("Note", "Warning", "Your Changes Will Be Lost", "CreateEvent");
		},
		onPressSaveCancelEvent: function() {
			this._iTitle.setValueState("None");
			this._dPStartDate.setValueState("None");
			this._dPEndDate.setValueState("None");
			this._tPStartTime.setValueState("None");
			this._tPEndTime.setValueState("None");
			this._cbLocation.setValueState("None");
			//SetValue Null
			this._iTitle.setValue("");
			this._dPStartDate.setValue("");
			this._dPEndDate.setValue("");
			this._tPStartTime.setValue("");
			this._tPEndTime.setValue("");
		},
		dialogStateNavTo: function(getTitle, getState, getMessage, getRouteName) {
			var that = this;
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
						that.getRouter().navTo(getRouteName, {
							PageID: 2
						});
						logoutDialog.close();
						that.clearCkEditor();
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
		clearStateValue: function() {
			this._iTitle.setValueState("None");
			this._dPStartDate.setValueState("None");
			this._dPEndDate.setValueState("None");
			this._tPStartTime.setValueState("None");
			this._tPEndTime.setValueState("None");
			this._cbLocation.setValueState("None");

		},
		navToViewEvent: function() {
			this.getRouter().navTo("ViewEvent", {
				EventEditID: 1
			});
		},
		fetchEventLists: function() {
			var that = this;
			that.showLoading(true);
			var elFilter = "$orderby=Code%20desc";
			this.fetchEvents(elFilter).done(function(getResponse) {
				sap.ui.getCore().setModel(getResponse, "eventsLists");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		fetchEvent: function() {
			var that = this;
			var instance = CKEDITOR.instances[this._taContentEmail.sId];
			that.showLoading(true);
			var elFilter = "$orderby=Code%20desc";
			this.fetchByIDEvents(elFilter, this._eventID).done(function(getResponse) {
				that.getView().setModel(getResponse, "CreateEvent");
				that.showLoading(false);
				instance.setData(getResponse.oData.U_EmailContent);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		clearCkEditor: function() {
			var setObj = new Object();
			setObj.Name = "";
			var instance = CKEDITOR.instances[this._taContentEmail.sId];
			instance.setData(setObj);
		},
		onSelectSType: function(evt) {
			var selKey = evt.getSource().getSelectedKey();

			switch (selKey) {
				case "Email":
					//	this._emailTemplate.setVisible(true);
					//	this._smsTemplate.setVisible(false);
					break;
				case "SMS":
					//	this._emailTemplate.setVisible(false);
					//	this._smsTemplate.setVisible(true);
					break;

			}
		},
		onSelectChanged: function() {
			var getSelected = this._tabBarEvant.getSelectedKey();
			var instance = CKEDITOR.instances[this._taContentEmail.sId];
			var formatted = instance.getData();
			var getMDL = this.getView().getModel("CreateEvent");
			var getMDLData = getMDL.getData();
			switch (getSelected) {
				case "tabEmail":
					var conf = this.getOwnerComponent().getManifestEntry("stryx.placeholder");
					var txt = this.getView().byId("emailEditor");
					var editor = CKEDITOR.instances[txt.sId];
					if (editor) {
						editor.destroy(true);
					}
					CKEDITOR.replace(txt.sId, conf[0]);
					instance = CKEDITOR.instances[this._taContentEmail.sId];
					instance.setData(getMDLData.U_EmailContent);
					break;
				case "tabSMS":
					getMDLData.U_EmailContent = formatted;
					getMDL.setData(getMDLData);
					break;
				default:
					break;
			}
		},
		selecteTeamMemberList: function() {
			if (!this._dialogTeamTable) {
				this._dialogTeamTable = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.inviteTeamMembers", this);
				this._dialogTeamTable.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._dialogTeamTable.setModel(this.getView().getModel());
			}
			this.fetchTeamCode();
			this._dialogTeamTable.open();
			sap.ui.getCore().byId("listTeamMembers").setBusy(true);

		},

		onPressDialogClose: function() {
			this._dialogTeamTable.close();
		},
		fetchIviteMembers: function() {
			var selectSearchType = null;
			var that = this;
			var addFilter = null;
			var addFilterType = null;
			var criteria = "";
			var _inATName = sap.ui.getCore().byId("inputIMName").getValue().replace(/\s+/g, ' ');
			var getEle = sap.ui.getCore().byId("selectSearchTypes");
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
			if (_inATName !== "" || sap.ui.getCore().byId("inputIMEmail").getValue() !== "" || sap.ui.getCore().byId("inputIMMobile").getValue() !==
				"") {

				if (_inATName.length > 0) {
					addFilterType = "CardName";
					addFilter = _inATName;
					criteria += "contains(CardName,'" + _inATName + "')";
					if (criteria !== "") {
						criteria += " or ";
					}
					var titleStr = this.titleCase(addFilter);
					criteria += "contains(CardName,'" + titleStr + "')";
				}
				if (sap.ui.getCore().byId("inputIMEmail").getValue().length > 0) {
					addFilterType = "EmailAddress";
					addFilter = this._inATEmail.getValue();
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(EmailAddress,'" + this._inATEmail.getValue() + "')";
				}
				if (sap.ui.getCore().byId("inputIMMobile").getValue().length > 0) {
					addFilter = this._inATMobile.getValue();
					addFilterType = "Cellular";
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(Cellular,'" + this._inATMobile.getValue() + "')";
				}
			}
			if (sap.ui.getCore().byId("inputIMMobile").length > 0 || _inATName.length > 0 || sap.ui.getCore().byId("inputIMEmail").getValue().length >
				0) {
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
		fetchMemberName: function() {
			var that = this;
			var navCon = sap.ui.getCore().byId("navCon");
			var memSAL = new TeamsSAL();
			sap.ui.getCore().byId("listTeamMembers").setBusy(true);
			var getMODL = sap.ui.getCore().getModel("mTeamList").getData();
			memSAL.fetchMember(this._getGTeamID).done(function(obj) {
				if (obj.oData.value.length > 0) {
					sap.ui.getCore().setModel(obj, "MembersList");
				} else {
					sap.ui.getCore().setModel(obj, "MembersList");
					sap.ui.getCore().byId("btnAddInvite").setEnabled(false);
				}
				sap.ui.getCore().byId("listTeamMembers").setBusy(false);
				sap.ui.getCore().byId("checkBoxSelectAll").setSelected(false);

				navCon.to(sap.ui.getCore().byId("p2"));

			}).fail(function(err) {
				sap.ui.getCore().byId("listTeamMembers").setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchTeamCode: function() {
			var that = this;
			//	that.showLoading(true);
			var teamSAL = new TeamsSAL();
			var filter = "$filter=U_Status eq '1'";
			teamSAL.fetchTeams(that, filter).done(function(obj) {
				sap.ui.getCore().setModel(obj, "mTeamList");
				sap.ui.getCore().byId("listTeamMembers").setBusy(false);
			}).fail(function(err) {
				sap.ui.getCore().byId("listTeamMembers").setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
			//	that.showLoading(false);
		},
		selecteMemberLists: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("mTeamList");
			var path = oCtx.getPath();
			this._indexTL = parseInt(path.substring(path.lastIndexOf('/') + 1));
			this._getGTeamID = oCtx.getProperty("Code");
			this.fetchMemberName();
		},
		handlePressInviteMembers: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("mTeamList");
			this._getGTeamID = oCtx.getProperty("Code");

			this.fetchMemberName();

		},
		onBack: function() {
			var navCon = sap.ui.getCore().byId("navCon");
			navCon.back();
		},
		listSelectMem: function(evt) {
			var selectLength = evt.getSource().getSelectedContexts.length;
			if (selectLength !== 0) {
				sap.ui.getCore().byId("btnAddInvite").setEnabled(true);
			} else {
				sap.ui.getCore().byId("btnAddInvite").setEnabled(false);
			}
		},
		createSelectedMemberModel: function() {
			var memberMD = new JSONModel();
			memberMD.setProperty('/Code', 0);
			memberMD.setProperty('/value', []);
			memberMD.setProperty('/U_EventID', this._eventID);

			return memberMD;
		},
		onPressInviteTeamMembers: function() {
			var soData;
			var select = sap.ui.getCore().byId("listSelectInviteMembers").getSelectedItems();
			var memberListsMDL = this.getView().getModel("SelectedMemberLists");
			sap.ui.getCore().byId("listSelectInviteMembers").setBusy(true);
			if (memberListsMDL === null || memberListsMDL === undefined) {
				var memMemberMD = this.createSelectedMemberModel();
				this.getView().setModel(memMemberMD, "SelectedMemberLists");
				memberListsMDL = this.getView().getModel("SelectedMemberLists");
			}
			soData = memberListsMDL.getData();
			if (select.length > 0) {
				select.forEach(function(values) {
					soData.value.push(values.oBindingContexts.MembersList.getObject());
				});
				sap.ui.getCore().getModel("MembersList").setData({});
				memberListsMDL.refresh(true);
				this._bInviteMembers.setEnabled(true);
			} else {
				this._bInviteMembers.setEnabled(false);
			}
			sap.ui.getCore().byId("checkBoxSelectAll").setSelected(false);
			sap.ui.getCore().byId("listSelectInviteMembers").setBusy(false);
			this.onBack();
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
				this._bInviteMembers.setEnabled(true);
			} else {
				this._bInviteMembers.setEnabled(false);
			}

		},
		selectAll: function(evt) {
			if (evt.mParameters.selected === false) {
				sap.ui.getCore().byId("listSelectInviteMembers").removeSelections(true);
			} else {
				sap.ui.getCore().byId("listSelectInviteMembers").selectAll(true);
			}
			sap.ui.getCore().getModel("MembersList").refresh(true);
		},
		selecteMemberList: function() {
			if (!this._dialogMemberTable) {
				this._dialogMemberTable = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.addInviteMembers", this);
				this._dialogMemberTable.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._dialogMemberTable.setModel(this.getView().getModel());
			}
			this._dialogMemberTable.open();
		},
		onPressDialogConfirm: function() {
			var soData;

			var memberListsMDL = this.getView().getModel("SelectedMemberLists");
			if (memberListsMDL === null || memberListsMDL === undefined) {
				var memMemberMD = this.createSelectedMemberModel();
				this.getView().setModel(memMemberMD, "SelectedMemberLists");
				memberListsMDL = this.getView().getModel("SelectedMemberLists");
			}
			soData = memberListsMDL.getData();
			var getgetSelected = sap.ui.getCore().byId("tblPList").getSelectedItems();
			if (getgetSelected.length > 0) {
				getgetSelected.forEach(function(values) {
					var tmpBody = {};
					tmpBody.BusinessPartners = values.oBindingContexts.mMembersList.getObject();
					soData.value.push(tmpBody);
				});
				memberListsMDL.refresh(true);
				this._bInviteMembers.setEnabled(true);

			} else {
				this._bInviteMembers.setEnabled(false);

			}
			this._dialogMemberTable.close();
		},
		onPressDialogMembersClose: function() {
			this._dialogMemberTable.close();
		},
		onPressSaveInvitedMembers: function() {
			var that = this;
			var getMDL = this.getView().getModel("SelectedMemberLists");
			that.showLoading(true);
			if (getMDL !== undefined) {
				this.createInviteMembers(getMDL).done(function(obj) {
					that.clearAllModels();
					that.showLoading(false);
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			}

		},
		clearAllModels: function() {
			var newjMdl = new JSONModel();
			this.getView().setModel(newjMdl, "SelectedMemberLists");
			this.getView().getModel("SelectedMemberLists").setData({});
			this.getView().setModel(null, "SelectedMemberLists");
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
		}

	});
});