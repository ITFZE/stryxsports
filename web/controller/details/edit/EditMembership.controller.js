sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController"
], function(BaseController) {
	"use strict";
	
	return BaseController.extend("com.ss.app.StryxSports.controller.details.edit.EditMembership", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("EditMembership").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvt) {
			var oArgs = oEvt.getParameter("arguments").membershipID;
			this.getView().bindElement("/membership/" + oArgs);
		},
		//Here function for Edit save button
		onPressSaveEditSaveMembership: function() {
			var getEditLocation = this.getVariables();
			if (getEditLocation.firstName.getValue() === "") {
				getEditLocation.firstName.setValueState("Error");
				var editLocationNameMessage = this.oBundle("PleaseEnterTheFirstName");
				this.MessageToastShow(editLocationNameMessage);
			} else if (getEditLocation.lastName.getValue() === "") {
				getEditLocation.lastName.setValueState("Error");
				getEditLocation.firstName.setValueState("None");
				var descriptionNameMessage = this.oBundle("PleaseEnterTheLastName");
				this.MessageToastShow(descriptionNameMessage);
			} else {
				getEditLocation.firstName.setValueState("None");
				getEditLocation.lastName.setValueState("None");
				this.getRouter().navTo("Membership");
			}
		},
		getVariables: function() {
			var editMembership = {
				firstName: this.getView().byId("editStudentFName"),
				lastName: this.getView().byId("editStudentLName"),
				clothingSize: this.getView().byId("editClothingSize"),
				DOB: this.getView().byId("editDob"),
				nationalatiy: this.getView().byId("editNationality"),

				FaterFirstName: this.getView().byId("editFatherFirstName"),
				FatherLastName: this.getView().byId("editFatherLastName"),
				FatherOccuption: this.getView().byId("editOccupation"),
				FatherNationalatiy: this.getView().byId("editFatherNationality"),
				FatherEmail: this.getView().byId("editFatherEmail"),
				FatherMobile: this.getView().byId("editFatherMobile"),

				MotherFirstName: this.getView().byId("editMotherFirstName"),
				MotherLastName: this.getView().byId("editMotherLastName"),
				MotherOccuption: this.getView().byId("editMotherOccupation"),
				MotherNationalatiy: this.getView().byId("editMotherNationality"),
				MotherEmail: this.getView().byId("editMotherEmail"),
				MotherMobile: this.getView().byId("editMotherMobile"),
				Activity: this.getView().byId("editActivity"),
				Location: this.getView().byId("editLocation")
			};
			return editMembership;
		},
		onPressAddCanelMembership: function() {
			this.getRouter().navTo("Membership");
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		}
	});
});