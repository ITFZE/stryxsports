sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/HolidaySAL",
	'sap/m/MessageBox',
	"sap/ui/model/json/JSONModel"
], function(HolidaySAL, MessageBox, JSONModel) {
	"use strict";
	return HolidaySAL.extend("com.ss.app.StryxSports.controller.details.HolidayListDetail", {
		onInit: function() {
			this._pageID = "";
			this.getHolidayID = "";
			this.toUpdateHolidayCode = "";
			this.getHolidayName = "";
			this.getHolidayStartDate = "";
			this.getHolidayEndDate = "";
			this.body = "";
			var oRouter = this.getRouter();
			oRouter.getRoute("HolidayListMaster").attachMatched(this._onRouteMatched, this);
			oRouter.getRoute("EditHolidayListDetail").attachMatched(this._onRouteHolidayEditMatched, this);
			this._holidayListname = this.getView().byId("holidayListname");
			this.holidayListDesc = this.getView().byId("holidayListDesc");
		},
		_onRouteMatched: function() {
			var that = this;
			that.fetchMasterList();
			that.onPressHolidayCancel();
			that.getView().byId("holidayPageId").setTitle("Create Holiday ");
			that.getView().byId("addHolidayAddBtn").setEnabled(false);
			that.getView().byId("addHolidayPanel").setVisible(false);
			that.getView().byId("btnSaveCreate").setVisible(true);
			that.getView().byId("btnSaveCancel").setVisible(true);
			that.getView().byId("clearBtn").setVisible(false);
			that.getView().byId("updateHolidayBtn").setVisible(false);
			var HolidayListModel = new JSONModel();
			HolidayListModel.setProperty('/Code', 0);
			HolidayListModel.setProperty('/Name', "");
			HolidayListModel.setProperty('/U_Description', "");
			HolidayListModel.setProperty('/U_Weekend', "");
			that.getView().setModel(HolidayListModel, "HolidayListModel");
		},
		_onRouteHolidayEditMatched: function(oEvent) {
			var that = this;
			that.showLoading(true);
		    that._holidayListname.setValueState("None");
            that.holidayListDesc.setValueState("None");
			that.getView().byId("holidayPageId").setTitle("Edit Holiday");
			that.getView().byId("addHolidayAddBtn").setEnabled(true);
			that.getView().byId("addHolidayPanel").setVisible(true);
			that.getView().byId("btnSaveCreate").setVisible(false);
			that.getView().byId("btnSaveCancel").setVisible(false);
			that.getView().byId("clearBtn").setVisible(true);
			that.getView().byId("updateHolidayBtn").setVisible(true);
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
			this.getHolidayID = oEvent.getParameter("arguments").holidayID;
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
    			//API call to fetch holidays based on holidaylistID
    			var hdfilter = "$filter=U_HolidayListId eq '" + that.getHolidayID + "'";
    			that.fetchHolidays(hdfilter).done(function(res){
    			    var holidaysModel = new JSONModel();
    			    holidaysModel.setData(res);
    			    that.getView().setModel(holidaysModel, "holidaysModel");
    			    that.showLoading(false);
    			}).fail(function(err){
    			    that.showLoading(false);
    			    that.fetchMessageOk("Error", "Unable to fetch holidays", err.toString(), "HolidayListMaster");
    			});
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Edit Holiday", "Error", err, "DashBoard");
			});
		},
		onPressAddHoliday: function() {
			if (!this._DialogHoliday) {
				this._DialogHoliday = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.addHoliday",
					this);
				//to get access to the global model
				this.getView().addDependent(this._DialogHoliday);
			}
			this._DialogHoliday.open();
			sap.ui.getCore().byId("holidayName").setValue("");
			sap.ui.getCore().byId("holidayStartDate").setValue("");
			sap.ui.getCore().byId("holidayEndDate").setValue("");
		},
		onPressEditHoliday: function(evt) {
		    var that = this;
			if (!that._EDialogHoliday) {
				that._EDialogHoliday = sap.ui.xmlfragment(
					"com.ss.app.StryxSports.view.fragments.editHoliday",
					that);
				//to get access to the global model
				that.getView().addDependent(that._EDialogHoliday);
			}
            var oCtx = evt.getSource().getBindingContext("holidaysModel");
			var mdl = oCtx.getModel();
			var path = oCtx.getPath();
			var mdData = oCtx.getProperty(path);
			that.toUpdateHolidayCode = mdData.Code;
			that._EDialogHoliday.open();
			sap.ui.getCore().byId("editHolidayName").setValue(mdData.Name);
			sap.ui.getCore().byId("editHolidayStartDate").setValue(mdData.U_SDate);
			sap.ui.getCore().byId("editHolidayEndDate").setValue(mdData.U_EDate);
		
		},
		onPressAddDialogConfirm: function(evt) {
			var that = this;
			var oTable = that.getView().byId('holidayTable');
			that.getHolidayName1 = sap.ui.getCore().byId("holidayName");
			that.getHolidayStartDate1 = sap.ui.getCore().byId("holidayStartDate");
			that.getHolidayEndDate1 = sap.ui.getCore().byId("holidayEndDate");
			that.getHolidayName = sap.ui.getCore().byId("holidayName").getValue();
			that.getHolidayStartDate = sap.ui.getCore().byId("holidayStartDate").getValue();
			that.getHolidayEndDate = sap.ui.getCore().byId("holidayEndDate").getValue();
			if(that.getHolidayName == ""){
			    that.getHolidayName1.setValueState("Error");
			}else if(that.getHolidayStartDate == ""){
			    that.getHolidayName1.setValueState("None");
			    that.getHolidayStartDate1.setValueState("Error");
			}else if(that.getHolidayEndDate == ""){
			    that.getHolidayStartDate1.setValueState("None");
			    that.getHolidayEndDate1.setValueState("Error");
			}else{
			    that.getHolidayEndDate1.setValueState("None");
			var mHoliday = new JSONModel();
			mHoliday.setProperty("/Code", 0);
			mHoliday.setProperty("/Name", that.getHolidayName);
			mHoliday.setProperty("/U_SDate", that.toDateFormat(that.getHolidayStartDate));
			mHoliday.setProperty("/U_EDate", that.toDateFormat(that.getHolidayEndDate));
			mHoliday.setProperty("/U_HolidayListId", that.getHolidayID.toString());
			that.getView().setModel(mHoliday, "mHoliday");
			oTable.setBusy(true);
            that.createHolidays(mHoliday).done(function(res){
                var hdfilter = "$filter=U_HolidayListId eq '" + that.getHolidayID + "'";
    			that.fetchHolidays(hdfilter).done(function(res){
    			    var holidaysModel = new JSONModel();
    			    holidaysModel.setData(res);
    			    that.getView().setModel(holidaysModel, "holidaysModel");
    			    oTable.setBusy(false);
    			}).fail(function(err){
    			    oTable.setBusy(false);
    			    that.fetchMessageOk("Error", "Unable to fetch holidays", err.toString(), "HolidayListMaster");
    			});
            }).fail(function(err){
                that.fetchMessageOk("Error", "Error", err.toString(), "HolidayListMaster");
            });
            that.getView().getModel("holidaysModel").refresh(true);
			that._DialogHoliday.close();
			}
		},
		onPressAddDialogClose: function() {
			this._DialogHoliday.close();
		},
		onPressEditDialogConfirm: function(){
		    var that = this;
		    var oTable = that.getView().byId('holidayTable');
		    var eName = sap.ui.getCore().byId("editHolidayName").getValue();
		    var eSDate = sap.ui.getCore().byId("editHolidayStartDate").getValue();
		    var eEDate = sap.ui.getCore().byId("editHolidayEndDate").getValue();
            var eHDModel = new JSONModel();
            eHDModel.setProperty("/Code", that.toUpdateHolidayCode);
            eHDModel.setProperty("/Name", eName);
            eHDModel.setProperty("/U_SDate", that.toDateFormat(eSDate));
            eHDModel.setProperty("/U_EDate", that.toDateFormat(eEDate));
            eHDModel.setProperty("/U_HolidayListId", that.getHolidayID.toString());
            that.getView().setModel(eHDModel ,"editHDModel");
            oTable.setBusy(true);
            var jMDL = that.getView().getModel("editHDModel");
	        that.updateHolidays(jMDL).done(function(res){
	            var hdfilter = "$filter=U_HolidayListId eq '" + that.getHolidayID + "'";
	            that.fetchHolidays(hdfilter).done(function(res){
	                var holidaysModel = new JSONModel();
    			    holidaysModel.setData(res);
    			    that.getView().setModel(holidaysModel, "holidaysModel");
		            oTable.setBusy(false);
	            }).fail(function(err){
			    oTable.setBusy(false);
			    that.fetchMessageOk("Error", "Unable to Update holidays", err.toString(), "HolidayListMaster");
			});
			}).fail(function(err){
			    oTable.setBusy(false);
			    that.fetchMessageOk("Error", "Unable to Update holidays", err.toString(), "HolidayListMaster");
			});
			//that.getView().getModel("holidaysModel").refresh(true);
			this._EDialogHoliday.close();
		},
		onPressEditDialogClose: function() {
			this._EDialogHoliday.close();
		},
		onPressCreateHoliday: function() {
			var that = this;
			if (this._holidayListname.getValue() === "") {
				this._holidayListname.setValueState("Error");
			} else {
				this._holidayListname.setValueState("None");
				var days = "";
				var isMon = that.getView().byId("idMon").getSelected();
				var isTus = that.getView().byId("idTus").getSelected();
				var isWed = that.getView().byId("idWed").getSelected();
				var isThu = that.getView().byId("idThu").getSelected();
				var isFri = that.getView().byId("idFri").getSelected();
				var isSat = that.getView().byId("idSat").getSelected();
				var isSun = that.getView().byId("idSun").getSelected();
				if (isMon == true) {
					days += "Mon,";
				}
				if (isTus == true) {
					days += "Tue,";
				}
				if (isWed == true) {
					days += "Wed,";
				}
				if (isThu == true) {
					days += "Thu,";
				}
				if (isFri == true) {
					days += "Fri,";
				}
				if (isSat == true) {
					days += "Sat,";
				}
				if (isSun == true) {
					days += "Sun,";
				}
				var hlModel = that.getView().getModel("HolidayListModel");
				hlModel.setProperty('/U_Weekend', days);
				var nameFilter = "$filter=Name%20eq%20'";
				this.showLoading(true);
				that.fetchHolidayList(this, nameFilter + hlModel.oData.Name + "'").done(function(ret) {
					if (ret.oData.value.length <= 0) {
						that.createHolidayList(hlModel).done(function() {
						    var filt = "$orderby=Code%20desc";
							that.fetchHolidayList(that, filt).done(function(obj) {
							var jMdl = obj;
							sap.ui.getCore().setModel(jMdl, "HolidayModel");
							that.clearForm();
							var holidayListSaveText = that.oBundle("CreatedSuccessfully");
							that.showLoading(false);
							that.fetchMessageOk("Create Holiday", "Success", holidayListSaveText, "HolidayListMaster");
							}).fail(function(err) {
								that.showLoading(false);
								that.fetchMessageOk("Error", "Error", err.toString(), "Sports");
							});
						}).fail(function(err) {
							that.showLoading(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "HolidayListMaster");
						});
					} else {
						var inpHolidayName = that.byId("holidayListname");
						inpHolidayName.setValueState(sap.ui.core.ValueState.Error);
						inpHolidayName.setValueStateText("Entered holiday name already exists!");
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", "Record Name already exixts", "HolidayListMaster");
					}
				}).fail(function(err) {
					that.showLoading(false);
					that.fetchMessageOk("Error", "Error", err.toString(), "HolidayListMaster");
				});
			}
		},
		oBundle: function(getToastMessage, fetchMessageOk) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage, fetchMessageOk);
			return getValues;
		},
		onPressCancelUpdateHoliday: function() {
			var that = this;
			that.clearForm();
			var holidayMaster = that.oBundle("YourChangesWillBeLost");
			that.onDialogState("Note", "Warning", holidayMaster, "HolidayListMaster");
			//that.getOwnerComponent().getRouter().navTo("HolidayListMaster");
		},
		onPressUpdateHoliday: function(evt) {
			var that = this;
			if (this._holidayListname.getValue() === "") {
				this._holidayListname.setValueState("Error");
			} else {
				this._holidayListname.setValueState("None");
				var days = "";
				var isMon = that.getView().byId("idMon").getSelected();
				var isTus = that.getView().byId("idTus").getSelected();
				var isWed = that.getView().byId("idWed").getSelected();
				var isThu = that.getView().byId("idThu").getSelected();
				var isFri = that.getView().byId("idFri").getSelected();
				var isSat = that.getView().byId("idSat").getSelected();
				var isSun = that.getView().byId("idSun").getSelected();
				if (isMon == true) {
					days += "Mon,";
				}
				if (isTus == true) {
					days += "Tue,";
				}
				if (isWed == true) {
					days += "Wed,";
				}
				if (isThu == true) {
					days += "Thu,";
				}
				if (isFri == true) {
					days += "Fri,";
				}
				if (isSat == true) {
					days += "Sat,";
				}
				if (isSun == true) {
					days += "Sun,";
				}
				//Holidaylist portion
				var uModel = that.getView().getModel("HolidayListModel");
				uModel.setProperty('/U_Weekend', days);
              
                // Api call to update holidaylist table
                that.showLoading(true);
                that.updataHolidayDetails(uModel).done(function(res){
                    var holidayListUpdateText = that.oBundle("UpdatedSuccessfully");
    				that.showLoading(false);
                    that.fetchMessageOk("Update HolidayList", "Success", holidayListUpdateText, "HolidayListMaster");
					that.clearForm();
                }).fail(function(err){
                    that.showLoading(false);
                    that.fetchMessageOk("Error", "Error", err.toString(), "HolidayListMaster");
                });
			}
		},
		clearForm: function() {
			var that = this;
			that._holidayListname.setValue("");
			that.holidayListDesc.setValue("");
			that.getView().byId("idMon").setSelected(false);
			that.getView().byId("idTus").setSelected(false);
			that.getView().byId("idWed").setSelected(false);
			that.getView().byId("idThu").setSelected(false);
			that.getView().byId("idFri").setSelected(false);
			that.getView().byId("idSat").setSelected(false);
			that.getView().byId("idSun").setSelected(false);
		},
		fetchMasterList: function() {
			var that = this;
			var filter = "$orderby=Code%20desc";
			that.fetchHolidayList(that, filter).done(function(getResponse) {
				var jMdl = getResponse;
				sap.ui.getCore().setModel(jMdl, "HolidayModel");
				sap.ui.getCore().getModel("HolidayModel").refresh(true);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "HolidayListMaster");
			});
		},
		onPressDelHoliday: function(evt) {
		    var that = this;
			var oTable = that.getView().byId('holidayTable');
			var oCtx = evt.getSource().getBindingContext("holidaysModel");
			var path = oCtx.getPath();
			var mdData = oCtx.getProperty(path);
			var code = mdData.Code;
			oTable.setBusy(true);
			that.deleteHolidays(code).done(function(res){
			    var resp = res;
			    var hdfilter = "$filter=U_HolidayListId eq '" + that.getHolidayID + "'";
	            that.fetchHolidays(hdfilter).done(function(res){
	                var holidaysModel = new JSONModel();
    			    holidaysModel.setData(res);
    			    that.getView().setModel(holidaysModel, "holidaysModel");
			    oTable.setBusy(false);
    			var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
    			MessageBox.success("Record deleted successfully",{styleClass: bCompact ? "sapUiSizeCompact" : ""});
	            }).fail(function(err){
			    oTable.setBusy(false);
			    that.fetchErrorMessageOk("Error", "Error", "Record delete failed");
			});	
			}).fail(function(err){
			    oTable.setBusy(false);
			    that.fetchErrorMessageOk("Error", "Error", "Record delete failed");
			});
		},
		onPressHolidayCancel: function() {
		    var that = this;
		    that._holidayListname.setValue("");
            that.holidayListDesc.setValue("");
            that._holidayListname.setValueState("None");
            that.holidayListDesc.setValueState("None");
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
		}
	});
});