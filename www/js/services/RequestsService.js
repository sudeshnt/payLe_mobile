(function(){

  angular.module('starter')
    .service('RequestsService', ['$http', '$q', '$ionicLoading',  RequestsService]);

  function RequestsService($http, $q, $ionicLoading){

    var base_url = 'http://54.254.133.200:3000';

    function register(device_token){
      var deferred = $q.defer(); //run the function asynchronously
      //$ionicLoading.show(); //show the ionic loader animation
      //make a POST request to the /register path and submit the device_token as data.
      $http.post(base_url + '/register', {'device_token': device_token})
        .success(function(response){
          //$ionicLoading.hide();  //hide the ionic loader when registration is successful
          deferred.resolve(response);

        })
        .error(function(data){
          deferred.reject();
        });
      return deferred.promise;
      //return the result once the POST request returns a response
    };


    return {
      register: register // revealing module pattern to expose the register method as a public method of RequestsService.
    };
  }
})();
