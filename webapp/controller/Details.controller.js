sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/BindingMode",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, BindingMode, MessageToast, JSONModel) {
        "use strict";

        return Controller.extend("ar.com.odatav4b1project2.controller.Details", {
            onInit: function () {
                // initialize the Model
                var sServiceUrl = "/proxy/b1s/v2/";
                var oModel = new ODataModel({
                    serviceUrl: sServiceUrl,
                    synchronizationMode: "None",
                    groupId: "$direct"
                });
                oModel.setDefaultBindingMode("TwoWay");


                var BusinessPart = [];
                var JsonoModel = new JSONModel(BusinessPart);
                this.getView().setModel(JsonoModel, "BP"); // Initialze dummy Model for update

                this.getView().setModel(oModel, "BPRead");

                //Routing
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteDetails").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                this.readData(oArgs.cardCode);

            },
            readData: function (CardCode) {
                var oModel = this.getView().getModel("BPRead");
                var oView = this.getView();
                // Create the entity set binding for the Business Partner
                var oEntitySetBinding = oModel.bindContext('/BusinessPartners' + "('" + CardCode + "')");
                // Attach dataReceived event to handle data retrieval
                oEntitySetBinding.attachEventOnce("dataReceived", function () {
                    // Get the data object from the binding context
                    var oBusinessPartner = oEntitySetBinding.getBoundContext().getObject();
                    var JsonoModelDummy = new JSONModel(oBusinessPartner);
                    // this.oBusinessPartner = oEntitySetBinding.getBoundContext().getObject();
                    oView.setModel(JsonoModelDummy, "BP");
                });

                // Trigger a backend call to read data
                oEntitySetBinding.requestObject();

            },
            onEdit: function () {
                this.setEdit("_IDGenInput1");
                this.setEdit("_IDGenInput2");
                this.setEdit("_IDGenInput3");
                this.setEdit("_IDGenInput4");
                this.setEdit("_IDGenInput5");
                this.setEdit("_IDGenInput6");
                this.setEdit("_IDGenInput7");
                this.setEdit("_IDGenInput8");
                this.setEdit("_IDGenInput9");
                this.setEdit("_IDGenInput10");
                this.setEdit("_IDGenInput11");
            },
            setEdit: function (oId) {
                try {
                    var inCardCode = this.getView().byId(oId);
                    var editable = inCardCode.getEditable();
                    inCardCode.setEditable(!editable);
                } catch { }
            },
            onSave: function () {
                var oModel = this.getView().getModel("BPRead");
                var oView = this.getView();
                // Create a new entry in the entity set using createEntry method
                var sEntitySet = "/BusinessPartners";

                var oEntitySetBinding = oModel.bindContext(sEntitySet);
                try {
                    var oResult = oView.getModel("BP");
                    var oNewEntry = oResult.oData;

                } catch { }

                //Clear below data as these are creating issues and giving error that entry already exist
                oNewEntry.ContactPerson = "";
                oNewEntry.ContactEmployees = [];
                // Get the entity set binding to the root collection (no path)
                var oEntitySetBinding = oModel.bindList(sEntitySet);
                // Create a new context pointing to the entity set for creating a new entry
                var oNewEntryContext = oEntitySetBinding.create(oNewEntry);

                // oModel.submitBatch("$auto").
                oModel.submitBatch("$auto").then(function (oData) {
                    // Success handler for submitBatch
                    oModel.refresh();
                    MessageToast.show("New Card Code created.");
                    // var aResponses = oData.__batchResponses;
                }).catch(function (oError) {
                    MessageToast.show("Error creating new entry. Please try again.");
                });
                /////////////////////                
            }
        });
    });
