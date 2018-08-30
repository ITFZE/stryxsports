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
			
		},
		onAfterRendering: function() {
			this.afRender = true;
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
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
			// 	var getEle = this.getVariables();
			// 	getEle.addStartEndAndDate.setValue("");
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

		onPressSaveEditTeams: function() {
			var setThis = this;
			var getEle = setThis.getVariables();
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
				getEle.addTeamClassMax.setValueState("None");
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
						setThis.fetchMessageOk("Edit Team", "Success", Eteamsave, "Teams");
					}).fail(function(err) {
						setThis.showLoading(false);
						setThis.fetchMessageOk("Error", "Error", err.toString(), "Teams");
					});
				}).fail(function(err) {
					setThis.showLoading(false);
					setThis.fetchMessageOk("Error", "Error", err.toString(), "Teams");
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
				default:
			}
		},
		//Here function for Team table search 
		handleSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("FirstName", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		}

	});
});