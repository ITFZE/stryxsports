sap.ui.define([
    "sap/ui/model/json/JSONModel",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	"sap/ui/core/routing/History",
	"com/ss/app/StryxSports/controller/BaseController",
	"com/ss/app/StryxSports/controller/sal/SportsSAL",
	"com/ss/app/StryxSports/controller/sal/SeasonSAL",
	"com/ss/app/StryxSports/controller/sal/SportCategorySAL",
	"com/ss/app/StryxSports/controller/sal/LocationsSAL",
	"com/ss/app/StryxSports/controller/sal/TeamsSAL",
	"com/ss/app/StryxSports/controller/sal/CoachsSAL",
	"com/ss/app/StryxSports/controller/sal/AssessmentSAL",
	"com/ss/app/StryxSports/controller/sal/UserProfileSAL",
	"com/ss/app/StryxSports/controller/sal/CreateAssessmentsSAL",
	"com/ss/app/StryxSports/controller/sal/CoachAssessmentScoreSAL",
	"com/ss/app/StryxSports/controller/sal/SMSTemplateSAL",
	"com/ss/app/StryxSports/controller/sal/AssessmentFeedbackSAL",
	"com/ss/app/StryxSports/controller/sal/EmailTemplateSAL",
	"com/ss/app/StryxSports/controller/sal/AuthenticationSAL",
	"com/ss/app/StryxSports/controller/sal/ViewAccountSAL",
	"com/ss/app/StryxSports/controller/sal/ScheduleSAL",
	"com/ss/app/StryxSports/controller/sal/HolidaySAL"

], function(JSONModel, Dialog, Button, Text, History, BaseController, SportsSAL, SeasonSAL, SportCategorySAL, LocationsSAL, TeamsSAL,
	CoachsSAL, AssessmentSAL, UserProfileSAL, CreateAssessmentsSAL, CoachAssessmentScoreSAL, SMSTemplateSAL, AssessmentFeedbackSAL, EmailTemplateSAL,
	AuthenticationSAL, ViewAccountSAL, ScheduleSAL,HolidaySAL) {
	"use strict";

	return BaseController.extend("com.ss.app.StryxSports.controller.DashBoard", {
		onInit: function() {
			this._setViewLevel = "";
			var oRouter = this.getRouter();
			oRouter.getRoute("DashBoard").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
        
        _onRouteMatched: function(evt){
/*            var scheduleSal = new ScheduleSAL();
            // Moment
            scheduleSal.getMoment().done(function(response){
                var res = response;
            }).fail(function(error){
                var err = error;
            });
            // LaterJS
            scheduleSal.getLater().done(function(response){
                var res = response;
            }).fail(function(error){
                var err = error;
            });*/
        },
        
		handleMenuPress: function(oEvent) {
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},

		// Start - Side Navigation Logic
		onItemSelect: function(oEvent) {
			var that = this;
			var getSessionData = this.getContext();
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			toolPage.setSideExpanded(false);
			var item = oEvent.getParameter('item');
			switch (item.getKey()) {
				case 'Sports':
					that.showLoading(true);
					var sportSal = new SportsSAL();
					var jModel;
					var filt = "$orderby=Code%20desc";
					sportSal.fetchSports(this, filt).done(function(obj) {
						jModel = obj;
						sap.ui.getCore().setModel(jModel, "SportsList");
						sap.ui.getCore().getModel("SportsList").refresh(true);
						that.showLoading(false);
						that.getRouter().navTo(item.getKey());
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;
				case 'SportsCategory':
					that.showLoading(true);
					var sportsCategory = new SportCategorySAL();
					var sportFilter = "$orderby=Code%20desc";
					sportsCategory.fetchSportCategoryMasters(this, sportFilter).done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "SportsCategoryMaster");
						sap.ui.getCore().getModel("SportsCategoryMaster").refresh(true);
						that.showLoading(false);
						that.getRouter().navTo(item.getKey());
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;

				case 'Location':
					var locFilter = "$orderby=Code%20desc";
					var locationsSAL = new LocationsSAL();
					that.showLoading(true);
					locationsSAL.fetchLocationsMasters(this, locFilter).done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "LocationMasters");
						sap.ui.getCore().getModel("LocationMasters").refresh(true);
						that.showLoading(false);
						that.getRouter().navTo(item.getKey());
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;
				case 'Seasons':
					var sfilter = "$orderby=Code%20desc";
					var seasonSal = new SeasonSAL();
					that.showLoading(true);
					seasonSal.fetchSeason(this, sfilter).done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "SeasonMaster");
						sap.ui.getCore().getModel("SeasonMaster").refresh(true);
						that.showLoading(false);
						that.getRouter().navTo(item.getKey());
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;
				case 'CoachesDetail':
					var filterPosition = "$filter=Name%20eq%20" + "%27" + getSessionData.Coaches.empType + "%27";
					that.showLoading(true);
					var coachsSAL = new CoachsSAL();
					coachsSAL.fetchEmployeePosition(filterPosition).done(function(getID) {
						coachsSAL.fetchEmployeesPositionInfo(getID).done(function(getResponse) {
							sap.ui.getCore().setModel(getResponse, "CoachsMaster");
							that.showLoading(false);
							var getCoachs = sap.ui.getCore().getModel("CoachsMaster");
							var createfilterModel = getCoachs.oData.value[0];
							sap.ui.getCore().setModel(createfilterModel, "filterMaster");
							that.getOwnerComponent().getRouter()
								.navTo(item.getKey(), {
									EmployeeID: getCoachs.oData.value[0].EmployeeID
								});
						}).fail(function(err) {
							that.showLoading(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
						});

					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;
					
				/*	case 'Location':
				this.getRouter().navTo(item.getKey());
				break;*/

				case 'Teams':
					var TeamSal = new TeamsSAL();
					var tFilter = "$orderby=Code%20desc";
					that.showLoading(true);
					TeamSal.fetchTeams(this, tFilter).done(function(obj) {
						sap.ui.getCore().setModel(obj, "TeamsList");
						that.showLoading(false);
						that.getRouter().navTo(item.getKey());
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;

				case 'CreateAssessments':
					that.getRouter().navTo(item.getKey());
					break;
				case 'CoachAssessment':
					var filters = "$orderby=Code%20desc";
					var getFeedback = null,
						getAssessments = null,
						getAssessmentsID = null;
					var finalAssessments = [];
					that.showLoading(true);
					var coachAssessmentScore = new CoachAssessmentScoreSAL();
					var assessmentFeedbackSAL = new AssessmentFeedbackSAL();
					var assFB = new JSONModel();

					coachAssessmentScore.fetchAssessments(that, filters).done(function(getResponseAssessments) {
						getAssessments = getResponseAssessments;
						if (getResponseAssessments.oData.value.length > 0) {
							assessmentFeedbackSAL.fetchAssessmentFeedbacks(filters).done(function(getResponseFeedback) {
								getFeedback = getResponseFeedback;
								if (getResponseFeedback.oData.value.length > 0) {
									for (var i = 0; i < getAssessments.oData.value.length; i++) {
										var isPush = true;
										for (var j = 0; j < getFeedback.oData.value.length; j++) {
											if (getFeedback.oData.value[j].U_AssessmentCode === getAssessments.oData.value[i].Code.toString()) {
												that.showLoading(false);
												isPush = false;
												break;
											}
										}
										if (isPush) {
											finalAssessments.push(getAssessments.oData.value[i]);
										}
										isPush = false;
									}
								} else {
									that.showLoading(false);
									sap.ui.getCore().setModel(getResponseAssessments, "AssessmentsList");
									getAssessmentsID = getResponseAssessments.oData.value[0].Code;

									that.getOwnerComponent().getRouter()
										.navTo(item.getKey(), {
											assessmentID: getAssessmentsID
										});

								}

							}).fail(function(err) {
								that.showLoading(false);
								that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
							});

							that.showLoading(false);
							if (finalAssessments.length > 0) {
								assFB.setData(finalAssessments);
								getAssessmentsID = finalAssessments[0].Code;
								sap.ui.getCore().setModel(assFB, "AssessmentsList");
								that.getOwnerComponent().getRouter()
									.navTo(item.getKey(), {
										assessmentID: getAssessmentsID
									});
							} else {
								that.showLoading(false);
								sap.ui.getCore().setModel(getResponseAssessments, "AssessmentsList");
								getAssessmentsID = getResponseAssessments.oData.value[0].Code;

								that.getOwnerComponent().getRouter()
									.navTo(item.getKey(), {
										assessmentID: getAssessmentsID
									});
							}
						} else {
							that.showLoading(false);
							that.fetchMessageOk("Note", "Warning", "No Data ", "DashBoard");
						}

					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});

					break;
				case 'AssessmentFeedbackDetail':
					var filterFeedbacks = "$orderby=Code%20desc";
					that.showLoading(true);
					var assessmentFeedback = new AssessmentFeedbackSAL();
					assessmentFeedback.fetchAssessmentFeedbacks(filterFeedbacks).done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "AssessmentFeedbacksList");
						var getAssessmentsList = sap.ui.getCore().getModel("AssessmentFeedbacksList");

						if (getResponse.oData.value.length > 0) {
							var getFeedbackID = getAssessmentsList.oData.value[0].Code;
							that.showLoading(false);
							that.getOwnerComponent().getRouter()
								.navTo(item.getKey(), {
									FeedbackID: getFeedbackID
								});
						} else {
							that.showLoading(false);
							that.fetchMessageOk("Note", "Warning", "No Data ", "DashBoard");
						}

					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;

				case 'EmailTemplate':
					var emailSal = new EmailTemplateSAL();
					var emailFilter = "$orderby=Code%20desc";
					that.showLoading(true);
					emailSal.fetchEmailTemplateName(that, emailFilter).done(function(obj) {
						sap.ui.getCore().setModel(obj, "EmailTemplate");
						that.showLoading(false);
						that.getRouter().navTo(item.getKey());
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;

				case 'SMSTemplate':
					var smsSal = new SMSTemplateSAL();
					var smsFilter = "$orderby=Code%20desc";
					that.showLoading(true);
					smsSal.fetchSMSTemplateName(that, smsFilter).done(function(obj) {
						sap.ui.getCore().setModel(obj, "SMSTemplate");
						that.showLoading(false);
						that.getRouter().navTo(item.getKey());
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;
				case 'UserManagementDetail':
					that.showLoading(true);
					var userSAL = new UserProfileSAL();
					userSAL.fetchUserMangementEmployeeMaster().done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "UserManagement");
						var getCoachs = sap.ui.getCore().getModel("UserManagement");
						if (getResponse.oData.value.length > 0) {
							var createfilterModel = getCoachs.oData.value[0];
							that.showLoading(false);
							that.getOwnerComponent().getRouter()
								.navTo(item.getKey(), {
									EmployeeID: createfilterModel
								});
						} else {
							that.showLoading(false);
							that.fetchMessageOk("Note", "Warning", "No Data ", "DashBoard");
						}
    						/*that.showLoading(false);
    						var getCoachs = sap.ui.getCore().getModel("UserManagement");
    						var createfilterModel = getCoachs.oData.value[0];
    						sap.ui.getCore().setModel(createfilterModel, "filterMaster");
    						that.getOwnerComponent().getRouter()
    							.navTo(item.getKey(), {
    								EmployeeID: getCoachs.oData.value[0].EmployeeID
    							});*/
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;
				case 'CreateEvent':
					that.getOwnerComponent().getRouter()
						.navTo("CreateEvent", {
							PageID: 2
						});
					break;
				case 'ViewCalendar':
                    that.showLoading(false);
					that.getRouter().navTo(item.getKey());
					break;
				case 'HolidayListMaster':
                   that.showLoading(true);
					var holiSAL = new HolidaySAL();
					var holiModel = "$orderby=Code%20desc";
					holiSAL.fetchHolidayList(this, holiModel).done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "HolidayListModel");
						sap.ui.getCore().getModel("HolidayListModel").refresh(true);
						that.showLoading(false);
						that.getRouter().navTo(item.getKey());
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;
				default:
					this.getRouter().navTo(item.getKey());
					break;
			}
		},
		// End - Side Navigation Logic

		onTilePress: function(oEvt) {
			var that = this;
			var getSessionData = this.getContext();
			var getPages = oEvt.getSource().data("route");
			switch (getPages) {
				case 'Sports':
					that.showLoading(true);
					var sportSal = new SportsSAL();
					var jModel = new JSONModel();
					var filt = "$orderby=Code%20desc";
					sportSal.fetchSports(this, filt).done(function(obj) {
						jModel = obj;
						sap.ui.getCore().setModel(jModel, "SportsList");
						sap.ui.getCore().getModel("SportsList").refresh(true);
						that.showLoading(false);
						that.getRouter().navTo(getPages);
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;
				case 'SportsCategory':
					that.showLoading(true);
					var sportsCategory = new SportCategorySAL();
					var sportFilter = "$orderby=Code%20desc";
					sportsCategory.fetchSportCategoryMasters(this, sportFilter).done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "SportsCategoryMaster");
						sap.ui.getCore().getModel("SportsCategoryMaster").refresh(true);
						that.showLoading(false);
						that.getRouter().navTo(getPages);
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;

				case 'Location':
					that.showLoading(true);
					var locFilter = "$orderby=Code%20desc";
					var locationsSAL = new LocationsSAL();
					that.showLoading(true);
					locationsSAL.fetchLocationsMasters(this, locFilter).done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "LocationMasters");
						sap.ui.getCore().getModel("LocationMasters").refresh(true);
						that.showLoading(false);
						that.getRouter().navTo(getPages);
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;
				case 'Seasons':
					var sfilter = "$orderby=Code%20desc";
					that.showLoading(true);
					var seasonSal = new SeasonSAL();
					seasonSal.fetchSeason(this, sfilter).done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "SeasonMaster");
						sap.ui.getCore().getModel("SeasonMaster").refresh(true);
						that.showLoading(false);
						that.getRouter().navTo(getPages);
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;
				case 'CoachesDetail':
					var filterPosition = "$filter=Name%20eq%20" + "%27" + getSessionData.Coaches.empType + "%27";
					that.showLoading(true);
					var coachsSAL = new CoachsSAL();
					coachsSAL.fetchEmployeePosition(filterPosition).done(function(getID) {
						coachsSAL.fetchEmployeesPositionInfo(getID).done(function(getResponse) {
							sap.ui.getCore().setModel(getResponse, "CoachsMaster");
							that.showLoading(false);
							var getCoachs = sap.ui.getCore().getModel("CoachsMaster");
							var createfilterModel = getCoachs.oData.value[0];
							sap.ui.getCore().setModel(createfilterModel, "filterMaster");
							that.getOwnerComponent().getRouter()
								.navTo(getPages, {
									EmployeeID: getCoachs.oData.value[0].EmployeeID
								});
						}).fail(function(err) {
							that.showLoading(false);
							that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
						});

					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;

				case 'Teams':
					var TeamSal = new TeamsSAL();
					var tFilter = "$orderby=Code%20desc";
					that.showLoading(true);
					TeamSal.fetchTeams(this, tFilter).done(function(obj) {
						sap.ui.getCore().setModel(obj, "TeamsList");
						that.showLoading(false);
						that.getRouter().navTo(getPages);
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;

				case 'CreateAssessments':
					that.getRouter().navTo(getPages);
					break;

				case 'CoachAssessment':
					var filters = "$orderby=Code%20desc";
					var getFeedback = null,
						getAssessments = null,
						getAssessmentsID = null;
					var finalAssessments = [];
					that.showLoading(true);
					var coachAssessmentScore = new CoachAssessmentScoreSAL();
					var assessmentFeedbackSAL = new AssessmentFeedbackSAL();
					var assFB = new JSONModel();

					coachAssessmentScore.fetchAssessments(that, filters).done(function(getResponseAssessments) {
						getAssessments = getResponseAssessments;
						if (getResponseAssessments.oData.value.length > 0) {
							assessmentFeedbackSAL.fetchAssessmentFeedbacks(filters).done(function(getResponseFeedback) {
								getFeedback = getResponseFeedback;
								if (getResponseFeedback.oData.value.length > 0) {
									for (var i = 0; i < getAssessments.oData.value.length; i++) {
										var isPush = true;
										for (var j = 0; j < getFeedback.oData.value.length; j++) {
											if (getFeedback.oData.value[j].U_AssessmentCode === getAssessments.oData.value[i].Code.toString()) {
												that.showLoading(false);
												isPush = false;
												break;
											}
										}
										if (isPush) {
											finalAssessments.push(getAssessments.oData.value[i]);
										}
										isPush = false;
									}
								} else {
									/*	that.showLoading(false);
									sap.ui.getCore().setModel(getResponseAssessments, "AssessmentsList");
									getAssessmentsID = getResponseAssessments.oData.value[0].Code;

									that.getOwnerComponent().getRouter()
										.navTo(getPages, {
											assessmentID: getAssessmentsID
										});*/
								}

							}).fail(function(err) {
								that.showLoading(false);
								that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
							});

							that.showLoading(false);
							if (finalAssessments.length > 0) {
								assFB.setData(finalAssessments);
								getAssessmentsID = finalAssessments[0].Code;
								sap.ui.getCore().setModel(assFB, "AssessmentsList");
								that.getOwnerComponent().getRouter()
									.navTo(getPages, {
										assessmentID: getAssessmentsID
									});
							} else {
								that.showLoading(false);
								sap.ui.getCore().setModel(getResponseAssessments, "AssessmentsList");
								getAssessmentsID = getResponseAssessments.oData.value[0].Code;

								that.getOwnerComponent().getRouter()
									.navTo(getPages, {
										assessmentID: getAssessmentsID
									});
							}
						} else {
							that.showLoading(false);
							that.fetchMessageOk("Note", "Warning", "No Data ", "DashBoard");
						}

					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;

				case 'AssessmentFeedbackDetail':
					var filterFeedbacks = "$orderby=Code%20desc";
					that.showLoading(true);
					var assessmentFeedback = new AssessmentFeedbackSAL();
					assessmentFeedback.fetchAssessmentFeedbacks(filterFeedbacks).done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "AssessmentFeedbacksList");
						var getAssessmentsList = sap.ui.getCore().getModel("AssessmentFeedbacksList");

						if (getResponse.oData.value.length > 0) {
							var getFeedbackID = getAssessmentsList.oData.value[0].Code;
							that.showLoading(false);
							that.getOwnerComponent().getRouter()
								.navTo(getPages, {
									FeedbackID: getFeedbackID
								});
						} else {
							that.showLoading(false);
							that.fetchMessageOk("Note", "Warning", "No Data ", "DashBoard");
						}

					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;

				case 'EmailTemplate':
					var emailSal = new EmailTemplateSAL();
					var emailFilter = "$orderby=Code%20desc";
					that.showLoading(true);
					emailSal.fetchEmailTemplateName(that, emailFilter).done(function(obj) {
						sap.ui.getCore().setModel(obj, "EmailTemplate");
						that.showLoading(false);
						that.getRouter().navTo(getPages);
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;

				case 'SMSTemplate':
					var smsSal = new SMSTemplateSAL();
					var smsFilter = "$orderby=Code%20desc";
					that.showLoading(true);
					smsSal.fetchSMSTemplateName(that, smsFilter).done(function(obj) {
						sap.ui.getCore().setModel(obj, "SMSTemplate");
						that.showLoading(false);
						that.getRouter().navTo(getPages);
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;

				case 'UserManagementDetail':
					that.showLoading(true);
					var userSAL = new UserProfileSAL();
					userSAL.fetchUserMangementEmployeeMaster().done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "UserManagement");
						that.showLoading(false);
						var getCoachs = sap.ui.getCore().getModel("UserManagement");
						var createfilterModel = getCoachs.oData.value[0];
						sap.ui.getCore().setModel(createfilterModel, "filterMaster");
						that.getOwnerComponent().getRouter()
							.navTo(getPages, {
								EmployeeID: getCoachs.oData.value[0].EmployeeID
							});
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;
				case 'CreateEvent':
					that.getOwnerComponent().getRouter()
						.navTo("CreateEvent", {
							PageID: 2
						});
					break;
				case 'ViewCalendar':
                    that.showLoading(false);
					that.getRouter().navTo(getPages);
					break;
				case 'HolidayListMaster':
					var hfilter = "$orderby=Code%20desc";
					that.showLoading(true);
					var holidaySAL = new HolidaySAL();
					holidaySAL.fetchHoliday(this, hfilter).done(function(getResponse) {
						sap.ui.getCore().setModel(getResponse, "HolidayListModel");
						sap.ui.getCore().getModel("HolidayListModel").refresh(true);
						that.showLoading(false);
						that.getRouter().navTo(getPages);
					}).fail(function(err) {
						that.showLoading(false);
						that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
					});
					break;
				default:
					this.getRouter().navTo(getPages);
					break;
			}
		},

		onPressUserProflie: function() {
			this.getRouter().navTo("UserProfile", {
				PageID: "1"
			});
		},

		handleLogoutPress: function() {
			var that = this;
			var logoutDialog = new Dialog({
				title: 'Logout',
				type: 'Message',
				state: 'Warning',

				content: new Text({
					text: 'Are you sure you want to end the session?'
				}),
				beginButton: new Button({
					text: 'OK',
					press: function() {
						var authSal = new AuthenticationSAL();
						authSal.logoutAuthentication().done(function(res) {
							var contexts = that.getContext();
							contexts.User = {};
							contexts.SessionData.sessionID = '';
							contexts.SessionData.routeID = '';
							/*                    			var oHistory = History.getInstance();
                    			oHistory.aHistory = [];*/
							that.getRouter().navTo("Login");
						}).fail(function(err) {
							that.fetchMessageOk("Error", "Error", err.toString(), "DashBoard");
						});
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function() {
						logoutDialog.close();
					}
				}),
				afterClose: function() {
					logoutDialog.destroy();
				}
			});
			logoutDialog.open();
		}
	});
});