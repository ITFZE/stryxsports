sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL",
	"com/ss/app/StryxSports/controller/sal/SearchActivitySAL",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageBox',
	'sap/m/Button',
	'sap/m/Dialog'
], function(CreateAssessmentsSAL, SearchActivitySAL, JSONModel, MessageBox, Button, Dialog) {
	"use strict";
	return CreateAssessmentsSAL.extend("com.ss.app.StryxSports.controller.details.SearchActivity", {
		onInit: function() {
		    this._getActivityID = "";
			var oRouter = this.getRouter();
			oRouter.getRoute("SearchActivity").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
			var clearMdl = new JSONModel();
			that.getView().setModel(clearMdl, "mHandledByEmp");
			that.getView().setModel(clearMdl, "mActivities");
			var planningCalendar = that.getView().byId("searchActivityPCalendar");
			planningCalendar.setNoDataText("No Data, Please Select Handled By Field");
			$.when(that.getHandledByEmployee()).then(function() {
				return;
			});
		},
		onAfterRendering: function() {
			var view = this.getView();
			view.addDelegate({
				onsapenter: function(e) {
					view.getController().fetchLeadsExisting();
				}
			});
		},
		getHandledByEmployee: function() {
			var that = this;
			var searchActivitySAL = new SearchActivitySAL();
			var filter =
				"$filter=EmployeesInfo/EmployeeID%20eq%20Activities/HandledByEmployee||$apply=groupby((EmployeesInfo/EmployeeID,EmployeesInfo/FirstName,EmployeesInfo/LastName))";
			that.showLoading(true);
			searchActivitySAL.fetchHandledByEmployee(filter).done(function(res) {
				var mHandledByEmp = new JSONModel();
				mHandledByEmp.setData(res);
				that.getView().setModel(mHandledByEmp, "mHandledByEmp");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		getActivities: function(oEvent) {
			var that = this;
			var eleKey = that.getView().byId("comboBoxHandledByEmp").getSelectedKey();
			var eleItem = that.getView().byId("comboBoxHandledByEmp").getValue();
			var searchActivitySAL = new SearchActivitySAL();
			//  var filter = "$filter=HandledByEmployee%20eq%20" + eleKey + "||$expand=BusinessPartner" + "||$select=BusinessPartner/CardName";
			var filter = encodeURI("$filter=BusinessPartners/CardCode eq Activities/CardCode and Activities/HandledByEmployee eq " + eleKey +
				"||$apply=groupby((BusinessPartners/CardCode,BusinessPartners/CardName,Activities/HandledByEmployee))");
			that.showLoading(true);
			searchActivitySAL.fetchActivities(filter).done(function(res) {
				var mActivities = new JSONModel();
				mActivities.setData(res);
				that.getView().setModel(mActivities, "mActivities");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		onPressSaveCreateActivity: function() {
			if (!this._dialogLeadExistingTable) {
				this._dialogLeadExistingTable = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.addLeadsExistingTable", this);
				this._dialogLeadExistingTable.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._dialogLeadExistingTable.setModel(this.getView().getModel());
			}
			this._dialogLeadExistingTable.open();
			this.clearVariablesbValue();
		},
		onPressDialogClose: function() {
			this.clearVariablesbValue();
			this._dialogLeadExistingTable.close();
		},
		onPressSearchLead: function() {
			var getEle = this.getVariablesLeadsExisting();
			var getSelKey = getEle.shLeadSelectType.getSelectedKey();
			if (getSelKey === "-1") {
				getEle.shLeadSelectType.setValueState("Error");
			} else {
				getEle.shLeadSelectType.setValueState("None");
				switch (getSelKey) {
					case "1":
						this.fetchLeadsExisting("cCustomer");
						break;
					case "2":
						this.fetchLeadsExisting("cLid");
						break;
					default:
						break;
				}
			}
		},
		rowSelectedChange: function(evt) {
			var getS = evt.getSource();
			var getRow = getS.getSelectedRows();
			var getName = getRow[0].getTitle();
		},
		handleAppointmentSelect: function(oEvent) {
			var oAppointment = oEvent.getParameter("appointment");
			if (!this._dialogEditActivity) {
				this._dialogEditActivity = sap.ui.xmlfragment("com.ss.app.StryxSports.view.fragments.dialogs.EditActivity", this);
				this._dialogEditActivity.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}
			this._dialogEditActivity.open();

			if (oAppointment) {
				this._getActivityID = oAppointment.getKey();
				var getAStart = oAppointment.getStartDate(),
					getAEnd = oAppointment.getEndDate(),
					getATitle = oAppointment.getTitle(),
					getATxt = oAppointment.getText(),
					setATxt;
				var getAStartTo = this.toDateFormat(getAStart),
					getAEndTo = this.toDateFormat(getAEnd);
				if (getATxt !== undefined && getATxt !== null) {
					setATxt = getATxt;
				} else {
					setATxt = "";
				}
				var setAStartDate = sap.ui.getCore().byId("iaStartDate"),
					setAEndDate = sap.ui.getCore().byId("iaEndDate"),
					setASubject = sap.ui.getCore().byId("iaSubject"),
					setANotes = sap.ui.getCore().byId("iaNotes");

				setAStartDate.setText(getAStartTo);
				setAEndDate.setText(getAEndTo);
				setASubject.setText(setATxt);
				setANotes.setText(getATitle);
				/*	MessageBox.information(
					"Name : " + getATitle +
					". \n Start And End Date : " + getAStartTo + " To " + getAEndTo +
					". \n Detail : " + setATxt
				);*/
			} else {
				// var aAppointments = oEvent.getParameter("appointments"),
				// 	sValue = aAppointments.length + " Appointments selected";
				// MessageBox.show(sValue);
				return false;
			}
		},
		onPressDialogCloseEA: function() {
			this._dialogEditActivity.close();
		},

		onPressDialogSaveEA: function() {
			this._dialogEditActivity.close();

			// this.getOwnerComponent().getRouter().navTo("CreateActivity", {
			// 	LeadID: 'CH005126'
			// });

			//this.MessageToastShow("Updated Successfully");

		},
		onPressDialogFollowUpActivityEA: function() {
			this._dialogEditActivity.close();
			this.getOwnerComponent().getRouter().navTo("FollowUpActivity", {
				LeadID: 'CH005126'
			});
		},
		onPressDialogEditActivityEA: function() {
			this._dialogEditActivity.close();
				this.getOwnerComponent().getRouter().navTo("EditActivity", {
				ActivityID: this._getActivityID,
				PageID:51
			});
		},

		fetchLeadsExisting: function(getType) {
			var that = this;
			var addFilter = null;
			var addFilterType = null;
			var criteria = "";
			var getEle = this.getVariablesLeadsExisting();

			var sLeadName = getEle.shLeadName.getValue().replace(/\s+/g, ' ');

			if (sLeadName !== "" || getEle.shLeadEmail.getValue() !== "" || getEle.shLeadMobile.getValue() !== "") {

				if (sLeadName.length > 0) {
					addFilterType = "CardName";
					addFilter = sLeadName;
					criteria += "contains(CardName,'" + sLeadName + "')";
					if (criteria !== "") {
						criteria += " or ";
					}
					var titleStr = this.titleCase(addFilter);
					criteria += "contains(CardName,'" + titleStr + "')";
				}
				if (getEle.shLeadEmail.getValue().length > 0) {
					addFilterType = "EmailAddress";
					addFilter = getEle.shLeadEmail.getValue();
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(EmailAddress,'" + getEle.shLeadEmail.getValue() + "')";
				}
				/*	if (getEle.shLeadDOB.getValue().length > 0) {
					var getDate = getEle.shLeadDOB.getValue();
					var dobDate = this.toDateFormat(getDate);
					addFilter = dobDate;
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(U_Dob,'" + dobDate + "')";
				}*/
				if (getEle.shLeadMobile.getValue().length > 0) {
					addFilter = getEle.shLeadMobile.getValue();
					addFilterType = "Cellular";
					if (criteria !== "") {
						criteria += " or ";
					}
					criteria += "contains(Cellular,'" + getEle.shLeadMobile.getValue() + "')";
				}
			}
			if (getEle.shLeadMobile.getValue().length > 0 || sLeadName.length > 0 || getEle.shLeadEmail.getValue().length > 0) //|| getEle.shLeadDOB.getValue().length > 0) 
			{
				that.getView().setBusy(true);
				var createAssessmentsSAL = new CreateAssessmentsSAL();
				var tFilterCardType = encodeURI("$filter=CardType eq '" + getType + "' and (" + criteria +
					")||$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress,U_Dob");
				createAssessmentsSAL.fetchBusinessPartners(that, tFilterCardType).done(function(obj) {
					sap.ui.getCore().setModel(obj, "ExistingLeadList");
					that.getView().setBusy(false);

				}).fail(function(err) {
					that.getView().setBusy(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
				});
			} else {
				that.MessageToastShow("Please Enter Atleast One Filter Field");
			}

		},
		onPressSelectConfirm: function() {
			var btn = sap.ui.getCore().byId("pLDialogConfirm");
			btn.setEnabled(true);
		},
		onPressDialogConfirm: function() {
			var oTable = sap.ui.getCore().byId("tblPList");
			var selItem = oTable.getSelectedItem();
			if (selItem !== null) {
				var ctx = selItem.getBindingContext("ExistingLeadList");
				var obj = ctx.getObject();
				this.clearVariablesbValue();
				this.getOwnerComponent().getRouter().navTo("CreateActivity", {
					LeadID: obj.CardCode,
					PageID: 52
				});
				this._dialogLeadExistingTable.close();
			}
		},

		getVariablesLeadsExisting: function() {
			var items = {
				shLeadName: sap.ui.getCore().byId("pLeadName"),
				shLeadEmail: sap.ui.getCore().byId("pLeadEmail"),
				//	shLeadDOB: sap.ui.getCore().byId("pLeadDOB"),
				shLeadMobile: sap.ui.getCore().byId("pLeadMobile"),
				shLeadNameTable: sap.ui.getCore().byId("pLParentNameTable"),
				shLeadDialogConfirm: sap.ui.getCore().byId("pLDialogConfirm"),
				shLeadSelectType: sap.ui.getCore().byId("pLeadSelectType"),
				shTableView: sap.ui.getCore().byId("tblPList")
			};
			return items;
		},
		clearVariablesbValue: function() {
			var getEle = this.getVariablesLeadsExisting();
			var obj = new JSONModel();
			sap.ui.getCore().setModel(obj, "ExistingLeadList");
			getEle.shLeadName.setValue("");
			//getEle.shLeadDOB.setValue("");
			getEle.shLeadMobile.setValue("");
		},
		getSelectedType: function() {
			var getEle = this.getVariablesLeadsExisting();
			var getSelType = getEle.shLeadSelectType.getSelectedKey();

			switch (getSelType) {
				case "1":
					getEle.shTableView.setHeaderText("Members");
					break;
				case "2":
					getEle.shTableView.setHeaderText("Leads");
					break;
				default:
					getEle.shTableView.setHeaderText("");
					break;
			}
		}

	});
});