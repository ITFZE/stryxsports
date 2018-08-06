sap.ui.define([
"com/ss/app/StryxSports/controller/sal/AssessmentFeedbackSAL",
"com/ss/app/StryxSports/controller/sal/CoachAssessmentScoreSAL",
	"sap/ui/model/json/JSONModel"
], function(AssessmentFeedbackSAL, CoachAssessmentScoreSAL, JSONModel) {
	"use strict";

	return AssessmentFeedbackSAL.extend("com.ss.app.StryxSports.controller.details.AssessmentFeedbackDetail", {
		onInit: function() {
			this._pageID = "";
			this._feedbackID = "";
			this._setViewLevel = "";
			var oRouter = this.getRouter();
			oRouter.getRoute("AssessmentFeedbackDetail").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
		    var getEle = oEvent.getParameters();
			this._setViewLevel = getEle.config.viewLevel;
			var context = this.getContext();
			context.PageID = this._setViewLevel;
			this.setContext(context);
			this.getView().setBusy(true);
// 			var getEle = oEvent.getParameters();
// 			this._setViewLevel = getEle.config.viewLevel;
			var filterAssessments = "$orderby=Code%20desc";
			var getFeedbackID = oEvent.getParameter("arguments").FeedbackID;
			this._feedbackID = getFeedbackID;
			this.fetchFeedbackById();
			this.fetchAssessmentScoreList(filterAssessments);
		},
		onBackAssessment: function() {
			this.getOwnerComponent().getRouter().navTo("AssessmentFeedback");
		},
		//Here get variable from input
		getVariables: function() {
			var feedbackAssessment = {
				leadName: this.getView().byId("feedbackLeadName"),
				scheduleDate: this.getView().byId("feedbackScheduleDate"),
				scheduleTime: this.getView().byId("feedbackScheduleTime"),
				comments: this.getView().byId("feedbackAssessmentComments"),
				feedBack: this.getView().byId("feedbackStatus")
			};
			return feedbackAssessment;
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},
		onPressCreateMembership: function() {

			var that = this;
			that.getRouter().navTo("AssessmentToAccount", {
				AccountId: that._U_LeadCode,
				PageID: this._setViewLevel,
				AssessmentID: this._feedbackID

			});

			/*	this.getOwnerComponent().getRouter()
				.navTo("CreateAccountFeedbackID", {
					PageID: this._setViewLevel,
					FeedbackID:this._feedbackID
				});*/
		},
		fetchFeedbackById: function() {
			var that = this;
			var jModel = new JSONModel();
			var setFilter = encodeURI(
				"$expand=U_SS_ASSESSMENT($select=U_LeadCode,U_ScheduleSDate,U_ScheduleSTime,U_ScheduleEDate,U_ScheduleETime),U_SS_ASSESS_FEEDBACK($select=Code,Name,U_AssessmentCode,U_AssessmentScore,U_Comments)||$filter=U_SS_ASSESSMENT/Code eq U_SS_ASSESS_FEEDBACK/U_AssessmentCode and U_SS_ASSESS_FEEDBACK/Code eq " +
				this._feedbackID);
			that.fetchAssessmentFeedbackById(setFilter).done(function(getResponse) {
			   jModel.setData(getResponse.oData.value[0]);
				that.getView().setModel(jModel, "AssessmentFeedbackDetail");

				that._U_LeadCode = getResponse.oData.value[0].U_SS_ASSESSMENT.U_LeadCode;
				that.getView().setBusy(false);

				//	var getModelFeedbackDetail = that.getView().getModel("AssessmentFeedbackDetail");
				//	var getAssessmentID = getModelFeedbackDetail.getProperty("/U_AssessmentCode");
				//	that.fetchAssessmentDetail(getAssessmentID);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchAssessmentScoreList: function(filterAssessments) {
			var that = this;
			var coachAssessmentScoreSAL = new CoachAssessmentScoreSAL();
			coachAssessmentScoreSAL.fetchAssessmentScore(that, filterAssessments).done(function(getResponseScore) {
				sap.ui.getCore().setModel(getResponseScore, "AssessmentScoreList");
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchAssessmentDetail: function(getID) {
			var that = this;
			var leadDetail = new JSONModel();
			var coachAssessmentScoreSAL = new CoachAssessmentScoreSAL();
			coachAssessmentScoreSAL.fetchAssessmentById(leadDetail, getID).done(function(getResponse) {
				var getStartTime = getResponse.oData.U_ScheduleSTime;
				var getEndTime = getResponse.oData.U_ScheduleETime;
				var getStartDate = getResponse.oData.U_ScheduleSDate;
				var getEndDate = getResponse.oData.U_ScheduleEDate;
				var getFeedbackDetail = that.getView().getModel("AssessmentFeedbackDetail");
				getFeedbackDetail.setProperty("/U_ScheduleSTime", getStartTime);
				getFeedbackDetail.setProperty("/U_ScheduleETime", getEndTime);
				getFeedbackDetail.setProperty("/U_ScheduleSDate", getStartDate);
				getFeedbackDetail.setProperty("/U_ScheduleEDate", getEndDate);
				that.getView().setBusy(false);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		}
	});
});