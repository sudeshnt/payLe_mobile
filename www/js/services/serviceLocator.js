(function(){

  angular.module('starter')
    .service('serviceLocator', [serviceLocator]);

  function serviceLocator(){

    var serviceList = {
          PayLeService : {
            serviceId:1,
            serviceName:'PayLe Rest',
            serviceUrl:'http://payleq8.com',
            // serviceUrl:'http://52.77.133.12',
            port:'8080',
            base_url:'/Paylegateway/rest'
          },
          IDImage: {
            serviceId:2,
            serviceName:'Id Image Upload View',
            serviceUrl:'http://payleq8.com',
            // serviceUrl:'http://52.77.133.12',
            port:'8080',
            base_url:'/Paylegateway'
          }
    };

    var statusList = {
        CREATED : 0,
        PENDING : 1,
        APPROVED : 2,
        CANCELED : 3,
        REVERTED : 4,
        REJECTED : 5,
        SUSPENDED : 6,
        BLACKLISTED : 7
    };

    return {
      serviceList: serviceList, // revealing module pattern to expose the register method as a public method of RequestsService.
      statusList: statusList // revealing module pattern to expose the register method as a public method of RequestsService.
    };
  }
})();
