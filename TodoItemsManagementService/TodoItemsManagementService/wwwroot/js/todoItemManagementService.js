const SERVER_BASE_URL = "https://localhost:7053";
const GET_ITEMS_URL = "/todoitems";
const GET_ITEMS_FULL_URL = SERVER_BASE_URL + GET_ITEMS_URL;

var todoApp = angular.module('todoApp');
todoApp.factory('itemManagementService', function ($http, $q, $log) {
    return {
        getItems: function () {
            var deferred = $q.defer();
            $http.get(GET_ITEMS_FULL_URL).then(function success(response) {
                deferred.resolve(response.data);
                $log.info("The items fetched successfully. Size: " + response.data.length);
            }, function error(response) {
                $log.error("The items couldn't be fetched because of service issue");
                deferred.reject(response.status);
            })
            return deferred.promise;
        },
        addItem: function (name) {
            var deferred = $q.defer();
            $http.post(GET_ITEMS_FULL_URL, {
                name: name,
                done: false
            }).then(function success(response) {
                $log.info("The item '" + response.data.name + "' added successfully");
                deferred.resolve(response.data);
            }, function error(response) {
                $log.error("The item '" + self.itemName + "' couldn't be added because of service issue");
                deferred.reject(response.status);
            });
            return deferred.promise;
        },
        updateItem: function (item, newName, doneState) {
            var deferred = $q.defer();
            $http.put(GET_ITEMS_FULL_URL + "/" + item.id, {
                id: item.id,
                name: newName,
                done: doneState
            }).then(function success(response) {
                $log.info("The item '" + item.name + "' updated successfully");
                deferred.resolve(response.data);
            }, function error(response) {
                $log.error("The item '" + item.name + "' couldn't be updated because of service issue")
                deferred.reject(response.status);
            })
            return deferred.promise;
        },
        removeItem: function (item) {
            var deferred = $q.defer();
            $http.delete(GET_ITEMS_FULL_URL + "/" + item.id)
                .then(function success(response) {
                    $log.info("The item '" + item.name + "' removed successfully");
                    deferred.resolve(response.data);
                }, function (response) {
                    $log.error("The item '" + item.name + "' couldn't be deleted because of service issue")
                    deferred.reject(response.status);
                })
            return deferred.promise;
        }
    }
})