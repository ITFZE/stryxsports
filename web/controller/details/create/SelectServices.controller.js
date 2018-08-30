sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "com/ss/app/StryxSports/controller/sal/SportCategorySAL",
  "com/ss/app/StryxSports/controller/sal/SportsSAL",
  "com/ss/app/StryxSports/controller/sal/TeamsSAL",
  "com/ss/app/StryxSports/controller/sal/LocationsSAL",
  "com/ss/app/StryxSports/controller/sal/CreateMembershipSAL",
  "com/ss/app/StryxSports/controller/sal/SeasonSAL",
   "com/ss/app/StryxSports/controller/sal/SelectServicesSAL",
   'sap/m/Button',
   'sap/m/Dialog',
	'sap/m/Text'
], function(JSONModel, SportCategorySAL, SportsSAL, TeamsSAL, LocationsSAL, CreateMembershipSAL, SeasonSAL, SelectServicesSAL, Button,
	Dialog, Text) {
	"use strict";
	return CreateMembershipSAL.extend("com.ss.app.StryxSports.controller.details.create.SelectServices", {
		onInit: function() {
			this._getAccountID = "";
			this._pageID = "";
			this._setViewLevel = "";
			this._setSeleNameBtn = "admission";
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			/*var oView = this.getView();
            oView.addEventDelegate({
              onAfterShow: function(){
                var tb = this.byId("serviceTableID");
                tb.refreshItems(true);
                var msMD = this.getView().getModel("MemberServices");
                if (msMD !== null || msMD !== undefined) {
                    msMD = null;
                }
              }
            }, oView);*/
			var oRouter = this.getRouter();
			oRouter.getRoute("SelectServices").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvt) {
			var that = this;
			var setSegamentButton = that.getView().byId("sbItemType");
			var getToday = new Date();
			var docDate = this.toDateFormat(getToday);
			this.byId("memberPostingDate").setValue(docDate);
			this.byId("memberPostingDate").setMaxDate(getToday);
			
			var admiBtn = that.getView().byId("admissionBtn");
			setSegamentButton.setSelectedButton(admiBtn);
			that.showLoading(true);
			this.getView().setBusy(true);
			//this.clearAllModels();
			this._getAccountID = oEvt.getParameter("arguments").AccountId;
			this._pageID = oEvt.getParameter("arguments").PageID;
			var getEle = oEvt.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			$.when(that.fetchMemberById()).then(function() {
				$.when(that.fetchItemDetails(104, "")).then(function() {
					$.when(that.fetchOrders()).then(function() {
						that.showLoading(false);
						return;
					});
				});
			});
			this.byId("durationType").setVisible(false);
		},
		getSelectedSeason: function(evt) {
			var getSeleValue = evt.getParameter("selectedItem").getKey();
			if (getSeleValue !== "-1") {
				this._getSeleSeasonCode = getSeleValue;
				this.fetchLocations();
			}

		},

		getSelectedTeam: function(evt) {
			var that = this;
			var getEle = this.getVariablesSelectService();
			var teamID = evt.getParameter("selectedItem").getKey();
			if (teamID !== "-1") {
				var teamModel = new JSONModel();
				var teamSAL = new TeamsSAL();
				getEle.selectServiceSportCategory.setBusy(true);
				getEle.selectServiceSportsName.setBusy(true);
				getEle.selectServiceSportCategory.setBusy(true);
				getEle.selectServiceItems.setBusy(true);
				teamSAL.fetchTeamsById(teamModel, teamID).done(function(jMdl) {
					var getCatCode = jMdl.oData.U_CategorySports;
					that.getView().setModel(jMdl, "TeamModel");
					getEle.selectServiceSportCategory.setBusy(false);
					getEle.selectServiceSportsName.setBusy(false);
					getEle.selectServiceSportCategory.setBusy(false);

					that.fetchItemDetails("", getCatCode);
				}).fail(function(err) {
					getEle.selectServiceSportCategory.setBusy(false);
					getEle.selectServiceSportsName.setBusy(false);
					getEle.selectServiceSportCategory.setBusy(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			}

		},
		getSelectedLocation: function(evt) {
			var getEle = this.getVariablesSelectService();
			var getLocationCode = evt.getParameter("selectedItem").getKey();
			if (getLocationCode !== "-1" && getLocationCode !== null) {
				getEle.selectServiceTeamName.setBusy(true);
				this.fetchTeams(getLocationCode);
			}
		},
		setSelectListValue: function() {
			var getEle = this.getVariablesSelectService();
			getEle.selectServiceTeamName.setBusy(true);
			var ssTeam = new sap.ui.core.Item({
				text: "Select Team",
				key: -1
			});
			getEle.selectServiceTeamName.insertItem(ssTeam, 0);
			getEle.selectServiceTeamName.setSelectedItem(ssTeam);
			getEle.selectServiceTeamName.setBusy(false);

		},

		handleChange: function(oEvent) {
			var bValid = oEvent.getParameter("valid");
			var oDRS = oEvent.oSource;
			if (bValid) {
				oDRS.setValueState(sap.ui.core.ValueState.None);
			} else {
				oDRS.setValueState(sap.ui.core.ValueState.Error);
			}
		},

		onSelectDuration: function(evt) {
			var that = this;
			var key = evt.getParameter("selectedItem").getKey();
			if (key == "4") {
				that.getView().byId('memberQuantity').setEnabled(false);
			} else {
				that.getView().byId('memberQuantity').setEnabled(true);
			}
		},

		addServiceItems: function() {
			var getEle = this.getVariablesSelectService();
			var getName = this._setSeleNameBtn;
			var getDocDate = this.byId("memberPostingDate");
			switch (getName) {
				case "admission":
					getEle.selectServiceSeason.setValueState("None");
					getEle.selectServiceLocations.setValueState("None");
					getEle.selectServiceTeamName.setValueState("None");
					getEle.selectServiceItems.setValueState("None");
					getEle.selectItemStartDate.setValueState("None");
					getEle.selectItemQuantity.setValueState("None");
					if (getDocDate.getValue() !== "") {
						getDocDate.setValueState("None");
						this.upDateServiceItems();
					} else {
						getDocDate.setValueState("Error");
					}

					break;
				case "subscriptions":
					getEle.selectItemQuantity.setValueState("None");
					if (getEle.selectServiceSeason.getSelectedKey() === "-1") {
						getEle.selectServiceSeason.setValueState("Error");

					} else if (getEle.selectServiceLocations.getSelectedKey() === "-1") {
						getEle.selectServiceSeason.setValueState("None");
						getEle.selectServiceLocations.setValueState("Error");

					} else if (getEle.selectServiceTeamName.getSelectedKey() === "-1") {
						getEle.selectServiceLocations.setValueState("None");
						getEle.selectServiceTeamName.setValueState("Error");

					} else if (getEle.selectServiceItems.getSelectedKey() === "-1") {
						getEle.selectServiceTeamName.setValueState("None");
						getEle.selectServiceItems.setValueState("Error");

					} else if (getEle.selectItemStartDate.getValue() === "") {
						getEle.selectServiceItems.setValueState("None");
						getEle.selectItemStartDate.setValueState("Error");

					} else if (getEle.selectItemQuantity.getValue() === "") {
						getEle.selectItemStartDate.setValueState("None");
						getEle.selectItemQuantity.setValueState("Error");
					} else if (getDocDate.getValue() === "") {
						getDocDate.setValueState("Error");
						getEle.selectItemQuantity.setValueState("None");
					} else {
						getDocDate.setValueState("None");
						getEle.selectServiceSeason.setValueState("None");
						getEle.selectServiceLocations.setValueState("None");
						getEle.selectServiceTeamName.setValueState("None");
						getEle.selectServiceItems.setValueState("None");
						getEle.selectItemStartDate.setValueState("None");
						getEle.selectItemQuantity.setValueState("None");
						if (getDocDate.getValue() !== "") {
							getDocDate.setValueState("None");
							this.upDateServiceItems();
						} else {
							getDocDate.setValueState("Error");
						}

					}
					break;
				case "items":
					getEle.selectServiceSeason.setValueState("None");
					getEle.selectServiceLocations.setValueState("None");
					getEle.selectServiceTeamName.setValueState("None");
					getEle.selectServiceItems.setValueState("None");
					getEle.selectItemStartDate.setValueState("None");
					getEle.selectItemQuantity.setValueState("None");
					this.upDateServiceItems();
					break;
				default:
					break;
			}
		},

		onPressDeleteServiceItems: function(oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext("MemberServices");
			var mdl = ctx.getModel();
			var mdData = mdl.getData();
			var path = ctx.getPath();
			var index = parseInt(path.substring(path.lastIndexOf('/') + 1));
			mdData.DocumentLines.splice(index, 1);
			mdl.setData(mdData);
		},

		getSelectedServiceItem: function(oEvent) {
			var getEle = this.getVariablesSelectService();
			getEle.selectItemStartDate.setEnabled(true);
			//getEle.selectItemMonths.setBusy(true);
			//getEle.selectItemPeriods.setBusy(true);
			getEle.selectItemPrices.setBusy(true);
			var getValueI = oEvent.getSource();
			var getValueIndex = oEvent.getParameter("selectedItem").getKey();
			if (getValueIndex !== "-1") {
				var getSelItem = getValueI.getSelectedItem();
				var getItemsList = getSelItem.getBindingContext("ItemsList");
				var getsPath = getItemsList.sPath;
				var oModel = getSelItem.getModel("ItemsList");
				var itemData = oModel.getProperty(getsPath);
				var itemMD = new sap.ui.model.json.JSONModel();
				//itemData.Quantity = 1;
				itemMD.setData(itemData);
				this.getView().setModel(itemMD, "ItemDetails");
				//getEle.selectItemMonths.setBusy(false);
				//getEle.selectItemPeriods.setBusy(false);
				this.getView().byId('durationType').setSelectedKey(itemMD.oData.U_Duration);
				this.getView().byId('memberQuantity').setValue(itemMD.oData.U_Time);
				getEle.selectItemPrices.setBusy(false);
				var addBtn = this.getView().byId("btnAddService");
				addBtn.setEnabled(true);
				// Set quantity field to enabled or disabled
				if (itemMD.oData.U_Duration == "4") {
					this.getView().byId('memberQuantity').setEnabled(false);
				} else {
					this.getView().byId('memberQuantity').setEnabled(true);
				}
			}
		},

		upDateServiceItems: function() {
			var getEle = this.getVariablesSelectService();
			getEle.selectServiceSeason.setValueState("None");
			getEle.selectServiceLocations.setValueState("None");
			getEle.selectServiceTeamName.setValueState("None");
			getEle.selectServiceItems.setValueState("None");
			getEle.selectItemStartDate.setValueState("None");
			getEle.selectItemQuantity.setValueState("None");
			var saleOrdMD = this.getView().getModel("MemberServices");
			var soData;
			var sbITKey = this.byId("sbItemType").getSelectedKey();

			if (getEle.selectItemQuantity.getValue() !== "") {
				getEle.selectItemQuantity.setValueState("None");
				// || saleOrdMD.getJSON() === "{}"
				if (saleOrdMD === null || saleOrdMD === undefined) {
					var memServiceMD = this.createServieModel();
					this.getView().setModel(memServiceMD, "MemberServices");
					saleOrdMD = this.getView().getModel("MemberServices");
				}
				soData = saleOrdMD.getData();
				var itemData = this.getView().getModel("ItemDetails").getData();
				var tmpObj = new Object();
				tmpObj.Item = itemData;
				tmpObj.ItemCode = itemData.ItemCode;
				tmpObj.Quantity = this.byId("memberQuantity").getValue();
				tmpObj.VatGroup = "V5O";
				//tmpObj.TaxCode = "V5O";
				tmpObj.FreeText = this.byId("memberRemarks").getValue();
				tmpObj.UnitPrice = itemData.ItemPrices[0].Price;
				tmpObj.TeamID = null;
				tmpObj.StartDate = null;
				if (sbITKey === "subscriptions") {
					this.getView().byId("memberQuantity").setValueState("None");
					var getdate = this.byId("memberStartDate").getValue();
					var fDt = this.toDateFormat(getdate);
					tmpObj.TeamID = this.byId("memberTeamName").getSelectedKey();
					tmpObj.StartDate = fDt;
				}
				soData.DocumentLines.push(tmpObj);
				this.getView().getModel("MemberServices").setData(soData);
				getEle.selectItemCreateOrder.setEnabled(true);
				this.byId("serviceTableID").setVisible(true);

				//	this.clearModels();
				this.clearTheValues();
			} else {
				getEle.selectItemQuantity.setValueState("Error");
			}

		},
		onCreateOrder: function() {
			var that = this;
			var getMemberServicesMDL = this.getView().getModel("MemberServices");

			if (getMemberServicesMDL !== undefined && getMemberServicesMDL !== null) {
				that.showLoading(true);
				this.createOrder(getMemberServicesMDL, "").done(function(obj) {
					that.clearTheValues();
					that.clearAllModels();
					that.showLoading(false);
					//that.getView().getModel(null, "MemberServices");
					that.getOwnerComponent().getRouter().navTo("CreateInvoice", {
						DocEntryID: obj.DocEntry,
						PageID: 62
					});
					/*	that.fetchMessageOkNavTo("Create Order", "Success", "  Created Successfully. \n Are You Want To Generate Invoice Now. ",
						"CreateInvoice", obj.DocEntry);*/
				}).fail(function(err) {
					var selSeason = that.getView().byId("sSeason");
					selSeason.setSelectedKey("-1");
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			} else {
				that.showLoading(false);
				that.fetchErrorMessageOk("Note", "Warning", "Please Select The Sport");
			}

		},
		onSelectSType: function(evt) {
			var selKey = evt.getSource().getSelectedKey();
			var getEle = this.getVariablesSelectService();
			switch (selKey) {
				case "admission":
					this.getView().byId("memberQuantity").setValueState("None");
					this.fetchItemDetails(104, "");
					this.byId("frmSubDetails").setVisible(false);
					this.byId("frmAdItems").setVisible(true);
					this.byId("durationType").setVisible(false);
					this._setSeleNameBtn = "admission";
					break;
				case "subscriptions":
					getEle.selectServiceSeason.setValueState("None");
					getEle.selectServiceLocations.setValueState("None");
					getEle.selectServiceTeamName.setValueState("None");
					getEle.selectServiceItems.setValueState("None");
					getEle.selectItemStartDate.setValueState("None");
					getEle.selectItemQuantity.setValueState("None");
					this.getView().byId("memberQuantity").setValueState("None");
					this.fetchSeasons();
					getEle.selectServiceTeamName.setEnabled(false);
					getEle.selectServiceLocations.setEnabled(false);
					getEle.selectServiceItems.setEnabled(false);
					this.byId("frmSubDetails").setVisible(true);
					this.byId("frmAdItems").setVisible(true);
					this._setSeleNameBtn = "subscriptions";
					this.byId("durationType").setVisible(true);
					break;
				case "items":
					this.getView().byId("memberQuantity").setValueState("None");
					this.fetchItemDetails(100, "");
					this.byId("frmSubDetails").setVisible(false);
					this.byId("frmAdItems").setVisible(true);
					this._setSeleNameBtn = "items";
					this.byId("durationType").setVisible(false);
					break;

			}
		},
		////////////////////////////////////////////////////////START API FETCH ON BASE //////////////////////////////////////////////////// 

		fetchSeasons: function() {
			var getEle = this.getVariablesSelectService();
			var that = this;
			getEle.selectServiceSeason.setBusy(true);
			var seaSAL = new SeasonSAL();
			var sFilter = "$filter=U_Status%20eq%20'1'";
			seaSAL.fetchSeason(that, sFilter).done(function(obj) {
				sap.ui.getCore().setModel(obj, "mSeasonsList");
				var selSeason = that.getView().byId("sSeason");
				var oItem = new sap.ui.core.Item({
					text: "Select Season",
					key: -1
				});
				selSeason.insertItem(oItem, 0);
				selSeason.setSelectedItem(oItem);
				selSeason.setBusy(false);
				getEle.selectServiceSeason.setBusy(false);

			}).fail(function(err) {
				getEle.selectServiceSeason.setBusy(false);
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		fetchLocations: function() {
			var that = this;
			var getEle = this.getVariablesSelectService();
			var locationsSAL = new LocationsSAL();
			getEle.selectServiceLocations.setBusy(true);
			var lFilter = "$filter=U_Status%20eq%20'1'";
			locationsSAL.fetchLocationsMasters(that, lFilter).done(function(getResponse) {
				getResponse.setSizeLimit(300);
				that.getView().setModel(getResponse, "LocationsList");
				var sLocations = new sap.ui.core.Item({
					text: "Select Location",
					key: -1
				});
				getEle.selectServiceLocations.insertItem(sLocations, 0);
				getEle.selectServiceLocations.setSelectedItem(sLocations);
				getEle.selectServiceLocations.setBusy(false);
				getEle.selectServiceLocations.setEnabled(true);
			}).fail(function(err) {
				getEle.selectServiceLocations.setBusy(false);
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		fetchTeams: function(getID) {
			var that = this;
			var newMDl = new JSONModel();
			var getEle = that.getVariablesSelectService();
			var teamMembership = new TeamsSAL();
			that.getView().setModel(newMDl, "ItemDeatils");
			that.getView().setModel(newMDl, "TeamModel");
			var tFilterTeams = encodeURI("$filter=U_Location eq '" + getID + "' and U_Season eq '" + this._getSeleSeasonCode + "'");
			getEle.selectServiceTeamName.setBusy(true);
			teamMembership.fetchTeams(that, tFilterTeams).done(function(objT) {
				that.getView().setModel(objT, "TeamsList");
				var sItem = new sap.ui.core.Item({
					text: "Select Team",
					key: -1
				});
				getEle.selectServiceTeamName.insertItem(sItem, 0);
				getEle.selectServiceTeamName.setSelectedItem(sItem);
				getEle.selectServiceTeamName.setBusy(false);
				getEle.selectServiceTeamName.setEnabled(true);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchMemberById: function() {
			var that = this;
			var emgLabel = that.getView().byId("emergencyContailLabel");
			var headerLoading = that.getView().byId("selectServiceObjectPageLayout");
			headerLoading.setBusy(true);
			var filter = "";
			that.showLoading(true);
			this.fetchBusinessPartnerById(this._getAccountID, filter).done(function(obj) {
				that.getView().setModel(obj, "LeadsDetails");
				that.updateEmgerencyPanelHide();
				that.showLoading(false);
				headerLoading.setBusy(false);
				emgLabel.setVisible(true);
			}).fail(function(err) {
				headerLoading.setBusy(false);
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchOrders: function() {
			var that = this;
			var getCode = this._getAccountID;
			that.showLoading(true);
			var filter = encodeURI("$filter=CardCode eq '" + getCode + "' ||$select=DocEntry,DocNum,DocumentLines,CreationDate");
			this.fetchOrder(filter).done(function(obj) {
				that.getView().setModel(obj, "ServiceDetails");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

		},
		fetchItemDetails: function(getGroupID, getCatCode) {
			var that = this;
			var filter;
			var getEle = that.getVariablesSelectService();
			getEle.selectServiceItems.setBusy(true);
			if (getCatCode !== "") {
				filter = encodeURI("$filter=U_CategorySports eq '" + getCatCode +
					"' and Valid eq 'tYES' ||$select=ItemCode,ItemName,U_Time,U_Duration,ItemPrices");
			} else {
				filter = encodeURI("$filter=ItemsGroupCode eq " + getGroupID + " and Valid eq 'tYES' ||$select=ItemCode,ItemName,U_Time,U_Duration,ItemPrices");
			}
			var sItem = new sap.ui.core.Item({
				text: "Select The Items",
				key: -1
			});
			var selectServicesSAL = new SelectServicesSAL();
			selectServicesSAL.fetchItems(filter).done(function(obj) {
				that.getView().setModel(obj, "ItemsList");
				getEle.selectServiceItems.insertItem(sItem, 0);
				getEle.selectServiceItems.setSelectedItem(sItem);
				getEle.selectServiceItems.setBusy(false);
				getEle.selectServiceItems.setEnabled(true);
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				getEle.selectServiceItems.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchItemByID: function(getID) {
			var that = this;
			var getEle = that.getVariablesSelectService();
			getEle.selectServiceItems.setBusy(true);
			var filter = encodeURI("$filter=ItemsGroupCode eq " + getID + "||$select=ItemCode,ItemName");
			var sItem = new sap.ui.core.Item({
				text: "Select The Items",
				key: -1
			});
			var selectServicesSAL = new SelectServicesSAL();
			selectServicesSAL.fetchItemByID(filter).done(function(obj) {
				that.getView().setModel(obj, "ItemsList");
				getEle.selectServiceItems.insertItem(sItem, 0);
				getEle.selectServiceItems.setSelectedItem(sItem);
				getEle.selectServiceItems.setBusy(false);
			}).fail(function(err) {
				that.showLoading(false);
				getEle.selectServiceItems.setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		// //////////////////////////////////////////////////////END API FETCH ON BASE //////////////////////////////////////////////////// 
		// //////////////////////////////////////////////////////START CLEAR DATA MODELS /////////////////////////////////////////////////
		clearModels: function() {
			var newjMdl = new JSONModel();
			this.getView().setModel(newjMdl, "ItemDetails");
		},
		clearAllModels: function() {
			var newjMdl = new JSONModel();
			this.getView().setModel(newjMdl, "TeamModel");
			this.getView().setModel(newjMdl, "LocationsList");
			this.getView().setModel(newjMdl, "TeamsList");
			this.getView().setModel(newjMdl, "LeadsDetails");
			this.getView().setModel(newjMdl, "ServiceDetails");
			this.getView().setModel(newjMdl, "ItemsList");
			this.getView().setModel(newjMdl, "MemberServices");
			this.getView().getModel("MemberServices").setData({});
			this.getView().setModel(null, "MemberServices");
			//this.getView().getModel("MemberServices").refresh(true);
			this.clearTheValues();

		},
		clearTheValues: function() {
			var newModel = new JSONModel();
			var getEle = this.getVariablesSelectService();
			getEle.selectServiceSeason.setSelectedKey("-1");
			getEle.selectServiceItems.setSelectedKey("-1");
			getEle.selectServiceTeamName.setSelectedKey("-1");
			getEle.selectServiceLocations.setSelectedKey("-1");
			getEle.selectItemStartDate.setValue("");
			this.byId("memberPostingDate").setValue("");
			getEle.selectItemStartDate.setValueState("None");
			getEle.selectServiceSportCategory.setValue("");
			getEle.selectItemQuantity.setValue("1");
			getEle.selectServiceSportsName.setValue("");
			this.getView().setModel(newModel, "TeamModel");
			this.getView().setModel(newModel, "ItemDetails");
			getEle.selectItemRemarks.setValue("");
			getEle.selectItemQuantity.setValueState("None");
			this.getView().byId("memberTotalPrices").setValue("");
			getEle.selectItemPrices.setValue("");

		},
		////////////////////////////////////////////////////////END CLEAR DATA MODELS /////////////////////////////////////////////////
		getVariablesSelectService: function() {
			var items = {
				selectServiceTeamName: this.getView().byId("memberTeamName"),
				selectServiceItems: this.getView().byId("memberService"),
				selectServiceSportCategory: this.getView().byId("memberSportCategory"),
				selectServiceSportsName: this.getView().byId("memberSportsName"),
				selectServiceSeason: this.getView().byId("sSeason"),
				selectServiceLocations: this.getView().byId("memberLocations"),
				//selectItemMonths: this.getView().byId("memberMonths"),
				//selectItemPeriods: this.getView().byId("memberPeriods"),
				selectItemPrices: this.getView().byId("memberPrices"),
				selectItemStartDate: this.getView().byId("memberStartDate"),
				selectItemCreateOrder: this.getView().byId("btnCreateOrder"),
				selectItemAddService: this.getView().byId("btnAddService"),
				selectItemQuantity: this.getView().byId("memberQuantity"),
				selectSeasonSimpleForm: this.getView().byId("ssSeasonSimpleForm"),
				selectItemRemarks: this.getView().byId("memberRemarks"),
				selectItemTotalPrices: this.getView().byId("memberTotalPrices")

			};
			return items;
		},
		onChangeTotalPrice: function(getPrice) {
			var getEle = this.getVariablesSelectService();
			var getQuantityValue = getEle.selectItemQuantity.getValue();
			var getQuantity = parseInt(getQuantityValue);
			var index = parseFloat(getPrice);
			if (getQuantityValue !== "") {
				var setTotalPrices = getQuantity * index;
				alert(setTotalPrices);
			} else {

			}
		},
		////////////////////////////////////////////////////////START CREATE DATA MODELS ////////////////////////////////////////////////////
		createServieModel: function() {
			var serviceMD = new JSONModel();
			var getDocDate = this.byId("memberPostingDate").getValue();
			var docDate = this.toDateFormat(getDocDate);
         	var setToday = new Date();
			var getToday = this.toDateFormat(setToday);
			var memMD = this.getView().getModel("LeadsDetails");
			var memData = memMD.getData();
			serviceMD.setProperty('/CardCode', memData.CardCode);
			serviceMD.setProperty('/CardName', memData.CardName);
			serviceMD.setProperty('/DocDate', docDate);
			serviceMD.setProperty('/DocDueDate', getToday);
			serviceMD.setProperty('/DocumentLines', []);
			return serviceMD;
		},
		////////////////////////////////////////////////////////END CREATE DATA MODELS //////////////////////////////////////////////////////

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
							DocEntryID: GetID,
							PageID: 63
						});
						messageOktDialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function() {
						messageOktDialog.close();
					}
				})
			});
			messageOktDialog.open();
		},
		////////////////////////////////////////////////////////END CREATE MESSAGES /////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////START I18n BUNDLE MEASSAGES /////////////////////////////////////////////////
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},
		////////////////////////////////////////////////////////END I18n BUNDLE MEASSAGES /////////////////////////////////////////////////
		////////////////////////////////////////////////////////START LIVE CHANGE FUNCTION////////////////////////////////////////////////////////
		onChangeQuantity: function() {
			var getEle = this.getVariablesSelectService();
			var getQuantityValue = getEle.selectItemQuantity.getValue();
			var getSelectItemPrices = getEle.selectItemPrices.getValue();
			getSelectItemPrices = getSelectItemPrices.replace(/,/g, "");
			var getQuantity = parseInt(getQuantityValue);
			getSelectItemPrices = parseFloat(getSelectItemPrices).toFixed(2);
			if (getQuantityValue !== "") {
				var setTotalPrices = parseFloat(getQuantity * getSelectItemPrices).toFixed(2);
				this.getView().byId("memberTotalPrices").setValue(setTotalPrices);
			} else {
				this.getView().byId("memberTotalPrices").setValue("00.00");
			}

		},
		////////////////////////////////////////////////////////END LIVE CHANGE FUNCTION ////////////////////////////////////////////////////////

		onBack: function() {
			var getPageID = this._pageID;
			this.clearAllModels();
			switch (getPageID) {
				case "27":
					this.getOwnerComponent().getRouter()
						.navTo("SearchMembership");
					break;
				case "62":
					this.getOwnerComponent().getRouter()
						.navTo("ViewAccount", {
							AccountId: this._getAccountID,
							PageID: 27
						});
					break;

				default:
					break;
			}
		},
		///Here function for Emgerency Panel Hide
		updateEmgerencyPanelHide: function() {
			var that = this;
			var getModleId = this.getView().getModel("LeadsDetails");
			var emgLabel = that.getView().byId("emergencyContailLabel");
			var emgPanel = that.getView().byId("emgPanleId");
			if (getModleId.oData.ContactEmployees.length === "") {
				emgLabel.setVisible(false);
				emgPanel.setVisible(false);
			} else {
				emgLabel.setVisible(true);
				emgPanel.setVisible(true);
			}
		},
		// Dialog for member schedule inside calendar
		handleExistingSchedulePress: function(evt) {
			var that = this;
			if (!that._oDialog) {
				that._oDialog = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.dialogs.MemberSchedule", that);
				that._oDialog.setModel(that.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._oDialog);
			that._oDialog.open();
		},
		handleMemberScheduleClose: function(evt) {
			var that = this;
			that._oDialog.close();
		}
	});
});