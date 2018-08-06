sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/SportsSAL",
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
], function(SportsSAL, JSONModel, ValueState, Validator) {
	"use strict";
	return SportsSAL.extend("com.ss.app.StryxSports.controller.details.SportDetails", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("Sports").attachMatched(this._onRouteMatched, this);
			// Attaches validation handlers
			sap.ui.getCore().attachValidationError(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.None);
			});
			var sportModel = new JSONModel();
			this.getView().setModel(sportModel, "SportsModel");
		},
		_onRouteMatched: function(oEvt) {
			var getEle = oEvt.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			var context = this.getContext();
			context.PageID = this._setViewLevel;
			this.setContext(context);

			var getVariables = this.getVariables();
			var sportModel = this.getView().getModel("SportsModel");
			sportModel.setProperty('/Code', 0);
			sportModel.setProperty('/Name', "");
			sportModel.setProperty('/U_SportsDescription', "");
			sportModel.setProperty('/U_Status', 1);
			this.getView().setModel(sportModel, "SportsModel");
			getVariables.sportName.setValueState("None");
		},

		// 		onAfterRendering: function() {
		// 			var txt = this.getView();
		// 			txt.addDelegate({
		// 				onsapenter: function(e) {
		// 					var view = this.getView();
		// 					view.getController().onClick();
		// 				}
		// 			});
		// 		},
		onAfterRendering: function() {
			var view = this.getView();
			view.addDelegate({
				onsapenter: function(e) {
					view.getController().onPressSaveAddSports();
				}
			});
		},
		onPressSaveAddSports: function() {
			var validator = new Validator();
			var that = this;
			var retVal = validator.validate(this.byId("frmSports"));
			if (retVal) {
				var jModel = that.getView().getModel("SportsModel");
				that.showLoading(true);
				that.fetchSports(this, "$filter=Name%20eq%20'" + jModel.oData.Name + "'").done(function(ret) {
					if (ret.oData.value.length <= 0) {
						that.createSports(jModel).done(function() {
							var filt = "$orderby=Code%20desc";
							that.fetchSports(that, filt).done(function(obj) {
								var jMdl = obj;
								var createmessage = that.oBundle("CreatedSuccessfully");
								sap.ui.getCore().setModel(jMdl, "SportsList");
								that.showLoading(false);
								that.fetchMessageOk("Create Sports", "Success", createmessage, "Sports");
							}).fail(function(err) {
								that.showLoading(false);
								that.fetchMessageOk("Error", "Error", err.toString(), "Sports");
							});
						}).fail(function(err) {
							that.showLoading(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "Sports");
						});
					} else {
						var inpSport = that.byId("inputSportName");
						inpSport.setValueState(sap.ui.core.ValueState.Error);
						inpSport.setValueStateText("Entered sport name already exists!");
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", "Record already exixts", "Sports");
					}
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "Sports");
				});
			}
		},

		onPressCloseSports: function() {
			var getDetailsVariables = this.getVariables();
			getDetailsVariables.sportName.setValue("");
			getDetailsVariables.sportDescription.setValue("");
			getDetailsVariables.sportStatus.setSelectedKey("Active");
			getDetailsVariables.sportName.setValueState("None");
			this.getOwnerComponent().getRouter().navTo("Sports");
		},
		onPressEditSport: function() {
			this.getOwnerComponent().getRouter()
				.navTo("EditSport");
		},
		onPressSportSave: function() {

		},
		getVariables: function() {
			var sports = {
				sportName: this.getView().byId("inputSportName"),
				sportDescription: this.getView().byId("inputSportDescription"),
				sportStatus: this.getView().byId("addSportStatus")
			};
			return sports;
		},
		oBundle: function(getToastMessage, fetchMessageOk) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage, fetchMessageOk);
			return getValues;
		},
		onBack: function() {
			this.getOwnerComponent().getRouter().navTo("Sports");
		}
	});

});