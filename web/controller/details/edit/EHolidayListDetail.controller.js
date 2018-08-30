sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/HolidaySAL",
	"sap/ui/model/json/JSONModel"
], function(HolidaySAL, JSONModel) {
	"use strict";
	return HolidaySAL.extend("com.ss.app.StryxSports.controller.details.edit.EHolidayListDetail", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("EHolidayListDetail").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			var that = this;
			that.showLoading(true);
			var isMon = that.getView().byId("idMon");
			var isTus = that.getView().byId("idTus");
			var isWed = that.getView().byId("idWed");
			var isThu = that.getView().byId("idThu");
			var isFri = that.getView().byId("idFri");
			var isSat = that.getView().byId("idSat");
			var isSun = that.getView().byId("idSun");
			isMon.setSelected(false);
			isTus.setSelected(false);
			isWed.setSelected(false);
			isThu.setSelected(false);
			isFri.setSelected(false);
			isSat.setSelected(false);
			isSun.setSelected(false);
			var getHolidayID = oEvent.getParameter("arguments").holidayID;
			that.getView().setBusy(true);
			var holidayModel = new JSONModel();
			that.fetchHolidayById(holidayModel, getHolidayID).done(function(jMdl) {
				that.getView().setModel(jMdl, "HolidayListModel");
				var weekends = jMdl.oData.U_Weekend;
				var arr = weekends.split(",");
				arr.forEach(function(ele) {
					if (ele === "Mon") {
						isMon.setSelected(true);
					}
					if (ele === "Tue") {
						isTus.setSelected(true);
					}
					if (ele === "Wed") {
						isWed.setSelected(true);
					}
					if (ele === "Thu") {
						isThu.setSelected(true);
					}
					if (ele === "Fri") {
						isFri.setSelected(true);
					}
					if (ele === "Sat") {
						isSat.setSelected(true);
					}
					if (ele === "Sun") {
						isSun.setSelected(true);
					}
				});
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Edit Holiday", "Error", err, "DashBoard");
			});
		},
		onPressEditHoliday: function() {
			if (!this._DialogEditHoliday) {
				this._DialogEditHoliday = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.editHoliday",
					this);
				//to get access to the global model
				this.getView().addDependent(this._DialogEditHoliday);
			}
			this._DialogEditHoliday.open();
		},
		onPressDialogClose: function() {
			this._DialogEditHoliday.close();
		},
		onPressEHolidayCancel: function() {
			var holidayMaster = this.oBundle("YourChangesWillBeLost");
			this.onDialogState("Note", "Warning", holidayMaster, "HolidayListMaster");
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		}
	});
});