sap.ui.define([
	"com/ss/app/StryxSports/controller/sal/AttendanceSAL",
	"sap/ui/model/json/JSONModel",
	 "com/ss/app/StryxSports/controller/sal/TeamsSAL"
], function(AttendanceSAL, JSONModel, TeamsSAL) {
	"use strict";
	return AttendanceSAL.extend("com.ss.app.StryxSports.controller.details.Attendance", {
	    onInit: function() {
	        this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
	        this._getSeleTeamID = "";
	        this._getTeamId = "";
	    	var oRouter = this.getRouter();
			oRouter.getRoute("Attendance").attachMatched(this._onRouteMatched, this);
			var d = new Date();
		    var getValue = "";
		    var year = d.getFullYear();
		    var month = d.getMonth()+1;
		    var date = d.getDate();
		    var day = getValue .concat(date , "/" , month , "/" , year) ;
			var idDate = this.getView().byId("txtDate");
			idDate.setText(day);
	    },
	    _onRouteMatched: function() {
	        var that = this;
	        that.getView().byId("idTeamName").setValue("");
	        that.fetchTeamsList();
			var contexts = this.getContext();
			var mUserProfile = new JSONModel();
			mUserProfile.setData(contexts.User);
			this.getView().setModel(mUserProfile, "mUserProfile");
	    },
	    fetchTeamsList: function() {
	        var that = this;
	        var teamsSAL = new TeamsSAL();
	         teamsSAL.fetchTeams(that).done(function(obj) {
				that.getView().setModel(obj, "TeamsName");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
	    },
	    onGetTeamDetailsList: function() {
	        var that = this;
			that._getSeleTeamID = that.getView().byId("idTeamName").getSelectedKey();
			var selteam = this.getView().byId("idTeamName").getSelectedItem();
			if (selteam !== null) {
			    that.showLoading(true);
				that.fetchTeamsByIdDetails(this._getSeleTeamID);
				that.fetchMemberName(this._getSeleTeamID);
			}
			if (!selteam) {
				var msg = "Please Select One of The Values";
				this.MessageToastShow(msg);
			}
		},
		fetchTeamsByIdDetails: function(getteamID) {
    		var that = this;
    		var teamsSAL = new TeamsSAL();
    		teamsSAL.fetchTeamsById("", getteamID).done(function(res) {
    			that.getView().setModel(res, "TeamsDetails");
    			that.fetchMemberName(getteamID);
    		}).fail(function(err) {
    			that.showLoading(false);
    			that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
    		});
    	},
		fetchMemberName: function(getTeamID) {
			var that = this;
			var teamsSAL = new TeamsSAL();
			var tFilterCardType = encodeURI("$filter=CardType eq 'cLid' and (" +
				")&$select=CardCode, CardName,CardType,Phone1,Cellular,EmailAddress");
			teamsSAL.fetchMember(getTeamID, tFilterCardType).done(function(obj) {
				sap.ui.getCore().setModel(obj, "MembersList");
				that.showLoading(false);
			}).fail(function(err) {
				that.showLoading(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		}
	});
});