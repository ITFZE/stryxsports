sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/LocationsSAL",
	"com/ss/app/StryxSports/controller/sal/CoachsSAL",
	"com/ss/app/StryxSports/controller/sal/EmailSMSSAL",
	"sap/ui/model/json/JSONModel", "sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
], function(LocationsSAL, CoachsSAL, EmailSMSSAL, JSONModel, ValueState, Validator) {
	"use strict";
	return LocationsSAL.extend("com.ss.app.StryxSports.controller.details.LocationDetail", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("Location").attachMatched(this._onRouteMatched, this);
			var locationModel = new JSONModel();
			this.getView().setModel(locationModel, "LocationsModel");
			// Attaches validation handlers
			sap.ui.getCore().attachValidationError(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.None);
			});
		},
		_onRouteMatched: function(oEvt) {
			//showLoading(true);
			var getEle = oEvt.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			var context = this.getContext();
			context.PageID = this._setViewLevel;
			this.setContext(context);
			this.setSelBusy();
			var locationModel = new JSONModel();
			locationModel.setProperty('/Code', 0);
			locationModel.setProperty('/U_Status', 1);
			this.getView().setModel(locationModel, "LocationsModel");
			this.loading = true;
			this.fetchLocationResponsible();
			this.fetchLocationAdmin();
			var getLocationsId = this.getVariables();
			getLocationsId.addlocationName.setValueState("None");
			getLocationsId.addlocationAdmin.setValueState("None");
			getLocationsId.addlocationResponsible.setValueState("None");
		},
		onBeforeRendering: function() {
			var othat = this;
			if (othat.loading === false) {
				if (sap.ui.getCore().getModel("mLocAdmins") === null || sap.ui.getCore().getModel("mLocAdmins") === undefined) {
					othat.fetchLocationAdmin();
				}
			}
			if (othat.loading === false) {
				if (sap.ui.getCore().getModel("mLocResponsible") === null || sap.ui.getCore().getModel("mLocResponsible") === undefined) {
					othat.fetchLocationResponsible();
				}
			}
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

		setSelBusy: function() {
			var othat = this;
			var selAdmin = othat.getView().byId("addlocationAdmin");
			selAdmin.setBusy(true);
			var selResponse = othat.getView().byId("addlocationResponsible");
			selResponse.setBusy(true);
		},
		fetchLocationAdmin: function() {
			var othat = this;
			var coachSAL = new CoachsSAL();
			var lAFilter = "$filter=Name%20eq%20'Location%20Admin'";
			//othat.showLoading(true);
			coachSAL.fetchEmployeePosition(lAFilter).then(function(posId) {
				// API CALL TO GET ALL LOCATION ADMINS
				coachSAL.fetchEmployeesPositionInfo(posId).done(function(res) {
					sap.ui.getCore().setModel(res, "mLocAdmins");
					var selAdmin = othat.getView().byId("addlocationAdmin");
					var oItem = new sap.ui.core.Item({
						text: "Select Admin",
						key: -1
					});
					selAdmin.insertItem(oItem, 0);
					selAdmin.setSelectedItem(oItem);
					othat.getView().byId("addlocationAdmin").setValueState("None");
					selAdmin.setBusy(false);
				}).fail(function(err) {
					//othat.showLoading(false);
					othat.fetchMessageOk("Error", "Error", err.toString(), "Location");
				});
			}).fail(function(err) {
				//othat.showLoading(false);
				othat.fetchMessageOk("Error", "Error", err.toString(), "Location");
			});
		},
		fetchLocationResponsible: function() {
			var othat = this;
			var coachSAL = new CoachsSAL();
			var lRFilter = "$filter=Name%20eq%20'Location%20Responsible'";
			coachSAL.fetchEmployeePosition(lRFilter).done(function(posId) {
				//console.log("Position Id: ", posId);
				// API CALL TO GET ALL LOCATION RESPONSIBLES
				coachSAL.fetchEmployeesPositionInfo(posId).done(function(res) {
					sap.ui.getCore().setModel(res, "mLocResponsible");
					var selResponse = othat.getView().byId("addlocationResponsible");
					var oItem = new sap.ui.core.Item({
						text: "Select Responsible",
						key: -1
					});
					selResponse.insertItem(oItem, 0);
					selResponse.setSelectedItem(oItem);
					othat.getView().byId("addlocationResponsible").setValueState("None");
					selResponse.setBusy(false);
					//console.log("Success: ", res.value);
				}).fail(function(err) {
					//that.showLoading(false);
					console.log("Error: ", err);
					othat.fetchMessageOk("Error", "Error", err.toString(), "Location");
				});
			}).fail(function(err) {
				//that.showLoading(false);
				othat.fetchMessageOk("Error", "Error", err.toString(), "Location");
			});
		},
		//Functionality for Add Save
		onPressSaveAddLocation: function() {
			var that = this;
			var validator = new Validator();
			var retVal = validator.validate(this.byId("frmLocationCr"));
			if (retVal) {
				var jModel = that.getView().getModel("LocationsModel");
				this.showLoading(true);
				that.fetchLocationsMasters(this, "$filter=Name%20eq%20'" + jModel.oData.Name + "'").done(function(ret) {
					if (ret.oData.value.length <= 0) {
						that.createLocation(jModel).done(function() {
							var choice = "$orderby=Code%20desc";
							that.fetchLocationsMasters(that, choice).done(function(obj) {
								that.showLoading(false);
								sap.ui.getCore().setModel(obj, "LocationMasters");
								var locationsave = that.oBundle("CreatedSuccessfully");
								that.fetchMessageOk("Create Locations", "Success", locationsave, "Location");
								// Set combox values to default 
								that.getView().byId("addlocationAdmin").setValue("Select Admin");
								that.getView().byId("addlocationResponsible").setValue("Select Responsible");
							}).fail(function(err) {
								that.showLoading(false);
								that.fetchMessageOk("Error", "Error", err.toString(), "Location");
							});
						}).fail(function(err) {
							that.showLoading(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "Location");
						});
					} else {
						var inpLoc = that.byId("addlocationName");
						inpLoc.setValueState(sap.ui.core.ValueState.Error);
						inpLoc.setValueStateText("Entered sport name already exists!");
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", "Record already exixts", "Location");
					}
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "Location");
				});
			}
		},
		selectedLocationAdmin: function() {
			var getVariables = this.getVariables();
			if (getVariables.addlocationAdmin.getSelectedKey() !== "-1") {
				getVariables.addlocationAdmin.setValueState("None");
			} else {
				getVariables.addlocationAdmin.setValueState("Error");
			}
		},
		selectedLocationRes: function() {
			var getVariables = this.getVariables();
			if (getVariables.addlocationResponsible.getSelectedKey() !== "-1") {
				getVariables.addlocationResponsible.setValueState("None");
			} else {
				getVariables.addlocationResponsible.setValueState("Error");
			}
		},
		onPressAddCancelLocation: function() {
			var getDetailsVariables = this.getVariables();
			getDetailsVariables.addlocationName.setValue("");
			getDetailsVariables.addDetailslocationDescription.setValue("");
			getDetailsVariables.addLocationStatus.setSelectedKey("Active");
			getDetailsVariables.addlocationName.setValueState("None");
			getDetailsVariables.addlocationAdmin.setValueState("None");
			getDetailsVariables.addlocationAdmin.setSelectedKey("-1");
			getDetailsVariables.addlocationResponsible.setValueState("None");
			getDetailsVariables.addlocationResponsible.setSelectedKey("-1");
			this.getOwnerComponent().getRouter().navTo("Location");
		},
		///Here get variable from input
		getVariables: function() {
			var items = {
				addlocationName: this.getView().byId("addlocationName"),
				addlocationAdmin: this.getView().byId("addlocationAdmin"),
				addlocationResponsible: this.getView().byId("addlocationResponsible"),
				addDetailslocationDescription: this.getView().byId("addDetailslocationDescription"),
				addLocationStatus: this.getView().byId("addLocationStatus")
			};
			return items;
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		}
	});

});