sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/SportCategorySAL",
	"com/ss/app/StryxSports/controller/sal/SportsSAL",
	"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
], function(SportCategorySAL, SportsSAL, JSONModel, Filter, ValueState, Validator) {
	"use strict";
	return SportCategorySAL.extend("com.ss.app.StryxSports.controller.details.SportCategoryDetail", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("SportsCategory").attachMatched(this._onRouteMatched, this);

			// Attach Validation Handlers
			sap.ui.getCore().attachValidationError(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.None);
			});
			this.eModel = "";
		},
		_onRouteMatched: function(oEvt) {
			var getEle = oEvt.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			var context = this.getContext();
			context.PageID = this._setViewLevel;
			this.setContext(context);

			var getSportsId = this.getVariables();
			var sportCategoryModel = new JSONModel();
			sportCategoryModel.setProperty('/Code', 0);
			sportCategoryModel.setProperty('/U_Status', 1);
			sportCategoryModel.setProperty('/sports', []);
			this.getView().setModel(sportCategoryModel, "createSportCategoryModel");
			getSportsId.addSportsCategoryName.setValueState("None");
			getSportsId.addSportsCategoryDescription.setValueState("None");
			//var getVariables = this.getVariables();
			//getVariables.sportAddTable.setVisible(false);
		},
		onAfterRendering: function() {
			var txt = this.getView().byId("addSportsCategoryName");

			txt.addDelegate({
				onsapenter: function(e) {
					var view = this.getView();
					view.getController().onClick();
				}
			});
		},
		onPressAddSportNameTable: function() {
			var setThis = this;
			this.showLoading(true);
			var sportSal = new SportsSAL();
			var jModel;
			setThis.eModel = setThis.getView().getModel("createSportCategoryModel");
			var selSportsVal = setThis.eModel.oData.sports;
			var filt = "$filter=U_Status%20eq%20'1'";
			sportSal.fetchSports(this, filt).done(function(obj) {
				var sportsVal = obj.oData.value;
				var finalSports = [];
				if (sportsVal.length > 0) {
					for (var i = 0; i < sportsVal.length; i++) {
						// 		finalSports.push(sportsVal[i]);
						var isPush = true;
						for (var j = 0; j < selSportsVal.length; j++) {
							if (selSportsVal[j].Code === sportsVal[i].Code) {
								isPush = false;
								break;
							}
						}
						if (isPush) {
							finalSports.push(sportsVal[i]);
						}
						isPush = false;
					}
				}
				obj.oData.value = finalSports;
				jModel = obj;
				sap.ui.getCore().setModel(jModel, "SportsList");
				sap.ui.getCore().getModel("SportsList").refresh(true);
				setThis.showLoading(false);
				/*jModel = obj;
				sap.ui.getCore().setModel(jModel, "SportsList");
				sap.ui.getCore().getModel("SportsList").refresh(true);
				setThis.showLoading(false);*/
				// Multi-select if required
				setThis._DialogAddSportNameTable.setMultiSelect(true);
				setThis._DialogAddSportNameTable.open();
			}).fail(function(err) {
				setThis.showLoading(false);
				setThis.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});

			if (!this._DialogAddSportNameTable) {
				this._DialogAddSportNameTable = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.addSportNameTable", this);
				this._DialogAddSportNameTable.setModel(this.getView().getModel());
			}
		},
		/*onPressSaveSportName: function() {
			var getAddSportName = this.getView().byId("addSportsCategoryTable");
			getAddSportName.setVisible(true);
		},*/
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},
		/*		onPressAddFilterSportTable: function() {
			if (!this._DialogAddFilterSports) {
				this._DialogAddFilterSports = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.filters.fSports",
					this);
				this._DialogAddFilterSports.setModel(this.getView().getModel());
			}
			this._DialogAddFilterSports.open();
		},*/
		onAddSportToCat: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				var scModel = this.getView().getModel("createSportCategoryModel");
				for (var i = 0; i < aContexts.length; i++) {
					scModel.oData.sports.push(aContexts[i].getObject());
				}
				scModel.refresh(true);
			}
		},
		dialogSportsCloseFilter: function() {
			this._DialogAddFilterSports.close();
		},
		onDeleteCatSport: function(oEvent) {
			var src = oEvent.getSource();
			var ctx = src.getBindingContext("createSportCategoryModel");
			var mdl = ctx.getModel();
			var mdData = mdl.getData();
			var path = ctx.getPath();
			var index = parseInt(path.substring(path.lastIndexOf('/') + 1));
			mdData.sports.splice(index, 1);
			mdl.setData(mdData);
			//this.getView().getModel("SportsCategoryEdit").refresh(true);
		},
		////Functionality for Add Save////
		onPressSaveAddSportsCategory: function() {
			var validator = new Validator();
			var setThis = this;
			var getVariables = this.getVariables();
			var retVal = validator.validate(setThis.getView().byId("AddSportsCategoryDehtails"));
			if (retVal) {
				var getModel = this.getView().getModel("createSportCategoryModel");
				this.showLoading(true);
				setThis.fetchSportCategoryMasters(this, "$filter=Name%20eq%20'" + getModel.oData.Name + "'").done(function(ret) {
					if (ret.oData.value.length <= 0) {
						setThis.createSportCategory(getModel).done(function() {
							setThis.fetchSportCategoryMasters(setThis).done(function(getResponse) {
								setThis.showLoading(false);
								var sportcategorysave = setThis.oBundle("CreatedSuccessfully");
								sap.ui.getCore().setModel(getResponse, "SportsCategoryMaster");
								var sportCategoryModel = new JSONModel();
								sportCategoryModel.setProperty('/Code', 0);
								sportCategoryModel.setProperty('/U_Status', 1);
								sportCategoryModel.setProperty('/sports', []);
								setThis.getView().setModel(sportCategoryModel, "createSportCategoryModel");
								setThis.fetchMessageOk("Create SportsCategory", "Success", sportcategorysave, "SportsCategory");
								getVariables.sportAddTable.setVisible(true);

							}).fail(function(err) {
								setThis.showLoading(false);
								setThis.fetchMessageOk("Error", "Error", err.toString(), "SportsCategory");
							});
						}).fail(function(err) {
							setThis.showLoading(false);
							setThis.fetchMessageOk("Error", "Error", err.toString(), "SportsCategory");
						});
					} else {
						var inpSportCat = setThis.byId("addSportsCategoryName");
						inpSportCat.setValueState(sap.ui.core.ValueState.Error);
						inpSportCat.setValueStateText("Entered sport category name already exists!");
						setThis.showLoading(false);
						setThis.fetchMessageOk("Error", "Error", "Record Name already exixts", "SportsCategory");
					}
				}).fail(function(err) {
					setThis.showLoading(false);
					setThis.fetchMessageOk("Error", "Error", err.toString(), "SportsCategory");
				});
			}
		},

		onPressAddCancelSportsCategory: function() {
			var getDetailsVariables = this.getVariables();
			getDetailsVariables.addSportsCategoryName.setValue("");
			getDetailsVariables.addSportsCategoryDescription.setValue("");
			getDetailsVariables.addSportsCategroyStatus.setSelectedKey("Active");
			getDetailsVariables.addSportsCategoryName.setValueState("None");
			this.getOwnerComponent().getRouter().navTo("SportsCategory");
		},
		getVariables: function() {
			var varEditSport = {
				addSportsCategoryName: this.getView().byId("addSportsCategoryName"),
				addSportsCategoryDescription: this.getView().byId("addSportsCategoryDescription"),
				addSportsCategroyStatus: this.getView().byId("addSportCategoryStatus"),
				sportAddTable: this.getView().byId("tableAddSport")
			};
			return varEditSport;
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