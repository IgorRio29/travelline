angular.module('todoApp', []).controller('todoController', function ($http, itemManagementService) {
    this.addItemInitiated = false;
    this.editItemIntitated = false;
    this.removeItemInitiated = false;
    this.itemName = null;
    this.newName = null;
    let self = this;
    this.searchInitiated = false;
    this.todoItems = [];
    this.selectedItem = null;
    this.filteredItems = this.todoItems;
    this.init = function () {
        this.fetchTodoItems();
    }
    this.fetchTodoItems = function () {
        let promise = itemManagementService.getItems();
        promise.then(function (value) {
            self.todoItems = value;
        });
    }
    this.initiateItemAdding = function () {
        this.addItemInitiated = !this.addItemInitiated;
        if (this.addItemInitiated) {
            this.itemName = "";
        }
    }
    this.initiateItemEditing = function () {
        if (this.selectedItemIsDone()) {
            return;
        }
        this.editItemIntitated = !this.editItemIntitated;
        if (this.editItemIntitated) {
            this.newName = this.selectedItem.name;
        }
    }
    this.initiateItemRemoval = function () {
        if (!this.selectedItemIsDone()) {
            this.removeItemInitiated = !this.removeItemInitiated;
        }
    }
    this.confirmItemAdding = function () {
        if (!this.itemName) {
            return;
        }
        this.addItemInitiated = false;
        let promise = itemManagementService.addItem(this.itemName);
        promise.then(function (value) {
            self.todoItems.push(value);
        });
    }
    this.confirmItemEditing = function () {
        if (!this.newName || !this.isModified()) {
            return;
        }
        this.editItemIntitated = false;
        let promise = itemManagementService.updateItem(this.selectedItem, this.newName, this.selectedItem.done);
        promise.then(function (value) {
            self.selectedItem.name = self.newName;
            self.newName = "";
        });
    }
    this.selectItem = function (item) {
        if (item === this.selectedItem) {
            this.selectedItem = null;
            return;
        }
        this.selectedItem = item;
    }
    this.isSelectedItem = function (item) {
        return item === this.selectedItem;
    }
    this.hasSelectedItem = function () {
        return this.selectedItem !== null;
    }
    this.isModified = function () {
        return this.selectedItem && this.selectedItem.name != this.newName;
    }
    this.confirmItemRemoval = function () {
        if (this.hasSelectedItem()) {
            itemManagementService.removeItem(this.selectedItem);
            self.todoItems.splice(self.todoItems.indexOf(self.selectedItem), 1);
            self.removeItemInitiated = false;
            self.selectedItem = null;
        }
    }
    this.toggleDoneState = function () {
        if (this.hasSelectedItem()) {
            var doneState = !this.selectedItem.done;
            let promise = itemManagementService.updateItem(this.selectedItem, this.selectedItem.name, doneState);
            promise.then(function (value) {
                self.selectedItem.done = doneState;
            });
        }
    }
    this.selectedItemIsDone = function () {
        return this.selectedItem ? this.selectedItem.done : false;
    }
    this.toggleSearch = function () {
        this.searchInitiated = !this.searchInitiated;
        if (!this.searchInitiated) {
            this.filteredItems = this.todoItems;
        } else {
            this.searchEditorValue = "";
            this.filteredItems = this.todoItems;
        }
    }
    this.filterItems = function () {
        if (this.searchEditorValue) {
            this.filteredItems = this.todoItems.filter((item) => item.name.toLowerCase().includes(this.searchEditorValue.toLowerCase()));
        } else {
            this.filteredItems = this.todoItems;
        }
    }
    this.hasEnoughRecordsForSearch = function () {
        return this.todoItems && this.todoItems.length > 5;
    }
    this.getItems = function () {
        return this.searchInitiated ? this.filteredItems : this.todoItems;
    }

});