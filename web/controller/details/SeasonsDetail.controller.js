sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/SeasonSAL",
	"sap/ui/model/json/JSONModel",
	 "sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
], function(SeasonSAL, JSONModel, ValueState, Validator) {
	"use strict";
	return SeasonSAL.extend("com.ss.app.StryxSports.controller.details.SeasonsDetail", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("Seasons").attachMatched(this._onRouteMatched, this);
			sap.ui.getCore().attachValidationError(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.None);
			});
			var seasonModel = new JSONModel();
			this.getView().setModel(seasonModel, "createSeasonModel");
	
		},
		_onRouteMatched: function(oEvt) {
			var getEle = oEvt.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			var context = this.getContext();
			context.PageID = this._setViewLevel;
			this.setContext(context);
			var getSeasonId = this.getVariables();
			var seasonModel = new JSONModel();
			seasonModel.setProperty('/Code', 0);
			seasonModel.setProperty('/U_Status', 1);
			seasonModel.setProperty('/U_StartDate');
			seasonModel.setProperty('/U_EndDate');
			this.getView().setModel(seasonModel, "createSeasonModel");
			getSeasonId.addSeasonsName.setValueState("None");
			getSeasonId.addSeasonsStartEndDates.setValueState("None");
			getSeasonId.addSeasonsStartEndDates.setValue("");
			var getToday = new Date();
			this.getView().byId("addSeasonsStartEndDates").setMinDate(getToday);
			
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
		validationDate: function() {
			var getEle = this.getVariables();
			if (getEle.addSeasonsStartEndDates.getValue() === "") {
				getEle.addSeasonsStartEndDates.setValueState("Error");
			} else {
				getEle.addSeasonsStartEndDates.setValueState("None");
			}
		},
		//Functionality for Add Save//
		onPressAddSaveSeasons: function() {
			var setThis = this;
			var getVariables = this.getVariables();
			var validator = new Validator();
			var retVal = validator.validate(this.byId("frmSeason"));
			if (getVariables.addSeasonsStartEndDates.getValue() === "") {
				getVariables.addSeasonsStartEndDates.setValueState("Error");
			} else if (retVal) {
				var getCreateSeasonModel = setThis.getView().getModel("createSeasonModel");
				setThis.onStartDataEndDateValidation();
				var getFromDate = getVariables.addSeasonsStartEndDates.getFrom();
				var getToDate = getVariables.addSeasonsStartEndDates.getTo();
				var cStartDate = this.toDateFormat(getFromDate);
				var cEndDate = this.toDateFormat(getToDate);
				try {
					getCreateSeasonModel.setProperty("/U_StartDate", cStartDate);
					getCreateSeasonModel.setProperty("/U_EndDate", cEndDate);
				} catch (e) {
					console.log(e.toString());
				}
				var jModel = setThis.getView().getModel("createSeasonModel");
				this.showLoading(true);
				setThis.fetchSeason(this, "$filter=Name%20eq%20'" + jModel.oData.Name + "'").done(function(ret) {
					if (ret.oData.value.length <= 0) {
						setThis.createSeason(jModel).done(function() {
							var lAFilter = "$orderby=Code%20desc";
							setThis.fetchSeason(setThis, lAFilter).done(function(obj) {
								setThis.showLoading(false);
								sap.ui.getCore().setModel(obj, "SeasonMaster");
								setThis.fetchMessageOk("Create Seasons", "Success", "Created successfully.", "Seasons");
								getVariables.addSeasonsStartEndDates.setValue("");
							}).fail(function(err) {
								setThis.showLoading(false);
								setThis.fetchMessageOk("Error", "Error", err.toString(), "Seasons");
							});
						}).fail(function(err) {
							setThis.showLoading(false);
							setThis.fetchMessageOk("Error", "Error", err.toString(), "Seasons");
						});
					} else {
						var inpSport = setThis.byId("addSeasons");
						inpSport.setValueState(sap.ui.core.ValueState.Error);
						inpSport.setValueStateText("Entered season name already exists!");
						setThis.showLoading(false);
						setThis.fetchMessageOk("Error", "Error", "Record already exixts", "Seasons");
					}
				}).fail(function(err) {
					setThis.showLoading(false);
					setThis.fetchMessageOk("Error", "Error", err.toString(), "Seasons");
				});
			}
		},
		onPressAddCanelSeasons: function() {
			var getVariables = this.getVariables();
			getVariables.addSeasonsName.setValue("");
			getVariables.addDescription.setValue("");
			getVariables.addSeasonsStartEndDates.setValue("");
			getVariables.addSeasonsStatus.setSelectedKey("active");
			// set value states to none
			getVariables.addSeasonsName.setValueState("None");
			getVariables.addSeasonsStartEndDates.setValueState("None");
			getVariables.addDescription.setValueState("None");
			this.getOwnerComponent().getRouter().navTo("Seasons");
		},
		getVariables: function() {
			var seasons = {
				addSeasonsName: this.getView().byId("addSeasons"),
				addSeasonsStartEndDates: this.getView().byId("addSeasonsStartEndDates"),
				addDescription: this.getView().byId("addDescription"),
				addSeasonsStatus: this.getView().byId("addSeasonsStatus")
			};
			return seasons;
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},
		onBeforeRendering: function() {
			var that = this;
			this.showLoading(true);
			var seasonSal = new SeasonSAL();
			seasonSal.fetchSeason(this).done(function(getResponse) {
				sap.ui.getCore().setModel(getResponse, "SeasonMaster");
				sap.ui.getCore().getModel("SeasonMaster").refresh(true);
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		onExit: function() {
			var oList = this.getView().byId("addSeasonsPage");
			oList.refresh();
		},
		onStartDataEndDateValidation: function() {
			var dateId = this.getView().byId("addSeasonsStartEndDates").getValue();
			if (dateId.length == "") {
				this.getView().byId("addSeasonsStartEndDates").setValueState("Error");
			}
		}
	});
});