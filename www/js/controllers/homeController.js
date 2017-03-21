/**
 * Created by SudeshNT on 11/1/2016.
 */
angular.module('starter').controller('homeController', function ($scope,$state,$translate,$rootScope,serviceLocator,httpService,$ionicLoading) {
  $ionicLoading.hide();
    //sample rest call
    /*var orgService = serviceLocator.serviceList.OrganizationService;
    var url = orgService.serviceUrl+':'+orgService.port+orgService.base_url+'/organization/getAll';
    httpService.postRequest(url,{},{}).then(function(response){
      alert(response);
    });*/

    $scope.home = true;
    //$translate.use('en');
    $scope.openCustomerHomePage = function () {
        $state.go('customerHome');
    };
    $scope.openMerchantHomePage = function () {
        if(localStorage.getItem('loginStatus')!=null && localStorage.getItem('loginResponse')!=null){
          $state.go('merchantHome');
        }else{
          $state.go('merchantLogin');
        }
    };

    $scope.toggleLang = function (languageCode) {
        $rootScope.language = languageCode;
    };
    /*function findDeviceIP () {
      window.networkinterface.getIPAddress(function (ip) {
        alert(ip);
        console.log("ip address");
        console.log(ip);
      });
    }*/
});
