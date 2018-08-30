sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/ViewLeadSAL",
	'sap/ui/model/json/JSONModel'
], function(ViewLeadSAL, JSONModel) {
	"use strict";

	return ViewLeadSAL.extend("com.ss.app.StryxSports.controller.details.ViewLead", {
		onInit: function() {
			this._leadId = "";
			this._pageID = "";
			this._setViewLevel = "";
			this._activityCode = "";
			var oRouter = this.getRouter();
			oRouter.getRoute("ViewLead").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		_onRouteMatched: function(oEvent) {
			let that = this;
			var getLeadId = oEvent.getParameter("arguments").LeadID;
			this._getPageID = oEvent.getParameter("arguments").PageID;
			var getEle = oEvent.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			$.when(that.fetchDataLeadDetails(getLeadId)).then(function() {
				that.fetchActivities(getLeadId);
				that.fetchSportsDetails(getLeadId);
				that.fetchLocationDetails(getLeadId);
			});
		},
		fetchDataLeadDetails: function(leadId) {
			let that = this;
			var ele = that.getView().byId("personalInformation");
			var headerLoading = this.getView().byId("ObjectPageLayout");
			headerLoading.setBusy(true);
			ele.setBusy(true);
			this.fetchLeadDetails(leadId).done(function(response) {
				that._leadId = response.CardCode;
				var mLeadDetails = new JSONModel();
				mLeadDetails.setData(response);
				that.getView().setModel(mLeadDetails, "mLeadDetails");
				that.updateStatusPersonalInfo();
				ele.setBusy(false);
				that.setRemoveMobile();
				headerLoading.setBusy(false);
			}).fail(function(err) {
				ele.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "LeadsDetail");
			});
		},
		fetchActivities: function(leadId) {
			let that = this;
			var ele = that.getView().byId("activities");
			var viewleadSAL = new ViewLeadSAL();
			ele.setBusy(true);
			var acFilter = "$filter=CardCode%20eq%20'" + leadId + "'||$expand=ActivityType,EmployeeInfo,BusinessPartner" +
				"||$inlinecount=allpages";
			viewleadSAL.fetchActivities(leadId, acFilter).done(function(response) {
				var mActivities = new JSONModel();
				mActivities.setData(response);
				that.getView().setModel(mActivities, "mActivities");
				ele.setBusy(false);
			}).fail(function(err) {
				ele.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "LeadsDetail");
			});
		},
		///Here Sports Table Details
		fetchSportsDetails: function(leadId) {
			let that = this;
			var sportsBusy = that.getView().byId("sportsObjectPage");
			sportsBusy.setBusy(true);
			var filter = encodeURI(
				"$expand=U_SS_SPORTS($select=Code, Name, U_SportsDescription,U_Status)||$filter=U_SS_LEAD_SPORTS/U_SportCode eq U_SS_SPORTS/Code and U_SS_LEAD_SPORTS/U_LeadCode eq  '" +
				leadId + "'");
			var viewLeadSAL = new ViewLeadSAL();
			viewLeadSAL.fetchSports(filter).done(function(response) {
				var mSports = new JSONModel();
				mSports.setData(response);
				that.getView().setModel(mSports, "mSports");
				sportsBusy.setBusy(false);
			}).fail(function(err) {
				sportsBusy.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},

		fetchLocationDetails: function(leadId) {
			let that = this;
			var locationBusy = that.getView().byId("OPLocations");
			locationBusy.setBusy(true);
			var filter = encodeURI(
				"$expand=U_SS_LOCATIONS($select=Code, Name, U_Description,U_Status)||$filter=U_SS_LEAD_LOCATIONS/U_LocationCode eq U_SS_LOCATIONS/Code and U_SS_LEAD_LOCATIONS/U_CardCode eq  '" +
				leadId + "'");

			this.fetchLocations(filter).done(function(response) {
				var vlLocations = new JSONModel();
				vlLocations.setData(response);
				that.getView().setModel(vlLocations, "vlLocations");
				locationBusy.setBusy(false);
			}).fail(function(err) {
				locationBusy.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},

		onPressTimelinePost: function(oEvt) {
			let that = this;
			that._activityCode = oEvt.getParameters().selectedItem.mProperties.text;
			that.getView().byId("timelineEditActBtn").setVisible(true);
		},
		onPressActEditBtn: function() {
			var that = this;
			that.getOwnerComponent().getRouter()
				.navTo("EditActivity", {
					ActivityID: that._activityCode,
					PageID: 61
				});
		},
		updateEmgPanel: function() {
			var getModleLD = this.getView().getModel("mLeadDetails");
			var getEle = this.viewLeadsVariables();
			var emgLabel = this.getView().byId("emergencyContailLabel");
			var getFirstValueMbl = getModleLD.oData.ContactEmployees[0].MobilePhone;
			var getFirstValueName = getModleLD.oData.ContactEmployees[0].Name;
			var getSecondValueMbl = getModleLD.oData.ContactEmployees[1].MobilePhone;
			var getSecondValueName = getModleLD.oData.ContactEmployees[1].Name;
			var geThirdValueMbl = getModleLD.oData.ContactEmployees[2].MobilePhone;
			var getThirdValueName = getModleLD.oData.ContactEmployees[2].Name;
			if (getFirstValueMbl === "" && getFirstValueName === "") {
				getEle.emgPanel.setVisible(false);
				emgLabel.setVisible(false);
			} else if (!(getFirstValueMbl && getFirstValueName) === "") {
				getEle.emgPanel.setVisible(true);
				emgLabel.setVisible(true);
			} else if (getSecondValueMbl === "" && getSecondValueName === "") {
				getEle.emgPanel.setVisible(false);
				emgLabel.setVisible(false);
			} else if (!(getSecondValueMbl && getSecondValueName) === "") {
				getEle.emgPanel.setVisible(true);
				emgLabel.setVisible(true);
			} else if (geThirdValueMbl === "" && getThirdValueName === "") {
				getEle.emgPanel.setVisible(false);
				emgLabel.setVisible(false);
			} else if (!(geThirdValueMbl && getThirdValueName) === "") {
				getEle.emgPanel.setVisible(true);
				emgLabel.setVisible(true);
			} else {
				getEle.emgPanel.setVisible(true);
				emgLabel.setVisible(true);
			}
		},
		updateStatusPersonalInfo: function() {
			var getModleId = this.getView().getModel("mLeadDetails");
			var personalId = this.viewLeadsVariables();
			var getFather = this.getView().byId("blcFather");
			var getMother = this.getView().byId("blcMother");
			var getGuardian = this.getView().byId("blcGuardian");
			var getDatas = getModleId.getData();
			this.updateEmgPanel();
			if (getDatas.U_SS_MEMBER_TYPE !== "") {
				var getSeleGet = getDatas.U_SS_MEMBER_TYPE;
				switch (getSeleGet) {
					case "1":
						// Child
						personalId.personal.setVisible(true);
						personalId.adultId.setVisible(false);
						break;
					case "2":
						// Adult
						personalId.personal.setVisible(false);
						personalId.adultId.setVisible(true);
						break;
					default:
				}

			}

			if (getDatas.U_Father === "" || getDatas.U_Father === null) {
				getFather.setVisible(false);
			} else {
				getFather.setVisible(true);
			}
			if (getDatas.U_Gardian === "" || getDatas.U_Father === null) {
				getGuardian.setVisible(false);
			} else {
				getGuardian.setVisible(true);
			}
			if (getDatas.U_Mother === "" || getDatas.U_Mother === null) {
				getMother.setVisible(false);
			} else {
				getMother.setVisible(true);
			}
		},
		viewLeadsVariables: function() {
			var items = {
				childInfo: this.getView().byId("personalInformation"),
				personal: this.getView().byId("personalInfoBRow"),
				StepOne: this.getView().byId("StepOne"),
				emgPanel: this.getView().byId("emgViewLeadPanel"),
				adultId: this.getView().byId("adultsInfo")
			};
			return items;
		},
		onPressCreateActivity: function() {
			var getLDCode = this._leadId;
			this.getOwnerComponent().getRouter().navTo("CreateActivity", {
				LeadID: getLDCode,
				PageID: this._setViewLevel
			});

		},
		OnPressEditLead: function() {
			let that = this;
			/*var url = window.location.href;
			var aUrl = url.split('/');
			var substr = aUrl[aUrl.length - 1];*/
			that.getOwnerComponent().getRouter()
				.navTo("EditLead", {
					LeadID: that._leadId,
					PageID: this._setViewLevel
				});
		},
		onBack: function() {
			var getPagesID = this._getPageID;
			switch (getPagesID) {
				case "27":
					this.getOwnerComponent().getRouter()
						.navTo("SearchMembership");
					break;
				case "49":
					this.getOwnerComponent().getRouter().navTo("Leads");
					break;
				default:
					this.getOwnerComponent().getRouter().navTo("DashBoard");
					break;
			}
		},
		setRemoveMobile: function() {
			var that = this;
			var memModel = that.getView().getModel("mLeadDetails");
			var mData = memModel.getData();

			if (mData.Cellular !== "" && mData.Cellular !== null && mData.CardCode !== undefined) {
				var getMemCellular = this.setRemoveCharacter(mData.Cellular);
				mData.Cellular = getMemCellular;

			}
			if (mData.Father.Cellular !== "" && mData.Father.Cellular !== null && mData.Father.Cellular !== undefined) {
				var getMemmFatherCellular = this.setRemoveCharacter(mData.Father.Cellular);
				mData.Father.Cellular = getMemmFatherCellular;

			}
			if (mData.Mother.Cellular !== "" && mData.Mother.Cellular !== null && mData.Mother.Cellular !== undefined) {
				var getMemMotherCellular = this.setRemoveCharacter(mData.Mother.Cellular);
				mData.Mother.Cellular = getMemMotherCellular;

			}
			if (mData.Guardian.Cellular !== "" && mData.Guardian.Cellular !== null && mData.Guardian.CardCode !== undefined) {
				var getMemGuardianCellular = this.setRemoveCharacter(mData.Guardian.Cellular);
				mData.Guardian.Cellular = getMemGuardianCellular;

			}

			if (mData.U_School === "-1") {
				mData.U_School = "";
			}
			if (mData.U_Nationality === "-1") {
				mData.U_Nationality = "";
			}
			memModel.setData(mData);
			memModel.refresh(true);

		}
	});

});