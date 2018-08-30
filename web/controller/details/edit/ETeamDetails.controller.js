sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/TeamsSAL",
	"com/ss/app/StryxSports/controller/sal/LocationsSAL",
	"com/ss/app/StryxSports/controller/sal/SeasonSAL",
	"com/ss/app/StryxSports/controller/sal/SportCategorySAL",
	"com/ss/app/StryxSports/controller/sal/CoachsSAL",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/core/ValueState",
	"com/ss/app/StryxSports/controller/util/Validator",
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	"com/ss/app/StryxSports/controller/sal/HolidaySAL",
	  'sap/m/Button',
     'sap/m/Dialog',
	 'sap/m/Text'
], function(TeamsSAL, LocationsSAL, SeasonSAL, SportCategorySAL, CoachsSAL, JSONModel, Filter, ValueState, Validator, MessageToast,
	MessageBox, HolidaySAL, Button, Dialog, Text) {
	"use strict";
	return TeamsSAL.extend("com.ss.app.StryxSports.controller.details.edit.ETeamDetails", {
		onInit: function() {
			this._pageID = "";
			this._getAccountID = "";
			this.initData = false;
			this.afRender = false;
			this._getGTeamID = "";
			this._setSelected = false;
			var oRouter = this.getRouter();
			oRouter.getRoute("EditTeam").attachMatched(this._onRouteMatched, this);
			oRouter.getRoute("EditTeamDetail").attachMatched(this._onRouteEditTeamDetailMatched, this);
			this._dataSTARTANDENSTimes = [{
					"Name": "Monday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Mon"
        }, {
					"Name": "Tuesday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Tue"
        }, {
					"Name": "Wednesday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Wed"
        }, {
					"Name": "Thursday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Thu"
        }, {
					"Name": "Friday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Fri"
        }, {
					"Name": "Saturday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Sat"
        }, {
					"Name": "Sunday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Sun"
        }
    ];
			var setJSON = new JSONModel();
			setJSON.setData(this._dataSTARTANDENSTimes);
			sap.ui.getCore().setModel(setJSON, "MDLStartAndEnTime");

		},
		onAfterRendering: function() {
			this.afRender = true;
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
			that.setValueStateForId();
			this._pageID = oEvent.getParameter("arguments").PageID;
			var getTeamID = oEvent.getParameter("arguments").teamID;
			this._getAccountID = oEvent.getParameter("arguments").AccountId;
			this._getGTeamID = getTeamID;
			this._setSelected = false;
			var teamModel = new JSONModel();
			that.getView().setModel(teamModel, "createTeamModel");
			this.loadingMdls = true;
			//this.destroyDialog();
			//that.showLoading(true);
			that.getView().setBusy(true);
			if (!that.initData) {
				that.getView().setModel(teamModel, "mTeamSeasons");
				that.getView().setModel(teamModel, "mTeamCategory");
				that.getView().setModel(teamModel, "getSportsModel");
				that.getView().setModel(teamModel, "mTeamLocations");
				that.setSelBusy();
				$.when(that.fetchSeasons()).then(function() {
					$.when(that.fetchCategory()).then(function() {
						$.when(that.fetchLocations()).then(function() {
							that.initData = true;
							$.when(that.fetchTMId(teamModel, getTeamID)).then(function() {
								return;
							});
						});
					});
				});
			} else {
				var selSCat = that.getView().byId("addSportsCategory");
				selSCat.setSelectedKey("-1");
				that.getView().setModel(teamModel, "getSportsModel");
				$.when(that.fetchTMId(teamModel, getTeamID)).then(function() {
					return;
				});
			}
			this._setSelected = false;
			this.onSelectChanged();
		},
		_onRouteEditTeamDetailMatched: function(oEvent) {
			var that = this;
			that.setValueStateForId();
			this._pageID = oEvent.getParameter("arguments").PageID;
			var getTeamID = oEvent.getParameter("arguments").TeamID;
			this._getAccountID = oEvent.getParameter("arguments").AccountId;
			this._getGTeamID = getTeamID;
			this._setSelected = false;
			var teamModel = new JSONModel();
			that.getView().setModel(teamModel, "createTeamModel");
			this.loadingMdls = true;
			that.getView().setBusy(true);
			if (!that.initData) {
				that.getView().setModel(teamModel, "mTeamSeasons");
				that.getView().setModel(teamModel, "mTeamCategory");
				that.getView().setModel(teamModel, "getSportsModel");
				that.getView().setModel(teamModel, "mTeamLocations");
				that.setSelBusy();
				$.when(that.fetchSeasons()).then(function() {
					$.when(that.fetchCategory()).then(function() {
						$.when(that.fetchLocations()).then(function() {
							that.initData = true;
							$.when(that.fetchTMId(teamModel, getTeamID)).then(function() {
								return;
							});
						});
					});
				});
			} else {
				var selSCat = that.getView().byId("addSportsCategory");
				selSCat.setSelectedKey("-1");
				that.getView().setModel(teamModel, "getSportsModel");
				$.when(that.fetchTMId(teamModel, getTeamID)).then(function() {
					return;
				});
			}
			this._setSelected = false;
			this.onSelectChanged();
		},
		setSelBusy: function() {
			var othat = this;
			var selSeason = othat.getView().byId("addTeamSeason");
			selSeason.setBusy(true);
			var selSCat = othat.getView().byId("addSportsCategory");
			selSCat.setBusy(true);
			var selLoc = othat.getView().byId("addTeamLocation");
			selLoc.setBusy(true);
		},

		handleChange: function(oEvent) {
			var bValid = oEvent.getParameter("valid");
			var oDRS = oEvent.oSource;
			if (bValid) {
				oDRS.setValueState(sap.ui.core.ValueState.None);
			} else {
				oDRS.setValueState(sap.ui.core.ValueState.Error);
			}
		},

		fetchTMId: function(teamModel, getTeamID) {
			var that = this;
			//var selSport = that.getView().byId("addSportName");
			//selSport.removeAllItems();
			that.fetchTeamsById(teamModel, getTeamID).done(function(jMdl) {
				that.fetchCatSptById(jMdl);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "TeamsDetail");
			});
		},
		fetchCatSptById: function(jModel) {
			var that = this;
			var sCatSAL = new SportCategorySAL();
			var obj = jModel.getProperty('/');
			var scMD = new JSONModel();
			var getELe = this.getVariables();
			sCatSAL.fetchSportCategoryByID(scMD, obj.U_CategorySports).done(function(csMD) {
				jModel.oData.catID = csMD.oData.U_CategoryCode;
				jModel.oData.sptID = csMD.oData.U_SportsCode;
				that.getView().setModel(jModel, "createTeamModel");
				var sel = that.getView().byId("addSportsCategory");
				sel.setSelectedKey(jModel.oData.catID.toString());
				sel.fireChange(sel.getSelectedItem());
				//that.showLoading(false);
				that.getView().setBusy(false);
				getELe.addTabTeams.setBusy(false);
			}).fail(function(err) {
				that.getView().setBusy(false);
				getELe.addTabTeams.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "Teams");
			});
		},
		fetchSeasons: function() {
			//API CALL TO FETCH ACTIVE SEASONS
			var othat = this;
			var seaSAL = new SeasonSAL();
			var sFilter = "$filter=U_Status%20eq%20'1'";
			seaSAL.fetchSeason(othat, sFilter).done(function(obj) {
				othat.getView().setModel(obj, "mTeamSeasons");
				var selSeason = othat.getView().byId("addTeamSeason");
				var oItem = new sap.ui.core.Item({
					text: "Select Season",
					key: -1
				});
				selSeason.insertItem(oItem, 0);
				selSeason.setSelectedItem(oItem);
				othat.getView().byId("addTeamSeason").setValueState("None");
				selSeason.setBusy(false);
				// console.log("Success: ", obj.oData.value);
			}).fail(function(err) {
				console.log("Error: ", err);
			});
		},
		fetchLocations: function() {
			//API CALL TO FETCH ACTIVE LOCATIONS
			var othat = this;
			var locSAL = new LocationsSAL();
			var lFilter = "$filter=U_Status%20eq%20'1'";
			locSAL.fetchLocationsMasters(othat, lFilter).done(function(obj) {
				othat.getView().setModel(obj, "mTeamLocations");
				var selLoc = othat.getView().byId("addTeamLocation");
				var oItem = new sap.ui.core.Item({
					text: "Select Location",
					key: -1
				});
				selLoc.insertItem(oItem, 0);
				selLoc.setSelectedItem(oItem);
				selLoc.setBusy(false);
				othat.getView().byId("addTeamLocation").setValueState("None");
				othat.loadingMdls = false;
				// console.log("Success: ", obj.oData.value);
			}).fail(function(err) {
				console.log("Error: ", err);
			});
		},

		fetchMemberName: function() {
			var getELe = this.getVariables();
			var othat = this;
			var memSAL = new TeamsSAL();
			memSAL.fetchMember(this._getGTeamID).done(function(obj) {
				getELe.addTabTeams.setBusy(false);
				othat.getView().setModel(obj, "MembersList");
			}).fail(function(err) {
				getELe.addTabTeams.setBusy(false);
				console.log("Error: ", err);
			});
		},

		fetchCategory: function() {
			//API CALL TO FETCH SPORTS CATEGORY
			var othat = this;
			var sCatSAL = new SportCategorySAL();
			var choice = "$orderby=Code%20desc";
			sCatSAL.fetchSportCategoryMasters(othat, choice).done(function(obj) {
				othat.getView().setModel(obj, "mTeamCategory");
				var selSCat = othat.getView().byId("addSportsCategory");
				var oItem = new sap.ui.core.Item({
					text: "Select Sports Category",
					key: -1
				});
				selSCat.insertItem(oItem, 0);
				selSCat.setSelectedItem(oItem);
				selSCat.setBusy(false);
				othat.getView().byId("addSportsCategory").setValueState("None");
				var selSport = othat.getView().byId("addSportName");
				var sItem = new sap.ui.core.Item({
					text: "Select Sports",
					key: -1
				});
				selSport.insertItem(sItem, 0);
				selSport.setSelectedItem(sItem);
				othat.getView().byId("addSportName").setValueState("None");
				selSport.setBusy(false);
				// console.log("Success: ", obj.oData.value);
			}).fail(function(err) {
				console.log("Error: ", err);
			});
		},

		// START GET SPORTS BY CATEGORY
		getCatSports: function(evt) {
			var othat = this;
			var getEle = othat.getVariables();
			var CategoryCode = getEle.addSportsCategory;
			if (CategoryCode.getSelectedKey() !== "-1" && CategoryCode.getValue() !== "") {
				var selSport = othat.getView().byId("addSportName");
				selSport.setBusy(true);
				var sCatSAL = new SportCategorySAL();
				// FIRST API CALL TO GET CURRENT CATEGORY ID
				var src = evt.getSource();
				var getCategoryCode = src.getSelectedItem().getKey();
				//var catFilter = "$filter=Name%20eq%20" + "'" + getCategoryChange + "'";
				var sportCategoryModel = new JSONModel();
				sCatSAL.fetchSportCategoryDetail(sportCategoryModel, getCategoryCode).done(function(getResponse) {
					othat.getView().setModel(getResponse, "getSportsModel");
					othat.getView().getModel("getSportsModel").refresh(true);
					var selCatSptID = parseInt(othat.getView().getModel("createTeamModel").oData.U_CategorySports, 10);
					if (selCatSptID < 0) {
						var sItem = new sap.ui.core.Item({
							text: "Select Sports",
							key: -1
						});
						selSport.insertItem(sItem, 0);
						selSport.setSelectedItem(sItem);
					}
					selSport.setBusy(false);
				}).fail(function(err) {
					selSport.setBusy(false);
					othat.fetchMessageOk("Error", "Error", err.toString(), "SportsCategory");
				});
			}
		},
		onPressAddCoachTable: function(oEvent) {
			var that = this;
			var jModel;
			var getContext = this.getContext();
			var filterPosition = "$filter=Name%20eq%20" + "%27" + getContext.Coaches.empType + "%27";
			this.showLoading(true);
			var coachsSAL = new CoachsSAL();
			coachsSAL.fetchEmployeePosition(filterPosition).done(function(getID) {
				coachsSAL.fetchEmployeesPositionInfo(getID).done(function(obj) {
					var coachVal = obj.oData.value;
					var eModel = that.getView().getModel("createTeamModel");
					var selCoachVal = eModel.oData.Coaches;
					var finalCoaches = [];
					if (coachVal.length > 0) {
						for (var i = 0; i < coachVal.length; i++) {
							var isPush = true;
							for (var j = 0; j < selCoachVal.length; j++) {
								if (selCoachVal[j].EmployeeID === coachVal[i].EmployeeID) {
									isPush = false;
									break;
								}
							}
							if (isPush) {
								finalCoaches.push(coachVal[i]);
							}
							isPush = false;
						}
					}
					obj.oData.value = finalCoaches;
					jModel = obj;
					sap.ui.getCore().setModel(jModel, "CoachsMaster");
					sap.ui.getCore().getModel("CoachsMaster").refresh(true);
					that.showLoading(false);
					that.onOpenCoachDialog();
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});

			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		onOpenCoachDialog: function(oEvent) {
			var othat = this;
			//if (!othat._oDialog) {
			othat._oDialog = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.editCoachTable", this);
			othat._oDialog.setModel(othat.getView().getModel());
			//}
			if (!othat._oDialog.getMultiSelect()) {
				othat._oDialog.setMultiSelect(true);
			}
			othat.getView().addDependent(othat._oDialog);
			othat._oDialog.open();
		},

		destroyDialog: function() {
			/* var id = sap.ui.getCore().byId("addCoachTableTeams");
			if (id !== undefined) {
				id.destroy();
			}*/
		},

		onEditCoachToTeam: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				var cModel = this.getView().getModel("createTeamModel");
				for (var i = 0; i < aContexts.length; i++) {
					aContexts[i].getObject().rec_status = 'n';
					cModel.oData.Coaches.push(aContexts[i].getObject());
				}
				cModel.refresh(true);
			}
		},

		handleCloseTableDialog: function() {
			// this.destroyDialog();
		},

		onDeleteCoachEntry: function(oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext("createTeamModel");
			var obj = ctx.getObject();

			switch (obj.rec_status) {
				case "e":
					obj.rec_status = "de";
					//item.$().css('background-color', '#ffb3b3');
					break;
				case "n":
					obj.rec_status = "dn";
					//	item.$().css('background-color', '#FFFFFF');
					break;
				case "de":
					obj.rec_status = "e";
					//	item.$().css('background-color', '#FFFFFF');
					break;
				case "dn":
					obj.rec_status = "n";
					//	item.$().css('background-color', '#ffb3b3');
					break;
				default:
					// 		item.$().css('background-color', '#FFFFFF');
					break;
			}
			this.getView().getModel("createTeamModel").refresh(true);
		},
		setValueStateForId: function() {
			var setThis = this;
			var getEle = setThis.getVariables();
			getEle.addTeamName.setValueState("None");
			getEle.addTeamSeason.setValueState("None");
			getEle.addStartEndAndDate.setValueState("None");
			getEle.addSportsCategory.setValueState("None");
			getEle.addSportName.setValueState("None");
			getEle.addTeamLocation.setValueState("None");
			getEle.addTeamClassMin.setValueState("None");
			getEle.addTeamClassMax.setValueState("None");
		},
		onPressSaveEditTeams: function() {
			var setThis = this;
			var getEle = setThis.getVariables();
			if (getEle.addTeamName.getValue() === "") {
				getEle.addTeamName.setValueState("Error");
			} else if (getEle.addTeamSeason.getValue() === "Select Season" || getEle.addTeamSeason.getValue() === "") {
				setThis.setValueStateForId();
				getEle.addTeamSeason.setValueState("Error");
			} else if (getEle.addStartEndAndDate.getValue() === "") {
				setThis.setValueStateForId();
				getEle.addStartEndAndDate.setValueState("Error");
			} else if (getEle.addSportsCategory.getValue() === "Select Sports Category" || getEle.addSportsCategory.getValue() === "") {
				setThis.setValueStateForId();
				getEle.addSportsCategory.setValueState("Error");
			} else if (getEle.addSportName.getValue() === "Select Sports" || getEle.addSportName.getValue() === "") {
				setThis.setValueStateForId();
				getEle.addSportName.setValueState("Error");
			} else if (getEle.addTeamLocation.getValue() === "Select Location" || getEle.addTeamLocation.getValue() === "") {
				setThis.setValueStateForId();
				getEle.addTeamLocation.setValueState("Error");
			} else if (getEle.addTeamClassMin.getValue() === "") {
				setThis.setValueStateForId();
				getEle.addTeamClassMin.setValueState("Error");
			} else if (getEle.addTeamClassMax.getValue() === "") {
				setThis.setValueStateForId();
				getEle.addTeamClassMax.setValueState("Error");
			} else {
				setThis.setValueStateForId();
				var getTeamModel = setThis.getView().getModel("createTeamModel");
				var getFromDate = getEle.addStartEndAndDate.getFrom();
				var getToDate = getEle.addStartEndAndDate.getTo();
				var startDate = this.toDateFormat(getFromDate);
				var EndDate = this.toDateFormat(getToDate);
				try {
					getTeamModel.setProperty("/U_StartDate", startDate);
					getTeamModel.setProperty("/U_EndDate", EndDate);
				} catch (e) {
					console.log(e.toString());
				}
				var tmpCoachObj = getTeamModel.oData;
				var tmpObj = [];
				this.showLoading(true);
				if (tmpCoachObj.Coaches.length > 0) {
					for (var i = 0; i < tmpCoachObj.Coaches.length; i++) {
						if (tmpCoachObj.Coaches[i].rec_status !== "dn") {
							tmpObj.push(tmpCoachObj.Coaches[i]);
						}
					}
					getTeamModel.oData.Coaches = tmpObj;
				}
				this.updateTeams(getTeamModel).done(function() {
					setThis.fetchTeams(setThis).done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "TeamsList");
						setThis.showLoading(true);
						//setThis.destroyDialog();
						var Eteamsave = setThis.oBundle("UpdatedSuccessfully");
						//	setThis.fetchMessageOk("Edit Team", "Success", Eteamsave, "Teams");

						//	setThis.fetchMessageOkNavTo("Edit Team", "Success", Eteamsave, setThis._getGTeamID);
						setThis.fetchMessageOkNavToOkay("Edit Team", "Success", Eteamsave);
						setThis.sendNotificationEmail().done(function(res) {
							var body = res.body;
						}).fail(function(err) {
							console.log(err.status + " " + err.statusText);
						});
					}).fail(function(err) {
						setThis.showLoading(false);
						setThis.fetchMessageOk("Error", "Error", err.toString(), "Teams");
					});
				}).fail(function(err) {
					setThis.showLoading(false);
					setThis.fetchMessageOk("Error", "Error", err.toString(), "Teams");
				});
				var URL = "/stryxsports/client/services/SendEmail.xsjs";
				$.ajax({
					type: 'GET',
					data: 'Mail from stryx sports',
					url: URL,
					crossDomain: true,
					success: function(response) {
						console.log(JSON.stringify(response));
					},
					error: function(xhr, status, error) {
						console.log(JSON.stringify(error));
					}
				});
			}
		},
		handleCancelEditPress: function() {
			//this.destroyDialog();
			var Eteamcancel = this.oBundle("YourChangesWillBeLost");
			this.onDialogState("Note", "Warning", Eteamcancel, "Teams");
		},

		getVariables: function() {
			var items = {
				addTeamName: this.getView().byId("addTeamName"),
				addTeamSeason: this.getView().byId("addTeamSeason"),
				addStartEndAndDate: this.getView().byId("addStartEndAndDate"),
				addSportsCategory: this.getView().byId("addSportsCategory"),
				addSportName: this.getView().byId("addSportName"),
				addTeamLocation: this.getView().byId("addTeamLocation"),
				addTeamClassMin: this.getView().byId("addTeamClassMin"),
				addTeamClassMax: this.getView().byId("addTeamClassMax"),
				addTeamClassTotal: this.getView().byId("addTeamClassTotal"),
				addTeamStatus: this.getView().byId("addTeamStatus"),
				addTabTeams: this.getView().byId("tabTeams")

			};
			return items;
		},

		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},
		onSelectChanged: function() {
			//	var key = oEvent.getParameters().key;
			var getELe = this.getVariables();
			var getSelected = getELe.addTabTeams.getSelectedKey();
			if (this._setSelected !== true) {
				getELe.addTabTeams.setSelectedKey("TeamCoaches");
				getELe.addTabTeams.setBusy(false);
			}
			getELe.addTabTeams.setBusy(true);

			switch (getSelected) {
				case "TeamCoaches":
					this._setSelected = true;
					getELe.addTabTeams.setBusy(false);
					break;
				case "TeamMembers":
					this._setSelected = true;
					this.fetchMemberName();
					break;
				case "TeamCalendar":
					this._setSelected = true;
					getELe.addTabTeams.setBusy(false);
					this.fetchTeamCalendars();
					break;
				default:
					break;
			}
		},
		// 		//Here function for Team table search 
		handleSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("FirstName", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		onPressEditCalendar: function(evt) {
			var that = this;
			if (!that._oEditCalDialog) {
				that._oEditCalDialog = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.EditCalendar", that);
			}

			that.getView().addDependent(that._oEditCalDialog);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._oEditCalDialog);
			that._oEditCalDialog.open();
		},
		handleCalendarDaysSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		handleEditCalendarConfirm: function(oEvent) {
			var that = this;
			var teamModel = that.getView().getModel("createTeamModel");
			var appointments = [];
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				aContexts.forEach(function(oCtx) {
					let obj = {};
					obj.Name = oCtx.getObject().Name;
					obj.STime = oCtx.getObject().StartTime;
					obj.ETime = oCtx.getObject().EndTime;
					appointments.push(obj);
					/*					var calArr = teamModel.oData.Calendar;
					calArr.push(obj);
					that.getView().setModel(teamModel, "createTeamModel");*/
				});
			}
			// Create Team Schedule model and set as global model
			var oModel = new JSONModel();
			oModel.setData(appointments);
			sap.ui.getCore().setModel(oModel, "scheduleModel");
			sap.ui.getCore().getModel("scheduleModel").refresh(true);
			// Create Team Calendar Model
			var cModel = new JSONModel();
			var teamArr = [];
			var calendar = {};
			calendar.appointments = appointments;
			calendar.name = "John Miller";
			calendar.sDate = "8/10/18";
			calendar.eDate = "8/10/19";
			teamArr.push(calendar);
			cModel.setData(teamArr);
			sap.ui.getCore().setModel(cModel, "TeamCalendarModel");
			sap.ui.getCore().getModel("TeamCalendarModel").refresh(true);

			oEvent.getSource().getBinding("items").filter([]);

			MessageToast.show("Team Calendar Updated Successfully");
		},
		onPressViewCalendar: function(evt) {
			// 			var that = this;
			// 			that.getRouter().navTo("ViewCalendar");
		},
		onPressViewSchedules: function(evt) {
			var that = this;
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("CreateTeamCalendarsList");
			var getName = oCtx.getProperty("Name");
			var getTeamId = this._getGTeamID;
			var getPageID = this._pageID;
			that.getRouter().navTo("ViewTeamSchedules", {
				teamID: getTeamId,
				scheduleName: getName,
				PageID: getPageID
			});
			/*	this.viewTeamSchedules(oCtx.getProperty("Name")).done(function(res) {
			
			}).fail(function(err) {
				that.fetchMessageOk("Error", "Error", err.toString(), "HolidayListMaster");
			});*/

		},
		onPressCreateCalendar: function(oEvent) {
			var that = this;
			if (!that._oCalDialog) {
				that._oCalDialog = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.CreateCalendar", that);
			}

			that.getView().addDependent(that._oCalDialog);
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._oCalDialog);
			that._oCalDialog.addDelegate({
				onAfterRendering: function() {
					var oTable = sap.ui.getCore().byId("createCalTabDialog");
					var header = oTable.$().find('thead');
					var selectAllCb = header.find('.sapMCb');
					selectAllCb.remove();
				}
			});
			that.fetchMasterList();
			// Get recent created team
			var filter = "?$top=1&$orderby=Code%20desc";
			that.fetchTeams(filter).done(function(res) {
				that.teamId = res.oData.value[0].Code + 1;
			}).fail(function(err) {
				console.log(err);
			});

		},
		fetchMasterList: function() {
			var that = this;
			var filter = "$orderby=Code%20desc";
			var holidaySAL = new HolidaySAL();
			that.showLoading(true);
			that._oCalDialog.open();
			sap.ui.getCore().byId("inputTeamCalendarTitle").setValue("");
			sap.ui.getCore().byId("inputTeamCalendarTitle").setValueState("None");
			var seleHolidayList = sap.ui.getCore().byId("createCalSeleHolidayListID");
			seleHolidayList.setBusy(true);

			holidaySAL.fetchHolidayList(that, filter).done(function(getResponse) {
				var oItem = new sap.ui.core.Item({
					text: "Select The Holiday",
					key: -1
				});
				sap.ui.getCore().setModel(getResponse, "HolidayListMDL");
				seleHolidayList.insertItem(oItem, 0);
				seleHolidayList.setSelectedItem(oItem);
				seleHolidayList.setBusy(false);
				that.createModelTeamCalendar();
				that.clearTableValueEnabled();
				that.showLoading(false);
			}).fail(function(err) {
				seleHolidayList.setBusy(false);
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "HolidayListMaster");
			});
		},
		btnPressCreateCalTabDialogClose: function() {
			var getJSON = [{
					"Name": "Monday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Mon"
        }, {
					"Name": "Tuesday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Tue"
        }, {
					"Name": "Wednesday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Wed"
        }, {
					"Name": "Thursday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Thu"
        }, {
					"Name": "Friday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Fri"
        }, {
					"Name": "Saturday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Sat"
        }, {
					"Name": "Sunday",
					"StartTime": "",
					"EndTime": "",
					"IsWeekend": "Sun"
        }
    ];
			sap.ui.getCore().byId("btnDCreateTeamCalender").setEnabled(false);
			var setJSON = new JSONModel();
			setJSON.setData(getJSON);
			sap.ui.getCore().setModel(setJSON, "MDLStartAndEnTime");
			this._oCalDialog.close();

		},
		handleCreateCalendarConfirm: function(oEvent) {
			var that = this;
			var teamCalendarMDL = that.getView().getModel("createModelTeamCalendar");
			var calBusy = sap.ui.getCore().byId("editTeamCalFrg");
			var oTable = sap.ui.getCore().byId("createCalTabDialog");
			if (teamCalendarMDL === null || teamCalendarMDL === undefined) {
				var createTeamCalendarMDL = this.createModelTeamCalendar();
				this.getView().setModel(createTeamCalendarMDL, "CreateTeamCalendar");
				teamCalendarMDL = this.getView().getModel("CreateTeamCalendar");
			}
			var getMDLData = teamCalendarMDL.getData();
			var getSelectedTable = sap.ui.getCore().byId("createCalTabDialog").getSelectedItems();

			if (sap.ui.getCore().byId("inputTeamCalendarTitle").getValue() !== "") {
				sap.ui.getCore().byId("inputTeamCalendarTitle").setValueState("None");
				if (getSelectedTable.length > 0) {

					getSelectedTable.forEach(function(val1) {
						var tmpBody = {};
						tmpBody.U_TeamId = that._getGTeamID;
						tmpBody.Code = 0;
						tmpBody.Name = sap.ui.getCore().byId("inputTeamCalendarTitle").getValue();
						tmpBody.U_Days = val1.oBindingContexts.MDLStartAndEnTime.getProperty("Name");
						tmpBody.U_SchStatus = "1";
						tmpBody.U_StartTime = val1.oBindingContexts.MDLStartAndEnTime.getProperty("StartTime");
						tmpBody.U_EndTime = val1.oBindingContexts.MDLStartAndEnTime.getProperty("EndTime");
						if (sap.ui.getCore().byId("createCalSeleHolidayListID").getSelectedKey() === "-1") {
							tmpBody.U_HolidayListID = "";
						} else {
							tmpBody.U_HolidayListID = sap.ui.getCore().byId("createCalSeleHolidayListID").getSelectedKey();
						}

						getMDLData.value.push(tmpBody);
					});
					teamCalendarMDL.setData(getMDLData);
					teamCalendarMDL.refresh(true);
					oTable.setBusy(true);
					calBusy.setBusy(true);
					var filter = "$filter=Name eq '" + sap.ui.getCore().byId("inputTeamCalendarTitle").getValue() + "'";
					this.fetchTeamCalendarList(filter).done(function(getRes) {
						if (getRes.oData.value.length <= 0) {
							oTable.setBusy(false);
							that.createCalendarTeam(teamCalendarMDL).done(function(getResponse) {
								that.btnPressCreateCalTabDialogClose();
								//	that.fetchErrorMessageOk("Create Calendar", "Success", "Created Team Calendar Successfully");
								//	setThis.fetchMessageOk("Edit Team", "Success", Eteamsave, "Teams");
								calBusy.setBusy(false);
								that.fetchMessageOkNavTo("Create Calendar", "Success", "Updated Successfully", that._getGTeamID);
								that.fetchTeamCalendars();
								that.showLoading(false);
								oTable.setBusy(false);
								that.btnPressCreateCalTabDialogClose();
							}).fail(function(err) {
								that.showLoading(false);
								oTable.setBusy(false);
								that.fetchMessageOk("Error", "Error", err.toString(), "Create Calendar Team");
							});

						} else {
							var inpTeamCalendarTitle = sap.ui.getCore().byId("inputTeamCalendarTitle");
							inpTeamCalendarTitle.setValueState(sap.ui.core.ValueState.Error);
							inpTeamCalendarTitle.setValueStateText("Entered team calendar title name already exists!");
							oTable.setBusy(false);
							calBusy.setBusy(false);
							//	that.fetchMessageOk("Error", "Error", "Record already exixts", "Sports");
						}

					}).fail(function(err) {
						that._oCalDialog.setSelBusy(false);
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "Create Calendar Team");
					});

				} else {

				}

			} else {
				sap.ui.getCore().byId("inputTeamCalendarTitle").setValueState("Error");
			}

		},
		createModelTeamCalendar: function() {
			var setJSONTeamCalendarMD = new JSONModel();
			setJSONTeamCalendarMD.setProperty('/Code', 0);
			setJSONTeamCalendarMD.setProperty('/value', []);
			return setJSONTeamCalendarMD;

		},
		selecteCreateCalSeleHolidayList: function() {
			var that = this;
			var getSeleKey = sap.ui.getCore().byId("createCalSeleHolidayListID").getSelectedKey();
			var oTable = sap.ui.getCore().byId("createCalTabDialog");
			var holidaySAL = new HolidaySAL();
			oTable.setBusy(true);
			this.clearTableValueEnabled();
			if (getSeleKey !== "-1") {
				holidaySAL.fetchHolidayListById(getSeleKey).done(function(getResponse) {
					var getWeekend = getResponse.getData();
					var weekend = getWeekend.U_Weekend;
					var weekendArr = weekend.split(",");
					oTable.getItems().forEach(function(r) {
						var obj = r.getBindingContext("MDLStartAndEnTime").getObject();
						var oStatus = obj.IsWeekend;
						var cb = r.$().find('.sapMCb');
						var oCb = sap.ui.getCore().byId(cb.attr('id'));
						weekendArr.forEach(function(getWeekends) {
							if (oStatus === getWeekends) {
								oCb.setEnabled(false);
							}
						});

					});
					that.showLoading(false);
					oTable.setBusy(false);
				}).fail(function(err) {
					that.showLoading(false);
					oTable.setBusy(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "HolidayListMaster");
				});
			} else {
				this.clearTableValueEnabled();
			}

		},

		clearTableValueEnabled: function() {
			var oTable = sap.ui.getCore().byId("createCalTabDialog");
			oTable.getItems().forEach(function(r) {
				var cb = r.$().find('.sapMCb');
				var oCb = sap.ui.getCore().byId(cb.attr('id'));
				oCb.setEnabled(true);
				oTable.removeSelections(true);
			});

		},

		fetchTeamCalendars: function() {
			var filter = "$apply=filter(U_TeamId eq '" + this._getGTeamID + "')/groupby((Name))";
			var that = this;
			var tableTeamCalendar = this.getView().byId("editTabTeamCalendar");
			tableTeamCalendar.setBusy(true);
			this.fetchTeamCalendarList(filter).done(function(getResponse) {
				that.getView().setModel(getResponse, "CreateTeamCalendarsList");
				tableTeamCalendar.setBusy(false);
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				tableTeamCalendar.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "HolidayListMaster");
			});
		},
		////////////////////////////////////////////////////////START CREATE MESSAGES ///////////////////////////////////////////////////////
		fetchMessageOkNavTo: function(getTitle, getState, getMessage, GetID) {
			var that = this;
			var getRouteName;
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
					text: 'Continue',
					press: function() {

						if (getTitle === "Edit Team") {
							that.initData = false;
							that.getOwnerComponent().getRouter().navTo("EditTeam", {
								teamID: that._getGTeamID
							});
						} else {
							that.btnPressCreateCalTabDialogClose();
						}
						messageOktDialog.close();
					}
				}),
				endButton: new Button({
					text: 'Create Team',
					press: function() {
						that.getOwnerComponent().getRouter()
							.navTo("Teams");
						messageOktDialog.close();
					}
				})
			});
			messageOktDialog.open();
		},
		fetchMessageOkNavToOkay: function(getTitle, getState, getMessage) {
			var that = this;
			var getRouteName;
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
					text: 'Create Team',
					press: function() {
						that.getOwnerComponent().getRouter()
							.navTo("Teams");
						messageOktDialog.close();
					}
				})

			});
			messageOktDialog.open();
		},
		seleCreateTaemCalList: function() {
			var oTable = sap.ui.getCore().byId("createCalTabDialog").getSelectedItems();
			if (oTable && oTable.length) {
				sap.ui.getCore().byId("btnDCreateTeamCalender").setEnabled(true);

			} else {
				sap.ui.getCore().byId("btnDCreateTeamCalender").setEnabled(false);

			}
		}
	});
});