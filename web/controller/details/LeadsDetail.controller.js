sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL",
	'sap/ui/model/json/JSONModel'
], function(CreateAssessmentsSAL, JSONModel) {
	"use strict";
	return CreateAssessmentsSAL.extend("com.ss.app.StryxSports.controller.details.LeadsDetail", {
		onInit: function() {
			var oRouter = this.getRouter();
			this._setViewLevel = "";
			oRouter.getRoute("Leads").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.jsonObj = new sap.ui.model.json.JSONModel();
		},
		_onRouteMatched: function(oEvent) {
			var getEle = oEvent.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			this.clearVariablesbValue();
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
					membershipID: oCtx.getProperty("membershipID"),
					PageID: this._setViewLevel
				});
		},
		onPressViewLead: function(evt) {
			var that = this;
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("LeadList");
			that.getOwnerComponent().getRouter()
				.navTo("ViewLead", {
					LeadID: oCtx.getProperty("CardCode"),
					PageID: this._setViewLevel
				});
		},
		onPressSearchLeads: function() {
			var that = this;
			var addFilter, addFilterType = null;
			var criteria = "";
			var getSearchLeads = this.getVariables();
			var sMemLeadName = getSearchLeads.searchLeadName.getValue().replace(/\s+/g, ' ');

			if (sMemLeadName !== "" || getSearchLeads.searchLeadEmail.getValue() !== "" || getSearchLeads.searchLeadMobile.getValue() !== "") {
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
				.getValue().length > 0) {
				var createAssessmentsSAL = new CreateAssessmentsSAL();
				that.getView().setBusy(true);
				var tFilterCardType = encodeURI("$filter=CardType eq 'cLid' and (" + criteria +
					")&$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress");
				createAssessmentsSAL.fetchBusinessPartners(that, tFilterCardType).done(function(obj) {
					sap.ui.getCore().setModel(obj, "LeadList");
					that.getView().setBusy(false);
					that.getView().byId("tableView").setVisible(true);
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
		},
		onPressCreateMembership: function() {
			this.getRouter().navTo("LeadsMemnewCreate", {
				PageID: this._setViewLevel
			});
		},
		getVariables: function() {
			var getSearchLeads = {
				searchLeadName: this.getView().byId("sLeadName"),
				searchLeadEmail: this.getView().byId("sLeadEmail"),
				searchLeadMobile: this.getView().byId("sLeadMobile"),
				slTableView: this.getView().byId("tableView")
			};
			return getSearchLeads;
		},
		clearVariablesbValue: function() {
			var getEle = this.getVariables();
			getEle.searchLeadName.setValue("");
			getEle.searchLeadEmail.setValue("");
			//getEle.searchLeadDOB.setValue("");
			getEle.searchLeadMobile.setValue("");
			//getEle.searchLeadType.setSelectedKey(-1);
			var newMdl = new JSONModel();
			sap.ui.getCore().setModel(newMdl, "LeadList");
			getEle.slTableView.setVisible(false);

		},
		toggleBtnGroup: function(evt) {
			var that = this;
			var selected = evt.getSource();
			if (selected.getSelected(true)) {
				var oEditBtn = that.getView().byId("editLeadBtn");
				oEditBtn.setVisible(false);
				that.getView().byId("addActivityBtn");
				that.getView().byId("createMemBtn");
				that.getView().byId("viewLeadBtn");
			}
		},
		onPressEditLead: function(evt) {
			var that = this;
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("LeadList");
			that.getOwnerComponent().getRouter()
				.navTo("EditLead", {
					LeadID: oCtx.getProperty("CardCode"),
					PageID: this._setViewLevel
				});
		},
		onPressAddActivity: function(evt) {
			var that = this;
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("LeadList");
			that.getOwnerComponent().getRouter()
				.navTo("CreateActivity", {
					LeadID: oCtx.getProperty("CardCode"),
					PageID: this._setViewLevel
				});
		},
		onPressCreateAssessment: function(evt) {
		    var that = this;
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("LeadList");
			that.getOwnerComponent().getRouter()
				.navTo("CreateAssessmentsDetail", {
					LeadID: oCtx.getProperty("CardCode"),
					PageID: this._setViewLevel
				});
		},
		onPressCreatemember: function(evt) {
			var that = this;
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("LeadList");
			that.getRouter().navTo("LeadToAccount", {
				AccountId: oCtx.getProperty("CardCode"),
				PageID: this._setViewLevel

			});
		}
	});

});