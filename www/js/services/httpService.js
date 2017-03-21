(function(){

angular.module('starter')

.service('httpService', ['$http', '$q', '$ionicLoading','pendingRequests','$cordovaToast','$filter',  httpService]);
  function httpService($http, $q, $ionicLoading,pendingRequests,$cordovaToast,$filter){

    function getRequest(service,extended_url,config){
      var deferred = $q.defer();
      var url = service.serviceUrl+':'+service.port+service.base_url+extended_url;
      addToPendingRequests(url,deferred);
      showLoading();
      $http.get(url,config)
        .success(function(response){
          // console.log(response);
          hideLoading();
          removeFromPendingRequests(url);
          deferred.resolve(response);
        })
        .error(function(data){
          hideLoading();
          $cordovaToast.showLongBottom($filter('translate')('CONNECTION_ERROR')).then();
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function postRequest(service,extended_url,data,config){
      if(localStorage.getItem('loginResponse')!=null && localStorage.getItem('loginResponse')!='null' && localStorage.getItem('loginResponse')!='' && localStorage.getItem('loginResponse')!=undefined && localStorage.getItem('loginResponse')!='undefined'){
        if(data.merchantCode==null || data.merchantCode=='null' || data.merchantCode=='' || data.merchantCode==undefined){
          data.merchantCode = JSON.parse(localStorage.getItem('loginResponse')).merchantCode;
        }
        data.sessionId = JSON.parse(localStorage.getItem('loginResponse')).sessionId;
      }else{
        console.log('afasfasdad');
        console.log(data.merchantCode);
        if(data.merchantCode==null || data.merchantCode=='null' || data.merchantCode=='' || data.merchantCode==undefined) {
          data.merchantCode = null;
        }
        data.sessionId = null;
      }
      var deferred = $q.defer();
      var url = service.serviceUrl+':'+service.port+service.base_url+extended_url;
      console.log(JSON.stringify(url));
      console.log(JSON.stringify(data));
      addToPendingRequests(url,deferred);
      showLoading();
      $http.post(url,data,config)
        .success(function(response){
          hideLoading();
          removeFromPendingRequests(url);
          deferred.resolve(response);
        })
        .error(function(data){
          hideLoading();
          $cordovaToast.showLongBottom($filter('translate')('CONNECTION_ERROR')).then();
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function putRequest(service,extended_url,data,config){
      if(localStorage.getItem('loginResponse')!=null && localStorage.getItem('loginResponse')!='null' && localStorage.getItem('loginResponse')!='' && localStorage.getItem('loginResponse')!=undefined && localStorage.getItem('loginResponse')!='undefined'){
        if(data.merchantCode==null || data.merchantCode=='null' || data.merchantCode=='' || data.merchantCode==undefined) {
          data.merchantCode = JSON.parse(localStorage.getItem('loginResponse')).merchantCode;
        }
        data.sessionId = JSON.parse(localStorage.getItem('loginResponse')).sessionId;
      }else{
        if(data.merchantCode==null || data.merchantCode=='null' || data.merchantCode=='' || data.merchantCode==undefined) {
          data.merchantCode = null;
        }
        data.sessionId = null;
      }
      var deferred = $q.defer();
      var url = service.serviceUrl+':'+service.port+service.base_url+extended_url;
      addToPendingRequests(url,deferred);
      showLoading();
      $http.put(url,data,config)
        .success(function(response){
          hideLoading();
          removeFromPendingRequests(url);
          deferred.resolve(response);
        })
        .error(function(data){
          hideLoading();
          $cordovaToast.showLongBottom($filter('translate')('CONNECTION_ERROR')).then();
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function deleteRequest(url,config){
      var deferred = $q.defer();
      addToPendingRequests(url,deferred);
      showLoading();
      $http.delete(url,config)
        .success(function(response){
          hideLoading();
          removeFromPendingRequests(url);
          deferred.resolve(response);
        })
        .error(function(data){
          hideLoading();
          $cordovaToast.showLongBottom($filter('translate')('CONNECTION_ERROR')).then();
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function showLoading(){
      $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner>',
        hideOnStateChange: true
      });
    }

    function hideLoading(){
      $ionicLoading.hide();
    }

    function addToPendingRequests(url,deferred){
      pendingRequests.add({
        url: url,
        canceller: deferred
      });
    }

    function removeFromPendingRequests(url){
      pendingRequests.remove(url);
    }

    return {
      getRequest: getRequest,
      postRequest: postRequest,
      putRequest: putRequest,
      deleteRequest: deleteRequest
    };
  }
})();
