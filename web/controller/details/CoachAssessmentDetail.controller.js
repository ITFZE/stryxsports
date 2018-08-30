sap.ui.define([
			"com/ss/app/StryxSports/controller/sal/CoachAssessmentScoreSAL",
			"com/ss/app/StryxSports/controller/sal/AssessmentFeedbackSAL",
			"com/ss/app/StryxSports/controller/sal/EmailTemplateSAL",
			"sap/ui/model/json/JSONModel",
			"sap/ui/core/ValueState",
    "com/ss/app/StryxSports/controller/util/Validator"
], function(CoachAssessmentScoreSAL, AssessmentFeedbackSAL, EmailTemplateSAL, JSONModel, ValueState, Validator) {
	"use strict";
	return CoachAssessmentScoreSAL.extend("com.ss.app.StryxSports.controller.details.CoachAssessmentDetail", {
		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("CoachAssessment").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			// Attaches validation handlers
			sap.ui.getCore().attachValidationError(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.None);
			});
		},
		_onRouteMatched: function(oEvent) {
			var getEle = oEvent.getParameters();
			var coachAssessementId = this.getVariables();
			this._setViewLevel = getEle.config.viewLevel;
			var context = this.getContext();
			context.PageID = this._setViewLevel;
			this.setContext(context);
			var filterAssessments = "$orderby=Code%20desc";
			this.fetchAssessmentScoreList(filterAssessments);
			this.getView().setBusy(false);
			var getATID = oEvent.getParameter("arguments").assessmentID;
			this.fetchAssessmentDetail(getATID);
			this.getView().byId("coachAssessmentComments").setValueState("None");
			coachAssessementId.feedBack.setValueState("None");
		},
		onBackCoachAssessment: function() {
			this.getOwnerComponent().getRouter().navTo("CoachAssessmentMaster");
			var coachAssessementId = this.getVariables();
			coachAssessementId.comments.setValue("");
			coachAssessementId.comments.setValueState("None");
			coachAssessementId.feedBack.setValueState("None");
		},
		onPressCloseCoachAss: function() {
			var coachAssessementId = this.getVariables();
			coachAssessementId.comments.setValue("");
			coachAssessementId.feedBack.setSelectedKey("-1");
			coachAssessementId.comments.setValueState("None");
			coachAssessementId.feedBack.setValueState("None");
		},
		getVariables: function() {
			var CoachAssessment = {
				leadName: this.getView().byId("coachLeadName"),
				scheduleDate: this.getView().byId("coachScheduleDate"),
				scheduleTime: this.getView().byId("coachScheduleTime"),
				comments: this.getView().byId("coachAssessmentComments"),
				feedBack: this.getView().byId("coachFeedback"),
				btnSave: this.getView().byId("save")
			};
			return CoachAssessment;
		},
		onPressSaveCoachAssessment: function() {
		    var getEle = this.getVariables();
			if (getEle.comments.getValue() == "") {
			    getEle.comments.setValueState("Error");
			}else if(getEle.feedBack.getSelectedKey() == "-1") {
			    getEle.comments.setValueState("None");
			    getEle.feedBack.setValueState("Error");
			}else{   
			    getEle.comments.setValueState("None");
			    getEle.feedBack.setValueState("None");
				this.createFeedback();
			}
		},
		selectedFeedback: function() {
			var getVariables = this.getVariables();
			if (getVariables.feedBack.getSelectedKey() !== "-1") {
				getVariables.feedBack.setValueState("None");
			} else {
				getVariables.feedBack.setValueState("Error");
			}
		},
		oBundle: function(getToastMessage) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var getValues = oBundle.getText(getToastMessage);
			return getValues;
		},
		setSelBusy: function() {
			var othat = this;
			var selFeed = othat.getView().byId("coachFeedback");
			selFeed.setBusy(false);
		},
		fetchAssessmentDetail: function(getID) {
			var that = this;
		//	var coachAssessementId = this.getVariables();
			var leadDetail = new JSONModel();
			this.fetchAssessmentById(leadDetail, getID).done(function(getResponse) {
				that.getView().setModel(getResponse, "CreateAssessments");
				var getCreateAssessmentsModel = that.getView().getModel("CreateAssessments");
				getCreateAssessmentsModel.setProperty("/U_AssessmentCode", getID);
				that.getView().setBusy(false);
				// var selFeed = that.getView().byId("coachFeedback");
				// var oItem = new sap.ui.core.Item({
				// 	text: "Select Feedback",
				// 	key: -1
				// });
				// selFeed.insertItem(oItem, 0);
				// selFeed.setSelectedItem(oItem);
				// coachAssessementId.feedBack.setValueState("None");
			//	selFeed.setBusy(true);
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		fetchAssessmentScoreList: function(filterAssessments) {
			var that = this;
			that.setSelBusy(true);
			this.fetchAssessmentScore(that, filterAssessments).done(function(getResponseScore) {
				sap.ui.getCore().setModel(getResponseScore, "AssessmentScoreList");
				var selFeed = that.getView().byId("coachFeedback");
				var oItem = new sap.ui.core.Item({
					text: "Select Feedback",
					key: -1
				});
				selFeed.insertItem(oItem, 0);
				selFeed.setSelectedItem(oItem);
				that.setSelBusy(true);
			}).fail(function(err) {
				that.setSelBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		createFeedback: function() {
			var that = this;
			var getCreateAssessmentsModel = this.getView().getModel("CreateAssessments");
			delete getCreateAssessmentsModel.oData.U_ScheduleEDate;
			delete getCreateAssessmentsModel.oData.U_ScheduleSDate;
			delete getCreateAssessmentsModel.oData.U_ScheduleETime;
			delete getCreateAssessmentsModel.oData.U_ScheduleSTime;
			delete getCreateAssessmentsModel.oData.U_TeamCoachCode;
			delete getCreateAssessmentsModel.oData.U_LeadCode;

			var getVariables = this.getVariables();
			var getselCode = getVariables.feedBack.getSelectedKey();
			try {
				getCreateAssessmentsModel.setProperty("/U_AssessmentScore", getselCode);

			} catch (e) {
				console.log(e.toString());
			}
			that.getView().setBusy(false);
			that.createFeedbackScore(getCreateAssessmentsModel).done(function() {
				that.getView().setBusy(false);
				that.fetchMessageOk("Create Coach Assessment", "Success", "Created successfully.", "DashBoard");
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
			});
		},
		sendEmail: function() {
			var that = this;
			var getResponse;
			that.getView().setBusy(true);
			var getEmailTemplateSAL = new EmailTemplateSAL();
			var emFilter = encodeURI("$filter=U_TemplateType eq '5'");
			getEmailTemplateSAL.fetchEmailTemplateName(that, emFilter).done(function(response) {
				if (response.oData.value.length > 0) {
					getResponse = response.oData.value[0].U_Template;
					var getModel = that.getView().getModel("CreateAssessments");
					getModel.setProperty("/messages", getResponse);
					getEmailTemplateSAL.sentMail(getModel).done(function() {
						that.getView().setBusy(false);
					}).fail(function(err) {
						that.getView().setBusy(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "Fetch Templates");
					});
				} else {}
			}).fail(function(err) {
				that.getView().setBusy(false);
				that.fetchMessageOk("Error", "Error", err.toString(), "Fetch Templates");
			});
		}
	});
});