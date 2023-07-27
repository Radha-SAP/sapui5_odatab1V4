sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("ar.com.odatav4b1project2.controller.main", {
            onInit: function () {

            },
            onNavigate: function (oEvent) {
                try {
                    var cardCode = this.getView().byId('_IDGenComboBox1').getValue();
                } catch { };
                this.getOwnerComponent().getRouter().navTo("RouteDetails", {
                    cardCode: cardCode
                });
            }

        });
    });
