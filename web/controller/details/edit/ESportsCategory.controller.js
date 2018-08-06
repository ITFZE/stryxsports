 sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/SportCategorySAL",
	"com/ss/app/StryxSports/controller/sal/SportsSAL",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
], function(SportCategorySAL, SportsSAL, JSONModel, Filter, ValueState, Validator) {
 	return SportCategorySAL.extend("com.ss.app.StryxSports.controller.details.edit.ESportsCategory", {
 		isRender: false,
 		onInit: function() {
 			var oRouter = this.getRouter();
 			oRouter.getRoute("EditSportsCategory").attachMatched(this._onRouteMatched, this);

 			// Attach Validation Handlers
 			sap.ui.getCore().attachValidationError(function(oEvent) {
 				oEvent.getParameter("element").setValueState(ValueState.Error);
 			});
 			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
 				oEvent.getParameter("element").setValueState(ValueState.None);
 			});
 		},
 		onAfterRendering: function() {
 			var txt = this.getView().byId("editSportsCategoryName");

 			txt.addDelegate({
 				onsapenter: function(e) {
 					var view = this.getView();
 					view.getController().onClick();
 				}
 			});
 		},
 		onBeforeRendering: function() {
 			this.isRender = true;
 		},
 		_onRouteMatched: function(oEvent) {
 			var getCodeID = oEvent.getParameter("arguments").sportsCategoryID;
 			var setThis = this;
 			this.showLoading(true);
 			var sportCategoryModel = new JSONModel();
 			setThis.getView().setModel(sportCategoryModel, "SportsCategoryEdit");
 			this.fetchSportCategoryDetail(sportCategoryModel, getCodeID).done(function(getResponse) {
 				setThis.showLoading(false);
 				setThis.getView().setModel(getResponse, "SportsCategoryEdit");
 			}).fail(function(err) {
 				setThis.showLoading(false);
 				setThis.fetchMessageOk("Error", "Error", err.toString(), "SportsCategory");
 			});
 			var getSportsCategoyrEditId = this.getVariables();
 			getSportsCategoyrEditId.eSportsCategoryName.setValueState("None");
 		},
 		editSportsCategoryTable: function() {
 			var that = this;
 			that.showLoading(true);
 			var sportSal = new SportsSAL();
 			var jModel;
 			var filt = "$filter=U_Status%20eq%20'1'";
 			sportSal.fetchSports(that, filt).done(function(obj) {
 				var sportsVal = obj.oData.value;
 				var eModel = that.getView().getModel("SportsCategoryEdit");
 				var selSportsVal = eModel.oData.sports;
 				var finalSports = [];
 				if (sportsVal.length > 0) {
 					for (var i = 0; i < sportsVal.length; i++) {
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
 				that.showLoading(false);
 				// Multi-select if required
 				that._addSportNameTable.setMultiSelect(true);
 				that._addSportNameTable.open();
 			}).fail(function(err) {
 				that.showLoading(false);
 				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
 			});

 			if (!that._addSportNameTable) {
 				that._addSportNameTable = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.editSportsCategoryTableList", this);
 				that._addSportNameTable.setModel(this.getView().getModel());
 			}
 		},
 		onAddSportToCat: function(oEvent) {
 			var aContexts = oEvent.getParameter("selectedContexts");
 			if (aContexts && aContexts.length) {
 				var scModel = this.getView().getModel("SportsCategoryEdit");
 				for (var i = 0; i < aContexts.length; i++) {
 					aContexts[i].getObject().rec_status = 'n';
 					scModel.oData.sports.push(aContexts[i].getObject());
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
 			var ctx = src.getBindingContext("SportsCategoryEdit");
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
 			this.getView().getModel("SportsCategoryEdit").refresh(true);
 		},
 		onPressSaveSportsCategory: function() {
 			var setThis = this;
 			var validator = new Validator();
 			var retVal = validator.validate(setThis.getView().byId("frmCategory"));
 			if (retVal) {
 				var getModelSportCategory = setThis.getView().getModel("SportsCategoryEdit");
 				var tmpSportObj = getModelSportCategory.oData;
 				var tmpObj = [];
 				this.showLoading(true);
 				if (tmpSportObj.sports.length > 0) {
 					for (var i = 0; i < tmpSportObj.sports.length; i++) {
 						if (tmpSportObj.sports[i].rec_status !== "dn") {
 							tmpObj.push(tmpSportObj.sports[i]);
 						}
 					}
 					getModelSportCategory.oData.sports = tmpObj;
 				}
 				this.updataSportCategoryDetails(getModelSportCategory).done(function() {
 					setThis.fetchSportCategoryMasters(setThis).done(function(getResponse) {
 						sap.ui.getCore().setModel(getResponse, "SportsCategoryMaster");
 						setThis.showLoading(true);
 						var sportcategoryedit = setThis.oBundle("UpdatedSuccessfully");
 						setThis.fetchMessageOk("Edit SportsCategory", "Success", sportcategoryedit, "SportsCategory");
 					}).fail(function(err) {
 						setThis.showLoading(false);
 						setThis.fetchMessageOk("Error", "Error", err.toString(), "SportsCategory");
 					});
 				}).fail(function(err) {
 					setThis.showLoading(false);
 					setThis.fetchMessageOk("Error", "Error", err.toString(), "SportsCategory");
 				});

 			}
 		},
 		getVariables: function() {
 			var varEditSport = {
 				eSportsCategoryName: this.getView().byId("editSportsCategoryName"),
 				eSportsCategoryDescription: this.getView().byId("editSportsCategoryDescription"),
 				eSportsCategroyStatus: this.getView().byId("editSportsCategroyStatus")
 			};
 			return varEditSport;
 		},
 		onPressCloseSportsCategory: function() {
 			var closesportcategory = this.oBundle("YourChangesWillBeLost");
 			this.onDialogState("Note", "Warning", closesportcategory, "SportsCategory");
 			this.getView().byId("editSportsCategoryName").setValueState("None");
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