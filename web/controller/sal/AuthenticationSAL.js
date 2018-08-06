sap.ui.define([
	"com/ss/app/StryxSports/controller/BaseController"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.ss.app.StryxSports.controller.sal.AuthenticationSAL", {
		logAuthentication: function(auth) {
			var deferred = $.Deferred();
			var that = this;
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Login" + "&actionUri=Login&filter=''";
			$.ajax({
				type: 'POST',
				data: JSON.stringify(auth),
				url: URL,
				crossDomain: true,
				success: function(response) {
					deferred.resolve(response);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		},
		logoutAuthentication: function() {
		    var deferred = $.Deferred();
			var that = this;
			var context = that.getContext();
			var URL = context.baseURL + "?cmd=Logout" + "&actionUri=Logout&filter=''" +"&sessionID=" + context.SessionData
				.sessionID + "&routeID=" + context.SessionData.routeID;
			var res = $.ajax({
				type: 'POST',
				url: URL,
				crossDomain: true,
				success: function(response, textStatus, xhr) {
					deferred.resolve(response);
				},
				error: function(xhr, status, error) {
					deferred.reject(error);
				}
			});
			return deferred.promise();
		}

	});

});