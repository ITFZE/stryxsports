sap.ui.define([
     "com/ss/app/StryxSports/controller/sal/CreateInvoiceSAL",
	"sap/ui/model/json/JSONModel"
], function(CreateInvoiceSAL, JSONModel) {
	"use strict";
	return CreateInvoiceSAL.extend("com.ss.app.StryxSports.controller.details.create.SearchInvoice", {
		onInit: function() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			var oRouter = this.getRouter();
			this._searchTable = true;
			oRouter.getRoute("SearchInvoice").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			let that = this;
			this.clearModels();
			var tableHide = this.getView().byId("searchInvoiceTable");
			var getEle = oEvent.getParameters();
			this._setViewLevel = getEle.config.viewLevel;

			// 			$.when(that.fetchInvoiceDetails(that._getAccountID)).then(function() {
			// 			});

			if (!this._searchTable) {
				tableHide.setVisible(true);
			} else {
				tableHide.setVisible(false);
			}
		},
		onSearchBack: function() {
			this.getOwnerComponent().getRouter().navTo("DashBoard");
		},
		onAfterRendering: function() {
			var view = this.getView();
			view.addDelegate({
				onsapenter: function(e) {
					view.getController().onPressSearchInvoice();
				}
			});
		},

		onPressSearchInvoice: function() {
			var that = this;
			var getEle = this.getVariablesSearchInvoice();
			var textTitle = that.getView().byId("txtMember");
			var getSelKey = getEle.searchType.getSelectedKey();
			if (getSelKey !== "-1") {
				getEle.searchType.setValueState("None");

				if (getEle.memberName.getValue().length > 0) {
					this._filterName = getEle.memberName.getValue();
					getEle.memberName.setValueState("None");
					this._searchTable = false;
					this.fetchSearchInvoiceList(getSelKey);
				} else {
					this.fetchSearchInvoiceList(getSelKey);
				}
			} else if (getSelKey === "Pending Payment") {
				textTitle.setText("Pending Invoice Creation");
				this._searchTable = false;
				this.fetchSearchInvoiceList(getSelKey);

			} else {
				getEle.searchType.setValueState("Error");
				that.MessageToastShow("Please Select The Invoice Status Type");
			}

			/*if (getEle.memberName.getValue() === "") {
				getEle.memberName.setValueState("Error");
				that.MessageToastShow("Please Enter the Member Name");
			} else {
				this._filterName = getEle.memberName.getValue();
				getEle.memberName.setValueState("None");
			}*/

		},

		//Here View ID
		getSerchInvoiceID: function() {
			var searchInvoice = {
				firstName: this.getView().byId("searchInvocieFirstName"),
				email: this.getView().byId("searchInvoiceEmail"),
				mobile: this.getView().byId("searchInvoiceMobile")
			};
			return searchInvoice;
		},
		// 		fetchOrdersDetails: function(getID) {
		// 			var that = this;
		// 			var filter = encodeURI(
		// 				"$expand=Orders($select=DocEntry,Comments,DocNum,CardCode,CardName,DocCurrency,CreationDate,VatSum,DocTotalSys)||$filter=Orders/DocEntry eq U_SS_MEM_SERVICES/U_SalesOrderID and U_SS_MEM_SERVICES/U_CardCode eq '" +
		// 				getID + "'||$select=U_Status,U_InvoiceID");
		// 			//	var filter = encodeURI("$expand=Orders($select=DocEntry,Comments,DocNum,CardCode,CardName,DocCurrency,CreationDate,VatSum,DocTotalSys),Orders/DocumentLines($select=ItemCode,ItemDescription)||$filter=Orders/DocEntry eq U_SS_MEM_SERVICES/U_SalesOrderID and Orders/DocEntry eq Orders/DocumentLines/DocEntry and U_SS_MEM_SERVICES/U_CardCode eq'"+	getID + "'||$select=U_Status,U_InvoiceID");
		// 			this.fetchOrderDetails(filter).done(function(response) {
		// 				that.getView().setModel(response, "OrderDetails");
		// 			}).fail(function(err) {
		// 				that.showLoading(false);
		// 				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
		// 			});
		// 		},
		fetchSearchInvoiceList: function(getID) {
		    var filter;
		    var getEle = this.getVariablesSearchInvoice();
			var selceType = this.getView().byId("searchInvoiceType").getSelectedItem().getText();
			var panelId = this.getView().byId("searchInvoiceTable");
			var that = this;
			if (selceType === "Pending Invoice Creation") {
				this.getView().byId("invoicePanel").setText("Pending Invoice Creations");
			}
			if (selceType === "Pending Payment") {
				this.getView().byId("invoicePanel").setText("Pending Payments");
			}
			if (selceType === "Payment Done") {
				this.getView().byId("invoicePanel").setText("Payment Done");
			}
			if (getID !== null && getID !== undefined) {
				that.showLoading(true);
				that.getView().setBusy(true);
			
				if(getEle.memberName.length > 0){
				    filter = encodeURI("$expand=U_SS_MEM_SERVICES($select=U_CardCode),Orders($select=CardName,DocEntry)||$filter=U_SS_MEM_SERVICES/U_CardCode eq Orders/CardCode and contains(Orders/CardName,'+"+getEle.memberName.getValue()+"')||$apply=groupby((U_SS_MEM_SERVICES/U_CardCode,Orders/CardName,Orders/DocEntry))");
				    
				}else{
				filter = encodeURI(
				"$expand=Orders($select=DocEntry,DocNum,CardCode,CardName,DocTotal,DocCurrency)||$filter=Orders/DocEntry eq U_SS_MEM_SERVICES/U_SalesOrderID and U_SS_MEM_SERVICES/U_Status eq '" +
				getID + "' ||$select=U_InvoiceID");
				}
				
				this.fetchInvoices(filter).done(function(jMdl) {
					var ordData = jMdl.getData();
					for (var i = 0; i < ordData.value.length; i++) {
						ordData.value[i].Orders.U_Status = getID;
					}
					jMdl.setData(ordData);
					that.getView().setModel(jMdl, "InvoicesList");
					that.getView().setBusy(false);
					if (jMdl.oData.value.length > 0) {
						that.MessageToastShow("Success");
					} else {
						// 		that.MessageToastShow("No Data");
					}
					that.getView().setBusy(false);
					panelId.setVisible(true);
				}).fail(function(err) {
					that.getView().setBusy(false);
					that.fetchErrorMessageOk("Error", "Error", err.toString());
				});
			}

		},
		getSelectedSearchType: function() {
			var getEle = this.getVariablesSearchInvoice();
			var getSelKey = getEle.searchType.getSelectedKey();
			if (getSelKey !== "-1") {
				getEle.searchType.setValueState("None");
			} else {
				getEle.searchType.setValueState("Error");
				this.getView().byId("searchInvoiceTable").setVisible(false);
			}

		},
		onPressListSelectedIteam: function(oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext("InvoicesList");
			var mdl = ctx.getModel();
			var path = ctx.getPath();
			var data = mdl.getProperty(path);
			var getStatus = data.Orders.U_Status;
			this._searchTable = false;
			switch (getStatus) {
				case "1":
					this.getOwnerComponent().getRouter()
						.navTo("CreateInvoice", {
							DocEntryID: data.Orders.DocEntry,
							PageID: this._setViewLevel
						});
					break;
				case "2":
					this.getOwnerComponent().getRouter()
						.navTo("NewPayment", {
							InvoiceID: data.U_SS_MEM_SERVICES.U_InvoiceID,
							PageID: this._setViewLevel
						});
					break;
				case "3":
					this.getOwnerComponent().getRouter()
						.navTo("ViewInvoice", {
							DocEntryID: data.U_SS_MEM_SERVICES.U_InvoiceID,
							PageID: this._setViewLevel
						});
					break;
				default:
					break;
			}
			/*
			if (data.Orders.U_Status === "1") {
				this.getOwnerComponent().getRouter()
					.navTo("CreateInvoice", {
						DocEntryID: data.Orders.DocEntry,
						PageID: 46
					});
			} else {
				this.getOwnerComponent().getRouter()
					.navTo("NewPayment", {
						InvoiceID: getInvoiceID,
						PageID: this._setViewLevel
					});
			}*/
		},
		getVariablesSearchInvoice: function() {
			var item = {
				searchType: this.getView().byId("searchInvoiceType"),
				memberName: this.getView().byId("sIMemberName")
			};
			return item;
		},
		clearModels: function() {
			var getEle = this.getVariablesSearchInvoice();
			//	var newJMDL = new JSONModel();
			getEle.memberName.setValue("");
			getEle.memberName.setValueState("None");
			//	getEle.searchType.setSelectedKey("-1");
			getEle.searchType.setValueState("None");
			//		this.getView().setModel(newJMDL, "InvoicesList");
		}

	});
});