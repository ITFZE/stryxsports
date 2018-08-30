sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL",
	"com/ss/app/StryxSports/controller/sal/CoachsSAL",
	"com/ss/app/StryxSports/controller/sal/CreateActivitySAL",
	"com/ss/app/StryxSports/controller/sal/CreateMembershipSAL",
	"com/ss/app/StryxSports/controller/sal/ViewLeadSAL",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
], function(CreateAssessmentsSAL, CoachsSAL, CreateActivitySAL, CreateMembershipSAL, ViewLeadSAL, JSONModel, ValueState, Validator) {
	"use strict";

	return CreateActivitySAL.extend("com.ss.app.StryxSports.controller.details.create.CreateActivity", {
		onInit: function() {
			var oRouter = this.getRouter();
			var setJSONModel = new JSONModel();
			this.getView().setModel(setJSONModel, "createActivityModel");
			this._AccountID = "";
			this._setViewLevel = "";
			this._getPageID = "";
			this._getCardCode = "";
			this._ActivityID = "";
			oRouter.getRoute("CreateActivity").attachMatched(this._onRouteMatched, this);
			oRouter.getRoute("EditActivity").attachMatched(this._onRouteMatchedEditActivity, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.byId("caStartDateAndTime").setDateValue(new Date());
			this.byId("caStartTime").setValue(new Date());
		},
		_onRouteMatchedEditActivity: function(oEvent) {
			var that = this;
			this._ActivityID = oEvent.getParameter("arguments").ActivityID;
			this._getPageID = oEvent.getParameter("arguments").PageID;
			var getEles = oEvent.getParameters();
			this._setViewLevel = getEles.config.viewLevel;
			var getEle = this.getVariables();
			getEle.caFirstActivity.setValue("Select The Activity");
			this.getView().setBusy(true);
			getEle.getPage.setTitle("Edit Activity");
			that.getView().byId("editActivitySubSection").setTitle("EDIT ACTIVITY");
			getEle.caSave.setText("Save");
			//	this.clearVariablesAddress();
			this.clearModels();
			$.when(that.fetchTypes()).then(function() {
				$.when(that.fetchNationality()).then(function() {
					$.when(that.fetchMeetingLocations()).then(function() {
						$.when(that.fetchEmployees()).then(function() {
							$.when(that.fetchActivities()).then(function() {

								return;

							});
						});
					});
				});
			});
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
			this.clearModels();
			//		this.clearVariablesAddress();
			this._AccountID = oEvent.getParameter("arguments").LeadID;
			this._getPageID = oEvent.getParameter("arguments").PageID;
			var getEles = oEvent.getParameters();
			this._setViewLevel = getEles.config.viewLevel;
			this.createActivityJSONModel();
			that.upDateStatus("Create");
			$.when(that.fetchLeadsDetails()).then(function() {
				$.when(that.fetchNationality()).then(function() {
					$.when(that.fetchTypes()).then(function() {
						$.when(that.fetchMeetingLocations()).then(function() {
							$.when(that.fetchEmployees()).then(function() {
								return;
							});
						});
					});
				});

			});

		},
		fetchEmployees: function() {
			var that = this;
			var filter = "$select=FirstName,LastName,EmployeeID";
			var coachsSAL = new CoachsSAL();
			var getHandledBy = this.getView().byId("caHandledBy");
			var oItem = new sap.ui.core.Item({
				text: "Select Handled By",
				key: -1
			});
			getHandledBy.setBusy(true);
			coachsSAL.fetchEmployeesInfos(filter).done(function(obj) {
				that.getView().setModel(obj, "EmployeesList");
				getHandledBy.insertItem(oItem, 0);
				getHandledBy.setSelectedItem(oItem);
				that.getView().byId("caHandledBy").setValueState("None");
				getHandledBy.setBusy(false);
			}).fail(function(err) {
				getHandledBy.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		onPressSaveCreateActivity: function() {
			var that = this;
			var getEle = this.getVariables();
			if (getEle.caFirstActivity.getValue() === "Select The Activity" || getEle.caFirstActivity.getValue() === "") {
				getEle.caFirstActivity.setValueState("Error");
			} else if (getEle.caStartDateAndTime.getValue() === "" || getEle.caStartDateAndTime.getValue() === " - ") {
				getEle.caFirstActivity.setValueState("None");
				getEle.caStartDateAndTime.setValueState("Error");
			} else if (getEle.caType.getValue() === "Select Type" || getEle.caType.getValue() === "") {
				getEle.caStartDateAndTime.setValueState("None");
				getEle.caType.setValueState("Error");
			} else if (getEle.caHandledBy.getValue() === "Select Handled By" || getEle.caHandledBy.getValue() === "") {
				getEle.caType.setValueState("None");
				getEle.caStartDateAndTime.setValueState("None");
				getEle.caHandledBy.setValueState("Error");
			} else if (getEle.caStartTime.getValue() === "") {
				getEle.caHandledBy.setValueState("None");
				getEle.caStartTime.setValueState("Error");
			} else if (getEle.caEndTime.getValue() === "") {
				getEle.caStartTime.setValueState("None");
				getEle.caEndTime.setValueState("Error");
			} else {
				getEle.caStartTime.setValueState("None");
				getEle.caEndTime.setValueState("None");
				var getModle = this.getView().getModel("createActivityModel");
				var getMDLData = getModle.getData();
				var getDateAndTime = getEle.caStartDateAndTime.getDateValue();
				var getSecondDateValue = getEle.caStartDateAndTime.getSecondDateValue();
				var getStartDate = this.toDateFormat(getDateAndTime);
				var getEndDueDate = this.toDateFormat(getSecondDateValue);
				var startTime = getEle.caStartTime.getValue();
				var endTime = getEle.caEndTime.getValue();
				// var getStarTime = this.toTimeFormat(getDateAndTime);
				getModle.setProperty("/StartDate", getStartDate);
				getModle.setProperty("/EndDueDate", getEndDueDate);
				getModle.setProperty("/StartTime", startTime);
				getModle.setProperty("/EndTime", endTime);
				getModle.setProperty("/ActivityDate", getStartDate);
				getModle.setProperty("/ActivityTime", startTime);
				getModle.setProperty("/SeriesStartDate", getStartDate);

				/*	if (getEle.caFirstActivity.getSelectedKey() === "cn_Meeting") {
					var getElement = this.getVariablesAddress();
					var getStreet = getElement.addIStreet.getValue();
					var getCity = getElement.addICity.getValue();
					var getRoom = getElement.addIRoom.getValue();
					var getState = getElement.addIState.getValue();
					var getCountry = getElement.addICountry.getValue();
					var getLocation = getElement.addIMeetingLocation.getValue();

					getModle.setProperty("/Street", getStreet);
					getModle.setProperty("/City", getCity);
					getModle.setProperty("/Room", getRoom);
					getModle.setProperty("/State", getState);
					getModle.setProperty("/Country", getCountry);
					getModle.setProperty("/Location", getLocation);*/

				//	}
				getModle.setProperty("/CardCode", this._AccountID);
				that.showLoading(true);
				if (getMDLData.ActivityCode !== "" && getMDLData.ActivityCode !== undefined) {
					var getActivityCode = getMDLData.ActivityCode;
					delete getMDLData.ActivityCode;
					var cActivityModel = new JSONModel();
					cActivityModel.setData(getMDLData);
					this.getView().setModel(cActivityModel, "createActivityModel");
					this.updataActivityByID(cActivityModel, getActivityCode).done(function() {
						that.showLoading(false);
						that.fetchMessageOk("Update Activity", "Success", "Updated Successfully", "SearchActivity");
						that.onPressClearData();
						that.createActivityJSONModel();
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
				} else {
					this.createActivity(getModle).done(function() {
						that.showLoading(false);
						that.fetchMessageOk("Create Activity", "Success", "Created Successfully", "SearchActivity");
						that.onPressClearData();
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
				}

			}
		},
		/*	selectedActivity: function(evt) {
			var getEle = this.getVariablesAddress();
			var getSelCode = evt.getParameter("selectedItem").getKey();
			if (getSelCode === "cn_Meeting") {
				getEle.addTAddress.setText("Address");
				getEle.addLStreet.setVisible(true);
				getEle.addLCity.setVisible(true);
				getEle.addLRoom.setVisible(true);
				getEle.addLState.setVisible(true);
				getEle.addLCountry.setVisible(true);
				getEle.addLMeetingLocation.setVisible(true);
				getEle.addIStreet.setVisible(true);
				getEle.addICity.setVisible(true);
				getEle.addIRoom.setVisible(true);
				getEle.addIState.setVisible(true);
				getEle.addICountry.setVisible(true);
				getEle.addIMeetingLocation.setVisible(true);
			} else {
				this.clearVariablesAddress();
			}
		},*/
		/*	clearVariablesAddress: function() {
			var getEle = this.getVariablesAddress();
			var getVarItems = this.getVariables();
			getEle.addTAddress.setText("");
			getVarItems.getSubject.setValue("");
			getEle.addLStreet.setVisible(false);
			getEle.addLCity.setVisible(false);
			getEle.addLRoom.setVisible(false);
			getEle.addLState.setVisible(false);
			getEle.addLCountry.setVisible(false);
			getEle.addLMeetingLocation.setVisible(false);
			getEle.addIStreet.setVisible(false);
			getEle.addICity.setVisible(false);
			getEle.addIRoom.setVisible(false);
			getEle.addIState.setVisible(false);
			getEle.addICountry.setVisible(false);
			getEle.addIMeetingLocation.setVisible(false);
		},*/
		clearModels: function() {
			var setNewModle = new JSONModel();
			this.getView().setModel(setNewModle, "createActivityModel");
		},
		getVariables: function() {
			var items = {
				getPage: this.getView().byId("CreateActivityPage"),
				caFirstActivity: this.getView().byId("caSlectActivity"),
				caStartDateAndTime: this.getView().byId("caStartDateAndTime"),
				caType: this.getView().byId("caType"),
				caHandledBy: this.getView().byId("caHandledBy"),
				getSubject: this.getView().byId("caSubject"),
				caStartTime: this.getView().byId("caStartTime"),
				caEndTime: this.getView().byId("caEndTime"),
				caContent: this.getView().byId("caContent"),
				caSave: this.getView().byId("btnSave"),
				addFollowUp: this.getView().byId("btnFollowUp")
			};
			return items;
		},
		getVariablesAddress: function() {
			var items = {
				addLStreet: this.getView().byId("caLStreet"),
				addLCity: this.getView().byId("caLCity"),
				addLRoom: this.getView().byId("caLRoom"),
				addLState: this.getView().byId("caLState"),
				addLCountry: this.getView().byId("caLCountry"),
				addLMeetingLocation: this.getView().byId("caLLocation")
			/*	addIStreet: this.getView().byId("caIStreet"),
				addICity: this.getView().byId("caICity"),
				addIRoom: this.getView().byId("caIRoom"),
				addIState: this.getView().byId("caIState"),
				addICountry: this.getView().byId("caICountry"),
				addIMeetingLocation: this.getView().byId("caILocation"),
				addTAddress: this.getView().byId("caTAddress")*/

			};
			return items;
		},
		//Here function for Clear Data
		onPressClearData: function() {
			var clearData = this.getVariables();
			var clearAddData = this.getVariablesAddress();
			clearData.getSubject.setValue("");
			clearData.caContent.setValue("");
			clearData.caHandledBy.setValue("Select Handled By");
			clearData.caFirstActivity.setValue("Select The Activity");
			clearData.caType.setValue("Select Type");
			clearAddData.addIStreet.setValue("");
			clearAddData.addICity.setValue("");
			clearAddData.addIRoom.setValue("");
			clearAddData.addIState.setValue("");
			clearAddData.addICountry.setValue("");
			clearAddData.addIMeetingLocation.setValue("");
			//clearAddData.addICountry.addTAddress("");
		},
		fetchTypes: function() {
			var that = this;
			var getEle = this.getVariables();
			var filter = "";
			var sItem = new sap.ui.core.Item({
				text: "Select Type",
				key: -2
			});
			getEle.caType.setBusy(true);
			this.fetchActivityTypes(filter).done(function(obj) {
				that.getView().setModel(obj, "ActivityTypesLists");
				getEle.caType.insertItem(sItem, 0);
				getEle.caType.setSelectedItem(sItem);
				that.getView().byId("caType").setValueState("None");
				getEle.caType.setBusy(false);
			}).fail(function(err) {
				getEle.caType.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},

		fetchNationality: function() {
			var that = this;
			var filter = "$orderby=Code%20desc";
			var createMembershipSAL = new CreateMembershipSAL();
			createMembershipSAL.fetchCountriesName(that, filter).done(function(obj) {
				that.showLoading(false);
				obj.setSizeLimit(300);
				that.getView().setModel(obj, "countryList");
				that.getView().getModel("countryList").setSizeLimit(obj);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchMeetingLocations: function() {
			var that = this;
			var filter = "$orderby=Code%20desc";
			this.fetchActivityLocations(filter).done(function(obj) {
				that.showLoading(false);
				that.getView().setModel(obj, "LocationList");
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchActivities: function() {
			let that = this;
			var ele = that.getView().byId("caActivities");
			ele.setBusy(true);
			/*	var acFilter = encodeURI("$filter=CardCode eq '" + this._ActivityID + "'||$expand=ActivityType,EmployeeInfo,BusinessPartner" +
				"||$inlinecount=allpages");*/
			var acFilter =
				"$select=CardCode,ActivityDate,StartDate,EndDueDate,Phone,Activity,Street,State,Room,Country,Location,StartTime,EndTime,City,PreviousActivity,ActivityType,Details,Notes,ActivityCode,HandledByEmployee";
			this.fetchActivityId(this._ActivityID, acFilter).done(function(response) {
				var getDataMDL = response.getData();
				that.getView().setModel(response, "createActivityModel");
				that._AccountID = getDataMDL.CardCode;
				ele.setBusy(false);
				that.fetchLeadsDetails();
				that.showLoading(false);
				that.upDateStatus();
			}).fail(function(err) {
				ele.setBusy(false);
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchLeadsDetails: function() {
			var that = this;
			var createAssessmentsSAL = new CreateAssessmentsSAL();
			createAssessmentsSAL.fetchBusinessPartnersById(that, that._AccountID).done(function(obj) {
				that.getView().setModel(obj, "LeadsDetails");
				that.onUpdateEmgButton(obj);
				that.getView().setBusy(false);
				that.fetchAccountActivities();
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		upDateStatus: function(getStatus) {
			/*	var getMODl = this.getView().getModel("LeadsDetails");
			var getMODLData = getMODl.getData();
			var emgShowPanelLabel = this.getView().byId("emgPanelHeader");
			var emergencyText = this.getView().byId("emergencyContailLabel");
			emgShowPanelLabel.setVisible(true);
			emergencyText.setVisible(true);*/
			/*	if (getMODLData.ContactEmployees[0].MobilePhone == "") {
				emgShowPanelLabel.setVisible(false);
				emergencyText.setVisible(false);
			} else {
				emgShowPanelLabel.setVisible(true);
				emergencyText.setVisible(true);
			}*/
			var getEle = this.getVariables();
			if (getStatus === "Create") {
				getEle.getPage.setTitle("Create Activity");
				getEle.caFirstActivity.setValue("Select The Activity");
				getEle.caSave.setText("Save");
				getEle.addFollowUp.setVisible(false);
			} else {
				getEle.getPage.setTitle("Edit Activity");
				getEle.caSave.setText("Update");
				getEle.addFollowUp.setVisible(true);
			}
		},
		//Here function for Emg show hide Label
		onUpdateEmgButton: function(getResponse) {
			var emgPanel = this.getView().byId("emgPanelHeader");
			var getEmgLabel = this.getView().byId("emergencyContailLabel");
			if (getResponse.oData.ContactEmployees == "") {
				emgPanel.setVisible(false);
				getEmgLabel.setVisible(false);
			} else {
				emgPanel.setVisible(true);
				getEmgLabel.setVisible(true);
			}
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},
		createActivityJSONModel: function() {
			/*	var activityMD = new JSONModel();
			activityMD.setProperty('/CardCode', "");
			activityMD.setProperty('/ActivityDate', "");
			activityMD.setProperty('/StartDate', "");
			activityMD.setProperty('/Phone', "");
			activityMD.setProperty('/Activity', "");
			activityMD.setProperty('/StartTime', "");
			activityMD.setProperty('/EndTime', "");
			activityMD.setProperty('/City', "");
			activityMD.setProperty('/PreviousActivity', "");
			activityMD.setProperty('/ActivityType', "");
			activityMD.setProperty('/Details', "");
			activityMD.setProperty('/Notes', "");
			activityMD.setProperty('/ActivityCode', "");
			activityMD.setProperty('/HandledByEmployee', "");
			activityMD.setData(activityMD);
			this.getView().setModel(activityMD, "createActivityModel");*/

		},
		onPressFollowUpCreateActivity: function(evt) {
			var that = this;
			var getEle = this.getVariables();
			if (getEle.caFirstActivity.getValue() === "Select The Activity" || getEle.caFirstActivity.getValue() === "") {
				getEle.caFirstActivity.setValueState("Error");
			} else if (getEle.caStartDateAndTime.getValue() === "") {
				getEle.caFirstActivity.setValueState("None");
				getEle.caStartDateAndTime.setValueState("Error");
			} else if (getEle.caType.getValue() === "Select Type" || getEle.caType.getValue() === "") {
				getEle.caStartDateAndTime.setValueState("None");
				getEle.caType.setValueState("Error");
			} else if (getEle.caHandledBy.getValue() === "Select Handled By" || getEle.caHandledBy.getValue() === "") {
				getEle.caType.setValueState("None");
				getEle.caStartDateAndTime.setValueState("None");
				getEle.caHandledBy.setValueState("Error");
			} else if (getEle.caStartTime.getValue() === "") {
				getEle.caHandledBy.setValueState("None");
				getEle.caStartTime.setValueState("Error");
			} else if (getEle.caEndTime.getValue() === "") {
				getEle.caStartTime.setValueState("None");
				getEle.caEndTime.setValueState("Error");
			} else {
				getEle.caStartTime.setValueState("None");
				getEle.caEndTime.setValueState("None");
				var getModle = this.getView().getModel("createActivityModel");
				if (getModle !== null && getModle !== undefined) {
					var getMDLData = getModle.getData();
					var getDateAndTime = getEle.caStartDateAndTime.getDateValue();
					var getSecondDateValue = getEle.caStartDateAndTime.getSecondDateValue();
					var getStartDate = this.toDateFormat(getDateAndTime);
					var getEndDate = this.toDateFormat(getSecondDateValue);
					var getStarTime = this.toTimeFormat(getDateAndTime);
					getModle.setProperty("/StartDate", getStartDate);
					getModle.setProperty("/EndDueDate", getEndDate);
					getModle.setProperty("/StartTime", getStarTime);
					getModle.setProperty("/ActivityDate", getStartDate);
					getModle.setProperty("/ActivityTime", getStarTime);
					getModle.setProperty("/SeriesStartDate", getStartDate);

					/*	if (getEle.caFirstActivity.getSelectedKey() === "cn_Meeting") {
						that.showLoading(true);
						var getElement = this.getVariablesAddress();
						var getStreet = getElement.addIStreet.getValue();
						var getCity = getElement.addICity.getValue();
						var getRoom = getElement.addIRoom.getValue();
						var getState = getElement.addIState.getValue();
						var getCountry = getElement.addICountry.getValue();
						var getLocation = getElement.addIMeetingLocation.getValue();

						getModle.setProperty("/Street", getStreet);
						getModle.setProperty("/City", getCity);
						getModle.setProperty("/Room", getRoom);
						getModle.setProperty("/State", getState);
						getModle.setProperty("/Country", getCountry);
						getModle.setProperty("/Location", getLocation);*/
					// 		getModle.setProperty("/CardCode", this._AccountID);
					//	}

					getModle.setProperty("/CardCode", this._AccountID);
					getMDLData.PreviousActivity = getMDLData.ActivityCode;

					this.createActivity(getModle).done(function() {
						that.showLoading(false);
						that.fetchMessageOk("Follow Up", "Success", "Created Successfully", "SearchActivity");
						that.onPressClearData();
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchErrorMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
				}

			} //}
		},
		fetchAccountActivities: function() {
			let that = this;
			var ele = that.getView().byId("caActivities");
			ele.setBusy(true);
			var viewleadSAL = new ViewLeadSAL();
			var acFilter = encodeURI("$filter=CardCode eq '" + this._AccountID + "'||$expand=ActivityType,EmployeeInfo,BusinessPartner" +
				"||$inlinecount=allpages");
			viewleadSAL.fetchActivities(this._AccountID, acFilter).done(function(response) {
				var mActivities = new JSONModel();
				mActivities.setData(response);
				that.getView().setModel(mActivities, "mActivities");
				ele.setBusy(false);
			}).fail(function(err) {
				ele.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "LeadsDetail");
			});
		},
		onBack: function() {
			var getPagesID = this._getPageID;
			switch (getPagesID) {
				case "50":
					this.getOwnerComponent().getRouter()
						.navTo("EditLead", {
							LeadID: this._AccountID,
							PageID: 61
						});
					break;
				case "61":
					this.getOwnerComponent().getRouter()
						.navTo("ViewLead", {
							LeadID: this._AccountID,
							PageID: 49
						});
					break;
				case "49":
					this.getOwnerComponent().getRouter().navTo("Leads");
					break;
				case "62":
					this.getOwnerComponent().getRouter().navTo("ViewAccount", {
						AccountId: this._AccountID,
						PageID: 27
					});
					break;
				case "27":
					this.getOwnerComponent().getRouter().navTo("SearchMembership");
					break;

				case "55":
					this.getOwnerComponent().getRouter().navTo("ViewLead", {
						AccountId: this._AccountID,
						PageID: 49
					});
					break;

				default:
					/*	this.getOwnerComponent().getRouter().navTo("ViewLead", {
						LeadID: this._AccountID,
						PageID: 49
					});*/
					this.getOwnerComponent().getRouter().navTo("SearchActivity");
					break;
			}
		}

	});

});