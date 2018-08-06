sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/TeamsSAL",
	"com/ss/app/StryxSports/controller/sal/LocationsSAL",
	"com/ss/app/StryxSports/controller/sal/SeasonSAL",
	"com/ss/app/StryxSports/controller/sal/SportCategorySAL",
	"com/ss/app/StryxSports/controller/sal/CoachsSAL",
	"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		 "sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
], function(TeamsSAL, LocationsSAL, SeasonSAL, SportCategorySAL, CoachsSAL, JSONModel, Filter, ValueState, Validator) {
	"use strict";
	var getCategoryAfter, getCategoryChange, getCode, getSports, sportsFilter = null;
	return TeamsSAL.extend("com.ss.app.StryxSports.controller.details.TeamDetails", {

		onInit: function() {
			this._pageID = "";
			var oRouter = this.getRouter();
			oRouter.getRoute("Teams").attachMatched(this._onRouteMatched, this);
			// Attaches validation handlers
			sap.ui.getCore().attachValidationError(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.None);
			});
			this.dateObj = "";
		},
		createTeamModel: function() {
			var teamModel = new JSONModel();
			teamModel.setProperty('/Code', 0);
			teamModel.setProperty('/Name');
			teamModel.setProperty('/U_StartDate');
			teamModel.setProperty('/U_EndDate');
			teamModel.setProperty('/U_CategorySports');
			teamModel.setProperty('/U_Location');
			teamModel.setProperty('/U_SizeMin');
			teamModel.setProperty('/U_SizeMax');
			teamModel.setProperty('/U_Season');
			teamModel.setProperty('/U_Status', "1");
			teamModel.setProperty('/Coaches', []);
			this.getView().setModel(teamModel, "createTeamModel");
		},
		_onRouteMatched: function(oEvt) {
			this._pageID = oEvt.getParameter("arguments").PageID;
			var getEle = oEvt.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			var context = this.getContext();
			context.PageID = this._setViewLevel;
			this.setContext(context);
			var othat = this;
			var getTeamId = othat.getVariables();
			othat.createTeamModel();
			this.loadingMdls = true;
			othat.setSelBusy();
			var tmpModel = new JSONModel();
			othat.getView().setModel(tmpModel, "getSportsModel");
			$.when(othat.fetchSeasons()).then(function() {
				$.when(othat.fetchCategory()).then(function() {
					$.when(othat.fetchLocations()).then(function() {
						return;
					});
				});
			});
			getTeamId.addTeamName.setValueState("None");
			getTeamId.addTeamSeason.setValueState("None");
			getTeamId.addStartEndAndDate.setValueState("None");
			getTeamId.addSportsCategory.setValueState("None");
			getTeamId.addSportName.setValueState("None");
			getTeamId.addTeamLocation.setValueState("None");
			getTeamId.addTeamClassMin.setValueState("None");
			getTeamId.addTeamClassMax.setValueState("None");
		},

		onBeforeRendering: function() {
			var othat = this;
			if (!this.loadingMdls) {
				if (sap.ui.getCore().getModel("mTeamLocations") === null || sap.ui.getCore().getModel("mTeamLocations") === undefined) {
					othat.fetchLocations();
				}
				if (sap.ui.getCore().getModel("mTeamSeasons") === null || sap.ui.getCore().getModel("mTeamSeasons") === undefined) {
					othat.fetchSeasons();
				}
				if (sap.ui.getCore().getModel("mTeamCategory") === null || sap.ui.getCore().getModel("mTeamCategory") === undefined) {
					othat.fetchCategory();
				}
			}
			//othat.onAfterRendering();
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

		onAfterRendering: function() {
			var txt = this.getView().byId("addTeamName");

			txt.addDelegate({
				onsapenter: function(e) {
					var view = this.getView();
					view.getController().onClick();
				}
			});
		},

		onNavBack: function() {
			var getPagesID = this._pageID;
			switch (getPagesID) {
				case "66":
					this.getOwnerComponent().getRouter().navTo("TeamsDetail");
					break;
			}
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

		fetchSeasons: function() {
			//API CALL TO FETCH ACTIVE SEASONS
			var othat = this;
			othat.showLoading(true);
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
				selSeason.setBusy(false);
				othat.getView().byId("addTeamSeason").setValueState("None");
				// console.log("Success: ", obj.oData.value);
			}).fail(function(err) {
				console.log("Error: ", err);
			});
			othat.showLoading(false);
		},
		fetchLocations: function() {
			//API CALL TO FETCH ACTIVE LOCATIONS
			var othat = this;
			othat.showLoading(true);
			var locSAL = new LocationsSAL();
			var lFilter = "$filter=U_Status%20eq%20'1'";
			locSAL.fetchLocationsMasters(othat, lFilter).done(function(obj) {
				sap.ui.getCore().setModel(obj, "mTeamLocations");
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
			othat.showLoading(false);
		},

		fetchCategory: function() {
			//API CALL TO FETCH SPORTS CATEGORY
			var othat = this;
			othat.showLoading(true);
			var sCatSAL = new SportCategorySAL();
			var choice = "$orderby=Code%20desc";
			sCatSAL.fetchSportCategoryMasters(othat, choice).done(function(obj) {
				sap.ui.getCore().setModel(obj, "mTeamCategory");
				var selSCat = othat.getView().byId("addSportsCategory");
				var oItem = new sap.ui.core.Item({
					text: "Select Sports Category",
					key: -1
				});
				selSCat.insertItem(oItem, 0);
				selSCat.setSelectedItem(oItem);
				othat.getView().byId("addSportsCategory").setValueState("None");
				var selSport = othat.getView().byId("addSportName");
				var sItem = new sap.ui.core.Item({
					text: "Select Sports",
					key: -1
				});
				selSport.insertItem(sItem, 0);
				selSport.setSelectedItem(sItem);
				othat.getView().byId("addSportName").setValueState("None");
				selSCat.setBusy(false);
				// console.log("Success: ", obj.oData.value);
			}).fail(function(err) {
				console.log("Error: ", err);
			});
			othat.showLoading(false);
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
				var getCategoryCode = evt.getParameter("selectedItem").getKey();
				//var catFilter = "$filter=Name%20eq%20" + "'" + getCategoryChange + "'";
				var sportCategoryModel = new JSONModel();
				sCatSAL.fetchSportCategoryDetail(sportCategoryModel, getCategoryCode).done(function(getResponse) {
					othat.getView().setModel(getResponse, "getSportsModel");
					othat.getView().getModel("getSportsModel").refresh(true);
					var sItem = new sap.ui.core.Item({
						text: "Select Sports",
						key: -1
					});
					selSport.insertItem(sItem, 0);
					selSport.setSelectedItem(sItem);
					selSport.setBusy(false);
				}).fail(function(err) {
					selSport.setBusy(false);
					othat.fetchMessageOk("Error", "Error", err.toString(), "SportsCategory");
				});
			}
		},
		getSeleSeason: function(evt) {
		    var that = this;
			var seasonModel = this.getView().getModel("mTeamSeasons");
			var teamStartEndDate = this.getView().byId("addStartEndAndDate");
			var text = evt.getParameter("selectedItem").getText();
			var oData = seasonModel.oData.value;
			oData.forEach(function(ele) {
				if (ele.Name === text) {
				    that.dateObj = ele;
				}
			});
            teamStartEndDate.setMinDate(new Date(that.dateObj.U_StartDate));
            teamStartEndDate.setMaxDate(new Date(that.dateObj.U_EndDate));
		},
		onPressAddCoachTable: function(oEvent) {
			var othat = this;
			var jModel;
			var getContext = this.getContext();
			var filterPosition = "$filter=Name%20eq%20" + "%27" + getContext.Coaches.empType + "%27";
			this.showLoading(true);
			var coachsSAL = new CoachsSAL();
			coachsSAL.fetchEmployeePosition(filterPosition).done(function(getID) {
				coachsSAL.fetchEmployeesPositionInfo(getID).done(function(obj) {
					var coachVal = obj.oData.value;
					var eModel = othat.getView().getModel("createTeamModel");
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
					othat.showLoading(false);
					othat.onOpenCoachDialog();
				}).fail(function(err) {
					othat.showLoading(false);
					othat.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});

			}).fail(function(err) {
				othat.showLoading(false);
				othat.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},

		onOpenCoachDialog: function(oEvent) {
			var othat = this;
			//if (!othat._oDialog) {
			othat._oDialog = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.addCoachTable", this);
			othat._oDialog.setModel(othat.getView().getModel());
			//}
			if (!othat._oDialog.getMultiSelect()) {
				othat._oDialog.setMultiSelect(true);
			}
			othat.getView().addDependent(othat._oDialog);
			othat._oDialog.open();
		},

		destroyDialog: function() {
			/* 			var id = sap.ui.getCore().byId("addCoachTableTeams");
			if (id !== undefined) {
				id.destroy();
			}*/
		},

		onAddCoachToTeam: function(oEvent) {
			var getEle = this.getVariables();
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				var cModel = this.getView().getModel("createTeamModel");
				for (var i = 0; i < aContexts.length; i++) {
					cModel.oData.Coaches.push(aContexts[i].getObject());
				}
				cModel.refresh(true);
			}
			/*	getEle.addTeamName.setValueState("None");
			getEle.addTeamSeason.setValueState("None");
			getEle.addStartEndAndDate.setValueState("None");
			getEle.addSportsCategory.setValueState("None");
			getEle.addSportName.setValueState("None");
			getEle.addTeamLocation.setValueState("None");
			getEle.addTeamClassMin.setValueState("None");
			getEle.addTeamClassMax.setValueState("None");
			getEle.addStartEndAndDate.setValue("");
			getEle.addSportsCategory.setValue("");
			this.destroyDialog();*/
		},

		onDeleteCoachEntry: function(oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext("createTeamModel");
			var mdl = ctx.getModel();
			var mdData = mdl.getData();
			var path = ctx.getPath();
			var index = parseInt(path.substring(path.lastIndexOf('/') + 1));
			mdData.Coaches.splice(index, 1);
			mdl.setData(mdData);
		},

		onPressSaveAddTeams: function() {
			var that = this;
			var getEle = this.getVariables();
			if (getEle.addTeamName.getValue() === "") {
				getEle.addTeamName.setValueState("Error");
			} else if (getEle.addTeamSeason.getValue() === "Select Season" || getEle.addTeamSeason.getValue() === "") {
				getEle.addTeamName.setValueState("None");
				getEle.addTeamSeason.setValueState("Error");
			} else if (getEle.addStartEndAndDate.getValue() === "") {
				getEle.addTeamSeason.setValueState("None");
				getEle.addStartEndAndDate.setValueState("Error");
			} else if (getEle.addSportsCategory.getValue() === "Select Sports Category" || getEle.addSportsCategory.getValue() === "") {
				getEle.addStartEndAndDate.setValueState("None");
				getEle.addSportsCategory.setValueState("Error");
			} else if (getEle.addSportName.getValue() === "Select Sports" || getEle.addSportName.getValue() === "") {
				getEle.addSportsCategory.setValueState("None");
				getEle.addSportName.setValueState("Error");
			} else if (getEle.addTeamLocation.getValue() === "Select Location" || getEle.addTeamLocation.getValue() === "") {
				getEle.addSportName.setValueState("None");
				getEle.addTeamLocation.setValueState("Error");
			} else if (getEle.addTeamClassMin.getValue() === "") {
				getEle.addTeamLocation.setValueState("None");
				getEle.addTeamClassMin.setValueState("Error");
			} else if (getEle.addTeamClassMax.getValue() === "") {
				getEle.addTeamClassMin.setValueState("None");
				getEle.addTeamClassMax.setValueState("Error");
			} else {
				getEle.addTeamName.setValueState("None");
				getEle.addTeamSeason.setValueState("None");
				getEle.addStartEndAndDate.setValueState("None");
				getEle.addSportsCategory.setValueState("None");
				getEle.addSportName.setValueState("None");
				getEle.addTeamLocation.setValueState("None");
				getEle.addTeamClassMin.setValueState("None");
				getEle.addTeamClassMax.setValueState("None");
				var teamMdl = that.getView().getModel("createTeamModel");
				var getFromDate = getEle.addStartEndAndDate.getFrom();
				var getToDate = getEle.addStartEndAndDate.getTo();
				var cStartDate = this.toDateFormat(getFromDate);
				var cEndDate = this.toDateFormat(getToDate);

				try {
					teamMdl.setProperty("/U_StartDate", cStartDate);
					teamMdl.setProperty("/U_EndDate", cEndDate);
				} catch (e) {
					console.log(e.toString());
				}
				var filter = encodeURI("$filter=Name eq '" + teamMdl.oData.Name + "'");

				that.showLoading(true);
				that.fetchTeams(this, filter).done(function(ret) {
					if (ret.oData.value.length <= 0) {
						that.createTeams(teamMdl).done(function(response) {
							var tFilter = "$orderby=Code%20desc";
							that.fetchTeams(this, tFilter).done(function(obj) {
								sap.ui.getCore().setModel(obj, "TeamsList");
								sap.ui.getCore().getModel("TeamsList").refresh(true);
								that.showLoading(false);
								//that.destroyDialog();
								that.createTeamModel();
								var teamdetailsave = that.oBundle("CreatedSuccessfully");
								that.fetchMessageOk("Create Teams", "Success", teamdetailsave, "Teams");
								getEle.addTeamSeason.setValue("Select Season");
								getEle.addSportsCategory.setValue("Select Sports Category");
								getEle.addSportName.setValue("Select Sports");
								getEle.addTeamLocation.setValue("Select Location");
								getEle.addStartEndAndDate.setValue("");
								// Email Notification code
								that.sendNotificationEmail().done(function(res) {
									var body = res.body;
								}).fail(function(err) {
									console.log(err.status + " " + err.statusText);
								});
							}).fail(function(err) {
								that.showLoading(false);
								that.fetchMessageOk("Error", "Error", err.toString(), "Teams");
							});

						}).fail(function(err) {
							that.showLoading(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "Teams");
						});
					} else {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", "Record already exists", "Teams");
					}
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "Teams");
				});
			}
		},

		handleCloseTableDialog: function() {
			// 			this.destroyDialog();
		},

		onPressAddCancel: function() {
			var getTeamId = this.getVariables();
			getTeamId.addTeamName.setValueState("None");
			getTeamId.addTeamSeason.setValueState("None");
			getTeamId.addStartEndAndDate.setValueState("None");
			getTeamId.addSportsCategory.setValueState("None");
			getTeamId.addSportName.setValueState("None");
			getTeamId.addTeamLocation.setValueState("None");
			getTeamId.addTeamClassMin.setValueState("None");
			getTeamId.addTeamClassMax.setValueState("None");
			getTeamId.addTeamName.setValue("");
			getTeamId.addTeamSeason.setSelectedKey("-1");
			getTeamId.addSportsCategory.setSelectedKey("-1");
			getTeamId.addSportName.setSelectedKey("-1");
			getTeamId.addTeamLocation.setSelectedKey("-1");
			getTeamId.addTeamClassMin.setValue("");
			getTeamId.addTeamClassMax.setValue("");
			getTeamId.addTeamStatus.setSelectedKey("Active");
			getTeamId.addStartEndAndDate.setValue("");
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
				addTeamStatus: this.getView().byId("addTeamStatus")
			};
			return items;
		},

		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},

		onExit: function() {
			if (this._oDialog) {
				this._oDialog.destroy(true);
			}
		},
		//Here function for Team table search 
		handleSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("FirstName", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		// Dialog for team calendar
/*		handleCreateCalendarPress: function(evt) {
			var that = this;
			if (!that._oDialog) {
				that._oDialog = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.dialogs.TeamCalendar", that);
				that._oDialog.setModel(that.getView().getModel());
			}

			var tabCalendar = that.getView().byId("tabTeamCalendar");
			var oDRS = that.getView().byId("addStartEndAndDate");
			var teamModel = that.getView().getModel("createTeamModel");

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._oDialog);
			that._oDialog.open();
		},
		handleTimeCalendarClose: function(evt) {
			var that = this;
			that._oDialog.close();
		}*/
	});
});