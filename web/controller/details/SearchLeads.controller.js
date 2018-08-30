sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL",
	'sap/ui/model/json/JSONModel'
], function(CreateAssessmentsSAL, JSONModel) {
	"use strict";

	return CreateAssessmentsSAL.extend("com.ss.app.StryxSports.controller.details.SearchLeads", {
		onInit: function() {
			this._pageID = "";
			this._setViewLevel = "";
			var oRouter = this.getRouter();
			oRouter.getRoute("SearchLeads").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.jsonObj = new sap.ui.model.json.JSONModel();
		},
		_onRouteMatched: function(oEvt) {
			this.clearVariablesbValue();
			var getEles = oEvt.getParameters();
			this._setViewLevel = getEles.config.viewLevel;
			/*	var getSessionData = this.getContext();
			if(getSessionData.SessionData.sessionID == '' || getSessionData.SessionData.sessionID == '')
			{
                this.fetchMessageOk("", "", "Unauthorized" , "Login");
			}*/
		},
			onAfterRendering: function() {
			var view = this.getView();
			view.addDelegate({
				onsapenter: function(e) {
					view.getController().onPressSearchLeads();
				}
			});
        },
		onPressSearchLeads: function() {
			var that = this;
			var addFilter = null,
				addFilterType = null;
			var criteria = "";
			var getSearchLeads = this.getVariables();
			var getSearchLeadsType = this.getView().byId("sSearchLeadsType");
			var tableTitle = this.getView().byId("searchTableTilte");
			var getSelType = getSearchLeadsType.getSelectedKey();

			if (getSelType !== "-1") {
				switch (getSelType) {
					case "1":
						var sLeadName = getSearchLeads.searchLeadName.getValue().replace(/\s+/g, ' ');
						getSearchLeadsType.setValueState("None");
						tableTitle.setText("Leads");
						if (sLeadName !== "" || getSearchLeads.searchLeadEmail.getValue() !== "" || getSearchLeads.searchLeadDOB
							.getValue() !== "" || getSearchLeads.searchLeadMobile.getValue() !== "") {
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
							if (getSearchLeads.searchLeadEmail.getValue().length > 0) {
								addFilterType = "EmailAddress";
								addFilter = getSearchLeads.searchLeadEmail.getValue();
								if (criteria !== "") {
									criteria += " or ";
								}
								criteria += "contains(EmailAddress,'" + getSearchLeads.searchLeadEmail.getValue() + "')";
							}
							if (getSearchLeads.searchLeadDOB.getValue().length > 0) {
								var getDate = getSearchLeads.searchLeadDOB.getValue();
								var dobDate = this.toDateFormat(getDate);
								addFilter = dobDate;
								if (criteria !== "") {
									criteria += " or ";
								}
								criteria += "contains(U_Dob,'" + dobDate + "')";
							}
							if (getSearchLeads.searchLeadMobile.getValue().length > 0) {
								addFilter = getSearchLeads.searchLeadMobile.getValue();
								addFilterType = "Cellular";
								if (criteria !== "") {
									criteria += " or ";
								}
								criteria += "contains(Cellular,'" + getSearchLeads.searchLeadMobile.getValue() + "')";
							}
						}
						if (getSearchLeads.searchLeadMobile.getValue().length > 0 || sLeadName.length > 0 || 
						getSearchLeads.searchLeadEmail.getValue().length > 0 || getSearchLeads.searchLeadDOB.getValue().length > 0) {
							that.getView().setBusy(true);
							var createAssessmentsSAL = new CreateAssessmentsSAL();
							var tFilterCardType = encodeURI("$filter=CardType eq 'cLid' and (" + criteria +
								")||$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress,U_Dob");
							createAssessmentsSAL.fetchBusinessPartners(that, tFilterCardType).done(function(obj) {
								that.getView().setModel(obj, "AssessmentList");
								that.getView().setBusy(false);
								that.getView().byId("tableAssessmentBlockLayoutRow").setVisible(true);
							}).fail(function(err) {
								that.getView().setBusy(false);
								that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
							});
						} else {
							that.MessageToastShow("Please Enter Atleast One Filter Field");
						}
						break;
					case "2":
						var sIMLeadName = getSearchLeads.searchLeadName.getValue().replace(/\s+/g, ' ');
						getSearchLeadsType.setValueState("None");
						tableTitle.setText("Inactive Accounts");
						if (sIMLeadName !== "" || getSearchLeads.searchLeadEmail.getValue() !== "" || 
						getSearchLeads.searchLeadDOB.getValue() !== "" || getSearchLeads.searchLeadMobile.getValue() !== "") {
							if (sIMLeadName.length > 0) {
								addFilterType = "CardName";
								addFilter = sIMLeadName;
								criteria += "contains(CardName,'" + sIMLeadName + "')";
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
							if (getSearchLeads.searchLeadDOB.getValue().length > 0) {
								var getDate = getSearchLeads.searchLeadDOB.getValue();
								var dobDate = this.toDateFormat(getDate);
								addFilter = dobDate;
								if (criteria !== "") {
									criteria += " or ";
								}
								criteria += "contains(U_Dob,'" + dobDate + "')";
							}
							if (getSearchLeads.searchLeadMobile.getValue().length > 0) {
								addFilter = getSearchLeads.searchLeadMobile.getValue();
								addFilterType = "Cellular";
								if (criteria !== "") {
									criteria += " or ";
								}
								criteria += "contains(Cellular,'" + getSearchLeads.searchLeadMobile.getValue() + "')";
							}
						}
						if (getSearchLeads.searchLeadMobile.getValue().length > 0 || getSearchLeads.searchLeadName.getValue().length > 0 ||
							getSearchLeads.searchLeadEmail.getValue().length > 0 || getSearchLeads.searchLeadDOB.getValue().length > 0) {
							that.getView().setBusy(true);
							var inactiveMembers = new CreateAssessmentsSAL();
							var sIMFilterCardType = encodeURI("$filter=Valid eq 'tNO' and (" + criteria + ")||$select=CardCode,CardType,CardName,EmailAddress,Cellular");
							inactiveMembers.fetchBusinessPartners(that, sIMFilterCardType).done(function(obj) {
								that.getView().setModel(obj, "AssessmentList");
								that.getView().setBusy(false);
								that.getView().byId("tableAssessmentBlockLayoutRow").setVisible(true);
							}).fail(function(err) {
								that.getView().setBusy(false);
								that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
							});
						} else {
							that.MessageToastShow("Please Enter Atleast One Filter Field");
						}
						break;
				}
			} else {
				getSearchLeadsType.setValueState("Error");
				that.MessageToastShow("Please Select The Search Type");
			}
		},
		handleEditDetailAssessmentPress: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("AssessmentList");
			this.getOwnerComponent().getRouter()
				.navTo("CreateAssessmentsDetail", {
					LeadID: oCtx.getProperty("CardCode"),
					PageID: this._setViewLevel
				});
		},
		getVariables: function() {
			var getSearchLeads = {
				searchLeadName: this.getView().byId("sLeadName"),
				searchLeadEmail: this.getView().byId("sLeadEmail"),
				searchLeadDOB: this.getView().byId("sLeadDOB"),
				searchLeadMobile: this.getView().byId("sLeadMobile"),
				searchSearchType: this.getView().byId("sSearchLeadsType"),
				searchSearchTableAssessment: this.getView().byId("tableAssessmentBlockLayoutRow")
			};
			return getSearchLeads;
		},
		clearVariablesbValue: function() {
			var getEle = this.getVariables();
			getEle.searchLeadName.setValue("");
			getEle.searchLeadEmail.setValue("");
			getEle.searchLeadDOB.setValue("");
			getEle.searchLeadMobile.setValue("");
			getEle.searchSearchType.setValueState("None");
			getEle.searchSearchType.setSelectedKey("-1");
			getEle.searchSearchTableAssessment.setVisible(false);
			var newMdl = new JSONModel();
			sap.ui.getCore().setModel(newMdl, "AssessmentList");

		},
		getSelectedSearchType: function() {
			var getEle = this.getVariables();
			var getSelType = getEle.searchSearchType.getSelectedKey();
			if (getSelType !== "-1") {
				getEle.searchSearchType.setValueState("None");
				switch (getSelType) {
					case '1':
						this.getView().byId("tableAssessmentBlockLayoutRow").setVisible(false);
						break;
					case '2':
						this.getView().byId("tableAssessmentBlockLayoutRow").setVisible(false);
						break;
					default:
						this.getView().byId("tableAssessmentBlockLayoutRow").setVisible(false);
				}
			} else {
				getEle.searchSearchType.setValueState("Error");
			}
		}
	});

});