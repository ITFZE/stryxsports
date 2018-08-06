sap.ui.define([
    "com/ss/app/StryxSports/controller/sal/LocationsSAL",
    "com/ss/app/StryxSports/controller/sal/CoachsSAL",
    "com/ss/app/StryxSports/controller/sal/EmailSMSSAL",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
], function(LocationsSAL, CoachsSAL, EmailSMSSAL, JSONModel, ValueState, Validator) {
	var getLocationID = null;
	return LocationsSAL.extend("com.ss.app.StryxSports.controller.details.edit.EditLocation", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("EditLocation").attachMatched(this._onRouteMatched, this);
			// Attaches validation handlers
			sap.ui.getCore().attachValidationError(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.None);
			});
		},
		_onRouteMatched: function(oEvent) {
			var setThis = this;
			var getEle = this.getVariables();
			getEle.editLocationAdmin.setBusy(true);
			getEle.editLocationResponiable.setBusy(true);

			getLocationID = oEvent.getParameter("arguments").locationID;
			var locationModel = new JSONModel();
			this.fetchLocationDetail(locationModel, getLocationID).done(function(getResponse) {
				setThis.getView().setModel(getResponse, "LocationsModel");
				setThis.showLoading(false);
			}).fail(function(err) {
				setThis.showLoading(false);
				setThis.fetchMessageOk("Error", "Error", err.toString(), "Location");
			});
			var getLocationEditId = this.getVariables();
			getLocationEditId.editLocationName.setValueState("None");
			getLocationEditId.editLocationAdmin.setValueState("None");
			getLocationEditId.editLocationResponiable.setValueState("None");
			this.fetchLocationAdmin();

		},
		//Here function for Edit save button
		onPressSaveEditLocation: function() {
			var that = this;
			var getEle = this.getVariables();
			var validator = new Validator();
			var retVal = validator.validate(this.byId("frmLocationedit"));
			if (retVal) {
				getEle.editLocationResponiable.setValueState("None");
				var jModel = that.getView().getModel("LocationsModel");
				this.showLoading(true);
				this.updataLocationDetails(jModel, getLocationID).then(function() {
					var choice = "$orderby=Code%20desc";
					that.fetchLocationsMasters(that, choice).done(function(response) {
						//var jMdl = obj;
						sap.ui.getCore().setModel(response, "LocationMasters");
						that.showLoading(false);
						var locationeditsave = that.oBundle("UpdatedSuccessfully");
						that.fetchMessageOk("Edit Location", "Success", locationeditsave, "Location");
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "Location");
					});
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "Location");
				});
				//Start - API call to send email notification
				var locAdmin = that.getView().byId("editlocationAdmin");
				var lAContext = locAdmin.getSelectedItem().getBindingContext("mLocAdmins").getObject();
				var locResp = that.getView().byId("editlocationResponsible");
				var lRContext = locResp.getSelectedItem().getBindingContext("mLocResponsible").getObject();
				var jLoc = that.getView().getModel("LocationsModel").getData();
				var tempValues = [];
				var obj = {};
				obj.startsWith = 'LA';
				obj.templateObj = lAContext;
				obj.email = "eMail";
				obj.sms = "MobilePhone";
				tempValues.push(obj);
				obj = {};
				obj.startsWith = 'LR';
				obj.templateObj = lRContext;
				obj.email = "eMail";
				obj.sms = "MobilePhone";
				tempValues.push(obj);
				obj = {};
				obj.startsWith = 'SS';
				obj.templateObj = jLoc;
				obj.email = "";
				obj.sms = "";
				tempValues.push(obj);

				// Start - API call to get Email and SMS object for notification 
				//var oData = this.sendEmailSMS("Both", "Add Location Admin", tempValues);
				// End - API call to get Email and SMS object for notification

				//Start - API call to send SMS notification
				/*	var smsSal = new EmailSMSSAL();
					var oData = {
						"destination": "+919916699633",
						"message": "Test Message from SMSGLOBAL- 25/8"
					};
					smsSal.sendSMS(oData).then(function(res) {
						var smsModel = new JSONModel();
						smsModel.setData(res);
						that.getView().setModel(smsModel, "smsModel");
					}).fail(function(err) {
						that.fetchMessageOk("Error", "Error", err.toString(), "Location");
					});*/
				//End - API call to send SMS notification
			}
		},
		fetchLocationAdmin: function() {
			var othat = this;
			var getEle = this.getVariables();
			var coachSAL = new CoachsSAL();
			//	othat.showLoading(true);
			var lAFilter = "$filter=Name%20eq%20'Location%20Admin'";
			coachSAL.fetchEmployeePosition(lAFilter).done(function(posId) {
				// API CALL TO GET ALL LOCATION ADMINS
				coachSAL.fetchEmployeesPositionInfo(posId).done(function(res) {
					sap.ui.getCore().setModel(res, "mLocAdmins");
					var oItem = new sap.ui.core.Item({
						text: "Select Location Admin",
						key: -1
					});
					getEle.editLocationAdmin.insertItem(oItem, 0);
					getEle.editLocationAdmin.setBusy(false);
					othat.fetchLocationResponsible();

				}).fail(function(err) {
					//othat.showLoading(false);
					othat.fetchMessageOk("Error", "Error", err.toString(), "Sports");
				});
			}).fail(function(err) {
				//othat.showLoading(false);
				othat.fetchMessageOk("Error", "Error", err.toString(), "Sports");
			});
		},
		fetchLocationResponsible: function() {
			var othat = this;
			var getEle = this.getVariables();
			var coachSAL = new CoachsSAL();
			var lRFilter = "$filter=Name%20eq%20'Location%20Responsible'";
			coachSAL.fetchEmployeePosition(lRFilter).done(function(posId) {
				coachSAL.fetchEmployeesPositionInfo(posId).done(function(res) {
					sap.ui.getCore().setModel(res, "mLocResponsible");
					var oItem = new sap.ui.core.Item({
						text: "Select Location Responsible",
						key: -1
					});
					getEle.editLocationResponiable.insertItem(oItem, 0);
					getEle.editLocationResponiable.setBusy(false);

				}).fail(function(err) {
					//that.showLoading(false);
					//console.log("Error: ", err);
					othat.fetchMessageOk("Error", "Error", err.toString(), "Sports");
				});
			}).fail(function(err) {
				//that.showLoading(false);
				othat.fetchMessageOk("Error", "Error", err.toString(), "Sports");
			});
		},

		getVariables: function() {
			var editLocation = {
				editLocationName: this.getView().byId("editlocationName"),
				editLocationAdmin: this.getView().byId("editlocationAdmin"),
				editLocationResponiable: this.getView().byId("editlocationResponsible"),
				editLocationDescription: this.getView().byId("editlocationDescription"),
				editLocationStatus: this.getView().byId("editLocationStatus")
			};
			return editLocation;
		},
		onPressCloseEditLocation: function() {
			var locationclose = this.oBundle("YourChangesWillBeLost");
			this.onDialogState("Note", "Warning", locationclose, "Location");
			this.getView().byId("editlocationName").setValueState("None");
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		}
	});
});