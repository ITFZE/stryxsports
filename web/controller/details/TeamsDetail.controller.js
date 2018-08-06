sap.ui.define([
    "com/ss/app/StryxSports/controller/sal/LocationsSAL",
    "com/ss/app/StryxSports/controller/sal/SportCategorySAL",
    "com/ss/app/StryxSports/controller/sal/TeamsSAL",
     "com/ss/app/StryxSports/controller/sal/CoachsSAL",
     "com/ss/app/StryxSports/controller/sal/SeasonSAL",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/core/ValueState"
    ],
	function(LocationsSAL, SportCategorySAL, TeamsSAL, CoachsSAL, SeasonSAL, JSONModel, ValueState) {
		"use strict";
		return TeamsSAL.extend("com.ss.app.StryxSports.controller.details.TeamsDetail", {
			onInit: function() {
				var oRouter = this.getRouter();
				this._getTeamId = "";
				this._getSeleTeamID = "";
				this._getAccountID = "";
				this._getPageID = "";
				this._setViewLevel = "";
				this._lastSegment = "";
				oRouter.getRoute("TeamsDetail").attachMatched(this._onRouteMatched, this);
				oRouter.getRoute("GoToTeamsDetail").attachMatched(this._onRouteTeamsDetailsMatched, this);
				oRouter.getRoute("DashBoard").attachMatched(this._onRouteMatched, this);
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
				sap.ui.getCore().attachValidationError(function(oEvent) {
					oEvent.getParameter("element").setValueState(ValueState.Error);
				});
				sap.ui.getCore().attachValidationSuccess(function(oEvent) {
					oEvent.getParameter("element").setValueState(ValueState.None);
				});
			},
			_onRouteMatched: function(oEvent) {
				this._getPageID = oEvent.getParameter("arguments").PageID;
				this._getSeleTeamID = oEvent.getParameter("arguments").teamID;
				var getEle = oEvent.getParameters();
				this._setViewLevel = getEle.config.viewLevel;
				var that = this;
				that.clearModel();
				$.when(that.fetchLocations()).then(function() {
					$.when(that.fetchTeamsListwithallitems()).then(function() {
						$.when(that.fetchTeamsList()).then(function() {
							that.showLoading(false);
							return;
						});
					});
				});
			},
			_onRouteTeamsDetailsMatched: function(oEvent) {
				this._getPageID = oEvent.getParameter("arguments").PageID;
				this._getAccountID = oEvent.getParameter("arguments").AccountId;
				this._getTeamId = oEvent.getParameter("arguments").TeamID;
				var getEle = oEvent.getParameters();
				this._setViewLevel = getEle.config.viewLevel;
				var that = this;
				that.clearModel();
				$.when(that.fetchLocations()).then(function() {
					/*	$.when(that.fetchTeamCode()).then(function() {
						$.when(that.fetchTeamsList()).then(function() {
							that.showLoading(false);
							return;
						});
					});*/
				});
				that.fetchTeamsLists();

			},
			createTeamModel: function() {
				var teamModel = new JSONModel();
				teamModel.setProperty('/Code', 0);
				teamModel.setProperty('/Name');
				teamModel.setProperty('/U_CategorySports');
				teamModel.setProperty('/U_Location');
				teamModel.setProperty('/U_Status', 1);
				teamModel.setProperty('/Coaches', []);
				this.getView().setModel(teamModel, "createTeamModel");
			},

			fetchLocations: function() {
				var that = this;
				var selLoc = that.getView().byId("addTeamLocation");
				that.showLoading(true);
				var locSAL = new LocationsSAL();
				selLoc.setBusy(true);
				locSAL.fetchLocationsMasters(that).done(function(obj) {
					sap.ui.getCore().setModel(obj, "mTeamLocations");
					var oItem = new sap.ui.core.Item({
						text: "Select The  Location",
						key: -1
					});
					selLoc.insertItem(oItem, 0);
					selLoc.setSelectedItem(oItem);
					selLoc.setBusy(false);
					//that.getView().byId("addTeamLocation").setValueState("None");
				}).fail(function(err) {
					that.getView().setBusy(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
				that.setSelBusy("Team", false);
			},

			setSelBusy: function(getName, getValue) {
				var getVariables = this.getVariables();
				var oItem = new sap.ui.core.Item({
					text: "Select The " + getName,
					key: -1
				});
				switch (getName) {
					case "Team":
						getVariables.addTeamName.insertItem(oItem, 0);
						getVariables.addTeamName.setSelectedItem(oItem);
						getVariables.addTeamName.setBusy(getValue);
						break;
					case "Location":
						getVariables.addTeamLocation.setBusy(getValue);
						getVariables.addTeamLocation.insertItem(oItem, 0);
						getVariables.addTeamLocation.setSelectedItem(oItem);
						getVariables.addTeamLocation.setBusy(getValue);
						break;
					default:
				}
			},
			fetchTeamCode: function() {
				var that = this;
				var setTeam = that.getView().byId("addTeamName");
				var getEle = this.getVariables();
				var filter = "$orderby=Code%20desc";
				this.fetchTeams(that, filter).done(function(getID) {
					if (getID.oData.value.length > 0) {
						//that._getSeleTeamID = getID.oData.value.Code;
						that._getTeamId = getID.oData.value.Code;
						setTeam.setValue(getID.oData.value[0].Name);
						getEle.addTeamName.setValue(getID.oData.value.Name);
						getEle.addTeamName.setSelectedKey(that._getSeleTeamID, "mTeamName");
						that.getView().setModel(getID, "mTeamName");
						that.fetchTeamsByIdDetails(that._getSeleTeamID);
					}
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			},
			fetchTeamsListwithallitems: function() {
				var that = this;
				var getEle = this.getVariables();
				var setTeam = that.getView().byId("addTeamName");
				that.showLoading(false);
				var filter = "$orderby=Code%20desc";
				setTeam.setBusy(true);
				this.fetchTeams(that, filter).done(function(obj) {
					if (obj.oData.value.length > 0) {
						that._getSeleTeamID = obj.oData.value[0].Code;
						setTeam.setValue(obj.oData.value[0].Name);
						that.getView().setModel(obj, "mTeamName");
						getEle.addTeamName.setEnabled(true);
						// 		var oItem = new sap.ui.core.Item({
						// 			//text: "Test Vinoth 002",
						// 			//key: -1
						// 		});
						getEle.addTeamName.setSelectedKey(that._getSeleTeamID, 0);
						//setTeam.setSelectedItem(that._getSeleTeamID);
						setTeam.setBusy(false);
						that.fetchTeamsByIdDetails(that._getSeleTeamID);
					}
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			},
			fetchTeamsList: function(getID) {
				var that = this;
				var getEle = this.getVariables();
				var setTeam = that.getView().byId("addTeamName");
				that.showLoading(false);
				var filter = encodeURI("$filter=U_Location eq '" + getID + "'");
				that.setSelBusy("Team", false);
				this.fetchTeams(that, filter).done(function(obj) {
					if (obj.oData.value.length > 0) {
						that._getSeleTeamID = obj.oData.value[0].Code;
						setTeam.setValue(obj.oData.value[0].Name);
						that.getView().setModel(obj, "mTeamName");
						//that.setSelBusy("Team", false);
						getEle.addTeamName.setSelectedKey(that._getSeleTeamID);
						that.getView().byId("addTeamName").setValueState("None");
						that.fetchTeamsByIdDetails(that._getSeleTeamID);
					}
				}).fail(function(err) {
					that.getView().setBusy(true);
					//	that.setSelBusy("Team", false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			},
			getVariables: function() {
				var items = {
					addTeamName: this.getView().byId("addTeamName"),
					addTeamLocation: this.getView().byId("addTeamLocation"),
					addTeamStatus: this.getView().byId("addTeamStatus")
				};
				return items;
			},
			onGetTeamDetailsList: function() {
				this._getSeleTeamID = this.getView().byId("addTeamName").getSelectedKey();
				var selteam = this.getView().byId("addTeamName").getSelectedItem();
				if (selteam !== null) {
					this.fetchTeamsByIdDetails(this._getSeleTeamID);
					this.fetchMemberName(this._getSeleTeamID);
				}
				if (!selteam) {
					var msg = "Please Select One of The Values";
					this.MessageToastShow(msg);
				}
			},
			fetchTeamsByIdDetails: function(getteamID) {
				var that = this;
				var objectPage = that.getView().byId("newTeamObjectPageLayout");
				objectPage.setBusy(true);

				//this.showLoading(true);
				this.fetchTeamsById("", getteamID).done(function(res) {
					var getSeasonCode = res.oData.U_Season;
					that.getView().setModel(res, "TeamsDetails");
					objectPage.setBusy(false);
					that.fetchMemberName(getteamID);
					if (getSeasonCode !== "") {
						that.fetchSeasonDetailsById(getSeasonCode);
					}
				}).fail(function(err) {
					that.showLoading(false);
					objectPage.setBusy(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			},

			onBack: function() {
				var getPagesID = this._getPageID;
				switch (getPagesID) {
					case "50":
						this.getOwnerComponent().getRouter()
							.navTo("EditLead", {
								LeadID: this._getAccountID,
								PageID: 61
							});
						break;
					case "61":
						this.getOwnerComponent().getRouter()
							.navTo("ViewLead", {
								LeadID: this._getAccountID,
								PageID: 49
							});
						break;
					case "49":
						this.getOwnerComponent().getRouter().navTo("Leads");
						break;
					case "62":
						this.getOwnerComponent().getRouter().navTo("ViewAccount", {
							AccountId: this._getAccountID,
							PageID: 27
						});
						break;
					case "27":
						this.getOwnerComponent().getRouter().navTo("SearchMembership");
						break;

					case "55":
						this.getOwnerComponent().getRouter().navTo("ViewLead", {
							AccountId: this._getAccountID,
							PageID: 49
						});
						break;

					default:
					this.getOwnerComponent().getRouter().navTo("DashBoard");
						break;
				}
			},

			//Here API for season by id
			fetchMemberName: function(getTeamID) {
				var that = this;
				var tFilterCardType = encodeURI("$filter=CardType eq 'cLid' and (" +
					")&$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress");
				this.fetchMember(getTeamID, tFilterCardType).done(function(obj) {
					sap.ui.getCore().setModel(obj, "MembersList");
					that.showLoading(false);
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			},
			onGetTeamName: function() {
				var getEle = this.getVariables();
				var getlocationvalue = getEle.addTeamLocation;
				if (getlocationvalue.getSelectedKey() !== "-1" && getlocationvalue.getValue() !== "") {
					this.setSelBusy("Team", true);
					var getselectionkey = getlocationvalue.getSelectedKey();
					this.fetchTeamsList(getselectionkey);
					getlocationvalue.setValueState("None");
					getEle.addTeamName.setEnabled(true);
				} else if (getlocationvalue.getSelectedKey() === "-1") {
					getlocationvalue.setValueState("Error");
					getEle.addTeamName.setEnabled(false);
				}

			},
			fetchSeasonDetailsById: function(getSeasonID) {
				var that = this;
				var seassal = new SeasonSAL();
				seassal.fetchSeasonById("", getSeasonID).done(function(obj) {
					that.getView().setModel(obj, "SeasonDetails");
					that.showLoading(false);
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			},
			clearModel: function() {
				var getEle = this.getVariables();
				getEle.addTeamName.setValueState("None");
				var newJMDL = new JSONModel();
				this.getView().setModel(newJMDL, "mTeamName");
				this.setSelBusy("Team", true);
				this.fetchLocations();
			},
			onPressViewAccount: function(evt) {
				var oItem, oCtx;
				oItem = evt.getSource();
				oCtx = oItem.getBindingContext("MembersList");
				this.getOwnerComponent().getRouter()
					.navTo("ViewAccount", {
						AccountId: oCtx.getProperty("BusinessPartners").CardCode,
						PageID: this._setViewLevel
					});
			},
			OnPressEditLead: function() {
				var getTeamID = this._getSeleTeamID;
				var getPagesID = this._getPageID;
				if (getPagesID === "62") {
					this.getOwnerComponent().getRouter()
						.navTo("EditTeamDetail", {
							TeamID: this._getTeamId,
							PageID: this._setViewLevel,
							AccountId: this._getAccountID
						});

				} else {
					this.getOwnerComponent().getRouter()
						.navTo("EditTeam", {
							teamID: getTeamID
						});
				}
			},
			fetchTeamsLists: function() {
				var that = this;
				var getEle = this.getVariables();
				that.showLoading(false);
				var filter = "";
				that.setSelBusy("Team", false);
				this.fetchTeams(that, filter).done(function(obj) {
					if (obj.oData.value.length > 0) {
						that.getView().setModel(obj, "mTeamName");
						getEle.addTeamName.setSelectedKey(that._getTeamId);
						that.getView().byId("addTeamName").setValueState("None");
						that.fetchTeamsByIdDetails(that._getTeamId);
					}
				}).fail(function(err) {
					that.getView().setBusy(true);
					//	that.setSelBusy("Team", false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			}
		});

	});