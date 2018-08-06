sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.CreateLeadsSAL", {

		createBusinessPartnersChild: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_LeadCreate&memType=Child" + "&actionUri=BusinessPartners" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'POST',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function(response) {
					var respJson = response.body;
					deferred.resolve(respJson);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchCountriesName: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=Countries" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body, "MembershipCountryName");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchSchool: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=U_SS_SCHOOLS" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body, "SchoolListName");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		createFather: function(jModel, filter) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_LeadCreate&memType=Father" + "&actionUri=BusinessPartners" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'POST',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function(response) {
					var respJson = response.body;
					deferred.resolve(respJson);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		createMother: function(jModel, filter) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_LeadCreate&memType=Mother" + "&actionUri=BusinessPartners" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'POST',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function(response) {
					var respJson = response.body;
					deferred.resolve(respJson);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		createGuardian: function(jModel, filter) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_LeadCreate&memType=Guardian" + "&actionUri=BusinessPartners" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'POST',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function(response) {
					var respJson = response.body;
					deferred.resolve(respJson);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		updateBusinessPartner: function(jModel, bpType, bpCode) {
			var deferred = $.Deferred();
			var context = this.getContext();
			var URL = context.baseURL + "?cmd=UpdateById&sstype=U_SS_LeadCreate&memType=" + bpType + "&actionUri=BusinessPartners" + "('" +
				bpCode +
				"')" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			$.ajax({
				type: 'PATCH',
				url: URL,
				data: jModel.getJSON(),
				crossDomain: true,
				success: function(response) {
					var respJson = response.body;
					deferred.resolve(respJson);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchMemberById: function(jMdl, memberID) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=GetById&sstype=U_SS_LeadCreate" + "&actionUri=BusinessPartners" + "('" + memberID + "')" +
				"&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			//var aData = jModel.getProperty("/sports_Data");
			//aData = [];
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jMdl.setData(response.body);
					deferred.resolve(jMdl);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchLeadSports: function(filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" +
				"&actionUri=$crossjoin(U_SS_LEAD_SPORTS,U_SS_SPORTS)" +
				"&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					var body = response.body.value;
					var sports = [];
					if (body.length > 0) {
						for (var i = 0; i < body.length; i++) {
							body[i].U_SS_SPORTS.rec_status = 'e';
							body[i].U_SS_SPORTS.LSCode = body[i].U_SS_LEAD_SPORTS.Code;
							sports.push(body[i].U_SS_SPORTS);
						}
					}
					deferred.resolve(sports);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchLeadLocations: function(filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" +
				"&actionUri=$crossjoin(U_SS_LEAD_LOCATIONS,U_SS_LOCATIONS)" +
				"&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					var body = response.body.value;
					var locations = [];
					if (body.length > 0) {
						for (var i = 0; i < body.length; i++) {
							body[i].U_SS_LOCATIONS.rec_status = 'e';
							body[i].U_SS_LOCATIONS.LSCode = body[i].U_SS_LEAD_LOCATIONS.Code;
							locations.push(body[i].U_SS_LOCATIONS);
						}
					}
					deferred.resolve(locations);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		}
		/*	
		fetchMemberById: function(memberID) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get&actionUri=BusinessPartners" + "('" + memberID + "')" +
				"&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			//var aData = jModel.getProperty("/sports_Data");
			//aData = [];
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					deferred.resolve(response.body);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		}*/
	});
});