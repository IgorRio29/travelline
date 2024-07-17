const SERVER_BASE_URL = "https://localhost:7053";
const GET_ITEMS_URL = "/todoitems";
const GET_ITEMS_FULL_URL = SERVER_BASE_URL + GET_ITEMS_URL;

angular.module('todoApp', []).controller('todoController', function ($http, $log) {
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
        $http.get(GET_ITEMS_FULL_URL).then(function (response) {
            self.todoItems = response.data;
            $log.info("The items fetched successfully. Size: " + response.data.length);
        }, function (response) {
            $log.error("The items couldn't be fetched because of service issue");
        })
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
        $http.post(GET_ITEMS_FULL_URL, {
            name: this.itemName,
            done: false
        }).then(function (response) {
            self.todoItems.push(response.data);
            $log.info("The item '" + response.data.name + "' added successfully");
        }, function (response) {
            $log.error("The item '" + self.itemName + "' couldn't be added because of service issue")
        });
    }
    this.confirmItemEditing = function () {
        if (!this.newName || !this.isModified()) {
            return;
        }
        this.editItemIntitated = false;
        $http.put(GET_ITEMS_FULL_URL + "/" + this.selectedItem.id, {
            name: this.newName,
            done: this.selectedItem.done
        }).then(function (response) {
            $log.info("The item '" + self.selectedItem.name + "' updated successfully. New name is '" + self.newName + "'");
            self.selectedItem.name = self.newName;
            self.newName = "";
        }, function (response) {
            $log.error("The item '" + self.selectedItem.name + "' couldn't be updated because of service issue")
        })
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
            $http.delete(GET_ITEMS_FULL_URL + "/" + this.selectedItem.id).then(function (response) {
                $log.info("The item '" + self.selectedItem.name + "' removed successfully");
                self.todoItems.splice(self.todoItems.indexOf(self.selectedItem), 1);
                self.removeItemInitiated = false;
                self.selectedItem = null;
            }, function (response) {
                $log.error("The item '" + self.selectedItem.name + "' couldn't be deleted because of service issue")
            })

        }
    }
    this.toggleDoneState = function () {
        if (this.hasSelectedItem()) {
            var doneState = !this.selectedItem.done;
            $http.put(GET_ITEMS_FULL_URL + "/" + this.selectedItem.id, {
                name: this.selectedItem.name,
                done: doneState
            }).then(function (response) {
                self.selectedItem.done = doneState;
                if (doneState) {
                    $log.info("The item '" + self.selectedItem.name + "' marked as completed successfully");
                } else {
                    $log.info("The item '" + self.selectedItem.name + "' marked as NOT completed successfully");
                }
            }, function (response) {
                $log.error("The item '" + self.selectedItem.name + "' couldn't be masked as completed because of service issue")
            })
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