sap.ui.define([
		"com/ss/app/StryxSports/controller/sal/CoachsSAL",
		"com/ss/app/StryxSports/controller/sal/SportsSAL",
		"sap/ui/model/Filter"
		], function(CoachsSAL, SportsSAL, Filter) {
	"use strict";
	return CoachsSAL.extend("com.ss.app.StryxSports.controller.details.CoachesDetail", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("CoachesDetail").attachMatched(this._onRouteMatched, this);
		},
		onBackCoaches: function() {
			this.getOwnerComponent().getRouter().navTo("Coaches");
		},
		_onRouteMatched: function(oEvent) {
			var getEle = oEvent.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			var context = this.getContext();
			context.PageID = this._setViewLevel;
			this.setContext(context);
			var getEmployeeID = oEvent.getParameter("arguments").EmployeeID;
			var setThis = this;
			setThis.showLoading(true);
			this.fetchEmployeesInfo(getEmployeeID).done(function(getResponse) {
				setThis.getView().setModel(getResponse, "CoachDetail");
				setThis.showLoading(false);
			}).fail(function(err) {
				setThis.showLoading(false);
				setThis.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		editSportsCoachesTable: function() {
			var that = this;
			that.showLoading(true);
			var sportSal = new SportsSAL();
			var jModel;
			var filt = "$filter=U_Status%20eq%20'1'";
			sportSal.fetchSports(that, filt).done(function(obj) {
				var sportVal = obj.oData.value;
				var eModel = that.getView().getModel("CoachDetail");
				var selSportVal = eModel.oData.CoachSports;
				var finalSports = [];
				if (sportVal.length > 0) {
					for (var i = 0; i < sportVal.length; i++) {
						var isPush = true;
						for (var j = 0; j < selSportVal.length; j++) {
							if (selSportVal[j].sports.Code === sportVal[i].Code) {
								isPush = false;
								break;
							}
						}
						if (isPush) {
							finalSports.push(sportVal[i]);
						}
						isPush = false;
					}
				}
				obj.oData.value = finalSports;
				jModel = obj;
				sap.ui.getCore().setModel(jModel, "SportsList");
				sap.ui.getCore().getModel("SportsList").refresh(true);
				that.showLoading(false);
				// Multi-select if required
				that._addCoachSportNameTable.setMultiSelect(true);
				that._addCoachSportNameTable.open();
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

			if (!that._addCoachSportNameTable) {
				that._addCoachSportNameTable = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.editCoachesSportsTable", this);
				that._addCoachSportNameTable.setModel(this.getView().getModel());
			}
		},
		onAddSportToCoaches: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				var scModel = this.getView().getModel("CoachDetail");
				for (var i = 0; i < aContexts.length; i++) {
					var spt = aContexts[i].getObject(); //.rec_status = 'n';
					var obj = {};
					obj.sports = spt;
					obj.Code = 0;
					obj.Name = scModel.oData.EmployeeID + "-" + spt.Code.toString();
					obj.U_EmployeeCode = scModel.oData.EmployeeID;
					obj.U_SportCode = spt.Code;
					obj.rec_status = 'n';
					scModel.oData.CoachSports.push(obj);
				}
				scModel.refresh(true);
			}
		},
		onDeleteCatSport: function(oEvent) {
			var src = oEvent.getSource();
			var getParent = src.getParent();
			var getId = getParent.getId();
			var getCore = sap.ui.getCore();
			var item = getCore.byId(getId);
			var ctx = src.getBindingContext("CoachDetail");
			var obj = ctx.getObject();

			switch (obj.rec_status) {
				case "e":
					obj.rec_status = "de";
					//item.$().css('background-color', '#ffb3b3');
					break;
				case "n":
					obj.rec_status = "dn";
					//	item.$().css('background-color', '#FFFFFF');
					break;
				case "de":
					obj.rec_status = "e";
					//	item.$().css('background-color', '#FFFFFF');
					break;
				case "dn":
					obj.rec_status = "n";
					//	item.$().css('background-color', '#ffb3b3');
					break;
				default:
					// 		item.$().css('background-color', '#FFFFFF');
					break;
			}
			this.getView().getModel("CoachDetail").refresh(true);
		},
		getVariables: function() {
			var varEditSport = {
				sportAddTable: this.getView().byId("tableAddSport")
			};
			return varEditSport;
		},
		onPressSaveAddSportsCoaches: function() {
			var setThis = this;
			var sportsCoachesitems = setThis.getView().getModel("CoachDetail");
			var tmpSportObj = sportsCoachesitems.oData;
			var tmpObj = [];
			setThis.showLoading(true);
			if (tmpSportObj.CoachSports.length > 0) {
				for (var i = 0; i < tmpSportObj.CoachSports.length; i++) {
					if (tmpSportObj.CoachSports[i].rec_status !== "dn") {
						tmpObj.push(tmpSportObj.CoachSports[i]);
					}
				}
				sportsCoachesitems.oData.CoachSports = tmpObj;
			}
			setThis.updataSportCategoryDetails(sportsCoachesitems).done(function() {
				setThis.fetchEmployeesInfo(tmpSportObj.EmployeeID).done(function(getResponse) {
					setThis.getView().setModel(getResponse, "CoachDetail");
					setThis.showLoading(false);
					var sportcoachesedit = setThis.oBundle("UpdatedSuccessfully");
					setThis.fetchMessageOk("Coach Detail", "Success", sportcoachesedit, "Coaches");
				}).fail(function(err) {
					setThis.showLoading(false);
					setThis.fetchMessageOk("Error", "Error", err.toString(), "Coaches");
				});
			}).fail(function(err) {
				setThis.showLoading(false);
				setThis.fetchMessageOk("Error", "Error", err.toString(), "Coaches");
			});
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},
		//Here function for sport table search 
		handleSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		}
	});
});