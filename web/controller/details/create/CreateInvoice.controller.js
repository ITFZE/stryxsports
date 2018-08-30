sap.ui.define([
     "com/ss/app/StryxSports/controller/sal/CreateInvoiceSAL",
     "sap/ui/model/json/JSONModel",
	 'sap/m/Button',
     'sap/m/Dialog',
	 'sap/m/Text',
	 'sap/m/MessageToast',
	 'sap/ui/model/Filter',
	 'sap/m/MessageBox'
], function(CreateInvoiceSAL, JSONModel, Button, Dialog, Text, MessageToast, Filter, MessageBox) {
	"use strict";
	return CreateInvoiceSAL.extend("com.ss.app.StryxSports.controller.details.create.CreateInvoice", {
		onInit: function() {
			this._pageID = "";
			this._AccountID = "";
			this._setViewLevel = "";
			this.sModel = "";
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			var oRouter = this.getRouter();
			oRouter.getRoute("CreateInvoice").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
			that.showLoading(true);
			var getEle = oEvent.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			var getDocID = oEvent.getParameter("arguments").DocEntryID;
			this._pageID = oEvent.getParameter("arguments").PageID;
			$.when(that.checkInvoiceStatus(getDocID)).then(function() {
				return;
			});
		},
		createGenerateInvoiceLater: function() {
			var newModel = new JSONModel();
			this.getView().setModel(newModel, "InvoiceDetailsModel");
			this.getOwnerComponent().getRouter().navTo("DashBoard");

		},
		createInvoiceModel: function() {
			var that = this;
			var invMD = new JSONModel();
			var ordMD = that.getView().getModel("InvoiceDetailsModel");
			var ordData = ordMD.getData();
			this._AccountID = ordData.CardCode;

			invMD.setProperty('/CardCode', ordData.CardCode);
			invMD.setProperty('/Comments', "Based On Sales Orders " + ordData.DocEntry + ".");
			invMD.setProperty('/JournalMemo', "A/R Invoices - " + ordData.CardCode);
			invMD.setProperty('/DocumentLines', []);
			invMD.setProperty('/U_SalesOrderID', ordData.DocEntry);
			var objInv = invMD.getData();
			for (var i = 0; i < ordData.DocumentLines.length; i++) {
				var tmpObj = new Object();
				tmpObj.ItemCode = ordData.DocumentLines[i].ItemCode;
				tmpObj.Quantity = ordData.DocumentLines[i].Quantity;
				tmpObj.TaxCode = null;
				tmpObj.UnitPrice = ordData.DocumentLines[i].UnitPrice;
				tmpObj.BaseEntry = ordData.DocEntry;
				tmpObj.BaseType = 17;
				tmpObj.BaseLine = ordData.DocumentLines[i].LineNum;
				objInv.DocumentLines.push(tmpObj);
			}
			invMD.setData(objInv);

			return invMD;
		},
		createGenerateInvoice: function() {
			var that = this;
			that.showLoading(true);
			var invMD = this.createInvoiceModel();
			that.createInvoice(invMD, "").done(function(obj) {
				var md = new JSONModel();
				md.setData(obj);
				that.showLoading(false);
				that.fetchMessageOkNavTo("Invoice", "Success", "Created Successfully. \n Do you want to continue with the payment procedure?",
					"NewPayment", obj.DocEntry);

			}).fail(function(err) {
				that.showLoading(false);
				that.fetchErrorMessageOk("Error", "Error", err.toString());
			});
		},
		checkInvoiceStatus: function(getID) {
			var that = this;
			that.showLoading(true);
			var getStatus;
			if (getID !== null && getID !== undefined) {
				var filter = encodeURI("$filter=U_SalesOrderID eq " + getID);
				this.fetchInvoiceStatusByID(filter).done(function(jMdl) {
					getStatus = jMdl.oData.value[0].U_Status;
					if (jMdl.oData.value.length > 0) {
						that.checkInvoiceStatusCreated(getStatus, getID);

					} else {
						that.fetchOrders(getID);
					}
				}).fail(function(err) {
					that.showLoading(false);

					that.fetchErrorMessageOk("Error", "Error", err.toString());
				});
			} else {
				this.fetchMessageOk("Fetch", "Error", "Error fetching order.", "DashBoard");
			}

		},
		checkInvoiceStatusCreated: function(getStatus, getID) {
			switch (getStatus) {
				case "1":
					this.fetchOrders(getID);
					break;
				case "2":
					this.fetchMessageOk("Created", "Warning", "Invoice Has Been Generated", "DashBoard");
					break;
			}

		},
		fetchOrders: function(getID) {
			var that = this;
			that.showLoading(true);
			var newModel = new JSONModel();
			that.fetchOrderById(newModel, getID).done(function(jsMdl) {
				var ordData = jsMdl.getData();
				var totalItemPrice = 0;
				for (var i = 0; i < ordData.DocumentLines.length; i++) {
					totalItemPrice = totalItemPrice + ordData.DocumentLines[i].Price;
				}
				jsMdl.setProperty("/TotalItemPrice", totalItemPrice);
				jsMdl.setData(ordData);
				that.getView().setModel(jsMdl, "InvoiceDetailsModel");
				that._AccountID = ordData.CardCode;
				that.fetchAccountAllDetails();
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchErrorMessageOk("Error", "Error", err.toString());
			});

		},

		fetchAccountAllDetails: function() {
			let that = this;
			that.showLoading(true);
			var getcardCode = this._AccountID;
			this.fetchAccountDetails(getcardCode).done(function(response) {
				var mLeadDetails = new JSONModel();
				mLeadDetails.setData(response);
				that.updateEmgStatus(response);
				that.getView().setModel(mLeadDetails, "mLeadDetails");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		updateEmgStatus: function(getResponse) {
			var emgPanel = this.getView().byId("emgPanelId");
			var emgLabel = this.getView().byId("emergencyContailLabel");
			if (getResponse.ContactEmployees == "") {
				emgLabel.setVisible(false);
				emgPanel.setVisible(false);
			} else {
				emgLabel.setVisible(true);
				emgPanel.setVisible(true);
			}
		},
		//Here function for Print
		onPrint: function(oEvent) {
			var oTarget = this.getView();
			if (oTarget) {
				var $domTarget = oTarget.$()[0],
					sTargetContent = $domTarget.innerHTML,
					sOriginalContent = document.body.innerHTML;
				document.body.innerHTML = sTargetContent;
				window.print();
				document.body.innerHTML = sOriginalContent;
			} else {

			}
		},
		onBack: function() {
			var getPageID = this._pageID;
			switch (getPageID) {
				case "63":
					this.getOwnerComponent().getRouter()
						.navTo("SelectServices", {
							AccountId: this._AccountID,
							PageID: 27
						});
					break;
				case "46":
					this.getOwnerComponent().getRouter()
						.navTo("SearchInvoice");
					break;
				case "62":
					this.getOwnerComponent().getRouter()
						.navTo("ViewAccount", {
							AccountId: this._AccountID,
							PageID: 27
						});
					break;

				default:
					this.getOwnerComponent().getRouter().navTo("DashBoard");
					break;
			}
		},

		////////////////////////////////////////////////////////START CREATE MESSAGES ///////////////////////////////////////////////////////
		fetchMessageOkNavTo: function(getTitle, getState, getMessage, getRouteName, GetID) {
			var that = this;

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
					text: 'Ok',
					press: function() {
						that.getOwnerComponent().getRouter().navTo(getRouteName, {
							InvoiceID: GetID,
							PageID: 27
						});
						messageOktDialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function() {
						that.getOwnerComponent().getRouter()
							.navTo("ViewAccount", {
								AccountId: that._AccountID,
								PageID: 27
							});
						messageOktDialog.close();
					}
				})
			});
			messageOktDialog.open();
		},
		////////////////////////////////////////////////////////END CREATE MESSAGES /////////////////////////////////////////////////////////
		onPressCreateSchedule: function(oEvent) {
			var that = this;
			if (sap.ui.getCore().getModel("scheduleModel")) {
			    that.showLoading(true);
				if (!that._oSchDialog) {
					that._oSchDialog = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.CreateSchedule", that);
				}
				that.getView().addDependent(that._oSchDialog);

				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._oSchDialog);
				that.sModel = sap.ui.getCore().getModel("scheduleModel").oData; //Schedule Model
				var sMd = new JSONModel();
				sMd.setData(that.sModel);
				that.getView().setModel(sMd, "sModel");
				that.showLoading(false);
				that._oSchDialog.open();
			} else {
			 var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
    			MessageBox.warning(
    				"Team Calendar Does Not Exist",
    				{
    					styleClass: bCompact ? "sapUiSizeCompact" : ""
    				}
    			);
			}
		},
		handleCalendarDaysSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		handleCreateScheduleConfirm: function(oEvent) {
			var that = this;
			var appointments = [];
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				aContexts.forEach(function(oCtx) {
					let obj = {};
					obj.Name = oCtx.getObject().Name;
					obj.STime = oCtx.getObject().STime;
					obj.ETime = oCtx.getObject().ETime;
					obj.SSTime = oCtx.getObject().SSTime;
					obj.SETime = oCtx.getObject().SETime;
					appointments.push(obj);
    				});
			}
			//Create schedule model
			var oModel = new JSONModel();
			var scheduleArr = [];
			var schedule = {};
            schedule.appointments = appointments;
            scheduleArr.push(schedule);
			oModel.setData(scheduleArr);
			sap.ui.getCore().setModel(oModel, "viewCalendarModel");
			sap.ui.getCore().getModel("viewCalendarModel").refresh(true);
			oEvent.getSource().getBinding("items").filter([]);
			
			// Informational message box for successfull schedule creation
            MessageToast.show("Member Schedule Created Successfully");
		}
	});
});