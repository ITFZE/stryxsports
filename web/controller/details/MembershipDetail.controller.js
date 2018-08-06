sap.ui.define([
	'com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast'
], function(CreateAssessmentsSAL, JSONModel, MessageToast) {
	"use strict";
	return CreateAssessmentsSAL.extend("com.ss.app.StryxSports.controller.details.MembershipDetail", {
		onInit: function() {
			var oRouter = this.getRouter();
			this._setViewLevel = "";
			oRouter.getRoute("SearchMembership").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.jsonObj = new sap.ui.model.json.JSONModel();

		},
		_onRouteMatched: function(oEvent) {
			var getEle = oEvent.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			this.clearVariablesbValue();
			var tableHide = this.getView().byId("tableAssessmentBlockLayoutRow");
			tableHide.setVisible(false);
		},
		onAfterRendering: function() {
			var view = this.getView();
			view.addDelegate({
				onsapenter: function(e) {
					view.getController().onPressSearchLeads();
				}
			});
		},
		onPressEditMembership: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext();
			this.getOwnerComponent().getRouter()
				.navTo("EditMembership", {
					AccountId: oCtx.getProperty("membershipID")
				});
		},
		noPressCreateCustome: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("AssessmentList");
			this.getOwnerComponent().getRouter()
				.navTo("MembershipNewEdit", {
					AccountId: oCtx.getProperty("CardCode"),
					PageID: this._setViewLevel
				});
		},
		onPressMemCreateActivity: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("AssessmentList");
			this.getOwnerComponent().getRouter()
				.navTo("CreateActivity", {
					PageID: this._setViewLevel,
					LeadID: oCtx.getProperty("CardCode")
				});
		},
		onPressSearchLeads: function() {
			var that = this;
			var addFilter, addFilterType = null;
			var criteria = "";
			var getSelectedText = that.getView().byId("memType").getSelectedItem().getText();
			var getSearchLeads = this.getVariables();
			var textTitle = that.getView().byId("txtMember");
			var getSelectedKey = that.getView().byId("memType");
			if (getSelectedText === "Select Type") {
				getSelectedKey.setValueState("Error");
				this.MessageToastShow("Please Select Type Name");
			} else {
				getSelectedKey.setValueState("None");
				var sMemLeadName = getSearchLeads.searchLeadName.getValue().replace(/\s+/g, ' ');
				if (sMemLeadName !== "" || getSearchLeads.searchLeadEmail.getValue() !== "" || getSearchLeads.searchLeadDOB
					.getValue() !== "" || getSearchLeads.searchLeadMobile.getValue() !== "") {

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
					if (getSearchLeads.searchLeadEmail.getValue().length > 0) {
						addFilterType = "EmailAddress";
						addFilter = getSearchLeads.searchLeadEmail.getValue();
						if (criteria !== "") {
							criteria += " or ";
						}
						criteria += "contains(EmailAddress,'" + getSearchLeads.searchLeadEmail.getValue() + "')";
					}
					/*	if (getSearchLeads.searchLeadDOB.getValue().length > 0) {
						addFilter = getSearchLeads.searchLeadDOB.getValue();
						if (criteria !== "") {
							criteria += " or ";
						}
						criteria += "contains(U_Dob,'" + getSearchLeads.searchLeadDOB.getValue() + "')";
					}*/
					if (getSearchLeads.searchLeadMobile.getValue().length > 0) {
						addFilter = getSearchLeads.searchLeadMobile.getValue();
						addFilterType = "Cellular";
						if (criteria !== "") {
							criteria += " or ";
						}
						criteria += "contains(Cellular,'" + getSearchLeads.searchLeadMobile.getValue() + "')";
					}
				} else {
					this.MessageToastShow("Please Enter Any Of The Fields Before Searching..");
				}
				if (getSearchLeads.searchLeadMobile.getValue().length > 0 || sMemLeadName.length > 0 || getSearchLeads.searchLeadEmail
					.getValue().length > 0 || getSearchLeads.searchLeadDOB.getValue().length > 0) {
					var createAssessmentsSAL = new CreateAssessmentsSAL();

					if (getSelectedText === "Lead") {
						that.getView().setBusy(true);
						textTitle.setText("Leads");
						getSearchLeads.btnViewLead.setVisible(true);
						getSearchLeads.btnAssessment.setVisible(true);
						getSearchLeads.btnActivity.setVisible(true);
						getSearchLeads.btnAccountCreate.setVisible(true);
						getSearchLeads.btnCreateAct.setVisible(false);
						getSearchLeads.btnViewAccount.setVisible(false);
						getSearchLeads.btnEditAccount.setVisible(false);
						getSearchLeads.btnViewLeads.setVisible(false);
						var tFilterCardType = encodeURI("$filter=CardType eq 'cLid' and (" + criteria +
							")&$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress");
						createAssessmentsSAL.fetchBusinessPartners(that, tFilterCardType).done(function(obj) {
							sap.ui.getCore().setModel(obj, "AssessmentList");
							that.getView().setBusy(false);
							that.getView().byId("tableAssessmentBlockLayoutRow").setVisible(true);
							if (obj.oData.value.length > 0) {
								//that.MessageToastShow("Success");
							} else {
								//	that.MessageToastShow("No Data");
							}
						}).fail(function(err) {
							that.getView().setBusy(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
						});
					} else if (getSelectedText === "Account") {
						that.getView().setBusy(true);
						textTitle.setText("Accounts");
						getSearchLeads.btnViewAccount.setVisible(true);
						getSearchLeads.btnEditAccount.setVisible(true);
						getSearchLeads.btnViewLeads.setVisible(true);
						getSearchLeads.btnCreateAct.setVisible(true);
						getSearchLeads.btnAssessment.setVisible(false);
						getSearchLeads.btnActivity.setVisible(false);
						getSearchLeads.btnViewLead.setVisible(false);
						getSearchLeads.btnAccountCreate.setVisible(false);
						var tFilterCardType = encodeURI("$filter=GroupCode eq 102 and CardType eq 'cCustomer' and (" + criteria +
							")&$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress");
						createAssessmentsSAL.fetchBusinessPartners(that, tFilterCardType).done(function(obj) {
							sap.ui.getCore().setModel(obj, "AssessmentList");
							that.getView().setBusy(false);
							that.getView().byId("tableAssessmentBlockLayoutRow").setVisible(true);
							if (obj.oData.value.length > 0) {
								that.MessageToastShow("Success");
							} else {
								that.MessageToastShow("No Data");
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
		onPressCreateMembership: function(evt) {

			this.getRouter().navTo("MembershipNewCreate", {
				PageID: this._setViewLevel
			});

		},
		getVariables: function() {
			var getSearchLeads = {
				searchLeadName: this.getView().byId("sLeadName"),
				searchLeadEmail: this.getView().byId("sLeadEmail"),
				searchLeadDOB: this.getView().byId("sLeadDOB"),
				searchLeadMobile: this.getView().byId("sLeadMobile"),
				searchLeadType: this.getView().byId("memType"),
				btnViewLead: this.getView().byId("btnLeadView"),
				btnAccountCreate: this.getView().byId("btnCreateAcc"),
				btnViewAccount: this.getView().byId("editViewButton"),
				btnEditAccount: this.getView().byId("addEditButton"),
				btnViewLeads: this.getView().byId("addViewButton"),
				btnActivity: this.getView().byId("btnActivity"),
				btnAssessment: this.getView().byId("btnAssessment"),
				btnCreateAct: this.getView().byId("btnCreateAct"),
				btnMemEditActivity: this.getView().byId("MemEditActivityBtn")
			};
			return getSearchLeads;
		},
		clearVariablesbValue: function() {
			var getEle = this.getVariables();
			getEle.searchLeadName.setValue("");
			getEle.searchLeadEmail.setValue("");
			getEle.searchLeadDOB.setValue("");
			getEle.searchLeadMobile.setValue("");
			getEle.searchLeadType.setSelectedKey(-1);
			var newMdl = new JSONModel();
			sap.ui.getCore().setModel(newMdl, "AssessmentList");
		},
		changeCreateMemType: function() {
			var textNew = this.getView().byId("txtMember");
			var getVariables = this.getVariables();
			if (getVariables.searchLeadType.getSelectedKey() !== "-1") {
				getVariables.searchLeadType.setValueState("None");
				// getVariables.searchLeadType.setValueStateText("");
			} else if (getVariables.searchLeadType.getSelectedItem().getText() === "Lead") {
				textNew.setTitle("Leads");
			} else {
				getVariables.searchLeadType.setValueState("Error");
				this.getView().byId("tableAssessmentBlockLayoutRow").setVisible(false);
				getVariables.searchLeadType.setValueStateText("");
			}
		},
		onPressViewAccount: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("AssessmentList");
			this.getOwnerComponent().getRouter()
				.navTo("ViewAccount", {
					AccountId: oCtx.getProperty("CardCode"),
					PageID: this._setViewLevel
				});
		},
		navToOrder: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("AssessmentList");
			this.getOwnerComponent().getRouter()
				.navTo("SelectServices", {
					AccountId: oCtx.getProperty("CardCode"),
					PageID: this._setViewLevel
				});
		},
		onPressCreateAssessment: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("AssessmentList");
			this.getOwnerComponent().getRouter()
				.navTo("CreateAssessmentsDetail", {
					LeadID: oCtx.getProperty("CardCode"),
					PageID: this._setViewLevel
				});
		},
		onPressViewLead: function(evt) {
			var that = this;
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("AssessmentList");
			that.getOwnerComponent().getRouter()
				.navTo("ViewLead", {
					LeadID: oCtx.getProperty("CardCode"),
					PageID: this._setViewLevel
				});
		}
	});

});