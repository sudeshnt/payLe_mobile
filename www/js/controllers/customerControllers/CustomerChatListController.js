angular.module('starter').controller('CustomerChatListController', function ($scope,$state,$filter,$stateParams,serviceLocator,httpService) {
  $scope.title = $filter('translate')('CHAT_WITH_MERCHANT');
  init();

  function init() {
    initMerchants();
  }
  $scope.backNavigation = 'customerHome';
  $scope.senders = [];

  function initMerchants(){
    var payLeService = serviceLocator.serviceList.PayLeService;
    var extended_url = '/merchant/getAllMerchants';
    httpService.getRequest(payLeService,extended_url,{}).then(function(response){
      $scope.senders = response;
      // console.log(response);
      for(var i=0;i<$scope.senders.length;i++){
        // angular.copy($scope.senders[i].merchantCode, $scope.senders[i].senderCode )
        // angular.copy($scope.senders[i].merchantName, $scope.senders[i].senderName )
        $scope.senders[i]['senderCode'] = $scope.senders[i]['merchantCode'];
        $scope.senders[i]['senderName'] = $scope.senders[i]['merchantName'];
        
         if($scope.authenticatedUser!=undefined){
           // console.log($scope.authenticatedUser.merchantCode);
           // console.log($scope.senders[i].senderCode);
           // console.log($scope.senders[i].deviceKey);
           // console.log(localStorage.getItem('deviceToken'));
           // console.log(($scope.authenticatedUser.merchantCode!=undefined && $scope.authenticatedUser.merchantCode==$scope.senders[i].senderCode));
           // console.log($scope.senders[i].deviceKey==localStorage.getItem('deviceToken'));
           // console.log(($scope.authenticatedUser.merchantCode!=undefined && $scope.authenticatedUser.merchantCode==$scope.senders[i].senderCode) || $scope.senders[i].deviceKey==localStorage.getItem('deviceToken'));
           if(($scope.authenticatedUser.merchantCode!=undefined && $scope.authenticatedUser.merchantCode==$scope.senders[i].senderCode) || $scope.senders[i].deviceKey==localStorage.getItem('deviceToken')){
            $scope.senders.splice(i, 1);
          }
        }
        // console.log(JSON.stringify($scope.senders[i]));
      }
      // console.log(JSON.stringify($scope.senders));
      initMessages();
    });
  }

  function initMessages(){
    if(localStorage.getItem('merchantMessages')!=null){
      $scope.messages = JSON.parse(localStorage.getItem('merchantMessages'));
      var sender = {};
      for (var senderCode in $scope.messages) {
        if ($scope.messages.hasOwnProperty(senderCode)) {
          sender = {
            senderCode: senderCode,
            lastMessage: $scope.messages[senderCode].messages[$scope.messages[senderCode].messages.length-1],
          };
          sender.unreadMessageCount = 0;
          for(var i=0;i<$scope.messages[senderCode].messages.length;i++){
            if(!$scope.messages[senderCode].messages[i].read){
              sender.unreadMessageCount++;
            }
          }
          for(var i =0;i<$scope.senders.length;i++){
            if($scope.senders[i].senderCode == sender.senderCode){
              $scope.senders[i].lastMessage = sender.lastMessage;
              $scope.senders[i].unreadMessageCount = sender.unreadMessageCount;
            }
          }
        }
      }
    }
  }

  $scope.viewMessage = function (merchant) {
     // console.log(merchant);
    merchant.name = merchant.merchantName;
    $state.go('chat',{senderType:'merchant',sender:merchant});
  }
});
