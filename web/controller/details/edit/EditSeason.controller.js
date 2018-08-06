sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"com/ss/app/StryxSports/controller/sal/SeasonSAL",
	"sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
], function(JSONModel, SeasonSAL, ValueState, Validator) {
	"use strict";
	return SeasonSAL.extend("com.ss.app.StryxSports.controller.details.edit.EditSeason", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("EditSeason").attachMatched(this._onRouteMatched, this);

			sap.ui.getCore().attachValidationError(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.None);
			});
		},
		_onRouteMatched: function(oEvent) {
			var setThis = this;
			var passSeasonID = oEvent.getParameter("arguments").seasonID;
			this.getView().setBusy(true);
			var seasonModel = new JSONModel();
			this.fetchSeasonById(seasonModel, passSeasonID).done(function(getResponse) {
				setThis.getView().setModel(getResponse, "SeasonEdit");
				setThis.showLoading(false);
			}).fail(function(err) {
				setThis.showLoading(false);
				setThis.fetchMessageOk("Edit Seasons", "Error", err, "DashBoard");
			});
			var getSeasonEditId = this.getVariables();
			getSeasonEditId.editSeasonsName.setValueState("None");
			getSeasonEditId.editSeasonsEndDate.setValueState("None");
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
		onPressEditSaveSeasons: function() {
			var setThis = this;
			var getEditSeasonsObj = this.getVariables();
			var validator = new Validator();
			var retVal = validator.validate(this.byId("efrmSeason"));
			if (getEditSeasonsObj.editSeasonsEndDate.getValue() === "") {
				getEditSeasonsObj.editSeasonsEndDate.setValueState("Error");
			} else if (retVal) {
				var getEditSeasonModel = setThis.getView().getModel("SeasonEdit");
				var getFromDate = getEditSeasonsObj.editSeasonsEndDate.getFrom();
				var getToDate = getEditSeasonsObj.editSeasonsEndDate.getTo();
				var startDate = this.toDateFormat(getFromDate);
				var EndDate = this.toDateFormat(getToDate);
				try {
					getEditSeasonModel.setProperty("/U_StartDate", startDate);
					getEditSeasonModel.setProperty("/U_EndDate", EndDate);
				} catch (e) {
					console.log(e.toString());
				}
				setThis.showLoading(true);
				this.updateSeason(getEditSeasonModel).done(function() {
					setThis.fetchSeason(setThis).done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "SeasonMaster");
						var seasonssave = setThis.oBundle("UpdatedSuccessfully");
						setThis.fetchMessageOk("Edit Seasons", "Success", seasonssave, "Seasons");
						setThis.showLoading(false);
					}).fail(function(err) {
						setThis.showLoading(false);
						setThis.fetchMessageOk("Edit Seasons", "Error", err, "Seasons");
					});

				}).fail(function(err) {
					setThis.fetchMessageOk("Edit Seasons", "Error", err, "Seasons");
					setThis.showLoading(false);
				});
			}
		},
		getVariables: function() {
			var editSeasonObj = {
				editSeasonsName: this.getView().byId("editSeasons"),
				editSeasonsEndDate: this.getView().byId("editSeasonsStartEndDates"),
				editDescription: this.getView().byId("editDescription"),
				editSeasonsStatus: this.getView().byId("editSeasonsStatus")
			};
			return editSeasonObj;
		},
		onPressEditCancelSeasons: function() {
			var seasonsclose = this.oBundle("YourChangesWillBeLost");
			this.onDialogState("Note", "Warning", seasonsclose, "Seasons");
			var getSeasonEditId = this.getVariables();
			getSeasonEditId.editSeasonsName.setValueState("None");
			getSeasonEditId.editSeasonsEndDate.setValueState("None");
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		}
	});
});