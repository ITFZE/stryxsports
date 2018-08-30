sap.ui.define([
     "com/ss/app/StryxSports/controller/sal/CreateInvoiceSAL",
     "sap/ui/model/json/JSONModel",
	 'sap/m/Button',
     'sap/m/Dialog',
	 'sap/m/Text'
], function(CreateInvoiceSAL, JSONModel, Button, Dialog, Text) {
	"use strict";
	return CreateInvoiceSAL.extend("com.ss.app.StryxSports.controller.details.create.CreateInvoice", {
		onInit: function() {
			this._pageID = "";
			this._AccountID = "";
			this._setViewLevel = "";
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			var oRouter = this.getRouter();
			oRouter.getRoute("CreateInvoice").attachMatched(this._onRouteMatched, this);

			this._dpPostingDate = this.byId("DatePickerPostingDate");
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
			that.showLoading(true);
			var getToday = new Date();
			var docDate = this.toDateFormat(getToday);
			this._dpPostingDate.setValue(docDate);
			var getEle = oEvent.getParameters();
			this._dpPostingDate.setValue(docDate);
			this._dpPostingDate.setMaxDate(getToday);

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
			var getDocDate = this.toDateFormat(this._dpPostingDate.getValue());
			var invMD = new JSONModel();
			var ordMD = that.getView().getModel("InvoiceDetailsModel");
			var ordData = ordMD.getData();

			this._AccountID = ordData.CardCode;
			invMD.setProperty('/CardCode', ordData.CardCode);
			invMD.setProperty('/Comments', "Based On Sales Orders " + ordData.DocEntry + ".");
			invMD.setProperty('/JournalMemo', "A/R Invoices - " + ordData.CardCode);
			invMD.setProperty('/DocDate', getDocDate);
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

			var invMD = this.createInvoiceModel();
			if (this._dpPostingDate.getValue() !== "") {
				this._dpPostingDate.setValueState("None");
				that.showLoading(true);
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
			} else {
				this._dpPostingDate.setValueState("Error");
			}
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
		}
		////////////////////////////////////////////////////////END CREATE MESSAGES /////////////////////////////////////////////////////////

	});
});