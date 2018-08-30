sap.ui.define([
		"com/ss/app/StryxSports/controller/BaseController",
		 "sap/ui/model/json/JSONModel",
		 'sap/m/MessageToast',
		 "com/ss/app/StryxSports/controller/sal/UserProfileSAL",
		   "sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
	],
	function(BaseController, JSONModel, MessageToast, UserProfileSAL, Validator, ValueState) {
		"use strict";
		return BaseController.extend("com.ss.app.StryxSports.controller.UserProfile", {

			onInit: function() {
				var oRouter = this.getRouter();
				oRouter.getRoute("UserProfile").attachMatched(this._onRouteMatched, this);
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
				sap.ui.getCore().attachValidationError(function(oEvent) {
					oEvent.getParameter("element").setValueState(ValueState.Error);
				});
				sap.ui.getCore().attachValidationSuccess(function(oEvent) {
					oEvent.getParameter("element").setValueState(ValueState.None);
				});
			},
			_onRouteMatched: function(oEvent) {
				this._ID = oEvent.getParameter("arguments").PageID;
				var contexts = this.getContext();
				var mUserProfile = new JSONModel();
				mUserProfile.setData(contexts.User);
				this.getView().setModel(mUserProfile, "mUserProfile");
			},
			onPressSaveUserProfile: function() {
				var that = this;
				var variables = this.getVariables();
				var userName = variables.userName.getValue();
				var userEmail = variables.userEmail.getValue();
				var userOldPassword = variables.userOldPassword.getValue();
				var userNewPassword = variables.userNewPassword.getValue();
				var userConfirmPassword = variables.userConfirmPassword.getValue();
				var mUserData = this.getView().getModel("mUserProfile");
				var empId = mUserData.oData.EmployeeID;
				var usrSal = new UserProfileSAL();
				var filter = "$filter=Name%20eq%20'" + empId + "'";
				var sEmpId = empId.toString();
				usrSal.fetchUsers(filter).done(function(res) {
					var code = res.oData.value[0].Code;
					var jMd = new JSONModel();
					jMd.setProperty('/Code', code);
					jMd.setProperty('/Name', sEmpId);
					jMd.setProperty('/U_UserName', userEmail);
					jMd.setProperty('/U_Password', userConfirmPassword);
					if (userOldPassword == "") {
						variables.userOldPassword.setValueState("Error");
						that.MessageToastShow("Please Enter The Old Passwords");
					} else if (userNewPassword == "") {
						variables.userOldPassword.setValueState("None");
						variables.userNewPassword.setValueState("Error");
						that.MessageToastShow("Please Enter The New Passwords");
					} else if (userConfirmPassword == "") {
						variables.userNewPassword.setValueState("None");
						variables.userConfirmPassword.setValueState("Error");
						that.MessageToastShow("Please Enter The Confirm Passwords");
					} else if (userNewPassword !== userConfirmPassword) {
						variables.userNewPassword.setValueState("Error");
						variables.userConfirmPassword.setValueState("Error");
						that.MessageToastShow("Your Passwords Mismatch");
					} else if (res.oData.value[0].U_Password === userOldPassword && userNewPassword === userConfirmPassword) {
						usrSal.UpdateUsers(jMd, code).done(function(res) {
							that.fetchMessageOk("Update Users", "Success", "Updated Successfully", "DashBoard");
							variables.userOldPassword.setValue("");
							variables.userNewPassword.setValue("");
							variables.userConfirmPassword.setValue("");
						}).fail(function(err) {
							that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "DashBoard");
						});
					} else {
						variables.userOldPassword.setValueState("None");
						variables.userNewPassword.setValueState("None");
						variables.userConfirmPassword.setValueState("None");
					}
					// else{
					//     variables.userNewPassword.setValueState("Error");
					//     variables.userConfirmPassword.setValueState("Error");
					//                 that.MessageToastShow("Incorrect Old Password Or New And Confirm Passwords Mismatch");
					// }
				}).fail(function(err) {
					that.fetchMessageOk("Error", "Error", err.toString() + "Try again later", "DashBoard");
				});
			},

			getVariables: function() {
				var items = {
					userName: this.getView().byId("userName"),
					userEmail: this.getView().byId("userEmail"),
					userGender: this.getView().byId("userGender"),
					userMobile: this.getView().byId("userMobile"),
					userOldPassword: this.getView().byId("userOldPassword"),
					userNewPassword: this.getView().byId("userNewPassword"),
					userConfirmPassword: this.getView().byId("userConfirmPassword")
				};
				return items;
			},
			onClearValueStateError: function() {
				var getFromId = this.getVariables();
				getFromId.userOldPassword.setValue("");
				getFromId.userNewPassword.setValue("");
				getFromId.userConfirmPassword.setValue("");
				getFromId.userOldPassword.setValueState("None");
				getFromId.userNewPassword.setValueState("None");
				getFromId.userConfirmPassword.setValueState("None");
			},
			onNavBack: function() {
				var getPageID = this._ID;
				switch (getPageID) {
					case "1":
						this.getRouter().navTo("DashBoard");
						this.onClearValueStateError();
						break;
					case "3":
						this.getRouter().navTo("Sports");
						this.onClearValueStateError();
						break;
					case "6":
						this.getRouter().navTo("SportsCategory");
						this.onClearValueStateError();
						break;
					case "10":
						this.getRouter().navTo("Location");
						this.onClearValueStateError();
						break;
					case "12":
						this.getRouter().navTo("Seasons");
						this.onClearValueStateError();
						break;
					case "16":
						this.getRouter().navTo("Coaches");
						this.onClearValueStateError();
						break;
					case "17":
						this.getRouter().navTo("Teams");
						this.onClearValueStateError();
						break;
					case "26":
						this.getRouter().navTo("CoachAssessmentMaster");
						this.onClearValueStateError();
						break;
					case "23":
						this.getRouter().navTo("AssessmentFeedback");
						this.onClearValueStateError();
						break;
					case "44":
						this.getRouter().navTo("UserManagement");
						this.onClearValueStateError();
						break;
					default:
						this.getRouter().navTo("DashBoard");
				}

			}
		});
	});