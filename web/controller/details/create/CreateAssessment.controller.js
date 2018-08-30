sap.ui.define([
    'sap/m/MessageBox',
	"com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL",
	"com/ss/app/StryxSports/controller/sal/TeamsSAL",
	"com/ss/app/StryxSports/controller/sal/LocationsSAL",
	"com/ss/app/StryxSports/controller/sal/CoachsSAL",
	'sap/ui/model/json/JSONModel'
], function(MessageBox, CreateAssessmentsSAL, TeamsSAL, LocationsSAL, CoachsSAL, JSONModel) {
	"use strict";
	var aCoachTeams = [];
	// var aLead, aCoach, aLocation, aTeam;
	return CreateAssessmentsSAL.extend("com.ss.app.StryxSports.controller.details.create.CreateAssessment", {
		onInit: function() {
			this._getPageID = "";
			var oRouter = this.getRouter();
			oRouter.getRoute("CreateAssessmentsDetail").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		_onRouteMatched: function(oEvent) {
			this._getPageID = oEvent.getParameter("arguments").PageID;
			var that = this;
			var headerLoading = that.getView().byId("createAssessmentObjectPageLayout");
			var emgShowLabel = this.getView().byId("creatEmergencyContailLabel");
			headerLoading.setBusy(true);
			var getLeadID = oEvent.getParameter("arguments").LeadID;
			that.getView().setBusy(true);
			this.setSelBusy("Coachs", true);
			that.clearModel();
			var setCreateModel = new JSONModel();
			this.fetchBusinessPartnersById(setCreateModel, getLeadID).done(function(obj) {
				that.getView().setModel(obj, "CreateAssessmentModel");
				var getSelectedLeads = that.getView().getModel("CreateAssessmentModel");
				var getLeadName = getSelectedLeads.getProperty("/CardName");
				var assessmentModel = new JSONModel();
				// that.updateStatusEmgLabel(obj);
				assessmentModel.setProperty('/Code', 0);
				assessmentModel.setProperty('/U_LeadCode', getLeadID);
				assessmentModel.setProperty('/Name', getLeadName);
				that.getView().setModel(assessmentModel, "CreateAssessments");
				that.setSelBusy("Coachs", false);
				that.getView().setBusy(false);
				headerLoading.setBusy(false);
				emgShowLabel.setVisible(true);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "SearchLeads");
			});
			var getPlanningCalender = this.getView().byId("PC1");
			getPlanningCalender.setVisible(false);
			that.getView().setBusy(true);

		},
		handleDatePickerChange: function(oEvent) {
			var oDP = oEvent.oSource;
			var bValid = oEvent.getParameter("valid");
			if (bValid) {
				oDP.setValueState(sap.ui.core.ValueState.None);
			} else {
				oDP.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		handleTimePickerChange: function(oEvent) {
			var oTP = oEvent.oSource;
			var bValid = oEvent.getParameter("valid");

			if (bValid) {
				oTP.setValueState(sap.ui.core.ValueState.None);
			} else {
				oTP.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		handleSaveCreateAssementPress: function() {
			var that = this;
			var getEle = this.getVariables();
			if (getEle.createAssessmentLead.getValue() === "") {
				getEle.createAssessmentLead.setValueState("Error");
			} else if (getEle.createAssessmentLocation.getSelectedKey() === "-1" || getEle.createAssessmentLocation.getValue() === "") {
				getEle.createAssessmentLead.setValueState("None");
				getEle.createAssessmentLocation.setValueState("Error");
			} else if (getEle.createAssessmentTeam.getSelectedKey() === "-1" || getEle.createAssessmentTeam.getValue() === "") {
				getEle.createAssessmentLocation.setValueState("None");
				getEle.createAssessmentTeam.setValueState("Error");
			} else if (getEle.createAssessmentCoach.getSelectedKey() === "-1" || getEle.createAssessmentCoach.getValue() === "") {
				getEle.createAssessmentTeam.setValueState("None");
				getEle.createAssessmentCoach.setValueState("Error");
			} else if (getEle.createAssessmentDate.getValue() === "") {
				getEle.createAssessmentCoach.setValueState("None");
				getEle.createAssessmentDate.setValueState("Error");
			} else if (getEle.cAStartTime.getValue() === "") {
				getEle.createAssessmentDate.setValueState("None");
				getEle.cAStartTime.setValueState("Error");
			} else if (getEle.cAEndTime.getValue() === "") {
				getEle.cAStartTime.setValueState("None");
				getEle.cAEndTime.setValueState("Error");
			} else {
				getEle.createAssessmentLead.setValueState("None");
				getEle.createAssessmentLocation.setValueState("None");
				getEle.createAssessmentTeam.setValueState("None");
				getEle.createAssessmentCoach.setValueState("None");
				getEle.createAssessmentDate.setValueState("None");
				getEle.cAStartTime.setValueState("None");
				getEle.cAEndTime.setValueState("None");
				var createAssessmentsModel = this.getView().getModel("CreateAssessments");
				var getFromDate = getEle.createAssessmentDate.getFrom();
				var getToDate = getEle.createAssessmentDate.getTo();
				var cStartDate = this.toDateFormat(getFromDate);
				var cEndDate = this.toDateFormat(getToDate);

				// convert logic 12hours format to 24 hours for Start Time
				var startTime = getEle.cAStartTime.getValue();
				var shours = Number(startTime.match(/^(\d+)/)[1]);
				var sminutes = Number(startTime.match(/:(\d+)/)[1]);
				var AMPM = startTime.match(/\s(.*)$/)[1];
				if (AMPM == "PM" && shours < 12) shours = shours + 12;
				if (AMPM == "AM" && shours == 12) shours = shours - 12;
				var sHours = shours.toString();
				var sMinutes = sminutes.toString();
				if (shours < 10) sHours = "0" + sHours;
				if (sminutes < 10) sMinutes = "0" + sMinutes;
				var newSSTime = sHours + ":" + sMinutes;

				// convert logic 12hours format to 24 hours for End Time
				var endTime = getEle.cAEndTime.getValue();
				var ehours = Number(endTime.match(/^(\d+)/)[1]);
				var eminutes = Number(endTime.match(/:(\d+)/)[1]);
				var eAMPM = endTime.match(/\s(.*)$/)[1];
				if (eAMPM == "PM" && ehours < 12) ehours = ehours + 12;
				if (eAMPM == "AM" && ehours == 12) ehours = ehours - 12;
				var eHours = ehours.toString();
				var eMinutes = eminutes.toString();
				if (ehours < 10) eHours = "0" + eHours;
				if (eminutes < 10) eMinutes = "0" + eMinutes;
				var newSETime = eHours + ":" + eMinutes;

				try {
					createAssessmentsModel.setProperty("/U_ScheduleSTime", newSSTime);
					createAssessmentsModel.setProperty("/U_ScheduleETime", newSETime);
					createAssessmentsModel.setProperty("/U_ScheduleSDate", cStartDate);
					createAssessmentsModel.setProperty("/U_ScheduleEDate", cEndDate);
				} catch (e) {
					console.log(e.toString());

				}
				that.showLoading(true);
				that.createAssessment(createAssessmentsModel).done(function() {
					that.fetchMessageOk("Create Assessment", "Success", "Created successfully.", "SearchLeads");
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "SearchLeads");
				});
			}

		},
		getVariables: function() {
			var setCAssessmentObj = {
				createAssessmentLead: this.getView().byId("createAssessmentLead"),
				createAssessmentLocation: this.getView().byId("createAssessmentLocation"),
				createAssessmentCoach: this.getView().byId("createAssessmentCoach"),
				createAssessmentTeam: this.getView().byId("createAssessmentTeam"),
				createAssessmentDate: this.getView().byId("createAssessmentDate"),
				cAStartTime: this.getView().byId("cAStartTime"),
				cAEndTime: this.getView().byId("cAEndTime")
			};
			return setCAssessmentObj;
		},
		handleCancelCreateAssementPress: function() {
			this.onDialogState("Note", "Warning", "Your Changes Will Be Lost.", "SearchLeads");
		},
		selectedTeam: function() {
			var getEle = this.getVariables();
			var getTeamCode = getEle.createAssessmentTeam;
			if (getTeamCode.getSelectedKey() !== "-1" && getTeamCode.getValue() !== "") {
				this.setSelBusy("Coachs", true);
				var getSleKey = getTeamCode.getSelectedKey();
				this.fetchCoachs(getSleKey);
			} else {
				getEle.createAssessmentCoach.setEnabled(false);
			}
		},
		onBack: function() {
			var getPagesID = this._getPageID;
			switch (getPagesID) {
				case "49":
					this.getOwnerComponent().getRouter().navTo("Leads");
					break;
				case "27":
					this.getOwnerComponent().getRouter().navTo("SearchMembership");
					break;
				default:
					this.getRouter().navTo("SearchLeads");
					break;
			}
		},

		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},
		setSelBusy: function(getName, getValue) {
			var getVariables = this.getVariables();
			var oItem = new sap.ui.core.Item({
				text: "Select " + getName,
				key: -1
			});
			switch (getName) {
				case "Team":
					getVariables.createAssessmentTeam.insertItem(oItem, 0);
					getVariables.createAssessmentTeam.setSelectedItem(oItem);
					getVariables.createAssessmentTeam.setBusy(getValue);
					break;
				case "Location":
					getVariables.createAssessmentLocation.setBusy(getValue);
					getVariables.createAssessmentLocation.insertItem(oItem, 0);
					getVariables.createAssessmentLocation.setSelectedItem(oItem);
					getVariables.createAssessmentLocation.setBusy(getValue);
					break;
				case "Coachs":
					getVariables.createAssessmentCoach.insertItem(oItem, 0);
					getVariables.createAssessmentCoach.setSelectedItem(oItem);
					getVariables.createAssessmentCoach.setBusy(getValue);
					break;
				default:
			}
		},
		fetchTeams: function(getID) {
			var getEle = this.getVariables();
			var that = this;
			var teamsSAL = new TeamsSAL();
			var tFilterTeams = encodeURI("$filter=U_Location eq '" + getID + "'");
			teamsSAL.fetchTeams(that, tFilterTeams).done(function(obj) {
				that.getView().setModel(obj, "TeamsList");
				that.setSelBusy("Team", false);
				getEle.createAssessmentTeam.setEnabled(true);
				that.getView().setBusy(false);
			}).fail(function(err) {
				that.getView().setBusy(true);
				that.setSelBusy("Team", false);

				that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "SearchLeads");
			});
		},
		fetchCoachs: function(getID) {
			var that = this;
			var teamsSAL = new TeamsSAL();
			var jMdl = new JSONModel();
			var getVariables = this.getVariables();
			teamsSAL.fetchTeamsById(jMdl, getID).done(function(obj) {
				that.setSelBusy("Coachs", true);
				that.getView().setModel(obj, "CoachsList");
				that.setSelBusy("Coachs", false);
				getVariables.createAssessmentCoach.setEnabled(true);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "SearchLeads");
			});

		},
		fetchLocation: function() {
			var that = this;
			var locationsSAL = new LocationsSAL();
			var lFilter = "$filter=U_Status%20eq%20'1'";
			locationsSAL.fetchLocationsMasters(that, lFilter).done(function(getResponse) {
				that.getView().setModel(getResponse, "LocationsList");
				that.setSelBusy("Location", false);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "SearchLeads");
			});
			that.setSelBusy("Team", false);
			this.setSelBusy("Coachs", false);
		},
		// Planning Calender
		getCoachSchedule: function(evt) {
			var that = this;
			var getEle = this.getVariables();
			var getStartEndDate = that.getView().byId("createAssessmentDate").getValue();
			var getPlanningCalender = that.getView().byId("PC1");
			if (getEle.createAssessmentCoach.getSelectedKey() !== "-1" && getEle.createAssessmentCoach.getValue() !== "") {
				var getCoachName = evt.getParameter("selectedItem").getText();
				that.showLoading(true);
				var obj = evt.getParameter("selectedItem");
				var md = obj.getModel("CoachsList");
				var pth = obj.getBindingContext("CoachsList").getPath();
				var emp = md.getProperty(pth);
				var empID = emp.EmployeeID;
				var caSal = new CreateAssessmentsSAL();
				var cTFilter = "$filter=U_CoachCode%20eq%20'" + empID + "'";
				// GET TEAMS OF SELECTED COACH
				caSal.fetchCoachTeams(cTFilter).done(function(result) {
					that.getView().setModel(result, "mCoachTeams");
					aCoachTeams = result.oData.value;
					var csFilter = "$filter=";
					for (var i = 0; i < aCoachTeams.length; i++) {
						csFilter += "U_TeamCoachCode%20eq%20'" + aCoachTeams[i].Code + "'";
						if (i !== aCoachTeams.length - 1) {
							csFilter += "%20or%20";
						}
					}
					caSal.fetchCoachSchedule(csFilter).done(function(resp) {
						if (resp.oData.value.length > 0) {
						    that.showLoading(true);
							getPlanningCalender.setVisible(true);
							var mcSchedule = new JSONModel();
							mcSchedule.setProperty('/U_Coaches', []);
							var obj = mcSchedule.getData();
							var dd = obj.U_Coaches;
							var temp = new Object();
							temp.U_CoachName = getCoachName;
							temp.U_Schedules = resp.oData.value;
							dd.push(temp);
							that.getView().setModel(mcSchedule, "mcSchedule");
							// LOGIC TO SET PLANNING CALENDER START DATE
							var defaultSDate = resp.oData.value[0].U_ScheduleSDate;
							var defaultSTime = resp.oData.value[0].U_ScheduleSTime;
							var calenderSDate = that.planningCalenderDate(defaultSDate, defaultSTime);
							var mCalenderSdate = new JSONModel();
							mCalenderSdate.setProperty('/U_calenderSDate', calenderSDate);
							that.getView().setModel(mCalenderSdate, "mCalenderSdate");
							that.showLoading(false);
						} else {
							that.showLoading(true);
							getPlanningCalender.setVisible(true);
							getPlanningCalender.setNoDataText("No Schedules, Coach Available.");
						}
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "DashBoard");
					});
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "DashBoard");
				});

			} else {
				getPlanningCalender.setVisible(false);
			}
		},
		handleAppointmentSelect: function(oEvent) {
			var oAppointment = oEvent.getParameter("appointment"),
				sSelected;
			if (oAppointment) {
				sSelected = oAppointment.getSelected() ? "selected" : "deselected";
				MessageBox.information("Assessment Schedule For " + "'" + oAppointment.getTitle() + "' " + sSelected + " .");
			} else {
				var aAppointments = oEvent.getParameter("appointments");
				var sValue = "Selected Coach Has " + aAppointments.length + " Assessments.";
				MessageBox.information(sValue);
			}
		},
		clearModel: function() {
			var getEle = this.getVariables();
			getEle.createAssessmentLead.setValueState("None");
			getEle.createAssessmentLocation.setValueState("None");
			getEle.createAssessmentTeam.setValueState("None");
			getEle.createAssessmentCoach.setValueState("None");
			getEle.createAssessmentDate.setValueState("None");
			getEle.cAStartTime.setValueState("None");
			getEle.cAEndTime.setValueState("None");
			getEle.createAssessmentTeam.setSelectedKey("-1");
			getEle.createAssessmentCoach.setSelectedKey("-1");
			getEle.createAssessmentTeam.setEnabled(false);
			getEle.createAssessmentCoach.setEnabled(false);

			var newJMDL = new JSONModel();
			this.getView().setModel(newJMDL, "CoachsList");
			this.getView().setModel(newJMDL, "TeamsList");
			this.setSelBusy("Team", true);
			this.setSelBusy("Coachs", true);
			this.fetchLocation();
			this.getView().byId("createAssessmentDate").setValue("");
		},
		selectedLocation: function() {
			var getEle = this.getVariables();
			var getLocationCode = getEle.createAssessmentLocation;
			if (getLocationCode.getSelectedKey() !== "-1" && getLocationCode.getValue() !== "") {
				this.setSelBusy("Team", true);
				var getSelLocationKey = getLocationCode.getSelectedKey();
				this.fetchTeams(getSelLocationKey);
			} else {
				getEle.createAssessmentTeam.setEnabled(false);
			}
		}
	});
});