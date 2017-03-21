/**
 * Created by SudeshNT on 11/4/2016.
 */
angular.module('lang_ar',['pascalprecht.translate','ngSanitize'])
  .config(['$translateProvider',function($translateProvider){
    $translateProvider.translations('ar', {
      LANGUAGE:'English',
      BACK:'للخلف',
      // main menu
      CUSTOMERS:'عملاء',
      MERCHANTS:'عملاء ادفعلي',
      CUSTOMER:'عميل',
      MERCHANT:'عميل ادفعلي',
      TRANSACTIONS:'عمليات',
      PROFILE:'ملف شخصي',
      MESSAGES:'رسائل',
      MEDIA:'فيديو',
      FEES:'الرسوم',
      CIVIL_ID:'البطاقة المدنية',
      PAYMENT_URL:'رابط الدفع',
      ABOUT_US:'عن ادفعلي',
      LOGOUT:'تسجيل خروج',
      LOGIN:'تسجيل دخول',
      REGISTER:'تسجيل جديد',
      FORGOT_PASSWORD:'نسيت الرقم السري',
      GALLERY:'صور',

      //sub menus
      ALL:'كل',
      WITHDRAWALS:'سحوبات',
      REQUEST_WITHDRAWALS:'طلب سحب',
      EDIT_PROFILE:'تعديل الملف الشخصي',
      CHANGE_PASSWORD:'تغيير الرقم السري',
      //balance bar
      ACTUAL:'فعلي',
      ON_HOLD:'بانتظار التدقيق للتحويل',
      CURRENT:'حالي',

      CONFIRM_PASSWORD:'تأكيد الرقم السري',
      PASSWORD:'الرقم السري',
      SHOW_PASSWORD:'اظهر الرقم السري',
      ENTER_PASSWORD:'ادخل الرقم السري',
      USERNAME:'اسم المستخدم',

      //REGISTRATION
      NAME:'الاسم',
      BUSINESS_NAME:'الاسم التجاري المستعار',
      BANK:'البنك',
      REGION:'منطقة',
      ACCOUNT_NUMBER:'رقم الحساب',
      IBAN:'IBAN',
      MOBILE:'رقم الموبايل',
      EMAIL:'البريد الالكتروني',
      DATE_OF_BIRTH:'تاريخ الميلاد',
      OPTIONAL:'اختياري',
      SHARE_SOCIAL:'انشر في مواقع التواصل الاجتماعي',
      ACCOUNT_NAME:'اسم الحساب',
      SOCIAL_ACCOUNTS:'حسابات التواصل الاجتماعي',
      CURRENCY:'العملة',

      //customer payment
      MERCHANT_CODE:'كود التاجر',
      AMOUNT:'المبلغ',
      FULL_AMOUNT:'كامل المبلغ',
      CUSTOMER_MOBILE:'موبايل العميل',
      CUSTOMER_EMAIL:'البريد الالكتروني للعميل',
      CARD_TYPE:'نوع البطاقة',
      COMMENTS:'ملاحظات',
      NEXT:'التالي',
      START_CHAT_WITH_MERCHANT:'التحدث للتاجر',

      //change password
      CURRENT_PASSWORD:'الرقم السري الحالي',
      NEW_PASSWORD:'رقم سري جديد',
      CONFIRM_NEW_PASSWORD:'تأكيد الرقم السري',
      CONFIRM_MUST_MATCH:'يجب ان يطابق الرقم السري',

      //transactions
      SUCCESSFUL:'نجاح',
      PENDING:'معلق',
      REJECTED:'مرفوضة',
      DATE:'التاريخ',
      STATUS:'الوضع',
      APPROVED_DATE:'تمت الموافقة على البيانات',
      EXTERNAL_REF:'مرجع خارجي',

      //civil ID page
      FRONT_SIDE:'من الامام',
      BACK_SIDE:'من الخلف',
      EXPIRY_DATE:'تاريخ الانتهاء',
      SELECT_EXPIRY_DATE:'اختار تاريخ الانتهاء',
      VALIDATE_ID:'التحقق من صحة البطاقة المدنية',
      INSERT_BOTH_SIDES_OF_ID:'ارجوا تصوير او تحميل الجهتين للبطاقة المدنية',
      ID_VALIDATION_SUCCESSFUL:'تم التحقق من البطاقة المدنية بنجاح!',

      //withdraw request
      REQUEST_WITHDRAW : 'طلب سحب المبالغ من التطبيق للبنك',
      ACTUAL_BALANCE : 'المبلغ الحالي',
      BANK_ACCOUNT:'الحساب البنكي',

      //payment url
      SHARE_WITH:'المشاركة مع',
      CREATE_BILL:'انشاء فاتورة',
      PAYMENT_METHOD:'طريقة الدفع',
      COPY_TO_CLIPBOARD:'نسخ',

      //forgot password
      REQUEST_FORGOT_INFO : 'اكتب بريدك الالكتروني  لطلب معلوماتك',
      SUBMIT : 'نفذ',

      //transaction details popup
      BUYER_MOBILE:'موبايل العميل',
      TRANSACTION_DATE:'تاريخ العملية',
      FEE:'الرسوم',

      //commissions
      FLAT:'ثابتة',
      PERCENTAGE:'نسبة %',

      //toasts
      THATS_ALL_SUCCESSFUL_TRANSACTIONS : "العمليات الناجحة",
      THATS_ALL_REJECTED_TRANSACTIONS : "العمليات الفاشلة",
      THATS_ALL_SUCCESSFUL_WITHDRAWALS : "السحوبات الناجحة",
      THATS_ALL_REJECTED_WITHDRAWALS : "السحوبات الفاشلة",
      THATS_ALL_PENDING_WITHDRAWALS : "سحوبات تحت التدقيق",
      IMAGE_UPLOAD_SUCCESSFUL:'تم التحميل بنجاح!',
      IMAGE_UPLOAD_UNSUCCESSFUL:'عملية تحميل فاشلة!',
      ERROR:'خطأ',
      CONNECTION_ERROR:'خطأ بالانترنت!',
      SERVER_ERROR:'خطأ بالنظام',
      // gallery image upload
      UPLOAD_NEW_IMAGE : 'تحميل صورة جديدة',

      //new
      CHAT_WITH_MERCHANT : 'الدردشة مع تاجر',
      ID_APPROVAL_NOT_SUBMITTED : 'معرف لم تقدم للموافقة عليها',
      ID_APPROVAL_PENDING : 'موافقة الهوية هي معلقة',
      ID_APPROVAL_SUCCESSFUL : 'موافقة معرف ناجحة',
      ID_APPROVAL_REJECTED : 'ورفض الموافقة معرف',
      DEFAULT_URL : 'الارتباط الافتراضي',
      DEFAULT_PAYMENT_URL : 'افتراضي رابط الدفع',
      MERCHANT_DOES_NOT_EXIST:"غير موجود التاجر",
      CHECKING:"تدقيق",

      AVAILABLE:'متاح',
      START_CHAT:'start chat',

      YOUR_NAME:'your name',
      FIRST_NAME:'first name',
      MERCHANT_EMAIL:"merchant's email",
      ENTER_VALID_EMAIL:'enter valid email',
      DOES_NOT_MATCH_WITH_MERCHANT_EMAIL:"doesn't match with merchant email",

      COPIED_TO_CLIPBOARD:'copied to clipboard',
      ERROR_WHILE_COPYING:'There was an error copying',
      NEW_MESSAGE_FROM : 'New Message From ',
      WANT_TO_OPEN_CHAT_WINDOW:'want to open chat window ?',
      TRANSACTION :'Transaction',
      CANCEL : 'Cancel',
      WITHDRAW_REQUEST_SENT : 'withdraw request Sent',

      PAYMENT_SUCCESSFUL:'Payment Successful',
      REGISTRATION_SUCCESSFUL : 'Registration Successful',
      LOGIN_WITH_MERCHANT_CODE:'Login with merchant code',
      PROFILE_SUCCESSFULLY_EDITED:'Profile Successfully Edited',
      GO_BACK_TO_MAIN_MENU:'go back to main menu',
      PASSWORD_SUCCESSFULLY_CHANGED:'Password Successfully Changed',
      PASSWORD_RESET_SUCCESSFUL:'Password Reset Successful',
      LOGIN_EMAIL_SENT:'Email sent with new login details.',

      FIRST_SECOND_AND_LAST:'First Second & Last Name',
      SELECT_REGION:'Select Your Region',
      MIDDLE_NAME:'middle name',
      LAST_NAME:'last name',
      ID_SUBMIT_SUCCESSFUL:'ID Successfully Submitted!',

      INVALID_EMAIL : 'invalid email address',
    });
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
    //$translateProvider.forceAsyncReload(true);

  }]);
