sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("com.demo.shop.controller.View1", {
        onInit: function () {
            // Load JSON data into model
            var oModel = new JSONModel();
            oModel.loadData("model/myData.json");
            this.getView().setModel(oModel);

            // Initialize cart model
            var initialData = {
                items: []
            };
            var cartModel = new JSONModel(initialData);
            this.getView().setModel(cartModel, "Cart");
        },

        onPressAdd: function (oEvent) {
            var oSelectedItem = oEvent.getSource().getBindingContext().getObject();
            var oCartModel = this.getView().getModel("Cart");
            var aCartItems = oCartModel.getProperty("/items") || [];

            // Check if the selected item already exists in the cart
            var existingItem = aCartItems.find(function (item) {
                return item.id === oSelectedItem.id;
            });

            if (existingItem) {
                // Item already exists in the cart, update quantity and total price
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.quantity * existingItem.price;
            } else {
                // Item doesn't exist in the cart, add it
                aCartItems.push({
                    id: oSelectedItem.id,
                    Name: oSelectedItem.Name,
                    price: oSelectedItem.price,
                    totalPrice: oSelectedItem.price,
                    quantity: 1
                });
            }

            oCartModel.setProperty("/items", aCartItems);
            MessageToast.show("Item added to cart");
        },

        onRemoveFromCart: function (oEvent) {
            var oItem = oEvent.getSource().getBindingContext().getObject();
            var oCartModel = this.getView().getModel("Cart");
            var aCartItems = oCartModel.getProperty("/items");

            // Find index of item in cart
            var nIndex = aCartItems.findIndex(function (item) {
                return item.id === oItem.id;
            });

            if (nIndex > -1) {
                // Remove item from cart
                aCartItems.splice(nIndex, 1);
                oCartModel.setProperty("/items", aCartItems);
                MessageToast.show("Item removed from cart");
            }
        },

        onPressCheckout: function () {
            var grandTotalPrice = 0;
            var grandTotalQuantity = 0;
            var cart = this.getView().getModel("Cart").getProperty("/items");

            // Calculate total price and quantity
            for (var i = 0; i < cart.length; i++) {
                grandTotalPrice += cart[i].totalPrice;
                grandTotalQuantity += cart[i].quantity;
            }

            // Display total price and quantity
            this.getView().byId("id_TotalPrice").setText("Total price is: " + grandTotalPrice);
            this.getView().byId("id_TotalQuantity").setText("Total quantity is: " + grandTotalQuantity);
        }
    });
});
