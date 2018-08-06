sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/SportsSAL",
	"sap/ui/model/json/JSONModel",
		"sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
], function(SportsSAL, JSONModel, ValueState, Validator) {
	"use strict";
	return SportsSAL.extend("com.ss.app.StryxSports.controller.details.edit.EditSport", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("EditSport").attachMatched(this._onRouteMatched, this);
			// Attach Validation Handlers
			sap.ui.getCore().attachValidationError(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.None);
			});
		},
		onAfterRendering: function() {
			var txt = this.getView().byId("eSportName");

			txt.addDelegate({
				onsapenter: function(e) {
					var view = this.getView();
					view.getController().onClick();
				}
			});
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
			that.showLoading(true);
			var getSportsID = oEvent.getParameter("arguments").SportID;
			var sportModel = new JSONModel();
			this.fetchSportsById(sportModel, getSportsID).done(function(jMdl) {
				that.getView().setModel(jMdl, "SportsModel");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "Sports");
			});
			var ret = 0;
			var getSportsEditId = that.getVariables();
			getSportsEditId.eSportName.setValueState("None");
		},
		onPressSaveEditSports: function() {
			var that = this;
			var getVarEditSports = this.getVariables();
			var validator = new Validator();
			var retVal = validator.validate(that.getView().byId("frmESports"));
			if (retVal) {
				getVarEditSports.eSportDescription.setValueState("None");
				var jModel = that.getView().getModel("SportsModel");
				this.showLoading(true);
				this.updateSports(jModel).done(function() {
					var filt = "$orderby=Code%20desc";
					that.fetchSports(that, filt).done(function(obj) {
						var jMdl = obj;
						var editsportmessage = that.oBundle("UpdatedSuccessfully");
						that.showLoading(true);
						sap.ui.getCore().setModel(jMdl, "SportsList");
						that.fetchMessageOk("Edit Sports", "Success", editsportmessage, "Sports");
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "Sports");
					});
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "Sports");
				});
			}
		},

		getVariables: function() {
			var varEditSport = {
				eSportName: this.getView().byId("eSportName"),
				eSportDescription: this.getView().byId("eSportDescription"),
				eSportStatus: this.getView().byId("eSportStatus")
			};
			return varEditSport;
		},
		onPressCloseEditSports: function() {
			var closesportmessage = this.oBundle("YourChangesWillBeLost");
			this.onDialogState("Note", "Warning", closesportmessage, "Sports");
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		}
	});
});