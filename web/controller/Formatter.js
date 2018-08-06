sap.ui.define(function() {
	"use strict";

	var Formatter = {

		status: function(sStatus) {
			if (sStatus === "Active") {
				return "Success";
			} else if (sStatus === "Inactive") {
				return "Error";
			} else {
				return "None";
			}
		}
	
	};

	return Formatter;

}, /* bExport= */ true);