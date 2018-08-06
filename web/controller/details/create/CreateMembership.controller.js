sap.ui.define([
  "com/ss/app/StryxSports/controller/sal/MembershipSAL",
	"sap/ui/model/json/JSONModel"
], function(MembershipSAL,JSONModel) {
	"use strict";
	return MembershipSAL.extend("com.ss.app.StryxSports.controller.details.create.CreateMembership", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("CreateMembership").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		_onRouteMatched: function(oEvt) {
			var oArgs = oEvt.getParameter("arguments").membershipID;
			this.getView().bindElement("/membership/" + oArgs);
		},
		
		onBeforeRendering: function() {
		    var that = this;
			var sMemSAL = new MembershipSAL();
			var choice = "$orderby=Code%20desc";
			sMemSAL.fetchCountriesName(that, choice).done(function(obj) {
			    obj.setSizeLimit(300);
				sap.ui.getCore().setModel(obj, "MembershipCountry");
				sap.ui.getCore().getModel("MembershipCountry").setSizeLimit(obj);

			}).fail(function(err) {
			});
		},

		////Here view for Create new mebership function
		onPressCreatMembershipSave: function(oEvent) {
			var getVariables = this.getVariables();
			if (getVariables.firstName.getValue() === "") {
				getVariables.firstName.setValueState("Error");
				var sportNameMessage = this.oBundle("PleaseEnterTheFirstName");
				this.MessageToastShow(sportNameMessage);
			} else if (getVariables.lastName.getValue() === "") {
				getVariables.firstName.setValueState("None");
				getVariables.lastName.setValueState("Error");
				var sportDescriptionMessage = this.oBundle("PleaseEnterTheLastName");
				this.MessageToastShow(sportDescriptionMessage);
			} else {
				getVariables.firstName.setValueState("None");
				getVariables.lastName.setValueState("None");
				var oModel = this.getView().getModel();
				var aData = oModel.getProperty("/membership");
				var maximum = [];
				aData.forEach(function(val) {
					var value = val.membershipID;
					maximum.push(value);
				});
				var membershipID = Math.max.apply(Math, maximum) + 1;

				aData.push({
					membershipID: membershipID,
					firstName: getVariables.firstName.getValue(),
					lastName: getVariables.lastName.getValue(),
					DOB: getVariables.DOB.getValue(),
					nationalatiy: getVariables.nationalatiy.getValue(),
					clothingSize: getVariables.clothingSize.getValue(),

					FaterFirstName: getVariables.FaterFirstName.getValue(),
					FatherLastName: getVariables.FatherLastName.getValue(),
					FatherOccuption: getVariables.FatherOccuption.getValue(),
					FatherNationalatiy: getVariables.FatherNationalatiy.getValue(),
					FatherEmail: getVariables.FatherEmail.getValue(),
					FatherMobile: getVariables.FatherMobile.getValue(),

					MotherFirstName: getVariables.MotherFirstName.getValue(),
					MotherLastName: getVariables.MotherLastName.getValue(),
					MotherOccuption: getVariables.MotherOccuption.getValue(),
					MotherNationalatiy: getVariables.MotherNationalatiy.getValue(),
					MotherEmail: getVariables.MotherEmail.getValue(),
					MotherMobile: getVariables.MotherMobile.getValue(),
					Activity: getVariables.Activity.getSelectedKey(),
					Location: getVariables.Location.getSelectedKey()

				});
				oModel.setProperty("/membership", aData);
				var sportSuccessfullyMessage = this.oBundle("YourSportCreatedSuccessfully");
				this.MessageToastShow(sportSuccessfullyMessage);
				this.getRouter().navTo("Membership");
				this.getView().byId("editStudentFName").setValue("");
				this.getView().byId("editStudentLName").setValue("");
				this.getView().byId("editClothingSize").setValue("");
				this.getView().byId("editDob").setValue("");
				this.getView().byId("editNationality").setValue("");
				this.getView().byId("editFatherFirstName").setValue("");
				this.getView().byId("editFatherLastName").setValue("");
				this.getView().byId("editOccupation").setValue("");
				this.getView().byId("editFatherNationality").setValue("");
				this.getView().byId("editFatherEmail").setValue("");
				this.getView().byId("editFatherMobile").setValue("");
				this.getView().byId("editMotherFirstName").setValue("");
				this.getView().byId("editMotherLastName").setValue("");
				this.getView().byId("editMotherOccupation").setValue("");
				this.getView().byId("editMotherNationality").setValue("");
				this.getView().byId("editMotherEmail").setValue("");
				this.getView().byId("editMotherMobile").setValue("");
			}
		},
		getVariables: function() {
			var createMembership = {
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
			return createMembership;
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