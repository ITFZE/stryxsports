sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/UserProfileSAL",
		"sap/ui/model/Filter"
], function(UserProfileSAL, Filter) {
	"use strict";
	var getTitleDialog = null;
	return UserProfileSAL.extend("com.ss.app.StryxSports.controller.masters.UserManagementMaster", {
		onInit: function() {
		   
		},
		_onRouteMatched: function() {},
		onListItemPressCoachesList: function(evt) {
			var oItem, oCtx;
			oItem = evt.getSource();
			oCtx = oItem.getBindingContext("UserManagement");
			this.getOwnerComponent().getRouter()
				.navTo("UserManagementDetail", {
					EmployeeID: oCtx.getProperty("EmployeeID")
				});
		},
		onBeforeRendering: function() {
			if (sap.ui.getCore().getModel("UserManagement") === null || sap.ui.getCore().getModel("UserManagement") === undefined) {
				this.getView().setBusy(true);
				var filterPosition = "$orderby=Code%20desc";
				this.fetchEmployeeDetail(filterPosition);
			}
		},
		/////Here Fetch API
		fetchEmployeeDetail: function(filterPosition) {
			var setThis = this;
			var userSAL = new UserProfileSAL();
			userSAL.fetchUserMangementEmployeeMaster().done(function(getResponse) {
				sap.ui.getCore().setModel(getResponse, "UserManagement");
				setThis.showLoading(false);

			}).fail(function(err) {
				setThis.showLoading(false);
				setThis.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		getVariables: function() {
			var items = {
				sportsMasterList: this.getView().byId("listUserManagementMaster"),
				searchField: this.getView().byId("searchUserManagement")
			};
			return items;
		},
		//Here function for filter
		onPressAddFilter: function() {
			if (!this._DialogAddCoach) {
				this._DialogAddCoach = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fUserManagement",
					this);
			}
			var getBaseModel = this.getView().getModel("BaseModel");
			this._DialogAddCoach.setModel(getBaseModel, "UserFilter");
			this._DialogAddCoach.open();
		},
		onNavBackUser : function () {
		    	var getDetailsVariables = this.getView().byId("searchUserManagement");
		  		getDetailsVariables.setValue("");
		  		this.getOwnerComponent().getRouter().navTo("DashBoard");
		},
		onPressDialogClose: function() {
			this._DialogAddCoach.close();
		},
		//Here function for Coach Filter Frgaments
		getViewonCoachs: function(oEvent) {
			var btn = sap.ui.getCore().byId("confirmDialogUserBtn");
			var items = oEvent.getParameter("listItem");
			getTitleDialog = items.getTitle();
			btn.setVisible(true);
		},
		//Here filter Confirm button
		onPressFilterConfirm: function() {
			var coachSearchFiled = this.getVariables();
			coachSearchFiled.searchField.setPlaceholder("Please Enter The " + getTitleDialog);
			this._DialogAddCoach.close();
		},
		/////Here function for Filter Search Filed Master Page
/*		onUserLiveChange : function(oEvt){
		    var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery.length === 0) {
				var oModel = this.getView().getModel("UserManagement");
			} 
			else {
				this.onSearchCoachesListMasterPage(oEvt);
			}
			var list = this.getView().byId("listUserManagementMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},*/
		onSearchCoachesListMasterPage: function(oEvt) {
			var aFilters = [];
			var filter;
			var oModel = this.getView().getModel("UserManagement");
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				switch (getTitleDialog) {
					case "User First Name":
						filter = new Filter("FirstName", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "User Last Name":
						filter = new Filter("LastName", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "User Email":
						filter = new Filter("eMail", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					case "Contact Number":
						filter = new Filter("MobilePhone", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
					default:
						filter = new Filter("FirstName", sap.ui.model.FilterOperator.Contains, sQuery);
						break;
				}
				aFilters.push(filter);
			}
			var list = this.getView().byId("listUserManagementMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		}

	});
});