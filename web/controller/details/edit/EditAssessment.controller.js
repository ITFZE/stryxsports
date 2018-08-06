sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL",
	"com/ss/app/StryxSports/controller/sal/TeamsSAL",
	"com/ss/app/StryxSports/controller/sal/LocationsSAL",
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageBox'
], function(CreateAssessmentsSAL, TeamsSAL, LocationsSAL, JSONModel, MessageBox) {
	"use strict";
	// var aLead, aCoach, aLocation, aTeam;
	return CreateAssessmentsSAL.extend("com.ss.app.StryxSports.controller.details.edit.EditAssessment", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("CreateAssessmentsDetail").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			// create model
/*			var oModel = new JSONModel();
			oModel.setData({
				startDate: new Date("2017", "0", "15", "8", "0"),
				people: [
					{
						pic: "sap-icon://employee",
						name: "Max Mustermann",
						role: "team member",
						appointments: [
							{
								start: new Date("2017", "0", "15", "08", "30"),
								end: new Date("2017", "0", "15", "09", "30"),
								title: "Meet John Miller",
								type: "Type02",
								tentative: false
								},
							{
								start: new Date("2017", "0", "15", "10", "0"),
								end: new Date("2017", "0", "15", "12", "0"),
								title: "Team meeting",
								info: "room 1",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false
								},
							{
								start: new Date("2017", "0", "15", "13", "00"),
								end: new Date("2017", "0", "15", "16", "00"),
								title: "Discussion with clients",
								info: "online",
								type: "Type02",
								tentative: false
								},
							{
								start: new Date("2017", "0", "16", "0", "0"),
								end: new Date("2017", "0", "16", "23", "59"),
								title: "Vacation",
								info: "out of office",
								type: "Type04",
								tentative: false
								},
							{
								start: new Date("2017", "0", "17", "1", "0"),
								end: new Date("2017", "0", "18", "22", "0"),
								title: "Workshop",
								info: "regular",
								type: "Type07",
								pic: "sap-icon://sap-ui5",
								tentative: false
								},
							{
								start: new Date("2017", "0", "19", "08", "30"),
								end: new Date("2017", "0", "19", "18", "30"),
								title: "Meet John Doe",
								type: "Type02",
								tentative: false
								},
							{
								start: new Date("2017", "0", "19", "10", "0"),
								end: new Date("2017", "0", "19", "16", "0"),
								title: "Team meeting",
								info: "room 1",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false
								},
							{
								start: new Date("2017", "0", "19", "07", "00"),
								end: new Date("2017", "0", "19", "17", "30"),
								title: "Discussion with clients",
								type: "Type02",
								tentative: false
								},
							{
								start: new Date("2017", "0", "20", "0", "0"),
								end: new Date("2017", "0", "20", "23", "59"),
								title: "Vacation",
								info: "out of office",
								type: "Type04",
								tentative: false
								},
							{
								start: new Date("2017", "0", "22", "07", "00"),
								end: new Date("2017", "0", "27", "17", "30"),
								title: "Discussion with clients",
								info: "out of office",
								type: "Type02",
								tentative: false
								},
							{
								start: new Date("2017", "2", "13", "9", "0"),
								end: new Date("2017", "2", "17", "10", "0"),
								title: "Payment week",
								type: "Type06"
								},
							{
								start: new Date("2017", "03", "10", "0", "0"),
								end: new Date("2017", "05", "16", "23", "59"),
								title: "Vacation",
								info: "out of office",
								type: "Type04",
								tentative: false
								},
							{
								start: new Date("2017", "07", "1", "0", "0"),
								end: new Date("2017", "09", "31", "23", "59"),
								title: "New quarter",
								type: "Type10",
								tentative: false
								}
							],
						headers: [
							{
								start: new Date("2017", "0", "16", "0", "0"),
								end: new Date("2017", "0", "16", "23", "59"),
								title: "Private",
								type: "Type05"
								}
							]
						}
				]
			});
			this.getView().setModel(oModel);*/
		},
		_onRouteMatched: function() {
			var that = this;
			var getSelectedLeads = sap.ui.getCore().getModel("SelectedLeads");
			var getLeadCode = getSelectedLeads.getProperty("/CardCode");
			var getLeadName = getSelectedLeads.getProperty("/CardName");
			var assessmentModel = new JSONModel();
			assessmentModel.setProperty('/Code', 0);
			assessmentModel.setProperty('/U_LeadCode', getLeadCode);
			assessmentModel.setProperty('/Name', getLeadName);
			this.getView().setModel(assessmentModel, "CreateAssessments");
			that.getView().setBusy(true);
			that.setSelBusy("Team", true);
			$.when(that.fetchTeams()).then(function() {});
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
			var getcreateAssessmentLead = this.getVariables();
			if (getcreateAssessmentLead.createAssessmentLead.getValue() === "") {
				getcreateAssessmentLead.createAssessmentLead.setValueState("Error");
				var leadMessage = this.oBundle("PleaseEnterTheLead");
				this.MessageToastShow(leadMessage);
			} else if (getcreateAssessmentLead.createAssessmentDate.getValue() === "") {
				getcreateAssessmentLead.createAssessmentLead.setValueState("None");
				getcreateAssessmentLead.createAssessmentDate.setValueState("Error");

			} else if (getcreateAssessmentLead.cAStartTime.getValue() === "") {
				getcreateAssessmentLead.cAStartTime.setValueState("Error");
				var starttimeMessage = this.oBundle("PleaseEnterTheStartTime");
				this.MessageToastShow(starttimeMessage);
			} else if (getcreateAssessmentLead.cAEndTime.getValue() === "") {
				getcreateAssessmentLead.cAStartTime.setValueState("None");
				getcreateAssessmentLead.cAEndTime.setValueState("Error");
				var endtimeMessage = this.oBundle("PleaseEnterTheEndTime");
				this.MessageToastShow(endtimeMessage);
			} else {
				var getModel = this.getView().getModel("CreateAssessments");
				
				
				// that.showLoading(true);
				// that.createAssessment(getModel).done(function() {
				// 	that.fetchMessageOk("Create Sports", "Success", "Created successfully.", "SearchLeads");
				// }).fail(function(err) {
				// 	that.showLoading(false);
				// 	that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "SearchLeads");
				// });
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
		selectedTeam: function(oEvent) {
			var getLocationCode = oEvent.getParameter("selectedItem").getKey();
			if (getLocationCode !== "-1") {
				this.setSelBusy("Location", true);
				this.setSelBusy("Coachs", true);
				this.fetchCoachs(getLocationCode);
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
					break;
				case "Coachs":
					getVariables.createAssessmentCoach.insertItem(oItem, 0);
					getVariables.createAssessmentCoach.setSelectedItem(oItem);
					getVariables.createAssessmentCoach.setBusy(getValue);
					break;
				default:
			}
		},
		fetchTeams: function() {
			var that = this;
			var teamsSAL = new TeamsSAL();
			var tFilterTeams = "$filter=U_Status%20eq%20%271%27%20";
			teamsSAL.fetchTeams(that, tFilterTeams).done(function(obj) {
				that.getView().setModel(obj, "TeamsList");
				that.setSelBusy("Team", false);

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

			teamsSAL.fetchTeamsById(jMdl, getID).done(function(obj) {
				var getLocationID = obj.oData.U_Location;
				that.setSelBusy("Coachs", true);
				$.when(that.fetchLocation(getLocationID)).then(function() {
					that.getView().setModel(obj, "CoachsList");
					that.setSelBusy("Coachs", false);
				});
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "SearchLeads");
			});

		},
		fetchLocation: function(getID) {
			var that = this;
			var locationsSAL = new LocationsSAL();
			var locationModel = new JSONModel();
			locationsSAL.fetchLocationDetail(locationModel, getID).done(function(getResponse) {
				that.getView().setModel(getResponse, "LocationsList");
				that.setSelBusy("Location", false);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "SearchLeads");
			});
		},

		// Planning Calender
		getCoachSchedule: function(evt){
		    var that = this;
		    var getTeamCoachCode = evt.getParameter("selectedItem").getKey();
		    var caFilter = "$filter=U_TeamCoachCode%20eq%20" + "'" + getTeamCoachCode + "'";
		    var caSal = new CreateAssessmentsSAL();
		    var gcmodel = new JSONModel();
		    caSal.fetchCoachSchedule(gcmodel, caFilter).done(function(response) {
				that.getView().setModel(response, "mSchedules");
				// this.setSelBusy("Coachs", false);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "SearchLeads");
			});
		},
		
		handleAppointmentSelect: function(oEvent) {
			var oAppointment = oEvent.getParameter("appointment"),
				sSelected;
			if (oAppointment) {
				sSelected = oAppointment.getSelected() ? "selected" : "deselected";
				MessageBox.show("'" + oAppointment.getTitle() + "' " + sSelected + ". \n Selected appointments: " + this.getView().byId("PC1").getSelectedAppointments()
					.length);
			} else {
				var aAppointments = oEvent.getParameter("appointments");
				var sValue = aAppointments.length + " Appointments selected";
				MessageBox.show(sValue);
			}
		},
		handleSelectionFinish: function(oEvent) {
			var aSelectedKeys = oEvent.getSource().getSelectedKeys();
			this.getView().byId("PC1").setBuiltInViews(aSelectedKeys);
		}
	});
});