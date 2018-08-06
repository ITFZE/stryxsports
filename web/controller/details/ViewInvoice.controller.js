sap.ui.define([
     "com/ss/app/StryxSports/controller/sal/CreateInvoiceSAL",
      "com/ss/app/StryxSports/controller/sal/ViewAccountSAL",
	"sap/ui/model/json/JSONModel"
], function(CreateInvoiceSAL, ViewAccountSAL, JSONModel) {
	"use strict";
	return CreateInvoiceSAL.extend("com.ss.app.StryxSports.controller.details.ViewInvoice", {
		onInit: function() {
			this._pageID = "";
			this._AccountID = "";
			this._setViewLevel = "";
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			var oRouter = this.getRouter();
			oRouter.getRoute("ViewInvoice").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
			that.showLoading(true);
			this._getDocID = oEvent.getParameter("arguments").DocEntryID;
			this._pageID = oEvent.getParameter("arguments").PageID;
			$.when(that.fetchInvoice(that._getDocID)).then(function() {

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
				//that.fetchErrorMessageOk("Error", "Error", "Invoice Created Successfully");
				var getDocEntry = obj.DocEntry;
				/*that.getOwnerComponent().getRouter()
				.navTo("ViewInvoice", {
					DocEntryID: getDocEntry
				});*/
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchErrorMessageOk("Error", "Error", err.toString());
			});
		},
		checkInvoiceStatus: function(getID) {
			var that = this;
			var getStatus;
			if (getID !== null && getID !== undefined) {
				var filter = encodeURI("$filter=U_SalesOrderID eq " + getID);
				this.fetchInvoiceStatusByID(filter).done(function(jMdl) {
					//getStatus = jMdl.oData.value[0].U_Status;
					if (jMdl.oData.value.length > 0) {
						that.checkInvoiceStatusCreated(getStatus, getID);
					} else {
						that.fetchOrders(getID);
					}
					that.showLoading(false);
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
					this.fetchMessageOk("Created", "Warning", "Invoice has not been generated", "DashBoard");
					break;
				case "2":
					this.fetchInvoice(getID);
					break;
			}

		},
		//Here Fetch Leads Details
		fetchAccountDetails: function() {
			let that = this;
			var emgLabel = that.getView().byId("emergencyContailLabel");
			that.showLoading(true);
			var accountSal = new ViewAccountSAL();
			accountSal.fetchLeadDetails(that._AccountID).done(function(response) {
				var mLeadDetails = new JSONModel();
				mLeadDetails.setData(response);
				that.getView().setModel(mLeadDetails, "mLeadDetails");
				that.showLoading(false);
				emgLabel.setVisible(true);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchInvoice: function(getID) {
			var that = this;
			var newModel = new JSONModel();
			that.fetchInvoiceById(newModel, getID).done(function(jsMdl) {
				var ordData = jsMdl.getData();
				var totalItemPrice = 0;
				for (var i = 0; i < ordData.DocumentLines.length; i++) {
					totalItemPrice = totalItemPrice + ordData.DocumentLines[i].Price;
				}
				jsMdl.setProperty("/TotalItemPrice", totalItemPrice);
				jsMdl.setData(ordData);
				that.getView().setModel(jsMdl, "InvoiceDetailsModel");
				if (jsMdl.oData.CardCode !== "") {
					that._AccountID = jsMdl.oData.CardCode;
					that.fetchAccountDetails();
				}

			}).fail(function(err) {
				that.showLoading(false);
				that.fetchErrorMessageOk("Error", "Error", err.toString());
			});

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
				case "62":
					this.getOwnerComponent().getRouter()
						.navTo("ViewAccount", {
							AccountId: this._AccountID,
							PageID: 27
						});
					break;
				case "46":
					this.getOwnerComponent().getRouter().navTo("SearchInvoice");
					break;
				default:
					this.getOwnerComponent().getRouter().navTo("DashBoard");
					break;
			}
		}
	});
});