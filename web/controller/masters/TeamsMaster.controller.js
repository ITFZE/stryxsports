sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/TeamsSAL",
			"sap/ui/model/Filter"
], function(TeamsSAL, Filter) {
	"use strict";
	var getTitleDialog = null;
	return TeamsSAL.extend("com.ss.app.StryxSports.controller.masters.TeamsMaster", {
		onInit: function() {
			this._pageID = "";
			this._AccountID = "";
			var oRouter = this.getRouter();
			oRouter.getRoute("Teams").attachMatched(this._onRouteMatched, this);
			oRouter.getRoute("ViewTeams").attachMatched(this._onRouteViewTeamsMatched, this);
			oRouter.getRoute("EditTeamDetail").attachMatched(this._onRouteEditTeamDetailMatched, this);
		},
		_onRouteMatched: function(oEvt) {
			this._pageID = oEvt.getParameter("arguments").PageID;
			this._AccountID = oEvt.getParameter("arguments").AccountId;
		},
		_onRouteViewTeamsMatched: function(oEvent) {
			this._getPageID = oEvent.getParameter("arguments").PageID;
			this._getAccountId = oEvent.getParameter("arguments").AccountId;
		},
		refreshModel: function() {
			this.getView().getModel("TeamsList").refresh(true);
		},
		_onRouteEditTeamDetailMatched: function(oEvent) {
			this._pageID = oEvent.getParameter("arguments").PageID;
			this._getTeamID = oEvent.getParameter("arguments").TeamID;
			this._getAccountID = oEvent.getParameter("arguments").AccountId;
		},

		// 		onBack : function(){
		// 		  var getPagesID = this._pageID ;
		// 			switch (getPagesID) {
		// 		    case "65":
		// 		        this.getOwnerComponent().getRouter().navTo("TeamsDetail");
		// 		        break;  
		// 		        	case "27":
		// 					this.getOwnerComponent().getRouter().navTo("SearchMembership");
		// 					break;
		// 			}  
		// 		},
		setFilterTitle: null,
		setFilterName: "Name",
		onBeforeRendering: function() {
			if (sap.ui.getCore().getModel("TeamsList") === null || sap.ui.getCore().getModel("TeamsList") === undefined) {
				this.getView().setBusy(true);
				var tFilter = "$orderby=Code%20desc";
				this.fetchTeamsList(tFilter);
			}
		},
		fetchTeamsList: function(tFilter) {
			var that = this;
			var teamsSAL = new TeamsSAL();
			teamsSAL.fetchTeams(this, tFilter).done(function(obj) {
				sap.ui.getCore().setModel(obj, "TeamsList");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		onPressAddTeams: function() {
			this.getOwnerComponent().getRouter().navTo("TeamDetails");
		},
		onPressTeamMastersList: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("TeamsList");
			this.getOwnerComponent().getRouter()
				.navTo("EditTeam", {
					teamID: oCtx.getProperty("Code")
				});
		},
		//Here Function for Filter Open
		onPressFilterTeams: function() {
			if (!this._DialogAddTeams) {
				this._DialogAddTeams = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fTeams",
					this);
			}
			//this._DialogAddTeams.setModel(this.getView().getModel());
			var getBaseModel = this.getView().getModel("BaseModel");
			this._DialogAddTeams.setModel(getBaseModel, "TeamsFilter");
			this._DialogAddTeams.open();
		},
		//Here Function for Filter Confirem
		onPressTeamsFilter: function() {
			var searchTeamsMaster = this.getVariablesMaster();
			searchTeamsMaster.searchField.setPlaceholder("Please Enter The " + getTitleDialog);
			this._DialogAddTeams.close();
		},
		//Here function for Filter Close
		dialogTeamsCloseFilter: function() {
			this._DialogAddTeams.close();
		},
		getViewonTeams: function(oEvent) {
			var btn = sap.ui.getCore().byId("confirmTeamsfilter");
			var items = oEvent.getParameter("listItem");
			getTitleDialog = items.getTitle();
			btn.setVisible(true);
		},

		onNavBackTeam: function() {
			var getDetailsVariables = this.getView().byId("searchTeamsMaster");
			getDetailsVariables.setValue("");
			this.getOwnerComponent().getRouter().navTo("DashBoard");
		},

		/*		onTeamsLiveChange: function(oEvt) {
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery.length === 0) {
				var oModel = this.getView().getModel("TeamsList");
			} else {
				this.onSearchTeams(oEvt);
			}
			var list = this.getView().byId("TeamsMasterList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},*/
		onSearchTeams: function(oEvt) {
			var aFilters = [];
			var filter;
			var oModel = this.getView().getModel("TeamsList");
			var sQuery = oEvt.getSource().getValue();
			switch (getTitleDialog) {
				case "Team Name":
					filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
				case "Start Date":
					filter = new Filter("U_StartDate", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
				case "End Date":
					filter = new Filter("U_EndDate", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
				default:
					filter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery);
					break;
			}
			aFilters.push(filter);
			var list = this.getView().byId("TeamsMasterList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		getVariablesMaster: function() {
			var teamsMaster = {
				teamsMasterList: this.getView().byId("TeamsMasterList"),
				searchField: this.getView().byId("searchTeamsMaster")
			};
			return teamsMaster;
		},
		onBack: function() {
			var searchFilter = this.getView().byId("searchTeamsMaster");
			var getPageID = this._pageID;
			switch (getPageID) {
				case "62":
					//searchFilter.setValue("");
					this.getOwnerComponent().getRouter()
						.navTo("ViewAccount", {
							AccountId: this._AccountID,
							PageID: 62
						});
					break;
				case "67":
					this.getOwnerComponent().getRouter().navTo("GoToTeamsDetail", {
						TeamID:	this._getTeamID,
						AccountId: this._getAccountID,
						PageID: 62
					});
					break;

				default:
					this.getOwnerComponent().getRouter().navTo("DashBoard");
					break;

			}
		}

	});
});