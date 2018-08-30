sap.ui.define([
     "com/ss/app/StryxSports/controller/sal/CalendarSAL",
     "com/ss/app/StryxSports/controller/sal/TeamsSAL",
     'sap/ui/model/json/JSONModel',
     'sap/m/MessageBox',
     'sap/m/MessageToast'
], function(CalendarSAL, TeamsSAL, JSONModel, MessageBox) {
	"use strict";
	return CalendarSAL.extend("com.ss.app.StryxSports.controller.details.ViewInvoice", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("ViewCalendar").attachMatched(this._onRouteMatched, this);
			oRouter.getRoute("ViewTeamCalendar").attachMatched(this._onRouteViewTeamCalendarMatched, this);
			this._pageID = "";
			this._getSeleTeamID = "";
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
			this.setSelBusy();
			this._teamID = oEvent.getParameter("arguments").teamID;
			that.fetchTeamsName();
			var getPlanningCalender = that.getView().byId("PC1");
			getPlanningCalender.setNoDataText("No Schedules, Team Available.");
			that.showLoading(false);
		},
		_onRouteViewTeamCalendarMatched: function(oEvent) {
			this.fetchTeamsName();
			this._pageID = oEvent.getParameter("arguments").PageID;
			this._accountID = oEvent.getParameter("arguments").accountID;
			this._teamID = oEvent.getParameter("arguments").teamID;

			this.fetchTeamsById(this._teamID);
		},
		setSelBusy: function() {
			var othat = this;
			var selSeason = othat.getView().byId("idTeamsName");
			selSeason.setBusy(true);
		},
		fetchTeamsName: function() {
			var that = this;
			var teamsSAL = new TeamsSAL();
			teamsSAL.fetchTeams(that).done(function(obj) {
				that.getView().setModel(obj, "TeamNames");
				var selSeason = that.getView().byId("idTeamsName");
				var oItem = new sap.ui.core.Item({
					text: "Select Team",
					key: -1
				});
				selSeason.insertItem(oItem, 0);
				selSeason.setSelectedItem(oItem);
				selSeason.setBusy(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchTeamsById: function(getTeamId) {
			var that = this;
			that.showLoading(true);
			var tFilterCardType = "$apply=filter(U_TeamId eq '" + getTeamId + "')/groupby((U_TeamId,Name))";
			that.fetchTeamCalendar(tFilterCardType).done(function(resp) {
				that.getView().setModel(resp, "TeamsList");
				var selSca = that.getView().byId("idTeamsCalender");
				selSca.setBusy(true);
				var oItem = new sap.ui.core.Item({
					text: "Select Calender",
					key: -1
				});
				selSca.insertItem(oItem, 0);
				selSca.setSelectedItem(oItem);
				selSca.setBusy(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchMemberName: function(getMemCode) {
			var that = this;
			var memSAL = new TeamsSAL();
			memSAL.fetchMember(getMemCode).done(function(obj) {
				that.getView().setModel(obj, "MembersList");
			}).fail(function(err) {});
		},
		onGetTeamNameList: function() {
			var that = this;
			that._getSeleTeamID = this.getView().byId("idTeamsName").getSelectedKey();
			var selteam = this.getView().byId("idTeamsName").getSelectedItem();
			var getValue = that.getView().byId("idTeamsName").getValue();
			if (this._getSeleTeamID !== "-1" && getValue !== "") {
				//var selteam = that.getView().byId("idTeamsName").getSelectedItem().getText();
				if (selteam !== null) {
					that.fetchTeamsById(that._getSeleTeamID);
					that.fetchMemberName(that._getSeleTeamID);
					that.getView().byId("idTeamsCalender").setEnabled(true);
					that.showLoading(false);
				}
			}
		},
		onGetTeamCalenderList: function() {
			var that = this;

			that._getSelectCalValue = that.getView().byId("idTeamsCalender");
			that._getSelectCalID = that.getView().byId("idTeamsName").getSelectedKey();

			//var getPlanningCalender = that.getView().byId("PC1");
			if (that._getSeleTeamID !== "-1" && that._getSelectCalValue.getValue() !== "") {
				var selteam = that.getView().byId("idTeamsCalender").getSelectedItem().getText();
				var selTeamName = that.getView().byId("idTeamsName").getSelectedItem().getText();
				if (selteam !== null) {
					that.showLoading(true);
					var tFilterCardType = "$filter=U_TeamId eq '" + this._getSeleTeamID + "'";
					that.fetchCalendarBySchedule(tFilterCardType).done(function(resp) {
						if (resp.oData.value.length > 0) {
							// LOGIC TO SET PLANNING CALENDER START DATE
							var defaultSDate = resp.oData.value[0].U_SDate;
							var defaultSTime = resp.oData.value[0].U_STime;
							var calenderSDate = that.planningCalenderDate(defaultSDate, defaultSTime);
							var mCalenderSdate = new JSONModel();
							mCalenderSdate.setProperty('/U_calenderSDate', calenderSDate);
							that.getView().setModel(mCalenderSdate, "mCalenderSdate");
							
							var mcSchedule = new JSONModel();
							mcSchedule.setProperty('/U_Teams', []);
							var obj = mcSchedule.getData();
							var dd = obj.U_Teams;
							var temp = new Object();
							temp.U_TeamsName = selTeamName;
							temp.U_TeamName = selteam;
							temp.U_Schedules = resp.oData.value;
							dd.push(temp);
							that.getView().setModel(mcSchedule, "mcSchedule");

							var getMemModel = that.getView().getModel("MembersList");
							var getMDL = getMemModel.getData();
							getMDL.teamsCalenderName = selteam;
							getMemModel.setData(getMDL);
							that.updateMember(getMemModel).done(function(res) {
								if (res.length > 0) {
								    var mcSch =  that.getView().getModel("mcSchedule").getData();
									getMDL.value.forEach(function(ele, i) {
                                        var temp1 = new Object();
                                        temp1.U_TeamsName = selTeamName;
            							temp1.U_TeamName = getMDL.value[i].BusinessPartners.CardName;
            							temp1.U_Schedules = res[i].value;
            							mcSch.U_Teams.push(temp1);
									});
									that.getView().getModel("mcSchedule").setData(mcSch);
								}
								that.getView().setModel(res, "MembersModel");
							}).fail(function(err) {
								that.showLoading(false);
								that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
							});

							that.showLoading(false);
						} else {
							that.showLoading(true);
							that.getView().byId("PC1").setNoDataText("No Schedules, Team Available.");
							that.showLoading(false);
						}
						that.showLoading(false);
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
				}
			}

		},
		/*	onPressDialogSaveScheduleEA: function(oEvent) {
	        var that = this;
	       // var oAppointment = oEvent.getParameter("appointment");
	      //  var getCode = oAppointment.getCode();
		    var eSDate = sap.ui.getCore().byId("iaStartDate").getValue();
		    var eSTime = sap.ui.getCore().byId("iaStartTime").getValue();
		    var eETime = sap.ui.getCore().byId("iaEndTime").getValue();
				var shours = Number(eSTime.match(/^(\d+)/)[1]);
				var sminutes = Number(eSTime.match(/:(\d+)/)[1]);
				var AMPM = eSTime.match(/\s(.*)$/)[1];
				if (AMPM == "PM" && shours < 12) shours = shours + 12;
				if (AMPM == "AM" && shours == 12) shours = shours - 12;
				var sHours = shours.toString();
				var sMinutes = sminutes.toString();
				if (shours < 10) sHours = "0" + sHours;
				if (sminutes < 10) sMinutes = "0" + sMinutes;
				var newSSTime = sHours + ":" + sMinutes;

				// convert logic 12hours format to 24 hours for End Time
				var ehours = Number(eETime.match(/^(\d+)/)[1]);
				var eminutes = Number(eETime.match(/:(\d+)/)[1]);
				var eAMPM = eETime.match(/\s(.*)$/)[1];
				if (eAMPM == "PM" && ehours < 12) ehours = ehours + 12;
				if (eAMPM == "AM" && ehours == 12) ehours = ehours - 12;
				var eHours = ehours.toString();
				var eMinutes = eminutes.toString();
				if (ehours < 10) eHours = "0" + eHours;
				if (eminutes < 10) eMinutes = "0" + eMinutes;
				var newSETime = eHours + ":" + eMinutes;
            var eHDModel = new JSONModel();
             eHDModel.setProperty("/Code", getCode);
            eHDModel.setProperty("/U_SDate", that.toDateFormat(eSDate));
            eHDModel.setProperty("/U_STime", newSSTime);
            eHDModel.setProperty("/U_ETime", newSETime);
            that.getView().setModel(eHDModel ,"editHDModel");
	    	this.updateSchedule().done(function() {
		    }).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},*/
		handleAppointmentSelect: function(oEvent) {
			var oAppointment = oEvent.getParameter("appointment");
			if (!this._dialogEditSchedule) {
				this._dialogEditSchedule = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.dialogs.EditSchedule", this);
				this._dialogEditSchedule.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}
			this._dialogEditSchedule.open();

			if (oAppointment) {
				this._getActivityID = oAppointment.getKey();
				var getAStart = oAppointment.getStartDate(),
					getAEnd = oAppointment.getEndDate(),
					getAStartT = oAppointment.getStartDate(),
					getAEndT = oAppointment.getEndDate();
				var getAStartTo = this.toDateFormat(getAStart),
					getAEndTo = this.toDateFormat(getAEnd),
					getAStartTimeTo = this.toTimeFormat(getAStartT),
					getAEndTimeTo = this.toTimeFormat(getAEndT);

				var setAStartDate = sap.ui.getCore().byId("iaStartDate"),
					setAEndDate = sap.ui.getCore().byId("iaEndDate"),
					setASubject = sap.ui.getCore().byId("iaStartTime"),
					setANotes = sap.ui.getCore().byId("iaEndTime");

				setAStartDate.setText(getAStartTo);
				setAEndDate.setText(getAEndTo);
				setASubject.setText(getAStartTimeTo);
				setANotes.setText(getAEndTimeTo);
			} else {}
		},
		onPressDialogCloseEA: function() {
			this._dialogEditSchedule.close();
		},
		handleSelectionFinish: function(oEvent) {
			var aSelectedKeys = oEvent.getSource().getSelectedKeys();
			this.byId("PC1").setBuiltInViews(aSelectedKeys);
		},

		goToPreviousPage: function(evt) {
			window.history.go(-1);
		}

	});

});