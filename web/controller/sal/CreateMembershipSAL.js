sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.CreateMembershipSAL", {
		createBusinessPartners: function(jModel) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_MEMBER&memType=Child" + "&actionUri=BusinessPartners" + "&sessionID=" +
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
		createFather: function(jModel, filter) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_MEMBER&memType=Father" + "&actionUri=BusinessPartners" + "&sessionID=" +
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
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_MEMBER&memType=Mother" + "&actionUri=BusinessPartners" + "&sessionID=" +
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
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_MEMBER&memType=Guardian" + "&actionUri=BusinessPartners" + "&sessionID=" +
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
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			//var jModel = getThis.getView().getModel("SportsModel");
			//var bpCode = jModel.getProperty('/CardCode');
			var URL = context.baseURL + "?cmd=UpdateById&sstype=U_SS_MEMBER&memType=" + bpType + "&actionUri=BusinessPartners" + "('" + bpCode +
				"')" + "&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID;
			//var aData = jModel.getProperty("/sports_Data");
			//aData = [];
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
			var URL = context.baseURL + "?cmd=GetById&sstype=U_SS_MEMBER" + "&actionUri=BusinessPartners" + "('" + memberID + "')" +
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
					//getThis.getView().setModel(jModel, "SportsModel");
					deferred.resolve(jMdl);
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
		fetchServiceItems: function(filter) {
			var deferred = $.Deferred();
			var context = this.getContext();
			var jModel = new JSONModel();

			var URL = context.baseURL + "?cmd=Get" + "&actionUri=Items" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;

			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body);
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {

					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		fetchBusinessPartners: function(that, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = new JSONModel();
			jModel.setSizeLimit(100);
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=BusinessPartners" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			//var aData = jModel.getProperty("/sports_Data");
			//aData = [];
			$.ajax({
				type: 'GET',
				url: URL,
				headers: {
					'Prefer': 'odata.maxpagesize=1000'
				},
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body, "AssessmentList");
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		createOrder: function(jModel, filter) {
			var getThis = this;
			var deferred = $.Deferred();
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Add&sstype=U_SS_MEMBER&memType=Order" + "&actionUri=Orders" + "&sessionID=" +
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
		fetchBusinessPartnerById: function(getID, filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=Get" + "&actionUri=BusinessPartners" + "('" + getID + "')" +
				"&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			var jMdl = new JSONModel();
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
		fetchOrder: function(filter) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var URL = context.baseURL + "?cmd=GetById&sstype=fetchOrder" + "&actionUri=Orders&sessionID=" +
				context.SessionData.sessionID + "&routeID=" + context.SessionData.routeID + "&filter=" + filter;
			var jMdl = new JSONModel();
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
		}
		/*fetchMemberById: function(memMD,memberId) {
			var deferred = $.Deferred();
			var getThis = this;
			var context = getThis.getContext();
			var jModel = memMD;

			var URL = context.baseURL + "?cmd=Get" + "&actionUri=BusinessPartners" + "&sessionID=" + context.SessionData.sessionID +
				"&routeID=" + context.SessionData.routeID ;
			$.ajax({
				type: 'GET',
				url: URL,
				crossDomain: true,
				success: function(response) {
					jModel.setData(response.body);
					deferred.resolve(jModel);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		}*/
	});
});