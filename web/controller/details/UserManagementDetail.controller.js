sap.ui.define([
		"com/ss/app/StryxSports/controller/sal/UserProfileSAL",
		"sap/ui/model/json/JSONModel",
		'sap/m/MessageToast'
		], function(UserProfileSAL, JSONModel, MessageToast) {
	"use strict";
	var empId, usrname, usrCode = null;
	return UserProfileSAL.extend("com.ss.app.StryxSports.controller.details.UserManagementDetail", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("UserManagementDetail").attachMatched(this._onRouteMatched, this);
		},
		onBeforeRendering: function() {},
		mCreateUserProfile: function() {
			var mUserProfile = new JSONModel();
			mUserProfile.setProperty('/Code', 0);
			mUserProfile.setProperty('/Name');
			mUserProfile.setProperty('/U_UserName');
			mUserProfile.setProperty('/U_Password');
			this.getView().setModel(mUserProfile, "userInfoModel");
		},

		onBackUserManagement: function() {
			this.getOwnerComponent().getRouter().navTo("UserManagement");
		},

		_onRouteMatched: function(oEvent) {
			var getEle = oEvent.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			var context = this.getContext();
			context.PageID = this._setViewLevel;
			this.setContext(context);
			var setThis = this;
			setThis.showLoading(true);
			var getEmployeeID = oEvent.getParameter("arguments").EmployeeID;
			this._getEmployeeID = getEmployeeID;
			this.fetchEmployeesInfoDetails(getEmployeeID).done(function(getResponse) {
				setThis.getView().setModel(getResponse, "mUserProfile");
				empId = getResponse.oData.EmployeeID;
				usrname = getResponse.oData.eMail;
				setThis.showLoading(false);
			}).fail(function(err) {
				setThis.showLoading(false);
				setThis.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
			setThis.mCreateUserProfile();
			var newpassword = this.getView().byId("setUserNewPassword");
			var confirmpassword = this.getView().byId("setUserConfirmPassword");
			newpassword.setValue("");
			confirmpassword.setValue("");
			newpassword.setValueState("None");
			confirmpassword.setValueState("None");
		},
		onUserProfileSave: function() {
			var that = this;
			var newPassword = that.getView().byId("setUserNewPassword").getValue();
			var confirmPassword = that.getView().byId("setUserConfirmPassword").getValue();
			if (newPassword === "") {
				that.getView().byId("setUserNewPassword").setValueState("Error");
				MessageToast.show("Please Enter The New Password");
			} else if (confirmPassword.length === "") {
				that.getView().byId("setUserNewPassword").setValueState("None");
				that.getView().byId("setUserConfirmPassword").setValueState("Error");
				MessageToast.show("Please Enter The Confirm Password");
			} else if (newPassword !== confirmPassword) {
				that.getView().byId("setUserNewPassword").setValueState("None");
				that.getView().byId("setUserConfirmPassword").setValueState("Error");
				MessageToast.show("Your Password Miss Match");
			} else {
				that.getView().byId("setUserNewPassword").setValueState("None");
				that.getView().byId("setUserConfirmPassword").setValueState("None");
				// Create New User
				var jMd = that.getView().getModel("userInfoModel");
				var sEmpId = empId.toString();
				jMd.setProperty('/Name', sEmpId);
				jMd.setProperty('/U_UserName', usrname);
				var ufilter = "$filter=Name%20eq%20" + "'" + empId + "'";
				that.showLoading(true);
				that.fetchUsers(ufilter).done(function(response) {
					usrCode = response.oData.value[0].Code;
					if (response.oData.value[0].Name === sEmpId) {
						that.UpdateUsers(jMd, usrCode).done(function() {
							that.fetchMessageOk("Update Users", "Success", "Updated Successfully", "DashBoard");
						}).fail(function(err) {
							that.showLoading(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
						});
					} else {
						that.CreateUsers(jMd).done(function() {
							that.fetchMessageOk("Create Users", "Success", "Created Successfully", "DashBoard");
						}).fail(function(err) {
							that.showLoading(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
						});
					}
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			}
		},
		OnUserProfileCancel: function() {
			var newpassword = this.getView().byId("setUserNewPassword");
			var confirmpassword = this.getView().byId("setUserConfirmPassword");
			var getDeviceMdl = this.getView().getModel("checkPhoneModel");
			var getCheckPhone = getDeviceMdl.getProperty("/CheckPhone");
			if (getCheckPhone !== false) {
				newpassword.setValue("");
				confirmpassword.setValue("");
				newpassword.setValueState("None");
				confirmpassword.setValueState("None");
				this.getOwnerComponent().getRouter()
					.navTo("UserManagementDetail", {
						EmployeeID: this._getEmployeeID
					});
			} else {

				newpassword.setValue("");
				confirmpassword.setValue("");
				newpassword.setValueState("None");
				confirmpassword.setValueState("None");

			}
		}
	});
});