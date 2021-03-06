app.factory('watchesApi', function($http, $rootScope) {
    var server = "https://afternoon-woodland-36877.herokuapp.com/api/companies/" + $rootScope.user.company_id;
    return {
        getAll: function() {
            return $http.get(server + '/watches.json');
        },
        filterWatches: function(data) {
            return $http({
                url: server + "/watch/filter/?consulting_initial_time=" + data.consulting_initial_time + "&consulting_final_time=" + data.consulting_final_time,
                method: 'GET',
            });
        },
        getCurrentWatch: function() {
            return $http.get(server + '/current/watch.json');
        },
        find: function(id) {
            return $http.get(server + '/watches/' + id);
        }
    };
});
