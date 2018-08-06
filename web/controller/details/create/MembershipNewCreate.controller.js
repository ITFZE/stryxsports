sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "com/ss/app/StryxSports/controller/sal/SportCategorySAL",
  "com/ss/app/StryxSports/controller/sal/SportsSAL",
  "com/ss/app/StryxSports/controller/sal/TeamsSAL",
  "com/ss/app/StryxSports/controller/sal/LocationsSAL",
  "com/ss/app/StryxSports/controller/sal/CreateMembershipSAL",
  "com/ss/app/StryxSports/controller/sal/SeasonSAL",
  'sap/m/Dialog',
  'sap/m/Text',
  'sap/m/Button'

], function(JSONModel, SportCategorySAL, SportsSAL, TeamsSAL, LocationsSAL, CreateMembershipSAL, SeasonSAL, Dialog, Text, Button) {
	"use strict";
	return CreateMembershipSAL.extend("com.ss.app.StryxSports.controller.details.create.MembershipNewCreate", {
		onInit: function() {
			this._pageID = "";
			this._getAccountID = "";
			this._setViewLevel = "";
			var oRouter = this.getRouter();
			oRouter.getRoute("MembershipNewCreate").attachMatched(this._onRouteMatched, this);
			oRouter.getRoute("MembershipNewEdit").attachMatched(this._onRouteEditMatched, this);
			oRouter.getRoute("LeadToAccount").attachMatched(this._onRouteLeadToAccountMatched, this);

			oRouter.getRoute("AssessmentToAccount").attachMatched(this._onRouteCreateFeedbackMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		onBeforeRendering: function() {},
		_onRouteCreateFeedbackMatched: function(oEvt) {
			var that = this;
			that.showLoading(true);
			this._getAccountID = oEvt.getParameter("arguments").AccountId;
			this._pageID = oEvt.getParameter("arguments").PageID;
			this._feedbackID = oEvt.getParameter("arguments").AssessmentID;
			var getEle = oEvt.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			that.createMemberModel();
			var getVariables = this.getVariablesParticipantDetails();
			var obj = getVariables.wizardID;
			obj.discardProgress(getVariables.StepOne);
			that.clearSetValueStatePD();
			that.clearModels();

			var memMD = that.getView().getModel("createMembershipModel");
			that.fetchMemberById(memMD, this._getAccountID).done(function(objs) {
				that.getView().setModel(objs, "createMembershipModel");
				$.when(that.fetchSchoolName()).then(function() {
					$.when(that.fetchNationality()).then(function() {
						that.setNextStatus();
						that.showLoading(false);
						return;
					});
				});
			}).fail(function(err) {
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

			this.setNextStatus();

		},
		_onRouteEditMatched: function(oEvt) {
			var that = this;
			that.showLoading(true);
			this._pageID = oEvt.getParameter("arguments").PageID;
			this._getAccountID = oEvt.getParameter("arguments").AccountId;
			var getEle = oEvt.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			that.createMemberModel();
			var getVariables = this.getVariablesParticipantDetails();
			var obj = getVariables.wizardID;
			obj.discardProgress(getVariables.StepOne);
			that.clearSetValueStatePD();
			that.clearModels();
			this._getAccountID = oEvt.getParameter("arguments").AccountId;
			var memMD = that.getView().getModel("createMembershipModel");
			that.fetchMemberById(memMD, this._getAccountID).done(function(objs) {
				that.getView().setModel(objs, "createMembershipModel");
				$.when(that.fetchSchoolName()).then(function() {
					$.when(that.fetchNationality()).then(function() {
						that.setNextStatus();
						that.showLoading(false);
						return;
					});
				});
			}).fail(function(err) {
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
			this.setNextStatus();
		},
		_onRouteLeadToAccountMatched: function(oEvt) {
			var that = this;
			that.showLoading(true);
			this._pageID = oEvt.getParameter("arguments").PageID;
			this._getAccountID = oEvt.getParameter("arguments").AccountId;
			var getEle = oEvt.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			that.createMemberModel();
			var getVariables = this.getVariablesParticipantDetails();
			var obj = getVariables.wizardID;
			obj.discardProgress(getVariables.StepOne);
			that.clearSetValueStatePD();
			that.clearModels();
			this._getAccountID = oEvt.getParameter("arguments").AccountId;
			var memMD = that.getView().getModel("createMembershipModel");
			that.fetchMemberById(memMD, this._getAccountID).done(function(objs) {
				that.getView().setModel(objs, "createMembershipModel");
				$.when(that.fetchSchoolName()).then(function() {
					$.when(that.fetchNationality()).then(function() {
						that.setNextStatus();
						that.showLoading(false);
						return;
					});
				});
			}).fail(function(err) {
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
			this.setNextStatus();
		},
		_onRouteMatched: function(oEvt) {
			var that = this;
			that.showLoading(true);
			this._pageID = oEvt.getParameter("arguments").PageID;
			var getEle = oEvt.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			that.createMemberModel();
			that.clearModels();
			that.setNextStatus();
			var getVariables = this.getVariablesParticipantDetails();
			var obj = getVariables.wizardID;
			obj.discardProgress(getVariables.StepOne);
			that.clearSetValueStatePD();
			$.when(that.fetchSchoolName()).then(function() {
				$.when(that.fetchNationality()).then(function() {
					that.setNextStatus();
					that.showLoading(false);
					return;
				});
			});
			this.setNextStatus();
		},
		onAfterRendering: function() {
			var wiz = this.getView().byId("createWizardParent");
			wiz.getShowNextButton(false);
		},

		createMemberModel: function() {
			var memberMD = new JSONModel();
			var conf = this.getOwnerComponent().getManifestEntry("stryx.account.series");
			this.createJSONModelMembership(memberMD, "");
			memberMD.setProperty('/Father');
			memberMD.setProperty('/Mother');
			memberMD.setProperty('/Guardian');
			memberMD.setProperty('/ContactEmployees', []);
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
			var dd = obj.ContactEmployees;
			var temp = new Object();
			temp.CardCode = "";
			temp.Name = "";
			temp.MobilePhone = "";
			temp.InternalCode = 0;
			temp.FirstName = "";
			temp.Remarks1 = "ChildPickup1";
			temp.Remarks2 = "";
			var temp1 = new Object();
			temp1.CardCode = "";
			temp1.Name = "";
			temp1.MobilePhone = "";
			temp1.InternalCode = 0;
			temp1.FirstName = "";
			temp1.Remarks1 = "ChildPickup2";
			temp1.Remarks2 = "";
			var temp2 = new Object();
			temp2.CardCode = "";
			temp2.Name = "";
			temp2.MobilePhone = "";
			temp2.InternalCode = 0;
			temp2.FirstName = "";
			temp2.Remarks1 = "Emergency";
			temp2.Remarks2 = "";
			dd.push(temp, temp1, temp2);
			this.getView().setModel(memberMD, "createMembershipModel");
			//this.setSampleData();
		},
		createJSONModelMembership: function(md) {
			md.setProperty('/CardCode', "");
			md.setProperty('/CardName', "");
			md.setProperty('/CardType', "cCustomer");
			md.setProperty('/GroupCode');
			md.setProperty('/U_Dob');
			md.setProperty('/U_School', "");
			md.setProperty('/U_Nationality', "");
			md.setProperty('/U_Gender', "Male");
			md.setProperty('/U_Ref');
			md.setProperty('/EmailAddress', "");
			md.setProperty('/Phone1', "");
			md.setProperty('/Phone2', "");
			md.setProperty('/Cellular', "");
			md.setProperty('/FatherCard', "");
			md.setProperty('/Notes', "");
			md.setProperty('/U_Father', "");
			md.setProperty('/U_Mother', "");
			md.setProperty('/U_Gardian', "");
			md.setProperty('/FreeText', "");
		},
		setSampleData: function() {
			var md = this.getView().getModel("createMembershipModel");
			md.setProperty('/CardCode', "CH005054");
			md.setProperty('/CardName', "Ajay");
			md.setProperty('/CardType', "cCustomer");
			md.setProperty('/GroupCode', 102);
			md.setProperty('/U_Dob', "1988-05-05");
			md.setProperty('/U_School', "FABS");
			md.setProperty('/U_Nationality', "India");
			md.setProperty('/U_Gender');
			md.setProperty('/EmailAddress', "");
			md.setProperty('/Cellular', "");
			md.setProperty('/Notes', "");
			md.setProperty('/U_Father', "");
			md.setProperty('/U_Mother', "");
			md.setProperty('/U_Gardian', "");
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},
		onPressAddCanelMembership: function() {
			this.getRouter().navTo("Membership");
		},
		onNextStep: function(evt) {

		},

		addService: function() {
			var getVariables = this.getVariablesParticipantDetails();
			getVariables.wizardID.validateStep(getVariables.StepTwo);
		},

		setNextStatus: function() {
			var that = this;
			var memModel = that.getView().getModel("createMembershipModel");
			var mData = memModel.getData();
			var btnMemN = that.getView().byId("btnMemNext");
			var btnCMem = that.getView().byId("btnCMem");
			var getEle = this.getVariablesParticipantDetails();
			var btnOl = this.getView().byId("btnOptional");

			if (mData.CardCode !== "" && mData.CardType === "cCustomer" && mData.CardCode !== undefined) {
				btnCMem.setText("Update");
				btnOl.setVisible(true);
				getEle.pageAccount.setTitle("Edit Account");
				btnMemN.setEnabled(true);
			} else {
				btnCMem.setText("Create");
				btnOl.setVisible(true);
				getEle.pageAccount.setTitle("Create Account");
				btnMemN.setEnabled(false);

			}
			if (mData.U_Father !== "" || mData.U_Mother !== "" || mData.U_Gardian !== "") {
				var btnFN = that.getView().byId("btnFNext");
				var btnMN = that.getView().byId("btnMNext");
				var btnGN = that.getView().byId("btnGNext");
				btnFN.setEnabled(true);
				btnMN.setEnabled(true);
				btnGN.setEnabled(true);
				var btnF = that.getView().byId("btnFather");
				var btnM = that.getView().byId("btnMother");
				var btnG = that.getView().byId("btnGuardian");
				var btnCn = that.getView().byId("btnContact");

				if (mData.U_Father !== "" && mData.U_Father !== undefined) {
					btnF.setText("Update");
				} else {
					btnF.setText("Save");
				}
				if (mData.U_Mother !== "" && mData.U_Mother !== undefined) {
					btnM.setText("Update");
				} else {
					btnM.setText("Save");
				}
				if (mData.U_Gardian !== "" && mData.U_Gardian !== undefined) {

					btnG.setText("Update");
				} else {
					btnG.setText("Save");
				}
				if (mData.ContactEmployees.length > 0 && mData.ContactEmployees !== undefined) {

					btnCn.setText("Update");
				} else {
					btnCn.setText("Save");
				}

			}
			if (mData.U_SS_MEMBER_TYPE !== "" && mData.U_SS_MEMBER_TYPE !== undefined) {
				getEle.lmTypes.setSelectedKey(mData.U_SS_MEMBER_TYPE);

			} else {
				getEle.lmTypes.setSelectedKey(-1);
			}

			if (mData.U_Nationality !== "" && mData.U_Nationality !== undefined) {
				getEle.participantNationality.setSelectedKey(mData.U_Nationality);
			} else {
				getEle.participantNationality.setValue("Select The Nationality");
			}

			if (mData.U_School !== "" && mData.U_School !== undefined) {
				getEle.participantSchoolName.setSelectedKey(mData.U_School);
			} else {
				getEle.participantSchoolName.setValue("Select The School");
			}
			if (mData.U_Ref !== "" && mData.U_Ref !== undefined) {
				getEle.participantHowdidUs.setSelectedKey(mData.U_Ref);
			} else {
				getEle.participantHowdidUs.setValue("Select The How Did You Hear About Us");
			}

			return;
		},

		enableParents: function() {
			var getVariables = this.getVariablesParticipantDetails();
			var wiz = getVariables.wizardID;
			var cbMemType = this.byId("lmType");
			var memVal = cbMemType.getSelectedKey();
			wiz.discardProgress(this.byId("ParticipantDetailsID"));
			if (memVal === "1") {
				this.byId("ParticipantDetailsID").setNextStep(this.getView().byId("ParentDetailsID"));
			} else if (memVal === "2") {
				this.byId("ParticipantDetailsID").setNextStep(this.getView().byId("OptionalInformationID"));
			}
			wiz.nextStep();
		},

		enableOptional: function() {
			var getVariables = this.getVariablesParticipantDetails();
			var wiz = getVariables.wizardID;
			this.byId("ParentDetailsID").setNextStep(this.getView().byId("OptionalInformationID"));
			wiz.nextStep();
		},

		enableService: function() {
			var memModel = this.getView().getModel("createMembershipModel");
			var mData = memModel.getData();
			this.getOwnerComponent().getRouter().navTo("SelectServices", {
				AccountId: mData.CardCode,
				PageID: 62
			});

		},
		/*	selectedType: function() {
			var getEle = this.getVariablesParticipantDetails();
			var getlmTypesCode = getEle.lmTypes;
			if (getlmTypesCode.getSelectedKey() !== "-1" && getlmTypesCode.getValue() !== "") {
				getlmTypesCode.setValueState("None");
				switch (getlmTypesCode.getSelectedKey()) {
					case "1":
						getEle.lmLPhone.setVisible(true);
						getEle.lmIPhone.setVisible(true);
						getEle.lmLAdditionlInformaion.setVisible(true);
						getEle.lmIAdditionlInformaion.setVisible(true);
						break;
					case "2":
						getEle.lmLPhone.setVisible(true);
						getEle.lmIPhone.setVisible(true);
						getEle.lmLAdditionlInformaion.setVisible(true);
						getEle.lmIAdditionlInformaion.setVisible(true);
						break;
				}

			} else if (getlmTypesCode.getSelectedKey() === "-1") {
				getlmTypesCode.setValueState("Error");
				getEle.lmLPhone.setVisible(false);
				getEle.lmIPhone.setVisible(false);
				getEle.lmLAdditionlInformaion.setVisible(false);
				getEle.lmIAdditionlInformaion.setVisible(false);
			} else {
				getlmTypesCode.setValueState("Error");
			}
		},*/
		validateMemberDeatils: function() {
			var getEle = this.getVariablesParticipantDetails();
			if (getEle.lmTypes.getSelectedKey() === "-1" || getEle.lmTypes.getSelectedKey() === "") {
				getEle.lmTypes.setValueState("Error");
			} else if (getEle.lmTypes.getSelectedKey() === "1") {
				this.onPressSaveAccountChild();
			} else {
				this.onPressSaveAccountAdult();
			}
		},

		onPressSaveAccountChild: function() {
			var getEle = this.getVariablesParticipantDetails();
			var letters = /^[\sa-zA-Z]+$/;
			var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			var date = getEle.participantDOB.getValue();
			var cEndDate = this.toDateFormat(date);

			var givendate = new Date(cEndDate);
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			if (getEle.lmTypes.getValue() === "" || getEle.lmTypes.getSelectedKey() === "-1") {
				getEle.lmTypes.setValueState("Error");

				getEle.wizardID.previousStep(getEle.StepOne);
			} else if (getEle.participantName.getValue() === "") {

				getEle.lmTypes.setValueState("None");
				getEle.participantName.setValueState("Error");
				getEle.wizardID.previousStep(getEle.StepOne);
			} else if (!getEle.participantName.getValue().match(letters)) {
				this.MessageToastShow("Please Enter Alphabets");
			}
			/* else if (date === "") {
				getEle.participantName.setValueState("None");
				getEle.participantDOB.setValueState("Error");
				getEle.wizardID.previousStep(getEle.StepOne);

			}*/
			else if (givendate >= today) {
				getEle.participantDOB.setValueState("Error");
				this.MessageToastShow("Please Enter Date less than the current Date");
			}

			/*	else if (getEle.lmIEmail.getValue() === "") {
				getEle.participantDOB.setValueState("None");
				getEle.lmIEmail.setValueState("Error");
			} */
			else if (!getEle.lmIEmail.getValue().match(rexMail)) {
				this.MessageToastShow("Please Enter Valid Email Address");
				//getEle.lmIEmail.setValueState("Error");
				getEle.participantName.setValueState("None");
				getEle.participantDOB.setValueState("None");
				getEle.wizardID.previousStep(getEle.StepOne);
			}
			/* else if (getEle.lmIPhone.getValue() === "") {
				getEle.lmIEmail.setValueState("None");
				getEle.lmIPhone.setValueState("Error");
				getEle.wizardID.previousStep(getEle.StepOne);
			}*/
			else if (getEle.participantNationality.getValue() === "Select The Nationality" || getEle.participantNationality.getValue() ===
				"-No Country-" || getEle.participantNationality.getValue() === "") {
				getEle.participantName.setValueState("None");
				getEle.participantNationality.setValueState("Error");
				getEle.wizardID.previousStep(getEle.StepOne);
			} else if (getEle.participantHowdidUs.getValue() === "Select The How Did You Hear About Us" || getEle.participantHowdidUs.getValue() ===
				"") {
				getEle.participantNationality.setValueState("None");
				getEle.participantHowdidUs.setValueState("Error");
				getEle.wizardID.previousStep(getEle.StepOne);
			} else if (getEle.participantSchoolName.getValue() === "Select The School" || getEle.participantSchoolName.getValue() === "") {
				getEle.participantHowdidUs.setValueState("None");
				getEle.participantSchoolName.setValueState("Error");
				getEle.wizardID.previousStep(getEle.StepOne);
			} else {
				getEle.lmTypes.setValueState("None");
				getEle.participantName.setValueState("None");
				getEle.participantDOB.setValueState("None");
				getEle.lmIEmail.setValueState("None");
				getEle.lmIPhone.setValueState("None");
				getEle.participantNationality.setValueState("None");
				getEle.participantHowdidUs.setValueState("None");
				getEle.participantSchoolName.setValueState("None");
				this.clearStatueValuesLead();
				var getSelTypes = getEle.lmTypes.getSelectedKey();
				if (getSelTypes === "-1") {
					this.clearStatueValuesLead();
					this.CreateMembership();
				} else {
					if (getEle.participantName.getValue() === "") {
						getEle.participantName.setValueState("None");
					} else {
						getEle.participantName.setValueState("None");
						this.clearStatueValuesLead();
						this.CreateMembership();

					}
				}

				//}
			}
		},
		onPressSaveAccountAdult: function() {
			var getEle = this.getVariablesParticipantDetails();
			var letters = /^[\sa-zA-Z]+$/;
			var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			var date = getEle.participantDOB.getValue();
			var cEndDate = this.toDateFormat(date);

			var givendate = new Date(cEndDate);
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			if (getEle.lmTypes.getValue() === "" || getEle.lmTypes.getSelectedKey() === "-1") {
				getEle.lmTypes.setValueState("Error");

				getEle.wizardID.previousStep(getEle.StepOne);
			} else if (getEle.participantName.getValue() === "") {

				getEle.lmTypes.setValueState("None");
				getEle.participantName.setValueState("Error");
				getEle.wizardID.previousStep(getEle.StepOne);
			} else if (!getEle.participantName.getValue().match(letters)) {
				this.MessageToastShow("Please Enter Alphabets");
			} else if (date === "") {
				getEle.participantName.setValueState("None");
				getEle.participantDOB.setValueState("Error");
				getEle.wizardID.previousStep(getEle.StepOne);

			} else if (givendate >= today) {
				this.MessageToastShow("Please Enter Date less than the current Date");
			} else if (getEle.lmIEmail.getValue() === "") {
				getEle.participantDOB.setValueState("None");
				getEle.lmIEmail.setValueState("Error");
			} else if (!getEle.lmIEmail.getValue().match(rexMail)) {
				this.MessageToastShow("Please Enter Valid Email Address");

				getEle.wizardID.previousStep(getEle.StepOne);
			} else if (getEle.lmIPhone.getValue() === "") {
				getEle.lmIEmail.setValueState("None");
				getEle.lmIPhone.setValueState("Error");
				getEle.wizardID.previousStep(getEle.StepOne);
			} else if (getEle.participantNationality.getValue() === "Select The Nationality" || getEle.participantNationality.getValue() ===
				"-No Country-" || getEle.participantNationality.getValue() === "") {
				getEle.lmIPhone.setValueState("None");
				getEle.participantNationality.setValueState("Error");
				getEle.wizardID.previousStep(getEle.StepOne);
			} else if (getEle.participantHowdidUs.getValue() === "Select The How Did You Hear About Us" || getEle.participantHowdidUs.getValue() ===
				"") {
				getEle.participantNationality.setValueState("None");
				getEle.participantHowdidUs.setValueState("Error");
				getEle.wizardID.previousStep(getEle.StepOne);
			} else if (getEle.participantSchoolName.getValue() === "Select The School" || getEle.participantSchoolName.getValue() === "") {
				getEle.participantHowdidUs.setValueState("None");
				getEle.participantSchoolName.setValueState("Error");
				getEle.wizardID.previousStep(getEle.StepOne);
			} else {
				getEle.lmTypes.setValueState("None");
				getEle.participantName.setValueState("None");
				getEle.participantDOB.setValueState("None");
				getEle.lmIEmail.setValueState("None");
				getEle.lmIPhone.setValueState("None");
				getEle.participantNationality.setValueState("None");
				getEle.participantHowdidUs.setValueState("None");
				getEle.participantSchoolName.setValueState("None");
				this.clearStatueValuesLead();
				var getSelTypes = getEle.lmTypes.getSelectedKey();
				if (getSelTypes === "-1") {
					this.clearStatueValuesLead();
					this.CreateMembership();
				} else {
					if (getEle.participantName.getValue() === "") {
						getEle.participantName.setValueState("Error");
					} else {
						getEle.participantName.setValueState("None");
						this.clearStatueValuesLead();
						this.CreateMembership();

					}
				}

				//}
			}
		},

		ValidateMembership: function() {
			var that = this;
			var jModel = this.getView().getModel("createMembershipModel");
			this.showLoading(true);
			var jData = jModel.getData();
			var name = jData.CardName;

			var dob = this.toDateFormat(jData.U_Dob);
			var filt = "$filter=(CardName eq '" + name.toLowerCase() + "' or CardName eq '" + that.titleCase(name) + "')  and U_Dob eq '" + dob +
				"'";

			this.fetchBusinessPartners(this, filt).done(function() {
				var updatememnew = that.oBundle("UpdatedSuccessfully");
				that.showLoading(false);
				that.fetchErrorMessageOk("Account", "Success", updatememnew);
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
			this.updateBusinessPartner(jModel, "Child").done(function(response) {
				var ret = response;
				jModel.setData(ret);
				that.setNextStatus();
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		CreateMembership: function() {
			var that = this;
			that.showLoading(true);
			that.setNextStatus();
			var createMembershipSAL = new CreateMembershipSAL();
			var memModel = that.getView().getModel("createMembershipModel");
			var name = memModel.oData.CardName;

			var getdobDate = memModel.oData.U_Dob;
			var dobDate = this.toDateFormat(getdobDate);
			try {
				memModel.setProperty("/U_Dob", dobDate);
			} catch (err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			}
			var mData = memModel.getData();
			mData.CardType = "cCustomer";
			if (mData.CardCode === "") {
				var filter = "$filter=(CardName eq '" + name.toLowerCase() + "' or CardName eq '" + that.titleCase(name) + "') and U_Dob eq '" +
					dobDate + "'";
				that.fetchBusinessPartners(this, filter).done(function(ret) {
					if (ret.oData.value.length <= 0) {
						memModel.setProperty('/U_Dob', dobDate);
						createMembershipSAL.createBusinessPartners(memModel, "").done(function(getResponse) {
							memModel.setData(getResponse);
							var createmessage = that.oBundle("CreatedSuccessfully");
							that.showLoading(false);
							that.fetchErrorMessageOk("Account", "Success", createmessage);

							that.setNextStatus();
							that.showLoading(false);
						}).fail(function(err) {
							that.showLoading(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
						});
					} else {
						that.showLoading(false);
						that.fetchErrorMessageOk("Error", "Error", "Record already exixts");
					}
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			} else {
				that.showLoading(true);
				this.updateBusinessPartner(memModel, "Child", mData.CardCode).done(function(response) {
					var resp = response;
					memModel.setData(resp);
					that.getView().setModel(memModel, "createMembershipModel");
					var update = that.oBundle("UpdatedSuccessfully");
					that.fetchErrorMessageOk("Account", "Success", update);
					that.setNextStatus();
					that.showLoading(false);
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			}
		},
		//Herer ID for father details
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

		//Here function for father save button
		onPressFatherValidGroup: function(oValue) {
			var letters = /^[\sa-zA-Z]+$/;
			var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			var getVariables = this.getVariablesParentFatherDetails();
			if (getVariables.fatherFirstName.getValue() === "") {
				getVariables.fatherFirstName.setValueState("Error");
				//	getVariables.wizardID.previousStep(getVariables.StepOne);
			} else if (!getVariables.fatherFirstName.getValue().match(letters)) {
				this.MessageToastShow("Please Enter Aplabets");

			} else if (getVariables.fatherPhone.getValue() === "") {
				getVariables.fatherFirstName.setValueState("None");
				getVariables.fatherPhone.setValueState("Error");
				//	getVariables.wizardID.previousStep(getVariables.StepOne);

			} else if (getVariables.fatherEmail.getValue() === "") {
				getVariables.fatherPhone.setValueState("None");
				getVariables.fatherEmail.setValueState("Error");
				//	getVariables.wizardID.previousStep(getVariables.StepOne);
			} else if (!getVariables.fatherEmail.getValue().match(rexMail)) {
				this.MessageToastShow("Please Enter Valid Email Address");
				getVariables.fatherEmail.setValueState("Error");

			} else {
				getVariables.fatherFirstName.setValueState("None");
				getVariables.fatherEmail.setValueState("None");
				getVariables.fatherPhone.setValueState("None");

				this.onPressSaveFather();

			}
		},
		onPressSaveFather: function() {
			var that = this;
			that.showLoading(true);
			that.setNextStatus();
			var createMembershipSAL = new CreateMembershipSAL();
			var memModel = that.getView().getModel("createMembershipModel");
			var ParentMobile = memModel.oData.Father.Cellular;
			var emailaddress = memModel.oData.Father.EmailAddress;
			var filter = "$filter = Cellular eq '" + ParentMobile + "' and EmailAddress eq '" + emailaddress + "' ";
			var mData = memModel.getData();
			if (mData.Father.CardCode === "") {
				that.fetchBusinessPartners(this, filter).done(function(ret) {
					if (ret.oData.value.length <= 0) {
						memModel.setProperty('/Cellular', ParentMobile, '/EmailAddress', emailaddress);
						that.createFather(memModel, "").done(function(getResponse) {
							memModel.setData(getResponse);
							var createdmessage = that.oBundle("CreatedSuccessfully");
							that.showLoading(false);
							that.fetchErrorMessageOk("Father", "Success", createdmessage);
							that.setNextStatus();
							that.showLoading(false);
						}).fail(function(err) {
							that.showLoading(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
						});
					} else {
						that.showLoading(false);
						that.fetchErrorMessageOk("Error", "Error", "Record entered under Cellular or Email Address already exixts");
					}
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			} else {

				var bpCode = mData.Father.CardCode;
				this.updateBusinessPartner(memModel, "Father", bpCode).done(function(response) {
					memModel.setData(response);
					that.setNextStatus();
					that.showLoading(false);
					that.fetchErrorMessageOk("Father", "Success", "Updated Successfully");
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			}

		},
		//Herer ID for Mother details
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
		//Here function for Mother save button
		onPressMotherGroup: function() {
			var letters = /^[\sa-zA-Z]+$/;
			var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			var getVariables = this.getVariablesParentMotherDetails();
			if (getVariables.motherFirstName.getValue() === "") {
				getVariables.motherFirstName.setValueState("Error");
				//	getVariables.wizardID.previousStep(getVariables.StepOne);
			} else if (!getVariables.motherFirstName.getValue().match(letters)) {
				this.MessageToastShow("Please Enter Alphabets");

			} else if (getVariables.motherPhone.getValue() === "") {
				getVariables.motherFirstName.setValueState("None");
				getVariables.motherPhone.setValueState("Error");
				//	getVariables.wizardID.previousStep(getVariables.StepOne);

			} else if (getVariables.motherEmail.getValue() === "") {
				getVariables.motherPhone.setValueState("None");
				getVariables.motherEmail.setValueState("Error");
				//	getVariables.wizardID.previousStep(getVariables.StepOne);
			} else if (!getVariables.motherEmail.getValue().match(rexMail)) {
				this.MessageToastShow("Please Enter Valid Email Address");

			} else {
				getVariables.motherFirstName.setValueState("None");
				getVariables.motherEmail.setValueState("None");
				getVariables.motherPhone.setValueState("None");
				this.onPressSaveMother();

			}
		},
		onPressSaveMother: function() {
			var that = this;
			that.showLoading(true);
			var memModel = that.getView().getModel("createMembershipModel");
			var mData = memModel.getData();
			if (mData.Mother.CardCode === "") {
				this.createMother(memModel, "").done(function(getResponse) {
					var resp = getResponse;
					memModel.setData(resp);
					var createdmessage = that.oBundle("CreatedSuccessfully");
					that.showLoading(false);
					that.fetchErrorMessageOk("Mother", "Success", createdmessage);
					that.setNextStatus();
					that.showLoading(false);
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "");
				});
			} else {
				var bpCode = mData.Mother.CardCode;
				this.updateBusinessPartner(memModel, "Mother", bpCode).done(function(response) {
					var resp = response;
					memModel.setData(resp);
					that.setNextStatus();
					that.showLoading(false);
					that.fetchErrorMessageOk("Mother", "Success", "Updated Successfully");
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "");
				});
			}
		},
		//Herer ID for Guardian details
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
		//Here function for Guardian save button
		onPressGuardian: function() {
			var letters = /^[\sa-zA-Z]+$/;
			var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			var getVariablesGardian = this.getVariablesParentGuardianDetails();
			if (getVariablesGardian.GuardianFirstName.getValue() === "") {
				getVariablesGardian.GuardianFirstName.setValueState("Error");
				//	getVariablesGardian.wizardID.previousStep(getVariablesGardian.StepOne);
			} else if (!getVariablesGardian.GuardianFirstName.getValue().match(letters)) {
				this.MessageToastShow("Please Enter Alphabets");

			} else if (getVariablesGardian.GuardianPhone.getValue() === "") {
				getVariablesGardian.GuardianFirstName.setValueState("None");
				getVariablesGardian.GuardianPhone.setValueState("Error");
				//	getVariablesGardian.wizardID.previousStep(getVariablesGardian.StepOne);	

			} else if (getVariablesGardian.GuardianEmail.getValue() === "") {
				getVariablesGardian.GuardianPhone.setValueState("None");
				getVariablesGardian.GuardianEmail.setValueState("Error");
				//	getVariablesGardian.wizardID.previousStep(getVariablesGardian.StepOne);
			} else if (!getVariablesGardian.GuardianEmail.getValue().match(rexMail)) {
				getVariablesGardian.GuardianEmail.setValueState("Error");
				this.MessageToastShow("Please Enter Valid Email Address");

			} else {
				getVariablesGardian.GuardianFirstName.setValueState("None");
				getVariablesGardian.GuardianEmail.setValueState("None");
				getVariablesGardian.GuardianPhone.setValueState("None");
				this.onPressSaveGuardian();
			}
		},

		onPressSaveGuardian: function() {
			var that = this;
			that.showLoading(true);
			that.setNextStatus();
			var memModel = that.getView().getModel("createMembershipModel");
			var mData = memModel.getData();
			if (mData.Guardian.CardCode === "") {
				this.createGuardian(memModel, "").done(function(getResponse) {
					var resp = getResponse;
					memModel.setData(resp);
					var createdmessage = that.oBundle("CreatedSuccessfully");
					that.showLoading(false);
					that.fetchErrorMessageOk("Guardian", "Success", createdmessage);
					that.setNextStatus();
					that.showLoading(false);
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "");
				});
			} else {
				var bpCode = mData.Guardian.CardCode;
				this.updateBusinessPartner(memModel, "Guardian", bpCode).done(function(response) {
					var resp = response;
					memModel.setData(resp);
					that.setNextStatus();
					that.showLoading(false);
					that.fetchErrorMessageOk("Guardian", "Success", "Updated Successfully");
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "");
				});
			}
		},
		///Here id for Optional Information function
		getVariablesOptionalInformation: function() {
			var items = {
				optionalPerson1: this.getView().byId("optionalPerson1"),
				person1Mobile: this.getView().byId("person1Mobile"),
				optionalPerson2: this.getView().byId("optionalPerson2"),
				person2Mobile: this.getView().byId("perosn2Mobile"),
				emergencyName: this.getView().byId("emergencyName"),
				emergencyMobile: this.getView().byId("EmergencyMobile"),

				additionalInformation: this.getView().byId("additionlInformaion")
			};
			return items;
		},
		//Here function for  Optional Information  save button
		onPressOptionalInformation: function() {
			var getVariablesInformation = this.getVariablesOptionalInformation();
			if (getVariablesInformation.optionalPerson1.getValue() === "") {
				getVariablesInformation.optionalPerson1.setValueState("Error");
				getVariablesInformation.wizardID.previousStep(getVariablesInformation.StepOne);

			} else if (getVariablesInformation.person1Mobile.getValue() === "") {
				getVariablesInformation.optionalPerson1.setValueState("None");
				getVariablesInformation.person1Mobile.setValueState("Error");
				getVariablesInformation.wizardID.previousStep(getVariablesInformation.StepOne);

			} else if (getVariablesInformation.optionalPerson2.getValue() === "") {
				getVariablesInformation.person1Mobile.setValueState("None");
				getVariablesInformation.optionalPerson2.setValueState("Error");
				getVariablesInformation.wizardID.previousStep(getVariablesInformation.StepOne);

			} else if (getVariablesInformation.person2Mobile.getValue() === "") {
				getVariablesInformation.optionalPerson2.setValueState("None");
				getVariablesInformation.person2Mobile.setValueState("Error");
				getVariablesInformation.wizardID.previousStep(getVariablesInformation.StepOne);

			} else if (getVariablesInformation.emergencyName.getValue() === "") {
				getVariablesInformation.person2Mobile.setValueState("None");
				getVariablesInformation.emergencyName.setValueState("Error");
				getVariablesInformation.wizardID.previousStep(getVariablesInformation.StepOne);

			} else if (getVariablesInformation.emergencyMobile.getValue() === "") {
				getVariablesInformation.person2Mobile.setValueState("None");
				getVariablesInformation.emergencyMobile.setValueState("Error");
				getVariablesInformation.wizardID.previousStep(getVariablesInformation.StepOne);

			} else if (getVariablesInformation.additionalInformation.getValue() === "") {
				getVariablesInformation.emergencyMobile.setValueState("None");
				getVariablesInformation.additionalInformation.setValueState("Error");
				getVariablesInformation.wizardID.previousStep(getVariablesInformation.StepOne);

			} else {
				getVariablesInformation.optionalPerson1.setValueState("None");
				getVariablesInformation.person1Mobile.setValueState("None");
				getVariablesInformation.optionalPerson2.setValueState("None");
				getVariablesInformation.person2Mobile.setValueState("None");
				getVariablesInformation.emergencyName.setValueState("None");
				getVariablesInformation.emergencyMobile.setValueState("None");
				getVariablesInformation.additionalInformation.setValueState("None");
				this.onPressOptional();
			}
		},

		onPressOptional: function() {
			var that = this;
			var btnOl = this.getView().byId("btnOptional");
			that.showLoading(true);
			var memModel = that.getView().getModel("createMembershipModel");
			var mData = memModel.getData();
			var bpCode = mData.CardCode;
			this.updateBusinessPartner(memModel, "Contact", bpCode).done(function(response) {
				var resp = response;
				memModel.setData(resp);
				that.setNextStatus();
				btnOl.setVisible(true);
				that.showLoading(false);
				that.fetchErrorMessageOk("Optional Information", "Success", "Updated Successfully");
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},

		fetchNationality: function() {
			//API CALL TO FETCH Nationality
			var that = this;
			var choice = "$orderby=Code%20desc";
			var getEle = this.getVariablesParticipantDetails();
			getEle.participantNationality.setBusy(true);
			this.fetchCountriesName(that, choice).done(function(obj) {
				obj.setSizeLimit(300);
				sap.ui.getCore().setModel(obj, "MembershipCountry");
				getEle.participantNationality.setValue("Select Tje");
				getEle.participantNationality.setBusy(false);
				sap.ui.getCore().getModel("MembershipCountry").setSizeLimit(obj);
				that.setNextStatus();
			}).fail(function(err) {
				getEle.participantNationality.setBusy(false);
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},

		// API Call to FETCH SCHOOL
		fetchSchoolName: function() {
			var that = this;
			var choice = "$orderby=Code%20desc";
			var getEle = this.getVariablesParticipantDetails();
			getEle.participantSchoolName.setBusy(true);
			this.fetchSchool(that, choice).done(function(obj) {
				obj.setSizeLimit(300);
				sap.ui.getCore().setModel(obj, "SchoolName");
				sap.ui.getCore().getModel("SchoolName").setSizeLimit(obj);
				getEle.participantSchoolName.setBusy(false);
				that.setNextStatus();
			}).fail(function(err) {
				getEle.participantSchoolName.setBusy(false);
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},

		createServieModel: function() {
			var serviceMD = new JSONModel();
			var docDate = this.toDateFormat(Date.now());
			var memMD = this.getView().getModel("createMembershipModel");
			var memData = memMD.getData();
			serviceMD.setProperty('/CardCode', memData.CardCode);
			serviceMD.setProperty('/DocDueDate', docDate);
			serviceMD.setProperty('/DocumentLines', []);
			return serviceMD;
		},

		onCreateOrder: function() {
			var that = this;
			that.showLoading(true);
			var memSericeMD = null;
			if (memSericeMD === null || memSericeMD === undefined) {
				var memServiceMD = this.createServieModel();
				this.getView().setModel(memServiceMD, "MemberServices");
			}
			var memSerData = memServiceMD.getData();
			var serItemMD = this.getView().getModel("ServiceItems");
			var serItemData = serItemMD.getData();
			for (var i = 0; i < serItemData.Items.length; i++) {
				var tmpObj = new Object();
				tmpObj.ItemCode = serItemData.Items[i].ItemCode;
				tmpObj.Quantity = serItemData.Items[i].quantity;
				tmpObj.TaxCode = null;
				tmpObj.UnitPrice = serItemData.Items[i].ItemPrices[0].Price;
				tmpObj.TeamID = serItemData.Items[i].team.Code;
				tmpObj.StartDate = serItemData.Items[i].startData;
				memSerData.DocumentLines.push(tmpObj);
			}
			memServiceMD.setData(memSerData);

			that.createOrder(memServiceMD, "").done(function(obj) {
				var md = new JSONModel();
				that.getView().setModel(md, "TeamList");
				that.getView().setModel(md, "TeamModel");
				that.getView().setModel(md, "ServiceItemsList");
				that.getView().setModel(md, "ItemDeatils");
				that.getView().setModel(null, "ServiceItems");
				var selSeason = that.getView().byId("sSeason");
				selSeason.setSelectedKey("-1");
				that.showLoading(false);
				var getDocEntry = obj.DocEntry;
				that.getOwnerComponent().getRouter()
					.navTo("CreateInvoice", {
						DocEntryID: getDocEntry,
						PageID: 62
					});
			}).fail(function(err) {
				var md = new JSONModel();
				that.getView().setModel(md, "TeamList");
				that.getView().setModel(md, "TeamModel");
				that.getView().setModel(md, "ServiceItemsList");
				that.getView().setModel(md, "ItemDeatils");
				that.getView().setModel(null, "ServiceItems");
				var selSeason = that.getView().byId("sSeason");
				selSeason.setSelectedKey("-1");
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		getVariablesParticipantDetails: function() {

			var items = {
				participantName: this.getView().byId("participantFitstName"),
				participantDOB: this.getView().byId("participantDob"),
				participantSchoolName: this.getView().byId("participantSchoolName"),
				participantNationality: this.getView().byId("participantNationality"),
				participantGender: this.getView().byId("participantGender"),
				participantHowdidUs: this.getView().byId("participantHowdid"),
				wizardID: this.getView().byId("createWizardParent"),
				StepOne: this.getView().byId("ParticipantDetailsID"),
				StepTwo: this.getView().byId("ParentDetailsID"),
				Stepthree: this.getView().byId("OptionalInformationID"),
				StepFour: this.getView().byId("selectServiceID"),
				lmTypes: this.getView().byId("lmType"),
				pageAccount: this.getView().byId("membershipHeadPage"),
				lmLEmail: this.getView().byId("lmLEmail"),
				lmIEmail: this.getView().byId("lmIEmail"),
				lmLPhone: this.getView().byId("lmLPhone"),
				lmIPhone: this.getView().byId("lmIPhone"),
				lmLAdditionlInformaion: this.getView().byId("lmLAdditionlInformaion"),
				lmIAdditionlInformaion: this.getView().byId("lmIAdditionlInformaion")

			};
			return items;
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
		onPressSelectConfirm: function(oEvent) {
			var btn = sap.ui.getCore().byId("pLDialogConfirm");
			btn.setEnabled(true);
		},
		onPressDialogConfirm: function(oEvent) {
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
				/*if (getEle.shParentName.getValue().length > 0) {
					addFilterType = "CardName";
					addFilter = getEle.shParentName.getValue();

					var titleStr = this.titleCase(addFilter);
					criteria += "contains(CardName,'" + titleStr + "')";
				}*/

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
		getSelectedSeason: function() {
			var newModel = new JSONModel();
			this.getView().setModel(newModel, "TeamModel");
			this.getView().setModel(newModel, "ServiceItemsList");
		},
		clearVariablesbValue: function() {
			var getEle = this.getVariablesParentExisting();
			getEle.shParentName.setValue("");
			getEle.shParentEmail.setValue("");
			getEle.shParentDOB.setValue("");
			getEle.shParentMobile.setValue("");
		},
		clearSetValueStatePD: function() {
			var getElePD = this.getVariablesParticipantDetails();
			getElePD.participantName.setValueState("None");
			getElePD.participantDOB.setValueState("None");
			getElePD.participantSchoolName.setValueState("None");
			getElePD.participantNationality.setValue("");
			getElePD.participantGender.setValueState("None");
			getElePD.participantHowdidUs.setValue("");

			getElePD.lmLPhone.setVisible(true);
			getElePD.lmIPhone.setVisible(true);
			getElePD.lmLAdditionlInformaion.setVisible(true);
			getElePD.lmIAdditionlInformaion.setVisible(true);

			var getEleFD = this.getVariablesParentFatherDetails();
			getEleFD.fatherFirstName.setValueState("None");
			getEleFD.fatherNationlality.setValue("");
			getEleFD.fatherEmail.setValueState("None");
			getEleFD.fatherOccupation.setValueState("None");
			getEleFD.fatherPhone.setValueState("None");

			var getEleMD = this.getVariablesParentMotherDetails();
			getEleMD.motherFirstName.setValueState("None");
			getEleMD.motherNationlality.setValue("");
			getEleMD.motherEmail.setValueState("None");
			getEleMD.motherOccupation.setValueState("None");
			getEleMD.motherPhone.setValueState("None");
			var getEleGD = this.getVariablesParentGuardianDetails();
			getEleGD.GuardianFirstName.setValueState("None");
			getEleGD.GuardianNationlality.setValue("");
			getEleGD.GuardianEmail.setValueState("None");
			getEleGD.GuardianOccupation.setValueState("None");
			getEleGD.GuardianPhone.setValueState("None");

			var getEleOI = this.getVariablesOptionalInformation();
			getEleOI.optionalPerson1.setValueState("None");
			getEleOI.person1Mobile.setValueState("None");
			getEleOI.optionalPerson2.setValueState("None");
			getEleOI.person2Mobile.setValueState("None");
			getEleOI.emergencyName.setValueState("None");
			getEleOI.emergencyMobile.setValueState("None");
			getEleOI.additionalInformation.setValueState("None");

			var tab = this.getView().byId("tabParents");

			tab.setSelectedKey("Father");

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
		clearModels: function() {
			var newjMdl = new JSONModel();
			this.getView().setModel(newjMdl, "TeamModel");
			this.getView().setModel(newjMdl, "ServiceItemsList");
			this.getView().setModel(newjMdl, "ItemDetails");
			this.getView().setModel(newjMdl, "ServiceItems");
		},
		onPressDeleteServiceItems: function(oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext("ServiceItems");
			var mdl = ctx.getModel();
			var mdData = mdl.getData();
			var path = ctx.getPath();
			var index = parseInt(path.substring(path.lastIndexOf('/') + 1));
			mdData.Items.splice(index, 1);
			mdl.setData(mdData);
		},
		clearStatueValuesLead: function() {
			var getElePD = this.getVariablesParticipantDetails();
			getElePD.participantName.setValueState("None");
			getElePD.participantDOB.setValueState("None");
			getElePD.participantSchoolName.setValueState("None");
			getElePD.participantGender.setValueState("None");
			getElePD.lmIPhone.setValueState("None");
			getElePD.lmIAdditionlInformaion.setValueState("None");

		},
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
						that.onBack();
						messageOktDialog.close();
					}
				})
			});
			messageOktDialog.open();
		},

		onBack: function() {
			var getPageID = this._pageID;
			switch (getPageID) {
				case "27":
					this.getOwnerComponent().getRouter()
						.navTo("SearchMembership");
					break;
				case "62":
					this.getOwnerComponent().getRouter()
						.navTo("ViewAccount", {
							AccountId: this._getAccountID,
							PageID: 27
						});
					break;
				case "49":
					this.getOwnerComponent().getRouter().navTo("Leads");
					break;

				case "23":
					this.getOwnerComponent().getRouter().
					navTo("AssessmentFeedbackDetail", {
						FeedbackID: this._feedbackID
					});
					break;
				default:
					break;
			}
		}

	});
});