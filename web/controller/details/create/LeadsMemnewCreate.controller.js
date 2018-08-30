sap.ui.define([
  "sap/ui/model/json/JSONModel",
  'sap/m/Button',
   "com/ss/app/StryxSports/controller/sal/CreateLeadsSAL",
	"com/ss/app/StryxSports/controller/sal/SportsSAL",
	"com/ss/app/StryxSports/controller/sal/CreateMembershipSAL",
	"com/ss/app/StryxSports/controller/sal/LocationsSAL",
	'sap/m/Dialog',
	'sap/m/Text'
], function(JSONModel, Button, CreateLeadsSAL, SportsSAL, CreateMembershipSAL, LocationsSAL, Dialog, Text) {
	"use strict";
	return CreateLeadsSAL.extend("com.ss.app.StryxSports.controller.details.create.LeadsMemnewCreate", {
		onInit: function() {
			this._pageID = "";
			this._setViewLevel = "";
			this._getLeadID = "";
			var oRouter = this.getRouter();
			oRouter.getRoute("LeadsMemnewCreate").attachMatched(this._onRouteMatched, this);
			oRouter.getRoute("EditLead").attachMatched(this._onRouteEditMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		onBeforeRendering: function() {},
		_onRouteEditMatched: function(oEvt) {
			var that = this;
			that.showLoading(true);
			var getCardCode = oEvt.getParameter("arguments").LeadID;
			this._getLeadID = getCardCode;
			this._getPageID = oEvt.getParameter("arguments").PageID;
			var getEles = oEvt.getParameters();
			this._setViewLevel = getEles.config.viewLevel;
			that.createMemberModel();
			that.clearModels();
			var getEle = this.leadsVariables();
			getEle.lmMemNext.setVisible(false);
			var obj = getEle.wizardID;
			obj.discardProgress(getEle.StepOne);
			getEle.lmPage.setTitle("Edit Lead");
			var memMD = that.getView().getModel("createMembershipModel");
			that.fetchNationality();
			that.fetchSchoolName();
			getEle.addSportsTable.setBusy(true);
			$.when(that.fetchMemberById(memMD, getCardCode)).then(function(objs) {
				that.getView().setModel(objs, "createMembershipModel");
				that.updateStatus();
				that.showLoading(false);
				$.when(that.fetchSportsDetails(getCardCode)).then(function() {
					$.when(that.fetchLeadLocationDetails(getCardCode)).then(function() {
						return;
					});
				});
			});

		},
		_onRouteMatched: function(oEvt) {
			var that = this;
			that.showLoading(true);
			var getEles = oEvt.getParameters();
			this._setViewLevel = getEles.config.viewLevel;
			this._getPageID = oEvt.getParameter("arguments").PageID;
			that.createMemberModel();
			that.clearModels();
			var getEle = this.leadsVariables();
			getEle.lncHowdid.setValue("Select The How Did You Hear About Us");
			getEle.lmMemNext.setVisible(true);
			var obj = getEle.wizardID;
			obj.discardProgress(getEle.StepOne);
			getEle.lmPage.setTitle("Create Lead");
			$.when(that.fetchSchoolName()).then(function() {
				$.when(that.fetchNationality()).then(function() {
					that.showLoading(false);
					that.updateStatus();
					return;
				});
			});

		},
		createMemberModel: function() {
			var memberMD = new JSONModel();
			var conf = this.getOwnerComponent().getManifestEntry("stryx.account.series");
			this.createJSONModelMembership(memberMD, "");
			memberMD.setProperty('/Father');
			memberMD.setProperty('/Mother');
			memberMD.setProperty('/Guardian');
			memberMD.setProperty('/Series', conf.child);
			var fMD = new JSONModel();
			this.createJSONModelMembership(fMD);
			fMD.setProperty('/Series', conf.adult);
			var mMD = new JSONModel();
			this.createJSONModelMembership(mMD);
			mMD.setProperty('/Series', conf.adult);
			var gMD = new JSONModel();
			this.createJSONModelMembership(gMD);
			gMD.setProperty('/Series', conf.adult);
			var obj = memberMD.getData();
			obj.Father = fMD.getData();
			obj.Mother = mMD.getData();
			obj.Guardian = gMD.getData();
			this.getView().setModel(memberMD, "createMembershipModel");
		},
		createJSONModelMembership: function(md) {
			md.setProperty('/CardCode', "");
			md.setProperty('/CardName', "");
			md.setProperty('/CardType', "cLid");
			md.setProperty('/GroupCode', 102);
			md.setProperty('/FreeText', "");
			md.setProperty('/U_Dob');
			md.setProperty('/U_School', "");
			md.setProperty('/U_Nationality', "");
			md.setProperty('/U_Gender', 'Male');
			md.setProperty('/Cellular', "");
			md.setProperty('/FatherCard', "");
			md.setProperty('/U_Father', "");
			md.setProperty('/U_Mother', "");
			md.setProperty('/U_Gardian', "");
			md.setProperty('/U_SS_MEMBER_TYPE', "");
			md.setProperty('/sports', []);
			md.setProperty('/locations', []);
			md.setProperty('/rec_status');
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},

		ValidateMembership: function() {
			var that = this;
			var jModel = this.getView().getModel("createMembershipModel");
			this.showLoading(true);
			var jData = jModel.getData();
			var name = jData.CardName;
			var dob = this.toDateFormat(jData.U_Dob);
			var filt = "$filter=(CardName eq '" + name.toLowerCase() + "' or CardName eq '" + that.titleCase(name) + "') and U_Dob eq '" + dob +
				"'";
			var createMembershipSAL = new CreateMembershipSAL();
			createMembershipSAL.fetchBusinessPartners(this, filt).done(function() {
				var updatememnew = that.oBundle("UpdatedSuccessfully");
				that.showLoading(false);
				that.fetchErrorMessageOk("UpdateMembership", "Success", updatememnew);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
			this.updateBusinessPartner(jModel, "Child").done(function(response) {
				var ret = response;
				jModel.setData(ret);
				that.updateStatus();
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		getVariablesParentFatherDetails: function() {
			var items = {
				fatherFirstName: this.getView().byId("ParentFirstName"),
				fatherNationlality: this.getView().byId("ParentNationality"),
				fatherEmail: this.getView().byId("ParentEmail"),
				fatherOccupation: this.getView().byId("ParentOccupation"),
				fatherPhone: this.getView().byId("ParentMobile")
			};
			return items;
		},
		onPressSaveFatherCreate: function() {
			var letters = /^[\sa-zA-Z]+$/;
			var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			var getVariables = this.getVariablesParentFatherDetails();
			if (getVariables.fatherFirstName.getValue() === "") {
				getVariables.fatherFirstName.setValueState("Error");
			} else if (!getVariables.fatherFirstName.getValue().match(letters)) {
				this.MessageToastShow("Please Enter Aplabets");

			} else if (getVariables.fatherPhone.getValue() === "") {
				getVariables.fatherFirstName.setValueState("None");
				getVariables.fatherPhone.setValueState("Error");

			} else if (getVariables.fatherEmail.getValue() === "") {
				getVariables.fatherPhone.setValueState("None");
				getVariables.fatherEmail.setValueState("Error");
			} else if (!getVariables.fatherEmail.getValue().match(rexMail)) {
				this.MessageToastShow("Please Enter Valid Email Address");
				getVariables.fatherEmail.setValueState("Error");

			} else {
				getVariables.fatherFirstName.setValueState("None");
				getVariables.fatherEmail.setValueState("None");
				getVariables.fatherPhone.setValueState("None");
				this.onPressFatherValidGroup();
			}
		},
		getVariablesParentMotherDetails: function() {
			var items = {
				motherFirstName: this.getView().byId("motherFirstName"),
				motherNationlality: this.getView().byId("motherNationality"),
				motherEmail: this.getView().byId("motherEmail"),
				motherOccupation: this.getView().byId("motherOccupation"),
				motherPhone: this.getView().byId("motherPhone")
			};
			return items;
		},
		onPressSaveMotherCreate: function() {
			var letters = /^[\sa-zA-Z]+$/;
			var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			var getVariables = this.getVariablesParentMotherDetails();
			if (getVariables.motherFirstName.getValue() === "") {
				getVariables.motherFirstName.setValueState("Error");
			} else if (!getVariables.motherFirstName.getValue().match(letters)) {
				this.MessageToastShow("Please Enter Alphabets");

			} else if (getVariables.motherPhone.getValue() === "") {
				getVariables.motherFirstName.setValueState("None");
				getVariables.motherPhone.setValueState("Error");

			} else if (getVariables.motherEmail.getValue() === "") {
				getVariables.motherPhone.setValueState("None");
				getVariables.motherEmail.setValueState("Error");
			} else if (!getVariables.motherEmail.getValue().match(rexMail)) {
				this.MessageToastShow("Please Enter Valid Email Address");
				getVariables.motherEmail.setValueState("Error");
			} else {

				getVariables.motherFirstName.setValueState("None");
				getVariables.motherEmail.setValueState("None");
				getVariables.motherPhone.setValueState("None");
				this.onPressMotherGroup();
			}
		},
		getVariablesParentGuardianDetails: function() {
			var items = {
				GuardianFirstName: this.getView().byId("guardianFirstName"),
				GuardianNationlality: this.getView().byId("guardianNationlaity"),
				GuardianEmail: this.getView().byId("guardianEmail"),
				GuardianOccupation: this.getView().byId("guardianOccupation"),
				GuardianPhone: this.getView().byId("guardianPhone")
			};
			return items;
		},
		onPressSaveGuardianCreate: function() {
			var letters = /^[\sa-zA-Z]+$/;
			var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			var getVariablesGardian = this.getVariablesParentGuardianDetails();
			if (getVariablesGardian.GuardianFirstName.getValue() === "") {
				getVariablesGardian.GuardianFirstName.setValueState("Error");
			} else if (!getVariablesGardian.GuardianFirstName.getValue().match(letters)) {
				this.MessageToastShow("Please Enter Alphabets");

			} else if (getVariablesGardian.GuardianPhone.getValue() === "") {
				getVariablesGardian.GuardianFirstName.setValueState("None");
				getVariablesGardian.GuardianPhone.setValueState("Error");

			} else if (getVariablesGardian.GuardianEmail.getValue() === "") {
				getVariablesGardian.GuardianPhone.setValueState("None");
				getVariablesGardian.GuardianEmail.setValueState("Error");
			} else if (!getVariablesGardian.GuardianEmail.getValue().match(rexMail)) {
				this.MessageToastShow("Please Enter Valid Email Address");
				getVariablesGardian.GuardianEmail.setValueState("Error");

			} else {
				getVariablesGardian.GuardianFirstName.setValueState("None");
				getVariablesGardian.GuardianEmail.setValueState("None");
				getVariablesGardian.GuardianPhone.setValueState("None");
				this.onPressGuardian();
			}
		},
		getVariablesParentExisting: function() {
			var items = {
				shParentName: sap.ui.getCore().byId("pLeadName"),
				shParentEmail: sap.ui.getCore().byId("pLeadEmail"),
				shParentDOB: sap.ui.getCore().byId("pLeadDOB"),
				shParentMobile: sap.ui.getCore().byId("pLeadMobile"),
				shParentNameTable: sap.ui.getCore().byId("pLParentNameTable"),
				shParentBlockLayoutCellTable: sap.ui.getCore().byId("shParentBlockLayoutCellTable"),
				shDialogConfirm: sap.ui.getCore().byId("pLDialogConfirm")
			};
			return items;
		},
		onPressSearchExisting: function() {
			if (!this._dialogParentExistingTable) {
				this._dialogParentExistingTable = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.addParentExistingTable", this);
				this._dialogParentExistingTable.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._dialogParentExistingTable.setModel(this.getView().getModel());
			}
			var obj = new JSONModel();
			sap.ui.getCore().setModel(obj, "ParentExistingList");
			this.clearVariablesbValue();
			this._dialogParentExistingTable.open();
		},
		onPressSelectConfirm: function() {
			var btn = sap.ui.getCore().byId("pLDialogConfirm");
			btn.setEnabled(true);
		},
		onPressDialogConfirm: function() {
			var oTable = sap.ui.getCore().byId("tblPList");
			var selItem = oTable.getSelectedItem();
			if (selItem !== null) {
				var ctx = selItem.getBindingContext("ParentExistingList");
				var obj = ctx.getObject();
				var memMD = this.getView().getModel("createMembershipModel").getData();
				var tab = this.getView().byId("tabParents");
				var selKey = tab.getSelectedKey();
				switch (selKey) {
					case "Father":
						this.mapJsonData(obj, memMD.Father);
						break;
					case "Mother":
						this.mapJsonData(obj, memMD.Mother);
						break;
					case "Guardian":
						this.mapJsonData(obj, memMD.Guardian);
						break;
				}
				this.getView().getModel("createMembershipModel").setData(memMD);
				this.clearVariablesbValue();
				this._dialogParentExistingTable.close();
				this.updateStatus();
			}
		},
		onPressDialogClose: function() {
			this.clearVariablesbValue();
			this._dialogParentExistingTable.close();
		},
		onPressSearchParents: function() {
			this.fetchParentExisting();
		},
		fetchParentExisting: function() {
			var that = this;
			var addFilter, addFilterType = null;
			var criteria = "";
			var getEle = this.getVariablesParentExisting();
			if (getEle.shParentName.getValue() !== "" || getEle.shParentEmail.getValue() !== "" || getEle.shParentDOB.getValue() !== "" || getEle
				.shParentMobile.getValue() !== "") {

				if (getEle.shParentName.getValue().length > 0) {
					addFilterType = "CardName";
					addFilter = getEle.shParentName.getValue();
					criteria += "contains(CardName,'" + addFilter + "')";
					if (criteria !== "") {
						criteria += " or ";
					}
					var titleStr = this.titleCase(addFilter);
					criteria += "contains(CardName,'" + titleStr + "')";
				}
				if (getEle.shParentEmail.getValue().length > 0) {
					addFilterType = "EmailAddress";
					addFilter = getEle.shParentEmail.getValue();
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(EmailAddress,'" + getEle.shParentEmail.getValue() + "')";

				}
				if (getEle.shParentDOB.getValue().length > 0) {
					addFilter = getEle.shParentDOB.getValue();
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(U_Dob,'" + getEle.shParentDOB.getValue() + "')";
				}
				if (getEle.shParentMobile.getValue().length > 0) {
					addFilter = getEle.shParentMobile.getValue();
					addFilterType = "Cellular";
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(Cellular,'" + getEle.shParentMobile.getValue() + "')";
				}
			}
			if (getEle.shParentName.getValue().length > 0 || getEle.shParentEmail.getValue().length > 0 || getEle.shParentDOB
				.getValue().length > 0 || getEle.shParentMobile.getValue().length > 0) {
				getEle.shParentBlockLayoutCellTable.setBusy(true);
				var createMembershipSAL = new CreateMembershipSAL();
				var tFilterCardType = encodeURI("$filter=CardType eq 'cCustomer' and GroupCode eq 103 and " + criteria +
					"||$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress,U_Dob,U_School,U_Nationality,U_Gender,Notes,U_Father,U_Mother,U_Gardian,GroupCode"
				);
				createMembershipSAL.fetchBusinessPartners(that, tFilterCardType).done(function(obj) {
					sap.ui.getCore().setModel(obj, "ParentExistingList");
					getEle.shParentBlockLayoutCellTable.setBusy(false);

				}).fail(function(err) {
					getEle.shParentBlockLayoutCellTable.setBusy(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			} else {

			}
		},
		setMonthFormatterItemDetails: function(getValue) {
			var getQuantity = this.getView().byId("memberQuantity");
			if (getValue !== null || getValue !== undefined) {
				if (getValue !== "Months") {
					getQuantity.setEnabled(true);

				} else {
					getQuantity.setEnabled(false);
				}
			}
			return getValue;
		},
		leadsVariables: function() {
			var items = {
				lmTypes: this.getView().byId("lmType"),
				lmcSchoolName: this.getView().byId("lmcSchoolName"),
				lmcNationality: this.getView().byId("lmcNationality"),
				lncHowdid: this.getView().byId("lncHowdid"),
				lncPLView: this.getView().byId("lncPLView"),
				lmcPhone: this.getView().byId("lmcPhone"),
				lmcEmergencyMobile: this.getView().byId("lmcEmergencyMobile"),
				lmcAdditional: this.getView().byId("lmcAdditional"),
				lmcAdditionlInformaion: this.getView().byId("lmcAdditionlInformaion"),
				lmcName: this.getView().byId("lmcName"),
				lmcNameDOB: this.getView().byId("lmcNameDOB"),
				lmTabParentsc: this.getView().byId("tabParents"),
				lmMemNext: this.getView().byId("btnMNext"),
				createSave: this.getView().byId("btnLCSav"),
				saveNext: this.getView().byId("btnMNext"),
				saveFather: this.getView().byId("btnCFat"),
				saveMother: this.getView().byId("btnCMot"),
				saveGardian: this.getView().byId("btnCGem"),
				lmPage: this.getView().byId("pageCreateLeads"),
				wizardID: this.getView().byId("createWizardParent"),
				createActivity: this.getView().byId("btnLCCreateActivity"),
				goBack: this.getView().byId("btnLCBack"),
				StepOne: this.getView().byId("ParticipantDetailsID"),
				StepTwo: this.getView().byId("ParentDetailsID"),
				addSportsTable: this.getView().byId("addSportsCategoryTable"),
				lmcInputEmail: this.getView().byId("lmcInputEmail")

			};
			return items;
		},
		selectedType: function() {
			var getEle = this.leadsVariables();
			var getlmTypesCode = getEle.lmTypes;
			if (getlmTypesCode.getSelectedKey() !== "-1" && getlmTypesCode.getValue() !== "") {
				getlmTypesCode.setValueState("None");
			} else {
				getlmTypesCode.setValueState("Error");

			}

		},
		onPressSaveLeadCreate: function() {
			var getEle = this.leadsVariables();
			if (getEle.lmTypes.getSelectedKey() === "-1" || getEle.lmTypes.getSelectedKey() === "") {
				getEle.lmTypes.setValueState("Error");
			} else if (getEle.lmTypes.getSelectedKey() === "1") {
				this.onPressSaveLeadChild();
			} else {
				this.onPressSaveLeadAdult();
			}
		},
		onPressSaveLeadChild: function() {
			var getEle = this.leadsVariables();
			var letters = /^[\sa-zA-Z]+$/;
			var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			var date = getEle.lmcNameDOB.getValue();
			var cEndDate = this.toDateFormat(date);

			var givendate = new Date(cEndDate);
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			if (getEle.lmTypes.getSelectedKey() === "-1" || getEle.lmTypes.getSelectedKey() === "") {
				getEle.lmTypes.setValueState("Error");
			} else if (getEle.lmcName.getValue() === "") {
				getEle.lmTypes.setValueState("None");
				getEle.lmcName.setValueState("Error");
			} else if (!getEle.lmcName.getValue().match(letters)) {
				getEle.lmTypes.setValueState("None");
				this.MessageToastShow("Please Enter Alphabets");
				
			}  else if (date === "") {
				getEle.lmcName.setValueState("None");
				getEle.lmcNameDOB.setValueState("Error");
			} else if (givendate >= today) {
				getEle.lmcNameDOB.setValueState("Error");

				this.MessageToastShow("Please Enter Date less than the current Date");
			}
			else if (getEle.lmcNationality.getValue() === "" || getEle.lmcNationality.getValue() === "Select The Nationality" || getEle.lmcNationality
				.getValue() === "-No Country-") {
                getEle.lmcNameDOB.setValueState("None");
				getEle.lmcEmergencyMobile.setValueState("None");
				getEle.lmcNationality.setValueState("Error");
			} else if (getEle.lncHowdid.getValue() === "Select The How Did You Hear About Us" || getEle.lncHowdid.getValue() === "") {
				getEle.lmcNationality.setValueState("None");
				getEle.lncHowdid.setValueState("Error");
			} else if (getEle.lmcSchoolName.getValue() === "Select The School" || getEle.lmcSchoolName.getValue() === "") {
				getEle.lncHowdid.setValueState("None");
				getEle.lmcSchoolName.setValueState("Error");
			} else {
				getEle.lmcSchoolName.setValueState("None");
				getEle.lmTypes.setValueState("None");
				getEle.lmTypes.setValueState("None");
				getEle.lmcName.setValueState("None");
				getEle.lmcEmergencyMobile.setValueState("None");
				getEle.lmcNationality.setValueState("None");
				getEle.lncHowdid.setValueState("None");
				this.clearStatueValuesLead();
				var getSelTypes = getEle.lmTypes.getSelectedKey();
				if (getSelTypes === "1") {
					this.clearStatueValuesLead();
					this.createChild();
					this._createMsM = "Child";
				} else {
					this.clearStatueValuesLead();
					this.createChild();
					this._createMsM = "Adult";
				}
			}

		},
		onPressSaveLeadAdult: function() {
			var getEle = this.leadsVariables();
			var letters = /^[\sa-zA-Z]+$/;
			var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			var date = getEle.lmcNameDOB.getValue();
			var cEndDate = this.toDateFormat(date);

			var givendate = new Date(cEndDate);
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			if (getEle.lmTypes.getSelectedKey() === "-1" || getEle.lmTypes.getSelectedKey() === "") {
				getEle.lmTypes.setValueState("Error");
			} else if (getEle.lmcName.getValue() === "") {
				getEle.lmTypes.setValueState("None");
				getEle.lmcName.setValueState("Error");
			} else if (!getEle.lmcName.getValue().match(letters)) {
				getEle.lmTypes.setValueState("None");
				this.MessageToastShow("Please Enter Alphabets");
			} else if (date === "") {
				getEle.lmcName.setValueState("None");
				getEle.lmcNameDOB.setValueState("Error");
			} else if (givendate >= today) {
				getEle.lmcName.setValueState("None");
				this.MessageToastShow("Please Enter Date less than the current Date");
			} else if (getEle.lmcInputEmail.getValue() === "") {
				getEle.lmcNameDOB.setValueState("None");
				getEle.lmcInputEmail.setValueState("Error");
			} else if (!getEle.lmcInputEmail.getValue().match(rexMail)) {
				this.MessageToastShow("Please Enter Valid Email Address");

			} else if (getEle.lmcEmergencyMobile.getValue() === "") {
				getEle.lmcInputEmail.setValueState("None");
				getEle.lmcEmergencyMobile.setValueState("Error");
			} else if (getEle.lmcNationality.getValue() === "" || getEle.lmcNationality.getValue() === "Select The Nationality" || getEle.lmcNationality
				.getValue() === "-No Country-") {
				getEle.lmcEmergencyMobile.setValueState("None");
				getEle.lmcNationality.setValueState("Error");
			} else if (getEle.lncHowdid.getValue() === "Select The How Did You Hear About Us" || getEle.lncHowdid.getValue() === "") {
				getEle.lmcNationality.setValueState("None");
				getEle.lncHowdid.setValueState("Error");
			} else if (getEle.lmcSchoolName.getValue() === "Select The School" || getEle.lmcSchoolName.getValue() === "") {
				getEle.lncHowdid.setValueState("None");
				getEle.lmcSchoolName.setValueState("Error");
			} else {
				getEle.lmcSchoolName.setValueState("None");
				getEle.lmTypes.setValueState("None");
				getEle.lmTypes.setValueState("None");
				getEle.lmcName.setValueState("None");
				getEle.lmcEmergencyMobile.setValueState("None");
				getEle.lmcNationality.setValueState("None");
				getEle.lncHowdid.setValueState("None");
				this.clearStatueValuesLead();
				var getSelTypes = getEle.lmTypes.getSelectedKey();
				if (getSelTypes === "1") {
					this.clearStatueValuesLead();
					this.createChild();
					this._createMsM = "Child";
				} else {
					this.clearStatueValuesLead();
					this.createChild();
					this._createMsM = "Adult";
				}
			}
		},
		createChild: function() {
			var that = this;
			var getEle = this.leadsVariables();
			var memModel = this.getView().getModel("createMembershipModel");
			var mData = memModel.getData();
			var getdobDate = mData.U_Dob;
			mData.CardType = "cLid";
		    var dobDate = this.toDateFormat(getdobDate);
			try {
				memModel.setProperty("/U_Dob", dobDate);
			} catch (err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			}
			memModel.refresh(true);
			that.showLoading(true);

			if (mData.CardCode !== "") {
				that.updateBusinessPartnersByID(memModel, mData.CardCode, "Child");

			} else {
				that.createBusinessPartnersChild(memModel).done(function(obj) {
					mData.CardCode = obj.CardCode;
					that._getLeadID = obj.CardCode;
					var createmessage = that.oBundle("CreatedSuccessfully");
					getEle.lmMemNext.setEnabled(true);
					memModel.setData(obj);
					that.showLoading(false);
					memModel.refresh(true);
					that.updateStatus();
					that.fetchErrorMessageOk(that._createMsM, "Success", createmessage);
				}).fail(function(err) {
					getEle.lmMemNext.setEnabled(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			}
		},
		// 		onPressFatherValidGroup: function() {
		// 			var that = this;
		// 			var memModel = this.getView().getModel("createMembershipModel");
		// 			var mData = memModel.getData();
		// 			var getdobDate = mData.U_Dob;
		// 			var dobDate = this.toDateFormat(getdobDate);
		// 			try {
		// 				memModel.setProperty("/U_Dob", dobDate);
		// 			} catch (err) {
		// 				that.showLoading(false);
		// 				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
		// 			}
		// 			memModel.refresh(true);
		// 			this.createBusinessPartnersChild(memModel).done(function(obj) {
		// 				var createmessage = that.oBundle("CreatedSuccessfully");
		// 				that.showLoading(false);
		// 				that.fetchMessageOk("Create Father", "Success", createmessage, "LeadsMemnewCreate");
		// 			}).fail(function(err) {
		// 				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
		// 			});
		// 		},
		onPressFatherValidGroup: function() {
			var that = this;
			var memModel = that.getView().getModel("createMembershipModel");
			var mData = memModel.getData();
			var getdobDate = mData.U_Dob;
			var dobDate = this.toDateFormat(getdobDate);
			try {
				memModel.setProperty("/U_Dob", dobDate);
			} catch (err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			}
			that.showLoading(true);
			memModel.refresh(true);
			var getFatherCardCode = mData.Father.CardCode;

			if (getFatherCardCode !== "") {
				var getFatherModel = mData.Father;
				that._createMsM = "Father";
				that.updateBusinessPartnersByID(memModel, getFatherModel.CardCode, "Father");
			} else {
				that.createFather(memModel, "").done(function(getResponse) {
					memModel.setData(getResponse);
					var createdmessage = that.oBundle("CreatedSuccessfully");
					that.fetchErrorMessageOk("Father", "Success", createdmessage);
					that.updateStatus();
					that.showLoading(false);
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			}

		},
		onPressMotherGroup: function() {
			var that = this;
			that.showLoading(true);
			var createdmessage = that.oBundle("CreatedSuccessfully");
			var memModel = that.getView().getModel("createMembershipModel");
			var mData = memModel.getData();
			var getdobDate = mData.U_Dob;
			var dobDate = this.toDateFormat(getdobDate);
			try {
				memModel.setProperty("/U_Dob", dobDate);
			} catch (err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			}
			var getCardCode = mData.CardCode;

			if (mData.Mother.CardCode !== "") {
				var getMotherModel = mData.Mother;
				that._createMsM = "Mother";
				that.updateBusinessPartnersByID(memModel, getMotherModel.CardCode, "Mother");
				// that.fetchErrorMessageOk("Mother", "Success", "Updated Successfully");
			} else {

				this.createMother(memModel, "").done(function(getResponse) {
					var resp = getResponse;
					memModel.setData(resp);
					that.updateStatus();
					that.showLoading(false);
					that.fetchErrorMessageOk("Mother", "Success", createdmessage);
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});

			}

		},
		onPressGuardian: function() {
			var that = this;
			that.showLoading(true);
			var createdmessage = that.oBundle("CreatedSuccessfully");
			var memModel = that.getView().getModel("createMembershipModel");
			var mData = memModel.getData();
			var getdobDate = mData.U_Dob;
			var dobDate = this.toDateFormat(getdobDate);
			try {
				memModel.setProperty("/U_Dob", dobDate);
			} catch (err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			}

			if (mData.Guardian.CardCode !== "") {
				var getGuardianModel = mData.Guardian;
				that._createMsM = "Guardian";
				that.updateBusinessPartnersByID(memModel, getGuardianModel.CardCode, "Guardian");

			} else {
				this.createGuardian(memModel, "").done(function(getResponse) {
					var resp = getResponse;
					memModel.setData(resp);
					that.updateStatus();
					that.fetchErrorMessageOk("Guardian", "Success", createdmessage);
					that.showLoading(false);
				}).fail(function(err) {
					that.showLoading(false);

					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			}

		},

		////////////////////////////////////////////////////////START API FETCH ON BASE //////////////////////////////////////////////////// 

		fetchSchoolName: function() {
			var that = this;
			var choice = "$orderby=Code%20desc";
			var getEle = this.leadsVariables();
			getEle.lmcSchoolName.setBusy(true);
			this.fetchSchool(that, choice).done(function(obj) {
				that.getView().setModel(obj, "SchoolName");
				var sItem = new sap.ui.core.Item({
					text: "Select The School",
					key: -1
				});
				getEle.lmcSchoolName.insertItem(sItem, 0);
				getEle.lmcSchoolName.setSelectedItem(sItem);
				getEle.lmcSchoolName.setBusy(false);

			}).fail(function(err) {
				that.showLoading(false);
				console.log("Error:", err);
			});

		},
		fetchNationality: function() {
			var that = this;
			var choice = "$orderby=Code%20desc";
			var getEle = this.leadsVariables();
			getEle.lmcNationality.setBusy(true);
			this.fetchCountriesName(that, choice).done(function(obj) {
				obj.setSizeLimit(300);
				sap.ui.getCore().setModel(obj, "MembershipCountry");
				sap.ui.getCore().getModel("MembershipCountry").setSizeLimit(obj);
				var sItem = new sap.ui.core.Item({
					text: "Select The Nationality",
					key: -1
				});
				getEle.lmcNationality.insertItem(sItem, 0);
				getEle.lmcNationality.setSelectedItem(sItem);
				getEle.lmcNationality.setBusy(false);
				that.updateStatus();
			}).fail(function(err) {
				that.showLoading(false);
				console.log("Error: ", err);
			});
		},

		updateBusinessPartnersByID: function(getBodyStr, getCardCode, getName) {
			var that = this;
			that.showLoading(true);
			var createdmessage = that.oBundle("UpdatedSuccessfully");
			var memModel = that.getView().getModel("createMembershipModel");
			var getEle = this.leadsVariables();
			var getlmTypesCode = getEle.lmTypes;

			if (getlmTypesCode.getSelectedKey() === "1") {
				that._createMsM = "Child";
			} else {
				that._createMsM = "Adult";

			}

			that.updateBusinessPartner(getBodyStr, getName, getCardCode).done(function(getRes) {
				memModel.setData(getRes);
				memModel.refresh(true);
				that.fetchErrorMessageOk(that._createMsM, "Success", createdmessage);
				that.showLoading(false);
				that.updateStatus();
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchSportsDetails: function(leadId) {
			let that = this;
			var getEle = this.leadsVariables();

			var filter = encodeURI(
				"$expand=U_SS_LEAD_SPORTS($select=Code),U_SS_SPORTS($select=Code, Name, U_SportsDescription,U_Status)||$filter=U_SS_LEAD_SPORTS/U_SportCode eq U_SS_SPORTS/Code and U_SS_LEAD_SPORTS/U_LeadCode eq  '" +
				leadId + "'");
			//	that.showLoading(true);
			this.fetchLeadSports(filter).done(function(response) {
				var eModel = that.getView().getModel("createMembershipModel");
				var ldData = eModel.getData();
				ldData.sports = response;
				eModel.setData(ldData);
				eModel.refresh(true);
				that.showLoading(false);
				getEle.addSportsTable.setBusy(false);
			}).fail(function(err) {
				that.showLoading(false);
				getEle.addSportsTable.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchLeadLocationDetails: function(leadId) {
			var that = this;

			var getEle = that.getView().byId("plAddLocation");
			getEle.setBusy(true);

			var filter = encodeURI(
				"$expand=U_SS_LOCATIONS($select=Code, Name, U_Description,U_Status)||$filter=U_SS_LEAD_LOCATIONS/U_LocationCode eq U_SS_LOCATIONS/Code and U_SS_LEAD_LOCATIONS/U_CardCode eq  '" +
				leadId + "'|| $select=Code");
			this.fetchLeadLocations(filter).done(function(response) {
				var eModel = that.getView().getModel("createMembershipModel");
				var ldData = eModel.getData();
				ldData.locations = response;
				eModel.setData(ldData);
				eModel.refresh(true);
				that.showLoading(false);
				getEle.setBusy(false);

			}).fail(function(err) {
				that.showLoading(false);
				getEle.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		////////////////////////////////////////////////////////END API FETCH ON BASE//////////////////////////////////////////////////// 
		////////////////////////////////////////////////////////START CLEAR DATA MODELS /////////////////////////////////////////////////
		clearModels: function() {
			var newjMdl = new JSONModel();
			var getEle = this.leadsVariables();
			this.getView().setModel(newjMdl, "SportsList");
			getEle.lmTypes.setValueState("None");
			getEle.lmMemNext.setVisible(true);
		},
		clearVariablesbValue: function() {
			var getEle = this.getVariablesParentExisting();
			getEle.shParentName.setValue("");
			getEle.shParentEmail.setValue("");
			getEle.shParentDOB.setValue("");
			getEle.shParentMobile.setValue("");
		},
		clearStatueValuesLead: function() {
			var getEle = this.leadsVariables();
			getEle.lmTypes.setValueState("None");
			getEle.lmcName.setValueState("None");
			getEle.lmcNameDOB.setValueState("None");
			getEle.lmcAdditionlInformaion.setValueState("None");
			getEle.lmcEmergencyMobile.setValueState("None");
			//	getEle.lmcInputEmail.setValueState("None");

		},
		////////////////////////////////////////////////////////END CLEAR DATA MODELS//////////////////////////////////////////////////// 

		////////////////////////////////////////////////////////START UPDATE DATA MODELS ////////////////////////////////////////////////////
		updateStatus: function() {
			var that = this;
			var getEle = this.leadsVariables();
			var memModel = that.getView().getModel("createMembershipModel");
			var mData = memModel.getData();
			var obj = getEle.wizardID;

			if (mData.U_SS_MEMBER_TYPE !== "") {
				var getSeleGet = mData.U_SS_MEMBER_TYPE;
				switch (getSeleGet) {
					case "1":
						// Child
						getEle.lmMemNext.setVisible(true);
						getEle.createActivity.setVisible(false);
						getEle.goBack.setVisible(false);
						break;
					case "2":
						// Adult
						obj.discardProgress(getEle.StepOne);
						getEle.lmMemNext.setVisible(false);
						getEle.createActivity.setVisible(true);
						getEle.goBack.setVisible(true);
						break;
					default:
						break;
				}

				getEle.lmTypes.setSelectedKey(mData.U_SS_MEMBER_TYPE);

			} else {
				getEle.lmTypes.setSelectedKey(-1);
			}
			if (mData.U_Nationality !== "") {
				var setNationalityCode = mData.U_Nationality;
				getEle.lmcNationality.setSelectedKey(setNationalityCode);
			} else {
				getEle.lmcNationality.setSelectedKey(-1);
			}

			if (mData.CardCode !== "") {
				getEle.createSave.setText("Update");
				getEle.lmMemNext.setEnabled(true);
				getEle.createSave.setEnabled(true);
			} else {
				getEle.createSave.setText("Create");
				getEle.createSave.setEnabled(false);
				getEle.lmMemNext.setEnabled(false);
			}
			if (mData.U_Father !== "") {
				getEle.saveFather.setText("Update");
			} else {
				getEle.saveFather.setText("Save");
			}

			if (mData.U_Mother !== "") {
				getEle.saveMother.setText("Update");
			} else {
				getEle.saveMother.setText("Save");
			}

			if (mData.U_Gardian !== "") {
				getEle.saveGardian.setText("Update");
			} else {
				getEle.saveGardian.setText("Save");
			}
		},
		////////////////////////////////////////////////////////START UPDATE DATA MODELS ////////////////////////////////////////////////////

		fetchMessageOkNavTo: function(getTitle, getState, getMessage, getRouteName, GetID) {
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
						that.getOwnerComponent().getRouter().navTo(getRouteName, {
							viewAccountId: GetID
						});
						messageOktDialog.close();
					}
				})
			});
			messageOktDialog.open();
		},
		onPressAddSportNameTable: function() {
			var setThis = this;
			this.showLoading(true);
			var sportSal = new SportsSAL();
			var jModel;
			var filt = "$filter=U_Status%20eq%20'1'";
			sportSal.fetchSports(this, filt).done(function(obj) {
				var sportsVal = obj.oData.value;
				var eModel = setThis.getView().getModel("createMembershipModel");
				var selSportsVal = eModel.oData.sports;
				var finalSports = [];
				if (sportsVal.length > 0) {
					for (var i = 0; i < sportsVal.length; i++) {
						var isPush = true;
						for (var j = 0; j < selSportsVal.length; j++) {
							if (selSportsVal[j].Code === sportsVal[i].Code) {
								isPush = false;
								break;
							}
						}
						if (isPush) {
							finalSports.push(sportsVal[i]);
						}
						isPush = false;
					}
				}
				obj.oData.value = finalSports;
				jModel = obj;
				sap.ui.getCore().setModel(jModel, "SportsList");
				sap.ui.getCore().getModel("SportsList").refresh(true);
				setThis.showLoading(false);
				setThis._DialogAddSportNameTable.setMultiSelect(true);
				setThis._DialogAddSportNameTable.open();
			}).fail(function(err) {
				setThis.showLoading(false);
				setThis.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

			if (!this._DialogAddSportNameTable) {
				this._DialogAddSportNameTable = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.addSportNameTable", this);
				this._DialogAddSportNameTable.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._DialogAddSportNameTable.setModel(this.getView().getModel());
			}
		},
		onAddSportToCat: function(oEvent) {
			//	var getEle = this.leadsVariables();
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				var scModel = this.getView().getModel("createMembershipModel");
				aContexts.forEach(function(val1) {
					var getOBJ = JSON.stringify(val1.getObject());
					var tmpBody = JSON.parse(getOBJ);
					tmpBody.rec_status = "n";
					scModel.oData.sports.push(tmpBody);
					//	getEle.createSave.setEnabled(true);
				});
				scModel.refresh(true);
			}
		},
		dialogSportsCloseFilter: function() {
			this._DialogAddFilterSports.close();
		},
		onDeleteCatSport: function(oEvent) {
			var src = oEvent.getSource();
			var getParent = src.getParent();
			var getId = getParent.getId();
			var getCore = sap.ui.getCore();
			var item = getCore.byId(getId);
			var ctx = src.getBindingContext("createMembershipModel");
			var obj = ctx.getObject();

			switch (obj.rec_status) {
				case "e":
					obj.rec_status = "de";
					break;
				case "n":
					obj.rec_status = "dn";
					break;
				case "de":
					obj.rec_status = "e";
					break;
				case "dn":
					obj.rec_status = "n";
					break;
				default:
					break;
			}
			this.getView().getModel("createMembershipModel").refresh(true);
			/*var src = oEvent.getSource();
			var ctx = src.getBindingContext("createMembershipModel");
			var mdl = ctx.getModel();
			var mdData = mdl.getData();
			var path = ctx.getPath();
			var index = parseInt(path.substring(path.lastIndexOf('/') + 1));
			mdData.sports.splice(index, 1);
			mdl.setData(mdData);*/
		},
		enableParents: function() {
			var getEle = this.leadsVariables();
			var wiz = getEle.wizardID;
			var cbMemType = this.byId("lmType");
			var memVal = cbMemType.getSelectedKey();
			wiz.discardProgress(this.byId("ParticipantDetailsID"));
			if (memVal === "1") {
				this.byId("ParticipantDetailsID").setNextStep(this.getView().byId("ParentDetailsID"));
			} else if (memVal === "2") {
				//	this.byId("ParticipantDetailsID").setNextStep(this.getView().byId("OptionalInformationID"));
			}
			wiz.nextStep();
		},
		onPressCreateActivity: function() {
			var memModel = this.getView().getModel("createMembershipModel");
			var mData = memModel.getData();
			this.getOwnerComponent().getRouter().navTo("CreateActivity", {
				LeadID: mData.CardCode,
				PageID: this._setViewLevel
			});

		},
		onBack: function() {

			var getPagesID = this._getPageID;
			switch (getPagesID) {
				case "50":
					this.getOwnerComponent().getRouter()
						.navTo("EditLead", {
							LeadID: this._getLeadID
						});
					break;
				case "61":
					this.getOwnerComponent().getRouter()
						.navTo("ViewLead", {
							LeadID: this._getLeadID,
							PageID: 49
						});
					break;
				case "49":
					this.getOwnerComponent().getRouter().navTo("Leads");
					break;
				case "62":
					this.getOwnerComponent().getRouter().navTo("ViewAccount", {
						viewAccountId: this._getLeadID
					});
					break;
				default:

					break;
					//	this.getOwnerComponent().getRouter().navTo("SearchActivity");

					/*if (this._ID === "1") {
					this.getRouter().navTo("DashBoard");
				} else {
					this.getRouter().navTo("CustomersDashBoard");
				}*/
			}

			//	this.getOwnerComponent().getRouter().navTo("SearchActivity");
		},

		onPressFinish: function() {
			this.getOwnerComponent().getRouter()
				.navTo("ViewLead", {
					LeadID: this._getLeadID,
					PageID: 49
				});
		},

		//Start The Location Functions //

		onPressAddLocation: function() {

			var that = this;
			this.showLoading(true);
			var jModel;
			var filt = encodeURI("$filter=U_Status eq '1'");
			var lSAL = new LocationsSAL();
			lSAL.fetchLocationsMasters(this, filt).done(function(obj) {
				var locationVal = obj.oData.value;
				var eModel = that.getView().getModel("createMembershipModel");
				var selLocationVal = eModel.oData.locations;
				var finalLoacation = [];
				if (locationVal.length > 0) {
					for (var i = 0; i < locationVal.length; i++) {
						var isPush = true;
						for (var j = 0; j < selLocationVal.length; j++) {
							if (selLocationVal[j].Code === locationVal[i].Code) {
								isPush = false;
								break;
							}
						}
						if (isPush) {
							finalLoacation.push(locationVal[i]);
						}
						isPush = false;
					}
				}
				obj.oData.value = finalLoacation;
				jModel = obj;
				sap.ui.getCore().setModel(jModel, "LocationList");
				sap.ui.getCore().getModel("LocationList").refresh(true);
				that.showLoading(false);
				that._DialogAddLocation.setMultiSelect(true);
				that._DialogAddLocation.open();
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

			if (!this._DialogAddLocation) {
				this._DialogAddLocation = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.addLocations", this);
				this._DialogAddLocation.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._DialogAddLocation.setModel(this.getView().getModel());
			}

		},
		locationSelected: function(oEvent) {
			var getEle = this.leadsVariables();
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				var scModel = this.getView().getModel("createMembershipModel");
				aContexts.forEach(function(val1) {
					var getOBJ = JSON.stringify(val1.getObject());
					var tmpBody = JSON.parse(getOBJ);
					tmpBody.rec_status = "n";
					scModel.oData.locations.push(tmpBody);
					getEle.createSave.setEnabled(true);
				});
				scModel.refresh(true);
			}
		},
		setValueHowDidHearAbout: function() {
			var getEle = this.leadsVariables();
			getEle.lncHowdid.setValue("Select The How Did You Hear About Us");
		}

	});
});