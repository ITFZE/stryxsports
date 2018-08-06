sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/PaymentSAL",
	"sap/ui/model/json/JSONModel",
	 "sap/ui/core/ValueState",
	'sap/m/Button',
     'sap/m/Dialog',
	 'sap/m/Text'
], function(PaymentSAL, JSONModel, ValueState, Button, Dialog, Text) {
	"use strict";

	return PaymentSAL.extend("com.ss.app.StryxSports.controller.details.create.NewPayment", {
		onInit: function() {
			this._getInvoiceID = "";
			this._getAccountID = "";
			this._getPageID = "";
			this._getTotalAmount = "";
			this._paidAmt = 0;
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			var oRouter = this.getRouter();
			oRouter.getRoute("NewPayment").attachMatched(this._onRouteMatched, this);

			this.byId("CreditCardNo").setValue(9999);
			this.byId("vCardValid").setDateValue(new Date(2099, 11));
			this.reqBody = {};
		},
		_onRouteMatched: function(oEvt) {
			var filter = "";
			var that = this;
			this._getInvoiceID = oEvt.getParameter("arguments").InvoiceID;
			this._getPageID = oEvt.getParameter("arguments").PageID;
			that.showLoading(true);
			this.createMakePaymentModel();
			this.fetchCreateInvoiceDetails(this._getInvoiceID, filter).done(function(jsMdl) {
				var ordData = jsMdl.getData();
				var totalItemPrice = 0;
				if (ordData.DocumentLines.length > 0) {
					for (var i = 0; i < ordData.DocumentLines.length; i++) {
						totalItemPrice = totalItemPrice + ordData.DocumentLines[i].LineTotal;
					}
				}
				jsMdl.setProperty("/TotalItemPrice", totalItemPrice);
				jsMdl.setData(ordData);
				that.getView().setModel(jsMdl, "InvoiceDetailsModel");
				// API CALL TO FTECH BALANCE AND PAID AMOUNTS
				var balModel = that.getView().getModel("mBalance").getData();
				balModel.PaymentBPCode.BPCode = ordData.CardCode;
				balModel.PaymentBPCode.Date = ordData.DocDate;
				var invoiceEntries = {
					DocEntry: that._getInvoiceID,
					DocType: "itARInvoice"
				};
				balModel.PaymentInvoiceEntries.push(invoiceEntries);
				if (ordData.DocumentStatus !== "bost_Close") {
					that.fetchBalanceAmount(balModel).then(function(response) {
						var inWallet = response.value[0].TotalPaymentAmount;
						var mWallet = new JSONModel();
						mWallet.setProperty("/inWallet", inWallet);
						that.getView().setModel(mWallet, "mWallet");
						var totalDebt = ordData.DocTotal;
						that._paidAmt = totalDebt - inWallet;
						var mReturnBalance = new JSONModel();
						mReturnBalance.setProperty("/PaidAmount", that._paidAmt);
						that.getView().setModel(mReturnBalance, "mReturnBalance");
					}).fail(function(err) {
						that.fetchMessageOk("Error", "Error", err.toString(), "SearchMembership");
					});
				} else {
					that.fetchMessageOkNavTo("Payment", "Success", "Payment Done");
				}
				if (ordData.CardCode !== "") {
					that._getAccountID = ordData.CardCode;
					that.fetchLeadDetail();
				}
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		onPressCheq: function() {
			var cheqFormId = this.getView().byId("cheqSimpleFrom");
			var cashFormId = this.getView().byId("cashSimpleFrom");
			var nPCreditCardType = this.getView().byId("creditCardTypeSimpleFrom");
			cashFormId.setVisible(false);
			cheqFormId.setVisible(true);
			this.getView().byId("txtChequeNo").setValueState("None");
			this.getView().byId("cashAmount").setValueState("None");
			this.getView().byId("nPCreditCardType").setValueState("None");
			this.getView().byId("CreditCardNo").setValueState("None");
			this.getView().byId("vCardValid").setValueState("None");
			this.getView().byId("onlineAmt").setValueState("None");
			nPCreditCardType.setVisible(false);
		},
		onPressCash: function() {
			var that = this;
			var cashFormId = this.getView().byId("cashSimpleFrom");
			var cheqFormId = this.getView().byId("cheqSimpleFrom");
			var nPCreditCardType = this.getView().byId("creditCardTypeSimpleFrom");
			cheqFormId.setVisible(false);
			cashFormId.setVisible(true);
			this.getView().byId("cashAmount").setValueState("None");
			this.getView().byId("txtChequeNo").setValueState("None");
			this.getView().byId("inputAccounttNum").setValueState("None");
			this.getView().byId("chequeAmt").setValueState("None");
			this.getView().byId("nPCreditCardType").setValueState("None");
			this.getView().byId("CreditCardNo").setValueState("None");
			this.getView().byId("vCardValid").setValueState("None");
			this.getView().byId("onlineAmt").setValueState("None");
			nPCreditCardType.setVisible(false);

			// Set Total to be paid amount as global
			that._getTotalAmount = that.getView().getModel("InvoiceDetailsModel").getData().DocTotal;
		},
		onPressOnline: function() {
			var cashFormId = this.getView().byId("cashSimpleFrom");
			var cheqFormId = this.getView().byId("cheqSimpleFrom");
			var nPCreditCardType = this.getView().byId("creditCardTypeSimpleFrom");

			cheqFormId.setVisible(false);
			cashFormId.setVisible(false);
			this.getView().byId("nPCreditCardType").setValueState("None");
			this.getView().byId("txtChequeNo").setValueState("None");
			this.getView().byId("inputAccounttNum").setValueState("None");
			this.getView().byId("chequeAmt").setValueState("None");
			this.getView().byId("cashAmount").setValueState("None");
			nPCreditCardType.setVisible(true);
		},

		onNavBackDashboard: function() {
			this.getRouter().navTo("DashBoard");
			var cashFormId = this.getView().byId("cashSimpleFrom");
			var cheqFormId = this.getView().byId("cheqSimpleFrom");
			cheqFormId.setVisible(false);
			cashFormId.setVisible(false);
		},

		fetchLeadDetail: function() {
			var that = this;
			var filterTypes = encodeURI(
				"$select=Code,Name,Balance||$filter=Name eq 'Cash AED' or Name eq 'Cheques Received but Not deposited (PDC ON HAND)' or Name eq 'MASHREQ POS TERMINAL ACCOUNT (RECEIPTS)'"
			);
			this.fetchLeadDetails(that._getAccountID).done(function(obj) {
				that.getView().setModel(obj, "LeadsDetails");
				that.updateEmgerencyPanelHide();
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

			this.fetchPayTypes(filterTypes).done(function(obj) {
				that.getView().setModel(obj, "PayTypesKey");
				that.fetchCreditCardDetail();
				that.showLoading(false);

			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		onSelectSType: function() {

		},
		onBack: function() {
			var getPageID = this._getPageID;
			switch (getPageID) {
				case "63":
					this.getOwnerComponent().getRouter()
						.navTo("SelectServices", {
							AccountId: this._getAccountID
						});
					break;
				case "46":
					this.getOwnerComponent().getRouter()
						.navTo("SearchInvoice");
					break;
				case "62":
					this.getOwnerComponent().getRouter()
						.navTo("ViewAccount", {
							AccountId: this._getAccountID,
							PageID: 27
						});
					break;
				default:
					this.getOwnerComponent().getRouter().navTo("DashBoard");
					break;
			}
		},
		fetchCreditCardDetail: function() {
			var that = this;
			var pCardType = that.getView().byId("nPCreditCardType");
			var filterTypes = encodeURI("$select=CreditCardName,CreditCardCode,GLAccount");
			pCardType.setBusy(true);
			var npCreditCard = new sap.ui.core.Item({
				text: "Select The Credit Card",
				key: -1
			});
			this.fetchCreditCardTypes(filterTypes).done(function(obj) {
				that.getView().setModel(obj, "CreditCardDetails");
				pCardType.insertItem(npCreditCard, 0);
				pCardType.setSelectedItem(npCreditCard);
				pCardType.setBusy(false);
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				pCardType.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		getSelectedCreditCardType: function() {

		},
		createMakePaymentModel: function() {
			var chequeMD = new JSONModel();
			chequeMD.setProperty('/CardCode');
			chequeMD.setProperty('/PaymentInvoices', []);
			chequeMD.setProperty('/PaymentCreditCards', []);
			this.getView().setModel(chequeMD, "createOnlineModel");

			var checks = new JSONModel();
			checks.setProperty('/CardCode');
			checks.setProperty('/PaymentChecks', []);
			checks.setProperty('/PaymentInvoices', []);
			this.getView().setModel(checks, "createChecksModel");

			var cashs = new JSONModel();
			cashs.setProperty('/CardCode');
			cashs.setProperty('/CashAccount');
			cashs.setProperty('/PaymentInvoices', []);
			cashs.setProperty('/CashSum');
			this.getView().setModel(cashs, "createCashsModel");

			var mBalance = new JSONModel();
			mBalance.setProperty('/PaymentBPCode', {});
			mBalance.setProperty('/PaymentInvoiceEntries', []);
			this.getView().setModel(mBalance, "mBalance");
		},
		payment: function() {
			var that = this;
			var getMDLPayTypes = this.getView().getModel("PayTypesKey");
			var getPayTypesData = getMDLPayTypes.getData();
			var getMDLInvoiceDetail = this.getView().getModel("InvoiceDetailsModel");
			var getInvoiceDetailData = getMDLInvoiceDetail.getData();
			var payTypesKey = that.byId("btnPayType").getSelectedKey();
			var getChequeValue = that.getView().byId("txtChequeNo").getValue();
			var getAccountNumValue = that.getView().byId("inputAccounttNum").getValue();
			var getChqueTotalAmount = that.getView().byId("chequeAmt").getValue();
			var getCashValue = that.getView().byId("cashAmount").getValue();
			var getSelcetValue = that.getView().byId("nPCreditCardType");
			var getCreditCardNumber = that.getView().byId("CreditCardNo").getValue();
			var getCardValidValue = that.getView().byId("vCardValid").getValue();
			var getTotalAmtValue = that.getView().byId("onlineAmt").getValue();
			var voucherNo = that.getView().byId("voucherNo").getValue();
			var balAmount = that.getView().byId("balAmt").getValue();
			let balance = balAmount.split(" ");
			if (getChequeValue == "") {
				that.getView().byId("txtChequeNo").setValueState("Error");
			} else if (getAccountNumValue == "") {
				that.getView().byId("txtChequeNo").setValueState("None");
				that.getView().byId("inputAccounttNum").setValueState("Error");
			} else if (getChqueTotalAmount == "") {
				that.getView().byId("txtChequeNo").setValueState("None");
				that.getView().byId("inputAccounttNum").setValueState("None");
				that.getView().byId("chequeAmt").setValueState("Error");
			} else if (parseInt(getChqueTotalAmount) > parseFloat(balance[1])) {
				that.getView().byId("txtChequeNo").setValueState("None");
				that.getView().byId("inputAccounttNum").setValueState("None");
				that.getView().byId("chequeAmt").setValueState("Error");
				that.getView().byId("chequeAmt").setValueStateText("Please Enter the amount lesser than or equal to balance");
			} else if (payTypesKey === "Checks") {
				that.getView().byId("txtChequeNo").setValueState("None");
				that.getView().byId("inputAccounttNum").setValueState("None");
				that.getView().byId("chequeAmt").setValueState("None");
				var chequeAmt = that.getView().byId("cashAmount").getValue();
				chequeAmt = chequeAmt.replace(/\,/g, '');
				chequeAmt = parseInt(chequeAmt, 10);
				var getMDLChecksModel = this.getView().getModel("createChecksModel");
				var getChecksDetail = getMDLChecksModel.getData();

				var getAccounttNum = that.getView().byId("inputAccounttNum").getValue();
				var getChequeNo = that.getView().byId("txtChequeNo").getValue();
				var toCN = parseInt(getAccounttNum);
				var getOBJ = {
					CheckNumber: toCN,
					CheckAccount: "1102005",
					AccounttNum: getAccounttNum,
					CheckSum: chequeAmt
				};
				getChecksDetail.CardCode = getInvoiceDetailData.CardCode;
				getChecksDetail.PaymentChecks.push(getOBJ);
				var getOBJs = {
					AppliedSys: chequeAmt,
					DocEntry: parseInt(this._getInvoiceID),
					InvoiceType: "it_Invoice",
					SumApplied: chequeAmt
				};
				that.showLoading(true);
				getChecksDetail.PaymentInvoices.push(getOBJs);
				// API CALL TO MAKE PAYMENT
				that.makePayment(getChecksDetail).done(function(resp) {
					that.showLoading(false);
					that.fetchMessageOk("Payment", "Success", "Payment Successfull", "SearchMembership");
					// 	API CALL TO FETCH BALANCE AMOUNT
					var balModel = that.getView().getModel("mBalance").getData();
					balModel.PaymentBPCode.BPCode = getInvoiceDetailData.CardCode;
					balModel.PaymentBPCode.Date = getInvoiceDetailData.DocDate;
					var invoiceEntries = {
						DocEntry: that._getInvoiceID,
						DocType: "itARInvoice"
					};
					balModel.PaymentInvoiceEntries.push(invoiceEntries);
					that.fetchCreateInvoiceDetails(that._getInvoiceID, "");
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "SearchMembership");
				});

			} else {}
			//Here Cash Payment
			if (getCashValue == "") {
				that.getView().byId("cashAmount").setValueState("Error");
			} else if (parseInt(getCashValue) > parseFloat(balance[1])) {
				that.getView().byId("cashAmount").setValueState("Error");
				that.getView().byId("cashAmount").setValueStateText("Please Enter the amount lesser than or equal to balance");
			} else if (payTypesKey === "Cash") {
				that.getView().byId("cashAmount").setValueState("None");
				var cash = that.getView().byId("cashAmount").getValue();
				cash = cash.replace(/\,/g, ''); // 1125, but a string, so convert it to number
				cash = parseInt(cash, 10);
				var getMDLCashModel = this.getView().getModel("createCashsModel");
				var getCashDetail = getMDLCashModel.getData();
				getCashDetail.CardCode = getInvoiceDetailData.CardCode;
				getCashDetail.CashAccount = "1101101";
				getCashDetail.CashSum = cash; //getInvoiceDetailData.DocTotalSys;
				var getOBJChash = {
					DocEntry: parseInt(this._getInvoiceID),
					SumApplied: cash,
					AppliedSys: cash,
					InvoiceType: "it_Invoice"
				};
				that.showLoading(true);
				getCashDetail.PaymentInvoices.push(getOBJChash);
				// API CALL TO MAKE PAYMENT
				that.makePayment(getCashDetail).done(function(resp) {
					that.showLoading(false);
					that.fetchMessageOk("Payment", "Success", "Payment Successfull", "SearchMembership");
					// 	API CALL TO FETCH BALANCE AMOUNT
					var balModel = that.getView().getModel("mBalance").getData();
					balModel.PaymentBPCode.BPCode = getInvoiceDetailData.CardCode;
					balModel.PaymentBPCode.Date = getInvoiceDetailData.DocDate;
					var invoiceEntries = {
						DocEntry: that._getInvoiceID,
						DocType: "itARInvoice"
					};
					balModel.PaymentInvoiceEntries.push(invoiceEntries);
					that.fetchCreateInvoiceDetails(that._getInvoiceID, "");
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "SearchMembership");
				});
			} else {}
			///Here Online Payment
			if (getSelcetValue.getSelectedItem().getText() === "Select The Credit Card") {
				getSelcetValue.setValueState("Error");
			} else if (getCreditCardNumber == "") {
				getSelcetValue.setValueState("None");
				that.getView().byId("CreditCardNo").setValueState("Error");
			} else if (getCardValidValue == "") {
				that.getView().byId("CreditCardNo").setValueState("None");
				that.getView().byId("vCardValid").setValueState("Error");
			} else if (voucherNo == "") {
				getSelcetValue.setValueState("None");
				that.getView().byId("vCardValid").setValueState("None");
				that.getView().byId("voucherNo").setValueState("Error");
			} else if (getTotalAmtValue == "") {
				that.getView().byId("voucherNo").setValueState("None");
				that.getView().byId("onlineAmt").setValueState("Error");
			} else if (parseInt(getTotalAmtValue) > parseFloat(balance[1])) {
				that.getView().byId("voucherNo").setValueState("None");
				that.getView().byId("vCardValid").setValueState("None");
				that.getView().byId("onlineAmt").setValueState("Error");
				that.getView().byId("onlineAmt").setValueStateText("Please Enter the amount lesser than or equal to balance");
			} else if (payTypesKey === "Online") {
				getSelcetValue.setValueState("None");
				that.getView().byId("voucherNo").setValueState("None");
				that.getView().byId("CreditCardNo").setValueState("None");
				that.getView().byId("vCardValid").setValueState("None");
				that.getView().byId("onlineAmt").setValueState("None");
				var pCardType = that.getView().byId("vCardValid").getValue();
				var onlineCash = that.getView().byId("onlineAmt").getValue();
				onlineCash = onlineCash.replace(/\,/g, ''); // 1125, but a string, so convert it to number
				onlineCash = parseInt(onlineCash, 10);
				var getValueMMYY = pCardType.split("/");
				var getMM = getValueMMYY[0];
				var getYY = getValueMMYY[1];
				var getDate = "20" + getYY + "-" + getMM + "-20";

				var pCardType = that.getView().byId("nPCreditCardType");
				var getCreditCardNo = that.getView().byId("CreditCardNo");
				var voucherNo = that.getView().byId("voucherNo");
				var getSele = pCardType.getSelectedKey();
				var getMDLOnlineModel = this.getView().getModel("createOnlineModel");
				var getOnlineDetail = getMDLOnlineModel.getData();
				getOnlineDetail.CardCode = getInvoiceDetailData.CardCode;

				var getOBJCOnlineIN = {
					AppliedSys: onlineCash,
					DocEntry: parseInt(this._getInvoiceID),
					InvoiceType: "it_Invoice",
					SumApplied: onlineCash
				};

				var getOBJCOnlineCC = {
					CreditCard: 1,
					CreditAcct: "1101202",
					CreditCardNumber: getCreditCardNo.getValue(),
					CardValidUntil: getDate,
					VoucherNum: voucherNo.getValue(),
					CreditSum: onlineCash
				};
				that.showLoading(true);
				getOnlineDetail.PaymentCreditCards.push(getOBJCOnlineCC);
				getOnlineDetail.PaymentInvoices.push(getOBJCOnlineIN);

				// API CALL TO MAKE PAYMENT
				that.makePayment(getOnlineDetail).done(function(resp) {
					that.showLoading(false);
					that.fetchMessageOk("Payment", "Success", "Payment Successfull", "SearchMembership");
					// 	API CALL TO FETCH BALANCE AMOUNT
					var balModel = that.getView().getModel("mBalance").getData();
					balModel.PaymentBPCode.BPCode = getInvoiceDetailData.CardCode;
					balModel.PaymentBPCode.Date = getInvoiceDetailData.DocDate;
					var invoiceEntries = {
						DocEntry: that._getInvoiceID,
						DocType: "itARInvoice"
					};
					balModel.PaymentInvoiceEntries.push(invoiceEntries);
					that.fetchCreateInvoiceDetails(that._getInvoiceID, "");
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "SearchMembership");
				});
			} else {}
		},
		handleChange: function(oEvent) {
			var getSou = oEvent.oSource;
			this._cardValidDate = getSou._lastValue;
		}, // TODO: 

		////////////////////////////////////////////////////////START CREATE MESSAGES ///////////////////////////////////////////////////////
		fetchMessageOkNavTo: function(getTitle, getState, getMessage) {
			var that = this;

			if (getMessage === "Unauthorized") {
				getTitle = "Your Session Has Been Expired";
				getMessage = "Please Re-Login";
				//	getRouteName = "Login";
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
						that.getOwnerComponent().getRouter()
							.navTo("ViewAccount", {
								AccountId: that._getAccountID,
								PageID: 27
							});
						messageOktDialog.close();
					}
				})
			});
			messageOktDialog.open();
		},
		///Here function for Emgerency Panel Hide
		updateEmgerencyPanelHide: function() {
			var that = this;
			var getModleId = this.getView().getModel("LeadsDetails");
			var emgLabel = that.getView().byId("emergencyContailLabel");
			var emgPanel = that.getView().byId("emgPaneId");
			if (getModleId.oData.ContactEmployees.length == "") {
				emgLabel.setVisible(false);
				emgPanel.setVisible(false);
			} else {
				emgLabel.setVisible(true);
				emgPanel.setVisible(true);
			}

		}
		////////////////////////////////////////////////////////END CREATE MESSAGES /////////////////////////////////////////////////////////

	});

});