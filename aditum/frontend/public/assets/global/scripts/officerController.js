app.controller('OfficersListController', function($scope, $state, $rootScope, $window, officersFunctions, commonMethods) {

    $rootScope.active = "officers";
    officersFunctions.getAll().success(function(officers) {
        $("#loadingIcon").fadeOut(0);
        setTimeout(function() {
            $("#tableData").fadeIn(300);
        }, 200)

        $scope.officers = officers;
    })
    $scope.deleteOfficer = function(id, name, last_name) {

        bootbox.confirm({
            message: "¿Está seguro que desea eliminar al oficial " + name + " " + last_name + "?",
            buttons: {
                confirm: {
                    label: 'Aceptar',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Cancelar',
                    className: 'btn-danger'
                }
            },
            callback: function(result) {
                if (result) {

                    commonMethods.waitingMessage();
                    officersFunctions.delete(id).success(function() {
                        officersFunctions.getAll().success(function(officers) {
                            $scope.officers = officers;
                            bootbox.hideAll();
                            toastr["success"]("Se eliminó el oficial correctamente");
                        })
                    });
                }
            }
        });


    };

});

app.controller('OfficersCreateController', function($scope, $http, $rootScope, $state, officersFunctions, commonMethods) {
    $rootScope.active = "officers";
    $scope.title = "Registrar oficial";
    $scope.button = "Registrar";
    commonMethods.validateLetters();
    commonMethods.validateNumbers();
    $("#loadingIcon").fadeOut(0);
    setTimeout(function() {
        $("#edit_officer_form").fadeIn(300);
    }, 600)


    // String.prototype.capitalize = function() {
    //     return this.replace(/(?:^|\s)\S/g, function(a) {
    //         return a.toUpperCase();
    //     });
    // };

    $scope.actionButton = function() {

        officersFunctions.getAll().success(function(officers) {
            $scope.officers = officers;
            if (commonMethods.validateRepeat($scope.officers, $scope.identification_number, 1)) {
                toastr["error"]("La cédula ingresada ya existe");
            } else {
                commonMethods.waitingMessage();
                officersFunctions.insert({
                    name: commonMethods.capitalizeFirstLetter($scope.name),
                    last_name: commonMethods.capitalizeFirstLetter($scope.last_name),
                    second_last_name: commonMethods.capitalizeFirstLetter($scope.second_last_name),
                    company_id: $rootScope.user.company_id,
                    identification_number: $scope.identification_number
                }).success(function() {
                    bootbox.hideAll();
                    $state.go('officers');
                    toastr["success"]("Se creó el vehículo correctamente");
                })
            }

        });
    }
});


app.controller('OfficersEditController', function($scope, $http, $state, $rootScope, $stateParams, $timeout, officersFunctions, commonMethods) {
    $rootScope.active = "officers";
    var officerId;
    $scope.title = "Editar oficial";
    $scope.button = "Editar";
    commonMethods.validateLetters();
    commonMethods.validateNumbers();
    officersFunctions.get($stateParams.id).success(function(data) {
        $scope.name = data.name;
        officerId = data.identification_number;
        $scope.officerId = data.id;
        $scope.last_name = data.last_name;
        $scope.second_last_name = data.second_last_name;
        $scope.identification_number = data.identification_number;
        $("#loadingIcon").fadeOut(0);
        setTimeout(function() {
            $("#edit_officer_form").fadeIn(300);
        }, 200)
    });

    $scope.actionButton = function() {
        officersFunctions.getAll().success(function(officers) {
            $scope.officers = officers;
            if (commonMethods.validateRepeat($scope.officers, $scope.identification_number, 1) && $scope.identification_number != officerId) {
                toastr["error"]("La cédula ingresada ya existe");
            } else {
                commonMethods.waitingMessage();
                officersFunctions.update($scope.officerId, {
                    name: commonMethods.capitalizeFirstLetter($scope.name),
                    last_name: commonMethods.capitalizeFirstLetter($scope.last_name),
                    second_last_name: commonMethods.capitalizeFirstLetter($scope.second_last_name),
                    company_id: $rootScope.user.company_id,
                    identification_number: $scope.identification_number
                }).success(function() {
                    bootbox.hideAll();
                    $state.go('officers');
                })
            }

        });
    }


});

app.factory('officersFunctions', function($http, $rootScope) {
    var server = "https://afternoon-woodland-36877.herokuapp.com/api/companies/" + $rootScope.user.company_id;
    return {
        insert: function(data) {
            return $http({
                url: server + "/officers",
                method: 'POST',
                data: data
            });
        },
        update: function(id, data) {
            return $http({
                url: server + "/officers/" + id,
                method: 'PUT',
                data: data
            })
        },
        delete: function(id) {
            return $http({
                url: server + "/officers/" + id,
                method: 'DELETE'
            });
        },
        getAll: function() {
            return $http.get(server + '/officers');
        },
        get: function(id) {
            return $http.get(server + '/officers/' + id)
        }
    };
});
