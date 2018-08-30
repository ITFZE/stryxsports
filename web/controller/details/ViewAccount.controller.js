sap.ui.define([
	'sap/m/MessageToast',
	"com/ss/app/StryxSports/controller/sal/ViewAccountSAL",
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/Filter',
	'sap/m/MessageBox',
 "com/ss/app/StryxSports/controller/sal/TeamsSAL",
	  'sap/m/Button',
     'sap/m/Dialog',
	 'sap/m/Text'
], function(MessageToast, ViewAccountSAL, JSONModel, Filter, MessageBox, TeamsSAL, Button, Dialog, Text) {
	"use strict";

	return ViewAccountSAL.extend("com.ss.app.StryxSports.controller.details.ViewAccount", {
		onInit: function() {
			var oRouter = this.getRouter();
			this._activityCode = "";
			this._getSeleTeamID = "";
			this._getPageID = "";
			this._pageID = "";
			this._getAccountID = "";
			this._setViewLevel = "";
			this.sModel = "";
			this._opsServices = this.byId("serviceObjectPage");
			this._opsTeams = this.byId("opsTeams");
			oRouter.getRoute("ViewAccount").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		onBeforeRendering: function() {},
		_onRouteMatched: function(oEvent) {
			this._pageID = oEvent.getParameter("arguments").PageID;
			let that = this;
			that.showLoading(true);
			var getEle = oEvent.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			this._getAccountID = oEvent.getParameter("arguments").AccountId;
			this._getSeleTeamID = oEvent.getParameter("arguments").teamID;
			$.when(that.fetchAccountDetails(that._getAccountID, that._getSeleTeamID)).then(function() {
				that.fetchOrdersDetails(that._getAccountID);
				that.fetchActivitiesDetails(that._getAccountID);
				that.fetchInvoiceDetails(that._getAccountID);
				//that.fetchMemberSchedule();
				that.fetchTeamDetails(that._getAccountID, that._getSeleTeamID);
			});
			/*$.when(that.fetchAccountDetails(that._getAccountID)).then(function() {
				$.when(that.fetchOrdersDetails(that._getAccountID)).then(function() {
					$.when(that.fetchActivitiesDetails(that._getAccountID)).then(function() {
						$.when(that.fetchInvoiceDetails(that._getAccountID)).then(function() {
							$.when(that.fetchTeamDetails(that._getAccountID)).then(function() {
								return;
							});
						});
					});
				});
			});*/
		},
		onPressVATimelinePost: function(oEvt) {
			let that = this;
			that._activityCode = oEvt.getParameters().selectedItem.mProperties.text;
			that.getView().byId("timelineVAEditActBtn").setVisible(true);
		},
		onPressVAActEditBtn: function() {
			var that = this;
			that.getOwnerComponent().getRouter()
				.navTo("EditActivity", {
					ActivityID: that._activityCode,
					PageID: this._setViewLevel
				});
		},
		///Here Leads Table Details
		fetchAccountDetails: function(ViewAccountId) {
			let that = this;
			this.fetchLeadDetails(ViewAccountId).done(function(response) {
				that.showLoading(false);
				var mLeadDetails = new JSONModel();
				mLeadDetails.setData(response);
				that.getView().setModel(mLeadDetails, "mLeadDetails");
				that.updateStatusPersonalInfo();
				that.upDateStatus(response);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		///Here Activitys Table Details
		fetchActivitiesDetails: function(ViewAccountId) {
			let that = this;
			var acFilter = "$filter=CardCode%20eq%20'" + ViewAccountId + "'||$expand=ActivityType,EmployeeInfo,BusinessPartner" +
				"||$inlinecount=allpages";
			this.fetchActivities(ViewAccountId, acFilter).done(function(response) {
				var mActivities = new JSONModel();
				mActivities.setData(response);
				that.getView().setModel(mActivities, "mActivities");
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		///Here Invoice Table Details
		fetchInvoiceDetails: function(ViewAccountId) {
			let that = this;
			var filter = encodeURI("$filter=CardCode eq '" + ViewAccountId + "'");
			this.fetchInvoice(filter).done(function(response) {
				var mInvoice = new JSONModel();
				mInvoice.setData(response);
				that.getView().setModel(mInvoice, "mInvoice");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},

		navToTeamDetails: function(oEvent) {
			var oItem, oCtx;
			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext("TeamsDetails");
			this.getOwnerComponent().getRouter().navTo("GoToTeamsDetail", {
				TeamID: oCtx.getProperty("U_SS_TEAMS").Code,
				AccountId: this._getAccountID,
				PageID: this._setViewLevel
			});
		},

		onNavBackPress: function() {
			var getPagesID = this._pageID;
			switch (getPagesID) {
				case "65":
					this.getOwnerComponent().getRouter().navTo("TeamsDetail");
					break;
				case "27":
					this.getOwnerComponent().getRouter().navTo("SearchMembership");
					break;
					//this.getRouter().navTo("SearchMembership");
			}
		},
		OnPressEditAccount: function() {
			var getAccountId = this._getAccountID;
			this.getOwnerComponent().getRouter()
				.navTo("MembershipNewEdit", {
					AccountId: getAccountId,
					PageID: this._setViewLevel
				});
		},
		onPressSelectServiceView: function() {
			this.getOwnerComponent().getRouter()
				.navTo("SelectServices", {
					AccountId: this._getAccountID,
					PageID: this._setViewLevel
				});
		},
		onPressInvocieView: function() {
			var getAccountId = this._getAccountID;
			this.getOwnerComponent().getRouter()
				.navTo("CreateInvoice", {
					DocEntryID: getAccountId,
					PageID: this._setViewLevel
				});
		},
		onPressActivityView: function() {
			this.getOwnerComponent().getRouter()
				.navTo("CreateActivity", {
					LeadID: this._getAccountID,
					PageID: this._setViewLevel
				});
		},
		fetchOrdersDetails: function(getID) {
			var that = this;
			that._opsServices.setBusy(true);
			var filter = encodeURI(
				"$expand=Orders($select=DocEntry,Comments,DocNum,CardCode,CardName,DocCurrency,CreationDate,VatSum,DocTotalSys)||$filter=Orders/DocEntry eq U_SS_MEM_SERVICES/U_SalesOrderID and U_SS_MEM_SERVICES/U_CardCode eq '" +
				getID + "'||$select=U_Status,U_InvoiceID");
			//var filter = encodeURI("$expand=Orders($select=DocEntry,Comments,DocNum,CardCode,CardName,DocCurrency,CreationDate,VatSum,DocTotalSys),Orders/DocumentLines($select=ItemCode,ItemDescription)||$filter=Orders/DocEntry eq U_SS_MEM_SERVICES/U_SalesOrderID and Orders/DocEntry eq Orders/DocumentLines/DocEntry and U_SS_MEM_SERVICES/U_CardCode eq'"+	getID + "'||$select=U_Status,U_InvoiceID");
			this.fetchOrderDetails(filter).done(function(response) {
				that._opsServices.setBusy(false);
				that.getView().setModel(response, "OrderDetails");
			}).fail(function(err) {
				that._opsServices.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		navTOCreateInvoice: function(oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext("OrderDetails");
			var mdl = ctx.getModel();
			var path = ctx.getPath();
			var data = mdl.getProperty(path);
			var getStatus = data.U_SS_MEM_SERVICES.U_Status;
			var getInvoiceID = data.U_SS_MEM_SERVICES.U_InvoiceID;
			var getPageID = this._setViewLevel;
			switch (getStatus) {
				case "1":
					this.getOwnerComponent().getRouter()
						.navTo("CreateInvoice", {
							DocEntryID: data.Orders.DocEntry,
							PageID: getPageID
						});
					break;
				case "2":
					this.getOwnerComponent().getRouter()
						.navTo("NewPayment", {
							InvoiceID: getInvoiceID,
							PageID: getPageID
						});
					break;
				case "3":
					this.getOwnerComponent().getRouter()
						.navTo("ViewInvoice", {
							DocEntryID: getInvoiceID,
							PageID: getPageID
						});
					break;
				default:
					break;
			}
			/*	
			this.getOwnerComponent().getRouter()
				.navTo("CreateInvoice", {
					DocEntryID: data.Orders.DocEntry,
					PageID: getPageID
				});*/

		},
		upDateStatus: function(getResponse) {
			var emgPanle = this.getView().byId("viewAccountEmgPanel");
			var emergencyLabel = this.getView().byId("emergencyContailLabel");
			var getFirstValueMbl = getResponse.ContactEmployees[0].MobilePhone;
			var getFirstValueName = getResponse.ContactEmployees[0].Name;
			var getSecondValueMbl = getResponse.ContactEmployees[1].MobilePhone;
			var getSecondValueName = getResponse.ContactEmployees[1].Name;
			var geThirdValueMbl = getResponse.ContactEmployees[2].MobilePhone;
			var getThirdValueName = getResponse.ContactEmployees[2].Name;
			if (getFirstValueMbl === "" && getFirstValueName === "") {
				emgPanle.setVisible(false);
				emergencyLabel.setVisible(false);
			} else if (!(getFirstValueMbl && getFirstValueName) === "") {
				emergencyLabel.setVisible(true);
				emgPanle.setVisible(true);
			} else if (getSecondValueMbl === "" && getSecondValueName === "") {
				emergencyLabel.setVisible(false);
				emgPanle.setVisible(false);
			} else if (!(getSecondValueMbl && getSecondValueName) === "") {
				emergencyLabel.setVisible(true);
				emgPanle.setVisible(true);
			} else if (geThirdValueMbl === "" && getThirdValueName === "") {
				emergencyLabel.setVisible(false);
				emgPanle.setVisible(false);
			} else if (!(geThirdValueMbl && getThirdValueName) === "") {
				emergencyLabel.setVisible(true);
				emgPanle.setVisible(true);
			} else {
				emergencyLabel.setVisible(true);
				emgPanle.setVisible(true);
			}
		},
		fetchTeamDetails: function(getID) {
			var that = this;
			var teamPanel = that.getView().byId("opsTeams").setBusy(true);
			var filter = encodeURI(
				"$filter=U_SS_SERVICE_ITEM/U_MemOrderID eq U_SS_MEM_SERVICES/U_SalesOrderID and U_SS_SERVICE_ITEM/U_TeamID eq U_SS_TEAMS/Code and U_SS_SERVICE_ITEM/U_TeamID ne null and U_SS_MEM_SERVICES/U_CardCode eq '" +
				getID + "' ||$apply=groupby((U_SS_TEAMS/Code,U_SS_TEAMS/Name,U_SS_TEAMS/U_StartDate,U_SS_TEAMS/U_EndDate))");
			this.fetchTeamsDetails(filter).done(function(response) {
				that.getView().setModel(response, "TeamsDetails");
				teamPanel.setBusy(false);
			}).fail(function(err) {
				teamPanel.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		// 		navToTeamDetails: function(oEvent) {
		// 			var src = oEvent.getSource();
		// 			var ctx = src.getBindingContext("TeamsDetails");
		// 			var mdl = ctx.getModel();
		// 			var path = ctx.getPath();
		// 			var data = mdl.getProperty(path);

		// 		},

		/*		navToTeams: function() {
			this.getOwnerComponent().getRouter().navTo("ViewTeams", {
				PageID: 62,
				AccountId: this._getAccountID
			});
		},*/
		updateStatusPersonalInfo: function() {
			var getModleId = this.getView().getModel("mLeadDetails");
			var noRecordId = this.getView().byId("adultInfoBRow");
			var infoPersonalId = this.getView().byId("personalBloclOut");
			var getFather = this.getView().byId("blcFather");
			var getMother = this.getView().byId("blcMother");
			var getGuardian = this.getView().byId("blcGuardian");
			var getDatas = getModleId.getData();
			if (getDatas.U_SS_MEMBER_TYPE !== "") {
				var getSeleGet = getDatas.U_SS_MEMBER_TYPE;
				switch (getSeleGet) {
					case "1":
						// Child
						infoPersonalId.setVisible(true);
						noRecordId.setVisible(false);
						break;
					case "2":
						// Adult
						noRecordId.setVisible(true);
						infoPersonalId.setVisible(false);
						break;
					default:
				}

			}
			if (getDatas.U_Father === "" || getDatas.U_Father === null) {
				getFather.setVisible(false);
			} else {
				getFather.setVisible(true);
			}
			if (getDatas.U_Gardian === "" || getDatas.U_Father === null) {
				getGuardian.setVisible(false);
			} else {
				getGuardian.setVisible(true);
			}
			if (getDatas.U_Mother === "" || getDatas.U_Mother === null) {
				getMother.setVisible(false);
			} else {
				getMother.setVisible(true);
			}
		},
		onPressTimelinePost: function(oEvt) {
			let that = this;
			that._activityCode = oEvt.getParameters().selectedItem.mProperties.text;
			that.getView().byId("timelineEditActBtn").setVisible(true);
		},
		onPressActEditBtn: function() {
			var that = this;
			that.getOwnerComponent().getRouter()
				.navTo("EditActivity", {
					ActivityID: that._activityCode,
					PageID: this._setViewLevel
				});
		},

		//Here fetch Member calendar
		fetchMemberSchedule: function() {
			var that = this;
			var mdl = new JSONModel();
			//var viewModel = that.getView().getModel("createSchedule");
			this.fecthMemberCalendar(mdl).done(function(response) {
				that.getView().setModel(response, "memberCalendar");
			}).fail(function(err) {
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		onPressViewCalendar: function() {
			var that = this;
			that.getRouter().navTo("ViewCalendar");
		},
		btnPressCreateCalTabDialogClose: function() {
			this._oSchDialog.close();
		},
		createModelMemCalendar: function() {
			var setJSONMemCalendarMD = new JSONModel();
			setJSONMemCalendarMD.setProperty('/value', []);
			return setJSONMemCalendarMD;

		},
		handleCreateSchedule: function() {
			var that = this;
			//	sap.ui.getCore().getModel("CreateTeamCalendarsList");
			var schBusy = sap.ui.getCore().byId("createSchId").setBusy(true);
			var getCalendarMDL = that.getView().getModel("viewCalendarModel");
			var oTable = sap.ui.getCore().byId("createScheduleFragment").getSelectedItems();
			if (getCalendarMDL === null || getCalendarMDL === undefined) {
				var createMemCalendarMDL = this.createModelMemCalendar();
				this.getView().setModel(createMemCalendarMDL, "viewCalendarModel");
				getCalendarMDL = this.getView().getModel("viewCalendarModel");
			}
			var getMDLData = getCalendarMDL.getData();
			if (oTable && oTable.length) {
				oTable.forEach(function(oCtx) {
					var obj = {};
					obj.Code = 0;
					obj.U_MemberId = that._getAccountID;
					obj.Name = oCtx.oBindingContexts.teamCalendarsList.getProperty("Name");
					obj.U_SchStatus = "1";
					obj.U_Days = oCtx.oBindingContexts.teamCalendarsList.getProperty("U_Days");
					obj.U_StartTime = oCtx.oBindingContexts.teamCalendarsList.getProperty("StartTime");
					obj.U_EndTime = oCtx.oBindingContexts.teamCalendarsList.getProperty("EndTime");
					obj.U_TeamId = oCtx.oBindingContexts.teamCalendarsList.getProperty("U_TeamId");
					getMDLData.value.push(obj);
				});
			}
			getCalendarMDL.setData(getMDLData);
			getCalendarMDL.refresh(true);
			this.fecthMemberCalendar(getCalendarMDL).done(function() {
			     schBusy.setBusy(false);
				that.fetchErrorMessageOk("Create Member Calendar", "Success", "Created Member Calendar Successfully");
				sap.ui.getCore().byId("btnDCreateSchedule").setEnabled(false);
				that.btnPressCreateCalTabDialogClose();
			}).fail(function(err) {
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		selectChangeTableCreateSchedule: function() {
			var oTable = sap.ui.getCore().byId("createScheduleFragment").getSelectedItems();
			if (oTable && oTable.length) {
				sap.ui.getCore().byId("btnDCreateSchedule").setEnabled(true);
			} else {
				sap.ui.getCore().byId("btnDCreateSchedule").setEnabled(false);
			}
		},
		onPressCreateSchedule: function(evt) {
			var that = this;
			if (!that._oSchDialog) {
				that._oSchDialog = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.CreateSchedule", that);
			}
			var createSchFrgId = sap.ui.getCore().byId("createSchId").setBusy(true);
			that.getView().addDependent(that._oSchDialog);
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._oSchDialog);
			var oCtx = evt.getSource().getBindingContext("TeamsDetails");
			var path = oCtx.getPath();
			var mdData = oCtx.getProperty(path);
			var getTeamID = mdData.U_SS_TEAMS.Code;
			var filter = "$apply=filter(U_TeamId eq '" + getTeamID + "')/groupby((Name))";
			var teamsSAL = new TeamsSAL();
			var newjMdl = new JSONModel();
			this.getView().setModel(newjMdl, "viewCalendarModel");
			this.getView().getModel("viewCalendarModel").setData({});
			this.getView().setModel(null, "viewCalendarModel");
			var getAccountId = this._getAccountID;
			var getPageID = this._setViewLevel;
			teamsSAL.fetchTeamCalendarList(filter).done(function(getResponse) {
				if (getResponse.oData.value.length > 0) {
					sap.ui.getCore().byId("createCalSeleMemListID").setValue(getResponse.oData.value[0].Name);
					that.seleTeamCalendarList(getResponse.oData.value[0].Name);
					/*	that.getRouter().navTo("ViewTeamCalendar", {
						accountID: getAccountId,
						teamID: getTeamID,
						PageID: getPageID
					});*/
					sap.ui.getCore().setModel(getResponse, "CreateTeamCalendarsList");
				} else {
					sap.ui.getCore().setModel(getResponse, "CreateTeamCalendarsList");
				}
				sap.ui.getCore().setModel(getResponse, "teamCalendarsList");
				that._oSchDialog.open();
				that.showLoading(false);
				createSchFrgId.setBusy(false);
			}).fail(function(err) {
				that.showLoading(false);
				createSchFrgId.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},

		seleTeamCalendarList: function(getValue) {
			var that = this;
			var filter = "$filter=Name eq '" + getValue + "'";
			var teamsSAL = new TeamsSAL();
			var newjMdl = new JSONModel();
			this.getView().setModel(newjMdl, "viewCalendarModel");
			this.getView().getModel("viewCalendarModel").setData({});
			this.getView().setModel(null, "viewCalendarModel");
			teamsSAL.fetchTeamCalendarList(filter).done(function(getResponse) {
				var jsonData = JSON.parse(getResponse.getJSON());
				jsonData.value.forEach(function(ele) {
					ele.StartTime = ele.U_StartTime;
					ele.EndTime = ele.U_EndTime;
				});
				getResponse.setData(jsonData);
				sap.ui.getCore().setModel(getResponse, "teamCalendarsList");
			}).fail(function(err) {
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		}

	});

});