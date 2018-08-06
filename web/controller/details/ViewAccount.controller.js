sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/ViewAccountSAL",
	'sap/ui/model/json/JSONModel'
], function(ViewAccountSAL, JSONModel) {
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
			this._getSeleTeamID  = oEvent.getParameter("arguments").teamID;
			$.when(that.fetchAccountDetails(that._getAccountID,that._getSeleTeamID)).then(function() {
			    that.fetchOrdersDetails(that._getAccountID);
			    that.fetchActivitiesDetails(that._getAccountID);
			    that.fetchInvoiceDetails(that._getAccountID); 
			    that.fetchTeamDetails(that._getAccountID,that._getSeleTeamID);
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
					PageID:	this._setViewLevel
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
		    var oItem,oCtx;
		    oItem = oEvent.getSource();
		    oCtx = oItem.getBindingContext("TeamsDetails");
		    this.getOwnerComponent().getRouter().navTo("GoToTeamsDetail",{
		        TeamID: oCtx.getProperty("U_SS_TEAMS").Code,
		        AccountId: this._getAccountID,
		        PageID: this._setViewLevel
		    });
		},
		
		onNavBackPress: function() {
		    var getPagesID = this._pageID ;
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

			//		var filter = encodeURI("$expand=Orders($select=DocEntry,Comments,DocNum,CardCode,CardName,DocCurrency,CreationDate,VatSum,DocTotalSys),Orders/DocumentLines($select=ItemCode,ItemDescription)||$filter=Orders/DocEntry eq U_SS_MEM_SERVICES/U_SalesOrderID and Orders/DocEntry eq Orders/DocumentLines/DocEntry and U_SS_MEM_SERVICES/U_CardCode eq'"+	getID + "'||$select=U_Status,U_InvoiceID");
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
			var filter = encodeURI(
				"$filter=U_SS_SERVICE_ITEM/U_MemOrderID eq U_SS_MEM_SERVICES/U_SalesOrderID and U_SS_SERVICE_ITEM/U_TeamID eq U_SS_TEAMS/Code and U_SS_SERVICE_ITEM/U_TeamID ne null and U_SS_MEM_SERVICES/U_CardCode eq '" +
				getID + "' ||$apply=groupby((U_SS_TEAMS/Code,U_SS_TEAMS/Name,U_SS_TEAMS/U_StartDate,U_SS_TEAMS/U_EndDate))");
			this.fetchTeamsDetails(filter).done(function(response) {
				that.getView().setModel(response, "TeamsDetails");
			}).fail(function(err) {
				//that.showLoading(false);
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
		
		navToTeams: function() {
			this.getOwnerComponent().getRouter().navTo("ViewTeams", {
				PageID: 62,
				AccountId: this._getAccountID
			});
		},
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
		}
	
	});

});