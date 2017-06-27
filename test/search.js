/*°º¤ø,¸I¸,ø¤º°`°º¤ø,B¸,ø¤°º¤ø,¸M¸,ø¤º°`°º¤ø,¸


  Licensed Materials - Property of IBM5725-N92© Copyright IBM Corp.
  2014, 2017.US Government Users Restricted Rights- Use,
  duplication or disclosure restricted by GSA ADP Schedule Contract  with IBM Corp.
  

°º¤ø,¸I¸,ø¤º°`°º¤ø,B¸,ø¤°º¤ø,¸M¸,ø¤º°`°º¤ø,¸*/

//<<<<<<<<<<<<<<<<<<<<<<<<<<< ANGULAR APP >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var searchApp = angular.module('searchApp', ['tgCommon', 'ngDialog', 'ngIdle']);



//<<<<<<<<<<<<<<<<<<<<<<<<<<< ANGULAR DIRECTIVES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<<<< ANGULAR CONTROLLER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


searchApp.controller('searchResults', function ($scope, $http, $timeout, $location, $log, $window, $sce, ngDialog, $compile, $interpolate, Idle) {

    resizeIframe = function () {
        $("#profileBuilder").height($("#profileBuilder").contents().find("body").height() + 20 + "px");
    };
    reducesizeIframe = function () {
        $("#profileBuilder").height($("#profileBuilder").contents().find("body").height() - 20 + "px");
    };

    $.dynamicStrings = $scope.dynamicStrings;

    $scope.enumForDashBoardActiveSection = {
        UnfinishedApplications: 1,
        FinishedApplications: 2
    };

    $scope.enumForSavedSearchActions = {
        Configure: 1,
        Renew: 2,
        Delete: 3
    };


    $scope.prevalidate = function (scope, fn, formID) {
        $('#' + formID).find('input').each(function () {
            if ($(this).id == 'loginField' || $(this).id == 'password')
                $(this).$setValidity("required", true);
        });
        $('#' + formID).find('select').each(function () {
            if ($(this).name == 'selectSecurityQuestion1' || $(this).name == 'selectSecurityQuestion2' || $(this).name == 'selectSecurityQuestion3')
                $(this).$setValidity("required", true);
        });
        fn(scope);

    };


    $scope.setTitle = function (newValue, oldValue) {
        var title;

        switch (newValue) {
            case "welcome":
                title = $scope.dynamicStrings.Title_SearchWelcome;
                break;
            case "searchResults":
                title = [$scope.keyWordSearch.text, $scope.locationSearch.text].join(" ");
                if (title.trim())
                    title += " - ";
                title += $scope.dynamicStrings.Title_SearchResults;
                break;
            case "jobDetails":
                title = $("h1.jobtitleInJobDetails:visible").text() + " - " + $scope.dynamicStrings.AriaLabel_JobDetails;
                break;
            case "powerSearch":
                title = $scope.dynamicStrings.Title_PowerSearch;
                break;
            case "logIn":
                title = $scope.dynamicStrings.Button_LogIn;
                break;
            case "apply":
                if (oldValue == "jobDetails")
                    title = document.title.replace((" - " + $scope.dynamicStrings.AriaLabel_JobDetails), "") + " - " + $scope.dynamicStrings.AriaLabel_Apply;
                else
                    title = $scope.dynamicStrings.AriaLabel_Apply;
                break;
            case "JobCart":
                title = $scope.dynamicStrings.SavedJobs;
                break;
            case "Profile":
                title = $scope.dynamicStrings.Profile;
                break;
            case "MyFile":
                title = $scope.dynamicStrings.My_Files;
                break;
            case "AccountSettings":
                title = $scope.dynamicStrings.Lbl_AccountSettings;
                break;
            case "Applications":
                title = $scope.dynamicStrings.MyApplications;
                break;
            case "SavedSearches":
                title = $scope.dynamicStrings.Lbl_SavedSearches;
                break;
            case "ApplicationDetail":
                title = $("h1.Applicationjobtitle:visible").text() + "-" + $scope.dynamicStrings.Label_Application.charAt(0).toUpperCase() + $scope.dynamicStrings.Label_Application.substr(1).toLowerCase();
                break;
            case "Assessments":
                title = $scope.dynamicStrings.Link_Assessments;
                break;
            case "createNewAccount":
                title = $scope.dynamicStrings.Lbl_createNewAccount;
                break;
            case "forgotPassword":
                title = $scope.dynamicStrings.Lbl_forgotPassword;
                break;
            case "SelectedGroup":
                title = $scope.dynamicStrings.Lbl_SelectedGroup;
                break;
            case "Communication":
                title = $scope.dynamicStrings.Heading_Message_Archives;
                break;
            case "Referrals":
                title = $scope.dynamicStrings.Link_ResponsiveReferrals;
                break;
        }

        if ($scope.bLoggedIn) {
            $scope.getNotificationMsgCount();
        }

        if (title) {
            document.title = title;
        }
        if ($scope.updateAccount && ((newValue != 'welcome' && $scope.updateAccount.updated == 'delete') || (newValue != 'AccountSettings' && $scope.updateAccount.updated != 'delete')))
            $scope.updateAccount.updated = '';
        if ($scope.profileImportStatus == 1 && newValue != 'Profile')
            $scope.profileImportStatus = 0;
        if ($scope.sendToFriendInfo && $scope.sendToFriendInfo.emailSent)
            $scope.sendToFriendInfo.emailSent = false;
        if ($scope.communicationDeleted && newValue != 'Communication')
            $scohttps://sjobs.brassring.com/TGnewUI/Search/home/HomeWithPreLoad?PageType=JobDetails&noback=0&partnerid=25779&siteid=5151&jobid=451088pe.communicationDeleted = false;
    }

    $scope.$watch("workFlow", $scope.setTitle);



    /////Reset UserName Password Starts here
    $scope.focusAt = function (ID, Submit) {
        setTimeout(function () { $scope.$apply(); }, 0);
        $("#" + ID).focus();
        if (["loginfield", "password"].indexOf(ID.toLowerCase()) !== -1) {
            $("#" + ID + "Mobile").focus();
        }
    };
    $scope.LoginChangePassword = false;
    $scope.LoginChangeSecQuestion = false;
    $scope.ResetNamePass = function ($scope) {
        $scope.timer = null;
        $scope.LoginChangePassword = false;
        $scope.login = {
            NameOrPass: 'password',
            UserEmail: '',
            FirstName: '',
            LastName: '',
            HomePhone: '',
            Username: '',
            SecurityQuestion1: '',
            SecurityAnswer1: '',
            SecurityQuestion2: '',
            SecurityAnswer2: '',
            SecurityQuestion3: '',
            SecurityAnswer3: '',
            pwd: '',
            pwdConfirm: '',
            ResetUser: false,
            SecQuestions: true,

            ValidEmailPhone: false,
            submit11: false,
            submit12: false,
            submit13: false,
            submit14: false,
            submit15: false,
            submit16: false,

            submit21: false,
            blurred21: false,
            submit22: false,
            blurred22: false,
            submit23: false,
            blurred23: false,
            ResetUser: false,
            submit3: false,

            blurred3: false,
            blurred4: false,
            ForgotPass: false,
            EmailPageError: '',
            EmailErrorID: '',
            EmailPageSuccess1: '',
            EmailPageSuccess2: '',
            SecurityQuestionsPageError: '',
            SecurityQuestionsErrorID: '',
            SecurityQuestionsPageSuccess: '',
            ResetPasswordPageError: '',
            ResetPasswordErrorID: '',
            ResetPasswordID: '',
            ResetPasswordPageSuccess: ''
        };
        $("#ForgotUsrPassContainer").setFocus();

    }
    $scope.ResetNamePass($scope);
    $scope.focusEmailpage = function (str) {
        $scope.login.focusThis = "true";
    }
    $scope.rbtNameorPass = function () {
        $scope.login.submit11 = false;
        $scope.login.submit12 = false;
        $scope.login.submit13 = false;
        $scope.login.submit14 = false;
        $scope.login.submit15 = false;
        $scope.login.submit16 = false;
        $scope.login.UserEmail = '';
        $scope.login.FirstName = '';
        $scope.login.LastName = '';
        $scope.login.HomePhone = '';
        $scope.login.Username = '';
        $scope.login.EmailPageSuccess1 = '';
        $scope.login.EmailPageSuccess2 = '';
        $scope.login.EmailPageError = '';
        return $scope.login;
    };
    $scope.ForgotPassword = function () {
        ngDialog.closeAll();
        $scope.ResetNamePass($scope);
        $scope.bSignInView = false;
        $scope.showInFullView = false;
        $scope.login.ForgotPass = true;
        $scope.bCreateAccount = false;
        $scope.bPrivacyPages = false;
        $scope.bPrivacyOptOut = false;
        $scope.bPrivacyPolicyStatement = false;
        $scope.bPrivacyPolicyQuestion = false;
        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "forgotPassword";
        $scope.setTitle("forgotPassword");
        $scope.setHash();
        $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/ResetUsernamePassword");
        //        $("#homeContainer ul:empty").each(
        //        function () {
        //            var LItems = $(this);
        //            if (LItems.children().length == 0) {
        //                $(this).append($("<li>"));
        //            }
        //        });
    };
    $scope.ResetSecurityQuestionsPageFunc = function () {
        $scope.login.OldEmail = $scope.login.UserEmail;
        $scope.login.submit21 = false;
        $scope.login.blurred21 = false;
        $scope.login.submit22 = false;
        $scope.login.blurred22 = false;
        $scope.login.submit23 = false;
        $scope.login.blurred23 = false;
        return $scope.login;
    };

    $scope.loadwebtrackerscript = function (partnerid, siteid, pageid) {
        var datascript = "";
        var cmvalue = 0

        $.ajax({
            type: "GET",
            url: "../../../tgwebhost/webtracker.aspx?partnerid=" + partnerid + "&siteid=" + siteid + "&pageid=" + pageid + "&fromresp=1&getbodytag=1",
            success: function (data1) {
                datascript = data1;
                eval(datascript);
            }
        });
    };

    if ($("#pageType").val() == "") {
        $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/Home");
    }
    $scope.focusFirstJob = function () {
        $("#mainJobListContainer").setFocus();
        $.pinToFold();
    };
    $scope.EmailPageAjax = function ($scope) {
        $scope.oActiveLaddaButton.start();
        var ForgotPasswordRequest = {
            partnerId: $("#partnerId").val(),
            siteId: $("#siteId").val(),
            username: $scope.tgSettings.LoginType == 1 ? $scope.login.Username : $scope.login.UserEmail,
            cookievalue: $("#CookieValue").val(),
            subjectName: $scope.dynamicStrings.PasswordRecoverySubject
        };
        // Ladda.create("EmailSubmit").start();
        $.ajax({
            type: "POST",
            url: "/TgNewUI/Search/Ajax/ForgotPassword",
            data: ForgotPasswordRequest,
            success: function (data) {
                $scope.oActiveLaddaButton.stop();
                if (data.ForgotPasswordResult == 0) {
                    $scope.login.EmailPageSuccess1 = $scope.dynamicStrings.ErrorMessage_ForgotPassEmailSent1;
                    $scope.login.EmailPageSuccess2 = $scope.dynamicStrings.ErrorMessage_ForgotPassEmailSent2;
                }
                else if (data.ForgotPasswordResult == 1 || data.ForgotPasswordResult == 2) {

                    if ($scope.tgSettings.LoginType == 1) {
                        $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_UserDoesntExist;
                        $scope.login.InvalidFields.push({
                            "ErrorField": $scope.dynamicStrings.Label_Username,
                            "ErrorID": $scope.dynamicStrings.Label_Username,
                            "ErrorType": $scope.dynamicStrings.ErrorMessage_UserDoesntExist
                        });
                    } else if ($scope.tgSettings.LoginType == 0) {
                        $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_UserDoesntExist;
                        $scope.login.InvalidFields.push({
                            "ErrorField": "E-mail",
                            "ErrorID": 'Email',
                            "ErrorType": $scope.dynamicStrings.ErrorMessage_UserDoesntExist
                        });
                    }
                }
                else if (data.ForgotPasswordResult == 3) {

                    $scope.login.EmailPageSuccess1 = $scope.dynamicStrings.ErrorMessage_ForgotPassEmailAlreadySent1;
                    $scope.login.EmailPageSuccess2 = $scope.dynamicStrings.ErrorMessage_ForgotPassEmailAlreadySent2;
                }
                else if (data.ForgotPasswordResult == 4) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_EmailDoesntExist;
                    if ($scope.tgSettings.LoginType == 1) {
                        $scope.login.InvalidFields.push({
                            "ErrorField": $scope.dynamicStrings.Label_Username,
                            "ErrorID": $scope.dynamicStrings.Label_Username,
                            "ErrorType": $scope.dynamicStrings.ErrorMessage_EmailDoesntExist
                        });
                    } else if ($scope.tgSettings.LoginType == 0) {
                        $scope.login.InvalidFields.push({
                            "ErrorField": "E-mail",
                            "ErrorID": 'Email',
                            "ErrorType": $scope.dynamicStrings.ErrorMessage_EmailDoesntExist
                        });
                    }
                }
                else if (data.ForgotPasswordResult == 6) { //account locked out while loggin
                    $scope.login.EmailPageSuccess1 = $scope.dynamicStrings.ErrorMessage_PasswordLockedOut;
                    $scope.login.EmailPageSuccess2 = $scope.dynamicStrings.ErrorMessage_TryAgainlater;
                }
                else if (data.ForgotPasswordResult == 5) {
                    if (data.SecurityQuestions != null) {
                        if (data.SecurityQuestions.SecurityQuestion1 != null && data.SecurityQuestions.SecurityQuestion1 != '') {
                            $scope.login.SecurityQuestion1 = eval("$scope.securityQuestions." + data.SecurityQuestions.SecurityQuestion1);
                        }
                        else {
                            $scope.login.SecurityQuestion1 = '';
                        }
                        if (data.SecurityQuestions.SecurityQuestion2 != null && data.SecurityQuestions.SecurityQuestion2 != '') {
                            $scope.login.SecurityQuestion2 = eval("$scope.securityQuestions." + data.SecurityQuestions.SecurityQuestion2);
                        }
                        else {
                            $scope.login.SecurityQuestion2 = '';
                        }
                        if (data.SecurityQuestions.SecurityQuestion3 != null && data.SecurityQuestions.SecurityQuestion3 != '') {
                            $scope.login.SecurityQuestion3 = eval("$scope.securityQuestions." + data.SecurityQuestions.SecurityQuestion3);
                        }
                        else {
                            $scope.login.SecurityQuestion3 = '';
                        }
                    }
                    if ($scope.login.SecurityQuestion1 == '' && $scope.login.SecurityQuestion2 == '' && $scope.login.SecurityQuestion3 == '') {
                        $scope.login.SecurityQuestionsPageSuccess = $scope.dynamicStrings.ErrorMessage_ContactHelpDesk
                    }
                    $scope.login.SecurityQuestionsPageError = '';
                    $scope.login.SecurityQuestionsPageSucces = '';
                    $scope.ActivePage('SecurityQuestions');
                }
                setTimeout(function () { $scope.$apply(); }, 0);
            }
        });
    };
    $scope.UserNamePageAjax = function ($scope) {
        $scope.oActiveLaddaButton.start();
        var ForgotUsernameRequest = {
            partnerId: $("#partnerId").val(),
            siteId: $("#siteId").val(),
            firstname: $scope.login.FirstName,
            lastname: $scope.login.LastName,
            homephone: ($scope.login.HomePhone == '') ? '' : $scope.login.HomePhone,
            username: ($scope.login.UserEmail == '') ? '' : $scope.login.UserEmail,
            cookievalue: $("#CookieValue").val(),
            deflanguageId: $scope.tgSettings.DefLanguageId
        };
        $.ajax({
            type: "POST",
            url: "/TgNewUI/Search/Ajax/ForgotUsername",
            data: ForgotUsernameRequest,
            success: function (data) {
                $scope.oActiveLaddaButton.stop();
                if (data.Result == 'ProfileFound') {
                    if (data.SecurityQuestions != null) {
                        if (data.SecurityQuestions.SecurityQuestion1 != null && data.SecurityQuestions.SecurityQuestion1 != '') {
                            $scope.login.SecurityQuestion1 = eval("$scope.securityQuestions." + data.SecurityQuestions.SecurityQuestion1);
                        }
                        else {
                            $scope.login.SecurityQuestion1 = '';
                        }
                        if (data.SecurityQuestions.SecurityQuestion2 != null && data.SecurityQuestions.SecurityQuestion2 != '') {
                            $scope.login.SecurityQuestion2 = eval("$scope.securityQuestions." + data.SecurityQuestions.SecurityQuestion2);
                        }
                        else {
                            $scope.login.SecurityQuestion2 = '';
                        }
                        if (data.SecurityQuestions.SecurityQuestion3 != null && data.SecurityQuestions.SecurityQuestion3 != '') {
                            $scope.login.SecurityQuestion3 = eval("$scope.securityQuestions." + data.SecurityQuestions.SecurityQuestion3);
                        }
                        else {
                            $scope.login.SecurityQuestion3 = '';
                        }
                    }
                    if ($scope.login.SecurityQuestion1 == '' && $scope.login.SecurityQuestion2 == '' && $scope.login.SecurityQuestion3 == '') {
                        $scope.login.SecurityQuestionsPageSuccess = $scope.dynamicStrings.ErrorMessage_ContactHelpDesk
                    }
                    $scope.login.SecurityQuestionsPageError = '';
                    $scope.login.SecurityQuestionsPageSucces = '';
                    $scope.ActivePage('SecurityQuestions');
                    //Forgot password email successfully sent
                    //You have asked to recover your password. For your protection, this operation is carried out through a secured e-mail, which has been sent to the address associated with your user profile. Please click on the link in the e-mail to reset your password. Check your e-mail for a message called 'Password recovery.'
                }
                else if (data.Result == 'UserNotFound') {
                    //User does not exist
                    //The information you entered does not match our records. Please try again.

                    //$scope.login.EmailErrorID = $scope.dynamicStrings.Label_Email;
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_InfoDoesntExist;
                }
                else if (data.Result == 'ExceededAllowedAttempts') {
                    //User does not exist

                    //$scope.login.EmailErrorID = $scope.dynamicStrings.Label_Email;
                    $scope.login.EmailPageError = data.UNameRetrievalUnsuccessfulCustomText;
                }
                else if (data.Result == 'InCorrectResponse') {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": "E-mail",
                        "ErrorID": 'Email',
                        "ErrorField2": "Home Phone",
                        "ErrorID2": 'HomePhone',
                        "ErrorEmailPhn": true,
                        "ErrorType": $scope.dynamicStrings.ErrorMessage_IsRequired
                    });
                    $scope.login.ValidEmailPhone = true;
                }

                setTimeout(function () { $scope.$apply(); }, 0);
            }

        });
    };
    $scope.SecurityAnswersAjax = function ($scope) {
        $scope.oActiveLaddaButton.start();
        $scope.login.SecurityQuestionsPageError = '';
        var ConfirmSecurityAnswersRequest = {
            partnerId: $("#partnerId").val(),
            siteId: $("#siteId").val(),
            username: $scope.login.UserEmail,
            LoginMgmtType: angular.uppercase($scope.tgSettings.LoginDetailsManagement),
            Token: $("#Token").val(),
            CalledFrom: $scope.login.CalledFrom,
            SecurityQuestions: 'YES',
            SAnswerOne: ($scope.login.SecurityAnswer1 == '') ? '' : $scope.login.SecurityAnswer1,
            SAnswerTwo: ($scope.login.SecurityAnswer2 == '') ? '' : $scope.login.SecurityAnswer2,
            SAnswerThree: ($scope.login.SecurityAnswer3 == '') ? '' : $scope.login.SecurityAnswer3,
            cookievalue: $("#CookieValue").val(),
            DefLanguageId: $scope.tgSettings.DefLanguageId
        };
        $.ajax({
            type: "POST",
            url: "/TgNewUI/Search/Ajax/SecurityAnswers",
            data: ConfirmSecurityAnswersRequest,
            success: function (data) {
                $scope.oActiveLaddaButton.stop();
                if (data.Result == 'CorrectAnswers') {
                    if ($scope.login.NameOrPass == 'username') {
                        $scope.login.Username = data.Username;
                    }
                    $scope.login.EmailPageError = '';
                    $scope.login.EmailPageError = '';
                    $scope.login.EmailPageSuccess1 = '';
                    $scope.login.EmailPageSuccess2 = '';
                    $scope.ActivePage('ResetUserNamePassword');
                }
                if (data.Result == 'LockedOut') {
                    if ($scope.login.NameOrPass == 'password') {
                        $scope.login.SecurityQuestionsPageError = $scope.dynamicStrings.ErrorMessage_PasswordLockedOut + $scope.dynamicStrings.ErrorMessage_TryAgainlater;
                    } else {
                        $scope.login.SecurityQuestionsPageError = data.UNameRetrievalUnsuccessfulCustomText;
                    }
                }
                if (data.Result == 'TryAgain') {
                    $scope.login.SecurityQuestionsPageError = $scope.dynamicStrings.ErrorMessage_TryAgain;
                    //The answer you provided does not match the answer to your security question.  Please try again.
                }
                setTimeout(function () { $scope.$apply(); }, 0);
            }

        });
    };
    $scope.ResetPasswordAjax = function (scope) {
        scope.oActiveLaddaButton.start();
        $scope.login.ResetPasswordPageSuccess = '';
        $scope.login.ResetPasswordPageError = '';
        $scope.login.ResetPasswordErrorID = '';
        $scope.login.ResetPasswordID = '';
        var ChangePasswordRequest = {};
        ChangePasswordRequest.ClientId = $("#partnerId").val();
        ChangePasswordRequest.SiteId = $("#siteId").val();
        ChangePasswordRequest.username = $scope.login.UserEmail;
        ChangePasswordRequest.EncryptedSessionId = $("#CookieValue").val();
        ChangePasswordRequest.LanguageId = $scope.tgSettings.DefLanguageId;
        ChangePasswordRequest.LocaleId = $scope.tgSettings.DefLocaleId;
        ChangePasswordRequest.NewPassword = $scope.login.pwd;
        ChangePasswordRequest.ChangePasswordEmailSubject = $scope.dynamicStrings.ChangePasswordEmailSubject;
        //searchFields: that.keywordFields
        var url = "/TgNewUI/Search/Ajax/ChangePassword"
        $http.post(url, ChangePasswordRequest).success(function (data, status, headers, config) {
            scope.oActiveLaddaButton.stop();
            // data.Result = 0;
            //2 'Old password was incorrect
            if (data.Result == 0) {
                $scope.encryptedBruid = data.EncryptedBruId;
                $scope.hashCode = data.HashCode;
                $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/Login");
                $timeout(function () { $scope.$apply(); }, 0);
                if (data.NewSessionId != null || data.NewSessionId != "") {
                    $("#CookieValue").val(data.NewSessionId);
                }

                //alert("Password Change Succesfull");
                if ($scope.LoginChangePassword == true) {
                    var rft = $("[name='__RequestVerificationToken']").val();
                    if ($scope.jobApplyUrl != "") {
                        $http.get("/gqweb/apply?bruid=" + encodeURIComponent(data.EncryptedBruId) + $scope.jobApplyUrl + "&RFT=" + rft)
                            .success(function (result) {
                                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                $scope.$root.applyResponse = result;
                                $scope.bLoggedIn = true;
                                $scope.bSignInView = false;
                                $scope.showInFullView = false;
                                $scope.login.ForgotPass = false;
                                scope.loginField = "";
                                scope.password = "";
                            });
                    } else if (appScope.bJobDetailsShown || appScope.bSearchResults) {
                        $scope.bLoggedIn = true;
                        $scope.bSignInView = false;
                        $scope.bCreateAccount = false;
                        $scope.login.ForgotPass = false;
                        if (appScope.bJobDetailsShown) {
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                            $scope.login.ForgotPass = false;
                            $scope.SingleJobApplyDupCheckAjax();
                            //if ($scope.calledFrom == "save")
                            //    $scope.postToNextPageFromDetails('', $scope, $scope.calledFrom);
                        } else if ($scope.bSearchResults && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.jobIds != undefined) {
                            ngDialog.closeAll();
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                            var SMLoginjobids = $scope.SearchResultsJobsSelectedScope.jobIds.split(",").length > 0 ? $scope.SearchResultsJobsSelectedScope.jobIds : "";
                            $scope.SelectJobs = $scope.dynamicStrings.Button_Cancel;
                            _.each(appScope.jobs, function (job) {
                                if (SMLoginjobids.split(',').indexOf(_.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString()) > -1) {
                                    job.Selected = true;
                                }
                            });

                            if ($scope.calledFrom == "save") {
                                $scope.postToNextPage("", $scope.SearchResultsJobsSelectedScope, $scope.calledFrom);
                            }
                            else {
                                $scope.postToNextPage('', appScope, 'mulapplyvald');
                            }
                            $scope.login.ForgotPass = false;
                        }

                    } else if ($scope.bresponsiveCandidateZone) {
                        $scope.login.ForgotPass = false;
                        $scope.bCandidateZone = true;
                        $scope.ViewDashBoardData("SavedJobs");
                    }
                    else {
                        var candidateZoneRequest = {};
                        candidateZoneRequest.PartnerId = $("#partnerId").val();
                        candidateZoneRequest.SiteId = $("#siteId").val();
                        candidateZoneRequest.EncryptedSessionId = $("#CookieValue").val();
                        candidateZoneRequest.SIDValue = $("#SIDValue").val();
                        url = '/TgNewUI/Search/Ajax/CandidateZone';
                        $http.post(url, candidateZoneRequest).success(function (data, status, headers, config) {
                            $scope.login.ForgotPass = false;
                            $scope.bCandidateZone = true;
                            $scope.CandidateZoneData = data;
                            $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                            $scope.bLoggedIn = true;
                            $scope.bSignInView = false;
                            $scope.showInFullView = false;
                            $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                            $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                            $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                            $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/CandidateZone");
                            if (data.LoggedInSettings.GeneralSocialReferral == "yes") {
                                $scope.SocialReferral_READY = data.LoggedInSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                                $scope.SocialReferral_FirstName = encodeURIComponent(data.CandidateFirstName);
                                $scope.SocialReferral_LastName = encodeURIComponent(data.CandidateLastName);
                                $scope.SocialReferral_ProfileId = data.LoggedInSettings.profileId;
                            }
                            setTimeout(function () {
                                tgTheme.store();
                            }, 0);
                        });
                    }
                }
                else {
                    $scope.login.ResetPasswordPageSuccess = $scope.dynamicStrings.ChangePasswordSuccess;
                    $scope.login.ResetPasswordPageError = '';
                }
                //$scope.ActivePage('Back_Home');
                //You have successfully reset your password.
                //0'Password has been changed ;
            }
            else if (data.Result == 1 || data.Result == 2) {
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.Errormessage_AnswersDidNotMatch;
                //answer you provided did not match
                //Exceptions during password change
            }
            else if (data.Result == 3) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_SameUsernamePasswrd;
                //You cannot use your username as your password.
            }
            else if (data.Result == 4) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_SameOldNewPasswrd;
                //4'New password is same as old password
                //Your new password cannot be same as old password.
            }
            else if (data.Result == 5) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_RecentlyUsedPasswrd;
                //You cannot use a password that has recently been used.

            }
            else if (data.Result == 6) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.Errormessage_Mustbe8to25characters;
                //Your password must be a minimum of 6 and a maximum of 25 characters.
            }
            else if (data.Result == 7) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_Mustbe8Char;
                //7'Pasword should have at least 8 characters
            }
            else if (data.Result == 8) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                //Your password may not contain spaces.
            }
            else if (data.Result == 9) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.Errormessage_MustContainSpecialCharacter;
                //9'Pasword should have special characters
            }
            else if (data.Result == 10) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                // $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_8PrecedingPasswrd;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_RecentlyUsedPasswrd;
                //Your password may not be the same as any of the 8 preceding passwords.
            }
            else if (data.Result == 12) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                // $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_8PrecedingPasswrd;
                $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_PasswordRecentChange;
                //Your password may not be the same as any of the 8 preceding passwords.
            }
            setTimeout(function () {
                $scope.$apply();
            }, 0);
        });
    };

    $scope.ValidateEmailPage = function ($scope) {
        $scope.login.ValidEmailPhone = false;
        $scope.login.EmailPageError = '';
        $scope.login.InvalidFields = [];
        if ($scope.login.NameOrPass == 'password') {
            if ($scope.tgSettings.LoginType == 1) {
                if ($scope.login.submit15 && (!angular.isDefined($scope.Email.Username) || (!$scope.login.Username || $scope.login.Username.length == 0))) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": $scope.dynamicStrings.Label_Username,
                        "ErrorID": $scope.dynamicStrings.Label_Username,
                        "ErrorType": $scope.dynamicStrings.ErrorMessage_RequiredField
                    });
                }
                else if ($scope.login.submit15 && angular.isDefined($scope.Email.Username) && $scope.login.Username.length > 0 && $scope.Email.Username.$invalid) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": $scope.dynamicStrings.Label_Username,
                        "ErrorID": $scope.dynamicStrings.Label_Username,
                        "ErrorType": "Invalid username"
                    });
                }
            }
            else if ($scope.tgSettings.LoginType == 0) {
                if ($scope.login.submit16 && (!angular.isDefined($scope.Email.email) || (!$scope.login.UserEmail || $scope.login.UserEmail.length == 0))) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": "E-mail",
                        "ErrorID": 'Email',
                        "ErrorType": $scope.dynamicStrings.ErrorMessage_RequiredField
                    });
                }
                else if ($scope.login.submit16 && angular.isDefined($scope.Email.email) && $scope.login.UserEmail.length > 0 && $scope.Email.email.$invalid) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": "E-mail",
                        "ErrorID": 'Email',
                        "ErrorType": "Invalid email"
                    });
                }
            }

        }
        else if ($scope.login.NameOrPass == 'username') {
            if ($scope.login.submit11 && (!angular.isDefined($scope.Email.FirstName) || (!$scope.login.FirstName || $scope.login.FirstName.length == 0))) {
                $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                $scope.login.InvalidFields.push({
                    "ErrorField": "First name",
                    "ErrorID": 'Firstname',
                    "ErrorType": $scope.dynamicStrings.ErrorMessage_RequiredField
                });
            }
            else if ($scope.login.submit11 && angular.isDefined($scope.Email.FirstName) && $scope.login.FirstName.length > 0 && $scope.Email.FirstName.$invalid) {
                $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                $scope.login.InvalidFields.push({
                    "ErrorField": "First name",
                    "ErrorID": 'Firstname',
                    "ErrorType": "Invalid first name"
                });
            }

            if ($scope.login.submit12 && (!angular.isDefined($scope.Email.LastName) || (!$scope.Email.LastName.$viewValue || $scope.Email.LastName.$viewValue.length == 0))) {
                $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                $scope.login.InvalidFields.push({
                    "ErrorField": "Last Name",
                    "ErrorID": 'LastName',
                    "ErrorType": $scope.dynamicStrings.ErrorMessage_RequiredField
                });
            }
            else if ($scope.login.submit12 && angular.isDefined($scope.Email.LastName) && $scope.Email.LastName.$viewValue.length > 0 && $scope.Email.LastName.$invalid) {
                $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                $scope.login.InvalidFields.push({
                    "ErrorField": "Last name",
                    "ErrorID": 'LastName',
                    "ErrorType": "Invalid last name"
                });
            }
            if (($scope.login.submit13 || $scope.login.submit14) && (!angular.isDefined($scope.Email.email) || (!$scope.login.UserEmail || $scope.login.UserEmail.length == 0)) && (!angular.isDefined($scope.Email.HomePhone) || (!$scope.login.HomePhone || $scope.login.HomePhone.length == 0))) {
                $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                $scope.login.InvalidFields.push({
                    "ErrorField": "E-mail",
                    "ErrorID": 'Email',
                    "ErrorField2": "Home Phone",
                    "ErrorID2": 'HomePhone',
                    "ErrorEmailPhn": true,
                    "ErrorType": $scope.dynamicStrings.ErrorMessage_IsRequired
                });
                $scope.login.ValidEmailPhone = true;
            }
            else {

                if ($scope.login.submit13 && angular.isDefined($scope.Email.HomePhone) && $scope.Email.HomePhone.length > 0 && $scope.Email.HomePhone.$invalid) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": "Home Phone",
                        "ErrorID": 'HomePhone',
                        "ErrorType": "Invalid home phone"
                    });
                }
                if ($scope.login.submit14 && angular.isDefined($scope.Email.email) && $scope.Email.email.length > 0 && $scope.Email.email.$invalid) {
                    $scope.login.EmailPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    $scope.login.InvalidFields.push({
                        "ErrorField": "E-mail",
                        "ErrorID": 'Email',
                        "ErrorType": "Invalid email"
                    });
                }
            }

        }
        return $scope;
    };
    $scope.validateAndcontinue1 = function ($scope) {
        $scope.login.EmailPageSuccess1 = '';
        $scope.login.EmailPageSuccess2 = '';
        $scope.login.EmailPageError = '';
        $scope.login.EmailErrorID = '';
        $scope.login.InvalidFields = [];
        $scope.login.submit11 = true;
        $scope.login.submit12 = true;
        $scope.login.submit13 = true;
        $scope.login.submit14 = true;
        $scope.login.submit15 = true;
        $scope.login.submit16 = true;

        $scope.login.ValidEmailPhone = false;
        $scope.ValidateEmailPage($scope);

        if ($scope.login.EmailPageError == '') {
            $scope.login.EmailErrorID = '';
            $scope.login.EmailPageError = '';
            $scope.login.InvalidFields = [];
            if ($scope.login.NameOrPass == 'password') {
                $scope.EmailToSecQuestions = false;
                $scope.ResetSecurityQuestionsPageFunc($scope);
                $scope.EmailPageAjax($scope);
            }
            else if ($scope.login.NameOrPass == 'username') {
                $scope.EmailToSecQuestions = false;
                $scope.ResetSecurityQuestionsPageFunc($scope);
                $scope.UserNamePageAjax($scope);
            }
            $("#securityQuestionContainer").setFocus();
            $scope.login.SecurityQuestionsPageError = '';
            $scope.login.InvalidSecQuestions = [];
            $scope.login.SecurityQuestionsErrorID = '';
        }
        else {
            return $scope;
        }
    };

    $scope.validateAndcontinue2 = function ($scope) {
        $scope.login.SecurityQuestionsPageError = '';
        $scope.login.InvalidSecQuestions = [];
        $scope.login.SecurityQuestionsErrorID = '';

        $.each($scope.SecurityQuestions.$error, function (errorType, allErrors) {
            if (allErrors != false) {
                if (errorType == "required") {
                    $.each(allErrors, function (index, error) {
                        $scope.login.InvalidSecQuestions.push({
                            "Question": error.$name == 'SecurityAnswer1' ? $scope.login.SecurityQuestion1 : error.$name == 'SecurityAnswer2' ? $scope.login.SecurityQuestion2 : $scope.login.SecurityQuestion3,
                            "SecurityAnsID": 'txt' + error.$name,
                            "ErrorMsg": $scope.dynamicStrings.ErrorMessage_AnswerRequired
                        });
                        if ($scope.login.SecurityQuestionsErrorID == '')
                            $scope.login.SecurityQuestionsErrorID = 'txt' + error.$name;
                    });
                }
                if (errorType == "pattern") {
                    $.each(allErrors, function (index, error) {
                        $scope.login.InvalidSecQuestions.push({
                            "Question": error.$name == 'SecurityAnswer1' ? $scope.login.SecurityQuestion1 : error.$name == 'SecurityAnswer2' ? $scope.login.SecurityQuestion2 : $scope.login.SecurityQuestion3,
                            "SecurityAnsID": 'txt' + error.$name,
                            "ErrorMsg": $scope.dynamicStrings.ErrorMessage_InvalidSecurityAnswer
                        });
                        if ($scope.login.SecurityQuestionsErrorID == '')
                            $scope.login.SecurityQuestionsErrorID = 'txt' + error.$name;
                    });
                }
            }
        });


        if (!$scope.SecurityQuestions.$valid) {
            $scope.login.SecurityQuestionsPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
            return;
        }
        else {
            $scope.login.blurred3 = false;
            $scope.login.blurred4 = false;
            $scope.login.pwd = '';
            $scope.login.pwdConfirm = '';
            $scope.pwdValidLength = false;
            $scope.pwdHasSpecial = false;
            $scope.pwdCorrect = false;
            if ($scope.login.NameOrPass == 'username') {
                $scope.login.CalledFrom = "forgotuname";
            }
            else {
                $scope.login.CalledFrom = '';
            }
            $scope.SecurityAnswersAjax($scope);
        }

    };
    $scope.validateAndcontinue3 = function ($scope) {
        $scope.login.ResetPasswordPageSuccess = '';
        $scope.login.ResetPasswordPageError = '';
        $scope.login.ResetPasswordErrorID = '';
        $scope.login.ResetPasswordID = '';
        if ($scope.login.pwd != '' && angular.isDefined($scope.login.pwd)) {
            if ($scope.login.pwdConfirm != '') {
                if (!($scope.login.pwd.indexOf(" ") > 0) && !($scope.login.pwdConfirm.indexOf(" ") > 0) && !$scope.ResetPassword.pwdConfirm.$error.mismatch) {
                    $scope.ResetPasswordAjax($scope)
                }
                else {
                    if (!angular.isDefined($scope.login.pwdConfirm) || $scope.login.pwdConfirm == '' || $scope.ResetPassword.pwdConfirm.$error.mismatch == true) {
                        $scope.login.ResetPasswordID = 'txtPwdConfirm';
                        $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_ReEnterNewPassword;
                        $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                        $("#resetPwdErrorMsg").focus();
                    }
                    else {
                        $scope.login.ResetPasswordID = 'txtPwd';
                        $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
                        $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                        $("#resetPwdErrorMsg").focus();
                    }

                }

            }
        }
        else if ($scope.login.pwd == '' || !angular.isDefined($scope.login.pwd)) {
            if (!angular.isDefined($scope.login.pwd) || $scope.login.pwd == '' || $scope.pwdCorrect != true) {
                $scope.login.ResetPasswordID = 'txtPwd'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_NewPassword;
            }
            else if (!angular.isDefined($scope.login.pwdConfirm) || $scope.login.pwdConfirm == '' || $scope.ResetPassword.pwdConfirm.$error.mismatch == true) {
                $scope.login.ResetPasswordID = 'txtPwdConfirm'
                $scope.login.ResetPasswordErrorID = $scope.dynamicStrings.Label_ReEnterNewPassword;
            }
            $scope.login.ResetPasswordPageError = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
            $("#resetPwdErrorMsg").focus();
        }
        else {
            return false;
        }

    };
    $scope.isNameOrPass = function (NameOrPass) {
        return NameOrPass === $scope.login.NameOrPass;
    };
    $scope.returnToHome = function () {
        console.log("close dialogue");
        $scope.dialog.close();
        $timeout.cancel($scope.timer);
        $("#gateway").attr("aria-hidden", "false");
        $scope.ActivePage('Back_Home');


        return;
    };
    $scope.extendTime = function () {
        $("#gateway").attr("aria-hidden", "false");
        $timeout.cancel($scope.dialogTimer);
        $scope.dialog.close();

        $scope.ActivePage('ResetUserNamePassword');

    };

    //$scope.ForgotPassworBack = function () {
    //    if()
    //};

    $scope.ForgotPasswordContinue = function () {
        var srcqs = $.queryParams().srcqs
        if (typeof srcqs == 'undefined' || srcqs == "" || srcqs == null) {
            $scope.ActivePage('Back_Home');
        }
        else {
            window.location = '../../../TGwebhost/srcentry.aspx?q=' + srcqs
        }
    };

    $scope.ActivePage = function (activeTab) {
        if (activeTab == 'Email') {
            $scope.setTitle("forgotPassword");
            $scope.login.ActiveTab = 'Email';
            $scope.login.SecQuestions = true;
            if ($scope.timer != null)
            { $scope.timer = 1; }
            return $scope;
        }
        else if (activeTab == 'SecurityQuestions') {
            $scope.setTitle("forgotPassword");
            $scope.login.submit12 = false;
            $scope.login.submit13 = false;
            $scope.login.submit14 = false;
            $scope.login.submit15 = false;
            $scope.login.submit16 = false;
            $scope.login.ActiveTab = 'SecurityQuestions';
            $scope.login.SecQuestions = false;
            $scope.login.ResetUser = false;

            setTimeout(function () {
                $scope.setHash();
            }, 0);
            if ($scope.timer != null)
            { $scope.timer = 1; }
            return $scope;
        }
        else if (activeTab == 'ResetUserNamePassword') {
            $scope.setTitle("forgotPassword");
            $scope.login.ActiveTab = 'ResetUserNamePassword';
            $scope.login.ResetUser = true;
            angular.dependencies.ngDialog = ngDialog;
            $scope.setHash();//expose ngDialog factory class for editing
            if ($scope.login.ResetUser == true && $scope.login.NameOrPass == 'username') {
                $timeout.cancel($scope.timer);
                $scope.timeOutSeconds = parseInt($scope.tgSettings.TimeOutSec * 1000);
                if ($scope.timeOutSeconds < 1) {
                    $scope.timeOutSeconds = 60000;
                }

                $scope.timer = $timeout(function () {
                    $("#gateway").attr("aria-hidden", "true");
                    $scope.dialog = ngDialog.open({
                        template: 'TimeOutWarning',
                        className: 'ngdialog-theme-default leavingWarningContent',
                        showClose: true,
                        closeByDocument: false,
                        appendTo: "#menuContainer",
                        ariaRole: "dialog",
                        scope: $scope
                    });
                    $scope.dialogTimer = $timeout(function () {
                        $scope.returnToHome();
                    }, $scope.timeOutSeconds);
                }, $scope.timeOutSeconds);

            }
            return $scope;
        }
        else if (activeTab == 'Back_Home') {
            $timeout.cancel($scope.timer);
            //Reset Input values values
            var width = $(window).width();
            $scope.bError = false;
            $scope.ResetNamePass($scope);
            if (width < 769 || $scope.backtobSignInView) {
                if ($scope.backtobSignInView) {
                    $scope.showInFullView = true;
                }
                $scope.bSignInView = true;
                $scope.showMobileSignIn(this);
            }
            else {
                $scope.homeView();
            }
        }


    };
    $scope.CloseDialogs = function () {
        ngDialog.closeAll();
    };

    $scope.LaunchSearchResultsFromJobCart = function () {
        $scope.searchMatchedJobs(this);
    };

    $scope.LaunchSearchResultsFromDashBoard = function () {

        var isSearchResultsLaunchedAtleastOnce = false;
        if (typeof $scope.oHistory != "undefined" && $scope.oHistory != null)
            _.each($scope.oHistory, function (oPriorScope, sName) {
                if (sName.indexOf('keyWordSearch') != -1) {
                    isSearchResultsLaunchedAtleastOnce = true;
                    return;
                }
            });
        if (isSearchResultsLaunchedAtleastOnce) {
            $scope.bCandidateZone = false;
            $scope.bSearchResults = true;
            $scope.bSidebarVisible = true;
            $scope.bSidebarShown = true;
            $scope.bSidebarOverlay = true;
            $scope.$root.workFlow = "searchResults";
            if ($scope.jobsCache != null) {
                $scope.jobs = $scope.jobsCache;
            }
            $scope.jobs = _.each($scope.jobs, function (job) {
                job.Selected = false;
            });
            if (typeof $scope.oHistory != "undefined" && $scope.oHistory != null)
                _.each($scope.oHistory, function (oPriorScope, sName) {
                    if (sName.indexOf('keyWordSearch') != -1) {
                        $scope.oHistory[sName].SelectJobs = $scope.tgSettings.SelectJobsText;;
                        $scope.oHistory[sName].toggleCheckBoxes = false;
                        $scope.oHistory[sName].SelectedJobsChecked = false;
                    }
                });
            $scope.setHash();
        }
        else {
            $scope.bCanZoneJobsLoadingState = true;
            $scope.searchMatchedJobs(this);
        }

    };

    $scope.LaunchJobCartFromSearchResultsOrJobDetails = function () {
        if ($scope.bJobDetailsShown) {
            $scope.bJobCartLaunchedFromJobDetails = true;
        }
        else {
            $scope.bJobCartLaunchedFromSearchResults = true;
        }
        if ($scope.bresponsiveCandidateZone) {
            $scope.savedJobsCache = null;
            $scope.bCandidateZone = true;
            $scope.bJobDetailsShown ? $scope.DashboardPrevPage = ["JobDetails"] : $scope.DashboardPrevPage = ["SearchResults"];
            $scope.ViewDashBoardData("SavedJobs");
        }
        else {
            $scope.ViewJobCartAjax();
        }
    };

    $scope.RemoveJobFromCart = function (event, scope, job) {
        var siteId = _.pluck(_.where(job.Questions, { "QuestionName": "siteid" }), "Value").toString();
        var partnerId = $("#partnerId").val();
        var jobId = _.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString();
        var jobSiteInfo = jobId + "_" + siteId;
        $scope.RemoveFromJobCartAjax(partnerId, siteId, jobSiteInfo, job);
    };


    $scope.InitialiseJobdetails = function (AlertVal) {
        $scope.ShowJobAlert = AlertVal;
        setTimeout(function () {
            $scope.$apply();
        }, 0);
        setTimeout(function () {
            $scope.setTitle("jobDetails");
        }, 10);
    };

    $scope.CallApply = function () {
        $timeout(function () {
            $scope.$apply();
        }, 0);
    }

    $scope.CloseExpiredJobAlert = function () {
        $scope.bShowExpiredJobAlert = false;
        $scope.CallApply();
    };

    $scope.CloseApplicationsExpiredJobAlert = function () {
        $scope.CandZoneApplicationsExpiredJobs = null;
    }

    $scope.CloseSubmittedApplicationsExpiredJobAlert = function () {
        $scope.CandZoneSubmittedApplicationsExpiredJobs = null;
    }

    $scope.CloseJobRemovalJobAlert = function () {
        $scope.bJobRemovalStatus = false;
        $scope.bAppsRemovalStatus = false;
        $scope.CallApply();
    };

    $scope.CloseJobsSavedAlert = function () {
        $scope.bJobsSaved = false;
        $scope.CallApply();
    };

    $scope.CloseJobSavedAlert = function () {
        $scope.bJobSaved = false;
        $scope.CallApply();
    };

    $scope.CloseHeaderStickerAlert = function (property) {
        $scope[property] = false;
        $scope.CallApply();
    };
    $scope.CloseHeaderStickerEnumAlert = function (property) {
        $scope[property] = 0;
        $scope.CallApply();
    };
    if ($scope.EmailToSecQuestions == true) {
        $scope.login.ForgotPass = true;
        if ($scope.TokenResponse.SecurityQuestions != null) {
            if ($scope.TokenResponse.SecurityQuestions.SecurityQuestion1 != null && $scope.TokenResponse.SecurityQuestions.SecurityQuestion1 != '') {
                $scope.login.SecurityQuestion1 = eval("$scope.securityQuestions." + $scope.TokenResponse.SecurityQuestions.SecurityQuestion1);
            }
            if ($scope.TokenResponse.SecurityQuestions.SecurityQuestion2 != null && $scope.TokenResponse.SecurityQuestions.SecurityQuestion2 != '') {
                $scope.login.SecurityQuestion2 = eval("$scope.securityQuestions." + $scope.TokenResponse.SecurityQuestions.SecurityQuestion2);
            }
            if ($scope.TokenResponse.SecurityQuestions.SecurityQuestion3 != null && $scope.TokenResponse.SecurityQuestions.SecurityQuestion3 != '') {
                $scope.login.SecurityQuestion3 = eval("$scope.securityQuestions." + $scope.TokenResponse.SecurityQuestions.SecurityQuestion3);
            }
        }
        if ($scope.login.SecurityQuestion1 == '' && $scope.login.SecurityQuestion2 == '' && $scope.login.SecurityQuestion3 == '') {
            if ($scope.TokenResponse.TokenResult == 2) {
                $scope.login.SecurityQuestionsPageSuccess = $scope.dynamicStrings.ErrorMessage_EmailLinkExpired;
                //ErrorMessage_EmailLinkExpired
            }
            else if ($scope.TokenResponse.TokenResult == 3) {
                $scope.login.SecurityQuestionsPageSuccess = $scope.dynamicStrings.ErrorMessage_EmailLinkAlreadyUsed;
                //ErrorMessage_EmailLinkAlreadyUsed
            }
            else
                $scope.login.SecurityQuestionsPageSuccess = $scope.dynamicStrings.ErrorMessage_ContactHelpDesk;
        }
        $scope.ActivePage('SecurityQuestions');
    }



    ///  ///Reset UserName Password Ends here


    var that = $scope,
        asNativeScopeKeys = (_.keys($scope.$new())),
        response = $scope.preloadResponse || $scope.searchResponse,
        preLoadSmartSearchResponse = $scope.preloadResponse && $scope.preloadResponse.SmartSearchJSONValue ? JSON.parse($scope.preloadResponse.SmartSearchJSONValue) : '',
        bMapProvider = response.ClientSettings.ProximitySearch.toLowerCase() == "yes",
        isJobsNearMeOn = (response.ClientSettings.HideHighlightedJobsSection.toLowerCase() == "no" && response.ClientSettings.ShowJobsNearMe.toLowerCase() == "yes" && response.ClientSettings.ProximitySearch.toLowerCase() == "yes") ? true : false;

    window.appScope = $scope;
    $scope.$root.appScope = $scope;

    $scope.$root.workFlow = $("#workFlow").attr("content");

    $scope.$root.historyStateCallback = $scope.historyStateCallback || _.noop;
    $scope.$root.historyApplyCallback = $scope.historyApplyCallback || _.noop;

    $scope.$root.storeHistoryState = $scope.storeHistoryState || _.noop;

    $scope.$root.setPrevHash = $scope.setPrevHash || _.noop;

    $scope.utils.reassessMoreLinksOnWindowResize();

    $scope.utils.stackPageFooter();



    if ($.queryParams().brandingTest) {
        response.ClientSettings.ShowJobSearchHeader = "Always";
        response.FooterInfo = [{ Name: "link1" }, { Name: "link2" }];
        console.log("forcing show job search header to always");
    }

    $scope.$watch("jobs", function (val) {
        //check footer position when no jobs are returned
        //when jobs are returned, loopComplete directive will do the same
        if (val && val.length === 0)
            setTimeout(function () {
                $.pinToFold();
            }, 0);
    });

    _.assign($scope, {
        $location: $location,
        $window: $window,
        response: response,
        showHeader: response.ClientSettings.ShowJobSearchHeader.toLowerCase(),
        bresponsiveCandidateZone: response.ResponsiveCandidateZone,
        bcandidatezoneSubmenu: false,
        shortMonthNames: $("#shortMonthNames").val(),
        storeHistoryState: function () {
            var applyHashData = [];
            if (typeof applyScope != "undefined" && typeof applyScope.page != "undefined") {
                applyHashData = {
                    ReqID: applyScope.page.reqid,
                    TQID: applyScope.page.tqid,
                    SiteId: applyScope.page.siteid,
                    SID: applyScope.page.sid,
                    ApidId: applyScope.page.aipid,
                    LocaleId: applyScope.page.localeid,
                    GQSessionID: applyScope.page.gqsessionid,
                    PageId: applyScope.page.pageid
                }
            }

            var oState = $scope.$root.oHistory[$location.hash()] = $scope.oHistory[$location.hash()] = _.clone($scope, false);
            oState.applyPageData = _.clone(applyHashData, true);
            oState.facets = _.clone($scope.facets, true);
            oState.powerSearchQuestions = _.clone($scope.powerSearchQuestions, true);
            oState.jobs = _.clone($scope.jobs, true);
            oState.payload = _.clone($scope.payload, false);
        },
        historyStateCallback: function setSearchStateFromHash() {
            //Retain some Social referral Scope which are used universally, reset other scope based on History Hash
            appScope.$root.oHistory[$location.hash()].SocialReferral_FirstName = $scope.$root.oHistory[$location.hash()].SocialReferral_FirstName = $scope.oHistory[$location.hash()].SocialReferral_FirstName = $scope.SocialReferral_FirstName;
            appScope.$root.oHistory[$location.hash()].SocialReferral_LastName = $scope.$root.oHistory[$location.hash()].SocialReferral_LastName = $scope.oHistory[$location.hash()].SocialReferral_LastName = $scope.SocialReferral_LastName;
            appScope.$root.oHistory[$location.hash()].SocialReferral_ProfileId = $scope.$root.oHistory[$location.hash()].SocialReferral_ProfileId = $scope.oHistory[$location.hash()].SocialReferral_ProfileId = $scope.SocialReferral_ProfileId;
            appScope.$root.oHistory[$location.hash()].SocialReferral_READY = $scope.$root.oHistory[$location.hash()].SocialReferral_READY = $scope.oHistory[$location.hash()].SocialReferral_READY = $scope.SocialReferral_READY;

            //Retain some Scope which are used universally, reset other scope based on History Hash
            appScope.$root.oHistory[$location.hash()].mobileScreen = $scope.$root.oHistory[$location.hash()].mobileScreen = $scope.oHistory[$location.hash()].mobileScreen = $scope.mobileScreen;
            appScope.$root.oHistory[$location.hash()].ShowTimeoutMessage = $scope.$root.oHistory[$location.hash()].ShowTimeoutMessage = $scope.oHistory[$location.hash()].ShowTimeoutMessage = $scope.ShowTimeoutMessage;
            appScope.$root.oHistory[$location.hash()].bLoggedIn = $scope.$root.oHistory[$location.hash()].bLoggedIn = $scope.oHistory[$location.hash()].bLoggedIn = $scope.bLoggedIn;
            appScope.$root.oHistory[$location.hash()].ProfileDetails = $scope.$root.oHistory[$location.hash()].ProfileDetails = $scope.oHistory[$location.hash()].ProfileDetails = $scope.ProfileDetails;
            appScope.$root.oHistory[$location.hash()].welcomeTitle = $scope.$root.oHistory[$location.hash()].welcomeTitle = $scope.oHistory[$location.hash()].welcomeTitle = $scope.welcomeTitle;
            appScope.$root.oHistory[$location.hash()].welcomeText = $scope.$root.oHistory[$location.hash()].welcomeText = $scope.oHistory[$location.hash()].welcomeText = $scope.welcomeText;

            //Retain DuplicateVariables
            appScope.$root.oHistory[$location.hash()].LimitExceededMessage = $scope.$root.oHistory[$location.hash()].LimitExceededMessage = $scope.oHistory[$location.hash()].LimitExceededMessage = $scope.LimitExceededMessage;
            appScope.$root.oHistory[$location.hash()].ApplyDifference = $scope.$root.oHistory[$location.hash()].ApplyDifference = $scope.oHistory[$location.hash()].ApplyDifference = $scope.ApplyDifference;
            appScope.$root.oHistory[$location.hash()].AllowReApply = $scope.$root.oHistory[$location.hash()].AllowReApply = $scope.oHistory[$location.hash()].AllowReApply = $scope.AllowReApply;
            appScope.$root.oHistory[$location.hash()].Applied = $scope.$root.oHistory[$location.hash()].Applied = $scope.oHistory[$location.hash()].Applied = $scope.Applied;

            //resets state based on browser history controls or location input
            var storedScope = $scope.oHistory[$location.hash()];
            _.forIn(storedScope, function (val, key) {
                if (_.isBoolean(val) || _.isBoolean(this[key]))
                    this[key] = val;
                if (_.isNumber(val) || _.isNumber(this[key]))
                    this[key] = val;
                if ((_.isString(val) || _.isString(this[key])) && key != "encryptedBruid")
                    this[key] = val;
                if (val && val.text != undefined)
                    this[key].text = val.text;
                else if (key == "facets" || key == "powerSearchJobs" || key == "powerSearchQuestions" || key == "oldPowerSearchQuestions")
                    //deep operatation to set state
                    _.setState(this[key], val, 3);
                else if (key == "jobs") {
                    this[key] = val;
                }
                else if (_.isArray(val) && this[key] != val && key.indexOf("$$") != 0 && this[key] != null) {
                    //shallow operation to set state
                    this[key].length = 0;
                    this[key].push.apply(this[key], val);
                }

            }, $scope);

            if ($location.hash()) {
                if (storedScope.payload && $location.hash().indexOf("JobCart") == -1) {
                    if ($location.hash().indexOf("keyWordSearch") != -1 || $location.hash().indexOf("locationSearch") != -1) {
                        $scope.setTitle("searchResults");
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults"
                    } else if ($location.hash().indexOf("jobDetails") != -1) {
                        setTimeout(function () {
                            $scope.setTitle("jobDetails");
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                        }, 10);
                    }
                    if (storedScope.payload.fnPayloadParent) {
                        storedScope.payload.fnPayloadParent(true);
                        setTimeout(function () { $scope.$apply(); }, 0);
                    } else {
                        storedScope.payload.fnPayload.apply(storedScope.payload.oPayloadContext, storedScope.payload.aPayloadResponse);
                    }
                }
                else if ($location.hash().indexOf("advancedSearch") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "powerSearch";
                    $scope.setTitle("powerSearch");
                }
                else if ($location.hash().indexOf("SelectedGroup") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "SelectedGroup";
                    $scope.setTitle("SelectedGroup");
                }
                else if ($location.hash().indexOf("ForgotUsernamePassword") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "forgotPassword";
                    $scope.ActivePage('Email');
                }
                else if ($location.hash().indexOf("CreateAccount") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "createAccount";
                    $scope.setTitle("createNewAccount");
                    $scope.bCreateAccount = true;
                    $scope.bPrivacyPages = false;
                    $scope.bPrivacyPolicyQuestion = false;
                    $scope.bPrivacyPolicyStatement = false;
                    $scope.bPrivacyOptOut = false;
                }
                else if ($location.hash().indexOf("PolicyQuestion") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "createNewAccount";
                    $scope.setTitle("createNewAccount");
                    $scope.bCreateAccount = false;
                    $scope.bPrivacyPages = true;
                    $scope.bPrivacyPolicyQuestion = true;
                    $scope.bPrivacyPolicyStatement = false;
                    $scope.bPrivacyOptOut = false;

                }
                else if ($location.hash().indexOf("PolicyStatement") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "createNewAccount";
                    $scope.setTitle("createNewAccount");
                    $scope.bCreateAccount = false;
                    $scope.bPrivacyPages = true;
                    $scope.bPrivacyPolicyQuestion = false;
                    $scope.bPrivacyPolicyStatement = true;
                    $scope.bPrivacyOptOut = false;

                }
                else if ($location.hash().indexOf("PolicyOptOut") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "createNewAccount";
                    $scope.setTitle("createNewAccount");
                    $scope.bCreateAccount = false;
                    $scope.bPrivacyPages = true;
                    $scope.bPrivacyPolicyQuestion = false;
                    $scope.bPrivacyPolicyStatement = false;
                    $scope.bPrivacyOptOut = true;

                }
                else if ($location.hash().indexOf("SavedJobs") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("JobCart");
                    $scope.DashBoardMenu("SavedJobs");
                }
                else if ($location.hash().indexOf("Applications") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("Applications");
                    $scope.candidatezoneSubView == 'dashBoard';
                    $scope.candidatezoneDashBoardView = "Applications";
                }
                else if ($location.hash().indexOf("SavedSearches") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("SavedSearches");
                    $scope.DashBoardMenu("SavedSearches");
                }
                else if ($location.hash().indexOf("myFiles") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("MyFile");
                    $scope.candidatezoneSubView == 'jobProfile';
                    $scope.candidatezoneDashBoardView = "myFiles";
                }
                else if ($location.hash().indexOf("profile") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("Profile");
                    $scope.candidatezoneSubView == 'jobProfile';
                    $scope.candidatezoneEditProfileView = "profile";
                }
                else if ($location.hash().indexOf("accountSettings") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("AccountSettings");
                    $scope.candidatezoneSubView == 'accountSettings';
                }
                else if ($location.hash().indexOf("applicationDetail") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.candidatezoneSubView == 'applicationDetail';
                    setTimeout(function () { $scope.setTitle("ApplicationDetail"); }, 100);

                }
                else if ($location.hash().indexOf("JobCart") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("JobCart");
                    $scope.$root.workFlow = 'JobCart';
                }
                else if ($location.hash().indexOf("ResponsiveAssessment") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("Assessments");
                    $scope.candidatezoneSubView == 'ResponsiveAssessment';
                }
                else if ($location.hash().indexOf("ResponsiveReferrals") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("Referrals");
                    $scope.candidatezoneSubView == 'ResponsiveReferrals';
                }
                else if ($location.hash().indexOf("keyWordSearch") != -1 || $location.hash().indexOf("locationSearch") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults"
                    $scope.setTitle("searchResults");
                }
                else if ($location.hash().indexOf("jobDetails") != -1) {
                    setTimeout(function () {
                        $scope.setTitle("jobDetails");
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                    }, 10);
                } else if ($location.hash().indexOf("communication") != -1) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.setTitle("Communication");
                    $scope.candidatezoneSubView == 'messageArchive';
                } else if ($location.hash().indexOf("ReferralDetails") != -1) {
                }
                else {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "welcome";
                    $scope.setTitle("welcome");
                    $scope.showInitialJobs(true);
                }
            } else {
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "welcome";
                $scope.setTitle("welcome");
                $scope.showInitialJobs(true);
            }
            $scope.scrolltop();

            setTimeout(function () { $.pinToFold; }, 0);
        },

        setPrevHash: function (prevHash) {
            if (typeof previousHashes === 'undefined') {
                previousHashes = [];
            }
            previousHashes[previousHashes.length] = prevHash;
        },

        setHash: function (bResettingFromHistory, oPayloadData, oPayloadContext) {
            //sets window location hash
            //triggering the locationChangeStart event
            //see handler in shared.js 

            var B_TREAT_FILTER_AS_NEW_PAGE = true,
                aHash = [];

            if (bResettingFromHistory)
                return;

            //if ($location.hash() === "") {
            //    //location coordinates are not available when initial load history state is stored
            //    //so store it before moving to next screen
            //    $scope.$root.oHistory[""].geoLocationLongitude = $scope.geoLocationLongitude;
            //    $scope.$root.oHistory[""].geoLocationLatitude = $scope.geoLocationLatitude;
            //}


            if ($scope.bJobDetailsShown) {
                aHash.push("jobDetails=" + $scope.jobDetailsJobShown);
                if ($scope.bresponsiveCandidateZone && $scope.bCandidateZone) {
                    aHash.push("fromSavedJobs=" + true);
                }
            }
            else if ($scope.bInitialLoad) {
                if ($scope.login.ForgotPass == true) {
                    if ($scope.login.ActiveTab == 'Email')
                        aHash.push("ForgotUsernamePassword");
                    else if ($scope.login.ActiveTab == 'SecurityQuestions')
                        aHash.push("SecurityQuestions");
                    else if ($scope.login.ActiveTab == 'ResetUserNamePassword' && $scope.login.NameOrPass == 'username')
                        aHash.push("ForgotUsername");
                    else if ($scope.login.ActiveTab == 'ResetUserNamePassword' && $scope.login.NameOrPass != 'username')
                        aHash.push("ResetPassword");
                    else
                        aHash.push("ForgotUsernamePassword");
                }
                else if ($scope.bPrivacyPages) {
                    if ($scope.bPrivacyPolicyQuestion)
                        aHash.push("PolicyQuestion");
                    else if ($scope.bPrivacyPolicyStatement)
                        aHash.push("PolicyStatement");
                    else if ($scope.bPrivacyOptOut)
                        aHash.push("PolicyOptOut");
                }
                else if ($scope.bCreateAccount)
                    aHash.push("CreateAccount");
                else if ($scope.LoginChangeSecQuestion)
                    aHash.push("ChangeSecurityQuestion");
                else if ($scope.bCandidateZone) {
                    if ($scope.bJobCart) {
                        aHash.push("JobCart");
                    }
                    else {
                        aHash.push("CandidateZone");
                    }
                }
                else {
                    if (appScope.$root.workFlow != "ReferralDetails")
                        aHash.push("home");
                }
            }
            else if ($scope.bSelectedGroup) {
                aHash.push("SelectedGroup");
            }
            else if ($scope.bCandidateZone) {
                if (!$scope.bresponsiveCandidateZone && $scope.bJobCart) {
                    aHash.push("JobCart");
                }
                else if ($scope.candidatezoneSubView == 'dashBoard') {
                    switch ($scope.candidatezoneDashBoardView) {
                        case "SavedJobs":
                            aHash.push("SavedJobs");
                            break;
                        case "Applications":
                            aHash.push("Applications");
                            break;
                        case "SavedSearches":
                            aHash.push("SavedSearches");
                            break;
                        default:
                            aHash.push("SavedJobs");
                            break;
                    }
                }
                else if ($scope.candidatezoneSubView == 'jobProfile') {
                    switch ($scope.candidatezoneEditProfileView) {
                        case "myFiles":
                            aHash.push("myFiles");
                            break;
                        case "profile":
                            aHash.push("profile");
                            break;
                        default:
                            aHash.push("profile");
                            break;
                    }

                }
                else if ($scope.candidatezoneSubView == 'accountSettings') {
                    aHash.push("accountSettings");
                }
                else if ($scope.candidatezoneSubView == 'messageArchive') {
                    aHash.push("communication");
                }
                else if ($scope.candidatezoneSubView == 'applicationDetail') {
                    if ($scope.previewOfSubmittedApplication) {
                        aHash.push("applicationPreview");
                    }
                    else {
                        aHash.push("applicationDetail");
                    }
                }
                else if ($scope.candidatezoneSubView == 'ResponsiveAssessment')
                    aHash.push("ResponsiveAssessment");
                else if ($scope.candidatezoneSubView == 'ResponsiveReferrals')
                    aHash.push("ResponsiveReferrals");
                else
                    aHash.push("CandidateZone");
            }
            else if (appScope.$root.workFlow != "ReferralDetails") {
                if ($scope.bPowerSearchVisible)
                    aHash.push("advancedSearch");
                else if (appScope.powerSearchQuestions.length) {
                    aHash.push.apply(aHash, _(appScope.powerSearchQuestions).map(function (q, i) {
                        var prefix = q.QuestionName + "=";

                        if (q.Value)
                            return prefix + escape(q.Value);
                        if (_.some(q.Options, { Selected: true })) {
                            return prefix + _(q.Options).map(function (opt) {
                                if (opt.Selected)
                                    return opt.OptionName;
                            }).compact().valueOf().join(",");
                        }
                        if (q.selectedOptions != undefined) {
                            var selectedOptions = _.pluck(q.selectedOptions, "value");
                            selectedOptions = selectedOptions.join(',');
                            return prefix + selectedOptions;
                        }
                    }).compact().valueOf());
                }
                if (!$scope.keyWordSearch.hidden)
                    aHash.push("keyWordSearch=" + $scope.keyWordSearch.text);
                if (!$scope.locationSearch.hidden)
                    aHash.push("locationSearch=" + $scope.locationSearch.text);
                if (B_TREAT_FILTER_AS_NEW_PAGE && $scope.filterAppliedCount) {
                    _.each($scope.facets, function (oFacet) {
                        if (oFacet.SelectedCount) {
                            var aSelectedOptions = _.pluck(_.filter(oFacet.Options, { Selected: true }), "OptionName");
                            aHash.push(oFacet.Description + "=" + aSelectedOptions.join("_or_"));
                        }
                    })
                }
            }
            if ($scope.$root.workFlow == "ReferralDetails" || $scope.workFlow == "ReferralDetails") {
                aHash = []
                aHash.push("ReferralDetails");
            }
            else {
                $scope.utils.storePayload(oPayloadData, oPayloadContext);
            }
            //if ($scope.bLoggedIn)
            //    aHash.push("loggedIn=" + $scope.bLoggedIn);

            $location.hash(aHash.join("&"));

            setTimeout(function () { $.pinToFold }, 0);
        },
        historyApplyCallback: function () {
            ngDialog.open({
                preCloseCallback: function (value) {
                    $('body').removeClass('noScroll');
                },
                template: 'RedirectToApplyTemplate', scope: $scope, className: 'ngdialog-theme-default', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
            });
            var applyPageData = $scope.oHistory[$location.hash()].applyHashData;
            var rft = $("[name='__RequestVerificationToken']").val();
            if (applyPageData.ApidId == "-1" || applyPageData.GQSessionID == "")
                var URL = "/gqweb/apply?bruid=" + encodeURIComponent($scope.encryptedBruid) + "&tqid=" + applyPageData.TQID + "&localeid=" + applyPageData.LocaleId + "&reqid=" + applyPageData.ReqID + "&partnerid=" + $("#partnerId").val() + "&siteid=" + applyPageData.SiteId + "&sid=" + applyPageData.SID + "&loadingViaAjax=true&RFT=" + rft;
            else
                var URL = "/gqweb/apply?BRUID=" + encodeURIComponent($scope.encryptedBruid) + "&TQId=" + applyPageData.TQID + "&GQSessionId=" + applyPageData.GQSessionID + "&reqid=" + applyPageData.ReqID + "&partnerid=" + $("#partnerId").val() + "&PageId=" + applyPageData.PageId + "&AIPID=" + applyPageData.ApidId + "&siteid=" + applyPageData.SiteId + "&wbmode=false&loadingViaAjax=true&RFT=" + rft;
            history.back();


            $.ajax({
                method: "GET",
                url: URL,
                success: function (result) {
                    ngDialog.closeAll();
                    $scope.$root.applyResponse = result;
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                    setTimeout(function () {
                        $scope.$apply();
                    }, 0);
                }
            });
        },

        welcomeState: function (bSetWorkflowState) {
            var bWelcome = this.bInitialLoad && !this.bPrivacyPages && !this.bCreateAccount && !this.bCandidateZone && !(this.login && this.login.ForgotPass) && !this.LoginChangeSecQuestion && !(this.bSignInView && !this.calledFromDesktop);

            if (bWelcome && bSetWorkflowState !== false)
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "welcome";

            return bWelcome;
        },

        showSearchResults: function () {
            var bShow = (!$scope.bPrivacyPages && !$scope.bSelectedGroup && !$scope.bCreateAccount && !$scope.login.ForgotPass && !$scope.bCandidateZone && !$scope.bSignInView && !$scope.LoginChangeSecQuestion) || ($scope.bSignInView && ($scope.calledFromDesktop || $scope.bRenderPhoneViewSearch));

            return bShow;
        },
        afterShowSearchResults: function () {

            if (!$scope.welcomeState(false) && !$scope.bPowerSearchVisible && $scope.bSidebarVisible && !$scope.bJobDetailsShown)
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
        },

        keyWordSearch: {
            hidden: response.ClientSettings.HideKeywordSearchBox.toLowerCase() == "yes",
            text: preLoadSmartSearchResponse.Keyword == undefined ? "" : preLoadSmartSearchResponse.Keyword,
            prompt: response.ClientSettings.KeywordSearchText,
            submitAfterSelection: false,
            searchButton: true,
            enterKeyHit: false,  //To handle immediate enter key hit.          
            autocompleteConfig: {
                source: function (request, response) {
                    var autocompleterequest = {
                        partnerId: $("#partnerId").val(),
                        siteId: $("#siteId").val(),
                        searchString: request.term,
                        searchFields: that.keywordFields
                    };

                    $.ajax({
                        type: "POST",
                        url: "/TgNewUI/Search/Ajax/KeywordAutoComplete",
                        data: autocompleterequest,
                        success: function (oRawData) {
                            if (!$scope.keyWordSearch.enterKeyHit && oRawData != null && oRawData.Options && oRawData.Options.length) {
                                data = _.sort(oRawData.Options).slice(0, 10);
                                data = _.map(data, function (job) {
                                    job = job.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim();
                                    return job;
                                });
                                $scope.keyWordSearch.autoCompleteResponse = data;
                                if ($scope.keyWordSearch.typeAheadConfig.typeAheadCallBack)//set dynamically in type ahead directive
                                    $scope.keyWordSearch.typeAheadConfig.typeAheadCallBack();
                                response(data);
                            }
                            else {
                                response(null);
                                if ($scope.keyWordSearch.enterKeyHit) {
                                    $scope.utils.cleanUpAutocompletes();
                                }
                                $scope.keyWordSearch.enterKeyHit = false;

                            }
                        },
                        error: function (jqxhr, status, error) {
                            response(null);
                        }
                    });

                },
                minLength: 1,
                select: function (event, ui) {
                    /*
                    * The select event firing two times,
                    * 1. when option is going to be selected.
                    * 2. After selection when list box is going to be closed.
                   */
                    if (!ui.item.value && $scope.bPowerSearchVisible) {
                        $scope.keyWordSearch.text = $scope.powerSearchKeyWordSearch.text;
                    } else {
                        if ($scope.keyWordSearch.enterKeyHit && ui.item.value != "" && ui.item.value != event.target.value) {
                            $scope.keyWordSearch.text = event.target.value;
                        } else if (ui.item.value && ui.item.value != "") {
                            $scope.keyWordSearch.text = ui.item.value;
                        } else if (event.target.value != "") {
                            $scope.keyWordSearch.text = event.target.value
                        } else {
                            $scope.keyWordSearch.text = $(event.toElement).text();
                        }
                        $scope.powerSearchKeyWordSearch.text = $scope.keyWordSearch.text;
                    }
                    $scope.$apply();

                    //Handled enter and tab key for selecting the item from the list.
                    if (event.originalEvent && (
                            (event.originalEvent.originalEvent && event.originalEvent.originalEvent.keyCode == $.keyCodes.tab) ||
                            (event.originalEvent.target.type == "" && event.originalEvent.keyCode == $.keyCodes.enter) ||
                            (event.originalEvent.type == "menuselect")
                        )
                    ) {
                        $scope.keyWordSearch.submitAfterSelection = false;
                        return;
                    } else if ($scope.keyWordSearch.submitAfterSelection) {
                        //Fetching job matched results for enter key press on textbox.
                        $scope.keyWordSearch.submitAfterSelection = false;
                        $scope.utils.cleanUpAutocompletes();
                        if ($scope.workFlow == "powerSearch") {
                            $(".powerSearchContainer").find("button.ladda-button").trigger("click");
                        } else {
                            $(".searchBoxContainer").find("button.ladda-button").trigger("click");
                        }
                    } else {
                        $scope.utils.cleanUpAutocompletes();
                    }
                },
                freeFormSelect: true
            },
            addButtonClickHandler: function (scope) {
                //implementation assumes that the autocomplete has fetched relevant results
                //TODO: add a failsafe in autocomplete results return to prevent timing glitches
                var sText = angular.nearestScopeVal("oInput.text", scope),
                    rxTester = new RegExp(sText.replace("(", "\\(").replace(")", "\\)"), "gi"),
                    oOption = _.find(oQuestion.aAvailableOptions, function (oAvailableOption) {
                        //return rxTester.test(oAvailableOption.label);
                        return sText.toLowerCase() == oAvailableOption.label.toLowerCase();
                    });

                $scope.advancedSearch.handleSubmit(scope, oQuestion, oOption);
            },
            autoCompleteResponse: [],
            typeAheadConfig: {
                source: function () {
                    $scope.keyWordSearch.enterKeyHit = false;
                    var aMatches = [];
                    _.each($scope.keyWordSearch.autoCompleteResponse, function (sHit) {
                        aMatches = $.matchWordOrPhrase(sHit, $scope.keyWordSearch.text);
                        if (aMatches)
                            return false;//break out of loop at first start word or phrase match
                    });
                    return aMatches;
                }
            },
            submit: function () {
                $scope.keyWordSearch.enterKeyHit = true;//This flag is used for stoping source binding for auto list, when immediately pressing enter with sometext on textbox.
                $scope.keyWordSearch.submitAfterSelection = true;
            }
        },

        advancedSearch: {
            searchButton: true,
            autocompleteConfig: {
                source: function (request, response) {
                    var scope = angular.element(this.element).scope(),
                        oQuestion = angular.nearestScopeVal("question", scope);
                    var selectedOptions = "";
                    if (oQuestion.ParentQuestionId != 0) {
                        var parentQuestion;
                        var parentQuestion = _.find(that.powerSearchQuestions, { 'QId': _.parseInt(oQuestion.ParentQuestionId) });
                        if (parentQuestion != null) {
                            selectedOptions = _.pluck(parentQuestion.selectedOptions, "data");
                            selectedOptions = selectedOptions.join(',');
                        }
                    }
                    autocompleterequest = {
                        partnerId: $("#partnerId").val(),
                        siteId: $("#siteId").val(),
                        questionId: String(oQuestion.QId),
                        searchString: request.term,
                        parentQuestionId: oQuestion.ParentQuestionId,
                        parentQuestionCodes: selectedOptions
                    };
                    if (oQuestion.selectedOptions != null) {
                        autocompleterequest.selectedQuestionCodes = _.pluck(oQuestion.selectedOptions, "data").join("#@#");
                    } else {
                        autocompleterequest.selectedQuestionCodes = null;
                    }

                    $.ajax({
                        type: "POST",
                        url: "/TgNewUI/Search/Ajax/PowerSearchAutoComplete",
                        data: autocompleterequest,
                        success: function (oData) {
                            oQuestion.oAvailableOptions = oData;
                            if (oQuestion.QId == "0" && $scope.dynamicStrings.Option_All.toLowerCase().indexOf(request.term.toLowerCase()) >= 0) {
                                oData.Options["999999"] = $scope.dynamicStrings.Option_All;
                            }
                            var aData = $.map(oData.Options, function (val, id) {
                                return {
                                    data: id,
                                    label: val,
                                    value: val
                                };
                            });

                            oQuestion.aAvailableOptions = aData;
                            if ($scope.advancedSearch.typeAheadConfig.typeAheadCallBack)//set dynamically in type ahead directive
                                $scope.advancedSearch.typeAheadConfig.typeAheadCallBack();
                            response(aData);
                        }
                    });
                },
                select: function (event, ui) {
                    var scope = angular.element(this).scope().$parent;
                    scope.oInput.text = ui.item.value;
                    scope.$apply();
                },
                minLength: 1
            },
            typeAheadConfig: {
                source: function (scope, $el) {
                    var oQuestion = angular.nearestScopeVal("question", scope),
                        aMatches = [];

                    _.each(oQuestion.aAvailableOptions, function (sHit) {
                        aMatches = $.matchWordOrPhrase(sHit.label, scope.oInput.text);
                        if (aMatches)
                            return false;//break out of loop at first start word or phrase match
                    });
                    return aMatches;
                }
            },
            addButtonClickHandler: function (scope, oQuestion) {
                //implementation assumes that the autocomplete has fetched relevant results
                //TODO: add a failsafe in autocomplete results return to prevent timing glitches
                var sText = angular.nearestScopeVal("oInput.text", scope),
                    // rxTester = new RegExp(sText.replace("(", "\\(").replace(")", "\\)"), "gi"),
                    oOption = _.find(oQuestion.aAvailableOptions, function (oAvailableOption) {
                        // return rxTester.test("/^(" + oAvailableOption.label + ")$/gi");
                        return sText.toLowerCase() == oAvailableOption.label.toLowerCase();
                    });

                $scope.advancedSearch.handleSubmit(scope, oQuestion, oOption);
            },
            submit: function (i, scope, $el) {
                //really just an enter key handler in this case
                var oQuestion = angular.nearestScopeVal("question", scope);

                $scope.advancedSearch.addButtonClickHandler(scope, oQuestion);
            },
            handleSubmit: function (scope, oQuestion, oOption) {
                if (oOption) {
                    oQuestion.selectedOptions = oQuestion.selectedOptions || [];
                    if (!_.some(oQuestion.selectedOptions, { data: oOption.data })) {
                        oQuestion.selectedOptions.push(oOption);
                        angular.nearestScopeVal("oInput", scope).text = "";
                        $scope.$root.utils.cleanUpAutocompletes();
                        $timeout(function () { $scope.$apply() });
                    }
                }
            }
        },

        locationSearch: {
            hidden: response.ClientSettings.HideLocationSearchBox.toLowerCase() == "yes",
            text: preLoadSmartSearchResponse.Location == undefined ? "" : preLoadSmartSearchResponse.Location,
            prompt: response.ClientSettings.LocationSearchText,
            submitAfterSelection: false,
            searchButton: true,
            enterKeyHit: false,  //To handle immediate enter key hit.
            autocompleteConfig: {
                source: function (request, response) {
                    var //matcher = new RegExp("(" + $.ui.autocomplete.escapeRegex(request.term) + ")", "gi"),
                        autocompleterequest = {
                            partnerId: $("#partnerId").val(),
                            siteId: $("#siteId").val()
                        };

                    if (bMapProvider) {
                        autocompleterequest.location = request.term;
                        autocompleterequest.mapProvider = that.tgSettings.MapsProviderforProximitysearch;
                        autocompleterequest.languageISOLetter = that.tgSettings.LanguageISOLetter;
                        that.latitude = 0;
                        that.longitude = 0;
                        $.ajax({
                            type: "POST",
                            url: "/TgNewUI/Search/Ajax/ProximityLocationAutoComplete",
                            data: autocompleterequest,
                            success: function (oRawData) {
                                if (!$scope.locationSearch.enterKeyHit && oRawData) {
                                    data = _.sort(_.map(oRawData.Options, function (item) {
                                        return {
                                            data: item,
                                            label: item.LocationName,
                                            value: item.LocationName
                                        }
                                    }), "label").slice(0, 10);
                                    $scope.locationSearch.autoCompleteResponse = _.pluck(data, "label");
                                    if ($scope.locationSearch.typeAheadConfig.typeAheadCallBack)//set dynamically in type ahead directive
                                        $scope.locationSearch.typeAheadConfig.typeAheadCallBack();
                                    response(data);
                                } else {
                                    response(null);
                                    if ($scope.locationSearch.enterKeyHit) {
                                        $scope.utils.cleanUpAutocompletes();
                                    }
                                    $scope.locationSearch.enterKeyHit = false;
                                }
                            }
                        });

                    } else {
                        autocompleterequest.searchString = request.term;
                        autocompleterequest.searchFields = that.locationFields;
                        $.ajax({
                            type: "POST",
                            url: "/TgNewUI/Search/Ajax/LocationAutoComplete",
                            data: autocompleterequest,
                            success: function (oRawData) {
                                if (!$scope.locationSearch.enterKeyHit && oRawData) {
                                    data = _.sort(_.pluck(oRawData.Options, "LocationName")).slice(0, 10);
                                    data = _.map(data, function (job) {
                                        job = job.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim();
                                        return job;
                                    });
                                    $scope.locationSearch.autoCompleteResponse = data;
                                    if ($scope.locationSearch.typeAheadConfig.typeAheadCallBack)//set dynamically in type ahead directive
                                        $scope.locationSearch.typeAheadConfig.typeAheadCallBack();
                                    response(data);
                                } else {
                                    response(null);
                                    if ($scope.locationSearch.enterKeyHit) {
                                        $scope.utils.cleanUpAutocompletes();
                                    }
                                    $scope.locationSearch.enterKeyHit = false;
                                }
                            }
                        });
                    }
                },
                select: function (event, ui) {
                    /*
                    * The select event firing two times,
                     * 1. when option is going to be selected.
                     * 2. After selection when list box is going to be closed.
                    */
                    if (!ui.item.value && $scope.bPowerSearchVisible) {
                        $scope.locationSearch.text = $scope.powerSearchLocationSearch.text;
                    } else {
                        if (bMapProvider && ui.item.data) {
                            that.latitude = ui.item.data.Latitude;
                            that.longitude = ui.item.data.Longitude;
                        }
                        if ($scope.locationSearch.enterKeyHit && ui.item.value != "" && ui.item.value != event.target.value) {
                            $scope.locationSearch.text = event.target.value;
                        } else if (ui.item.value && ui.item.value != "") {
                            $scope.locationSearch.text = ui.item.value;
                        } else if (event.target.value != "") {
                            $scope.locationSearch.text = event.target.value
                        } else {
                            $scope.locationSearch.text = $(event.toElement).text();
                        }
                        $scope.powerSearchLocationSearch.text = $scope.locationSearch.text;
                    }
                    $scope.$apply();

                    //Handled enter and tab key for selecting the item from the list.
                    if (event.originalEvent && (
                            (event.originalEvent.originalEvent && event.originalEvent.originalEvent.keyCode == $.keyCodes.tab) ||
                            (event.originalEvent.target.type == "" && event.originalEvent.keyCode == $.keyCodes.enter) ||
                            (event.originalEvent.type == "menuselect")
                        )
                    ) {
                        $scope.locationSearch.submitAfterSelection = false;
                        return;
                    } else if ($scope.locationSearch.submitAfterSelection) {
                        //Fetching job matched results for enter key press on textbox.
                        $scope.locationSearch.submitAfterSelection = false;
                        $scope.utils.cleanUpAutocompletes();
                        if ($scope.workFlow == "powerSearch") {
                            $(".powerSearchContainer").find("button.ladda-button").trigger("click");
                        } else {
                            $(".searchBoxContainer").find("button.ladda-button").trigger("click");
                        }
                    } else {
                        $scope.utils.cleanUpAutocompletes();
                    }
                },
                minLength: 1,
                freeFormSelect: true
            },
            autoCompleteResponse: [],
            typeAheadConfig: {
                source: function () {
                    $scope.locationSearch.enterKeyHit = false;
                    var aMatches = "";
                    _.each($scope.locationSearch.autoCompleteResponse, function (sHit) {
                        aMatches = $.matchWordOrPhrase(sHit, $scope.locationSearch.text);
                        if (aMatches)
                            return false;//break out of loop at first start word or phrase match
                    });
                    return aMatches;
                }
            },
            submit: function () {
                $scope.locationSearch.enterKeyHit = true;//This flag is used for stoping source binding for auto list, when immediately pressing enter with sometext on textbox. 
                $scope.locationSearch.submitAfterSelection = true;
            }
        },

        postingDate: {
            datepickerConfig: {
                showOn: "button",
                buttonText: appScope.dynamicStrings ? appScope.dynamicStrings.AriaLabel_CalButton : "Choose date from calendar",
                dateFormat: "m/d/yy",
                maxDate: 0,
                localeCode: response.ClientSettings.LocaleCode,
                shortMonthNames: $("#shortMonthNames").val(),
                onSelect: function (sDateText, oDatepicker) {
                    var selectedDate = oDatepicker.selectedYear + "/" + (oDatepicker.selectedMonth + 1) + "/" + oDatepicker.selectedDay;
                    var scope = angular.element(this).scope(),
                        oQuestion = angular.nearestScopeVal("question", scope);

                    if (sDateText === "")//clear icon clicked
                        selectedDate = "";

                    oQuestion.Value = selectedDate;
                }
            }
        },
        
        candStackingDate: {
            datepickerConfig: {
                showOn: "button",
                buttonText: appScope.dynamicStrings ? appScope.dynamicStrings.AriaLabel_CalButton : "Choose date from calendar",
                dateFormat: "yy-m-d",
                maxDate: 0,
                localeCode: response.ClientSettings.LocaleCode,
                shortMonthNames: $("#shortMonthNames").val(),
                onSelect: function (sDateText, oDatepicker) {
                    var selectedDate = oDatepicker.selectedYear + "-" + (oDatepicker.selectedMonth + 1) + "-" + oDatepicker.selectedDay;
                    if (sDateText === "")//clear icon clicked
                        selectedDate = "";

                    $scope.ProfileCandStackField = selectedDate;
                }
            }
        },

        dateRange: {
            datepickerConfig1: {
                datepickerConfig: {
                    showOn: "button",
                    buttonText: appScope.dynamicStrings ? appScope.dynamicStrings.AriaLabel_CalButton : "Choose date from calendar",
                    dateFormat: "m/d/yy",
                    maxDate: 0,
                    localeCode: response.ClientSettings.LocaleCode,
                    shortMonthNames: $("#shortMonthNames").val(),
                    onSelect: function (sDateText, oDatepicker) {
                        var selectedDate = sDateText ? oDatepicker.selectedYear + "/" + (oDatepicker.selectedMonth + 1) + "/" + oDatepicker.selectedDay : "",
                            scope = angular.element(this).scope(),
                            oQuestion = angular.nearestScopeVal("question", scope),
                            aValue = oQuestion.Value ? oQuestion.Value.split(",") : ["", ""];

                        aValue[0] = selectedDate;
                        if (!aValue[0] && !aValue[1])
                            oQuestion.Value = null;
                        else {
                            oQuestion.Value = aValue.join(",");
                            oQuestion.rangeValid = 1;
                        }
                    }
                }
            },
            datepickerConfig2: {
                datepickerConfig: {
                    showOn: "button",
                    buttonText: appScope.dynamicStrings ? appScope.dynamicStrings.AriaLabel_CalButton : "Choose date from calendar",
                    dateFormat: "m/d/yy",
                    maxDate: 0,
                    localeCode: response.ClientSettings.LocaleCode,
                    shortMonthNames: $("#shortMonthNames").val(),
                    onSelect: function (sDateText, oDatepicker) {
                        var selectedDate = sDateText ? oDatepicker.selectedYear + "/" + (oDatepicker.selectedMonth + 1) + "/" + oDatepicker.selectedDay : "",
                            scope = angular.element(this).scope(),
                            oQuestion = angular.nearestScopeVal("question", scope),
                            aValue = oQuestion.Value ? oQuestion.Value.split(",") : ["", ""];


                        aValue[1] = selectedDate;
                        if (!aValue[0] && !aValue[1])
                            oQuestion.Value = null;
                        else {
                            oQuestion.Value = aValue.join(",");
                            oQuestion.rangeValid = 1;
                        }
                    }
                }
            }
        },

        sortby: 0,

        jobsHeading: "",

        jobApplyUrl: "",

        completedSearchText: "",

        bInitialLoad: true,

        bSearchResults: false,

        bSidebarShown: false,

        bSidebarOverlay: false,

        bSidebarVisible: false,

        bJobDetailsShown: false,

        bSelectedGroup: false,

        bEditProfile: false,

        bJobCart: false,

        SavedSearchesMetaData: {},

        bFileManager: false,

        bJobRemovalStatus: false,

        bJobSaved: false,

        bGQLaunchedFromJobCart: false,

        bShowRemovedJobAlert: false,

        bShowExpiredJobAlert: false,

        bJobCartLaunchedFromHome: false,

        bJobCartLaunchedFromSearchResults: false,

        bJobCartLaunchedFromJobDetails: false,

        jobsCache: null,

        savedJobsCache: null,

        expiredJobs: null,

        JobsAddedToCart: null,

        JobsAlreadyPresentInCart: null,

        bJobsSavedExceeded: false,

        bNotAppliedJobsInJobCart: false,

        bAppliedJobsInJobCart: false,

        bCandidateZone: false,

        bStandAloneAssessView: false,

        isApplyflowLogin: true,

        bSignInView: false,

        showInFullView: false,

        bJobDetailsAPIError: false,

        bRefreshSession: false,

        SaveSearchCriteria: false,

        ProfileDetails: response != null ? response.BasicProfileDetails : {},

        CandidateZoneData: null,

        bFromTalentSuite: $("#talentSuiteJobMenu").attr("value") ? true : false,

        bLoggedIn: response.ClientSettings.LoggedIn == "true" ? true : false,

        bSearchAgentEnabled: response.ClientSettings.DisableAgents.toLowerCase() == "no",

        bHideBackButtonInJobDetails: $("#hideBackButtonOnly").val() == "1" ? true : false,

        bShowBackButton: $("#noback").val() == "0" ? false : true,

        userMarkupFields: ['jobdescription'],

        SIDValue: $("#SIDValue").val(),

        renderedFields: ["jobtitle", "addedon", "jobdescription"],

        jobFieldsToDisplay: response.JobFieldsToDisplay,

        bJobDescriptions: response.JobFieldsToDisplay ? !!response.JobFieldsToDisplay.Summary : false,

        jobs: response.searchResultsResponse ? response.searchResultsResponse.Jobs.Job : (response.HotJobs ? response.HotJobs.Job : null),

        featuredJobs: response.searchResultsResponse ? response.searchResultsResponse.Jobs.Job : (response.HotJobs ? response.HotJobs.Job : null),

        totalCount: response.TotalCount,

        tgSettings: response.ClientSettings,

        isGTG: response.IsGTG,

        jobCounterIntroText: response.TotalCount ? response.ClientSettings.JobCounterIntroText.replace("[#jobcount#]", response.TotalCount) : response.ClientSettings.JobCounterIntroText.replace("[#jobcount#]", 0),

        refineResultsText: response.ClientSettings.RefineResultsText,

        searchResultsText: response.ClientSettings.SearchResultsText,

        filtersAppliedText: response.ClientSettings.FiltersAppliedText,

        selectedJobValues: { "selectedJobs": "" },

        hitCount: 0,

        jobsCount: 0,

        latitude: 0,

        longitude: 0,

        geoLocationLatitude: 0,

        geoLocationLongitude: 0,

        bShowMoreButton: false,

        toggleCheckBoxes: false,

        SelectedJobsChecked: false,

        SelectJobs: response.ClientSettings.SelectJobsText,

        keywordFields: response.KeywordCustomSolrFields || preLoadSmartSearchResponse.KeywordCustomSolrFields,

        locationFields: response.LocationCustomSolrFields || preLoadSmartSearchResponse.LocationCustomSolrFields,

        hideAdvancedSearch: (response.ClientSettings.HideAdvancedSearch.toLowerCase() == "yes") ? true : false,

        sortFields: "",

        pageNumber: 1,

        sendToFriendButtonText: (response.ClientSettings.SearchResultsSendToFriendButtonText != "") ? response.ClientSettings.SearchResultsSendToFriendButtonText : $scope.dynamicStrings.JobDetails_SendToFriend,

        welcomeTitle: response.ClientSettings.LoggedIn == "true" ? response.ClientSettings.LandingLoggedWelcomePageTitle : response.ClientSettings.LandingNonLoggedWelcomePageTitle,

        nonLoggedInWelcomeTitle: response.ClientSettings.LandingNonLoggedWelcomePageTitle,

        welcomeText: response.ClientSettings.LoggedIn == "true" ? response.ClientSettings.LandingLoggedWelcomeText : response.ClientSettings.CandLandPageText,

        bWelcome: (response.ClientSettings.LandingNonLoggedWelcomePageTitle != undefined || response.ClientSettings.CandLandPageText != undefined) ? true : false,

        regexEquation: (response.ClientSettings.LoginType == 0) ? /^[a-zA-Z0-9ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ!#$%&'\/*\/+-\/\/\/=\/?\/^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/ : /^[\u0021-\u003b=\u003f-\u007e\u009f-\uffff\s]+$/,

        regexUsernameEqn: /^[\u0021-\u003b=\u003f-\u007e\u009f-\uffff\s]+$/,

        regexPhonenumberEqn: /^((\d|-|\.){5,})$/,

        regexNoHtml: /^(?!.*<.*>)/,

        regexNameEqn: /[^0-9\[\]!#\$%&\*\+/:; _<=>\?@\\\\-\^\{\|\}~]+$/,
        ///^[a-zA-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ ,.'-]+$/,  

        regexUserEmailEqn: /^[a-zA-Z0-9ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ!#$%&'\/*\/+-\/\/\/=\/?\/^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/,

        facets: response.Facets ? _.each(response.Facets.Facet, function (facet) {
            _.each(facet.Options, function (opt) {
                opt.Selected = false;
            });
        }) : null,

        previousHashes: [],

        facetOptionLimit: 4,

        powerSearchQuestions: [],

        oldPowerSearchQuestions: [],

        bPowerSearchVisible: false,
        preloadPowerSearch: false,

        filterAppliedCount: 0,

        enableSocialReferral: response.ClientSettings.EnableSocialReferral.toLowerCase() == "yes" ? true : false,

        enableSendToFriend: response.ClientSettings.SendToFriend.toLowerCase() == "yes" ? true : false,

        enableApplyToJobs: response.ClientSettings.Responsive && response.ClientSettings.Responsive.toLowerCase() == "true" ? false : true,

        LoginBoxUsername: response.ClientSettings.LoginType == "0" ? $scope.dynamicStrings.EmailAddress : $scope.dynamicStrings.Username,

        disableJobCart: response.ClientSettings.DisableJobCart.toLowerCase() == "yes" ? true : false,

        maxConReqSubmission: response.ClientSettings.MaxConReqSubmission == "" ? 10 : parseInt(response.ClientSettings.MaxConReqSubmission),

        SocialReferral_READY: response.ClientSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no",

        SocialReferral_FirstName: encodeURIComponent(response.ClientSettings.SocialReferral_FirstName),

        SocialReferral_LastName: encodeURIComponent(response.ClientSettings.SocialReferral_LastName),

        SocialReferral_SiteId: $("#siteId").val(),

        SocialReferral_LocaleId: response.ClientSettings.DefLocaleId,

        SocialReferral_ProfileId: response.ClientSettings.profileId,

        jobIds: "",

        jobRestrictedJobSelected: false,

        SelectedJobsChecked: false,

        scrollStart: true,

        timeOut: "",

        featuredOrLatestJobsAjax: null,

        keywordTextTemp: "",

        locationTextTemp: "",

        encryptedBruid: (response.EncryptedBruid) ? response.EncryptedBruid : "",

        hashCode: (response.HashCode) ? response.HashCode : "",

        ///Job Details section added

        jobDetailsFieldsToDisplay: "",
        jobDetailFields: "",
        isHotJob: false,
        enableJobDetailsSendToFriend: false,
        enablePostToMySocialNetwork: false,
        jobDetailsUrlForSocialMedia: "",
        jobIds: "",
        jobDetailsButtonText: "",
        searchResultsURL: "",
        fileStatus: 0,
        profileImportStatus: 0,

        createAccount:
            {
                bSocialNetwork: false,
                login: {
                    userName: '',
                    password: '',
                    confirmPassword: '',
                },
                securityQuestion:
                {
                    value1: '',
                    value2: '',
                    value3: '',
                    answer1: '',
                    answer2: '',
                    answer3: '',
                    errorValue1: false,
                    errorValue2: false,
                    errorValue3: false,
                    errorAnswer1: false,
                    errorAnswer2: false,
                    errorAnswer3: false
                },
                errormsgs: [],
                displayPasswordErrorBox: false,
                displayRePasswordErrorBox: false,
                passwordTooltipVisible: false,
                reenterPassowrdTooltipVisible: false,
                userNameError: false,
                passwordError: false,
                mainError: '',
                submitted: false,
                CAsubmitted1: false,
                CAsubmitted2: false,
                CAsubmitted3: false,

                //noOfSecurityQuestions: response.ClientSettings.LoginDetailsManagement && response.ClientSettings.LoginDetailsManagement.toLowerCase() == 'default' ? 1 : response.ClientSettings.TGSecurityQuestionOverride,
                noOfSecurityQuestions: (response.ClientSettings.TGSecurityQuestionOverride == '' || response.ClientSettings.TGSecurityQuestionOverride == null) ? (response.ClientSettings.LoginDetailsManagement && response.ClientSettings.LoginDetailsManagement.toLowerCase() == 'default' ? 1 : 3) : response.ClientSettings.TGSecurityQuestionOverride,
                showForgotPasswordLink: false
            },


        resetcreatAccount: function ($scope) {
            $scope.createAccount.bSocialNetwork = false;
            $scope.createAccount.login.userName = '';
            $scope.createAccount.login.password = '';
            $scope.createAccount.login.confirmPassword = '';
            $scope.createAccount.securityQuestion.value1 = '';
            $scope.createAccount.securityQuestion.value2 = '';
            $scope.createAccount.securityQuestion.value3 = '';
            $scope.createAccount.securityQuestion.answer1 = '';
            $scope.createAccount.securityQuestion.answer2 = '';
            $scope.createAccount.securityQuestion.answer3 = '';
            $scope.createAccount.securityQuestion.errorValue1 = false;
            $scope.createAccount.securityQuestion.errorValue2 = false;
            $scope.createAccount.securityQuestion.errorValue3 = false;
            $scope.createAccount.securityQuestion.errorAnswer1 = false;
            $scope.createAccount.securityQuestion.errorAnswer2 = false;
            $scope.createAccount.securityQuestion.errorAnswer3 = false;
            $scope.createAccount.errormsgs = [];
            $scope.createAccount.displayPasswordErrorBox = false;
            $scope.createAccount.displayRePasswordErrorBox = false;
            $scope.createAccount.passwordTooltipVisible = false;
            $scope.createAccount.reenterPassowrdTooltipVisible = false;
            $scope.createAccount.userNameError = false;
            $scope.createAccount.passwordError = false;
            $scope.createAccount.mainError = '';
            $scope.createAccount.submitted = false;
            $scope.createAccount.noOfSecurityQuestions = (response.ClientSettings.TGSecurityQuestionOverride == '' || response.ClientSettings.TGSecurityQuestionOverride == null) ? (response.ClientSettings.LoginDetailsManagement && response.ClientSettings.LoginDetailsManagement.toLowerCase() == 'default' ? 1 : 3) : response.ClientSettings.TGSecurityQuestionOverride;
            $scope.createAccount.showForgotPasswordLink = false;
            setTimeout(function () { $scope.$apply(); }, 0);
        },

        bcreateAccount: false,
        securityQuestionsArray: _.values(JSON.parse(securityQuestions.value || "{}")) || [],
        //End of JobDetails fileds

        updateAccount:
        {
            login: {
                userName: '',
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            },
            errormsgs: [],
            displayPasswordErrorBox: false,
            displayRePasswordErrorBox: false,
            mainError: '',
            updated: '',
            submitted: false,
            LIOption: 1,
            FBOption: 1,
            LINewOption: 1,
            FBNewOption: 1,
            LIConnect: false,
            FBConnect: false,
            TWConnect: false,
            SMUpdateStatus: 0,
            SMUpdateError: ''
        },

        autocompleteConfig: {
            aData: [],
            sId: "autocompleteMenu",
            fnItemClickHandler: function (event, scope) {
                //that.searchText = scope.oItem;
                scope.searchText = scope.oItem;
                setTimeout(function () { scope.$apply(); }, 0);
            }
        },

        handlers: {

            trapHeaderLinkFocus: function (scope, bVisible, e) {
                var $headerLinkContainer = scope.elements.headerLinkContainer;

                if (bVisible) {
                    $headerLinkContainer.css("visibility", "visible");
                    scope.elements.headerLinkContainer.trapFocus().keydown(toggle);
                } else {
                    off();
                }

                function toggle(e) {
                    if (e.keyCode == $.keyCodes.escape) {
                        scope.elements.threeLineIcon.click();
                    } else {
                        return true;
                    }
                }

                function off() {
                    scope.elements.headerLinkContainer.off("keydown");
                    scope.elements.threeLineIcon.focus();//note that this automatically untraps focus
                    setTimeout(function () {
                        //use css visibility property to get header links out of the tab order when offscreen    
                        if (appScope.$root.uiBooleans['bPhoneViewLinksVisible'] == false) {
                            $headerLinkContainer.css("visibility", "hidden");
                        }
                    }, 800)//a rare case where a numeric timeout is OK since all we care about is that animation is complete
                }
            },

            more: function (scope, Q, $p) {
                var h;
                var linkTitle = $p.parents('.job').find('.jobtitle').html();
                $p.html(scope.$root.utils.fullMarkup(Q, linkTitle));
                $p.find('*').removeAttr('style');
                var curWindowHeight = $(window).height();
                var winCenter = 0;
                winCenter = $p.offset().top - Math.ceil(curWindowHeight / 2);
                _.delay(function () {
                    h = $p.height();
                    $p.css({ top: -24, height: 48 }).animate({ top: 0, height: h }).setFocus();
                    //To make the current job view at center of the screen.
                    $('html, body').stop().animate({ scrollTop: winCenter }, 300);
                });
            },

            less: function (scope, Q, $p) {
                $p.animate({ height: 48, top: -24 }, 400, function () {
                    $p.html(scope.$root.utils.truncatedMarkup(Q));
                    $p.find('*').removeAttr('style');
                    scope.$root.utils.moreLink(scope, $p);
                    scope.$apply();
                    $p.css({ height: "auto", top: 0 });
                }).setFocus().find(".less").css({ visibility: "hidden" });

            },


            jobClick: function (event, scope) {
                var Q = scope.oQ,
                    $target = $(event.target),
                    $p = $target.closest("p");
                //To hanlde #tag while accessing more/less job description view.
                var descViewAccessed = false;

                if ($target.parent().hasClass("more")) {
                    scope.handlers.more(scope, Q, $p);
                    descViewAccessed = true;
                }

                if ($target.hasClass("less")) {
                    scope.handlers.less(scope, Q, $p);
                    descViewAccessed = true;
                }

                if (descViewAccessed == true) {
                    event.preventDefault();
                    descViewAccessed = false;
                }

                if ($target.closest(".jobtitle").length || $target.closest(".noJobDescriptions .job").length || window.innerWidth <= 480 || window.screen.width <= 480) {
                    $scope.SelectJobs = $scope.tgSettings.SelectJobsText;
                    if (!$scope.bJobCart) {
                        $scope.toggleCheckBoxes = false;
                        $scope.SelectedJobsChecked = false;
                        _.each($scope.jobs, function (job) {
                            job.Selected = false;
                        });
                    }
                    scope.handlers.jobTitle(scope);
                }
            },

            jobTitle: function (scope) {
                $scope.ShowJobAlert = true;
                $scope.bJobSaved = false;
                $scope.bJobDetailsAPIError = false;
                //scope.saveSearchCriteria();
                //window.location = "../home/JobDetails?partnerId=" + $("#partnerId").val() + "&siteId=" + $("#siteId").val() + 
                //"&JobId=" + scope.job.Questions[0].Value + "&JobSiteId=" + _.pluck(_.where(scope.job.Questions, { "QuestionName": "siteid" }), "Value").toString() + "&configMode=" + $("#configMode").val() //, "JobDetails", 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                var url = '/TgNewUI/Search/Ajax/JobDetails',
                    jobDetailsRequest = {};

                var jobId = scope.job.Questions[0].Value;
                var jobSiteId = _.pluck(_.where(scope.job.Questions, { "QuestionName": "siteid" }), "Value").toString();
                jobDetailsRequest.partnerId = $("#partnerId").val();
                jobDetailsRequest.siteId = $("#siteId").val();
                jobDetailsRequest.jobid = jobId;
                jobDetailsRequest.configMode = $("#configMode").val();
                jobDetailsRequest.jobSiteId = jobSiteId;

                $scope.jobDetailsJobShown = jobDetailsRequest.jobid;

                $http.post(url, jobDetailsRequest).success(function (data, status, headers, config, bFromHistory) {
                    $scope.LimitExceededMessage = data.ServiceResponse.LimitExceededMessage;
                    $scope.ApplyDifference = data.ServiceResponse.ApplyDiff;
                    $scope.AllowReApply = data.ServiceResponse.ApplyStatus != null ? data.ServiceResponse.ApplyStatus.AllowReApply : true;
                    $scope.Applied = data.ServiceResponse.ApplyStatus != null ? data.ServiceResponse.ApplyStatus.Applied : false;
                    $scope.jobDetailsFieldsToDisplay = data.ServiceResponse.JobFieldsToDisplay,
                    $scope.encryptedBruid = data.ServiceResponse.EncryptedBruid,
                    $scope.hashCode = data.ServiceResponse.HashCode,
                    $scope.jobDetailFields = data.ServiceResponse.Jobdetails,
                    $scope.isHotJob = _.pluck(_.where(data.ServiceResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "hotjob" }), "AnswerValue").toString().toLowerCase() == "yes",
                    $scope.enableJobDetailsSendToFriend = $scope.tgSettings.SendToFriend.toLowerCase() == "yes" ? true : false,
                    $scope.enablePostToMySocialNetwork = $scope.tgSettings.EnablePostToMySocialNetworkLink.toLowerCase() == "yes" && $scope.tgSettings.SocialMedia != "" ? true : false,
                    $scope.jobDetailsUrlForSocialMedia = $("#pageURL").val() + "/tgwebhost/jobdetails.aspx?jobid=" + _.pluck(_.where(data.ServiceResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "reqid" }), "AnswerValue").toString() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&type=mail&JobReqLang=" + $scope.tgSettings.DefLanguageId + "&JobSiteId=" + _.pluck(_.where(scope.job.Questions, { "QuestionName": "siteid" }), "Value") + "&gqid=" + _.pluck(_.where(data.ServiceResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "gqid" }), "AnswerValue").toString(),
                    $scope.jobDetailsButtonText = $scope.tgSettings.JobDetailsSendToFriendButtonText != "" ? $scope.tgSettings.JobDetailsSendToFriendButtonText : $scope.dynamicStrings.JobDetails_SendToFriend,
                    $scope.searchResultsURL = "";
                    that.bSidebarVisible = false;
                    that.bInitialLoad = false;
                    that.bJobDetailsShown = true;
                    $scope.jobSiteInfo = jobId + '_' + jobSiteId;
                    $scope.bJobSaved = false;
                    $scope.JobDetailQuestionsSocialShare = data.ServiceResponse.Jobdetails.JobDetailQuestions;
                    $("#title").nextAll('meta').remove();
                    setTimeout(function () {
                        $scope.$apply();
                    }, 0);
                    var metaTag = $scope.tgSettings.JobDetailsMetaTagText.replace(/#ClientName#/g, $scope.tgSettings.PartnerName);
                    var jobdesc = "";
                    var jobtitl = "";
                    if (data.ServiceResponse.Jobdetails != null) {
                        jobdesc = _.pluck(_.where(data.ServiceResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "jobdescription" }), "AnswerValue").toString();
                        jobdesc = jobdesc.replace(/<(.|\n)*?>/g, "").replace("\"", "&quot;");
                        if (jobdesc.length > 50) {
                            jobdesc = jobdesc.substring(0, 50);
                        }
                        jobtitl = data.ServiceResponse.Jobdetails.Title.toString();
                        jobtitl = jobtitl.replace(/<(.|\n)*?>/g, "").replace("\"", "&quot;");
                        if (jobtitl.length > 50) {
                            jobtitl = jobtitl.substring(0, 50);
                        }
                    }
                    metaTag = metaTag.replace("#JobDescription#", jobdesc);
                    $("#title").after(metaTag.replace("#JobTitle#", jobtitl));

                    //if ($scope.tgSettings.ShowSocMediaButtonsOnJobDetailsPage == 'yes') {
                    //  $scope.handlers.JobdetailSocialShare();
                    //}
                    setTimeout(function () {
                        $scope.$apply();
                    }, 0);
                    setTimeout(function () {
                        $scope.setHash(bFromHistory, arguments, this);
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                    }, 10);
                }).error(function (data, status, headers, config) {
                    console.log("failed with status of " + status);
                });

                $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/JobDetails");
            },
            JobdetailSocialShare: function () {
                if ($scope.tgSettings.ShowSocMediaButtonsOnJobDetailsPage == 'yes') {
                    if ($scope.tgSettings.SocialMedia.indexOf('1') > -1) {
                        if (typeof (IN) != 'undefined') {
                            $('.linkedin').html("<script type='IN/Share' data-counter='right' data-url='" + $scope.jobDetailsUrlForSocialMedia + "'></script>");
                            IN.parse();
                        } else {
                            if ($("#pageURL").val().indexOf("https://") > -1) {
                                $.getScript('https://platform.linkedin.com/in.js', function () {
                                    $('.linkedin').html("<script type=IN/Share data-counter='right' data-url='" + $scope.jobDetailsUrlForSocialMedia + "'></script>");
                                });
                            }
                            else {
                                $.getScript('http://platform.linkedin.com/in.js', function () {
                                    $('.linkedin').html("<script type=IN/Share data-counter='right' data-url='" + $scope.jobDetailsUrlForSocialMedia + "'></script>");
                                });
                            }

                        }
                    }
                    if ($scope.tgSettings.SocialMedia.indexOf('2') > -1) {

                        if (typeof (FB) != 'undefined') {
                            $('.facebook').html("<fb:like href='" + $scope.jobDetailsUrlForSocialMedia + "' send='false' layout='button_count' show_faces='false' font=''></fb:like>");
                            FB.init({ status: true, cookie: true, xfbml: true, version: 'v2.8' });

                        } else {
                            if ($("#pageURL").val().indexOf("https://") > -1) {
                                $.getScript("https://connect.facebook.net/en_US/sdk.js", function () {
                                    $('.facebook').html("<fb:like href='" + $scope.jobDetailsUrlForSocialMedia + "' send='false' layout='button_count' show_faces='false' font=''></fb:like>");
                                    FB.init({ status: true, cookie: true, xfbml: true, version: 'v2.8' });
                                });
                            }
                            else {
                                $.getScript("http://connect.facebook.net/en_US/sdk.js", function () {
                                    $('.facebook').html("<fb:like href='" + $scope.jobDetailsUrlForSocialMedia + "' send='false' layout='button_count' show_faces='false' font=''></fb:like>");
                                    FB.init({ status: true, cookie: true, xfbml: true, version: 'v2.8' });
                                });
                            }
                        }
                    }
                    if ($scope.tgSettings.SocialMedia.indexOf('3') > -1) {
                        if (typeof (twttr) != 'undefined') {
                            $('.Twitter').html("<a href='https://twitter.com/share' class='twitter-share-button' data-url='" + $("#pageURL").val() + "/tgwebhost/jobdetails.aspx?jobid=" + _.pluck(_.where($scope.JobDetailQuestionsSocialShare, { "VerityZone": "reqid" }), "AnswerValue").toString() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&type=mail" + "' data-count='horizontal' data-lang='" + $scope.tgSettings.DefLocaleId + "'>Tweet</a>");
                            twttr.widgets.load();
                        } else {
                            $('.Twitter').html("<a href='https://twitter.com/share' class='twitter-share-button' data-url='" + $("#pageURL").val() + "/tgwebhost/jobdetails.aspx?jobid=" + _.pluck(_.where($scope.JobDetailQuestionsSocialShare, { "VerityZone": "reqid" }), "AnswerValue").toString() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&type=mail" + "' data-count='horizontal' data-lang='" + $scope.tgSettings.DefLocaleId + "'>Tweet</a><script type='text/javascript' src='https://platform.twitter.com/widgets.js'></script>");
                        }
                    }
                }
            },
            jobDetailsBackClick: function (scope) {
                // $scope.jobDetailFields = null;
                if (typeof previousHashes[previousHashes.length - 2] == "undefined") {
                    $scope.homeView();
                }
                else
                    history.back();
            },

            jobDetailsBackToSaveDrafts: function (scope) {
                document.location.href = "/tgwebhost/aip.aspx?sid=" + $("#SIDValue").val();
            },

            selectedCloseClickHandler: function (event, scope) {
                $(event.target).parent().deleteWithBounce(function () {
                    scope.op.Selected = false;
                    scope.filterJobsByFacet(scope);
                    scope.$apply();
                })
            },

            selectedPowerSearchOptionCloseClickHandler: function (event, scope) {
                $(event.target).parent().deleteWithBounce(function () {
                    _.remove(angular.nearestScopeVal("question.selectedOptions", scope), scope.op);
                    scope.$apply();
                });
            },

            hideShowFacetOptions: function (event, scope) {
                $scope.bRenderFacetFilterAccordion = true;

                setTimeout(function () {
                    var $target = $(event.target),
                        $accordionContainer = $scope.elements.facetFilterAccordion,
                        bAccordion = !!($accordionContainer && $accordionContainer.length),
                         sId = $target.parent().attr('name'),
                        $facetWithOptions;

                    if (bAccordion) {

                        if (sId) {
                            //show only the options for the category selected
                            $accordionContainer.find(".facetFilterAccordionOptions #" + sId).show().siblings("li").hide();
                            $scope.oActiveFacet = scope.facet;
                        }

                        //erase any inline styles left over from slideToggle in toggleFilterFacetAccordion
                        $scope.elements.facetFilterAccordionOptions[0].style.display = "";

                        if (!$scope.bShowFacetAccordionOptions) {
                            $scope.bShowFacetAccordionOptions = true;
                            scope.$apply();
                        }
                        else {
                            //set the left style inline to trigger animation
                            //NOT bShowFacetAccordionOptions = true --> ng-class --> .showOptions class added
                            //that would hide the options immediately and mess up the animation
                            $accordionContainer.css("left", "0");

                            setTimeout(function () {
                                //wait until animation complete
                                //not as accurate as the currently poorly supported transition end event
                                //but we don't need much accuracy here -- just want to avoid swiping to hidden content
                                //please refer to qc defect 238620 LDP251: Mobile: Swipes are moving views between facet filters and filter options
                                //$accordionContainer.removeClass("showOptions");
                                $scope.bShowFacetAccordionOptions = !$scope.bShowFacetAccordionOptions;
                                scope.$apply();
                                //erase the inline style
                                $scope.elements.facetFilterAccordion[0].style.left = "";
                            }, 650);

                        }
                    } else {
                        //in sidebar
                    }
                }, 0)
            },

            toggleFilterFacetAccordion: function (event, scope) {
                var $accordion = $scope.bShowFacetAccordionOptions ? $scope.elements.facetFilterAccordionOptions.add($scope.elements.facetFilterAccordionCategories) : $scope.elements.facetFilterAccordionCategories;

                $scope.$root.bRenderFacetFilterAccordion = true;
                $scope.$root.bShowFilterAccordion = !$scope.$root.bShowFilterAccordion;
                setTimeout(function () {//give the lazy loaded options container div time to render
                    $accordion.slideToggle(null, $scope.handlers.clipAccordionHeight);

                }, 0)
            },

            clipAccordionHeight: function () {
                var bClip, $accordion, y;

                if ($scope.bShowFilterAccordion) {
                    $accordion = $scope.bShowFacetAccordionOptions ? $scope.elements.facetFilterAccordionOptions : $scope.elements.facetFilterAccordionCategories;
                    y = $accordion.offset().top + $accordion.height();
                    bClip = y > $(window).height();
                }

                if (bClip) {
                    $scope.bHideMainJobList = true;
                    $scope.bPinFacetArrow = true;
                } else {
                    $scope.bHideMainJobList = false;
                    $scope.bPinFacetArrow = false;
                }

                setTimeout(function () { $scope.$apply(); });

            },

            togglePhoneViewSearch: function () {
                $scope.bRenderPhoneViewSearch = true;
                $scope.bPhoneViewSearchVisible = !$scope.bPhoneViewSearchVisible;
                setTimeout(function () {

                    function hideOnEscape(e) {
                        if (e.keyCode == $.keyCodes.escape) {
                            $scope.handlers.togglePhoneViewSearch();
                            $(".searchBoxContainer").off("keydown", hideOnEscape);
                        }
                    }
                    $("#mobileSearchbox").children().slideToggle();
                    if ($scope.bPhoneViewSearchVisible) {
                        $(".searchBoxContainer").trapFocus().keydown(hideOnEscape);
                    }
                    else {
                        $(".searchBoxContainer").untrapFocus();
                    }
                })
            },

            clearAllFacetOptions: function () {
                _.each($scope.facets, function (facet) {
                    _.each(facet.Options, function (oOption) {
                        oOption.Selected = false;
                    });
                    facet.SelectedCount = 0;
                });
                $scope.filterJobsByFacet(null, $scope.oActiveFacet);
            },
            clearCurrentFacetOptions: function () {
                _.each($scope.oActiveFacet.Options, function (oOption) {
                    oOption.Selected = false;
                });
                $scope.oActiveFacet.SelectedCount = 0;
                $scope.filterJobsByFacet(null, $scope.oActiveFacet);
            },
            toggleAdvancedOptions: function (e, scope) {
                var $target = $(e.target).focus().toggleClass("open"),
                    $textSpan = $target.children();

                $target.closest("li").find("p").slideToggle();
                if ($target.hasClass("open"))
                    $textSpan.text($textSpan.attr("open-text"));
                else
                    $textSpan.text($textSpan.attr("closed-text"));
            }
        },

        formatters: {
            addedon: function (val) {
                var B_DAYS_AGO = false

                //retaining days ago format logic
                //currently not part of design
                if (B_DAYS_AGO) {
                    var nDaysAgo = Math.round((new Date - new Date(val)) / (360000 * 24));
                    if (nDaysAgo == 0)
                        return "Today";
                    else if (nDaysAgo == 1)
                        return "Yesterday"
                    else if (nDaysAgo > 30)
                        return "30+ days ago";
                    else
                        return nDaysAgo + " days ago";
                }

                //month day format
                var asDate = new Date(val).toString().split(" ");
                return asDate[1] + " " + _.parseInt(asDate[2]);
            },
            jobdescription: function (val, oQ) {
                oQ.OriginalValue = oQ.OriginalValue || oQ.Value;
                return $scope.$root.utils.truncatedMarkup(oQ);
            }
        },

        formatWrapper: function (scope, fnFormatter) {
            return scope.oQ.Value = fnFormatter.call(scope, scope.oQ.Value, scope.oQ);
        },

        getName: function (scope) {
            return (scope.job.RenderedFields[scope.$index] || {}).ClassName
        },
        updateHeading: function (jobsType) {
            jobsType = jobsType ? jobsType.toLowerCase() : "";
            $scope.hotJobsType = jobsType;
            if (jobsType == "jobsnearme") {
                $scope.jobsHeading = response.ClientSettings.JobsNearMeText;
            }
            else if (jobsType == "featuredjobs" || (response.HotJobs && response.HotJobs.Job && response.HotJobs.Job.length && !jobsType)) {
                $scope.jobsHeading = response.ClientSettings.FeaturedJobsText;
            }
            else if (jobsType == "mostrecentjobs") {
                $scope.jobsHeading = response.ClientSettings.MostRecentJobsText;
            }
            _.delay(function () {
                $scope.$apply();
            });
        },
        showFeaturedJobsOrLatestJobs: function () {
            clearTimeout($scope.timeOut);
            var FeaturedJobsrequest = {};
            FeaturedJobsrequest.partnerId = $("#partnerId").val();
            FeaturedJobsrequest.siteId = $("#siteId").val();
            $scope.featuredOrLatestJobsAjax = $.ajax({
                success: function (data, status, jqxhr) {
                    that.jobs = data.Jobs.Job;
                    that.featuredJobs = data.Jobs.Job;
                    that.$apply();
                    $scope.updateHeading(data.JobsType);

                    if ($.sizeThisFrame)
                        $.sizeThisFrame();
                },
                error: function (jqxhr, status, error) {
                },
                url: '/TgNewUI/Search/Ajax/FeaturedJobsOrLatestJobs',
                data: FeaturedJobsrequest,
                type: 'POST'
            });
        },

        showJobsNearMe: function (position) {
            clearTimeout($scope.timeOut);
            var JobsNearMeRequest = {};
            JobsNearMeRequest.partnerId = $("#partnerId").val();
            JobsNearMeRequest.siteId = $("#siteId").val();
            JobsNearMeRequest.latitude = position.coords.latitude;
            JobsNearMeRequest.longitude = position.coords.longitude;
            that.geoLocationLatitude = position.coords.latitude;
            that.geoLocationLongitude = position.coords.longitude;
            $scope.featuredOrLatestJobsAjax = $.ajax({
                success: function (data, status, jqxhr) {
                    that.jobs = data.Jobs.Job;
                    that.featuredJobs = data.Jobs.Job;
                    that.jobsCount = data.Jobs.Job.length;
                    that.$apply();
                    $scope.updateHeading(data.JobsType);

                    if ($.sizeThisFrame)
                        $.sizeThisFrame();
                },
                error: function (jqxhr, status, error) {
                },
                url: '/TgNewUI/Search/Ajax/JobsNearMe',
                data: JobsNearMeRequest,
                type: 'POST'
            });
        },

        showInitialJobs: function (bfromHistory) {
            $scope.bCreateAccount = false;
            $scope.bPrivacyPages = false;
            $scope.bSelectedGroup = false;
            $scope.bJobCart = false;
            $scope.sortby = 0;
            $scope.login.ForgotPass = bfromHistory == false ? $scope.login.ForgotPass : false;
            that.bPowerSearchVisible = false;
            that.getPowerSeachInputId = function (scope) {
                return scope.question.QuestionType + (scope.QId || "") + "_" + scope.$id;
            }
            that.bInitialLoad = true;
            if ($("#pageType").val() != "") {
                that.powerSearchQuestions = response.PowerSearchQuestions != null ? response.PowerSearchQuestions.Questions : "";
                $scope.TranslatePowerSearchQuestions(that.powerSearchQuestions);
                if (preLoadSmartSearchResponse.PowerSearchOptions != null) {
                    _.forEach(that.powerSearchQuestions, function (aQuestion) {
                        var powerSearchOption = _(preLoadSmartSearchResponse.PowerSearchOptions.PowerSearchOption).where({ VerityZone: aQuestion.VerityZone }).value();

                        if (aQuestion.IsAutoComplete) {
                            _.forEach(_.pluck(powerSearchOption, "OptionCodes")[0], function (option) {
                                var selectedOption = _.find(aQuestion.Options, function (questionOption) {
                                    return questionOption.OptionName.toLowerCase() == option.toLowerCase();
                                });//_.forEach(, function (questionOption) { return _(questionOption).where({ "OptionName": option }).value() });
                                if (selectedOption != undefined)
                                    selectedOption.Selected = true;
                            });
                        }
                        else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                            aQuestion.Value = _.pluck(powerSearchOption, "Value")[0];
                        }
                        else {
                            _.forEach(_.pluck(powerSearchOption, "OptionCodes")[0], function (option) {
                                var selectedOption = _.find(aQuestion.Options, function (questionOption) {
                                    return questionOption.OptionName.toLowerCase() == option.toLowerCase();
                                });//_.forEach(, function (questionOption) { return _(questionOption).where({ "OptionName": option }).value() });
                                if (selectedOption != undefined)
                                    selectedOption.Selected = true;
                            });
                        }
                    });
                }

                if ($("#pageType").val().toLowerCase() == "advancedsearch") {
                    that.bPowerSearchVisible = true;
                    that.preloadPowerSearch = true;
                    $scope.bLoggedIn = response.LoggedIn;
                    $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/AdvancedSearch");
                }
                else if ($("#pageType").val().toLowerCase() == "jobcart") {
                    $scope.bLoggedIn = true;
                    if (response.ResponsiveCandidateZone) {
                        $scope.bCandidateZone = true;
                        $scope.bresponsiveCandidateZone = true;
                        $scope.bJobCartLaunchedFromHome = true;
                        $scope.renderDashBoard(response.DashboardData, 1, 1);
                    }
                    else {

                        $scope.bJobCartLaunchedFromHome = true;
                        $scope.renderJobCart(response.JobCartResponse);
                    }

                }
                else if ($("#pageType").val().toLowerCase() == "saveddrafts" && response.ResponsiveCandidateZone) {
                    $scope.bLoggedIn = true;
                    $scope.bresponsiveCandidateZone = true;
                    $scope.bCandidateZone = true;
                    $scope.renderDashBoard(response.DashboardData, 2, $scope.enumForDashBoardActiveSection.UnfinishedApplications);
                }
                else if ($("#pageType").val().toLowerCase() == "assessments" && response.ResponsiveCandidateZone) {



                    $scope.bLoggedIn = true;
                    $scope.bSignInView = false;
                    $scope.bSearchResults = false;
                    $scope.bJobDetailsShown = false;
                    $scope.bSidebarVisible = false;
                    $scope.bSidebarShown = false;
                    $scope.bSidebarOverlay = false;
                    $scope.bPowerSearchVisible = false;
                    $scope.bJobCart = false;
                    $scope.bSelectedGroup = false;

                    $scope.bCreateAccount = false;
                    $scope.bEditProfileEditMode = false;
                    $scope.savedSearchActionCompletion = 0;
                    $scope.searchResultsFromSavedSearch = null;

                    $scope.bCandidateZone = true;
                    $scope.bresponsiveCandidateZone = true;
                    $scope.candidatezoneSubView = 'ResponsiveAssessment';
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "Assessments";
                    $scope.setTitle("Assessments");
                    $scope.bInitialLoad = false;
                    $scope.PendingAssessmentsUrl = "/TgNewUI/CandidateZone/Ajax/ViewAssessments?q=" + $.queryParams().q;
                    $scope.PendingAssessments = response.PendingAssessments.PendingAssessments;

                    // $scope.renderAssessments("/TgNewUI/CandidateZone/Ajax/ViewAssessments?q=" + $queryParams().q);
                    $timeout(function () {
                        $scope.$apply();
                        $scope.alignCards("AssesmentsCards", "jobCard");
                    }, 1000);

                }
                else {
                    that.bInitialLoad = false;
                    if ($("#pageType").val().toLowerCase().indexOf("selectedgroup") >= 0) {
                        $scope.SelectedGroupAjax($("#partnerId").val(), $("#siteId").val());
                        $scope.bLoggedIn = true;
                        $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/SelectedGroup");
                    } else {
                        that.preloadPowerSearch = true;
                        that.bSearchResults = true;
                        that.bSidebarShown = true;
                        that.bSidebarVisible = true;

                    }

                    $scope.encryptedBruid = response.EncryptedBruid;
                    $scope.hashCode = response.HashCode;                    
                    if (response.searchResultsResponse.Facets) {
                        that.facets = response.searchResultsResponse.Facets.Facet;
                    }
                    else
                        that.facets = null;
                    that.pageNumber = 1;
                    var searchCriteria = "";
                    if (preLoadSmartSearchResponse.Keyword) {
                        searchCriteria = preLoadSmartSearchResponse.Keyword;
                        $scope.keyWordSearch.text = preLoadSmartSearchResponse.Keyword;
                    }
                    else {
                        $scope.keyWordSearch.text = "";
                    }
                    that.keywordFields = preLoadSmartSearchResponse.KeywordCustomSolrFields;
                    if (preLoadSmartSearchResponse.Location) {
                        searchCriteria += ("," + preLoadSmartSearchResponse.Location);
                        $scope.locationSearch.text = preLoadSmartSearchResponse.Location;
                    }
                    else {
                        $scope.locationSearch.text = "";
                    }
                    that.locationFields = preLoadSmartSearchResponse.LocationCustomSolrFields;
                    $scope.jobsHeading = $scope.searchResultsText.replace("[#searchresults#]", response.searchResultsResponse.JobsCount).replace("[#searchcriteria#]", searchCriteria.replace(/(^,)|(,$)/g, ""));
                    if (response.searchResultsResponse.JobsCount <= 0) {
                        $scope.jobsHeading = $scope.dynamicStrings.Label_NoJobs;
                    }
                    $scope.filterAppliedCount = response.searchResultsResponse.FiltersCount;
                    $scope.filtersAppliedText = response.ClientSettings.FiltersAppliedText.replace("[#filternumber#]", response.searchResultsResponse.FiltersCount);
                    that.jobsCount = response.searchResultsResponse.JobsCount;
                    if (that.jobsCount > (50 * that.pageNumber)) {
                        that.bShowMoreButton = true;
                    }
                    else {
                        that.bShowMoreButton = false;
                    }
                    $scope.bLoggedIn = response.LoggedIn;
                    $scope.sortFields = that.sortFields = _.each(response.searchResultsResponse.SortFields, function (field) {
                        field.LocalizedString = eval("$scope.dynamicStrings.Option_" + field.Value);
                    });
                    if ($("#pageType").val().toLowerCase() == "searchresults" && (window.location.href.toLowerCase().indexOf("reqid") >= 0 && $.queryParams().reqid != "" || $.queryParams().actiontype == "savesearchfromsearchresults")) {
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                        var SMLoginjobids = $.queryParams().reqid.split(",").length > 0 ? $.queryParams().reqid : "";
                        $scope.SelectJobs = $scope.dynamicStrings.Button_Cancel;
                        $scope.toggleCheckBoxes = !$scope.toggleCheckBoxes;
                        _.each(appScope.jobs, function (job) {
                            if (SMLoginjobids.split(',').indexOf(_.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString()) > -1) {
                                job.Selected = true;
                            }
                        });
                        if ($.queryParams().actiontype == undefined)
                            $scope.postToNextPage('', appScope, 'mulapplyvald');
                        else if ($.queryParams().actiontype == "referfromsearchresults") {
                            $scope.SelectedJobsChecked = true;
                            $scope.postToNextPage('', appScope, 'refer');
                        }
                        else if ($.queryParams().actiontype == "savefromsearchresults") {
                            $scope.SelectedJobsChecked = true;
                            $scope.postToNextPage('', appScope, 'save');
                        }
                        else if ($.queryParams().actiontype == "savesearchfromsearchresults" && sessionStorage.getItem('savesearchaftersocialmedialogin') != "false") {

                            try {
                                $scope.powerSearchQuestions = JSON.parse(sessionStorage.getItem('powersearchquestions'));
                                if ($scope.powerSearchQuestions == null || $scope.powerSearchQuestions.length == 0) {
                                    $scope.preloadPowerSearch = false;
                                }
                                $scope.facets = JSON.parse(sessionStorage.getItem('facets'));
                                $scope.jobs = JSON.parse(sessionStorage.getItem('jobs'));
                                $scope.latitude = sessionStorage.getItem('latitude');
                                $scope.longitude = sessionStorage.getItem('longitude');
                                $scope.keyWordSearch.text = sessionStorage.getItem('keyword');
                                $scope.locationSearch.text = sessionStorage.getItem('location');
                                $scope.sortby = sessionStorage.getItem('sortby');
                                $scope.jobsHeading = sessionStorage.getItem('jobsheading');
                            }
                            catch (error) {

                            }
                            sessionStorage.setItem('savesearchaftersocialmedialogin', false);
                            $scope.ClearSaveSearchCriteriaToLocalSession();
                            $scope.getSavedSearchesMetaDataAndOpenDialog();
                        }

                    }
                    if ($("#pageType").val().toLowerCase() == "jobdetails") {
                        $scope.jobDetailsFieldsToDisplay = response.JobDetailFieldsToDisplay;
                        $scope.encryptedBruid = response.EncryptedBruid;
                        $scope.hashCode = response.HashCode;
                        $scope.jobDetailFields = response.Jobdetails;
                        $scope.isHotJob = response.Jobdetails == null ? false : _.pluck(_.where(response.Jobdetails.JobDetailQuestions, { "VerityZone": "hotjob" }), "AnswerValue").toString().toLowerCase() == "yes",
                        $scope.enableJobDetailsSendToFriend = $scope.tgSettings.SendToFriend.toLowerCase() == "yes" ? true : false,
                        $scope.enablePostToMySocialNetwork = $scope.tgSettings.EnablePostToMySocialNetworkLink.toLowerCase() == "yes" && $scope.tgSettings.SocialMedia != "" ? true : false,
                        $scope.jobDetailsUrlForSocialMedia = response.Jobdetails == null ? "" : $("#pageURL").val() + "/tgwebhost/jobdetails.aspx?jobid=" + _.pluck(_.where(response.Jobdetails.JobDetailQuestions, { "VerityZone": "reqid" }), "AnswerValue").toString() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&type=mail&JobReqLang=" + $scope.tgSettings.DefLanguageId + "&JobSiteId=" + $("#siteId").val() + "&gqid=" + _.pluck(_.where(response.Jobdetails.JobDetailQuestions, { "VerityZone": "gqid" }), "AnswerValue").toString(),
                        $scope.jobDetailsButtonText = $scope.tgSettings.JobDetailsSendToFriendButtonText != "" ? $scope.tgSettings.JobDetailsSendToFriendButtonText : $scope.dynamicStrings.JobDetails_SendToFriend,
                        $scope.bHideBackButtonInJobDetails = $("#hideBackButtonOnly").val() == "1" ? true : false;// This hides only the back button in jobdetails page
                        $scope.bShowBackButton = $("#noback").val() == "0" ? false : true;// this hides back button as well as page header (home and signin/register) links also.
                        if ($.queryParams().noback) {
                            $scope.bSearchResults = false;
                        }
                        //if (response.Jobdetails != null) {
                        //    $scope.handlers.JobdetailSocialShare();
                        //}
                        $scope.bLoggedIn = response.LoggedIn;

                        if (response.Jobdetails != null) {
                            $scope.JobDetailQuestionsSocialShare = response.Jobdetails.JobDetailQuestions;
                            $scope.bJobDetailsAPIError = false;
                            that.LimitExceededMessage = response.LimitExceededMessage;
                            that.ApplyDifference = response.ApplyDiff;
                            that.AllowReApply = response.ApplyStatus != null ? response.ApplyStatus.AllowReApply : true;
                            that.Applied = response.ApplyStatus != null ? response.ApplyStatus.Applied : false;
                            that.bJobDetailsShown = true;
                            that.bSearchResults = false;
                            that.bSidebarVisible = false;
                            that.ErrorMessageJobTitle = response.Jobdetails.Title.toString();
                            that.jobDetailsJobShown = _.pluck(_.where(response.Jobdetails.JobDetailQuestions, { "VerityZone": "reqid" }), "AnswerValue").toString();

                            if ($.queryParams().actiontype == "referfromjobdetails" && $scope.bLoggedIn && (!that.Applied && that.ApplyDifference > 0)) {
                                $scope.postToNextPageFromDetails('', $scope, 'refer');
                            }
                            else if ($.queryParams().actiontype == "savefromjobdetails" && $scope.bLoggedIn) {
                                $scope.postToNextPageFromDetails('', $scope, 'save');
                            }
                            else if (that.tgSettings.GoDirectToLoginFromExternalURL.toLowerCase() == 'yes' && $scope.bLoggedIn && (!that.Applied && that.ApplyDifference > 0)) {
                                $scope.postToNextPageFromDetails('', $scope, 'apply');
                            }
                            else if (that.tgSettings.GoDirectToLoginFromExternalURL.toLowerCase() == 'yes' && !$scope.bLoggedIn) {
                                $scope.postToNextPageFromDetails('', $scope, 'apply');
                            }
                            else if (that.tgSettings.GoDirectToLoginFromExternalURL.toLowerCase() == 'yes' && $scope.bLoggedIn) {
                                $scope.bJobDetailsAPIError = true;
                            }
                            else
                            {
                                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                                setTimeout(function () { $scope.setTitle("jobDetails"); }, 10);
                            }

                        }
                        else {
                            that.bJobDetailsShown = true;
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                            setTimeout(function () { $scope.setTitle("jobDetails"); }, 10);
                        }
                        $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/JobDetails");
                    }
                }
            }
            else {
                if (isJobsNearMeOn) {
                    if (bfromHistory) {
                        if (appScope.geoLocationLatitude != 0 && appScope.geoLocationLongitude != 0) {
                            $scope.showJobsNearMe({ "coords": { "latitude": appScope.geoLocationLatitude, "longitude": appScope.geoLocationLongitude } });
                        }
                        else {
                            $scope.showFeaturedJobsOrLatestJobs();
                        }
                    }
                    else {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition($scope.showJobsNearMe, $scope.showFeaturedJobsOrLatestJobs);
                            $scope.timeOut = setTimeout(function () { $scope.showFeaturedJobsOrLatestJobs(); }, 10000);
                        }
                        else {
                            $scope.showFeaturedJobsOrLatestJobs();
                        }
                    }
                }
                else if (bfromHistory && $scope.tgSettings.ShowMostRecentJobs.toLowerCase() != "yes" && $scope.tgSettings.ShowFeaturedJobs.toLowerCase() != "yes") {
                    $scope.jobs = null;
                }
                else if (response.HotJobs && response.HotJobs.Job && response.HotJobs.Job.length > 0) {
                    that.jobsCount = response.HotJobs.Job.length;
                }
                else if ($scope.featureJobs && $scope.featureJobs.length > 0) {
                    that.jobsCount = $scope.featureJobs.length;
                }

                $scope.updateHeading(response.JobsType);
            }
            if ($scope.candidateZoneResponse != null && !(window.location.href.toLowerCase().indexOf("reqid") >= 0 && $.queryParams().reqid != "")) {
                $scope.bCandidateZone = true;
                $scope.bLoggedIn = true;
                $scope.CandidateZoneData = $scope.candidateZoneResponse;
                $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                $scope.welcomeTitle = $scope.candidateZoneResponse.LoggedInSettings.LandingLoggedWelcomePageTitle;
                $scope.welcomeText = $scope.candidateZoneResponse.LoggedInSettings.LandingLoggedWelcomeText;
                $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/CandidateZone");
            }
        },

        showNextSetOfJobs: function () {
            that.pageNumber = that.pageNumber + 1;
            that.sortJobs(true);
        },

        updateCandidateZoneData: function () {
            if ($scope.bresponsiveCandidateZone && $scope.ProfileDetails != null) {
                $scope.CandidateZoneData = $scope.ProfileDetails.CandidateZonePageResponse;
                if (typeof $scope.CandidateZoneData != 'undefined' && $scope.CandidateZoneData != null) {
                    $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                    $scope.welcomeTitle = $scope.CandidateZoneData.LoggedInSettings.LandingLoggedWelcomePageTitle;
                    $scope.welcomeText = $scope.CandidateZoneData.LoggedInSettings.LandingLoggedWelcomeText;

                    $scope.SearchOpeningsSummaryText = $scope.CandidateZoneData.LandingLoggedSearchOpeningsSummaryText != "" ? $scope.CandidateZoneData.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                    if ($scope.CandidateZoneData.LoggedInSettings.GeneralSocialReferral == "yes") {
                        $scope.SocialReferral_READY = $scope.CandidateZoneData.LoggedInSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                        $scope.SocialReferral_FirstName = encodeURIComponent($scope.CandidateZoneData.LoggedInSettings.SocialReferral_FirstName);
                        $scope.SocialReferral_LastName = encodeURIComponent($scope.CandidateZoneData.LoggedInSettings.SocialReferral_LastName);
                        $scope.SocialReferral_ProfileId = $scope.CandidateZoneData.LoggedInSettings.profileId;
                    }
                }
            }
        },

        sortJobs: function (Nextpagejobs) {
            var powerSearchOptions = [];
            if (that.powerSearchQuestions != "") {
                _.forEach(that.powerSearchQuestions, function (aQuestion) {
                    var obj = {};
                    obj.VerityZone = aQuestion.VerityZone;
                    obj.Type = aQuestion.QuestionType;
                    if (aQuestion.IsAutoComplete && aQuestion.QId == 0) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.IsAutoComplete) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                        obj.Value = aQuestion.Value;
                    }
                    else {
                        obj.OptionCodes = _.pluck(_(aQuestion.Options).where({ Selected: true }).value(), "OptionValue");
                    }
                    powerSearchOptions.push(obj)
                });
            }
            var sortJobsRequest = {};
            sortJobsRequest.partnerId = $("#partnerId").val();
            sortJobsRequest.siteId = $("#siteId").val();
            sortJobsRequest.keyword = $scope.keyWordSearch.text;
            sortJobsRequest.location = $scope.locationSearch.text;
            sortJobsRequest.keywordCustomSolrFields = that.keywordFields;
            sortJobsRequest.locationCustomSolrFields = that.locationFields;
            facetFilterFields = $scope.GetFilteredFacets(appScope.facets);

            if ($scope.locationSearch.text != "") {
                sortJobsRequest.Latitude = that.latitude;
                sortJobsRequest.Longitude = that.longitude;
            }
            else {
                sortJobsRequest.Latitude = 0;
                sortJobsRequest.Longitude = 0;
            }
            $scope.sortby = (Nextpagejobs == true) ? $scope.sortby : null;
            $scope.sortby = ($scope.sortby == null && $scope.sortby == undefined) ? $("#sortBy").val() : $scope.sortby;
            sortJobsRequest.facetfilterfields = { "Facet": facetFilterFields };
            sortJobsRequest.powersearchoptions = { "PowerSearchOption": powerSearchOptions };
            sortJobsRequest.SortType = $scope.sortFields[$scope.sortby].Name;
            if (Nextpagejobs == true) {
                sortJobsRequest.pageNumber = that.pageNumber;
            }
            else {
                sortJobsRequest.pageNumber = that.pageNumber = 1;
            }

            sortJobsRequest.encryptedSessionValue = $("#CookieValue").val();

            //sortJobsRequest = that.formJson();
            var url = '/TgNewUI/Search/Ajax/ProcessSortAndShowMoreJobs';
            $http.post(url, sortJobsRequest).success(function (data, status, headers, config) {
                if (data.Jobs) {
                    if (Nextpagejobs == true) {
                        $.merge(that.jobs, data.Jobs.Job);
                    }
                    else {
                        that.jobs = data.Jobs.Job;
                    }
                }
                else {
                    $("#searchResults").val('');
                    that.jobs = null;
                }
                if (that.jobsCount > (50 * that.pageNumber)) {
                    that.bShowMoreButton = true;
                }
                else {
                    that.bShowMoreButton = false;
                }
                //241711: start Added to display the current keyword texts
                var searchCriteria = "";
                if ($scope.keyWordSearch.text) {
                    searchCriteria = $scope.keyWordSearch.text;
                }
                if ($scope.locationSearch.text) {
                    searchCriteria += ("," + $scope.locationSearch.text);
                }
                $scope.jobsHeading = $scope.searchResultsText.replace("[#searchresults#]", data.JobsCount).replace("[#searchcriteria#]", (searchCriteria.replace(/(^,)|(,$)/g, "")));
                if (data.JobsCount <= 0) {
                    $scope.jobsHeading = $scope.dynamicStrings.Label_NoJobs;
                } else if (searchCriteria == null || searchCriteria == undefined || searchCriteria == "") {
                    $scope.jobsHeading = $scope.jobsHeading.replace("  ", " ");
                    //$scope.jobsHeading = data.JobsCount + " " + $scope.dynamicStrings.Label_searchresults;
                }

                //241711: End
                setTimeout(function () {
                    $scope.$apply();
                    $("#sortBy").val($scope.sortby);
                }, 0);
            }).error(function (data, status, headers, config) {
                //console.log("failed with status of " + status);
            });
        },

        throttleSortJobs: function () {
            that.throttleSortJobsSubfunction = that.throttleSortJobsSubfunction || _.throttle(that.sortJobs, 450, { leading: true, trailing: true });
            that.throttleSortJobsSubfunction();
        },

        throttleAttachment: function () {
            $("span.error").hide();
            if ($("#AttachementCatagory").val() != undefined && $("#AttachementCatagory").val() != "")
                window.applyScope.page.uploadServices("Attachments", $("#AttachementCatagory").val());
        },

        formJson: function () {
            var json = {};
            facetFilterFields = _.forEach(that.facets, function (facet) { return _.filter(facet.Options, { Selected: true }) });
            json = { "SiteId": $("#siteId").val(), "PartnerId": $("#partnerId").val(), "Keyword": $scope.keyWordSearch.text, "Location": $scope.locationSearch.text, "KeywordCustomSolrFields": that.keywordFields, "LocationCustomSolrFields": that.locationFields, "Latitude": $scope.locationSearch.text != "" ? that.latitude : 0, "Longitude": $scope.locationSearch.text != "" ? that.longitude : 0, "FacetFilterFields": { "Facet": facetFilterFields }, "SortType": $scope.sortFields[$("#sortBy").val()].Name, "PageNumber": that.pageNumber };
            return json;
        },


        searchMatchedJobs: function (scope) {
            $scope.bJobsSaved = false;
            $scope.bSearchSaved = false;
            $scope.sortby = 0;
            if (angular.isDefined(scope) && typeof scope.oActiveLaddaButton != 'undefined')
                scope.oActiveLaddaButton.start();
            clearTimeout($scope.timeOut);
            if ($scope.featuredOrLatestJobsAjax != null) {
                $scope.featuredOrLatestJobsAjax.abort();
            }
            var smartSearchRequest = {};
            $scope.utils.cleanUpAutocompletes();
            smartSearchRequest.partnerId = $scope.$root.queryParams.partnerid;
            smartSearchRequest.siteId = $scope.$root.queryParams.siteid;
            smartSearchRequest.keyword = $scope.keyWordSearch.text;
            smartSearchRequest.location = $scope.locationSearch.text;
            smartSearchRequest.keywordCustomSolrFields = that.keywordFields;
            smartSearchRequest.locationCustomSolrFields = that.locationFields;
            smartSearchRequest.facetfilterfields = null;
            if ($scope.locationSearch.text != "") {
                smartSearchRequest.Latitude = that.latitude;
                smartSearchRequest.Longitude = that.longitude;
            }
            else {
                smartSearchRequest.Latitude = 0;
                smartSearchRequest.Longitude = 0;
            }
            $scope.updateSaveSearchCritetia(smartSearchRequest);
            smartSearchRequest.encryptedsessionvalue = $("#CookieValue").val();
            $.ajax({
                success: function (data, status, jqxhr, bResettingFromHistory) {

                    var elActive = document.activeElement,
                        sPriorActiveSearchControlSelector = "dummyValue";

                    if (elActive)
                        sPriorActiveSearchControlSelector = elActive.tagName + (elActive.name ? ("[name=" + elActive.name + "]") : "");

                    if (angular.isDefined(scope) && typeof scope.oActiveLaddaButton != 'undefined')
                        scope.oActiveLaddaButton.stop();

                    if (that.bJobCart || (typeof (that.candidatezoneSubView) !== "undefined" && that.candidatezoneSubView.toLowerCase() == "responsivereferrals")) {
                        that.bGQLaunchedFromJobCart = false;
                        $scope.bCandidateZone = false;
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                    }

                    if (data.Jobs) {
                        $scope.jobs = data.Jobs.Job;
                    }
                    else {
                        $("#searchResults").val('');
                        $scope.jobs = null;
                    }
                    if (data.Facets)
                        that.facets = data.Facets.Facet;
                    else
                        that.facets = null;
                    that.bInitialLoad = false;
                    that.bSidebarShown = true;
                    that.bSidebarVisible = true;
                    that.bSearchResults = true;
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                    that.bJobDetailsShown = false;
                    that.bRenderPhoneViewSearch = false;
                    that.pageNumber = 1;
                    that.filterAppliedCount = 0;
                    $("#title").nextAll('meta').remove();
                    $("#title").after($scope.tgSettings.SearchResultsMetaTagText.replace(/#ClientName#/g, $scope.tgSettings.PartnerName));
                    if ($scope.bShowFilterAccordion || $scope.bShowFacetAccordionOptions) {
                        $scope.bShowFilterAccordion = false;
                        $scope.bRenderFacetFilterAccordion = false;
                        $scope.bShowFacetAccordionOptions = false;
                        $scope.bFilterAccordionOpen = false;
                        $scope.bPinFacetArrow = false;
                    }
                    var searchCriteria = "";
                    if ($scope.keyWordSearch.text) {
                        searchCriteria = $scope.keyWordSearch.text;
                    }
                    if ($scope.locationSearch.text) {
                        searchCriteria += ("," + $scope.locationSearch.text);
                    }
                    $scope.jobsHeading = $scope.searchResultsText.replace("[#searchresults#]", data.JobsCount).replace("[#searchcriteria#]", (searchCriteria.replace(/(^,)|(,$)/g, "")));

                    if (data.JobsCount <= 0) {
                        $scope.jobsHeading = $scope.dynamicStrings.Label_NoJobs;
                    } else if (searchCriteria == null || searchCriteria == undefined || searchCriteria == "") {
                        $scope.jobsHeading = $scope.jobsHeading.replace("  ", " ");
                    }
                    that.sortFields = _.each(data.SortFields, function (field) {
                        field.LocalizedString = eval("$scope.dynamicStrings.Option_" + field.Value);
                    }),
                    that.jobsCount = data.JobsCount;
                    if (that.jobsCount > (50 * that.pageNumber)) {
                        that.bShowMoreButton = true;
                    }
                    else {
                        that.bShowMoreButton = false;
                    }
                    that.preloadPowerSearch = false;
                    that.powerSearchQuestions = [];

                    if (data.Latitude > 0) {
                        $scope.latitude = data.Latitude;
                    }
                    if (data.Longitude > 0) {
                        $scope.longitude = data.Longitude;
                    }
                    if (typeof $scope.oHistory != "undefined" && $scope.oHistory != null)
                        _.each($scope.oHistory, function (oPriorScope, sName) {
                            if (sName.indexOf('keyWordSearch') != -1) {
                                $scope.oHistory[sName].SelectJobs = $scope.tgSettings.SelectJobsText;;
                                $scope.oHistory[sName].toggleCheckBoxes = false;
                                $scope.oHistory[sName].SelectedJobsChecked = false;
                            }
                        });


                    $scope.setHash(bResettingFromHistory, arguments, this);
                    setTimeout(function () {
                        $scope.scrolltop();
                        $scope.$apply();
                        $("#mainJobListContainer").focus();
                    }, 0);

                    $scope.setTitle($scope.workFlow);

                    $(".searchControls [role=status]").html("");

                    var $statusEl = $(document.activeElement).prev("[role=status]");

                    if ($statusEl.exists()) {
                        $statusEl.text($scope.jobsHeading);
                    }

                    $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/SearchResults");

                },
                error: function (jqxhr, status, error) {
                    if (angular.isDefined(scope))
                        scope.oActiveLaddaButton.stop();
                },
                data: smartSearchRequest,
                url: '/TgNewUI/Search/Ajax/MatchedJobs',
                type: 'POST'
            });


        },
        powerSearchJobs: function (scope) {
            var isValid = 1;
            $scope.sortby = 0;
            $scope.bSearchSaved = false;
            if (that.powerSearchQuestions != "") {
                _.forEach(that.powerSearchQuestions, function (aQuestion) {
                    if (aQuestion.QuestionType == "date") {
                        var selecteddate = aQuestion.Value;
                        if (selecteddate != null && selecteddate.indexOf(",") >= 0) {
                            date1 = selecteddate.substring(0, selecteddate.indexOf(","));
                            date2 = selecteddate.substring(selecteddate.indexOf(",") + 1);
                            if (date1 != "" && date2 != "") {
                                var millisecondsdate1 = Date.parse(date1);
                                var date1 = new Date(millisecondsdate1);
                                var millisecondsdate2 = Date.parse(date2);
                                var date2 = new Date(millisecondsdate2);
                                if (date1 > date2) {
                                    aQuestion.rangeValid = 0;
                                    isValid = 0;
                                }
                            }
                        }
                    }
                });
            }

            if (isValid == 0 || !$("#powerSearchForm").valid()) {
                that.$apply();
                return;
            }

            var powerSearchOptions = [];
            if (that.powerSearchQuestions != "") {
                _.forEach(that.powerSearchQuestions, function (aQuestion) {
                    var obj = {};
                    obj.VerityZone = aQuestion.VerityZone;
                    obj.Type = aQuestion.QuestionType;
                    if (aQuestion.IsAutoComplete && aQuestion.QId == 0) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.IsAutoComplete) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                        obj.Value = aQuestion.Value;
                    }
                    else {
                        obj.OptionCodes = _.pluck(_(aQuestion.Options).where({ Selected: true }).value(), "OptionValue");
                    }
                    powerSearchOptions.push(obj)
                });
            }
            var smartSearchRequest = {};
            smartSearchRequest.partnerId = $("#partnerId").val();
            smartSearchRequest.siteId = $("#siteId").val();
            $scope.keyWordSearch.text = $scope.powerSearchKeyWordSearch.text;
            $scope.locationSearch.text = $scope.powerSearchLocationSearch.text;
            smartSearchRequest.keyword = $scope.powerSearchKeyWordSearch.text;
            smartSearchRequest.location = $scope.powerSearchLocationSearch.text;
            smartSearchRequest.keywordCustomSolrFields = that.keywordFields;
            smartSearchRequest.locationCustomSolrFields = that.locationFields;
            facetFilterFields = [];// _.forEach(this.$parent.facets, function (facet) { return _.filter(facet.Options, { Selected: true }) });

            if ($scope.powerSearchLocationSearch.text != "") {
                smartSearchRequest.Latitude = that.latitude;
                smartSearchRequest.Longitude = that.longitude;
            }
            else {
                smartSearchRequest.Latitude = 0;
                smartSearchRequest.Longitude = 0;
            }
            $scope.updateSaveSearchCritetia(smartSearchRequest);
            smartSearchRequest.facetfilterfields = { "Facet": facetFilterFields };
            smartSearchRequest.powersearchoptions = { "PowerSearchOption": powerSearchOptions };
            smartSearchRequest.sortField = $("#sortBy").val();
            smartSearchRequest.encryptedsessionvalue = $("#CookieValue").val();
            scope.oActiveLaddaButton.start();
            var url = '/TgNewUI/Search/Ajax/PowerSearchJobs';
            $http.post(url, smartSearchRequest).success(function powerSearchAjax(data, status, headers, config, bFromHistory) {
                scope.oActiveLaddaButton.stop();
                if (data.Jobs) {
                    $scope.jobs = data.Jobs.Job;
                }
                else {
                    $("#searchResults").val('');
                    $scope.jobs = null;
                }
                $scope.SaveSearchCriteria.Latitude = data.Latitude;
                $scope.SaveSearchCriteria.Longitude = data.Longitude;
                if (data.Facets)
                    that.facets = data.Facets.Facet;
                else
                    that.facets = null;
                that.bInitialLoad = false;
                that.bSidebarShown = true;
                that.bSidebarVisible = true;
                that.bSearchResults = true;
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                that.pageNumber = 1;
                var searchCriteria = "";
                if ($scope.keyWordSearch.text != "") {
                    searchCriteria = $scope.keyWordSearch.text
                }
                if ($scope.locationSearch.text != "") {
                    searchCriteria = searchCriteria + "," + $scope.locationSearch.text;
                }
                $scope.jobsHeading = $scope.searchResultsText.replace("[#searchresults#]", data.JobsCount).replace("[#searchcriteria#]", searchCriteria.replace(/(^,)|(,$)/g, ""));
                if (data.JobsCount <= 0) {
                    $scope.jobsHeading = $scope.dynamicStrings.Label_NoJobs;
                } else if (searchCriteria == null || searchCriteria == undefined || searchCriteria == "") {
                    $scope.jobsHeading = $scope.jobsHeading.replace("  ", " ");
                    //$scope.jobsHeading = data.JobsCount + " " + $scope.dynamicStrings.Label_searchresults;
                }
                if ($scope.bShowFilterAccordion) {
                    $scope.bShowFilterAccordion = false;
                    $scope.bRenderFacetFilterAccordion = false;
                    $scope.bShowFacetAccordionOptions = false;
                    $scope.bFilterAccordionOpen = false;
                    $scope.bPinFacetArrow = false;
                }
                $scope.filterAppliedCount = data.FiltersCount;
                $scope.filtersAppliedText = response.ClientSettings.FiltersAppliedText.replace("[#filternumber#]", data.FiltersCount);
                that.jobsCount = data.JobsCount;
                //that.sortFields = data.SortFields;
                that.sortFields = _.each(data.SortFields, function (field) {
                    field.LocalizedString = eval("$scope.dynamicStrings.Option_" + field.Value);
                });
                if (that.jobsCount > (50 * that.pageNumber)) {
                    that.bShowMoreButton = true;
                }
                else {
                    that.bShowMoreButton = false;
                }
                that.bPowerSearchVisible = false;
                that.preloadPowerSearch = true;

                setTimeout(function () {
                    $scope.$apply();
                    $scope.scrolltop();
                    $("#mainJobListContainer").focus();
                }, 0);


                $scope.setHash(bFromHistory, arguments, this);

                $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/SearchResults");

            }).error(function (data, status, headers, config) {
                scope.oActiveLaddaButton.stop();
                //console.log("failed with status of " + status);
            });

        },

        filterJobsByFacet: function (scope, oFacet) {

            var nDeltaSelectedCount = scope ? (scope.op.Selected ? 1 : -1) : 0,
                powerSearchOptions = [];

            $scope.bJobsLoadingState = true;

            oFacet = oFacet || scope.$parent.facet;
            oFacet.SelectedCount = (oFacet.SelectedCount || 0) + nDeltaSelectedCount;

            if (that.powerSearchQuestions != "") {
                _.forEach(that.powerSearchQuestions, function (aQuestion) {
                    var obj = {};
                    obj.VerityZone = aQuestion.VerityZone;
                    obj.Type = aQuestion.QuestionType;
                    if (aQuestion.IsAutoComplete && aQuestion.QId == 0) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.IsAutoComplete) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                        obj.Value = aQuestion.Value;
                    }
                    else {
                        obj.OptionCodes = _.pluck(_(aQuestion.Options).where({ Selected: true }).value(), "OptionValue");
                    }
                    powerSearchOptions.push(obj)
                });
            }
            var smartSearchRequest = {};
            smartSearchRequest.partnerId = $("#partnerId").val();
            smartSearchRequest.siteId = $("#siteId").val();
            smartSearchRequest.keyword = $scope.keyWordSearch.text;
            smartSearchRequest.location = $scope.locationSearch.text;
            smartSearchRequest.keywordCustomSolrFields = that.keywordFields;
            smartSearchRequest.locationCustomSolrFields = that.locationFields;
            facetFilterFields = $scope.GetFilteredFacets($scope.facets);

            if ($scope.locationSearch.text != "") {
                smartSearchRequest.Latitude = that.latitude;
                smartSearchRequest.Longitude = that.longitude;
            }
            else {
                smartSearchRequest.Latitude = 0;
                smartSearchRequest.Longitude = 0;
            }
            smartSearchRequest.encryptedsessionvalue = $("#CookieValue").val();
            smartSearchRequest.facetfilterfields = { "Facet": facetFilterFields };
            smartSearchRequest.powersearchoptions = { "PowerSearchOption": powerSearchOptions };
            if ($("#sortBy").val() != undefined && $("#sortBy").val() != "") {
                smartSearchRequest.sortField = $scope.sortFields[$("#sortBy").val()].Name;
            }
            else {
                smartSearchRequest.sortField = "";
            }


            var url = '/TgNewUI/Search/Ajax/MatchedJobs';
            $http.post(url, smartSearchRequest).success(function (data, status, headers, config) {
                $scope.bJobsLoadingState = false;
                $scope.jobs = data.Jobs.Job;
                if (data.Facets) {
                    _.each($scope.facets, function (oCurrentFacet, i) {
                        var iDataOptionCounter = 0;
                        var currentFacet = null;
                        _.each(oCurrentFacet.Options, function (oOption, j) {
                            currentFacet = _.find(data.Facets.Facet, function (facet) {
                                return oCurrentFacet.Name == facet.Name;
                            });
                            if (currentFacet != null && (currentFacet.Name != oFacet.Name)) {
                                var oDataOption = currentFacet ? currentFacet.Options[iDataOptionCounter] : null;
                                //var oDataOption = data.Facets.Facet[i] ? data.Facets.Facet[i].Options[iDataOptionCounter] : null;
                                if (oDataOption && oDataOption.OptionValue == oOption.OptionValue) {
                                    oOption.Count = oDataOption.Count;
                                    iDataOptionCounter++;
                                } else {
                                    oOption.Count = 0;
                                }
                            }
                        })
                    });
                }
                else
                    that.facets = null;

                that.bInitialLoad = false;
                that.bSidebarShown = true;
                that.bSidebarVisible = true;
                that.pageNumber = 1;
                var searchCriteria = "";
                if ($scope.keyWordSearch.text) {
                    searchCriteria = $scope.keyWordSearch.text;
                }
                if ($scope.locationSearch.text) {
                    searchCriteria += ("," + $scope.locationSearch.text);
                }
                $scope.jobsHeading = $scope.searchResultsText.replace("[#searchresults#]", data.JobsCount).replace("[#searchcriteria#]", searchCriteria.replace(/(^,)|(,$)/g, ""));
                if (data.JobsCount <= 0) {
                    $scope.jobsHeading = $scope.dynamicStrings.Label_NoJobs;
                } else if (searchCriteria == null || searchCriteria == undefined || searchCriteria == "") {
                    $scope.jobsHeading = $scope.jobsHeading.replace("  ", " ");
                    //$scope.jobsHeading = data.JobsCount + " " + $scope.dynamicStrings.Label_searchresults;
                }
                $scope.filterAppliedCount = data.FiltersCount;
                $scope.filtersAppliedText = response.ClientSettings.FiltersAppliedText.replace("[#filternumber#]", data.FiltersCount);
                that.jobsCount = data.JobsCount;
                if (that.jobsCount > (50 * that.pageNumber)) {
                    that.bShowMoreButton = true;
                }
                else {
                    that.bShowMoreButton = false;
                }
                if (data.Latitude > 0) {
                    $scope.latitude = data.Latitude;
                }
                if (data.Longitude > 0) {
                    $scope.longitude = data.Longitude;
                }
                $scope.setHash();
                setTimeout(function () {
                    $scope.scrolltop();
                    $scope.$apply();
                    $("#mainJobListContainer").focus();
                }, 0);
            }).error(function (data, status, headers, config) {
                $scope.bJobsLoadingState = false;
            });

        },
        getPowerSearchQuestions: function () {

            setTimeout(function () {
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "powerSearch";
            }, 0);

            if (!that.bPowerSearchVisible) {
                that.bInitialLoad = false;
                $scope.keywordTextTemp = $scope.keyWordSearch.text;
                $scope.locationTextTemp = $scope.locationSearch.text;
                if (!that.preloadPowerSearch && !(that.powerSearchQuestions && that.powerSearchQuestions.length)) {
                    var powerSearchRequest = {};
                    powerSearchRequest.partnerId = $("#partnerId").val();
                    powerSearchRequest.siteId = $("#siteId").val();
                    var url = '/TgNewUI/Search/Ajax/PowerSearch';
                    $http.post(url, powerSearchRequest).success(function (data, status, headers, config) {
                        that.bPowerSearchVisible = !that.bPowerSearchVisible;
                        that.powerSearchQuestions = data.Questions;
                        $scope.TranslatePowerSearchQuestions(that.powerSearchQuestions);
                        if (that.powerSearchQuestions != "") {
                            _.forEach(that.powerSearchQuestions, function (aQuestion) {
                                $.htmlEncodeSpecial(aQuestion);
                                if (aQuestion.QuestionType == "date") {
                                    aQuestion.rangeValid = 1;
                                }
                                if (aQuestion.QId == "0") {
                                    aQuestion.Options.unshift(
                                   {
                                       OptionName: $scope.dynamicStrings.Option_All,
                                       OptionValue: "999999",
                                       Selected: false,
                                       Count: 0
                                   });
                                }
                            });
                        }
                        if ($scope.bShowFilterAccordion || $scope.bShowFacetAccordionOptions) {
                            $scope.bShowFilterAccordion = false;
                            $scope.bRenderFacetFilterAccordion = false;
                            $scope.bShowFacetAccordionOptions = false;
                            $scope.bFilterAccordionOpen = false;
                            $scope.bPinFacetArrow = false;
                        }
                        $scope.setHash();
                    }).error(function (data, status, headers, config) {
                        //console.log("failed with status of " + status);
                    });
                } else {
                    that.bPowerSearchVisible = true;
                    that.bInitialLoad = false;
                    $scope.oldPowerSearchQuestions = that.powerSearchQuestions;
                }
            }
            else {
                that.powerSearchQuestions = $scope.oldPowerSearchQuestions;
                $scope.TranslatePowerSearchQuestions(that.powerSearchQuestions);
                $scope.keyWordSearch.text = $scope.keywordTextTemp;
                $scope.locationSearch.text = $scope.locationTextTemp;
                that.bPowerSearchVisible = false;
                that.bInitialLoad = !that.bSidebarShown;
                // $scope.utils.updateHistory('profile&loggedIn=true');
                history.back();
            }
        },
        clearPowerSearch: function () {
            $scope.keyWordSearch.text = "";
            $scope.locationSearch.text = "";
            $scope.powerSearchKeyWordSearch.text = "";
            $scope.powerSearchLocationSearch.text = "";
            if ($scope.powerSearchQuestions != "") {
                _.forEach(that.powerSearchQuestions, function (aQuestion) {
                    if (aQuestion.IsAutoComplete) {
                        aQuestion.selectedOptions = [];
                        aQuestion.aAvailableOptions = [];
                        aQuestion.oAvailableOptions = [];
                    }
                    else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                        aQuestion.Value = "";
                    }
                    else {
                        _.forEach(aQuestion.Options, function (opt) {
                            opt.Selected = false;
                        })
                    }
                });
            }
            $scope.powerSearchQuestions = that.powerSearchQuestions;
            that.bPowerSearchVisible = false;
            $timeout(function () {
                that.bPowerSearchVisible = true;
            }, 0);

        },
        sidebarSlider: {
            init: function (scope, $el, attr) {
                $($el).click(function () {
                    appScope.bSidebarOverlay = !appScope.bSidebarOverlay;
                    appScope.$apply();
                })
            }

        },

        toggleSidebar: function () {
            appScope.bSidebarOverlay = !appScope.bSidebarOverlay;
        },
        selectJobs: function () {
            $scope.SelectJobs = ($scope.toggleCheckBoxes == true) ? $scope.tgSettings.SelectJobsText : $scope.dynamicStrings.Button_Cancel;
            $scope.toggleCheckBoxes = !$scope.toggleCheckBoxes;
            $scope.jobs = _.each($scope.jobs, function (job) {
                job.Selected = false;
            })
            //For IE8 specific fix as the liner class Div's are not obeying the Css applied to it at the time of checkbox creation
            if ($scope.toggleCheckBoxes == true) {
                // setTimeout(function () { $(".liner").animate({ "right": "25px" }); }, 10);
            }
            else {
                $scope.SelectedJobsChecked = false;
                // setTimeout(function () { $(".liner").animate({ "left": "25px" }); }, 10);
            }
            if (!$scope.utils.isNewHash($scope.$location.hash(), $scope))
                $scope.utils.updateHistory($scope.$location.hash());
        },
        searchResultsBackLink: function () {
            var backTo = "";

            if (typeof previousHashes[previousHashes.length - 2] == "undefined") {
                $scope.homeView();
            } else {
                if ($scope.bresponsiveCandidateZone) {
                    if (!$scope.utils.isNewHash('SavedJobs', $scope)) {
                        $scope.savedJobsCache = null;
                        $scope.$root.oHistory['SavedJobs'].savedJobsCache = null;
                    }
                    if (!$scope.utils.isNewHash('SavedSearches', $scope)) {
                        $scope.SavedSearches = null;
                        $scope.$root.oHistory['SavedSearches'].SavedSearches = null;
                    }
                }
                history.back();
            }

        },
        BackfromSelectedGroup: function () {

            if (typeof previousHashes[previousHashes.length - 2] == "undefined") {
                $scope.homeView();
            }
            else {
                history.back();
                if ($scope.bresponsiveCandidateZone && $scope.bCandidateZone) {
                    $scope.alignCards("SavedJobsContainer", "jobCard");
                }
            }

        },
        BackFromJobCart: function () {
            $scope.bJobCart = false;
            if ($scope.jobsCache != null) {
                $scope.jobs = $scope.jobsCache;
            }
            if ($scope.bJobCartLaunchedFromHome) {
                $scope.bJobCartLaunchedFromHome = false;
                $scope.homeView();
            }
            else {
                history.back();
            }
        },
        MultipleApplyDupCheckAjax: function (scope, clientId, siteId, jobsiteIds, selectedJobs) {
            var DuplicateCheckRequestForMultipleJobs = {
                clientId: clientId,
                siteId: siteId,
                jobAndSiteIds: jobsiteIds,
                sid: $("#CookieValue").val(),
                jobInfo: scope.jobInfo
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/Search/Ajax/CheckDuplicateSubmissionForMultipleJobs",
                data: DuplicateCheckRequestForMultipleJobs,
                success: function (data) {
                    scope.ApplyDifference = data.ApplyDiff;
                    scope.LimitExceededMessage = data.LimitExceededMessage;
                    scope.MultipleJobStatus = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })) : "";
                    scope.NoofJobsApplied = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })).length : 0;
                    scope.AllJobsApplied = scope.NoofJobsApplied == selectedJobs.length ? true : false;
                    if (scope.ApplyDifference <= 0) {
                        //scope.NoOfJobsExceededMaxLimit = ((scope.ApplyDifference * -1) + 1) == (selectedJobs.length - scope.NoofJobsApplied) ? 0 : ((scope.ApplyDifference * -1) + 1);
                        scope.NoOfJobsExceededMaxLimit = (eval(data.MaxSubmissions) - eval(data.CurrentSubmissions)) > 0 ? (selectedJobs.length - (eval(data.MaxSubmissions) - eval(data.CurrentSubmissions))) : 0;
                    }
                    if (angular.isDefined(scope.oActiveLaddaButton))
                        scope.oActiveLaddaButton.stop();
                    if (scope.jobIds != data.ReqsThatCanBeApplied) {
                        if (data.ReqsThatCanBeApplied == null) {
                            _.each(scope.jobs, function (job) {
                                job.Selected = false;
                            });
                        }
                        else {
                            var splittedJobs = data.ReqsThatCanBeApplied.split(",");
                            _.each(scope.jobs, function (job) {
                                if (_.contains(splittedJobs, _.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString())) {
                                    job.Selected = true;
                                }
                                else {
                                    job.Selected = false;
                                }
                            });
                        }

                    }
                    scope.jobIds = data.ReqsThatCanBeApplied;
                    scope.isGQResponsive = data.IsGQResponsiveForMultipleJobsHavingSingleGQ;
                    scope.dialogCalledfrom = 'Apply';
                    //remove duplicate jobs from the reqids
                    $timeout(function () {
                        scope.$apply();
                    }, 0);
                    if (scope.NoofJobsApplied > 0 || scope.ApplyDifference <= 0) {
                        $scope.MultipleApplyFormData = scope;
                        $('body').addClass('noScroll');
                        ngDialog.open({
                            preCloseCallback: function (value) {
                                $('body').removeClass('noScroll');
                                $.restoreFocus();
                            },
                            template: 'MultipleApplyValidations', scope: scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
                        });
                    }
                    else {
                        $scope.postToNextPage("", scope, 'apply');
                    }

                }
            });
        },

        SingleJobApplyDupCheckAjax: function () {
            var Questions = $scope.jobDetailFields.JobDetailQuestions;
            jobId = _.pluck(_.where(Questions, { "VerityZone": "reqid" }), "AnswerValue").toString();
            siteId = _.pluck(_.where(Questions, { "VerityZone": "siteid" }), "AnswerValue").toString();

            var DuplicateCheckRequestForMultipleJobs = {
                clientId: $("#partnerId").val(),
                siteId: $("#siteId").val(),
                jobAndSiteIds: jobId + "_" + siteId,
                sid: $("#CookieValue").val(),
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/Search/Ajax/CheckDuplicateSubmissionForMultipleJobs",
                data: DuplicateCheckRequestForMultipleJobs,
                success: function (data) {
                    $scope.ApplyDifference = data.ApplyDiff;
                    $scope.LimitExceededMessage = data.LimitExceededMessage;
                    $scope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus[0].AllowReApply : true;
                    $scope.Applied = data.ApplyStatus != null ? data.ApplyStatus[0].Applied : false;
                    if ($scope.calledFrom == "save") {
                        $scope.postToNextPageFromDetails('', $scope, $scope.calledFrom);
                    }
                    else if (!$scope.Applied && $scope.ApplyDifference > 0) {
                        $scope.postToNextPageFromDetails('', $scope, "apply");
                    }
                    else
                        return;
                }
            });
        },

        SelectedGroupAjax: function (clientId, siteId, jobSiteInfo) {
            var SelectedJobsRequest = {
                ClientId: clientId,
                SiteId: siteId,
                JobSiteInfo: jobSiteInfo,
                SessionID: $("#CookieValue").val()
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/Search/Ajax/GroupSelectedJobs",
                data: SelectedJobsRequest,
                success: function (data) {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "SelectedGroup";
                    $scope.setTitle("SelectedGroup");
                    $scope.SelectedGroups = data.Groups;
                    $scope.bSelectedGroup = true;
                    $scope.bCreateAccount = false;
                    if (!$scope.utils.isNewHash('SelectedGroup', $scope))
                        $scope.utils.updateHistory('SelectedGroup');

                    $scope.setHash();
                    setTimeout(function () {
                        $scope.scrolltop();
                        $scope.$apply();
                    }, 0);
                }
            });
        },

        GroupJobApplyAjax: function (Group, scope) {
            var switchSite = false;
            var type = "";
            if ($scope.bCandidateZone && $scope.bJobCart) {
                type = "cart-srchresults";
            }
            else {
                type = "selectedjobs-srchresults";
            }
            if (Group.siteId != $("#siteId").val()) {
                $scope.switchSite(Group.siteId, "fromApply");
                switchSite = true;
                //switch site
            }
            if (Group.GQId == "0") {
                postValues = { JobInfo: Group.JobInfo, ApplyCount: Group.reqIds.split(',').length, type: type, JobSiteId: Group.siteId, hdRft: $("#rfToken").val() };
                redirectPage = "apply.aspx";
                $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();
            }
            else {
                if ($.queryParams().applyTest || Group.IsGQResponsive) {
                    //IS responsive GQ
                    if (switchSite) {
                        window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + Group.siteId + "&TQId=" + Group.GQId + "&bruid=" + encodeURIComponent($scope.encryptedBruid) + "&reqid=" + Group.reqIds + "&calledFrom=SelectedGroup";
                    }
                    else {
                        var rft = $("[name='__RequestVerificationToken']").val();
                        $.ajax({
                            method: "GET",
                            url: "/gqweb/apply?bruid=" + encodeURIComponent($scope.encryptedBruid) + "&tqid=" + Group.GQId + "&localeid=" + Group.LocaleId + "&reqid=" + Group.reqIds + "&partnerid=" + $("#partnerId").val() + "&siteid=" + Group.siteId + "&wbmode=false&loadingViaAjax=true&RFT=" + rft,
                            success: function (result) {
                                $scope.$root.applyResponse = result;
                                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                setTimeout(function () {
                                    $scope.$apply();
                                }, 0);
                            }
                        });
                    }
                }
                else {
                    if ($scope.tgSettings.Mobileoptimised == "true") {
                        postValues = { JobInfo: Group.JobInfo, ApplyCount: Group.reqIds.split(',').length, type: type, JobSiteId: Group.siteId, GQLoginURL: "../" + Group.LocaleId + "/asp/tg/GQLogin.asp?SID=GQSESSION&gqid=" + Group.GQId + "&jobinfo=" + Group.JobInfo.replace(/%%/g, "__") + "&applycount=" + Group.reqIds.split(',').length + "&type=" + type + "&mobile=1", hdRft: $("#rfToken").val() };//need to change gqlogin url
                        redirectPage = "apply.aspx";
                        $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();

                    }
                    else {
                        window.open("../../../" + Group.LocaleId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val() + "&gqid=" + Group.GQId + "&jobinfo=" + Group.JobInfo.replace(/%%/g, "__") + "&applycount=" + Group.reqIds.split(',').length, '_blank', 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                        if (switchSite) {
                            window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + Group.siteId + "&PageType=selectedgroup";
                        }
                        if (angular.isDefined(scope.oActiveLaddaButton))
                            scope.oActiveLaddaButton.stop();
                    }
                }

            }
        },
        removeDuplicateJobsforMultiApply: function () {
            $scope.MultipleApplyFormData.NoOfJobsExceededMaxLimit = $scope.MultipleApplyFormData.NoOfJobsExceededMaxLimit - $scope.MultipleApplyFormData.NoofJobsApplied;
            $scope.MultipleApplyFormData.NoofJobsApplied = 0;

            ngDialog.closeAll();
            if ($scope.MultipleApplyFormData.NoofJobsApplied > 0 || $scope.MultipleApplyFormData.ApplyDifference <= 0) {
                $('body').addClass('noScroll');
                ngDialog.open({
                    preCloseCallback: function (value) {
                        $('body').removeClass('noScroll');
                        $.restoreFocus();
                    },
                    template: 'MultipleApplyValidations', scope: $scope.MultipleApplyFormData, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
                });
            }
            else {
                $scope.postToNextPage(event, $scope.MultipleApplyFormData, 'apply');
            }

        },

        SaveToJobCartAjax: function (clientId, siteId, JobsToBeSaved, scope) {
            $scope.bJobsSaved = false;
            $scope.bJobSaved = false;
            if (JobsToBeSaved.length > 0) {
                var SaveToJobCartRequest = {
                    ClientId: clientId,
                    SiteId: siteId,
                    JobsToBeSaved: JobsToBeSaved,
                    SessionID: $("#CookieValue").val()
                };
                var url = '/TgNewUI/CandidateZone/Ajax/AddJobsToCart';
                $http.post(url, SaveToJobCartRequest).success(function (data, status, headers, config) {
                    $scope.SaveToCartPrompt(data, scope, JobsToBeSaved, $scope.bJobDetailsShown);
                });
            }
        },

        SaveToCartPrompt: function (data, oldScope, JobsToBeSaved, fromJobDetails) {
            $scope.bJobsAlreadySaved = false;
            $scope.JobsToBeDeSelected = 0;
            $scope.bJobsSavedExceeded = false;
            $scope.JobsAlreadyPresentInCart = data.JobsAlreadyPresentInCart;
            $scope.JobsAddedToCart = data.JobsAddedToCart;
            $scope.MaximumJobsToSave = 50;
            $scope.bJobsSavedReachedMaxLimit = (data.JobsSavedBeforeAddingToCart) >= $scope.MaximumJobsToSave && data.JobsToBeAddedToCart != 0 ? true : false;
            if (!$scope.bJobsSavedReachedMaxLimit) {
                $scope.bJobsSavedExceeded = (data.JobsSavedBeforeAddingToCart + data.JobsToBeAddedToCart) > $scope.MaximumJobsToSave ? true : false;
                if ($scope.bJobsSavedExceeded) {
                    $scope.JobsToBeDeSelected = (data.JobsSavedBeforeAddingToCart + data.JobsToBeAddedToCart) - ($scope.MaximumJobsToSave);
                }
                else {
                    if (data.JobsAlreadyPresentInCart != null && data.JobsAlreadyPresentInCart.length > 0) {
                        $scope.bJobsAlreadySaved = true;
                    }
                    else {
                        $scope.bJobsAlreadySaved = false;
                    }
                }
            }


            if (typeof fromJobDetails != 'undefined' && fromJobDetails && !($scope.bJobsSavedReachedMaxLimit || $scope.bJobsSavedExceeded || $scope.JobsAlreadyPresentInCart.length > 0)) {
                $scope.bJobSaved = true;
                $scope.adjustHeaderStickers();
            }
            else if ($scope.bSearchResults && !fromJobDetails && $scope.JobsAlreadyPresentInCart.length == 0 && $scope.JobsAddedToCart.length > 0) {
                $scope.bJobsSaved = true;
                $scope.adjustHeaderStickers();
            }
            else {
                $('body').addClass('noScroll');
                ngDialog.open({
                    preCloseCallback: function (value) {
                        if (!$scope.bJobDetailsShown && $scope.JobsAddedToCart.length > 0 && !($scope.bCandidateZone && $scope.bJobCart)) {
                            $scope.bJobsSaved = true;
                            $scope.adjustHeaderStickers();
                        }
                        $('body').removeClass('noScroll');
                        $.restoreFocus();
                    },
                    template: 'JobCartValidations', scope: $scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, ariaRole: "dialog", appendTo: '#dialogContainer'
                });
            }
            $scope.CallApply();
        },

        RemoveFromJobCartAjax: function (clientId, siteId, jobSiteInfo, jobFromDashBoard) {
            $scope.bJobRemovalStatus = false;
            var SelectedJobsRequest = {
                ClientId: clientId,
                SiteId: siteId,
                JobSiteInfo: jobSiteInfo,
                SessionID: $("#CookieValue").val()
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/RemoveSelectedJobs",
                data: SelectedJobsRequest,
                success: function (data) {
                    if (data.isSucess) {
                        $scope.bNotAppliedJobsInJobCart = false;
                        $scope.bAppliedJobsInJobCart = false;
                        if (typeof jobFromDashBoard != "undefined") {
                            _.remove($scope.jobs, jobFromDashBoard);
                        }
                        else {
                            $scope.jobs = _.where($scope.jobs, { "Selected": false });
                        }
                        $scope.CandZoneSavedJobsCount = $scope.jobs.length;
                        $scope.savedJobsCache = $scope.jobs;
                        $scope.bJobRemovalStatus = true;
                        if ($scope.jobs != null && $scope.jobs.length > 0) {
                            $scope.scrolltop();
                            if (_.where($scope.jobs, { "Applied": false }).length > 0) {
                                $scope.bNotAppliedJobsInJobCart = true;
                            }
                            if (_.where($scope.jobs, { "Applied": true }).length > 0) {
                                $scope.bAppliedJobsInJobCart = true;
                            }
                        }
                        $scope.SelectedJobsChecked = false;
                        setTimeout(function () {
                            $scope.$apply();
                        }, 0);
                        if (!$scope.utils.isNewHash('JobCart', $scope))
                            $scope.utils.updateHistory('JobCart');
                    }
                }
            });
        },


        ViewJobCartAjax: function (fromDashBoard) {
            if (fromDashBoard && $scope.savedJobsCache != null && $scope.savedJobsCache.length > 0) {
                $scope.bJobCart = true;
                $scope.jobs = $scope.savedJobsCache;
                $scope.CallApply();
                return;
            }
            var jobCartRequest = {
                partnerId: $("#partnerId").val(),
                siteId: $("#siteId").val(),
                sid: $("#CookieValue").val(),
                configuredJobTitle: $scope.GetConfiguredJobTitle()
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/ViewJobCart",
                data: jobCartRequest,
                success: function (data) {
                    $scope.renderJobCart(data, fromDashBoard);
                    if (!$scope.utils.isNewHash('JobCart', $scope))
                        $scope.utils.updateHistory('JobCart');
                    $scope.setHash();
                }
            });
        },

        renderJobCart: function (response, fromDashBoard) {
            $scope.bNotAppliedJobsInJobCart = false;
            $scope.bAppliedJobsInJobCart = false;
            $scope.bJobRemovalStatus = false;
            $scope.bInitialLoad = false;
            $scope.SelectedJobsChecked = false;
            if ($scope.jobsCache == null) {//As the Jobs gets overrided with Saved Jobs, Saving them to a temp, such that we can assign them back, When Job Cart is left.
                $scope.jobsCache = $scope.jobs;
            }
            $scope.jobs = response.SavedJobs;
            if (fromDashBoard) {
                $scope.CandZoneSavedJobsCount = $scope.jobs.length;
            }
            if ($scope.jobs != null && $scope.jobs.length > 0) {
                if (_.where($scope.jobs, { "Applied": false }).length > 0) {
                    $scope.bNotAppliedJobsInJobCart = true;
                }
                if (_.where($scope.jobs, { "Applied": true }).length > 0) {
                    $scope.bAppliedJobsInJobCart = true;
                }
            }
            $scope.savedJobsCache = $scope.jobs;
            if (response.ExpiredJobs != null && response.ExpiredJobs.length > 0) {
                $scope.bShowExpiredJobAlert = true;
                $scope.expiredJobs = response.ExpiredJobs;
            }
            else {
                $scope.bShowExpiredJobAlert = false;
            }
            $scope.bJobCart = true;
            if ($scope.bJobDetailsShown) {
                $scope.bJobDetailsShown = false;
            }
            if (!fromDashBoard) {
                $scope.bCandidateZone = true;
                $timeout(function () { appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = 'JobCart'; }, 0);
            }
            $scope.CloseDialogs();
            $scope.scrolltop();
            $scope.CallApply();
            if (fromDashBoard) {
                $scope.alignCards("SavedJobsContainer", "jobCard");
            }
        },

        alignCards: function (container, elementClass) {
            var isApplicationsContainer = false;
            if (container == "ApplicationsContainer") {
                isApplicationsContainer = true;
                container = "CollapsedUnfinishedApplications";
            }
            $("." + container + " ." + elementClass).css("height", "auto").find('.cardFooter').removeClass('cardFooterPosition');
            $timeout(function () {
                var heights = $("." + container + " ." + elementClass).map(function () {
                    return $(this).height();
                }).get();
                var maxHeight = _.max(heights);
                $("." + container + " ." + elementClass).height(maxHeight).find('.cardFooter').addClass('cardFooterPosition');
            }, 0);
            if (isApplicationsContainer) {
                $scope.alignCards("CollapsedAppliedApplications", "jobCard");
            }
        },

        FileManagerAjax: function () {
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
            $scope.setTitle("MyFile");
            $scope.bcandidatezoneSubmenu = false;
            var fileManagerRequest = {
                partnerId: $("#partnerId").val(),
                siteId: $("#siteId").val(),
                sid: $("#CookieValue").val()
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/FileManager",
                data: fileManagerRequest,
                success: function (data) {
                    $scope.renderFileManager(data);
                    if (!$scope.utils.isNewHash('myFiles', $scope))
                        $scope.utils.updateHistory('myFiles');
                    $scope.setHash();
                }
            });
        },

        resetFileStatus: function () {
            $scope.fileStatus = 0;
        },

        resetCategory: function () {
            $('#AttachementCatagory').val('');
            $('#AttachementCatagory-button_text').text($('#attachmentCategoryPlaceHolder').text());
        },

        renderFileManager: function (response) {
            $scope.bFileManager = true;
            var savedFiles = response.SavedFiles;

            $scope.savedResumes = _.filter(savedFiles, function (file) {
                return file.FileType == 0;
            });

            $scope.savedCoverLetters = _.filter(savedFiles, function (file) {
                return file.FileType == 1;
            });

            $scope.savedAttachments = _.filter(savedFiles, function (file) {
                return file.FileType == 2;
            });

            $scope.savedCategories = _.keys(_.countBy($scope.savedAttachments, function (file) { return file.CategoryName; }));

            $scope.attachmentCategories = response.AttachmentCategories;

            if (!$scope.utils.isNewHash('MyFile', $scope))
                $scope.utils.updateHistory('MyFile');
            $scope.setHash();

            $scope.scrolltop();
            $scope.CallApply();
            if ($scope.fileStatus == 3) {
                setTimeout(function () { $scope.resetCategory(); }, 0);
            }
            setTimeout(function () {
                $('#AttachementCatagory-button').attr("aria-controls", "AttachementCatagory");
            }, 500);
        },

        addAttachment: function () {
            if ($("#AttachementCatagory").val() != undefined && $("#AttachementCatagory").val() != "")
                $scope.addFile("2", $("#AttachementCatagory").val());
        },

        openFile: function (filePath, FileName) {
            filePath = filePath.replace(/\+/g, "_plus_");
            window.location.href = "/TGNewUI/Profile/Home/PreviewResume?EncryptedResumePath=" + filePath + " &FileName=" + FileName;
        },

        openAttachment: function (AttchmentName, AttachmentID) {

            if ($scope.encryptedBruid.indexOf('+') === -1)
                var BRUID = $scope.encryptedBruid;
            else
                var BRUID = $scope.encryptedBruid.replace(/\+/g, "||");

            window.location.href = "/GQWeb/DownloadAttachment?partnerid=" + $("#partnerId").val() + "&BRUID=" + BRUID + "&FileName=" + AttchmentName + "&AttachmentId=" + AttachmentID;
        },

        addFile: function (fileType, AttachmentCat) {
            ngDialog.open({
                preCloseCallback: function (value) {
                    var $iframe = $("#profileBuilder"),
                         frameWindow = $iframe.prop("contentWindow");

                    if (frameWindow != undefined) {
                        frameWindow.blur();
                        document.body.focus();
                        $iframe.remove();
                    }

                    if (AttachmentCat) {
                        $scope.resetCategory();
                    }
                },
                template: "<iframe scrolling='no' allowtransparency='true' id='profileBuilder' title='Profile Builder' style='border:0px' src='/TGNewUI/Profile/Home/ProfileBuilder?encryptedSessionId=" + $("#CookieValue").val() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&calledFrom=addfile&FileType=" + fileType + "&AttachmentCat=" + encodeURI(AttachmentCat) + "' tabindex='0'> </iframe>",
                plain: true,
                className: 'ngdialog-theme-default dialogWithIFrame',
                showClose: false,
                closeByDocument: false
            });
        },
        showRemovePromt: function (job) {
            $('body').addClass('noScroll');
            var dialog = ngDialog.open({
                preCloseCallback: function (value) {
                    $('body').removeClass('noScroll');
                    $.restoreFocus();
                },
                template: 'RemovalConfirmation',
                scope: $scope,
                className: 'ngdialog-theme-default customDialogue RemovalConfirmationContainer',
                showClose: true,
                closeByDocument: false,
                appendTo: "#dialogContainer",
                ariaRole: "dialog",
                data: { Job: job }
            });
        },
        deleteFile: function (fileType, fileId, isDeletable) {
            var dialog = ngDialog.open({
                template: 'DeleteFileConfirmationTemplate',
                className: 'ngdialog-theme-default',
                showClose: true,
                closeByDocument: false,
                appendTo: "#menuContainer",
                ariaRole: "dialog",
                data: { FileType: fileType, FileDeletable: isDeletable }
            });
            dialog.closePromise.then(function (data) {
                if (data.value == '1') {
                    var fileManagerRequest = {
                        partnerId: $("#partnerId").val(),
                        siteId: $("#siteId").val(),
                        sid: $("#CookieValue").val(),
                        fileType: fileType,
                        fileId: fileId
                    };
                    $.ajax({
                        type: "POST",
                        url: "/TgNewUI/CandidateZone/Ajax/DeleteFile",
                        data: fileManagerRequest,
                        success: function (data) {
                            if (fileType == 0)
                                $scope.fileStatus = -1;
                            else if (fileType == 1)
                                $scope.fileStatus = -2;
                            else if (fileType == 2)
                                $scope.fileStatus = -3;

                            $scope.renderFileManager(data);
                        }
                    });
                } else {
                    angular.beforeDialogClose();
                }
            });
        },

        AccountSettingsView: function () {
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "AccountSettings";
            $scope.setTitle("AccountSettings");
            $scope.bInitialLoad = false;
            if (!$scope.updateAccount.login) {
                $scope.updateAccount =
                    {
                        login: {
                            userName: '',
                            currentPassword: '',
                            newPassword: '',
                            confirmNewPassword: ''
                        },
                        errormsgs: [],
                        displayPasswordErrorBox: false,
                        displayRePasswordErrorBox: false,
                        mainError: '',
                        updated: '',
                        submitted: false,
                        LIOption: 1,
                        FBOption: 1,
                        LIConnect: false,
                        FBConnect: false,
                        TWConnect: false,
                        SMUpdateStatus: 0
                    };
            };
            var accountSettingsRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val()
            };

            $http.post("/TgNewUI/CandidateZone/Ajax/ViewAccountSettings", accountSettingsRequest).success(function (data, status, headers, config) {
                $scope.UserName = data.LoginInfo;
                _.forEach(data.SMAuthorizations, function (sm) {
                    switch (sm.SMId) {
                        case 1:
                            $scope.updateAccount.LIConnect = true;
                            $scope.updateAccount.LIOption = sm.Option;
                            break;
                        case 2:
                            $scope.updateAccount.FBConnect = true;
                            $scope.updateAccount.FBOption = sm.Option;
                            break;
                        case 3:
                            $scope.updateAccount.TWConnect = true;
                            break;
                    }
                });
                if (!$scope.updateAccount.LIConnect) {
                    $scope.updateAccount.LINewOption = 1;
                }
                if (!$scope.updateAccount.FBConnect) {
                    $scope.updateAccount.FBNewOption = 1;
                }
            }
            );
            $scope.subViewInitialized = true;
            if (!$scope.utils.isNewHash('accountSettings', $scope))
                $scope.utils.updateHistory('accountSettings');
            $scope.setHash();
        },

        updateLogin: function (updateType) {
            $scope.updateAccount.login = {
                userName: '',
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            };
            $scope.updateAccount.mainError = '';
            if (updateType == 'security') {
                $scope.ResetChangeSecQuestfunction($scope);
                var url = "/TgNewUI/CandidateZone/Ajax/GetSecurityQuestions";
                var securityQuestionRequest = {};
                securityQuestionRequest.ClientId = $("#partnerId").val();
                securityQuestionRequest.SiteId = $("#siteId").val();
                securityQuestionRequest.SessionID = $("#CookieValue").val();
                $http.post(url, securityQuestionRequest).success(function (data, status, headers, config) {
                    if (data) {
                        if (data.SecurityAnswerOne) {
                            $scope.ChangeSecQuest.securityQuestion.value1 = data.SecurityQuestionOneId;
                            $scope.ChangeSecQuest.securityQuestion.answer1 = data.SecurityAnswerOne;
                        }
                        if (data.SecurityAnswerTwo) {
                            $scope.ChangeSecQuest.securityQuestion.value2 = data.SecurityQuestionTwoId;
                            $scope.ChangeSecQuest.securityQuestion.answer2 = data.SecurityAnswerTwo;
                        }
                        if (data.SecurityAnswerThree) {
                            $scope.ChangeSecQuest.securityQuestion.value3 = data.SecurityQuestionThreeId;
                            $scope.ChangeSecQuest.securityQuestion.answer3 = data.SecurityAnswerThree;
                        }
                    };
                }).error(function (data, status, headers, config) {
                    $scope.updateAccount.mainError = "Error getting security questions";
                    console.log("failed with status of " + status);
                    return false;
                });

            }
            $('body').addClass('noScroll');
            ngDialog.open({
                preCloseCallback: function (value) {
                    $('body').removeClass('noScroll');
                    $.restoreFocus();
                },
                template: 'resetUserNamePasswordTemplate',
                scope: $scope,
                className: 'ngdialog-theme-default customDialogue updateAccountDialog',
                showClose: true,
                closeByDocument: false,
                appendTo: "#dialogContainer",
                ariaRole: "dialog",
                data: { UpdateType: updateType }
            });

            setTimeout(function () {
                $('#optSecurityQuestion1').selectmenu('refresh', true);
                $('#optSecurityQuestion2').selectmenu('refresh', true);
                $('#optSecurityQuestion3').selectmenu('refresh', true);
            }, 1000);
        },

        openSendToFriend: function (sendToFriendCalledFrom, jobs) {

            var nameString = $scope.ProfileDetails ? $scope.ProfileDetails.FirstName + ($scope.ProfileDetails.LastName ? " " + $scope.ProfileDetails.LastName : "") : "";
            var jobTitles = [];
            var moreJobTitles = [];
            if (sendToFriendCalledFrom == "1") {
                $.each(jobs, function (key, job) {
                    var obj = $.grep(job.Questions, function (e) { return e.ClassName == "jobtitle" });
                    var info = {};
                    info.ClassName = "jobtitleInJobDetails";
                    info.AnswerValue = obj[0].Value
                    if (key < 3) {
                        jobTitles.push(info);
                    }
                    else {
                        moreJobTitles.push(info)
                    }
                }
            )
            }
            else {
                jobTitles = $.grep(jobs.JobDetailQuestions, function (e) { return e.ClassName == "jobtitleInJobDetails" });
            }
            $scope.sendToFriendInfo = {
                email: '',
                name: nameString,
                yourEmail: $scope.ProfileDetails && $scope.ProfileDetails.email ? $scope.ProfileDetails.email : "",
                jobTitles: jobTitles,
                moreJobTitles: moreJobTitles,
                showMore: false,
            };
            $scope.sendToFriendCalledFrom = sendToFriendCalledFrom;
            $('body').addClass('noScroll');
            ngDialog.open({
                preCloseCallback: function (value) {
                    $('body').removeClass('noScroll');
                    $.restoreFocus();
                },
                template: 'sendToFriendTemplate',
                scope: $scope,
                className: 'ngdialog-theme-default customDialogue updateAccountDialog',
                showClose: false,
                closeByDocument: false,
                appendTo: "#menuContainer",
                ariaRole: "dialog",
                data: {}
            });

        },

        sendToFriendMoreClick: function () {
            $scope.showMore = !$scope.showMore;
        },

        submitSendToFriend: function (sendToFriendForm, scope) {
            $scope.sendToFriendInfo.mainError = '';
            $scope.sendToFriendInfo.errormsgs = [];
            $("[aria-invalid]").removeAttr("aria-invalid");

            $.each(sendToFriendForm.$error, function (errorType, allErrors) {
                if (allErrors != false) {
                    if (errorType == "required") {

                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            msg.error = ' - ' + $scope.getRequiredErrorByName(error.$name);
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.sendToFriendInfo.errormsgs.push(msg);

                        });
                    }

                    if (errorType == "pattern") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            if (error.$name == "yourName")
                                msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_InvalidName;
                            else
                                msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_InvalidEmail;
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.sendToFriendInfo.errormsgs.push(msg);
                        });
                    }
                }
            });

            if (sendToFriendForm.$valid) {

                var sendToFriendRequest = {};
                sendToFriendRequest.ClientId = $("#partnerId").val();
                sendToFriendRequest.SiteId = $("#siteId").val();
                sendToFriendRequest.jobInfo = $scope.jobInfo;
                sendToFriendRequest.fromEmailAddress = sendToFriendForm.yourEmail.$modelValue
                sendToFriendRequest.ToEmailAddress = sendToFriendForm.email.$modelValue
                sendToFriendRequest.JobSiteInfo = $scope.jobSiteInfo;
                sendToFriendRequest.CalledFromPage = $scope.sendToFriendCalledFrom;
                sendToFriendRequest.senderName = sendToFriendForm.yourName.$modelValue

                url = '/TgNewUI/Search/Ajax/SendToFriend';

                $http.post(url, sendToFriendRequest).success(function (data, status, headers, config) {

                    if (data.EmailStatus == '0') {
                        $scope.sendToFriendInfo.emailSent = sendToFriendRequest.CalledFromPage;
                    }
                    else {
                        $scope.sendToFriendInfo.emailSent = 'error'
                    }
                    ngDialog.closeAll();

                })

            }

        },
        submitUpdateAccount: function (updateAccountForm, scope) {
            $scope.updateAccount.mainError = '';
            $scope.updateAccount.errormsgs = [];
            $("[aria-invalid]").removeAttr("aria-invalid");
            if ($scope.updateAccount.login.newPassword && $scope.updateAccount.login.newPassword != "" && $scope.updateAccount.login.newPassword.indexOf(" ") > 0) {
                var msg = {};
                msg.label = '';
                msg.error = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                msg.field = "password";
                $("#" + msg.field).attr("aria-invalid", "true");
                $scope.updateAccount.errormsgs.push(msg);
                return;
            }

            var updateType = scope.ngDialogData.UpdateType;
            if (updateType == 'security') {
                $scope.ChangeSecQuest.submitted1 = true;
                $scope.ChangeSecQuest.submitted2 = true;
                $scope.ChangeSecQuest.submitted3 = true;

                updateAccountForm.selectSecurityQuestion1.$setValidity('duplicate', true);
                if (updateAccountForm.selectSecurityQuestion2)
                    updateAccountForm.selectSecurityQuestion2.$setValidity('duplicate', true);
                if (updateAccountForm.selectSecurityQuestion3)
                    updateAccountForm.selectSecurityQuestion3.$setValidity('duplicate', true);

                updateAccountForm.securityQuestion1Answer.$setValidity('duplicate', true);
                if (updateAccountForm.securityQuestion2Answer)
                    updateAccountForm.securityQuestion2Answer.$setValidity('duplicate', true);
                if (updateAccountForm.securityQuestion3Answer)
                    updateAccountForm.securityQuestion3Answer.$setValidity('duplicate', true);

                //check Duplicate Question
                if (scope.ChangeSecQuest.noOfSecurityQuestions != 1 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value1) && scope.ChangeSecQuest.securityQuestion.value1 !== '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value2) && scope.ChangeSecQuest.securityQuestion.value2 !== '') {
                    if (scope.ChangeSecQuest.securityQuestion.value1 == scope.ChangeSecQuest.securityQuestion.value2) {
                        updateAccountForm.selectSecurityQuestion1.$setValidity('duplicate', false);
                        updateAccountForm.selectSecurityQuestion2.$setValidity('duplicate', false);
                    }
                }
                if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value1) && scope.ChangeSecQuest.securityQuestion.value1 !== '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value3) && scope.ChangeSecQuest.securityQuestion.value3 !== '') {
                    if (scope.ChangeSecQuest.securityQuestion.value1 == scope.ChangeSecQuest.securityQuestion.value3) {
                        updateAccountForm.selectSecurityQuestion1.$setValidity('duplicate', false);
                        updateAccountForm.selectSecurityQuestion2.$setValidity('duplicate', false);
                    }
                }
                if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value2) && scope.ChangeSecQuest.securityQuestion.value2 !== '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value3) && scope.ChangeSecQuest.securityQuestion.value3 !== '') {
                    if (scope.ChangeSecQuest.securityQuestion.value2 == scope.ChangeSecQuest.securityQuestion.value3) {
                        updateAccountForm.selectSecurityQuestion2.$setValidity('duplicate', false);
                        updateAccountForm.selectSecurityQuestion3.$setValidity('duplicate', false);
                    }
                }


                //check for duplicate answer
                if (scope.ChangeSecQuest.noOfSecurityQuestions != 1 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer1) && scope.ChangeSecQuest.securityQuestion.answer1 !== '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer2) && scope.ChangeSecQuest.securityQuestion.answer2 !== '') {
                    if (scope.ChangeSecQuest.securityQuestion.answer1 == scope.ChangeSecQuest.securityQuestion.answer2) {
                        updateAccountForm.securityQuestion1Answer.$setValidity('duplicate', false);
                        updateAccountForm.securityQuestion2Answer.$setValidity('duplicate', false);
                        scope.ChangeSecQuest.errorAnwser1 = true;
                        scope.ChangeSecQuest.errorAnwser2 = true;
                    }
                }
                if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer1) && scope.ChangeSecQuest.securityQuestion.answer1 !== '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer3) && scope.ChangeSecQuest.securityQuestion.answer3 !== '') {
                    if (scope.ChangeSecQuest.securityQuestion.answer1 == scope.ChangeSecQuest.securityQuestion.answer3) {
                        updateAccountForm.securityQuestion1Answer.$setValidity('duplicate', false);
                        updateAccountForm.securityQuestion3Answer.$setValidity('duplicate', false);
                        scope.ChangeSecQuest.errorAnwser1 = true;
                        scope.ChangeSecQuest.errorAnwser3 = true;
                    }
                }
                if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer2) && scope.ChangeSecQuest.securityQuestion.answer2 !== '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer3) && scope.ChangeSecQuest.securityQuestion.answer3 !== '') {
                    if (scope.ChangeSecQuest.securityQuestion.answer2 == scope.ChangeSecQuest.securityQuestion.answer3) {
                        updateAccountForm.securityQuestion2Answer.$setValidity('duplicate', false);
                        updateAccountForm.securityQuestion3Answer.$setValidity('duplicate', false);
                        scope.ChangeSecQuest.errorAnwser2 = true;
                        scope.ChangeSecQuest.errorAnwser3 = true;
                    }
                }
            }

            $.each(updateAccountForm.$error, function (errorType, allErrors) {
                if (allErrors != false) {
                    if (errorType == "required") {
                        var nxtvalue = 0;
                        $.each(allErrors, function (index, error) {
                            if (error.$name != "confirmNewPassword") {
                                var msg = {};
                                if (nxtvalue == 0 || error.$name != 'securityQuestion' + nxtvalue + 'Answer') {
                                    msg.label = $scope.getLabelByName(error.$name);
                                    msg.error = ' - ' + $scope.getRequiredErrorByName(error.$name);
                                    msg.field = error.$name;
                                    $("#" + msg.field).attr("aria-invalid", "true");
                                    $scope.updateAccount.errormsgs.push(msg);
                                }
                                if (error.$name == 'updateSecurityQuestion1') {
                                    nxtvalue = 1;
                                }
                                else if (error.$name == 'updateSecurityQuestion2') {
                                    nxtvalue = 2;
                                }
                                else if (error.$name == 'updateSecurityQuestion3') {
                                    nxtvalue = 3;
                                }
                                else {
                                    nxtvalue = 0;
                                }
                            }
                        });
                    }
                    if (errorType == "duplicate") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            if (error.$name.indexOf('Answer') >= 0) {
                                msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_SecurityAnswerMustBeUnique;
                                msg.field = error.$name;
                            }
                            else {
                                msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_SecurityQuestionAlreadyUsed;
                                msg.field = error.$name.replace('select', 'opt');
                            }

                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.updateAccount.errormsgs.push(msg);
                        });
                    }
                    if (errorType == "notValidLength") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            if ($scope.response.ClientSettings.TGPasswordStrength.toLowerCase() == 'default')
                                msg.error = ' - ' + $scope.dynamicStrings.Errormessage_Mustbe6characters;
                            else
                                msg.error = ' - ' + $scope.dynamicStrings.Errormessage_Mustbe8to25characters;
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.updateAccount.errormsgs.push(msg);
                        });
                    }
                    if (errorType == "noSpecialCharacter") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            msg.error = ' - ' + $scope.dynamicStrings.Errormessage_MustContainSpecialCharacter;
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.updateAccount.errormsgs.push(msg);
                        });
                    }
                    if (errorType == "pattern") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            if (updateType == "username") {
                                if ($scope.tgSettings.LoginType == '1')
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_InvalidUsername;
                                else
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_InvalidEmail;
                            } else if (updateType == "security") {
                                msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_InvalidSecurityAnswer;
                            }
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.updateAccount.errormsgs.push(msg);
                        });
                    }
                    if (errorType == "nxEqual") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.dynamicStrings.Label_ReenterPassword;
                            msg.error = ' - ' + $scope.dynamicStrings.Errormessage_PasswordMustMatch;
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.updateAccount.errormsgs.push(msg);
                        });
                    }
                }
            });


            if (updateAccountForm.$valid) {
                if ($scope.updateAccount.mainError == "") {
                    var updateAccountRequest = {};
                    updateAccountRequest.ClientId = $("#partnerId").val();
                    updateAccountRequest.SiteId = $("#siteId").val();
                    var url;
                    if (updateType == 'username') {
                        updateAccountRequest.SessionID = $("#CookieValue").val();
                        updateAccountRequest.LoginInfo = $scope.updateAccount.login.userName;
                        url = '/TgNewUI/CandidateZone/Ajax/UpdateLogin';
                    }
                    else if (updateType == 'password') {
                        updateAccountRequest.EncryptedSessionId = $("#CookieValue").val();
                        updateAccountRequest.OldPassword = $scope.updateAccount.login.currentPassword;
                        updateAccountRequest.NewPassword = $scope.updateAccount.login.newPassword;
                        updateAccountRequest.Source = 'AccountSettings';
                        url = '/TgNewUI/CandidateZone/Ajax/ChangePassword';
                    } else if (updateType == 'security') {
                        updateAccountRequest = {};
                        updateAccountRequest.partnerId = $("#partnerId").val();
                        updateAccountRequest.siteId = $("#siteId").val();
                        updateAccountRequest.SQuestionOne = ($scope.ChangeSecQuest.securityQuestion.value1 === '') ? '' : $scope.ChangeSecQuest.securityQuestion.value1;
                        updateAccountRequest.SQuestionTwo = ($scope.ChangeSecQuest.securityQuestion.value2 === '') ? '' : $scope.ChangeSecQuest.securityQuestion.value2;
                        updateAccountRequest.SQuestionThree = ($scope.ChangeSecQuest.securityQuestion.value3 === '') ? '' : $scope.ChangeSecQuest.securityQuestion.value3;
                        updateAccountRequest.SAnswerOne = ($scope.ChangeSecQuest.securityQuestion.answer1 == '') ? '' : $scope.ChangeSecQuest.securityQuestion.answer1;
                        updateAccountRequest.SAnswerTwo = ($scope.ChangeSecQuest.securityQuestion.answer2 == '') ? '' : $scope.ChangeSecQuest.securityQuestion.answer2;
                        updateAccountRequest.SAnswerThree = ($scope.ChangeSecQuest.securityQuestion.answer3 == '') ? '' : $scope.ChangeSecQuest.securityQuestion.answer3;
                        updateAccountRequest.cookievalue = $("#CookieValue").val();
                        updateAccountRequest.Source = 'AccountSettings';
                        url = '/TgNewUI/Search/Ajax/ChangeSecurityQuestion';
                    } else if (updateType == 'delete') {
                        updateAccountRequest.SessionID = $("#CookieValue").val();
                        url = '/TgNewUI/CandidateZone/Ajax/DeleteAccount';
                    }
                    $http.post(url, updateAccountRequest).success(function (data, status, headers, config) {
                        if (data) {
                            if (updateType == 'username') {
                                if (data.Result == "-1") {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_UpdateLoginFail;
                                    return false;
                                }
                                else if (data.Result == "3") { //bad username
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_UsenameAlreadyUsed;
                                    return false;
                                }
                                else if (data.Result == "0") {
                                    $scope.UserName = $scope.updateAccount.login.userName;
                                    $scope.updateAccount.updated = updateType;
                                    ngDialog.closeAll();
                                    $timeout(function () {
                                        $scope.$apply();
                                    }, 0);
                                    return true;
                                }
                            } else if (updateType == 'password') {
                                if (data.Result == "0") {
                                    $scope.updateAccount.updated = updateType;
                                    ngDialog.closeAll();
                                    $timeout(function () {
                                        $scope.$apply();
                                    }, 0);
                                    return true;
                                } else if (data.Result == "3") {
                                    //$scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_SameUsernamePasswrd;

                                    var msg = {};
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_SameUsernamePasswrd;
                                    msg.field = "newPassword";
                                    msg.label = $scope.getLabelByName("newPassword");
                                    $scope.updateAccount.errormsgs.push(msg);
                                    updateAccountForm.newPassword.$setValidity("passwordSameAsUsername", false);
                                    return false;
                                } else if (data.Result == "5") {
                                    var msg = {};
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_RecentlyUsedPasswrd;
                                    msg.field = "newPassword";
                                    msg.label = $scope.getLabelByName("newPassword");
                                    $scope.updateAccount.errormsgs.push(msg);
                                    updateAccountForm.newPassword.$setValidity("recentlyUsedPasswrd", false);
                                    return false;
                                }
                                else if (data.Result == "6" || data.Result == "7") {
                                    if ($scope.response.ClientSettings.TGPasswordStrength.toLowerCase() == 'default')
                                        $scope.updateAccount.mainError = $scope.dynamicStrings.Errormessage_Mustbe6characters
                                    else
                                        $scope.updateAccount.mainError = $scope.dynamicStrings.Errormessage_Mustbe8to25characters;
                                    return false;
                                }
                                else if (data.Result == "8") {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                                    return false;
                                }
                                else if (data.Result == "9") {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.Errormessage_MustContainSpecialCharacter;
                                    return false;
                                } else if (data.Result == "11") {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_IncorrectCurrentPassword;
                                    return false;
                                }
                                else if (data.Result == "12") {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_PasswordRecentChange;
                                    return false;
                                } else if (data.Result == "4") {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_SameOldNewPasswrd;
                                    return false;
                                }
                                else {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_UpdatePasswordFail;
                                    console.log("failed with status of " + status);
                                    return false;
                                }

                            } else if (updateType == 'security') {
                                if (data.Success == true) {
                                    $scope.updateAccount.updated = updateType;
                                    ngDialog.closeAll();
                                    $timeout(function () {
                                        $scope.$apply();
                                    }, 0);
                                    return true;
                                } else {
                                    $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_UpdateSecurityQuestionFail;
                                    console.log("failed with status of " + status);
                                    return false;
                                }
                            } else if (updateType == 'delete') {
                                if (data.Result == '1') {
                                    $scope.updateAccount.updated = updateType;
                                    ngDialog.closeAll();
                                    $scope.logOutCandidate();
                                    return true;
                                }
                            }
                        };
                    }).error(function (data, status, headers, config) {
                        $scope.updateAccount.mainError = $scope.dynamicStrings.ErrorMessage_UpdateLoginFail;
                        console.log("failed with status of " + status);
                        return false;
                    });
                }
            }
            else {
                $(".errorContainer:visible").setFocus();
            }
        },

        showInvalidUpdateLoginDetails: function () {
            if (["optSecurityQuestion1", "optSecurityQuestion2", "optSecurityQuestion3"].indexOf($('#updateAccountForm .ng-invalid').first().attr("ID")) !== -1) {
                $('[id="' + $('#updateAccountForm .ng-invalid').first().attr("ID") + '-button"]').focus();
            }
            else
                $('#updateAccountForm .ng-invalid').first().focus();
        },

        updateSMSetting: function (smSite, revokeAccess) {
            if (smSite == 2 && !revokeAccess) {
                if ($scope.updateAccount.FBNewOption == $scope.updateAccount.FBOption) {
                    $scope.updateAccount.SMUpdateStatus = -2;
                    $scope.updateAccount.SMUpdateError = 'Option has not changed';
                    return;
                }
            }
            var updateAccountRequest = {};
            updateAccountRequest.ClientId = $("#partnerId").val();
            updateAccountRequest.SiteId = $("#siteId").val();
            updateAccountRequest.SessionID = $("#CookieValue").val();
            updateAccountRequest.SMSiteId = smSite;
            if (revokeAccess) {
                updateAccountRequest.Option = -1;
            } else if (smSite == 2) {
                updateAccountRequest.Option = $scope.updateAccount.FBNewOption;
            }
            url = '/TgNewUI/CandidateZone/Ajax/UpdateSocialMediaSetting';
            $http.post(url, updateAccountRequest).success(function (data, status, headers, config) {
                if (data) {
                    if (data.Result == 1) {
                        $scope.updateAccount.SMUpdate = 0;
                        if (revokeAccess) {
                            $scope.updateAccount.SMUpdateStatus = 3 + smSite;
                            switch (smSite) {
                                case 1:
                                    $scope.updateAccount.LIConnect = false;
                                    $scope.updateAccount.LINewOption = 1;
                                    break;
                                case 2:
                                    $scope.updateAccount.FBConnect = false;
                                    $scope.updateAccount.FBNewOption = 1;
                                    break;
                                case 3:
                                    $scope.updateAccount.TWConnect = false;
                                    break;
                            }
                        } else {
                            $scope.updateAccount.SMUpdateStatus = smSite;
                            if (smSite == 2) {
                                $scope.updateAccount.FBOption = $scope.updateAccount.FBNewOption;
                            }
                        }
                    } else {
                        $scope.updateAccount.SMUpdateStatus = -1 * smSite;
                    }
                };
            }).error(function (data, status, headers, config) {
                $scope.updateAccount.mainError = "Update Social Media setting failed";
                console.log("failed with status of " + status);
                return false;
            });
        },

        authorizeSM: function (smSite, isUpdate) {
            var option = 2;
            if (smSite == 1) {
                if (isUpdate && $scope.updateAccount.LINewOption == $scope.updateAccount.LIOption) {
                    $scope.updateAccount.SMUpdateStatus = 1; //not need to update
                    $scope.updateAccount.SMUpdate = 0;
                    return;
                }
                option = $scope.updateAccount.LINewOption;
            }
            else if (smSite == 2)
                option = $scope.updateAccount.FBNewOption;
            var BRUID;
            if ($scope.encryptedBruid.indexOf('+') === -1)
                BRUID = $scope.encryptedBruid;
            else
                BRUID = $scope.encryptedBruid.replace(/\+/g, "||");

            var socialmediaurl = "../../../tgwebhost/socialmediaIntegration.aspx?action=smsetting&smsid=" + smSite + "&clientid=" + $("#partnerId").val() + "&bruid=" + BRUID + "&callee=TG&tgsiteid=" + $("#siteId").val() + "&option=" + option + "&sid=" + $("#SIDValue").val() + "&oht=1";
            window.open(socialmediaurl, "_blank", "resizable=yes,scrollbar=yes, top=200, left=200");
        },

        updateSocialMediaSettingCallback: function (smSite) {
            $scope.updateAccount.SMUpdateStatus = 6 + parseInt(smSite);
            $scope.updateAccount.SMUpdate = 0;
            if (smSite == 1) {
                if ($scope.updateAccount.LIConnect) {
                    $scope.updateAccount.SMUpdateStatus = 1;
                } else
                    $scope.updateAccount.LIConnect = true;
                $scope.updateAccount.LIOption = $scope.updateAccount.LINewOption;
            } else if (smSite == 2) {
                $scope.updateAccount.FBConnect = true;
                $scope.updateAccount.FBOption = $scope.updateAccount.FBNewOption;
            } else if (smSite == 3) {
                $scope.updateAccount.TWConnect = true;
            }
        },

        showSMInfo: function (helpId) {
            var helpDiv = $('#' + helpId);
            if ($scope.SMPopupId != '' && $scope.SMPopupId != helpId)
                $('#' + $scope.SMPopupId).removeClass("show");

            var helpIcon = helpDiv.closest(".fa-info-circle");
            if (helpIcon.offset().left > 150)
                helpDiv.offset({ left: helpIcon.offset().left - 143 });
            else
                helpDiv.offset({ left: 5 });

            helpDiv.addClass("show");
            helpDiv.find('.closeHelp').focus();
            $scope.SMPopupId = helpId;
        },

        hideSMInfo: function (event, helpId) {
            event.stopPropagation();
            $('#' + helpId).removeClass("show");
            $scope.SMPopupId = '';
        },
        OpenCloseAssessments: function (hrefUrl) {
            var Assesmentwindow = window.open(hrefUrl, "Assessments");

            Assesmentwindow.onunload = function () {
                $scope.renderAssessments();
            };
        },

        renderAssessments: function (URL) {

            if (sessionStorage.getItem('showAssessmentsCompletionMessage') == null) {
                sessionStorage.setItem('showAssessmentsCompletionMessage', true);
            }
            $scope.showAssessmentsCompletionMessage = sessionStorage.getItem('showAssessmentsCompletionMessage') == "true";
            $scope.bCandidateZone = true;
            $scope.AutoLaunchAssessUrl = "";
            $scope.bCanZoneJobsLoadingState = true;
            $scope.candidatezoneSubView = 'ResponsiveAssessment';
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "Assessments";
            $scope.setTitle("Assessments");
            $scope.bInitialLoad = false;
            $scope.bJobDetailsShown = false;
            _.each($scope.CandidateZoneData.Links, function (Link) {
                if (Link.CandidateZoneLinkId == "ResponsiveAssessment") {
                    $scope.PendingAssessmentsUrl = Link.CandidateZoneLinkURL;
                    return;
                }
            });

            var showCompletionMessage = true;
            if (typeof URL != 'undefined' && URL != null && URL != "") {
                $scope.PendingAssessmentsUrl = URL;
                showCompletionMessage = false;
            }
            $scope.setHash();
            $.ajax({
                type: "POST",
                url: $scope.PendingAssessmentsUrl,
                success: function (data) {
                    if ($location.hash() == "ResponsiveAssessment") {
                        $scope.bJobDetailsShown = false;
                        $scope.bSelectedGroup = false;
                        $scope.bCandidateZone = true;
                        $scope.candidatezoneSubView = 'ResponsiveAssessment';
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "Assessments";
                        $scope.setTitle("Assessments");
                        $scope.bInitialLoad = false;
                        $scope.PendingAssessments = data.PendingAssessments;
                        $scope.AutoLaunchAssessUrl = data.AutoLaunchAssessUrl;
                        var pendingAssessmentsCount = 0;
                        $scope.currentAssessmentCompleted = false;
                        if ($scope.PendingAssessments != null) {
                            pendingAssessmentsCount = $scope.PendingAssessments.length;
                        }
                        if (sessionStorage.getItem('PendingAssessmentsCount') != null && showCompletionMessage) {
                            if (pendingAssessmentsCount < sessionStorage.getItem('PendingAssessmentsCount')) {
                                $scope.currentAssessmentCompleted = true;
                            }
                        }
                        sessionStorage.setItem('PendingAssessmentsCount', pendingAssessmentsCount);
                        $scope.bCanZoneJobsLoadingState = false;
                        $timeout(function () {
                            $scope.alignCards("AssesmentsCards", "jobCard");
                        }, 1000);
                        if (!$scope.utils.isNewHash('ResponsiveAssessment', $scope))
                            $scope.utils.updateHistory('ResponsiveAssessment');
                        $scope.setHash();
                        if ( $scope.PendingAssessments.length > 0 && $scope.AutoLaunchAssessUrl != null && $scope.AutoLaunchAssessUrl != "") {
                            $scope.OpenCloseAssessments($scope.AutoLaunchAssessUrl);
                        }
                    }
                },
                error: function (xhr, textStatus, error) {
                    $scope.bCanZoneJobsLoadingState = false;
                }
            });

           

        },
        SocialRefQAfocusAt: function (scope) {
            if (scope === undefined) {
                $("[name='" + $scope.SocialRefErrormsgs[0].field + "']").scrollAndFocus().focus();
            } else
                $("[name='" + this.msgs.field + "']").scrollAndFocus().focus();
            setTimeout(function () { $scope.$apply(); }, 0);
        },
        SocialRefexecuteQB: function (prevqbchildren, qbchildren, parentid) {

            $.each(prevqbchildren, function (index, value) {
                if (value != "" && value != "undefined") {
                    if ($("[id='Container_" + value + "']").length == 0) return;
                    var $childControl = $("[id='Container_" + value + "']");

                    if ($childControl.attr("QBParent")) {
                        var QBParent = $childControl.attr("QBParent").split(",");
                        _.remove(QBParent, function (Parentid) {
                            return Parentid === parentid;
                        });
                        $childControl.attr('QBParent', parentid);
                        $childControl.addClass("hiddenQB");
                    }
                    else {
                        $childControl.removeAttr('QBParent');
                        $childControl.addClass("hiddenQB");
                    }
                }
            });

            $.each(qbchildren, function (index, value) {
                if (value != "" && value != "undefined") {
                    if ($("[id='Container_" + value + "']").length == 0) return;

                    var $childControl = $("[id='Container_" + value + "']");
                    if ($childControl.attr("QBParent")) {
                        $childControl.attr('QBParent', parentid);
                        $childControl.removeClass("hiddenQB");
                    }
                    else {
                        $childControl.attr('QBParent', parentid);
                        $childControl.removeClass("hiddenQB");
                    }
                    if (typeof $childControl.css("background-color") != "undefined" && !$childControl.css("background-color").match(/255/gi)) {
                        $childControl.effect("highlight", {}, 2000);
                    }
                }
            });

        },
        referralFieldsChange: function (RefQuestion) {

            var qbExecutable = _.pick(_.map(RefQuestion.Options, function (option) {
                if (option.FieldName == RefQuestion.Answer)
                    return option.QBChildren;
            }), _.identity);
            qbExecutable = _.chain(_.map(qbExecutable, function (o) { return o.split(/,\s*/) })).flatten().__wrapped__;

            var qbRevertable = _.pick(_.map(RefQuestion.Options, "QBChildren"), _.identity);
            qbRevertable = _.chain(_.map(qbRevertable, function (o) { return o.split(/,\s*/) })).flatten().__wrapped__;


            $scope.SocialRefexecuteQB(qbRevertable, qbExecutable, RefQuestion.QuestionId)

            switch (RefQuestion.QuestionType) {
                case 'checkbox':
                    var Answers = "";
                    var result = _.select(RefQuestion.Options, function (obj) {
                        if (obj.selected)
                            (Answers.length > 0) ? Answers = Answers + "#@#" + obj.FieldLabel : Answers = obj.FieldLabel;
                        return obj.selected === true
                    });
                    RefQuestion.Answer = Answers;
                    console.log('check');
                    break;
                case 'radio':
                    console.log('radio');
                    break;
                case 'single-select':
                    if (RefQuestion.Answer != "") {
                        $("#" + RefQuestion.QuestionId + "-button").removeClass('error');
                    }
                    else if ($scope.RefDetailSubmit && RefQuestion.Required) {
                        $("#" + RefQuestion.QuestionId + "-button").addClass('error');
                    }
                    console.log('single');
                    break;
                case 'multi-select':
                    if (RefQuestion.Answer !== undefined && RefQuestion.Answer.length > 0) {
                        $("#" + RefQuestion.QuestionId + "-button").removeClass('error');
                    }
                    else if ($scope.RefDetailSubmit && RefQuestion.Required) {
                        $("#" + RefQuestion.QuestionId + "-button").addClass('error');
                    }
                    console.log('multi');
                    break;
            }
        },
        referralDetailsBack: function () {
            $scope.$root.workFlow = $scope.workFlow = "Not referral";
            history.back();
        },
        renderReferralQuestions: function (langID) {
            SRRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionID: $("#CookieValue").val(),
                LocaleId: $scope.tgSettings.DefLocaleId,
                LangId: langID == null || langID == undefined ? appScope.tgSettings.DefLanguageId : langID
            }
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/GetSocialReferralQuestionAndAnswers",
                data: SRRequest,
                success: function (data) {
                    $scope.SocialRefQA = data;
                    $scope.RefDetailSubmit = false;
                    $scope.SocialRefQARequired = _.some($scope.SocialRefQA.Questions, function (questions) {
                        return questions.Required == true;
                    });
                    _.each($scope.SocialRefQA.Questions, function (questions) {

                        if (questions.QuestionType == "checkbox") {
                            var CheckboxAnswer = questions.Answer;
                            questions.Options = _.map(questions.Options, function (element, questions) {
                                if (CheckboxAnswer.indexOf(element.FieldName) > -1)
                                    return _.extend({}, element, { selected: true });
                                else
                                    return _.extend({}, element, { selected: false });
                            });
                        }

                        if (questions.QuestionType == "radio") {
                            var RadioAnswer = questions.Answer;
                            questions.Options = _.map(questions.Options, function (element, questions) {
                                if (RadioAnswer.indexOf(element.FieldName) > -1)
                                    return _.extend({}, element, { selected: true });
                                else
                                    return _.extend({}, element, { selected: false });
                            });
                        }
                        if (questions.QuestionType == "date") {
                            $scope["date_" + questions.QuestionId] = {
                                datepickerConfig: {
                                    showOn: "button",
                                    buttonText: appScope.dynamicStrings ? appScope.dynamicStrings.AriaLabel_CalButton : "Choose date from calendar",
                                    dateFormat: "m/d/yy",
                                    maxDate: 0,
                                    localeCode: response.ClientSettings.LocaleCode,
                                    shortMonthNames: $("#shortMonthNames").val(),
                                    onSelect: function (sDateText, oDatepicker) {
                                        var selectedDate = oDatepicker.selectedYear + "/" + (oDatepicker.selectedMonth + 1) + "/" + oDatepicker.selectedDay;
                                        var scope = angular.element(this).scope(),
                                            RefQuestion = angular.nearestScopeVal("RefQuestion", scope)

                                        if (sDateText === "") {//clear icon clicked
                                            selectedDate = "";
                                        }

                                        RefQuestion.Answer = selectedDate;
                                    },
                                }
                            };

                        }
                    });

                    $scope.$root.workFlow = $scope.workFlow = "ReferralDetails";
                    $scope.setTitle("Referrals");
                    //$("#ReferralDetailsForm").validate().settings.ignore = ":hidden *";
                    $("#ReferralDetailsForm").validate({
                        ignore: ":hidden"
                    });
                    $timeout(function () {
                        $scope.$apply();
                    }, 0);
                    $scope.setHash();
                },
                error: function (error) {
                    $timeout(function () {
                        $scope.$apply();
                    }, 0);
                    $scope.setTitle("Referrals");
                    $scope.setHash();
                }
            });
        },
        evaluateFormElements: function (scope, id, expression) {
            var myelement = "Input_" + id;

            if (expression === undefined && (scope.ReferralDetailsForm[myelement] != undefined)) {
                if (scope.ReferralDetailsForm[myelement].$error)
                    return true;
                else
                    return false;
            } else if (scope.ReferralDetailsForm[myelement] != undefined) {
                switch (expression) {
                    case "$error.number":
                        if (scope.ReferralDetailsForm[myelement].$error.number) return true; else return false;
                        break;
                    case "$error.pattern":
                        if (scope.ReferralDetailsForm[myelement].$error.pattern) return true; else return false;
                        break;
                    case "$error.required":
                        if (scope.ReferralDetailsForm[myelement].$error.required) return true; else return false;
                        break;
                    case "$error.email":
                        if (scope.ReferralDetailsForm[myelement].$error.email) return true; else return false;
                        break;
                    case "$error.max":
                        if (scope.ReferralDetailsForm[myelement].$error.max) return true; else return false;
                        break;
                    case "$error.min":
                        if (scope.ReferralDetailsForm[myelement].$error.min) return true; else return false;
                        break;
                    case "$error.dateString":
                        if (scope.ReferralDetailsForm[myelement].$error.dateString) return true; else return false;
                        break;
                    case "$error.dateRange":
                        if (scope.ReferralDetailsForm[myelement].$error.dateRange) return true; else return false;
                        break;
                }

            } else {
                return true;
            }
        },
        saveReferralQuestions: function (scope) {
            $scope.RefDetailSubmit = true;
            if ($("form[name='ReferralDetailsForm']").valid()) {
                var Fields = [];
                _.each($scope.SocialRefQA.Questions, function (question) {
                    if (question.QuestionType == "multi-select") {
                        var Answers = _.map(question.Answer).join('#@#')
                        question.Answer = Answers;
                    }
                    Fields.push({
                        Answers: question.Answer,
                        QuestionId: question.QuestionId,
                        FormTypeId: question.FormTypeId,
                        Questiontype: question.QuestionType
                    });

                });


                scope.oActiveLaddaButton.start();
                var SaveSRRequest = {
                    PartnerId: $("#partnerId").val(),
                    SiteId: $("#siteId").val(),
                    EncryptedSession: $("#CookieValue").val(),
                    LocaleId: $scope.tgSettings.DefLocaleId,
                    Fields: Fields
                }
                $.ajax({
                    type: "POST",
                    url: "/TgNewUI/CandidateZone/Ajax/SaveSocialReferralQuestionAndAnswers",
                    contentType: 'application/json',
                    data: JSON.stringify(SaveSRRequest),
                    success: function (data) {
                        scope.oActiveLaddaButton.start();
                        $scope.referralDetailsBack();
                        $timeout(function () {
                            $scope.$apply();
                        }, 0);
                        $timeout(function () {
                            appScope.SocialReferral_READY = $scope.SocialReferral_READY = "yes";
                            if ($('#SocialReferralButton').is(':visible')) {
                                $("#SocialReferralButton").click();
                            } else {
                                $("#submitGeneralReferral").click();
                            }
                        }, 1000);
                    },
                    error: function (error) {
                    }
                });
            }
            else {


                $scope.SocialRefErrormsgs = [];
                _.each($scope.SocialRefQA.Questions, function (question) {
                    if (question.QuestionType == "multi-select") {
                        if (question.Answer !== undefined && question.Answer.length > 0)
                            $("#" + question.QuestionId + "-button").removeClass('error');
                        else if (question.Required)
                            $("#" + question.QuestionId + "-button").addClass('error');
                    }
                    else if (question.QuestionType == "single-select") {
                        if (question.Answer != "")
                            $("#" + question.QuestionId + "-button").removeClass('error');
                        else if (question.Required)
                            $("#" + question.QuestionId + "-button").addClass('error');
                    }
                });
                $.each(scope.ReferralDetailsForm.$error, function (errorType, allErrors) {
                    if (allErrors != false) {
                        console.log(errorType);
                        $.each(allErrors, function (index, error) {
                            if ($("[name='" + error.$name + "']").is(":visible")) {
                                var msg = {};
                                if ($('label[for="' + error.$name.replace(/^\D+/g, '') + '"]')[0] !== undefined)
                                    msg.label = $('label[for="' + error.$name.replace(/^\D+/g, '') + '"]')[0].innerText;
                                else
                                    msg.label = $('label[for="' + error.$name.replace(/^\D+/g, '') + '-button"]')[0].innerText;
                                if (errorType == "required") {
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_RequiredField;
                                } else if (errorType == "email") {
                                    msg.error = ' - ' + $scope.dynamicStrings.ErrorMessage_InvalidEmail;
                                } else if (errorType == "pattern") {
                                    msg.error = ' - ' + $scope.dynamicStrings.Msg_InvalidField;
                                }
                                else if (errorType == "max") {
                                    msg.error = ' - ' + $scope.dynamicStrings.MsgMax.replace("{0}", $("input[name*='" + error.$name + "']").attr("max"));
                                }
                                else if (errorType == "min") {
                                    msg.error = ' - ' + $scope.dynamicStrings.MsgMin.replace("{0}", $("input[name*='" + error.$name + "']").attr("min"));
                                }
                                else if (errorType == "dateString") {
                                    msg.error = ' - ' + appScope.dynamicStrings.ErrorMessage_InvalidDate;
                                }
                                else if (errorType == "dateRange") {
                                    msg.error = ' - ' + appScope.dynamicStrings.ErrorMessage_InvalidDateRange.replace("[MINDATE]", $("input[name*='Input_14341']").data().minDate).replace("[MAXDATE]", $("input[name*='Input_14341']").data().maxDate);
                                }
                                msg.field = error.$name;
                                $("#" + msg.field).attr("aria-invalid", "true");
                                $scope.SocialRefErrormsgs.push(msg);
                            }
                        });
                    }
                });
                $timeout(function () {
                    $(".errorContainer").scrollAndFocus();

                }, 100);
                return false;
            }

        },
        CommunicationView: function (startIndex) {

            $scope.bInitialLoad = false;

            if (startIndex !== undefined) {
                $scope.commHistStartIndex = startIndex;
            };

            var communicationRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SID: $("#CookieValue").val(),
                calledFrom: 'Archive',
                startIndex: $scope.commHistStartIndex
            };

            $http.post("/TgNewUI/CandidateZone/Ajax/CommunicationHistory", communicationRequest).success(function (data, status, headers, config) {
                $scope.communications = data.CommunicationDetails;
                $scope.commHistShowMore = data.showMoreButton;
                $scope.subViewInitialized = true;
                if (!$scope.utils.isNewHash('communication', $scope))
                    $scope.utils.updateHistory('communication');
                $scope.setHash();
                $scope.setTitle("Communication");

                $timeout(function () {
                    $scope.equalheight(".cardList .jobCard");
                }, 100);
            }
            );
        },

        equalheight: function (container) {
            var currentTallest = 0;
            $(container).each(function () {
                $el = $(this);
                $($el).height('auto');
                if (currentTallest < $el.height())
                    currentTallest = $el.height();
            });

            $(container).each(function () {
                $el = $(this);
                $($el).height(currentTallest);
            });
        },

        ViewCommunicationDetail: function (commId) {
            var communicationRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SID: $("#CookieValue").val(),
                CommunicationId: commId
            };

            $http.post("/TgNewUI/CandidateZone/Ajax/CommunicationDetail", communicationRequest).success(function (data, status, headers, config) {
                if (data.EmailMessage == "")
                    data.EmailMessage = $scope.dynamicStrings.Msg_Blank_Message_Content;
                ngDialog.open({
                    preCloseCallback: function (value) {
                        $.restoreFocus();
                    },
                    template: 'communicationDetailTemplate',
                    scope: $scope,
                    className: 'ngdialog-theme-default customDialogue CommunicationDetailDialog',
                    showClose: true,
                    closeByDocument: false,
                    appendTo: "#menuContainer",
                    ariaRole: "dialog",
                    data: { commDetail: data, commId: commId }
                });

            }
            );

        },

        UpdateCommStatus: function (commId, viewStatus, refresh) {
            var communicationRequest = {
                ClientId: $("#partnerId").val(),
                SID: $("#CookieValue").val(),
                CommunicationId: commId,
                ViewStatus: viewStatus
            };

            $http.post("/TgNewUI/CandidateZone/Ajax/UpdateCommunicationStatus", communicationRequest).success(function (data, status, headers, config) {
                ngDialog.closeAll();
                if (viewStatus == 2)
                    $scope.communicationDeleted = true;
                if (refresh)
                    $scope.CommunicationView();

                if ((viewStatus == 3 || viewStatus == 4) && $scope.messages.length > 0) {
                    $scope.messages = _.filter($scope.messages, function (o) { return o.CommunicationId !== commId; });
                }
            });
        },

        DeleteCommunication: function (commId) {
            ngDialog.open({
                preCloseCallback: function (value) {
                    $.restoreFocus();
                },
                template: 'deleteCommunicationTemplate',
                scope: $scope,
                className: 'ngdialog-theme-default customDialogue CommunicationDetailDialog',
                showClose: true,
                closeByDocument: false,
                appendTo: "#menuContainer",
                ariaRole: "dialog",
                data: { commId: commId }
            });
        },

        clearCommDeleteConfirmation: function () {
            $scope.communicationDeleted = false;
        },

        notificationShow: false,
        notificationView: "notification",
        bellNumber: 0,
        lastBellNumberCheck: null,
        messages: [],

        ToggleNotification: function () {
            $scope.notificationShow = !$scope.notificationShow;
        },

        NotificationMenu: function (view) {
            $scope.notificationView = view;

            if (view == 'message') {
                var communicationRequest = {
                    ClientId: $("#partnerId").val(),
                    SiteId: $("#siteId").val(),
                    SID: $("#CookieValue").val(),
                    calledFrom: 'Bell',
                    startIndex: $scope.commHistStartIndex
                };

                $http.post("/TgNewUI/CandidateZone/Ajax/CommunicationHistory", communicationRequest).success(function (data, status, headers, config) {
                    $scope.messages = data.CommunicationDetails;
                }
                );
            }

        },

        getNotificationMsgCount: function () {

            if ($scope.lastBellNumberCheck && (new Date() - $scope.lastBellNumberCheck < 60000))
                return;

            var communicationRequest = {
                ClientId: $("#partnerId").val(),
                SID: $("#CookieValue").val(),
            };

            $http.post("/TgNewUI/CandidateZone/Ajax/GetBellNumber", communicationRequest).success(function (data, status, headers, config) {
                $scope.bellNumber = data.MessageNotificationsCount;
                $scope.lastBellNumberCheck = new Date();
            }
            );
        },

        ArchiveAllMessages: function () {
            if ($scope.messages.length == 0)
                return;

            var communicationRequest = {
                ClientId: $("#partnerId").val(),
                SID: $("#CookieValue").val(),
                CommunicationIds: _.pluck($scope.messages, 'CommunicationId').join(",")
            };

            $http.post("/TgNewUI/CandidateZone/Ajax/ArchiveAllMessage", communicationRequest).success(function (data, status, headers, config) {
                $scope.messages = [];
                $scope.bellNumber = 0;
                $scope.lastBellNumberCheck = new Date();
            }
            );
        },

        ViewMessageArchive: function () {
            $scope.notificationShow = false;
            $scope.bCandidateZone = true;
            $scope.candidatezoneSubView = 'messageArchive';
            $scope.CommunicationView();
        },

        postToNextPage: function (event, scope, calledFrom) {
            $scope.calledFrom = calledFrom;
            ngDialog.closeAll();
            if (angular.isDefined(scope.oActiveLaddaButton))
                scope.oActiveLaddaButton.start();
            var selectedJobs = {};
            var jobId, gqId, jobInfo, parterId, siteId, langId, jobSiteInfo, chkJobClientIds, postValues, allSelectedJobsSiteIds, localeId, isGQResponsive, encryptedBruid, switchSite, jobTitle, JobsToBeSaved = [];
            $scope.MaxConSubmissionError = false;
            selectedJobs = _.where(scope.jobs, { "Selected": true });
            if (selectedJobs.length == 0) {
                alert($scope.dynamicStrings.Message_SelectAJobPosting);
                return;
            }
            else if (calledFrom == "mulapplyvald" && selectedJobs.length > scope.maxConReqSubmission) {
                scope.dialogCalledfrom = 'Apply';
                $scope.MaxConSubmissionError = true;
                $scope.MaxConReqSubmissionMessage = $scope.tgSettings.MaxConReqSubmissionMessage.replace("#maximum_concurrent_req_submissions#", scope.maxConReqSubmission)
                if ($scope.tgSettings.MaxConReqSubmissionMessage == "") {
                    $scope.MaxConReqSubmissionMessage = $scope.dynamicStrings.MaxConcurrentMessage.replace("#maximum_concurrent_req_submissions#", scope.maxConReqSubmission)
                }
                if (angular.isDefined(scope.oActiveLaddaButton))
                    scope.oActiveLaddaButton.stop();
                $('body').addClass('noScroll');
                ngDialog.open({
                    preCloseCallback: function (value) {
                        $('body').removeClass('noScroll');
                        $.restoreFocus();
                    },
                    template: 'MultipleApplyValidations', scope: scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
                });
                return;
            }
            if (calledFrom == "apply" && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.responsiveGQforSingleJob) {
                scope.isGQResponsive = $scope.SearchResultsJobsSelectedScope.responsiveGQforSingleJob;
            }
            //var selectedJobIds = _.each(selectedJobs, function (job) {   _.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString().join(",") });
            selectedJobs = _.sortBy(selectedJobs, function (job) { return _.pluck(_.where(job.Questions, { "QuestionName": "jobtitle" }), "Value").toString(); });
            _(selectedJobs).forEach(function (job) {
                gqId = _.pluck(_.where(job.Questions, { "QuestionName": "gqid" }), "Value").toString();
                langId = _.pluck(_.where(job.Questions, { "QuestionName": "jobreqlanguage" }), "Value").toString();
                siteId = _.pluck(_.where(job.Questions, { "QuestionName": "siteid" }), "Value").toString();
                jobTitle = _.pluck(_.where(job.Questions, { "QuestionName": "jobtitle" }), "Value").toString();
                partnerId = $("#partnerId").val();
                if (jobId == undefined) {
                    jobId = _.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString();
                    partnerId = $("#partnerId").val();
                    scope.jobIds = jobId;
                    scope.jobInfo = "%%" + jobId + "|" + langId + "|" + gqId + "%%";
                    scope.jobSiteInfo = jobId + "_" + siteId;
                    scope.groupGQId = gqId;
                    allSelectedJobsSiteIds = siteId;
                    localeId = job.localeId;
                    encryptedBruid = scope.encryptedBruid;
                }
                else {
                    jobId = _.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString();
                    scope.jobIds = scope.jobIds + "," + jobId;
                    scope.jobInfo = scope.jobInfo + jobId + "|" + langId + "|" + gqId + "%%";
                    scope.jobSiteInfo = scope.jobSiteInfo + "," + jobId + "_" + siteId;
                    scope.groupGQId = scope.groupGQId + "," + gqId;
                    allSelectedJobsSiteIds = allSelectedJobsSiteIds + "," + siteId;
                }

                JobsToBeSaved.push({ JobTitle: jobTitle, ReqId: jobId, SiteId: siteId, JobReqLang: langId, LocaleId: job.localeId });

            });

            if (calledFrom == "mulapplyvald" || (calledFrom == "save" && !$scope.bLoggedIn) || (calledFrom == "refer" && !$scope.bLoggedIn)) {
                if (!$scope.bLoggedIn) {
                    if ($scope.bSearchResults && !$scope.bJobDetailsShown && $scope.$root.workFlow == "searchResults") {
                        $("#hSMJobId").val(scope.jobIds);
                    }
                    if (angular.isDefined(scope.oActiveLaddaButton))
                        scope.oActiveLaddaButton.stop();
                    $scope.SearchResultsJobsSelectedScope = scope;
                    if ($scope.tgSettings.SSOGateway != "1") {
                        $scope.showMobileSignInDialog(scope);
                    }
                    return;
                }
                else if (calledFrom == "mulapplyvald") {
                    $scope.MultipleApplyDupCheckAjax(scope, partnerId, $("#siteId").val(), scope.jobSiteInfo, selectedJobs);
                }

            }
            else {
                var searchCriteria
                if (calledFrom == "apply" && !(_.max(scope.groupGQId.split(",")) == _.min(scope.groupGQId.split(",")) && _.max(allSelectedJobsSiteIds.split(",")) == _.min(allSelectedJobsSiteIds.split(",")))) {
                    searchCriteria = scope.GetSearchCriteria(scope.jobSiteInfo);
                }
                else {
                    searchCriteria = scope.GetSearchCriteria();
                }
                var url = '/TgNewUI/Search/Ajax/SaveSearchCriteriaInSessionXML';
                $http.post(url, searchCriteria).success(function (data, status, headers, config) {
                    if (angular.isDefined(scope.oActiveLaddaButton))
                        scope.oActiveLaddaButton.stop();
                    switch (calledFrom) {
                        case "apply":
                            var type = "";
                            if (($scope.bresponsiveCandidateZone && $scope.bCandidateZone && $scope.bJobCart) || $scope.$root.workFlow == 'JobCart') {
                                type = "cart";
                            }
                            else {
                                type = "search";
                            }
                            if (_.max(scope.groupGQId.split(",")) == _.min(scope.groupGQId.split(",")) && _.max(allSelectedJobsSiteIds.split(",")) == _.min(allSelectedJobsSiteIds.split(","))) {
                                if (_.max(allSelectedJobsSiteIds.split(",")) != $("#siteId").val()) {
                                    $scope.switchSite(siteId, "fromApply");
                                    switchSite = true;
                                    //switch site
                                }
                                if (_.max(scope.groupGQId.split(",")) == "0") {
                                    postValues = { JobInfo: scope.jobInfo, ApplyCount: selectedJobs.length, type: type, JobSiteId: siteId, hdRft: $("#rfToken").val() };

                                    redirectPage = "apply.aspx";
                                    $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();
                                }
                                else {
                                    if ($.queryParams().applyTest || scope.isGQResponsive) {
                                        //IS responsive GQ
                                        $scope.jobApplyUrl = "&tqid=" + gqId + "&localeid=" + localeId + "&reqid=" + scope.jobIds + "&partnerid=" + partnerId + "&siteid=" + siteId + "&wbmode=false&loadingViaAjax=true";
                                        if (switchSite) {
                                            if ($scope.bCandidateZone && $scope.bJobCart) {
                                                window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&TQId=" + gqId + "&bruid=" + encodeURIComponent(encryptedBruid) + "&reqid=" + scope.jobIds + "&calledFrom=JobCart";
                                            }
                                            else {
                                                window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&TQId=" + gqId + "&bruid=" + encodeURIComponent(encryptedBruid) + "&reqid=" + scope.jobIds + "&calledFrom=SearchResults";
                                            }
                                        }
                                        else {
                                            var rft = $("[name='__RequestVerificationToken']").val();
                                            $.ajax({
                                                method: "GET",
                                                url: "/gqweb/apply?bruid=" + encodeURIComponent(encryptedBruid) + "&tqid=" + gqId + "&reqid=" + scope.jobIds + "&partnerid=" + partnerId + "&siteid=" + siteId + "&wbmode=false&loadingViaAjax=true&RFT=" + rft,
                                                success: function (result) {
                                                    if ($scope.bJobCart) {
                                                        $scope.bGQLaunchedFromJobCart = true;
                                                    }
                                                    $scope.$root.applyResponse = result;
                                                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                                    setTimeout(function () {
                                                        $scope.$apply();
                                                    }, 0);
                                                }
                                            });
                                        }

                                    }
                                    else {
                                        if (scope.tgSettings.Mobileoptimised == "true") {
                                            postValues = { JobInfo: scope.jobInfo, ApplyCount: selectedJobs.length, type: type, JobSiteId: siteId, GQLoginURL: "../" + localeId + "/asp/tg/GQLogin.asp?SID=GQSESSION&sjfsr=true&bBasic=false&gqid=" + _.max(scope.groupGQId.split(",")) + "&jobinfo=" + scope.jobInfo.replace(/%%/g, "__") + "&applycount=" + selectedJobs.length + "&type=" + type + "&mobile=1", hdRft: $("#rfToken").val() };//need to change gqlogin url
                                            redirectPage = "apply.aspx";
                                            $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();

                                        }
                                        else {
                                            $scope.bCreateAccount = false;
                                            window.open("../../../" + localeId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val() + "&sjfsr=true&bBasic=false&gqid=" + _.max(scope.groupGQId.split(",")) + "&jobinfo=" + scope.jobInfo.replace(/%%/g, "__") + "&applycount=" + selectedJobs.length, '_blank', 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                                            if (switchSite) {
                                                window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&PageType=searchresults";
                                            }
                                        }
                                    }

                                }
                            } else {
                                //New Selected Group page
                                $scope.SelectedGroupAjax(partnerId, $("#siteId").val(), scope.jobSiteInfo);
                            }
                            break;

                        case "save":
                            $scope.SaveToJobCartAjax(partnerId, siteId, JobsToBeSaved, scope);
                            break;

                        case "share":
                            postValues = { JobInfo: scope.jobInfo, JobSiteInfo: scope.jobSiteInfo, hdRft: $("#rfToken").val() };
                            if ($scope.bresponsiveCandidateZone) {
                                $scope.jobInfo = scope.jobInfo;
                                $scope.jobSiteInfo = scope.jobSiteInfo;
                                $scope.openSendToFriend("1", selectedJobs);
                                break;
                            }
                            else if (scope.tgSettings.Mobileoptimised == "true") {
                                redirectPage = "mobile/sharejob.aspx";
                            }
                            else {
                                redirectPage = "emailtofriend.aspx";
                            }
                            $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST', "_blank").submit();
                            break;
                        case "refer":
                            if (scope.SocialReferral_READY == "yes") {
                                scope.LaunchSocialReferralMenu(scope, $("#SocialReferralButton")[0]);
                            }
                            else {
                                if (appScope.tgSettings.EnableResponsiveSocialReferralQuestions == "true") {
                                    $scope.renderReferralQuestions(langId);
                                }
                                else {
                                    $scope.jobIds = scope.jobIds;
                                    redirectPage = "socialnetworkreferral.aspx";
                                    postValues = { ButtonId: "SocialReferralButton", hdRft: $("#rfToken").val() }
                                    $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST', "_blank").submit();
                                }
                            }
                            break;
                        case "remove":
                            $scope.RemoveFromJobCartAjax(partnerId, siteId, scope.jobSiteInfo);
                            break;

                    }
                }).error(function (data, status, headers, config) {
                    //console.log("failed with status of " + status);
                });
            }
        },
        LaunchSocialReferralMenu: function (scope, button) {
            setTimeout($scope.$apply(), 0);
            if (button == undefined)
                button = $("#SocialReferralButton")[0];
            var urlstring = "../../referral/home/referralworkflowoptions?siteid=" + scope.SocialReferral_SiteId + "&partnerid=" + $("#partnerId").val() + "&localeid=" + scope.SocialReferral_LocaleId + "&bruid=" + scope.SocialReferral_ProfileId + "&jobids=" + scope.jobIds.replace(/,/g, '_') + "&fn=" + scope.SocialReferral_FirstName + "&ln=" + scope.SocialReferral_LastName;
            window.dialogBuilder.showDialog(button, urlstring);
        },
        checkHotJob: function (scope) {
            return _.pluck(_.where(scope.job.Questions, { "QuestionName": "hotjob" }), "Value").toString().toLowerCase() == "yes";
            //return _.pluck(_.where(scope, { "QuestionName": "hotjob" }), "Value").toString().toLowerCase() == "yes";
        },
        scrolltop: function () {

            var body = $("html, body");
            body.animate({ scrollTop: 0 }, '500', 'swing');
            $(".homeContentLiner").scrollTop(0);

        },
        //hasScrolledDown:function(){
        //    if(window.sc)
        //},
        CheckboxChecked: function (scope) {
            if (scope.job.Selected && scope.job.isSocialReferralJobRestricted && !$scope.jobRestrictedJobSelected) {
                $scope.jobRestrictedJobSelected = true;
                $scope.$apply();
                $("#SocialReferralButton").addClass("disabledClass");

            }
            else if ((_.where(_.where($scope.jobs, { "Selected": true }), { "isSocialReferralJobRestricted": true }).length == 0) && $scope.jobRestrictedJobSelected) {
                $scope.jobRestrictedJobSelected = false;
                $scope.$apply();
                if ($("#SocialReferralButton").hasClass("disabledClass")) $("#SocialReferralButton").removeClass("disabledClass");

            }

            if ((_.where(_.where($scope.jobs, { "Selected": true })).length > 0))
                $scope.SelectedJobsChecked = true;
            else
                $scope.SelectedJobsChecked = false;
            if (!$scope.utils.isNewHash($scope.$location.hash(), $scope))
                $scope.utils.updateHistory($scope.$location.hash());
        },
        SaveReqsToCart: function (Group, scope) {
            if ($scope.bLoggedIn) {
                scope.oActiveLaddaButton.start();
                var SaveCartRequest = {};
                SaveCartRequest.partnerId = $("#partnerId").val();
                SaveCartRequest.siteId = $("#siteId").val();;
                SaveCartRequest.SelectedGroups = _.reject($scope.SelectedGroups, {
                    JobInfo: Group.JobInfo
                });
                SaveCartRequest.encryptedSession = $("#CookieValue").val();
                var url = '/TgNewUI/Search/Ajax/SaveToCart';
                if (SaveCartRequest.SelectedGroups.length > 0) {
                    $http.post(url, SaveCartRequest).success(function (data, status, headers, config) {
                        $scope.GroupJobApplyAjax(Group, scope);
                    });
                }
                else {
                    $scope.GroupJobApplyAjax(Group, scope);
                }
            }
            else {
                $scope.postToNextPage('', scope, 'mulapplyvald');
            }

        },

        GetSearchCriteria: function (jobSiteInfo) {
            var powerSearchOptions = [];
            if (that.powerSearchQuestions != "") {
                _.forEach(that.powerSearchQuestions, function (aQuestion) {
                    var obj = {};
                    obj.VerityZone = aQuestion.VerityZone;
                    obj.Type = aQuestion.QuestionType;
                    if (aQuestion.IsAutoComplete && aQuestion.QId == 0) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.IsAutoComplete) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                        obj.Value = aQuestion.Value;
                    }
                    else {
                        obj.OptionCodes = _.pluck(_(aQuestion.Options).where({ Selected: true }).value(), "OptionValue");
                    }
                    powerSearchOptions.push(obj)
                });
            }
            var searchCriteria = {};
            searchCriteria.partnerId = $("#partnerId").val();
            searchCriteria.siteId = $("#siteId").val();
            searchCriteria.keyword = $scope.keyWordSearch.text;
            searchCriteria.location = $scope.locationSearch.text;
            searchCriteria.keywordCustomSolrFields = that.keywordFields;
            searchCriteria.locationCustomSolrFields = that.locationFields;
            facetFilterFields = _.forEach(this.$parent.facets, function (facet) { return _.filter(facet.Options, { Selected: true }) });

            if ($scope.locationSearch.text != "") {
                searchCriteria.Latitude = that.latitude;
                searchCriteria.Longitude = that.longitude;
            }
            else {
                searchCriteria.Latitude = 0;
                searchCriteria.Longitude = 0;
            }
            searchCriteria.facetfilterfields = { "Facet": facetFilterFields };
            searchCriteria.powersearchoptions = { "PowerSearchOption": powerSearchOptions };
            searchCriteria.SortType = $("#sortBy").val() != undefined ? $scope.sortFields[$("#sortBy").val()].Name : "";
            searchCriteria.pageNumber = that.pageNumber;
            searchCriteria.encryptedSessionValue = $("#CookieValue").val();
            if (jobSiteInfo) {
                searchCriteria.JobSiteIds = jobSiteInfo;
            }
            return searchCriteria;

        },
        postToNextPageFromDetails: function (event, scope, calledFrom) {
            $scope.calledFrom = calledFrom;
            $scope.backtobSignInView = false;
            $scope.bJobDetailsShown = true;
            var switchSite = false;
            referButton = $("#SocialReferralButton")[0];
            var jobId, gqId, jobInfo, partnerId, siteId, langId, jobSiteInfo, chkJobClientIds, postValues, isGQResponsive, localeId, encryptedBruid, sid, origSiteId;
            var Questions = scope.jobDetailFields.JobDetailQuestions;
            var JobsToBeSaved = [];
            jobId = _.pluck(_.where(Questions, { "VerityZone": "reqid" }), "AnswerValue").toString();
            gqId = _.pluck(_.where(Questions, { "VerityZone": "gqid" }), "AnswerValue").toString();
            langId = _.pluck(_.where(Questions, { "VerityZone": "jobreqlanguage" }), "AnswerValue").toString();
            partnerId = $("#partnerId").val();
            origSiteId = $("#siteId").val();
            siteId = _.pluck(_.where(Questions, { "VerityZone": "siteid" }), "AnswerValue").toString();

            scope.jobIds = jobId;
            sid = $("#SIDValue").val();
            scope.siteId = siteId;
            isGQResponsive = scope.jobDetailFields.isGQResponsive;
            localeId = scope.jobDetailFields.localeId;
            encryptedBruid = scope.encryptedBruid;
            jobInfo = "%%" + jobId + "|" + langId + "|" + gqId + "%%";
            $scope.jobSiteInfo = jobId + "_" + siteId;

            var jobTitle = _.pluck(_.where(Questions, { "VerityZone": "jobtitle" }), "AnswerValue").toString();
            JobsToBeSaved.push({ JobTitle: jobTitle, ReqId: jobId, SiteId: siteId, JobReqLang: langId, LocaleId: localeId });

            var searchCriteria = scope.GetSearchCriteria();
            var url = '/TgNewUI/Search/Ajax/SaveSearchCriteriaInSessionXML';
            var groupGQId = gqId;
            //Temporary POC code - TO BE REMOVED
            if ((calledFrom == "apply") && ($.queryParams().applyTest || isGQResponsive)) {
                if (siteId != origSiteId) {
                    $scope.jobApplyUrl = "&tqid=" + gqId + "&reqid=" + jobId + "&partnerid=" + partnerId + "&siteid=" + siteId + "&calledFrom=JobDetails";
                }
                else {
                    $scope.jobApplyUrl = "&tqid=" + gqId + "&localeid=" + localeId + "&reqid=" + jobId + "&partnerid=" + partnerId + "&siteid=" + siteId + "&loadingViaAjax=true";
                }
                if ($scope.bLoggedIn && $scope.ApplyDifference > 0) {
                    if (angular.isDefined(scope.oActiveLaddaButton))
                        scope.oActiveLaddaButton.start();
                    if (siteId != origSiteId) {
                        var switchSiteRequest = {};
                        switchSiteRequest.PartnerId = $("#partnerId").val();
                        switchSiteRequest.SwitchToSiteId = siteId;
                        switchSiteRequest.FromSiteId = $("#siteId").val();
                        switchSiteRequest.CookieValue = $("#CookieValue").val();

                        $.ajax({
                            success: function (data, status, jqxhr) {
                                if (data.Success == true) {
                                    var bruid = encryptedBruid != "" ? encryptedBruid : $.queryParams().bruid;
                                    window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&TQId=" + gqId + "&bruid=" + encodeURIComponent(bruid) + "&reqid=" + jobId + "&calledFrom=JobDetails";
                                }

                            },
                            error: function (jqxhr, status, error) {
                            },
                            url: '/TgNewUI/Search/Ajax/SwitchSite',
                            data: switchSiteRequest,
                            type: 'POST'
                        });
                    }
                    else {
                        var rft = $("[name='__RequestVerificationToken']").val();
                        $http.get(
                            "/gqweb/apply?bruid=" + encodeURIComponent(encryptedBruid) + "&tqid=" + gqId + "&localeid=" + localeId + "&reqid=" + jobId + "&partnerid=" + partnerId + "&siteid=" + siteId + "&sid=" + sid + "&loadingViaAjax=true&RFT=" + rft

                        ).success(function (result) {
                            if (angular.isDefined(scope.oActiveLaddaButton))
                                scope.oActiveLaddaButton.stop();
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                            $scope.$root.applyResponse = result;
                        });
                    }
                }
                else if (!$scope.bLoggedIn) {
                    $scope.backtobSignInView = true;
                    $scope.bSignInView = true;
                    $scope.showInFullView = true;
                    //pass apply information to the SM logged in form
                    $("#hSMLocalId").val(localeId);
                    $("#hSMJobId").val(jobId);
                    $("#hSMTQId").val(gqId);
                    setTimeout(function () {
                        $scope.$apply();
                        window.scrollTo(0, 0);
                        $scope.setTitle("logIn");
                    }, 0)
                }
                else {
                    $scope.ShowJobAlert = true;
                    setTimeout(function () {
                        $scope.$apply();
                    }, 0);
                }
                return;
            }
            if (!$scope.bLoggedIn && (calledFrom == "save" || calledFrom == "refer")) {
                $scope.backtobSignInView = true;
                $scope.bSignInView = true;
                $scope.showInFullView = true;
                $scope.calledFrom = calledFrom;
                //pass apply information to the SM logged in form
                $("#hSMLocalId").val(localeId);
                $("#hSMJobId").val(jobId);
                $("#hSMTQId").val(gqId);
                setTimeout(function () {
                    $scope.$apply();
                    window.scrollTo(0, 0);
                }, 0);
                return;
            }
            if (angular.isDefined(scope.oActiveLaddaButton))
                scope.oActiveLaddaButton.start();

            //Code changes to fix the pop up window issue since we are suspectig that Ajax call is interfering with window open
            // if (calledFrom == "apply" && gqId != "" && gqId != "0" && scope.tgSettings.Mobileoptimised != "true")
            //     window.open("../../../" + scope.jobDetailFields.localeId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val() + "&fjd=true&referer=&gqid=" + _.max(groupGQId.split(",")) + "&jobinfo=" + jobInfo.replace(/%%/g, "__") + "&applycount=1&type=search_jobdetail", '_blank', 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');


            $http.post(url, searchCriteria).success(function (data, status, headers, config) {
                if (angular.isDefined(scope.oActiveLaddaButton))
                    scope.oActiveLaddaButton.stop();
            }).error(function (data, status, headers, config) {
                if (angular.isDefined(scope.oActiveLaddaButton))
                    scope.oActiveLaddaButton.stop();
                //console.log("failed with status of " + status);
            });

            switch (calledFrom) {
                case "apply":
                    var type = "";
                    if ($scope.bJobCart && $scope.bCandidateZone) {
                        type = "cart_jobdetail";
                    }
                    else {
                        type = "search_jobdetail";
                    }
                    if (gqId == "0") {
                        postValues = { JobInfo: jobInfo, ApplyCount: "1", type: type, JobSiteId: scope.siteId, hdRft: $("#rfToken").val() };
                        redirectPage = "apply.aspx";
                        $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();
                    }
                    else {
                        if (scope.tgSettings.Mobileoptimised == "true") {
                            postValues = { JobInfo: jobInfo, ApplyCount: "1", type: type, JobSiteId: scope.siteId, GQLoginURL: "../" + scope.jobDetailFields.localeId + "/asp/tg/GQLogin.asp?SID=GQSESSION&fjd=true&referer=&gqid=" + _.max(groupGQId.split(",")) + "&jobinfo=" + jobInfo.replace(/%%/g, "__") + "&applycount=1&type=" + type + "&mobile=1", hdRft: $("#rfToken").val() };//need to change gqlogin url

                            redirectPage = "apply.aspx";
                            $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();

                        }
                        else {

                            if (siteId != origSiteId) {
                                $scope.switchSite(siteId, "fromApply");
                                switchSite = true;
                            }
                            window.open("../../../" + scope.jobDetailFields.localeId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val() + "&language=" + langId + "&fjd=true&referer=&gqid=" + _.max(groupGQId.split(",")) + "&jobinfo=" + jobInfo.replace(/%%/g, "__") + "&applycount=1&type=" + type, '_blank', 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                            if (switchSite) {
                                window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&jobid=" + jobId + "&PageType=jobdetails";
                            }
                        }

                    }
                    break;

                case "save":
                    $scope.SaveToJobCartAjax(partnerId, siteId, JobsToBeSaved, scope);

                    break;

                case "email":
                    if (!$scope.bresponsiveCandidateZone) {
                        postValues = { JobInfo: jobInfo, JobSiteInfo: $scope.jobSiteInfo, hdRft: $("#rfToken").val() };
                        if (scope.tgSettings.Mobileoptimised == "true") {
                            postValues.JobTitle = scope.jobDetailFields.Title;
                            redirectPage = "mobile/sharejob.aspx";
                        }
                        else {
                            postValues.STFJobTitle = scope.jobDetailFields.Title;
                            redirectPage = "emailtofriend.aspx";
                        }
                        $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST', "_blank").submit();
                    }
                    else {
                        $scope.jobInfo = jobInfo
                        $scope.openSendToFriend("2", scope.jobDetailFields);
                    }
                    break;
                case "refer":
                    if (scope.SocialReferral_READY == "yes") {
                        setTimeout(function () {
                            $scope.$apply();
                            scope.LaunchSocialReferralMenu(scope, referButton);
                        }, 0);

                    }
                    else {
                        if (appScope.tgSettings.EnableResponsiveSocialReferralQuestions == "true") {
                            $scope.renderReferralQuestions(langId);
                        }
                        else {
                            $scope.jobIds = scope.jobIds;
                            redirectPage = "socialnetworkreferral.aspx";
                            postValues = { ButtonId: "SocialReferralButton", hdRft: $("#rfToken").val() }
                            $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST', "_blank").submit();
                        }
                    }
                    break;
                case "share":
                    postValues = { jobid: jobId, hdRft: $("#rfToken").val() };
                    redirectPage = "socialmedia.aspx";
                    $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST', "_blank").submit();
                    break;
            }

        },
        generalJobSubmissionRedirection: function ($scope) {
            $scope.oActiveLaddaButton.start();
            if ($scope.tgSettings.SiteGeneralJobSubmissionType != "" && _.parseInt($scope.tgSettings.SiteGeneralJobSubmissionType) > 0) {
                window.open("../../../" + $scope.tgSettings.DefLocaleId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val() + "&fhp=true&GQID=" + $scope.tgSettings.SiteGeneralJobSubmissionType);
                $scope.oActiveLaddaButton.stop();
            }
            else {
                $scope.oActiveLaddaButton.stop();
                window.location = '../../../TGwebhost/defaultlogin.aspx?SID=' + $("#SIDValue").val() + '&RegType=SubmitNow'
            }
        },

        SetDuplicateVariablesafterLogin: function (data, loginProfileDetails, calledafter, calledFrom) {
            if (($scope.calledFrom == 'save' || $scope.calledFrom == "refer" || $scope.calledFrom == "savesearch") && calledafter == "Login") {
                ngDialog.closeAll();
                $scope.login.ForgotPass = false;
                if ($scope.bJobDetailsShown) {
                    $scope.ApplyDifference = data.ApplyDiff;
                    $scope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus[0].AllowReApply : true;
                    $scope.Applied = data.ApplyStatus != null ? data.ApplyStatus[0].Applied : false;
                    $scope.LimitExceededMessage = data.LimitExceededMessage;
                    $scope.CallApply();
                    $scope.bSignInView = false;
                    $scope.showInFullView = false;
                    $scope.bError = false;
                    $scope.backtobSignInView = false;
                    $scope.postToNextPageFromDetails('', $scope, $scope.calledFrom);
                }
                else if ($scope.calledFrom == 'savesearch') {
                    $scope.openSaveSearchDialog();
                }
                else if ($scope.bSearchResults) {
                    $scope.postToNextPage("", $scope.SearchResultsJobsSelectedScope, $scope.calledFrom);
                }
            }
            else if ($scope.bSearchResults && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.jobIds != undefined) {
                $scope.SearchResultsJobsSelectedScope.ApplyDifference = data.ApplyDiff;
                $scope.SearchResultsJobsSelectedScope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus[0].AllowReApply : true;
                $scope.SearchResultsJobsSelectedScope.Applied = data.ApplyStatus != null ? data.ApplyStatus[0].Applied : false;
                $scope.SearchResultsJobsSelectedScope.LimitExceededMessage = data.LimitExceededMessage;
                $scope.SearchResultsJobsSelectedScope.responsiveGQforSingleJob = data.IsGQResponsiveForMultipleJobsHavingSingleGQ;

                if (typeof (loginProfileDetails.JobSiteIDs) == "object" && loginProfileDetails.JobSiteIDs.length > 1) {
                    $scope.SearchResultsJobsSelectedScope.MultipleJobStatus = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })) : "";
                    $scope.SearchResultsJobsSelectedScope.NoofJobsApplied = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })).length : 0;
                    $scope.SearchResultsJobsSelectedScope.AllJobsApplied = $scope.SearchResultsJobsSelectedScope.NoofJobsApplied == loginProfileDetails.JobSiteIDs.length ? true : false;
                    if ($scope.SearchResultsJobsSelectedScope.ApplyDifference <= 0) {
                        // $scope.SearchResultsJobsSelectedScope.NoOfJobsExceededMaxLimit = (($scope.SearchResultsJobsSelectedScope.ApplyDifference * -1) + 1) == (loginProfileDetails.JobSiteIDs.length - $scope.SearchResultsJobsSelectedScope.NoofJobsApplied) ? 0 : (($scope.SearchResultsJobsSelectedScope.ApplyDifference * -1) + 1);
                        $scope.SearchResultsJobsSelectedScope.NoOfJobsExceededMaxLimit = (eval(data.MaxSubmissions) - eval(data.CurrentSubmissions)) > 0 ? (loginProfileDetails.JobSiteIDs.length - (eval(data.MaxSubmissions) - eval(data.CurrentSubmissions))) : 0;
                    }
                } else if (typeof (loginProfileDetails.JobSiteIDs) == "string") {
                    $scope.SearchResultsJobsSelectedScope.MultipleJobStatus = (_.where(data.ApplyStatus, { "Applied": true })) != null ? data.ApplyStatus : "";
                    $scope.SearchResultsJobsSelectedScope.NoofJobsApplied = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })).length : 0;
                    $scope.SearchResultsJobsSelectedScope.AllJobsApplied = $scope.SearchResultsJobsSelectedScope.NoofJobsApplied == 1 ? true : false;
                }

                if (data.ReqsThatCanBeApplied == null) {
                    _.each($scope.SearchResultsJobsSelectedScope.jobs, function (job) {
                        job.Selected = false;
                    });
                    data.ReqsThatCanBeApplied = undefined;
                }
                else if ($scope.SearchResultsJobsSelectedScope.jobIds != data.ReqsThatCanBeApplied) {
                    var splittedJobs = data.ReqsThatCanBeApplied.split(",");
                    _.each($scope.SearchResultsJobsSelectedScope.jobs, function (job) {
                        if (_.contains(splittedJobs, _.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString())) {
                            job.Selected = true;
                        }
                        else {
                            job.Selected = false;
                        }
                    });

                }
                $scope.SearchResultsJobsSelectedScope.jobIds = data.ReqsThatCanBeApplied;
                $scope.login.ForgotPass = false;
                ngDialog.closeAll();
                if (appScope.bSearchResults && calledafter == "Login" && ($scope.SearchResultsJobsSelectedScope.NoofJobsApplied > 0 || $scope.SearchResultsJobsSelectedScope.ApplyDifference <= 0)) {
                    $scope.SearchResultsJobsSelectedScope.dialogCalledfrom = 'Apply';
                    $scope.MultipleApplyFormData = $scope.SearchResultsJobsSelectedScope;
                    $('body').addClass('noScroll');
                    ngDialog.open({
                        preCloseCallback: function (value) {
                            $('body').removeClass('noScroll');
                            $.restoreFocus();
                        },
                        template: 'MultipleApplyValidations', scope: $scope.SearchResultsJobsSelectedScope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog" // how to handle the scope over here
                    });
                }
                else if (calledafter == "Login") {
                    $scope.postToNextPage("", $scope.SearchResultsJobsSelectedScope, 'apply');
                }

            }
            else if (appScope.bJobDetailsShown) {
                $scope.ApplyDifference = data.ApplyDiff;
                $scope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus[0].AllowReApply : true;
                $scope.Applied = data.ApplyStatus != null ? data.ApplyStatus[0].Applied : false;
                $scope.LimitExceededMessage = data.LimitExceededMessage;
                $timeout(function () { $scope.$apply(); }, 0);
                ngDialog.closeAll();
                $scope.login.ForgotPass = false;
            }
            else
                ngDialog.closeAll();
            $timeout(function () {
                $scope.$apply();
            }, 0);
        },

        validateAndSubmit: function (scope) {
            scope.oActiveLaddaButton.start();
            $scope.UnameErrorID = '';
            $scope.PassErrorID = '';
            $scope.LoginErrorID = '';
            $scope.errorAtLoggingIn = '';
            $scope.bError = false;
            $scope.LoginChangeSecQuestion = false;
            $scope.LoginChangePassword = false;
            if (!angular.isDefined(scope.loginField) || scope.loginField == '' || !angular.isDefined(scope.password) || scope.password == '') {
                scope.signInForm.$valid = false;
            }

            if (scope.signInForm.$valid) {
                var loginProfileDetails = {};
                if ($scope.jobDetailsJobShown != undefined && $scope.jobDetailsJobShown != "") {
                    loginProfileDetails.JobSiteIDs = $scope.jobSiteInfo;
                } else if ($scope.bSearchResults && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.jobSiteInfo != undefined) {
                    loginProfileDetails.JobSiteIDs = $scope.SearchResultsJobsSelectedScope.jobSiteInfo.indexOf(",") > 0 ? $scope.SearchResultsJobsSelectedScope.jobSiteInfo.split(",") : $scope.SearchResultsJobsSelectedScope.jobSiteInfo;
                    loginProfileDetails.JobInfo = $scope.SearchResultsJobsSelectedScope.jobInfo;
                }
                loginProfileDetails.PartnerId = $("#partnerId").val();
                loginProfileDetails.SiteId = $("#siteId").val();
                loginProfileDetails.LoginType = $scope.tgSettings.LoginType;
                loginProfileDetails.Email = scope.loginField;
                loginProfileDetails.Password = scope.password;
                loginProfileDetails.BrowserInfo = navigator.userAgent;
                loginProfileDetails.IP = "1.1.1.1";
                loginProfileDetails.Locale = $scope.tgSettings.DefLocaleId;
                loginProfileDetails.LanguageSelected = $scope.tgSettings.DefLanguageId;
                loginProfileDetails.EncryptedSessionId = $("#CookieValue").val();
                loginProfileDetails.CalledFrom = $scope.calledFrom;
                loginProfileDetails.ResponsiveCandidateZone = $scope.bresponsiveCandidateZone;
                var url = '/TgNewUI/Search/Ajax/CheckLoginDetails';
                $http.post(url, loginProfileDetails).success(function (data, status, headers, config) {
                    scope.oActiveLaddaButton.stop();
                    switch (data.LoginResult) {
                        case 0:
                            {
                                $scope.ClearSaveSearchCriteriaToLocalSession();
                                scope.submit = false;
                                $scope.encryptedBruid = data.EncryptedBruId;
                                $scope.hashCode = data.HashCode;
                                $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/Login");
                                $scope.ProfileDetails = data.BasicProfileDetails;
                                $scope.updateCandidateZoneData();
                                $scope.SavedSearchesMetaData = data.SavedSearchesMetaData;
                                if (data.NewSessionId != null || data.NewSessionId != "") {
                                    $("#CookieValue").val(data.NewSessionId);
                                }
                                $scope.ShowTimeoutMessage = false;
                                _.each($scope.oHistory, function (oPriorScope, sName) {
                                    oPriorScope.ShowTimeoutMessage = $scope.ShowTimeoutMessage;
                                });
                                ngDialog.closeAll();
                                if ($scope.jobApplyUrl != "") {
                                    if ((data.ApplyStatus != null && data.ApplyStatus[0].Applied) || data.ApplyDiff <= 0) {
                                        $scope.bLoggedIn = true;
                                        $scope.errorAtLoggingIn = "";
                                        $scope.bSignInView = false;
                                        $scope.showInFullView = false;
                                        $scope.bError = false;
                                        $scope.backtobSignInView = false;
                                        $scope.login.ForgotPass = false;
                                        $scope.bCreateAccount = false;
                                        $scope.bPrivacyPages = false;
                                        $scope.ApplyDifference = data.ApplyDiff;
                                        $scope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus[0].AllowReApply : true;
                                        $scope.Applied = data.ApplyStatus != null ? data.ApplyStatus[0].Applied : false;
                                        $scope.LimitExceededMessage = data.LimitExceededMessage;
                                        if (window.location.href.toLowerCase().indexOf("al=1") > -1)
                                            $scope.bJobDetailsAPIError = true;
                                        else
                                            $scope.bJobDetailsAPIError = false;
                                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                                        $timeout(function () {
                                            $scope.$apply();
                                            if (!$scope.utils.isNewHash($scope.$location.hash(), $scope))
                                                $scope.utils.updateHistory($scope.$location.hash());
                                        }, 0);
                                    }
                                    else {
                                        var Questions = scope.jobDetailFields.JobDetailQuestions;
                                        var siteId = _.pluck(_.where(Questions, { "VerityZone": "siteid" }), "AnswerValue").toString();
                                        if (siteId != $("#siteId").val()) {
                                            var switchSiteRequest = {};
                                            switchSiteRequest.PartnerId = $("#partnerId").val();
                                            switchSiteRequest.SwitchToSiteId = siteId;
                                            switchSiteRequest.FromSiteId = $("#siteId").val();
                                            switchSiteRequest.CookieValue = $("#CookieValue").val();

                                            $.ajax({
                                                success: function (data, status, jqxhr) {
                                                    if (data.Success == true) {
                                                        window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?bruid=" + encodeURIComponent($scope.encryptedBruid) + $scope.jobApplyUrl;
                                                    }

                                                },
                                                error: function (jqxhr, status, error) {
                                                },
                                                url: '/TgNewUI/Search/Ajax/SwitchSite',
                                                data: switchSiteRequest,
                                                type: 'POST'
                                            });
                                        }
                                        else {
                                            var rft = $("[name='__RequestVerificationToken']").val();
                                            $http.get("/gqweb/apply?bruid=" + encodeURIComponent($scope.encryptedBruid) + $scope.jobApplyUrl + "&RFT=" + rft)
                                                .success(function (result) {
                                                    ngDialog.closeAll();
                                                    $scope.login.ForgotPass = false;
                                                    $scope.bPrivacyPages = false;
                                                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                                    $scope.$root.applyResponse = result;
                                                    $scope.bLoggedIn = true;
                                                    $scope.bSignInView = false;
                                                    $scope.showInFullView = false;
                                                    scope.loginField = "";
                                                    scope.password = "";
                                                });
                                        }
                                    }
                                }
                                else if (appScope.bJobDetailsShown || appScope.bSearchResults) {
                                    $scope.bLoggedIn = true;
                                    $scope.errorAtLoggingIn = "";
                                    $scope.bSignInView = false;
                                    $scope.showInFullView = false;
                                    $scope.bError = false;
                                    $scope.backtobSignInView = false;
                                    $scope.login.ForgotPass = false;
                                    $scope.bCreateAccount = false;
                                    $scope.bPrivacyPages = false;
                                    appScope.bJobDetailsShown ? appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails" : appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                                    if ($scope.tgSettings.EnableSocialReferral == "yes") {
                                        $scope.SocialReferral_READY = data.SocialMediaSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                                        $scope.SocialReferral_FirstName = encodeURIComponent(data.SocialMediaSettings.SocialReferral_FirstName);
                                        $scope.SocialReferral_LastName = encodeURIComponent(data.SocialMediaSettings.SocialReferral_LastName);
                                        $scope.SocialReferral_ProfileId = data.SocialMediaSettings.profileId;
                                    }
                                    $scope.SetDuplicateVariablesafterLogin(data, loginProfileDetails, "Login", $scope.calledFrom);

                                }
                                else {
                                    scope.loginField = "";
                                    scope.password = "";
                                    if ($scope.bresponsiveCandidateZone) {
                                        if ($scope.tgSettings.EnableSocialReferral == "yes") {
                                            $scope.SocialReferral_READY = data.SocialMediaSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                                            $scope.SocialReferral_FirstName = encodeURIComponent(data.SocialMediaSettings.SocialReferral_FirstName);
                                            $scope.SocialReferral_LastName = encodeURIComponent(data.SocialMediaSettings.SocialReferral_LastName);
                                            $scope.SocialReferral_ProfileId = data.SocialMediaSettings.profileId;
                                        }
                                        $scope.bPrivacyPages = false;
                                        $scope.bCandidateZone = true;
                                        $scope.ViewDashBoardData("SavedJobs");
                                        $scope.login.ForgotPass = false;

                                    }
                                    else {
                                        var candidateZoneRequest = {};
                                        candidateZoneRequest.PartnerId = $("#partnerId").val();
                                        candidateZoneRequest.SiteId = $("#siteId").val();
                                        candidateZoneRequest.EncryptedSessionId = $("#CookieValue").val();
                                        candidateZoneRequest.SIDValue = $("#SIDValue").val();
                                        url = '/TgNewUI/Search/Ajax/CandidateZone';
                                        $http.post(url, candidateZoneRequest).success(function (data, status, headers, config) {
                                            if (!appScope.bJobDetailsShown && !appScope.bSearchResults)
                                                $scope.bCandidateZone = true;
                                            ngDialog.closeAll();
                                            $scope.CandidateZoneData = data;
                                            $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                                            $scope.bLoggedIn = true;
                                            $scope.bSignInView = false;
                                            $scope.showInFullView = false;
                                            $scope.bPrivacyPages = false;
                                            $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                                            $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                                            $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                                            if (data.LoggedInSettings.GeneralSocialReferral == "yes") {
                                                $scope.SocialReferral_READY = data.LoggedInSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                                                $scope.SocialReferral_FirstName = encodeURIComponent(data.CandidateFirstName);
                                                $scope.SocialReferral_LastName = encodeURIComponent(data.CandidateLastName);
                                                $scope.SocialReferral_ProfileId = data.LoggedInSettings.profileId;
                                            }
                                            $scope.login.ForgotPass = false;
                                            if ($scope.bCandidateZone == true)
                                                $scope.setHash();
                                        });
                                    }
                                    $timeout(function () {
                                        $scope.$apply();

                                    }, 0);
                                    $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/CandidateZone");
                                }
                                break;
                            }
                        case 1:
                            {
                                if (appScope.bJobDetailsShown || appScope.bSearchResults) {
                                    $scope.ProfileDetails = data.BasicProfileDetails;
                                    $scope.updateCandidateZoneData();
                                    $scope.SavedSearchesMetaData = data.SavedSearchesMetaData;
                                    $scope.bLoggedIn = true;
                                    $scope.SetDuplicateVariablesafterLogin(data, loginProfileDetails, "ChangePassword", $scope.calledFrom);
                                }
                                $scope.jobApplyUrl = "";
                                $scope.ResetNamePass($scope);
                                scope.submit = false;
                                scope.loginField = "";
                                scope.password = "";
                                ngDialog.closeAll();
                                $scope.LoginChangePassword = true;
                                $scope.bSignInView = false;
                                $scope.showInFullView = false;
                                $scope.login.ForgotPass = true;
                                $scope.login.NameOrPass = 'password';
                                $scope.ActivePage('ResetUserNamePassword');
                                break;
                            }
                        case -3:
                            {
                                $scope.errorAtLoggingIn = "There is some error occurred at backend. Please try again after some time."
                                $scope.bError = true;
                                scope.loginField = "";
                                scope.password = "";
                                scope.submit = false;
                                break;
                            }
                        case -1:
                            {
                                $scope.errorAtLoggingIn = $scope.dynamicStrings.ErrorMessage_InvalidUsernameOrPasswordError;
                                $scope.bError = true;
                                scope.loginField = "";
                                scope.password = "";
                                scope.submit = false;
                                if ($scope.tgSettings.LoginType == 0)
                                    $scope.UnameErrorID = $scope.dynamicStrings.Label_Email;
                                else
                                    $scope.UnameErrorID = $scope.dynamicStrings.Label_Username;
                                $scope.PassErrorID = $scope.dynamicStrings.Label_Password;
                                $scope.LoginErrorID = 'loginField';
                                break;
                            }
                        case -2:
                            {
                                $scope.errorAtLoggingIn = $scope.dynamicStrings.ErrorMessage_LockOutError;
                                $scope.bError = true;
                                scope.loginField = "";
                                scope.password = "";
                                scope.submit = false;
                                break;
                            }
                        case -4:
                            {
                                if (appScope.bJobDetailsShown || appScope.bSearchResults) {
                                    $scope.ProfileDetails = data.BasicProfileDetails;
                                    $scope.updateCandidateZoneData();
                                    $scope.SavedSearchesMetaData = data.SavedSearchesMetaData;
                                    $scope.bLoggedIn = true;
                                    $scope.SetDuplicateVariablesafterLogin(data, loginProfileDetails, "ChangeSecQuestion", $scope.calledFrom);
                                }
                                $scope.jobApplyUrl = "";
                                scope.submit = false;
                                scope.loginField = "";
                                scope.password = "";
                                ngDialog.closeAll();
                                $scope.LoginChangeSecQuestion = true;
                                $scope.bSignInView = false;
                                $scope.ResetChangeSecQuestfunction($scope);
                                break;
                            }

                    }
                });
            }
            else {
                $scope.bError = true;
                scope.oActiveLaddaButton.stop();
                if (!angular.isDefined(scope.loginField) || scope.loginField == '') {
                    if ($scope.tgSettings.LoginType == 0) {
                        $scope.UnameErrorID = $scope.dynamicStrings.Label_Email;
                        if ($scope.LoginErrorID == '') {
                            $scope.LoginErrorID = 'loginField';
                        }
                    }
                    else {
                        $scope.UnameErrorID = $scope.dynamicStrings.Label_Username;
                        if ($scope.LoginErrorID == '') {
                            $scope.LoginErrorID = 'loginField';
                        }
                    }

                }
                if (!angular.isDefined(scope.password) || scope.password == '') {
                    $scope.PassErrorID = $scope.dynamicStrings.Label_Password;
                    if ($scope.LoginErrorID == '') {
                        $scope.LoginErrorID = 'password';
                    }
                }

                console.log(scope);
                $scope.$("#loginField").attr("required", true);
                $scope.$("#password").attr("required", true);
                $scope.$("#loginField").attr("aria-invalid", true);
                $scope.$("#password").attr("aria-invalid", true);

            }
        },
        switchSite: function (switchToSiteId, calledFrom) {

            var switchSiteRequest = {};
            switchSiteRequest.PartnerId = $("#partnerId").val();
            switchSiteRequest.SwitchToSiteId = switchToSiteId;
            switchSiteRequest.FromSiteId = $("#siteId").val();
            switchSiteRequest.CookieValue = $("#CookieValue").val();

            $scope.featuredOrLatestJobsAjax = $.ajax({
                success: function (data, status, jqxhr) {
                    if (data.Success == true) {
                        if (calledFrom) {

                        }
                        else {
                            window.location = "/TgNewUI/Search/Home/Home?partnerid=" + $("#partnerId").val() + "&siteid=" + switchToSiteId;
                        }
                        $("#SIDValue").val(data.newSID);
                    }

                },
                error: function (jqxhr, status, error) {
                },
                url: '/TgNewUI/Search/Ajax/SwitchSite',
                data: switchSiteRequest,
                type: 'POST',
                async: false
            });

        },
        showMobileSignIn: function (scope) {
            $scope.errorAtLoggingIn = '';
            $scope.bSignInView = true;
            $scope.bTransition = true;
            $scope.bError = false;
            $scope.calledFromDesktop = false;
            $scope.setTitle("logIn");
            $timeout(function () {
                $scope.bTransition = false;
                $scope.scrolltop();
                $scope.$apply();
            }, 1000);

        },
        onClickTab: function (scope, activeTabValue) {
            scope.activeTab = !scope.activeTab;
            $scope.tabValue = activeTabValue;
        },
        backClick: function (calledFromDesktop) {
            $scope.ShowTimeoutMessage = false;
            _.each($scope.oHistory, function (oPriorScope, sName) {
                oPriorScope.ShowTimeoutMessage = $scope.ShowTimeoutMessage;
            });
            $scope.errorAtLoggingIn = "";
            $scope.bSignInView = false;
            $scope.showInFullView = false;
            $scope.bError = false;
            appScope.backtobSignInView = false;
            ngDialog.closeAll();
            if (!calledFromDesktop) {
                $scope.bError = false;
                $scope.bTransition = true;
                $timeout(function () {
                    $scope.bTransition = false;
                }, 1000);
            }
            setTimeout(function () { $scope.$apply(); }, 0);
        },
        tabValue: "loginTemplate",

        newAccntScreen: function (RedirectHome) {
            $scope.bCreateAccount = false;
            $scope.setTitle("createNewAccount");
            $scope.resetcreatAccount($scope);
            if (angular.isDefined(RedirectHome) && RedirectHome == true)
                $scope.bRedirectHome = true;
            else
                $scope.bRedirectHome = false;
            $scope.showInFullView = false;
            ngDialog.closeAll();
            $scope.login.ForgotPass = false;
            if ($scope.tgSettings.PrivacyStatement == '') {
                //$scope.bNewAccntScreen = true;
                //window.location = "../../../TGwebhost/pdsstepone.aspx?RegType=Lite_Home&SID=" + $("#SIDValue").val();
                $scope.bCreateAccount = true;
                $scope.bPrivacyPages = false;
                $scope.setHash();
                $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/CreateUser");
            }
            else {
                if ($scope.privacyPolicySettings == undefined) {
                    var privacyPolicyStatementRequest = {};
                    privacyPolicyStatementRequest.PartnerId = $("#partnerId").val();
                    privacyPolicyStatementRequest.SiteId = $("#siteId").val();
                    var url = "/TgNewUI/Search/Ajax/PrivacyPolicyStatement";
                    $http.post(url, privacyPolicyStatementRequest).success(function (data, status, headers, config) {
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "createNewAccount";
                        $scope.privacyPolicySettings = data.PrivacyPolicySettings;
                        if (data.PrivacyPolicySettings.PrivacyPlacement == '2') {
                            $scope.bPrivacyPages = true;
                            $scope.bPrivacyPolicyQuestion = true;
                            $scope.setHash();
                        }
                        else {
                            $scope.bPrivacyPages = true;
                            $scope.bPrivacyPolicyStatement = true;
                            $scope.setHash();
                        }
                    });
                    $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/PrivacyPolicyStatement");
                }
                else if ($scope.privacyPolicySettings.PrivacyPlacement == '2') {
                    $scope.bPrivacyPages = true;
                    $scope.bPrivacyPolicyQuestion = true;
                    $scope.setHash();
                }
                else {
                    $scope.bPrivacyPages = true;
                    $scope.bPrivacyPolicyStatement = true;
                    $scope.setHash();
                }

            }
            $scope.bSignInView = false;
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "createNewAccount";
            setTimeout(function () { $scope.$apply(); }, 0);
        },
        privacyDisAgreeAction: function () {
            $scope.bPrivacyPolicyStatement = false;
            if ($scope.privacyPolicySettings.AltPrivacyPolicy == '') {
                $scope.bPrivacyPages = false;
            }
            else {
                $scope.bPrivacyOptOut = true;
            }
            $scope.setHash();
        },
        showMobileSignInDialog: function (scope) {
            $.captureFocus();
            $scope.theme = 'ngdialog-theme-default';
            $scope.bShowMobileSignInDialog = true;
            $scope.errorAtLoggingIn = '';
            $scope.submit = false;
            $scope.bError = false;
            $scope.calledFrom = scope.calledFrom;
            $('body').addClass('noScroll');
            setTimeout(function () {

                ngDialog.open({
                    preCloseCallback: function (value) {
                        $scope.ShowTimeoutMessage = false;
                        _.each($scope.oHistory, function (oPriorScope, sName) {
                            oPriorScope.ShowTimeoutMessage = $scope.ShowTimeoutMessage;
                        });
                        $scope.bShowMobileSignInDialog = false;
                        $('body').removeClass('noScroll');
                    },
                    template: 'MobileSignInTemplate', scope: appScope, className: 'ngdialog-theme-default mobileSignInDialogue', showClose: false, closeByDocument: false, data: { mobileLogin: 'true' }, appendTo: "#menuContainer", ariaRole: "dialog"
                });
            }, 100);

        },
        showLocalesDialog: function (scope) {
            ngDialog.open({
                preCloseCallback: function (value) {
                    $.restoreFocus();
                },
                template: 'LocalesTemplate', scope: $scope, className: 'ngdialog-theme-default', showClose: true, closeByDocument: false, appendTo: "#menuContainer"
            })
        },
        nextPrivacyFlow: function (value) {
            if (value == "option1") {
                //window.location = "../../../TGwebhost/pdsstepone.aspx?RegType=Lite_Home&SID=" + $("#SIDValue").val();
                $scope.bCreateAccount = true;
                $scope.bPrivacyPages = false;
                $scope.bPrivacyPolicyStatement = false;
                $scope.resetcreatAccount($scope);
                $scope.setHash();
            }
            else if (value == "option2") {
                $scope.bPrivacyPolicyQuestion = false;
                $scope.bPrivacyPolicyStatement = true;
                $scope.setHash();
            }
            else if (value == "option3") {
                $scope.bPrivacyOptOut = false;
                $scope.bPrivacyPages = false;
                $scope.setHash();
            }
        },
        openPasswordTips: function (scope) {
            $scope.bSignInView = false;
            $scope.calledFromDesktop = true;
            $scope.theme = 'ngdialog-theme-default';
            $.captureFocus();
            ngDialog.open({
                preCloseCallback: function (value) {
                    $.restoreFocus();
                },
                template: 'modalDialogId', scope: $scope, className: 'ngdialog-theme-default', showClose: true, closeByDocument: false
            });
        },
        validateForm: function (createuser) {
            $scope.createAccount.securityQuestion.errorValue1 = false;
            $scope.createAccount.securityQuestion.errorValue2 = false;
            $scope.createAccount.securityQuestion.errorValue3 = false;
            $scope.createAccount.securityQuestion.errorAnswer1 = false;
            $scope.createAccount.securityQuestion.errorAnswer2 = false;
            $scope.createAccount.securityQuestion.errorAnswer3 = false;
            $scope.createAccount.mainError = "";
            if ($scope.createAccount.login.userName != '' && $scope.createAccount.login.password != '') {
                if ($scope.createAccount.login.userName == $scope.createAccount.login.password) {
                    var msg = {};
                    msg.label = '';
                    msg.error = $scope.dynamicStrings.ErrorMessage_SameUsernamePasswrd;
                    msg.field = "username";
                    $scope.createAccount.errormsgs.push(msg);
                }
            }
            if ($scope.createAccount.login.password != "" && $scope.createAccount.login.password.indexOf(" ") > 0) {
                var msg = {};
                msg.label = '';
                msg.error = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                msg.field = "password";
                $scope.createAccount.errormsgs.push(msg);
            }
            if ($scope.createAccount.noOfSecurityQuestions >= 2) {
                if ($scope.createAccount.securityQuestion.value1 != '' && $scope.createAccount.securityQuestion.value2 != '') {
                    if ($scope.createAccount.securityQuestion.value1 == $scope.createAccount.securityQuestion.value2) {
                        $scope.createAccount.securityQuestion.errorValue1 = true;
                        $scope.createAccount.securityQuestion.errorValue2 = true;
                    }
                }
                if ($scope.createAccount.securityQuestion.answer1 && $scope.createAccount.securityQuestion.answer1 != '' && $scope.createAccount.securityQuestion.answer2 != '') {
                    if ($scope.createAccount.securityQuestion.answer1 == $scope.createAccount.securityQuestion.answer2) {
                        $scope.createAccount.securityQuestion.errorAnswer1 = true;
                        $scope.createAccount.securityQuestion.errorAnswer2 = true;
                    }
                }
            }
            if ($scope.createAccount.noOfSecurityQuestions >= 3) {
                if ($scope.createAccount.securityQuestion.value1 != '' && $scope.createAccount.securityQuestion.value2 != '') {
                    if ($scope.createAccount.securityQuestion.value1 == $scope.createAccount.securityQuestion.value2) {
                        $scope.createAccount.securityQuestion.errorValue1 = true;
                        $scope.createAccount.securityQuestion.errorValue2 = true;
                    }
                }
                if ($scope.createAccount.securityQuestion.value1 != '' && $scope.createAccount.securityQuestion.value3 != '') {
                    if ($scope.createAccount.securityQuestion.value1 == $scope.createAccount.securityQuestion.value3) {
                        $scope.createAccount.securityQuestion.errorValue1 = true;
                        $scope.createAccount.securityQuestion.errorValue3 = true;
                    }
                }
                if ($scope.createAccount.securityQuestion.value2 != '' && $scope.createAccount.securityQuestion.value3 != '') {
                    if ($scope.createAccount.securityQuestion.value2 == $scope.createAccount.securityQuestion.value3) {
                        $scope.createAccount.securityQuestion.errorValue2 = true;
                        $scope.createAccount.securityQuestion.errorValue3 = true;
                    }
                }
                if ($scope.createAccount.securityQuestion.answer1 && $scope.createAccount.securityQuestion.answer1 != '' && $scope.createAccount.securityQuestion.answer2 != '') {
                    if ($scope.createAccount.securityQuestion.answer1 == $scope.createAccount.securityQuestion.answer2) {
                        $scope.createAccount.securityQuestion.errorAnswer1 = true;
                        $scope.createAccount.securityQuestion.errorAnswer2 = true;
                    }
                }
                if ($scope.createAccount.securityQuestion.answer1 && $scope.createAccount.securityQuestion.answer1 != '' && $scope.createAccount.securityQuestion.answer3 != '') {
                    if ($scope.createAccount.securityQuestion.answer1 == $scope.createAccount.securityQuestion.answer3) {
                        $scope.createAccount.securityQuestion.errorAnswer1 = true;
                        $scope.createAccount.securityQuestion.errorAnswer3 = true;
                    }
                }
                if ($scope.createAccount.securityQuestion.answer2 && $scope.createAccount.securityQuestion.answer2 != '' && $scope.createAccount.securityQuestion.answer3 != '') {
                    if ($scope.createAccount.securityQuestion.answer2 == $scope.createAccount.securityQuestion.answer3) {
                        $scope.createAccount.securityQuestion.errorAnswer2 = true;
                        $scope.createAccount.securityQuestion.errorAnswer3 = true;
                    }
                }
            }

        },
        getLabelByName: function (name) {
            if (name == "username") return $scope.tgSettings.LoginType == "1" ? $scope.dynamicStrings.Label_Username : $scope.dynamicStrings.EmailAddress;
            if (name == "password" || name == "currentPassword") return $scope.dynamicStrings.Label_Password;
            if (name == "newPassword") return $scope.dynamicStrings.Label_NewPassword;
            if (name == "confirmPassword") return $scope.dynamicStrings.Label_ReenterPassword;
            if (name == "confirmNewPassword") return $scope.dynamicStrings.Label_ReEnterNewPassword;
            if (name == "selectSecurityQuestion1") return $scope.dynamicStrings.Label_Question1;
            if (name == "selectSecurityQuestion2") return $scope.dynamicStrings.Label_Question2;
            if (name == "selectSecurityQuestion3") return $scope.dynamicStrings.Label_Question3;
            if (name == "securityQuestion1Answer") return $scope.dynamicStrings.Label_Question1;
            if (name == "securityQuestion2Answer") return $scope.dynamicStrings.Label_Question2;
            if (name == "securityQuestion3Answer") return $scope.dynamicStrings.Label_Question3;
            if (name == "email") return $scope.dynamicStrings.Label_To;
            if (name == "yourEmail") return $scope.dynamicStrings.sendemailyouremail;
            if (name == "yourName") return $scope.dynamicStrings.sendemailyourName;

            else return "unknownlabel"
        },
        getRequiredErrorByName: function (name) {
            if (name == "username") return $scope.dynamicStrings.ErrorMessage_RequiredField;
            if (name == "password" || name == "currentPassword" || name == "newPassword") return $scope.dynamicStrings.ErrorMessage_RequiredField;
            if (name == "confirmPassword" || name == "confirmNewPassword") return $scope.dynamicStrings.ErrorMessage_RequiredField;
            if (name == "selectSecurityQuestion1") return $scope.dynamicStrings.Placeholder_Selectquestion;
            if (name == "selectSecurityQuestion2") return $scope.dynamicStrings.Placeholder_Selectquestion;
            if (name == "selectSecurityQuestion3") return $scope.dynamicStrings.Placeholder_Selectquestion;
            if (name == "securityQuestion1Answer") return $scope.dynamicStrings.ErrorMessage_AnswerRequired;
            if (name == "securityQuestion2Answer") return $scope.dynamicStrings.ErrorMessage_AnswerRequired;
            if (name == "securityQuestion3Answer") return $scope.dynamicStrings.ErrorMessage_AnswerRequired;
            if (name == "email" || name == "yourEmail") return $scope.dynamicStrings.ErrorMessage_RequiredField;
            if (name == "yourName") return $scope.dynamicStrings.ErrorMessage_RequiredField;
            else return "unknownerrormsg"
        },
        showInvalidDetails: function () {
            if (["selectSecurityQuestion1", "selectSecurityQuestion2", "selectSecurityQuestion3"].indexOf($('#createAccountForm .ng-invalid').first().attr("ID")) !== -1) {
                $('[id="' + $('#createAccountForm .ng-invalid').first().attr("ID") + '-button"]').focus();
            }
            else if ($('#createAccountForm .ng-invalid').length > 0) {
                $('#createAccountForm .ng-invalid').first().focus();
            } else if ($('#updateAccountForm .ng-invalid').length > 0) {
                $('#updateAccountForm .ng-invalid').first().focus();
            } else
                $(".fieldcontain.invalid").eq(0).scrollAndFocus();
        },
        scrollToInvalidField: function (scope) {
            if (["selectSecurityQuestion1", "selectSecurityQuestion2", "selectSecurityQuestion3", "optSecurityQuestion1", "optSecurityQuestion2", "optSecurityQuestion3"].indexOf(scope.msg.field) !== -1) {
                $('[id="' + scope.msg.field + '-button"]').focus();
            }
            else
                $('[name="' + scope.msg.field + '"]').focus();

        },
        ThrottleCreateAccountValidation: function () {
            if ($scope.createAccount.securityQuestion.value1 != $("#selectSecurityQuestion1").val() && $("#selectSecurityQuestion1").val() != null) {
                $scope.createAccount.securityQuestion.value1 = $("#selectSecurityQuestion1").val();
                $scope.createAccount.CAsubmitted1 = false;
            }
            if ($scope.createAccount.securityQuestion.value2 != $("#selectSecurityQuestion2").val() && $("#selectSecurityQuestion2").val() != null) {
                $scope.createAccount.securityQuestion.value2 = $("#selectSecurityQuestion2").val();
                $scope.createAccount.CAsubmitted1 = false;
            }
            if ($scope.createAccount.securityQuestion.value3 != $("#selectSecurityQuestion3").val() && $("#selectSecurityQuestion3").val() != null) {
                $scope.createAccount.securityQuestion.value3 = $("#selectSecurityQuestion3").val();
                $scope.createAccount.CAsubmitted1 = false;
            }
        },

        submitAndLoginCreateAccount: function (createAccountForm, scope) {
            $scope.createAccount.showForgotPasswordLink = false;
            $scope.createAccount.errormsgs = [];
            $("[aria-invalid]").removeAttr("aria-invalid");
            if ($scope.createAccount.login.userName != '' && $scope.createAccount.login.password != '') {
                if ($scope.createAccount.login.userName == $scope.createAccount.login.password) {
                    var msg = {};
                    msg.label = '';
                    msg.error = $scope.dynamicStrings.ErrorMessage_SameUsernamePasswrd;
                    msg.field = "username";
                    $("#" + msg.field).attr("aria-invalid", "true");
                    $scope.createAccount.errormsgs.push(msg);
                }
            }
            if ($scope.createAccount.login.password != "" && $scope.createAccount.login.password.indexOf(" ") > 0) {
                var msg = {};
                msg.label = '';
                msg.error = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                msg.field = "password";
                $("#" + msg.field).attr("aria-invalid", "true");
                $scope.createAccount.errormsgs.push(msg);
            }
            $.each(createAccountForm.$error, function (errorType, allErrors) {
                if (allErrors != false) {
                    if (errorType == "required") {
                        var nxtvalue = 0;
                        $.each(allErrors, function (index, error) {
                            if (error.$name != "confirmPassword") {
                                var msg = {};
                                if (nxtvalue == 0 || error.$name != 'securityQuestion' + nxtvalue + 'Answer') {
                                    msg.label = $scope.getLabelByName(error.$name);
                                    msg.error = ' - ' + $scope.getRequiredErrorByName(error.$name);
                                    msg.field = error.$name;
                                    $("#" + msg.field).attr("aria-invalid", "true");
                                    $scope.createAccount.errormsgs.push(msg);
                                }
                                if (error.$name == 'selectSecurityQuestion1') {
                                    nxtvalue = 1;
                                }
                                else if (error.$name == 'selectSecurityQuestion2') {
                                    nxtvalue = 2;
                                }
                                else if (error.$name == 'selectSecurityQuestion3') {
                                    nxtvalue = 3;
                                }
                                else {
                                    nxtvalue = 0;
                                }
                            }
                        });
                    }
                    if (errorType == "notValidLength") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            if ($scope.response.ClientSettings.TGPasswordStrength.toLowerCase() == 'default')
                                msg.error = ' - ' + $scope.dynamicStrings.Errormessage_Mustbe6characters;
                            else
                                msg.error = ' - ' + $scope.dynamicStrings.Errormessage_Mustbe8to25characters;
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.createAccount.errormsgs.push(msg);
                        });
                    }
                    if (errorType == "noSpecialCharacter") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            msg.error = ' - ' + $scope.dynamicStrings.Errormessage_MustContainSpecialCharacter;
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.createAccount.errormsgs.push(msg);
                        });
                    }
                    if (errorType == "pattern") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.getLabelByName(error.$name);
                            msg.error = ' - ' + (error.$name.indexOf("securityQuestion") == 0 ? $scope.dynamicStrings.ErrorMessage_InvalidSecurityAnswer : $scope.dynamicStrings.ErrorMessage_InvalidEmail);
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.createAccount.errormsgs.push(msg);
                        });
                    }
                    if (errorType == "nxEqual") {
                        $.each(allErrors, function (index, error) {
                            var msg = {};
                            msg.label = $scope.dynamicStrings.Label_ReenterPassword;
                            msg.error = ' - ' + $scope.dynamicStrings.Errormessage_PasswordMustMatch;
                            msg.field = error.$name;
                            $("#" + msg.field).attr("aria-invalid", "true");
                            $scope.createAccount.errormsgs.push(msg);
                        });
                    }
                }
            });
            if ($scope.createAccount.securityQuestion.errorValue1 == true || $scope.createAccount.securityQuestion.errorValue2 == true
                || $scope.createAccount.securityQuestion.errorValue3 == true || $scope.createAccount.securityQuestion.errorAnswer1 == true
                || $scope.createAccount.securityQuestion.errorAnswer2 == true || $scope.createAccount.securityQuestion.errorAnswer3 == true) {
                var msg = {};
                msg.label = '';
                msg.error = $scope.dynamicStrings.Errormessage_SecurityQuestionsAndAnswersMustBeUnique;
                msg.field = "selectSecurityQuestion1";
                $("#" + msg.field).attr("aria-invalid", "true");
                $scope.createAccount.errormsgs.push(msg);
            }
            if (createAccountForm.$valid && $scope.createAccount.errormsgs.length == 0) {
                if (!$scope.createAccount.securityQuestion.errorValue1 && !$scope.createAccount.securityQuestion.errorValue2 && !$scope.createAccount.securityQuestion.errorValue3 && !$scope.createAccount.securityQuestion.errorAnswer1 && !$scope.createAccount.securityQuestion.errorAnswer2 && !$scope.createAccount.securityQuestion.errorAnswer3 && $scope.createAccount.mainError == "") {
                    scope.oActiveLaddaButton.start();
                    var NewProfileLoginAndRedirectRequest = {};
                    NewProfileLoginAndRedirectRequest.PartnerId = $("#partnerId").val();
                    NewProfileLoginAndRedirectRequest.SiteId = $("#siteId").val();
                    NewProfileLoginAndRedirectRequest.UserName = $scope.createAccount.login.userName;
                    NewProfileLoginAndRedirectRequest.Password = $scope.createAccount.login.password;
                    //NewProfileLoginAndRedirectRequest.Locale = $scope.Locale;
                    NewProfileLoginAndRedirectRequest.Locale = $scope.tgSettings.DefLocaleId;
                    NewProfileLoginAndRedirectRequest.LanguageSelected = $scope.tgSettings.DefLanguageId;
                    NewProfileLoginAndRedirectRequest.LoginMgmtType = $scope.tgSettings.LoginDetailsManagement;
                    NewProfileLoginAndRedirectRequest.BrowserInfo = navigator.userAgent;
                    NewProfileLoginAndRedirectRequest.SQuestionOne = $scope.createAccount.securityQuestion.value1;
                    NewProfileLoginAndRedirectRequest.SQuestionTwo = $scope.createAccount.securityQuestion.value2;
                    NewProfileLoginAndRedirectRequest.SQuestionThree = $scope.createAccount.securityQuestion.value3;
                    NewProfileLoginAndRedirectRequest.SAnswerOne = $scope.createAccount.securityQuestion.answer1;
                    NewProfileLoginAndRedirectRequest.SAnswerTwo = $scope.createAccount.securityQuestion.answer2;
                    NewProfileLoginAndRedirectRequest.SAnswerThree = $scope.createAccount.securityQuestion.answer3;
                    NewProfileLoginAndRedirectRequest.NoOfSecurityQuestions = $scope.createAccount.noOfSecurityQuestions
                    NewProfileLoginAndRedirectRequest.EncryptedSessionId = $("#CookieValue").val();
                    NewProfileLoginAndRedirectRequest.IP = "1.1.1.1";
                    NewProfileLoginAndRedirectRequest.SIDValue = $("#SIDValue").val();
                    NewProfileLoginAndRedirectRequest.ResponsiveCandidateZone = $scope.bresponsiveCandidateZone;

                    var url = '/TgNewUI/Search/Ajax/NewProfileLoginAndRedirect';
                    $http.post(url, NewProfileLoginAndRedirectRequest).success(function (data, status, headers, config) {
                        if (data) {
                            scope.oActiveLaddaButton.stop();
                            if (data.NewProfileResult == "NEW_PROFILE_SUCCESS") {
                                if (data.LoginResult == 0) {
                                    $scope.encryptedBruid = data.EncryptedBruId;
                                    $scope.hashCode = data.HashCode;
                                    $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/Login");
                                    $scope.ProfileDetails = data.BasicProfileDetails;
                                    $scope.SavedSearchesMetaData = {};
                                    $scope.SavedSearchesMetaData.SavedSearches = [];
                                    $scope.updateCandidateZoneData();
                                    if (data.NewSessionId != null || data.NewSessionId != "") {
                                        $("#CookieValue").val(data.NewSessionId);
                                    }
                                    if ($scope.jobApplyUrl != "") {
                                        $scope.bLoggedIn = true;
                                        var rft = $("[name='__RequestVerificationToken']").val();
                                        $http.get("/gqweb/apply?bruid=" + encodeURIComponent($scope.encryptedBruid) + $scope.jobApplyUrl + "&RFT=" + rft)
                                            .success(function (result) {
                                                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                                $scope.$root.applyResponse = result;
                                            });
                                    }
                                    else if (appScope.bJobDetailsShown || appScope.bSearchResults) {
                                        if ($scope.calledFrom == 'save' || $scope.calledFrom == 'refer' || $scope.calledFrom == 'savesearch') {
                                            $scope.bLoggedIn = true;
                                            $scope.bCreateAccount = false;
                                            if ($scope.calledFrom == 'savesearch') {
                                                $scope.openSaveSearchDialog();
                                            }
                                            else if ($scope.bJobDetailsShown) {
                                                $scope.CallApply();
                                                $scope.postToNextPageFromDetails('', $scope, $scope.calledFrom);
                                            }
                                            else if ($scope.bSearchResults) {
                                                $scope.postToNextPage("", $scope.SearchResultsJobsSelectedScope, $scope.calledFrom);
                                            }
                                        }
                                        else if ($scope.bSearchResults && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.jobIds != undefined) {
                                            $scope.bLoggedIn = true;
                                            var SMLoginjobids = $scope.SearchResultsJobsSelectedScope.jobIds.split(",").length > 0 ? $scope.SearchResultsJobsSelectedScope.jobIds : "";
                                            $scope.bCreateAccount = false;
                                            $scope.SelectJobs = $scope.dynamicStrings.Button_Cancel;
                                            _.each(appScope.jobs, function (job) {
                                                if (SMLoginjobids.split(',').indexOf(_.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString()) > -1) {
                                                    job.Selected = true;
                                                }
                                            });
                                            $scope.postToNextPage('', appScope, 'mulapplyvald');
                                            $scope.bCreateAccount = false;
                                        }
                                    }
                                    else if ($scope.bresponsiveCandidateZone) {
                                        $scope.bCandidateZone = true;
                                        $scope.ViewDashBoardData("SavedJobs");
                                    }
                                    else {

                                        $scope.bCandidateZone = true;
                                        $scope.CandidateZoneData = data;
                                        $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                                        $scope.bLoggedIn = true;
                                        $scope.bCreateAccount = false;
                                        $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                                        $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                                        $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                                        $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/CandidateZone");
                                    }
                                }
                            }
                            else if (data.NewProfileResult == "EMAIL_ID_EXISTS") {
                                $scope.createAccount.mainError = $scope.dynamicStrings.ErrorMessage_CreatedAccountInThePast;
                                $scope.createAccount.showForgotPasswordLink = true;
                                return false;
                            }
                            else if (data.NewProfileResult == "PASSWORD_ISUSERNAME") {
                                $scope.createAccount.mainError = $scope.dynamicStrings.ErrorMessage_SameUsernamePasswrd;
                                return false;
                            }
                            else if (data.NewProfileResult == "PASSWORD_FORMAT") {
                                $scope.createAccount.mainError = $scope.dynamicStrings.Errormessage_CredentialsNotValidated;
                                return false;
                            }
                            else if (data.NewProfileResult == "PASSWORD_NO_SPACES") {
                                $scope.createAccount.mainError = $scope.dynamicStrings.ErrorMessage_PasswordWithSpaces;
                                return false;
                            }
                            else if (data.NewProfileResult == "PASSWORD_SPECIAL_CHARACTERS") {
                                $scope.createAccount.mainError = $scope.dynamicStrings.Errormessage_MustContainSpecialCharacter;
                                return false;
                            }
                            else if (data.NewProfileResult == "PASSWORD_MINIMUM_LENGTH") {
                                if ($scope.response.ClientSettings.TGPasswordStrength.toLowerCase() == 'default')
                                    $scope.createAccount.mainError = $scope.dynamicStrings.Errormessage_Mustbe6characters
                                else
                                    $scope.createAccount.mainError = $scope.dynamicStrings.Errormessage_Mustbe8to25characters;
                                return false;
                            }
                            else {
                                $scope.createAccount.mainError = $scope.dynamicStrings.ErrorMessage_CreatedAccountFailed;
                                $scope.createAccount.showForgotPasswordLink = true;
                                console.log("failed with status of " + status);
                                return false;

                            }
                            // that.$apply();
                        }
                        setTimeout(function () { $scope.$apply(); }, 0);
                    }).error(function (data, status, headers, config) {
                        $scope.createAccount.mainError = $scope.dynamicStrings.ErrorMessage_CreatedAccountFailed;
                        $scope.createAccount.showForgotPasswordLink = true;
                        console.log("failed with status of " + status);
                        return false;
                    });
                }
            }
            else {
                $(".errorContainer:visible").setFocus();
            }
        },
        goBackCreateUserFlow: function () {
            if ($location.hash().indexOf("CreateAccount") != -1 || $location.hash().indexOf("Policy") != -1) {
                history.back();
            }
            else {
                if ($scope.tgSettings.PrivacyStatement != '') {
                    if (that.bCreateAccount == true) {
                        that.bPrivacyPages = true;
                        if (that.bPrivacyPolicyQuestion)
                            that.bPrivacyPolicyStatement = false;
                        else
                            that.bPrivacyPolicyStatement = true;
                        that.bCreateAccount = false;
                    } else if (that.bPrivacyOptOut == true) {
                        that.bPrivacyPages = true;
                        if (that.bPrivacyPolicyQuestion)
                            that.bPrivacyPolicyStatement = false;
                        else
                            that.bPrivacyPolicyStatement = true;
                        that.bPrivacyOptOut = false;
                    }
                    else if (that.bPrivacyPages == true) {
                        if (that.bPrivacyPolicyQuestion) {
                            that.bPrivacyPolicyQuestion = false;
                            var width = $(window).width();
                            $scope.bError = false;
                            that.bCreateAccount = false;
                            that.bPrivacyPages = false;
                            if ((width < 769 && !$scope.bRedirectHome) || $scope.backtobSignInView) {
                                if ($scope.backtobSignInView) {
                                    $scope.showInFullView = true;
                                }
                                $scope.bSignInView = true;
                                $scope.showMobileSignIn(this);
                            }

                        }
                        else if (that.bPrivacyPolicyStatement && that.privacyPolicySettings.PrivacyPlacement == '2') {
                            that.bPrivacyPolicyQuestion = true;
                            that.bPrivacyPolicyStatement = false;
                        }
                        else if (that.bPrivacyPolicyStatement && (that.privacyPolicySettings.PrivacyPlacement == '1' || that.privacyPolicySettings.PrivacyPlacement == '0')) {
                            var width = $(window).width();
                            $scope.bError = false;
                            that.bCreateAccount = false;
                            that.bPrivacyPages = false;
                            if ((width < 769 && !$scope.bRedirectHome) || $scope.backtobSignInView) {
                                if ($scope.backtobSignInView) {
                                    $scope.showInFullView = true;
                                }
                                $scope.bSignInView = true;
                                $scope.showMobileSignIn(this);
                            }

                        }
                        else {
                            var width = $(window).width();
                            $scope.bError = false;
                            that.bCreateAccount = false;
                            if ((width < 769 && !$scope.bRedirectHome) || $scope.backtobSignInView) {
                                if ($scope.backtobSignInView) {
                                    $scope.showInFullView = true;
                                }
                                $scope.bSignInView = true;
                                $scope.showMobileSignIn(this);
                            }
                        }
                    }
                }
                else if ($scope.tgSettings.PrivacyStatement == '' || that.bPrivacyPages == false) {
                    var width = $(window).width();
                    $scope.bError = false;
                    that.bCreateAccount = false;
                    if ((width < 769 && !$scope.bRedirectHome) || $scope.backtobSignInView) {
                        if ($scope.backtobSignInView) {
                            $scope.showInFullView = true;
                        }
                        $scope.bSignInView = true;
                        $scope.showMobileSignIn(this);
                    }
                }
                $timeout(function () { $scope.$apply() });
            }
        },

        homeView: function () {
            appScope.$root.oHistory = _.omit(appScope.oHistory, ['ForgotUsernamePassword', 'SecurityQuestions', 'ForgotUsername', 'ResetPassword']);
            previousHashes = _.without(previousHashes, 'ForgotUsernamePassword', 'SecurityQuestions', 'ForgotUsername', 'ResetPassword');
            if ($scope.bLoggedIn == true && $scope.bresponsiveCandidateZone != true && $scope.CandidateZoneData == null) {
                var candidateZoneRequest = {};
                candidateZoneRequest.PartnerId = $("#partnerId").val();
                candidateZoneRequest.SiteId = $("#siteId").val();
                candidateZoneRequest.EncryptedSessionId = $("#CookieValue").val();
                candidateZoneRequest.SIDValue = $("#SIDValue").val();
                url = '/TgNewUI/Search/Ajax/CandidateZone';
                $http.post(url, candidateZoneRequest).success(function (data, status, headers, config) {
                    $scope.CandidateZoneData = data;
                    $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                    $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                    $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                    $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                    if (data.LoggedInSettings.GeneralSocialReferral == "yes") {
                        $scope.SocialReferral_READY = data.LoggedInSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                        $scope.SocialReferral_FirstName = encodeURIComponent(data.CandidateFirstName);
                        $scope.SocialReferral_LastName = encodeURIComponent(data.CandidateLastName);
                        $scope.SocialReferral_ProfileId = data.LoggedInSettings.profileId;
                    }
                });
            }
            $scope.searchResultsFromSavedSearch = null;
            if ($("#pageType").val() == "") {
                $scope.jobs = $scope.featuredJobs;
                $scope.toggleCheckBoxes = false;
                $scope.SelectedJobsChecked = false;
                _.each($scope.jobs, function (job) {
                    job.Selected = false;
                });
                if ($scope.featuredJobs != null) {
                    $scope.jobsCount = $scope.featuredJobs.length;
                }
                else {
                    $scope.jobsCount = 0;
                }
                $scope.updateHeading($scope.hotJobsType);
                $scope.bInitialLoad = true;
                $scope.bSearchResults = false;
                $scope.bJobDetailsShown = false;
                $scope.bSidebarVisible = false;
                $scope.bSidebarShown = false;
                $scope.bSidebarOverlay = false;
                $scope.bShowMoreButton = false;
                $scope.bPowerSearchVisible = false;
                $scope.$root.workFlow = $scope.workFlow = "welcome";
                $("#hSMLocalId").val("");
                $("#hSMJobId").val("");
                $("#hSMTQId").val("");

                $scope.bPrivacyPages = false;
                $scope.bPrivacyOptOut = false;
                $scope.bPrivacyPolicyStatement = false;
                $scope.bPrivacyPolicyQuestion = false;
                $scope.bSelectedGroup = false;
                $scope.backtobSignInView = false;
                $scope.bCreateAccount = false;
                $scope.login.ForgotPass = false;
                $scope.bSignInView = false;
                $scope.LoginChangeSecQuestion = false;
                $scope.bCandidateZone = false;
                $scope.bRenderPhoneViewSearch = false;
                $scope.SelectJobs = $scope.tgSettings.SelectJobsText;

                if ($scope.bLoggedIn) {
                    var profiledetailsRequest = {
                        ClientId: $("#partnerId").val(),
                        SiteId: $("#siteId").val(),
                        SessionID: $("#CookieValue").val(),
                        ResponsiveCandidateZone: $scope.bresponsiveCandidateZone
                    };
                    $.ajax({
                        type: "POST",
                        url: "/TgNewUI/Search/Ajax/Getprofiledetails",
                        data: profiledetailsRequest,
                        success: function (data) {
                            $scope.ProfileDetails.FirstName = data.BasicProfileDetails.FirstName;
                            $scope.ProfileDetails.LastName = data.BasicProfileDetails.LastName;
                        }
                    });
                } else {
                    $scope.ProfileDetails != null ? $scope.ProfileDetails.FirstName = "" : null;
                    $scope.ProfileDetails != null ? $scope.ProfileDetails.LastName = "" : null;
                }

                setTimeout(function () { $scope.$apply(); }, 0);
                setTimeout(function () { $scope.setHash(false, arguments, this); }, 10);
            }
            else {
                var HomePageRequest = {};
                HomePageRequest.partnerId = $("#partnerId").val();
                HomePageRequest.siteId = $("#siteId").val();
                url = '/TgNewUI/Search/Ajax/HomeView';
                $http.post(url, HomePageRequest).success(function (data, status, headers, config) {
                    $scope.jobs = data.HotJobs.Job;
                    if (data.HotJobs.Job != null) {
                        $scope.jobsCount = data.HotJobs.Job.length;
                    }
                    else {
                        $scope.jobsCount = 0;
                    }
                    $scope.toggleCheckBoxes = false;
                    $scope.SelectedJobsChecked = false;
                    _.each($scope.jobs, function (job) {
                        job.Selected = false;
                    });
                    $scope.keywordFields = data.KeywordCustomSolrFields;
                    $scope.locationFields = data.LocationCustomSolrFields;
                    $scope.featuredJobs = data.HotJobs.Job;
                    $scope.jobCounterIntroText = $scope.jobCounterIntroText.replace("[#jobcount#]", data.TotalCount);
                    $scope.$root.queryParams.partnerid = $("#partnerId").val();
                    $("#pageType").val("");
                    $scope.showInitialJobs();
                    $scope.updateHeading(data.JobsType);
                    $scope.bInitialLoad = true;
                    $scope.bSearchResults = false;
                    $scope.bJobDetailsShown = false;
                    $scope.bSidebarVisible = false;
                    $scope.bSidebarShown = false;
                    $scope.bSidebarOverlay = false;
                    $scope.bShowMoreButton = false;
                    $scope.bPowerSearchVisible = false;
                    $scope.bHideBackButtonInJobDetails = false;
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "welcome";
                    $("#hSMLocalId").val("");
                    $("#hSMJobId").val("");
                    $("#hSMTQId").val("");
                    $("#hideBackButtonOnly").val("0");

                    $scope.bPrivacyPages = false;
                    $scope.bPrivacyOptOut = false;
                    $scope.bPrivacyPolicyStatement = false;
                    $scope.bPrivacyPolicyQuestion = false;
                    $scope.bSelectedGroup = false;
                    $scope.bCreateAccount = false;
                    $scope.login.ForgotPass = false;
                    $scope.bSignInView = false;
                    $scope.LoginChangeSecQuestion = false;
                    $scope.bCandidateZone = false;
                    $scope.bRenderPhoneViewSearch = false;
                    $scope.SelectJobs = $scope.tgSettings.SelectJobsText;
                    setTimeout(function () { $scope.$apply(); }, 0);
                    setTimeout(function () { $scope.setHash(false, arguments, this); }, 10);
                });
            }
            $scope.bJobCart = false;
            $scope.bFileManager = false;
            $scope.bGQLaunchedFromJobCart = false;
            $scope.bJobCartLaunchedFromSearchResults = false;
            $scope.bJobCartLaunchedFromJobDetails = false;
            $scope.SelectedJobsChecked = false;
            $scope.bJobCartLaunchedFromHome = false;
        },
        candidateZoneView: function () {

            if ($scope.applyPreloadJSON && $scope.applyPreloadJSON.WBMode) {
                return;
            }
            if ($scope.CandidateZoneData == null) {

                var candidateZoneRequest = {};
                candidateZoneRequest.PartnerId = $("#partnerId").val();
                candidateZoneRequest.SiteId = $("#siteId").val();
                candidateZoneRequest.EncryptedSessionId = $("#CookieValue").val();
                candidateZoneRequest.SIDValue = $("#SIDValue").val();
                url = '/TgNewUI/Search/Ajax/CandidateZone';
                $http.post(url, candidateZoneRequest).success(function (data, status, headers, config) {
                    $scope.bCandidateZone = true;
                    $scope.CandidateZoneData = data;
                    $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                    $scope.bLoggedIn = true;
                    $scope.bSignInView = false;
                    $scope.bSearchResults = false;
                    $scope.bJobDetailsShown = false;
                    $scope.bSidebarVisible = false;
                    $scope.bSidebarShown = false;
                    $scope.bSidebarOverlay = false;
                    $scope.bPowerSearchVisible = false;
                    $scope.bJobCart = false;
                    $scope.bSelectedGroup = false;
                    $scope.bJobCartLaunchedFromSearchResults = false;
                    $scope.bJobCartLaunchedFromHome = false;
                    $scope.bGQLaunchedFromJobCart = false;
                    $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                    $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                    $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.bCreateAccount = false;
                    if (data.LoggedInSettings.GeneralSocialReferral == "yes") {
                        $scope.SocialReferral_READY = data.LoggedInSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                        $scope.SocialReferral_FirstName = encodeURIComponent(data.CandidateFirstName);
                        $scope.SocialReferral_LastName = encodeURIComponent(data.CandidateLastName);
                        $scope.SocialReferral_ProfileId = data.LoggedInSettings.profileId;
                    }
                    $scope.setHash();
                });
            }
            else {
                $scope.bCandidateZone = true;
                $scope.bSearchResults = false;
                $scope.bJobDetailsShown = false;
                $scope.bSidebarVisible = false;
                $scope.bSidebarShown = false;
                $scope.bSidebarOverlay = false;
                $scope.bPowerSearchVisible = false;
                $scope.bSelectedGroup = false;
                $scope.welcomeTitle = $scope.CandidateZoneData.LoggedInSettings.LandingLoggedWelcomePageTitle;
                $scope.welcomeText = $scope.CandidateZoneData.LoggedInSettings.LandingLoggedWelcomeText;
                $scope.SearchOpeningsSummaryText = $scope.CandidateZoneData.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? $scope.CandidateZoneData.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                $scope.bCreateAccount = false;
                $scope.bJobCart = false;
                $scope.bFileManager = false;
                $scope.bJobCartLaunchedFromSearchResults = false;
                $scope.bGQLaunchedFromJobCart = false;
                $scope.bJobCartLaunchedFromHome = false;
                $scope.setHash();
            }

            $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/CandidateZone");

        },

        responsivecandidateZoneView: function (linkDetails, $event) {
            var candidatezoneView;
            if ($scope.sendToFriendInfo && $scope.sendToFriendInfo.emailSent)
                $scope.sendToFriendInfo.emailSent = false;
            if (typeof linkDetails != 'undefined') {
                candidatezoneView = linkDetails.CandidateZoneLinkId;
            }

            if ($scope.applyPreloadJSON && $scope.applyPreloadJSON.WBMode) {
                return;
            }

            var d = $("#responsiveCandZoneLink").position();
            if (d != undefined)
                $('.responsiveCandZoneMenu').css({
                    "left": +(d.left) + "px",
                    'top': +(d.top + 30) + "px"
                    //'float':'left'
                });
            $scope.bcandidatezoneSubmenu = !$scope.bcandidatezoneSubmenu;
            $("#responsiveCandZoneLink i").hasClass('fa-chevron-down') ? $("#responsiveCandZoneLink i").removeClass('fa-chevron-down').addClass('fa-chevron-up') : $("#responsiveCandZoneLink i").removeClass('fa-chevron-up').addClass('fa-chevron-down');
            if (candidatezoneView) {
                if ((candidatezoneView == "accountSettings" || candidatezoneView == "jobProfile") && $scope.candidatezoneSubView == candidatezoneView) {
                    return;
                }
                if (candidatezoneView == 'viewAssessment' || candidatezoneView == 'candidatePortal' || candidatezoneView == 'eventManager'
                    || candidatezoneView == 'communicationHistory' || candidatezoneView == 'submitGeneralReferral' || candidatezoneView == 'socialReferralStatus' || candidatezoneView == 'SearchJob') {
                    $scope.moveToNextPage(linkDetails.CandidateZoneLinkURL, $event);
                    return;
                }

                $scope.bLoggedIn = true;
                $scope.bSignInView = false;
                $scope.bSearchResults = false;
                $scope.bJobDetailsShown = false;
                $scope.bSidebarVisible = false;
                $scope.bSidebarShown = false;
                $scope.bSidebarOverlay = false;
                $scope.bPowerSearchVisible = false;
                $scope.bJobCart = false;
                $scope.bSelectedGroup = false;
                $scope.bJobCartLaunchedFromSearchResults = false;
                $scope.bJobCartLaunchedFromHome = false;
                $scope.bGQLaunchedFromJobCart = false;
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                $scope.bCreateAccount = false;
                $scope.bCandidateZone = true;
                $scope.candidatezoneSubView = candidatezoneView;
                $scope.bEditProfileEditMode = false;
                $scope.candidatezoneEditProfileView = "profile";
                $scope.savedSearchActionCompletion = 0;
                $scope.searchResultsFromSavedSearch = null;
                //$scope.jobDetailFields = null;
                $scope.subViewInitialized = false;

                if (candidatezoneView.toLowerCase() == "dashboard")
                    $scope.ViewDashBoardData("SavedJobs");
                else if (candidatezoneView.toLowerCase() == "responsiveassessment") {
                    $scope.candidatezoneSubView = candidatezoneView;
                    $scope.renderAssessments(linkDetails.CandidateZoneLinkURL);
                } else if (candidatezoneView.toLowerCase() == "responsivereferrals") {
                    $scope.candidatezoneSubView = candidatezoneView;
                    $scope.ViewReferrals();
                } else if (candidatezoneView.toLowerCase() == "messagearchive") {
                    $scope.CommunicationView(1);
                }

                $("#gateway").removeClass("ts-navigation-menu-on");
                if ($('#swfLeftMenu')) {
                    $("#swfLeftMenu").removeClass("ts-navigation-menu-on");
                    $("#swfLeftMenu").removeClass("visible");
                    $('#swfCoreNavigationControlFin').removeClass("expanded");
                }
            }
        },
        //This will be called from TS Menu only when Responsive Candidate Zone is true.
        launchSocialReferralFromTalentSuite: function () {
            $("#submitGeneralReferral")[0].click();
        },

        DashBoardBack: function () {

            history.back();
        },

        DashBoardMenu: function (currentTab) {
            ngDialog.closeAll();
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
            $scope.candidatezoneDashBoardView = currentTab;
            $scope.bAppsRemovalStatus = false;
            var DashboardRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val(),
                ConfiguredJobTitle: $scope.GetConfiguredJobTitle()

            };
            var Ajaxrequest = true;
            switch (currentTab) {
                case "SavedJobs":
                    if ($scope.DashboardPrevPage[0] != "SavedJobs")
                        $scope.DashboardPrevPage.unshift("SavedJobs");
                    if ($scope.savedJobsCache != null) {
                        $scope.bJobCart = true;
                        Ajaxrequest = false;
                        $scope.setTitle("JobCart");
                        $scope.alignCards("SavedJobsContainer", "jobCard");
                    }
                    DashboardRequest.Tab = 1;
                    break;
                case "Applications":
                    if ($scope.DashboardPrevPage[0] != "Applications")
                        $scope.DashboardPrevPage.unshift("Applications");
                    if (($scope.CandZoneUnFinishedApps != null) && ($scope.CandZoneAppliedApps != null)) {
                        Ajaxrequest = false;
                        $scope.setTitle("Applications");
                        $scope.alignCards("ApplicationsContainer", "jobCard");
                    }
                    else {
                        $scope.CandZoneApplicationCount = null;
                        $scope.CandZoneUnFinishedAppsCount = null;
                        $scope.CandZoneAppliedAppsCount = null;
                        $("#applicationTab").addClass("ApplicationCounts");
                        $(".applicationsSection").addClass("ApplicationCounts");
                    }
                    DashboardRequest.Tab = 2;
                    break;
                case "SavedSearches":
                    if ($scope.DashboardPrevPage[0] != "SavedSearches")
                        $scope.DashboardPrevPage.unshift("SavedSearches");
                    if (($scope.SavedSearches != null)) {
                        Ajaxrequest = false;
                        $scope.setTitle("SavedSearches");
                        $scope.alignCards("SavedSearchesContainer", "jobCard");
                    }
                    DashboardRequest.Tab = 3;
                    break;
                default:
                    if ($scope.DashboardPrevPage[0] != "SavedJobs")
                        $scope.DashboardPrevPage.unshift("SavedJobs");
                    DashboardRequest.Tab = 1;
                    break;
            }
            if (Ajaxrequest) {
                $scope.bCanZoneJobsLoadingState = true;
                $.ajax({
                    type: "POST",
                    url: "/TgNewUI/CandidateZone/Ajax/DashboardData",
                    data: DashboardRequest,
                    success: function (data) {
                        $scope.bCanZoneJobsLoadingState = false;
                        if (DashboardRequest.Tab == 1) {
                            $scope.setTitle("JobCart");
                            $scope.renderJobCart(data.DashboardData.JobCartResponse, true);
                            if (!$scope.utils.isNewHash('SavedJobs', $scope))
                                $scope.utils.updateHistory('SavedJobs');
                        }
                        if (DashboardRequest.Tab == 2) {
                            $scope.setTitle("Applications");
                            $scope.EnableResponsiveApplicationDetails = data.DashboardData.Applications.EnableResponsiveApplicationDetails;
                            $scope.HRStatusCatDetails = data.DashboardData.Applications.HRStatusCatDetails;
                            $scope.CandZoneUnFinishedAppsCount = data.DashboardData.Applications.UnfinshedCount;
                            $scope.CandZoneAppliedAppsCount = data.DashboardData.Applications.AppliedCount;
                            $scope.CandZoneApplicationCount = $scope.CandZoneUnFinishedAppsCount + $scope.CandZoneAppliedAppsCount;

                            $scope.CandZoneUnFinishedApps = data.DashboardData.Applications.UnfinishedJobs;
                            $scope.CandZoneAppliedApps = data.DashboardData.Applications.AppliedJobs;
                            $scope.CandZoneApplicationsExpiredJobs = data.DashboardData.Applications.ExpiredJobs;
                            $scope.CandZoneSubmittedApplicationsExpiredJobs = data.DashboardData.Applications.ExpiredSubmittedApplications;
                            $("#applicationTab").removeClass("ApplicationCounts");
                            $(".applicationsSection").removeClass("ApplicationCounts");
                            if (!$scope.utils.isNewHash('Applications', $scope))
                                $scope.utils.updateHistory('Applications');
                            if (!$scope.utils.isNewHash('SavedJobs', $scope)) {
                                $scope.oHistory["SavedJobs"].CandZoneUnFinishedAppsCount = data.DashboardData.Applications.UnfinshedCount;
                                $scope.oHistory["SavedJobs"].CandZoneAppliedAppsCount = data.DashboardData.Applications.AppliedCount;
                                $scope.oHistory["SavedJobs"].CandZoneApplicationCount = $scope.CandZoneUnFinishedAppsCount + $scope.CandZoneAppliedAppsCount;
                            }
                            if (!$scope.utils.isNewHash('SavedSearches', $scope)) {
                                $scope.oHistory["SavedSearches"].CandZoneUnFinishedAppsCount = data.DashboardData.Applications.UnfinshedCount;
                                $scope.oHistory["SavedSearches"].CandZoneAppliedAppsCount = data.DashboardData.Applications.AppliedCount;
                                $scope.oHistory["SavedSearches"].CandZoneApplicationCount = $scope.CandZoneUnFinishedAppsCount + $scope.CandZoneAppliedAppsCount;
                            }
                        }
                        else if (DashboardRequest.Tab == 3) {
                            $scope.setTitle("SavedSearches");
                            $scope.SavedSearches = data.DashboardData.SavedSearches;
                            if ($scope.SavedSearches != null) {
                                $scope.CandZoneSearchCount = $scope.SavedSearches.length;
                            }
                            $scope.SavedSearchesMetaData = {};
                            $scope.SavedSearchesMetaData.SavedSearches = [];
                            if ($scope.SavedSearches != null) {
                                $.each($scope.SavedSearches, function (i, obj) {
                                    $scope.SavedSearchesMetaData.SavedSearches.push({ 'Name': obj.SearchName, 'Value': obj.SavedSearchId });
                                });
                            }
                            $scope.$apply();
                            $scope.alignCards("SavedSearchesContainer", "jobCard");
                            if (!$scope.utils.isNewHash('SavedSearches', $scope))
                                $scope.utils.updateHistory('SavedSearches');
                        }
                        $scope.setHash();
                    },
                    error: function (xhr, textStatus, error) {
                        $scope.bCanZoneJobsLoadingState = false;
                    }
                });
            }
            else {
                $scope.setHash();
            }

        },

        renderDashBoard: function (response, currentTab, activeSection) {

            $scope.bLoggedIn = true;
            $scope.bSignInView = false;
            $scope.bSearchResults = false;
            $scope.bJobDetailsShown = false;
            $scope.bSidebarVisible = false;
            $scope.bSidebarShown = false;
            $scope.bSidebarOverlay = false;
            $scope.bPowerSearchVisible = false;
            $scope.bJobCart = false;
            $scope.bSelectedGroup = false;
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
            $scope.bCreateAccount = false;
            $scope.bEditProfileEditMode = false;
            $scope.savedSearchActionCompletion = 0;
            $scope.searchResultsFromSavedSearch = null;

            ngDialog.closeAll();
            $scope.CandZoneSavedJobsCount = null;
            $scope.CandZoneUnFinishedAppsCount = null;
            $scope.CandZoneAppliedAppsCount = null;
            $scope.CandZoneApplicationCount = null;
            $scope.CandZoneSearchCount = null;
            $scope.CandZoneUnFinishedApps = null;
            $scope.CandZoneApplicationsExpiredJobs = null;
            $scope.CandZoneSubmittedApplicationsExpiredJobs = null;
            $scope.CandZoneAppliedApps = null;
            $scope.SavedSearches = null;
            $scope.bCanZoneJobsLoadingState = true;

            $scope.bAppsRemovalStatus = false;

            $scope.bresponsiveCandidateZone = true;
            $scope.ApplicationRemoved = false;
            $scope.WithdrawlFromSubmittedApplications = false;
            $scope.ReactivateFromSubmittedApplications = false;

            $scope.bCanZoneJobsLoadingState = false;
            $scope.CandZoneSavedJobsCount = response.Counts.SavedJobsCount;
            $scope.CandZoneUnFinishedAppsCount = response.Counts.UnFinishedAppsCount;
            $scope.CandZoneAppliedAppsCount = response.Counts.AppliedCount;
            $scope.CandZoneApplicationCount = $scope.CandZoneUnFinishedAppsCount + $scope.CandZoneAppliedAppsCount
            $scope.CandZoneSearchCount = response.Counts.SavedSearchesCount;
            $scope.DashboardPrevPage = ["Home"];

            if (currentTab == 1) {
                $scope.setTitle("JobCart");
                $scope.DashboardPrevPage.unshift("SavedJobs");
                $scope.candidatezoneDashBoardView = "SavedJobs";
                $scope.renderJobCart(response.DashboardData.JobCartResponse, true);
                if (!$scope.utils.isNewHash('SavedJobs', $scope))
                    $scope.utils.updateHistory('SavedJobs');
            }
            else if (currentTab == 2) {
                $scope.setTitle("Applications");
                $scope.DashboardPrevPage.unshift("Applications");
                $scope.candidatezoneDashBoardView = "Applications";
                $scope.EnableResponsiveApplicationDetails = response.DashboardData.Applications.EnableResponsiveApplicationDetails;
                $scope.HRStatusCatDetails = response.DashboardData.Applications.HRStatusCatDetails;
                $scope.CandZoneUnFinishedApps = response.DashboardData.Applications.UnfinishedJobs;
                $scope.CandZoneAppliedApps = response.DashboardData.Applications.AppliedJobs;
                $scope.CandZoneApplicationsExpiredJobs = response.DashboardData.Applications.ExpiredJobs;
                $scope.CandZoneSubmittedApplicationsExpiredJobs = response.DashboardData.Applications.ExpiredSubmittedApplications;
                $scope.CallApply();
                if (typeof activeSection != "undefined") {
                    if ($scope.enumForDashBoardActiveSection.FinishedApplications == activeSection) {
                        $timeout(function () {
                            $scope.Collapse('CollapsedAppliedApplications')
                        }, 0);
                    }
                    else if ($scope.enumForDashBoardActiveSection.UnfinishedApplications == activeSection) {
                        $timeout(function () {
                            $scope.Collapse('CollapsedUnfinishedApplications');
                        }, 0);
                    }
                }
                if (!$scope.utils.isNewHash('Applications', $scope))
                    $scope.utils.updateHistory('Applications');
            }
            else if (currentTab == 3) {
                $scope.setTitle("SavedSearches");
                $scope.DashboardPrevPage.unshift("SavedSearches");
                $scope.candidatezoneDashBoardView = "SavedSearches";
                $scope.SavedSearches = response.DashboardData.SavedSearches;
                if ($scope.SavedSearches != null) {
                    $scope.CandZoneSearchCount = $scope.SavedSearches.length;
                }
                $scope.SavedSearchesMetaData = {};
                $scope.SavedSearchesMetaData.SavedSearches = [];
                if ($scope.SavedSearches != null) {
                    $.each($scope.SavedSearches, function (i, obj) {
                        $scope.SavedSearchesMetaData.SavedSearches.push({ 'Name': obj.SearchName, 'Value': obj.SavedSearchId });
                    });
                }

                $scope.alignCards("SavedSearchesContainer", "jobCard");
                if (!$scope.utils.isNewHash('SavedSearches', $scope))
                    $scope.utils.updateHistory('SavedSearches');
            }
            setTimeout(function () {
                $scope.$apply();
            }, 0);
            $scope.setHash();
        },

        ViewDashBoardData: function (currentTab, activeSection) {

            $scope.bLoggedIn = true;
            $scope.bSignInView = false;
            $scope.bSearchResults = false;
            $scope.bJobDetailsShown = false;
            $scope.bSidebarVisible = false;
            $scope.bSidebarShown = false;
            $scope.bSidebarOverlay = false;
            $scope.bPowerSearchVisible = false;
            $scope.bJobCart = false;
            $scope.bSelectedGroup = false;
            $scope.bProcessingWithDrawReactivate = false;
            $scope.ApplicationRemoved = false;
            $scope.WithdrawlFromSubmittedApplications = false;
            $scope.ReactivateFromSubmittedApplications = false;


            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
            $scope.bCreateAccount = false;
            $scope.bEditProfileEditMode = false;
            $scope.savedSearchActionCompletion = 0;
            $scope.searchResultsFromSavedSearch = null;
            $scope.candidatezoneSubView = "dashBoard";

            ngDialog.closeAll();
            if ($scope.DashboardPrevPage == undefined || ($scope.DashboardPrevPage[0] != "JobDetails" && $scope.DashboardPrevPage[0] != "SearchResults"))
                $scope.DashboardPrevPage = ["Home"];

            $scope.CandZoneSavedJobsCount = null;
            $scope.CandZoneUnFinishedAppsCount = null;
            $scope.CandZoneAppliedAppsCount = null;
            $scope.CandZoneApplicationCount = null;
            $scope.CandZoneSearchCount = null;
            $scope.CandZoneUnFinishedApps = null;
            $scope.CandZoneApplicationsExpiredJobs = null;
            $scope.CandZoneSubmittedApplicationsExpiredJobs = null;
            $scope.CandZoneAppliedApps = null;
            $scope.SavedSearches = null;
            $scope.savedJobsCache = null;
            $scope.bCanZoneJobsLoadingState = true;
            $scope.candidatezoneDashBoardView = currentTab;
            $scope.bAppsRemovalStatus = false;
            var DashboardRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val(),
                IsSearchAgentEnabled: $scope.bSearchAgentEnabled,
                ConfiguredJobTitle: $scope.GetConfiguredJobTitle()
            };
            switch (currentTab) {
                case "SavedJobs":
                    $scope.DashboardPrevPage.unshift("SavedJobs");
                    DashboardRequest.Tab = 1;
                    break;
                case "Applications":
                    $scope.DashboardPrevPage.unshift("Applications");
                    DashboardRequest.Tab = 2;
                    break;
                case "SavedSearches":
                    $scope.DashboardPrevPage.unshift("SavedSearches");
                    DashboardRequest.Tab = 3;
                    break;
                default:
                    $scope.DashboardPrevPage.unshift("SavedJobs");
                    DashboardRequest.Tab = 1;
                    break;
            }
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/Dashboard",
                data: DashboardRequest,
                success: function (data) {
                    $scope.bCanZoneJobsLoadingState = false;
                    $scope.CandZoneSavedJobsCount = data.Counts.SavedJobsCount;
                    $scope.CandZoneUnFinishedAppsCount = data.Counts.UnFinishedAppsCount;
                    $scope.CandZoneAppliedAppsCount = data.Counts.AppliedCount;
                    $scope.CandZoneApplicationCount = $scope.CandZoneUnFinishedAppsCount + $scope.CandZoneAppliedAppsCount;
                    $scope.CandZoneSearchCount = data.Counts.SavedSearchesCount;
                    $scope.ProfileDetails = data.BasicProfileDetails;


                    if (DashboardRequest.Tab == 1) {
                        $scope.setTitle("JobCart");
                        $scope.renderJobCart(data.DashboardData.JobCartResponse, true);
                        if (!$scope.utils.isNewHash('SavedJobs', $scope))
                            $scope.utils.updateHistory('SavedJobs');
                    }
                    else if (DashboardRequest.Tab == 2) {
                        $scope.setTitle("Applications");
                        $scope.EnableResponsiveApplicationDetails = data.DashboardData.Applications.EnableResponsiveApplicationDetails;
                        $scope.HRStatusCatDetails = data.DashboardData.Applications.HRStatusCatDetails;
                        $scope.CandZoneUnFinishedApps = data.DashboardData.Applications.UnfinishedJobs;
                        $scope.CandZoneAppliedApps = data.DashboardData.Applications.AppliedJobs;
                        $scope.CandZoneApplicationsExpiredJobs = data.DashboardData.Applications.ExpiredJobs;
                        $scope.CandZoneSubmittedApplicationsExpiredJobs = data.DashboardData.Applications.ExpiredSubmittedApplications;
                        $scope.CandZoneUnFinishedAppsCount = data.DashboardData.Applications.UnfinshedCount;
                        $scope.CandZoneAppliedAppsCount = data.DashboardData.Applications.AppliedCount;
                        $scope.CandZoneApplicationCount = $scope.CandZoneUnFinishedAppsCount + $scope.CandZoneAppliedAppsCount;
                        $scope.CallApply();
                        if (typeof activeSection != "undefined") {
                            if ($scope.enumForDashBoardActiveSection.FinishedApplications == activeSection) {
                                $timeout(function () {
                                    $scope.Collapse('CollapsedAppliedApplications')
                                }, 0);
                            }
                            else if ($scope.enumForDashBoardActiveSection.UnfinishedApplications == activeSection) {
                                $timeout(function () {
                                    $scope.Collapse('CollapsedUnfinishedApplications');
                                }, 0);
                            }
                        }
                        if (!$scope.utils.isNewHash('Applications', $scope))
                            $scope.utils.updateHistory('Applications');
                    }
                    else if (DashboardRequest.Tab == 3) {
                        $scope.setTitle("SavedSearches");
                        $scope.SavedSearches = data.DashboardData.SavedSearches;
                        if ($scope.SavedSearches != null) {
                            $scope.CandZoneSearchCount = $scope.SavedSearches.length;
                        }
                        $scope.SavedSearchesMetaData = {};
                        $scope.SavedSearchesMetaData.SavedSearches = [];
                        if ($scope.SavedSearches != null) {
                            $.each($scope.SavedSearches, function (i, obj) {
                                $scope.SavedSearchesMetaData.SavedSearches.push({ 'Name': obj.SearchName, 'Value': obj.SavedSearchId });
                            });
                        }

                        $scope.alignCards("SavedSearchesContainer", "jobCard");
                        if (!$scope.utils.isNewHash('SavedSearches', $scope))
                            $scope.utils.updateHistory('SavedSearches');
                    }
                    $scope.setHash();
                },
                error: function (xhr, textStatus, error) {
                    $scope.bCanZoneJobsLoadingState = false;
                }
            });

        },

        unfinishedApplicationsDupCheckAjax: function (ApplyData) {
            $scope.CandZoneApplyData = ApplyData;
            var DuplicateCheckRequestForMultipleJobs = {
                clientId: $("#partnerId").val(),
                siteId: $scope.CandZoneApplyData.SiteId,
                jobAndSiteIds: $scope.CandZoneApplyData.SavedDraftInfo.JobSiteId,
                sid: $("#CookieValue").val(),
                jobInfo: $scope.CandZoneApplyData.SavedDraftInfo.JobInfo
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/Search/Ajax/CheckDuplicateSubmissionForMultipleJobs",
                data: DuplicateCheckRequestForMultipleJobs,
                success: function (data) {
                    $scope.ApplyDifference = data.ApplyDiff;
                    $scope.LimitExceededMessage = data.LimitExceededMessage;
                    $scope.MultipleJobStatus = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })) : "";
                    $scope.NoofJobsApplied = data.ApplyStatus != null ? (_.where(data.ApplyStatus, { "Applied": true })).length : 0;
                    $scope.AllJobsApplied = $scope.NoofJobsApplied == $scope.CandZoneApplyData.SavedDraftInfo.ReqCount ? true : false;
                    if ($scope.ApplyDifference <= 0) {
                        $scope.NoOfJobsExceededMaxLimit = (eval(data.MaxSubmissions) - eval(data.CurrentSubmissions)) > 0 ? ($scope.CandZoneApplyData.SavedDraftInfo.ReqCount - (eval(data.MaxSubmissions) - eval(data.CurrentSubmissions))) : 0;
                    }
                    $scope.dialogCalledfrom = 'UnfinishedJobs';
                    $scope.CandZoneDupcheck = $scope;
                    $scope.CandZoneApplyData.SavedDraftInfo.ReqID = data.ReqsThatCanBeApplied;
                    if ($scope.NoofJobsApplied > 0 || $scope.ApplyDifference <= 0) {
                        $('body').addClass('noScroll');
                        ngDialog.open({
                            preCloseCallback: function (value) {
                                $('body').removeClass('noScroll');
                                $.restoreFocus();
                            },
                            template: 'MultipleApplyValidations', scope: $scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
                        });
                    }
                    else
                        $scope.unfinishedJobsApplyRemove($scope.CandZoneApplyData, 'Apply');
                }
            });
        },

        removeDupUnfinsihedJobs: function () {
            ngDialog.closeAll();
            $scope.CandZoneDupcheck.NoOfJobsExceededMaxLimit = $scope.CandZoneDupcheck.NoOfJobsExceededMaxLimit - $scope.CandZoneDupcheck.NoofJobsApplied;
            $scope.CandZoneDupcheck.NoofJobsApplied = 0;
            ngDialog.closeAll();
            if ($scope.CandZoneDupcheck.NoofJobsApplied > 0 || $scope.CandZoneDupcheck.ApplyDifference <= 0) {
                $('body').addClass('noScroll');
                ngDialog.open({
                    preCloseCallback: function (value) {
                        $('body').removeClass('noScroll');
                        $.restoreFocus();
                    },
                    template: 'MultipleApplyValidations', scope: $scope.CandZoneDupcheck, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
                });
            }
            else {
                $scope.unfinishedJobsApplyRemove($scope.CandZoneApplyData, 'Apply');
            }
        },

        unfinishedJobsApply: function () {
            ngDialog.closeAll();
            $scope.unfinishedJobsApplyRemove($scope.CandZoneApplyData, 'Apply');
        },

        unfinishedJobsApplyRemove: function (ApplyData, ajaxMethod) {
            ngDialog.closeAll();
            if (ajaxMethod == "UnfinishedjobsDupcheck") {
                $scope.unfinishedApplicationsDupCheckAjax(ApplyData);
            }
            else if (ajaxMethod == "Apply") {
                if ($.queryParams().applyTest || ApplyData.IsResponsiveGQ) {
                    if (ApplyData.SiteId != $("#siteId").val()) {
                        //SwitchSite
                        var switchSiteRequest = {};
                        switchSiteRequest.PartnerId = $("#partnerId").val();
                        switchSiteRequest.SwitchToSiteId = ApplyData.SiteId;
                        switchSiteRequest.FromSiteId = $("#siteId").val();
                        switchSiteRequest.CookieValue = $("#CookieValue").val();
                        $.ajax({
                            success: function (data, status, jqxhr) {
                                if (data.Success == true) {
                                    window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + ApplyData.SiteId + "&TQId=" + ApplyData.TQID + "&bruid=" + encodeURIComponent($scope.encryptedBruid) + "&GQSessionId=" + ApplyData.GQSessionID + "&reqid=" + ApplyData.SavedDraftInfo.ReqID + "&AIPID=" + ApplyData.AIPID + "&PageId=" + ApplyData.SavedDraftInfo.PageId + "&calledFrom=CandidateZone";
                                }
                            },
                            error: function (jqxhr, status, error) {
                            },
                            url: '/TgNewUI/Search/Ajax/SwitchSite',
                            data: switchSiteRequest,
                            type: 'POST'
                        });
                    }
                    else {
                        var rft = $("[name='__RequestVerificationToken']").val();
                        $.ajax({
                            method: "GET",
                            url: "/gqweb/apply?BRUID=" + encodeURIComponent($scope.encryptedBruid) + "&TQId=" + ApplyData.TQID + "&GQSessionId=" + ApplyData.GQSessionID + "&reqid=" + ApplyData.SavedDraftInfo.ReqID + "&partnerid=" + $("#partnerId").val() + "&PageId=" + ApplyData.SavedDraftInfo.PageId + "&AIPID=" + ApplyData.AIPID + "&siteid=" + ApplyData.SiteId + "&CalledfromSavedDrafts=" + true + "&wbmode=false&loadingViaAjax=true&RFT=" + rft,
                            success: function (result) {
                                $scope.bGQLaunchedFromunfinishedApplications = true;

                                $scope.$root.applyResponse = result;
                                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                setTimeout(function () {
                                    $scope.$apply();
                                }, 0);
                            }
                        });
                    }
                }
                else {

                    postValues = {
                        JobInfo: ApplyData.SavedDraftInfo.JobInfo,
                        ResumeId: ApplyData.ResumeId,
                        CoverLetterId: ApplyData.CoverLetterId,
                        Attachments: ApplyData.Attachments,
                        Type: ApplyData.Type,
                        AIPId: ApplyData.AIPID,
                        Site: ApplyData.SiteId,
                        GQID: (ApplyData.TQID == null || ApplyData.TQID == "") ? ApplyData.SavedDraftInfo.TQID : ApplyData.TQID,
                        drafttype: ApplyData.Type,
                        ResumeDraft: ApplyData.SavedDraftInfo.PageId + '|' + ApplyData.SavedDraftInfo.SectionId + '|' + ApplyData.ResumeId,
                        AllInactive: "",
                        Inactive: "",
                        GQTitle: ApplyData.Title,
                        ApplyCount: ApplyData.SavedDraftInfo.ReqCount,
                        hdRft: $("#rfToken").val()
                    };

                    ////Contruct the redirect url
                    var redirecturl = "../../../TGwebhost/";
                    var RedirectPath = "";

                    var target = "";

                    if (ApplyData.Type != '6' && ApplyData.Type != '7' && ApplyData.Type != '8') {
                        if ($scope.isGTG) {
                            //LDP:118 Added this AND condition to skip this validation in case of additional sites
                            if ($("#siteId").val() != ApplyData.SiteId) {
                                RedirectPath = "Yes";
                            }
                        }
                        if (ApplyData.ResumeId == -1 || ApplyData.CoverLetterId == -1) {

                            if (RedirectPath != "")
                                redirecturl = redirecturl + "sacswitch.aspx?SID=" + $("#SIDValue").val() + "&RD=SR";
                            else
                                redirecturl = redirecturl + "selectresume.aspx?SID=" + $("#SIDValue").val();
                        }
                        else if (ApplyData.Attachments.indexOf("UpdatedFlag") > -1) {
                            if (RedirectPath != "")
                                redirecturl = redirecturl + "sacswitch.aspx?SID=" + $("#SIDValue").val() + "&RD=SR";
                            else
                                redirecturl = redirecturl + "attachments.aspx?SID=" + $("#SIDValue").val();
                        }
                        else {
                            if (ApplyData.Type == 0 || ApplyData.Type == 2) // JobApply or SubmitNow flow - Questions page
                            {
                                if (RedirectPath != "")
                                    redirecturl = redirecturl + "sacswitch.aspx?SID=" + $("#SIDValue").val() + "&RD=AQ";
                                else
                                    redirecturl = redirecturl + "answerquestions.aspx?SID=" + $("#SIDValue").val() + "#starthere";
                            }
                            else if (ApplyData.Type == 9)
                                redirecturl = redirecturl + "selectresume.aspx?SID=" + $("#SIDValue").val() + "#starthere";
                            else if (ApplyData.Type == 10)
                                redirecturl = redirecturl + "profileprovider.aspx?SID=" + $("#SIDValue").val() + "#starthere";
                            else if (ApplyData.Type == 11)
                                redirecturl = redirecturl + "profiledetail.aspx?SID=" + $("#SIDValue").val() + "#starthere";
                            else //nType = 1 or 3 - JobApply or SubmitNow flow - AttachForm page
                            {
                                if (RedirectPath != "")
                                    redirecturl = redirecturl + "sacswitch.aspx?SID=" + $("#SIDValue").val() + "&RD=AF";
                                else
                                    redirecturl = redirecturl + "attachform.aspx?SID=" + $("#SIDValue").val() + "#starthere";
                            }
                        }
                    }
                    else {
                        var subWindow;
                        var w;
                        var h;

                        if (document.all) {
                            w = screen.availWidth;
                            h = screen.availHeight;
                        }
                        else if (document.layers) {
                            w = window.innerWidth;
                            h = window.innerHeight;
                        }
                        var popW = 750, popH = 550;
                        var topPos = (h - popH) / 2, leftPos = (w - popW) / 2;

                        //LDP118: Candidate API changes
                        if ($("#siteId").val() != ApplyData.SiteId) {
                            RedirectPath = "Yes";
                        }
                        if (RedirectPath != "") {
                            redirecturl = redirecturl + "sacswitch.aspx?SID=" + $("#SIDValue").val() + "&RD=AIP&idx=" + nIndex;
                            window.document.frmAIP.target = "_self";
                        }
                        if (ApplyData.Type != '8') {

                            subWindow = window.open("", "gqapply", 'height=' + popH + ',width=' + popW + ',screenY=' + topPos + ',screenX=' + leftPos + ',top=' + topPos + ',left=' + leftPos + ',menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                            target = "gqapply";
                            redirecturl = "../../../" + ApplyData.LocaleId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val();
                            subWindow.focus();
                        }
                        else {
                            if (ApplyData.TQID != '0') {

                                //BR001: Apply start..added this IF condition...redirecting to new UI page
                                if (strRedirectURL != '') {
                                    window.location = strRedirectURL;
                                    return false;
                                }
                                subWindow = window.open("", "gqapply", 'height=' + popH + ',width=' + popW + ',screenY=' + topPos + ',screenX=' + leftPos + ',top=' + topPos + ',left=' + leftPos + ',menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                                target = "gqapply";
                                redirecturl = "../../../" + ApplyData.LocaleId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val();
                                subWindow.focus();

                            }
                            else {
                                redirecturl = redirecturl + "deleteaips.aspx?SID=" + $("#SIDValue").val() + "&AIPID=" + ApplyData.AIPID + "&allinactive=trad&ji=" + ReplaceInString(ApplyData.SavedDraftInfo.JobInfo, "%", "__PERCENT__");
                            }
                        }
                    }
                    //Submit the form
                    $.form(url = redirecturl, data = postValues, method = 'POST', target = target, id = "frmClassicRedirect").submit();

                }
            }
            else if (ajaxMethod == "Remove") {
                //removeApplication
                var RemoveUnfinishedJobRequest = {
                    ClientId: $("#partnerId").val(),
                    SiteId: $("#siteId").val(),
                    SessionID: $("#CookieValue").val(),
                    AIPID: ApplyData.AIPID

                };
                $.ajax({
                    type: "POST",
                    url: "/TgNewUI/CandidateZone/Ajax/RemoveUnfinishedJob",
                    data: RemoveUnfinishedJobRequest,
                    success: function (data) {
                        if (data.Success) {
                            _.remove($scope.CandZoneUnFinishedApps, function (currentObject) {
                                return currentObject.AIPID === ApplyData.AIPID;
                            });
                            $scope.CandZoneUnFinishedAppsCount = $scope.CandZoneUnFinishedAppsCount - 1;
                            $scope.CandZoneApplicationCount = $scope.CandZoneApplicationCount - 1;
                            $scope.bAppsRemovalStatus = true;
                            //$scope.CandZoneUnFinishedApps = _.remove($scope.CandZoneUnFinishedApps, { AIPID: ApplyData.AIPID });
                        }
                    }
                });
            }
        },

        withDrawApplyFinishedApplication: function (AppliedAppData) {
            ngDialog.closeAll();
            if ($scope.candidatezoneSubView == 'applicationDetail') {
                $scope.WithdrawlFromApplicationDetail = false;
                $scope.ReactivateFromApplicationDetail = false;
            }
            else {
                $scope.WithdrawlFromSubmittedApplications = false;
                $scope.ReactivateFromSubmittedApplications = false;
            }

            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
            if (!$scope.bProcessingWithDrawReactivate) {
                $scope.bProcessingWithDrawReactivate = true;
                var DashboardRequest = {
                    ClientId: $("#partnerId").val(),
                    SiteId: $("#siteId").val(),
                    SessionID: $("#CookieValue").val(),
                    Reqid: AppliedAppData.ReqId,
                    FileAction: AppliedAppData.FileAction,
                    JobRequisitionID: AppliedAppData.JobRequisitionId,
                };
                $.ajax({
                    type: "POST",
                    url: "/TgNewUI/CandidateZone/Ajax/WithdrawReactivate",
                    data: DashboardRequest,
                    success: function (data) {
                        $scope.bProcessingWithDrawReactivate = false;
                        if (data.FetchingSubmittedApplicationsFromExpress) {
                            if (data.Type == 1) { //Success
                                if ($scope.EnableResponsiveApplicationDetails) {
                                    //If req is Closed/Cancelled/Deleted
                                    if (AppliedAppData.ReqStatus == 3 || AppliedAppData.ReqStatus == 4 || AppliedAppData.ReqStatus == 7) {
                                        AppliedAppData.Status = _.where(appScope.HRStatusCatDetails, { "HRStatusCatID": 6 })[0].HRStatusCatLabel;
                                        AppliedAppData.LastUpdated = AppliedAppData.ReqStatusDate;
                                        AppliedAppData.ShowRemoveLink = true;
                                    }
                                    else {
                                        AppliedAppData.Status = _.where(appScope.HRStatusCatDetails, { "HRStatusCatID": data.CurrentCategoryId })[0].HRStatusCatLabel;
                                        if (data.CurrentIntialCategoryDate == '' || data.CurrentIntialCategoryDate == null) { //if its a 0 -filed status, hrfolderid can be null.
                                            AppliedAppData.LastUpdated = AppliedAppData.JobSubmissionDate;
                                        }
                                        else {
                                            AppliedAppData.LastUpdated = data.CurrentIntialCategoryDate;
                                        }
                                        AppliedAppData.ShowRemoveLink = false;
                                    }
                                }
                                else {
                                    AppliedAppData.Status = data.CurrentHRStatusLabel;
                                    AppliedAppData.LastUpdated = data.CurrentHRStatusDate;
                                }

                                if (AppliedAppData.FileAction == 0) { //If Withdraw is success
                                    if ($scope.candidatezoneSubView == 'applicationDetail') {
                                        $scope.WithdrawlFromApplicationDetail = true;
                                    }
                                    else {
                                        $scope.WithdrawlFromSubmittedApplications = true;
                                    }
                                    AppliedAppData.FileAction = 2;
                                    if ($scope.candidatezoneSubView == 'applicationDetail') {
                                        var index = $scope.ApplicationDetailActions.indexOf($scope.dynamicStrings.Lbl_WithdrawApplication);
                                        $scope.ApplicationDetailActions.splice(index, 1);
                                        $scope.ApplicationDetailActions.push($scope.dynamicStrings.Lbl_ReactivateApplication);
                                        _.each($("#ApplicationDetailAction-menu li"), function (innerItem) {
                                            if (innerItem.innerText == $scope.dynamicStrings.Lbl_WithdrawApplication)
                                                innerItem.innerText = $scope.dynamicStrings.Lbl_ReactivateApplication;
                                        });
                                    }
                                }
                                else if (AppliedAppData.FileAction == 2) { //If Reactivate is success
                                    if ($scope.candidatezoneSubView == 'applicationDetail') {
                                        $scope.ReactivateFromApplicationDetail = true;
                                    }
                                    else {
                                        $scope.ReactivateFromSubmittedApplications = true;
                                    }
                                    AppliedAppData.FileAction = 0;
                                    if ($scope.candidatezoneSubView == 'applicationDetail') {
                                        var index = $scope.ApplicationDetailActions.indexOf($scope.dynamicStrings.Lbl_ReactivateApplication);
                                        $scope.ApplicationDetailActions.splice(index, 1);
                                        $scope.ApplicationDetailActions.push($scope.dynamicStrings.Lbl_WithdrawApplication);
                                        _.each($("#ApplicationDetailAction-menu li"), function (innerItem) {
                                            if (innerItem.innerText == $scope.dynamicStrings.Lbl_ReactivateApplication)
                                                innerItem.innerText = $scope.dynamicStrings.Lbl_WithdrawApplication;
                                        });
                                    }

                                }
                                if ($scope.candidatezoneSubView == 'applicationDetail' && !$scope.previewOfSubmittedApplication) {
                                    $scope.showApplicationDetail(AppliedAppData, true);
                                }
                            }
                            else if (data.Type == 2 && AppliedAppData.FileAction == 2) { //Cannot Reactivate -- FileAction99
                                AppliedAppData.ShowFileAction99 = true;
                            }
                        }
                        else if (data.Type == 1) {
                            _.each($scope.CandZoneAppliedApps, function (innerItem) {
                                if (innerItem.ReqId == AppliedAppData.ReqId)
                                    innerItem.FileAction = '1';
                            });
                        }
                        setTimeout(function () {
                            $scope.$apply();
                            $scope.adjustHeaderStickers();
                        }, 0);
                    }
                }).error(function (data, status, headers, config) {
                    $scope.bProcessingWithDrawReactivate = false;
                });
            }
        },

        reApplyFromFinsihedApplications: function (job) {
            var type = "";
            var jobId, gqId, jobInfo, partnerId, siteId, langId, jobSiteInfo, postValues, isGQResponsive, localeId, encryptedBruid, sid, origSiteId;
            var switchSite = false;
            var Questions = job.Questions;
            jobId = job.ReqId;
            gqId = job.TQID;
            langId = job.JobReqLang;
            partnerId = $("#partnerId").val();
            origSiteId = $("#siteId").val();
            siteId = job.AppliedSiteid;
            if (siteId == 0) {
                siteId = job.JobSiteId;
            }

            sid = $("#SIDValue").val();
            //scope.siteId = siteId;
            isGQResponsive = job.IsResponsiveGQ;
            localeId = job.LocaleId;
            encryptedBruid = $scope.encryptedBruid;
            jobInfo = "%%" + jobId + "|" + langId + "|" + gqId + "%%";
            $scope.jobSiteInfo = jobId + "_" + siteId;
            var groupGQId = gqId;
            if (isGQResponsive) {
                if (siteId != origSiteId) {
                    $scope.jobApplyUrl = "&tqid=" + gqId + "&reqid=" + jobId + "&partnerid=" + partnerId + "&siteid=" + siteId + "&calledFrom=JobDetails";
                }
                else {
                    $scope.jobApplyUrl = "&tqid=" + gqId + "&localeid=" + localeId + "&reqid=" + jobId + "&partnerid=" + partnerId + "&siteid=" + siteId + "&loadingViaAjax=true";
                }
                //if ($scope.ApplyDifference > 0) {
                //if (angular.isDefined(scope.oActiveLaddaButton))
                //    scope.oActiveLaddaButton.start();
                if (siteId != origSiteId) {
                    var switchSiteRequest = {};
                    switchSiteRequest.PartnerId = partnerId;
                    switchSiteRequest.SwitchToSiteId = siteId;
                    switchSiteRequest.FromSiteId = origSiteId;
                    switchSiteRequest.CookieValue = $("#CookieValue").val();
                    $.ajax({
                        success: function (data, status, jqxhr) {
                            if (data.Success == true) {
                                var bruid = encryptedBruid != "" ? encryptedBruid : $.queryParams().bruid;
                                window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&TQId=" + gqId + "&bruid=" + encodeURIComponent(bruid) + "&reqid=" + jobId + "&calledFrom=JobDetails";
                            }
                        },
                        error: function (jqxhr, status, error) {
                        },
                        url: '/TgNewUI/Search/Ajax/SwitchSite',
                        data: switchSiteRequest,
                        type: 'POST'
                    });
                }
                else {
                    var rft = $("[name='__RequestVerificationToken']").val();
                    $http.get(
                        "/gqweb/apply?bruid=" + encodeURIComponent(encryptedBruid) + "&tqid=" + gqId + "&localeid=" + localeId + "&reqid=" + jobId + "&partnerid=" + partnerId + "&siteid=" + siteId + "&sid=" + sid + "&loadingViaAjax=true&RFT=" + rft

                    ).success(function (result) {
                        //if (angular.isDefined(scope.oActiveLaddaButton))
                        //    scope.oActiveLaddaButton.stop();
                        appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                        $scope.$root.applyResponse = result;
                    });
                }
                //}
            } else {
                type = "search_jobdetail";
                if (gqId == "0") {
                    postValues = { JobInfo: jobInfo, ApplyCount: "1", type: type, JobSiteId: siteId, hdRft: $("#rfToken").val() };
                    redirectPage = "apply.aspx";
                    $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();
                }
                else {
                    if ($scope.tgSettings.Mobileoptimised == "true") {
                        postValues = { JobInfo: jobInfo, ApplyCount: "1", type: type, JobSiteId: siteId, GQLoginURL: "../" + localeId + "/asp/tg/GQLogin.asp?SID=GQSESSION&fjd=true&referer=&gqid=" + _.max(groupGQId.split(",")) + "&jobinfo=" + jobInfo.replace(/%%/g, "__") + "&applycount=1&type=" + type + "&mobile=1", hdRft: $("#rfToken").val() };//need to change gqlogin url

                        redirectPage = "apply.aspx";
                        $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST').submit();
                    }
                    else {
                        if (siteId != origSiteId) {
                            $scope.switchSite(siteId, "fromApply");
                            switchSite = true;
                        }
                        window.open("../../../" + localeId + "/asp/tg/GQLogin.asp?SID=" + $("#SIDValue").val() + "&language=" + langId + "&fjd=true&referer=&gqid=" + _.max(groupGQId.split(",")) + "&jobinfo=" + jobInfo.replace(/%%/g, "__") + "&applycount=1&type=" + type, '_blank', 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                        if (switchSite) {
                            window.location = "/TgNewUI/Search/Home/HomeWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + siteId + "&jobid=" + jobId + "&PageType=jobdetails";
                        }

                    }
                }
            }
        },

        removeFromFinishedApplications: function (job) {
            var RequestToRemoveFinishedApplication = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val(),
                LangId: job.JobReqLang,
                ReqId: job.ReqId
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/RemoveFinishedApplication",
                data: RequestToRemoveFinishedApplication,
                success: function (data) {
                    $scope.CloseDialogs();
                    if (data.Success) {
                        $scope.ApplicationRemoved = true;
                        _.remove($scope.CandZoneAppliedApps, function (currentObject) {
                            return currentObject.ReqId === job.ReqId;
                        });
                        $scope.CandZoneAppliedAppsCount = $scope.CandZoneAppliedAppsCount - 1;
                        $scope.CandZoneApplicationCount = $scope.CandZoneApplicationCount - 1;
                        setTimeout(function () {
                            $scope.$apply();
                            $scope.adjustHeaderStickers();
                        }, 0);
                    }
                },
                error: function () {
                    $scope.ApplicationRemoved = true;
                    _.remove($scope.CandZoneAppliedApps, function (currentObject) {
                        return currentObject.ReqId === job.ReqId;
                    });
                }

            });
        },

        runSavedSearch: function (savedSearch) {
            $scope.bCanZoneJobsLoadingState = true;
            $scope.bSearchSaved = false;
            var RunSavedSearchRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionValue: $("#CookieValue").val(),
                SavedSearchId: savedSearch.SavedSearchId,
                KeywordCustomSolrFields: $scope.keywordFields,
                LocationCustomSolrFields: $scope.locationFields
            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/RunSavedSearch",
                data: RunSavedSearchRequest,
                success: function (data) {
                    $scope.searchResultsFromSavedSearch = savedSearch;
                    $scope.bCandidateZone = false;
                    $scope.sortby = data.SelectedSortType;
                    if ($scope.sortby == "" || $scope.sortby == null) {
                        $scope.sortby = 0;
                    }
                    if (data.SearchResultsResponse.Jobs) {
                        $scope.jobs = data.SearchResultsResponse.Jobs.Job;
                    }
                    else {
                        $("#searchResults").val('');
                        $scope.jobs = null;
                    }
                    $scope.latitude = $scope.SaveSearchCriteria.Latitude = data.SearchResultsResponse.Latitude;
                    $scope.longitude = $scope.SaveSearchCriteria.Longitude = data.SearchResultsResponse.Longitude;
                    $scope.powerSearchQuestions = data.PowerSearchQuestions.Questions;

                    $scope.TranslatePowerSearchQuestions($scope.powerSearchQuestions);
                    if ($scope.powerSearchQuestions != "") {
                        _.forEach(that.powerSearchQuestions, function (aQuestion) {
                            $.htmlEncodeSpecial(aQuestion);
                            if (aQuestion.QuestionType == "date") {
                                aQuestion.rangeValid = 1;
                            }
                            if (aQuestion.QId == "0") {
                                aQuestion.Options.unshift(
                               {
                                   OptionName: $scope.dynamicStrings.Option_All,
                                   OptionValue: "999999",
                                   Selected: data.AllLanguagesSelected,
                                   Count: 0
                               });
                            }
                            if (aQuestion.SelectedOptionsFromSavedSearch != null) {
                                var aData = $.map(aQuestion.SelectedOptionsFromSavedSearch, function (val, id) {
                                    return {
                                        data: id,
                                        label: val,
                                        value: val
                                    };
                                });
                                aQuestion.selectedOptions = aData;
                            }
                        });
                    }

                    if (data.SearchResultsResponse.Facets)
                        $scope.facets = data.SearchResultsResponse.Facets.Facet;
                    else
                        $scope.facets = null;
                    if ($scope.facets != null) {
                        _.each($scope.facets, function (facet) {
                            facet.SelectedCount = _.filter(facet.Options, { Selected: true }).length;
                        });
                    }
                    $scope.bInitialLoad = false;
                    $scope.bSidebarShown = true;
                    $scope.bSidebarVisible = true;
                    $scope.bSearchResults = true;
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                    $scope.pageNumber = 1;
                    $scope.keyWordSearch.text = data.Keyword;
                    $scope.locationSearch.text = data.Location;
                    var searchCriteria = "";
                    if ($scope.keyWordSearch.text != "") {
                        searchCriteria = $scope.keyWordSearch.text
                    }
                    if ($scope.locationSearch.text != "") {
                        searchCriteria = searchCriteria + "," + $scope.locationSearch.text;
                    }
                    $scope.jobsHeading = $scope.searchResultsText.replace("[#searchresults#]", data.SearchResultsResponse.JobsCount).replace("[#searchcriteria#]", searchCriteria.replace(/(^,)|(,$)/g, ""));
                    if (data.SearchResultsResponse.JobsCount <= 0) {
                        $scope.jobsHeading = $scope.dynamicStrings.Label_NoJobs;
                    } else if (searchCriteria == null || searchCriteria == undefined || searchCriteria == "") {
                        $scope.jobsHeading = $scope.jobsHeading.replace("  ", " ");
                        //$scope.jobsHeading = data.JobsCount + " " + $scope.dynamicStrings.Label_searchresults;
                    }
                    if ($scope.bShowFilterAccordion) {
                        $scope.bShowFilterAccordion = false;
                        $scope.bRenderFacetFilterAccordion = false;
                        $scope.bShowFacetAccordionOptions = false;
                        $scope.bFilterAccordionOpen = false;
                        $scope.bPinFacetArrow = false;
                    }
                    $scope.filterAppliedCount = data.SearchResultsResponse.FiltersCount;
                    $scope.filtersAppliedText = response.ClientSettings.FiltersAppliedText.replace("[#filternumber#]", data.SearchResultsResponse.FiltersCount);
                    $scope.jobsCount = data.SearchResultsResponse.JobsCount;
                    //that.sortFields = data.SortFields;
                    $scope.sortFields = _.each(data.SearchResultsResponse.SortFields, function (field) {
                        field.LocalizedString = eval("$scope.dynamicStrings.Option_" + field.Value);
                    });
                    if ($scope.jobsCount > (50 * $scope.pageNumber)) {
                        $scope.bShowMoreButton = true;
                    }
                    else {
                        $scope.bShowMoreButton = false;
                    }
                    $scope.bPowerSearchVisible = false;
                    $scope.preloadPowerSearch = true;
                    $scope.setHash();
                    setTimeout(function () {
                        $scope.$apply();
                        $scope.scrolltop();
                        $scope.bCanZoneJobsLoadingState = false;
                    }, 0);
                }
            });
        },

        closeActionDropDown: function (container) {
            $("." + container + " .dropdown").hide();
        },

        closeSavedSearchesActionDropDown: function () {
            $(".SavedSearchesContainer .dropdown").hide();
        },

        savedSearchAction: function (savedSearch, action) {
            $scope.closeSavedSearchesActionDropDown();
            $scope.savedSearchActionCompletion = 0;

            if (action == $scope.enumForSavedSearchActions.Configure) {
                $scope.openSaveSearchDialog(savedSearch);
            }
            else if (action == $scope.enumForSavedSearchActions.Renew) {
                $scope.RenewSavedSearchAjax(savedSearch);
            }
            else if (action == $scope.enumForSavedSearchActions.Delete) {
                $scope.DeleteSavedSearchAjax(savedSearch);
            }

        },

        openJobsInGroupDialog: function (JobsinGroup, AIPID) {
            $scope.JobsinGroup = JobsinGroup;
            $scope.JobsinGroup.AIPID = AIPID;
            //$('body').addClass('noScroll');
            ngDialog.open({
                preCloseCallback: function (value) {
                    $('body').removeClass('noScroll');
                },
                template: 'JobsInGroupDialog', scope: $scope, className: 'ngdialog-theme-default', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
            });
        },

        removeJobsInGroup: function (job, AIPID) {
            var Reqid = "";
            var TitletobeRemoved = "";
            _.each(job.Questions, function (Question) {
                if (Question.QuestionName.toLowerCase() == 'jobtitle')
                    TitletobeRemoved = Question.Value;
                if (Question.QuestionName.toLowerCase() == 'reqid') {
                    Reqid = Question.Value;
                }
            });
            var RemoveJobInGroup = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val(),
                Reqid: Reqid,
                AIPID: AIPID

            };
            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/RemoveJobsFromGroup",
                data: RemoveJobInGroup,
                success: function (data) {
                    if (data.Success) {
                        _.each($scope.CandZoneUnFinishedApps, function (currentObject) {
                            if (currentObject.AIPID === AIPID) {
                                var index = 0;
                                var spliceobject = false;

                                _.each(currentObject.JobsInGroup, function (Job) {
                                    _.each(Job.Questions, function (Question) {

                                        if (Question.QuestionName.toLowerCase() == 'reqid' && Question.Value === Reqid) {
                                            spliceobject = true;
                                            //JobInfo Manipulation
                                            if (currentObject.SavedDraftInfo.JobInfo.match(Question.Value)) {
                                                var fields = currentObject.SavedDraftInfo.JobInfo.replace(/^\__+/g, '').replace(/\__+$/g, '').split("__");
                                                var Count = 0;
                                                _.each(fields, function (JobInfo) {
                                                    if (JobInfo.indexOf(Question.Value) > -1) {
                                                        fields.splice(Count, 1);
                                                        return false;
                                                    }
                                                    ++Count
                                                });
                                                currentObject.SavedDraftInfo.JobInfo = "__" + fields.join("__") + "__";

                                            }
                                            //JobSiteID Manipulation
                                            if (currentObject.SavedDraftInfo.JobSiteId.match(Question.Value)) {
                                                var fields = currentObject.SavedDraftInfo.JobSiteId.split(",");
                                                var Count = 0;
                                                _.each(fields, function (JobsiteID) {
                                                    if (JobsiteID.indexOf(Question.Value) > -1) {
                                                        fields.splice(Count, 1);
                                                        return false;
                                                    }
                                                    ++Count
                                                });
                                                currentObject.SavedDraftInfo.JobSiteId = fields.join(",");
                                            }
                                            return false;
                                        }
                                    });
                                    if (spliceobject) {
                                        currentObject.JobsInGroup.splice(index, 1);
                                        currentObject.Title = currentObject.Title.replace(TitletobeRemoved, '').replace(/^,|,$|,(?=,)/g, '');
                                        return false;
                                    }
                                    ++index;
                                });
                                currentObject.SavedDraftInfo.ReqCount = currentObject.SavedDraftInfo.ReqCount - 1;
                                if (currentObject.JobsInGroup.length == 0) {
                                    _.remove($scope.CandZoneUnFinishedApps, currentObject);
                                    $scope.CandZoneUnFinishedAppsCount = $scope.CandZoneUnFinishedAppsCount - 1;
                                    $scope.CandZoneApplicationCount = $scope.CandZoneApplicationCount - 1;
                                    $scope.bAppsRemovalStatus = true;
                                    ngDialog.closeAll();
                                }
                                return false;
                            }
                        });
                    }
                    setTimeout(function () { $scope.$apply(); }, 0);
                }
            });
        },

        GetConfiguredJobTitle: function () {
            var configuredJobTitle = "jobtitle";
            if ($scope.jobFieldsToDisplay != null && typeof $scope.jobFieldsToDisplay.JobTitle != "undefined" && $scope.jobFieldsToDisplay.JobTitle != null && $scope.jobFieldsToDisplay.JobTitle != '') {
                configuredJobTitle = $scope.jobFieldsToDisplay.JobTitle.toLowerCase();
            }
            return configuredJobTitle;
        },


        uploadProfilePic: function (files) {
            var formData = new FormData();
            formData.append("ClientId", $("#partnerId").val());
            formData.append("SiteId", $("#siteId").val());
            formData.append("SessionID", $("#CookieValue").val());
            formData.append("file", files.target.files[0]);

            $http.post("/TgNewUI/Profile/Home/UploadProfilePic", formData, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function (data) {
                if (data.Success.toLowerCase() == "true") {
                    $scope.ProfileDetails.ProfilePicDataURL = data.ProfilePicDataURL;
                }
                else {
                    switch (data.Success) {
                        case "false":
                            $scope.ProfilePicError = $scope.dynamicStrings.ErrorMessage_ErrorUploadingFile;
                            break;
                        case "-4":
                            $scope.ProfilePicError = $scope.dynamicStrings.Attachment_FileSizeExceed;
                            break;
                        case "-3":
                            $scope.ProfilePicError = $scope.dynamicStrings.Profilepic_UnsupportedFileType;
                            break;
                        case "-6":
                            $scope.ProfilePicError = $scope.dynamicStrings.ErrorMessage_InvalidProfilePicName;
                            break;
                    }
                    ngDialog.open({
                        preCloseCallback: function (value) {
                            $('body').removeClass('noScroll');
                        },
                        template: 'ProfilePicErrorDIalog', scope: $scope, className: 'ngdialog-theme-default', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
                    });
                }
            });
        },

        deleteProfilePicAjax: function () {
            var DeleteProfilePic = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val()
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/Profile/Home/DeleteProfilePic",
                data: DeleteProfilePic,
                success: function (data) {
                    if (data.Success.toLowerCase() == "true") {
                        if (data.ProfilePicDataURL != null)
                            $scope.ProfileDetails.ProfilePicDataURL = data.ProfilePicDataURL;
                    }
                    else {
                        $scope.ProfilePicError = $scope.dynamicStrings.ErrorMessage_ErrorDeletingFile;
                        ngDialog.open({
                            preCloseCallback: function (value) {
                                $('body').removeClass('noScroll');
                            },
                            template: 'ProfilePicErrorDIalog', scope: $scope, className: 'ngdialog-theme-default', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
                        });
                    }
                }
            });
        },

        showApplicationDetail: function (AppliedApplication, showWithdrawReactivateMessage) {
            $scope.previewOfSubmittedApplication = false;
            if (!showWithdrawReactivateMessage) {
                $scope.WithdrawlFromApplicationDetail = false;
                $scope.ReactivateFromApplicationDetail = false;
            }
            $scope.candidatezoneSubView = "applicationDetail";
            $scope.appliedApplicationDetail = AppliedApplication;
            $scope.appliedApplicationDetail.HRStatusCategory = "";

            var HrStatusRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                AppliedSiteId: AppliedApplication.AppliedSiteid,
                SessionID: $("#CookieValue").val(),
                Reqid: AppliedApplication.ReqId,
                LangId: AppliedApplication.JobReqLang,
                LocaleId: AppliedApplication.LocaleId
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/HrStatusDetail",
                data: HrStatusRequest,
                success: function (data) {
                    $scope.appliedApplicationHrstatus = data.HRStatusCatDetails;
                    $scope.HRCatgryTab = 1;
                    _.each($scope.appliedApplicationHrstatus, function (currentObject, index) {
                        if (currentObject.HRStatus == 2) {
                            $scope.HRCatgryTab = (1 + index);
                            $scope.appliedApplicationDetail.HRStatusCategory = currentObject.HRStatusCatLabel;
                        }
                    });
                    if ($scope.appliedApplicationHrstatus[0].LastUpdated == "" || $scope.appliedApplicationHrstatus[0].LastUpdated == null) {
                        if ($scope.appliedApplicationHrstatus[0].HRStatus == 2)
                            $scope.appliedApplicationHrstatus[0].LastUpdated = $scope.appliedApplicationDetail.LastUpdated;
                        else
                            $scope.appliedApplicationHrstatus[0].LastUpdated = $scope.appliedApplicationDetail.JobSubmissionDate;
                    }
                    if (!$scope.utils.isNewHash('applicationDetail', $scope))
                        $scope.utils.updateHistory('applicationDetail');

                    $scope.ApplicationDetailActions = [];
                    $scope.ApplicationDetailActions.push($scope.dynamicStrings.Lbl_Viewjobdescription);
                    if ($scope.appliedApplicationDetail.FileAction == '0' && $scope.tgSettings.EnableJobSubmissionWithdrawal.toLowerCase() == 'yes') {
                        $scope.ApplicationDetailActions.push($scope.dynamicStrings.Lbl_WithdrawApplication);
                    } else if ($scope.appliedApplicationDetail.FileAction == '2') {
                        $scope.ApplicationDetailActions.push($scope.dynamicStrings.Lbl_ReactivateApplication);

                    } else if ($scope.appliedApplicationDetail.FileAction == '99') {
                        $scope.ApplicationDetailActions.push($scope.dynamicStrings.Lbl_ReactivateApplication);
                    }
                    $scope.setTitle("ApplicationDetail");
                    $scope.setHash();
                }
            });
        },
        ThrottleApplicationDetailAction: function () {
            switch ($("#ApplicationDetailAction").val()) {
                case $scope.dynamicStrings.Lbl_Viewjobdescription:
                    $scope.showJobDescriptionAjax($scope.appliedApplicationDetail);
                    break;
                case $scope.dynamicStrings.Lbl_WithdrawApplication:
                case $scope.dynamicStrings.Lbl_ReactivateApplication:
                    $scope.withDrawApplyFinishedApplication($scope.appliedApplicationDetail)
                    break;
                case $scope.dynamicStrings.Lbl_ReactivateApplication:
                    $scope.appliedApplicationDetail.ShowFileAction99 = true;
                    break;
            }
            $('#ApplicationDetailAction').val('');
            setTimeout(function () {
                $("#ApplicationDetailAction-button_text").text($scope.dynamicStrings.Link_More);
            }, 1000);

        },
        AppDetailReaderText: function (MyBoolean) {
            return MyBoolean ? $scope.dynamicStrings.Lbl_Completed + "-" : $scope.dynamicStrings.Lbl_NotCompleted + "-";
        },
        updateHRCategoryTab: function (value) {
            $scope.HRCatgryTab = value;
        },

        showJobDescriptionAjax: function (AppliedApplication) {
            var jobDescRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                SessionID: $("#CookieValue").val(),
                ReqId: AppliedApplication.ReqId,
                JobReqLang: AppliedApplication.JobReqLang
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/GetJobDescription",
                data: jobDescRequest,
                success: function (data) {
                    $scope.appliedApplicationDesc = data.jobDesc;
                    $('body').addClass('noScroll');
                    ngDialog.open({
                        preCloseCallback: function (value) {
                            $('body').removeClass('noScroll');
                            $.restoreFocus();
                        },
                        template: 'jobApplicationDescription', scope: $scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, appendTo: "#menuContainer", ariaRole: "dialog"
                    });
                }
            });
        },


        GetGQPreviewOfSubmittedApplication: function (scope, AppliedApplication) {
            //scope.oActiveLaddaButton.start();
            var tqid = AppliedApplication.TQID;
            if (tqid < 1) {
                tqid = _.pluck(_.where(AppliedApplication.Questions, { "QuestionName": "gqid" }), "Value").toString();
            }
            var PreviewPageRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                AppliedSiteId: AppliedApplication.AppliedSiteid,
                SID: $("#CookieValue").val(),
                ReqId: AppliedApplication.ReqId,
                LangId: AppliedApplication.JobReqLang,
                LocaleId: AppliedApplication.LocaleId,
                TQId: tqid,
                BRUID: $scope.encryptedBruid
            };

            $.ajax({
                type: "POST",
                url: "/gqweb/GetGQPreviewOfSubmittedApplication",
                data: PreviewPageRequest,
                success: function (data) {
                    $scope.previewOfSubmittedApplication = true;
                    $scope.applicationPreviewPage = data;
                    $scope.CallApply();
                    setTimeout(function () {
                        $("#applicationPreviewPageContent").html($scope.applicationPreviewPage);
                        $compile($("#applicationPreviewPageContent").contents())(scope);
                        $scope.CallApply();
                        if (!$scope.utils.isNewHash('applicationPreview', $scope))
                            $scope.utils.updateHistory('applicationPreview');
                        $scope.setHash();
                    }, 0);
                }
            });
        },

        ViewReferrals: function () {
            $scope.bCandidateZone = true;
            $scope.bCanZoneJobsLoadingState = true;
            $scope.candidatezoneSubView = 'ResponsiveReferrals';
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "Referrals";
            $scope.setTitle("Referrals");
            $scope.bInitialLoad = false;
            $scope.bJobDetailsShown = false;
            $scope.ReferralData == null;
            var SRStatusCheckRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionID: $("#CookieValue").val(),
                LocaleId: $scope.tgSettings.DefLocaleId,
                LangId: $scope.tgSettings.DefLanguageId
            };

            $.ajax({
                type: "POST",
                url: "/TgNewUI/CandidateZone/Ajax/Referrals",
                data: SRStatusCheckRequest,
                success: function (data) {
                    //data = { "Referrals": [{ "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationmlwkci\u0027\u0026[)2017-03-28-0842-41", "AutoReq": "2922BR", "ReferralSubmissionDate": "28-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationjpdyka\u0027;*\u00262017-03-23-0658-23", "AutoReq": "2810BR", "ReferralSubmissionDate": "23-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationgdmjnx\u0027{-,2017-03-23-1124-31", "AutoReq": "2803BR", "ReferralSubmissionDate": "23-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationjrmjnx\u0027{-,2017-03-23-1106-07", "AutoReq": "2801BR", "ReferralSubmissionDate": "23-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationzqxyka\u0027;*\u00262017-03-23-1048-09", "AutoReq": "2800BR", "ReferralSubmissionDate": "23-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationmgymrs\u0027.}$2017-03-23-0223-40", "AutoReq": "2799BR", "ReferralSubmissionDate": "23-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationuhqizn\u0027?`/2017-03-22-1014-17", "AutoReq": "2784BR", "ReferralSubmissionDate": "22-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationyigizn\u0027?`/2017-03-22-0956-09", "AutoReq": "2783BR", "ReferralSubmissionDate": "22-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationqsgizn\u0027?`/2017-03-22-0927-00", "AutoReq": "2782BR", "ReferralSubmissionDate": "22-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationswmizn\u0027?`/2017-03-22-0855-03", "AutoReq": "2781BR", "ReferralSubmissionDate": "22-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationoloizn\u0027?`/2017-03-22-0832-48", "AutoReq": "2780BR", "ReferralSubmissionDate": "22-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationwuujnx\u0027{-,2017-03-14-0856-11", "AutoReq": "2599BR", "ReferralSubmissionDate": "14-Mar-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationnrcaou\u0027(#}2017-02-25-1208-07", "AutoReq": "2316BR", "ReferralSubmissionDate": "25-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationiwaaou\u0027(#}2017-02-16-0555-09", "AutoReq": "2291BR", "ReferralSubmissionDate": "16-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationmuhyka\u0027;*\u00262017-02-16-0533-31", "AutoReq": "2284BR", "ReferralSubmissionDate": "16-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationpdnyka\u0027;*\u00262017-02-16-0321-49", "AutoReq": "2280BR", "ReferralSubmissionDate": "16-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationlllyka\u0027;*\u00262017-02-13-0201-50", "AutoReq": "2275BR", "ReferralSubmissionDate": "13-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationguozzk\u0027+^!2017-02-10-0747-16", "AutoReq": "2270BR", "ReferralSubmissionDate": "10-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationjbxmrs\u0027.}$2017-02-09-0419-53", "AutoReq": "2251BR", "ReferralSubmissionDate": "09-Feb-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationqbxmrs\u0027.}$2017-01-28-0818-26", "AutoReq": "2208BR", "ReferralSubmissionDate": "28-Jan-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationsvijnx\u0027{-,2017-01-12-1058-12", "AutoReq": "2110BR", "ReferralSubmissionDate": "12-Jan-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationfkfyka\u0027;*\u00262017-01-03-0548-59", "AutoReq": "2079BR", "ReferralSubmissionDate": "03-Jan-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationkvkzzk\u0027+^!2017-01-03-0501-23", "AutoReq": "2077BR", "ReferralSubmissionDate": "03-Jan-2017", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": null, "JobTitle": "AutoDelete-Aû-ómationzrdzzk\u0027+^!2016-12-31-0526-17", "AutoReq": "2059BR", "ReferralSubmissionDate": "31-Dec-2016", "ReferralMethod": "Email", "HRStatusDate": null, "HRStatus": null, "IsActiveReferralOrSentReferral": "SentReferral" }, { "CandidateName": "AutoDeleteypokjnxv, AutoDeletecebejnxv", "JobTitle": "AutoDelete-Aû-ómationypojnx\u0027{-,2017-02-25-1208-27", "AutoReq": "2317BR", "ReferralSubmissionDate": "25-Feb-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletegdbcmrsr, AutoDeletektoxmrsr", "JobTitle": "AutoDelete-Aû-ómationgdbmrs\u0027.}$2017-02-10-0747-51", "AutoReq": "2271BR", "ReferralSubmissionDate": "10-Feb-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletelrhojnxv, AutoDeletephujjnxv", "JobTitle": "AutoDelete-Aû-ómationlrhjnx\u0027{-,2017-01-31-0350-17", "AutoReq": "2236BR", "ReferralSubmissionDate": "31-Jan-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeleteqrzkxupb, AutoDeletegyvzxupb", "JobTitle": "AutoDelete-Aû-ómationqrzxup\u0027@:~2017-01-16-1006-31", "AutoReq": "2144BR", "ReferralSubmissionDate": "16-Jan-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletekpsekcig, AutoDeleteoegzkcig", "JobTitle": "AutoDelete-Aû-ómationkpskci\u0027\u0026[)2017-01-16-0217-24", "AutoReq": "2138BR", "ReferralSubmissionDate": "16-Jan-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletemfcijnxv, AutoDeletequqdjnxv", "JobTitle": "AutoDelete-Aû-ómationmfcjnx\u0027{-,2017-01-15-0125-05", "AutoReq": "2128BR", "ReferralSubmissionDate": "15-Jan-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletepaozykam, AutoDeletegikoykam", "JobTitle": "AutoDelete-Aû-ómationpaoyka\u0027;*\u00262017-01-12-1059-00", "AutoReq": "2111BR", "ReferralSubmissionDate": "12-Jan-2017", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletefvhlmrsr, AutoDeletewdcamrsr", "JobTitle": "AutoDelete-Aû-ómationfvhmrs\u0027.}$2016-12-31-0534-50", "AutoReq": "2061BR", "ReferralSubmissionDate": "31-Dec-2016", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletehvvajnxv, AutoDeletehvvajnxv", "JobTitle": "AutoDelete-Aû-ómationqnzjnx\u0027{-,2016-12-15-0755-39", "AutoReq": "2028BR", "ReferralSubmissionDate": "15-Dec-2016", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeleteookgaoui, AutoDeletefwfvaoui", "JobTitle": "AutoDelete-Aû-ómationkywaou\u0027(#}2016-12-03-0809-08", "AutoReq": "1981BR", "ReferralSubmissionDate": "03-Dec-2016", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletetimjxupb, AutoDeletejqhyxupb", "JobTitle": "AutoDelete-Aû-ómationoszxup\u0027@:~2016-11-16-0521-57", "AutoReq": "1895BR", "ReferralSubmissionDate": "16-Nov-2016", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletecduqkcig, AutoDeleteslqfkcig", "JobTitle": "AutoDelete-Aû-ómationynhkci\u0027\u0026[)2016-11-07-0457-22", "AutoReq": "1832BR", "ReferralSubmissionDate": "07-Nov-2016", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }, { "CandidateName": "AutoDeletewtrkxupb, AutoDeletembmaxupb", "JobTitle": "AutoDelete-Aû-ómationwtrxup\u0027@:~2016-10-04-0143-05", "AutoReq": "1569BR", "ReferralSubmissionDate": "04-Oct-2016", "ReferralMethod": "Facebook", "HRStatusDate": null, "HRStatus": "0-Filed", "IsActiveReferralOrSentReferral": "ActiveReferral" }], "ExpiredReferrals": ["AutoDelete-Aû-ómationjztjnx\u0027{-,2016-09-26-0209-59 (1495BR)", "AutoDelete-Aû-ómationiaonhc\u0027#,+2016-09-26-0514-25 (1513BR)", "AutoDelete-Aû-ómationasunhc\u0027#,+2016-10-03-0501-36 (1539BR)", "AutoDelete-Aû-ómationsqwnhc\u0027#,+2016-10-03-0559-08 (1542BR)", "AutoDelete-Aû-ómationvlfkci\u0027\u0026[)2016-10-03-1027-54 (1554BR)", "AutoDelete-Aû-ómationixyaou\u0027(#}2016-10-04-0702-18 (1564BR)", "AutoDelete-Aû-ómationpexaou\u0027(#}2016-10-04-0908-52 (1568BR)", "AutoDelete-Aû-ómationpyowff\u0027?~}2016-11-02-0709-08 (1796BR)", "AutoDelete-Aû-ómationrtryka\u0027;*\u00262016-11-02-0746-00 (1797BR)", "AutoDelete-Aû-ómationpdbjnx\u0027{-,2016-11-05-0639-30 (1800BR)", "AutoDelete-Aû-ómationhhkxup\u0027@:~2016-11-07-0457-22 (1831BR)", "AutoDelete-Aû-ómationhhkxup\u0027@:~2016-11-07-0457-22 (1831BR)", "AutoDelete-Aû-ómationtzjjnx\u0027{-,2016-11-08-0526-44 (1837BR)", "AutoDelete-Aû-ómationaspnhc\u0027#,+2016-11-23-0606-45 (1958BR)", "AutoDelete-Aû-ómationeqxwff\u0027?~}2016-12-03-0806-05 (1978BR)", "AutoDelete-Aû-ómationkajxup\u0027@:~2016-12-05-0617-17 (1996BR)", "AutoDelete-Aû-ómationizxxup\u0027@:~2016-12-14-1226-49 (2010BR)"] };
                    $scope.bCanZoneJobsLoadingState = false;
                    $scope.ReferralData = _.groupBy(data.Referrals, "IsActiveReferralOrSentReferral")
                    $scope.ExpiredReferrals = data.ExpiredReferrals;
                    $scope.ExpiredActiveReferrals = data.ExpiredActiveReferrals;
                    ($scope.ExpiredReferrals != null && $scope.ExpiredReferrals.length > 0) ? $scope.bShowExpiredReferralAlert = true : $scope.bShowExpiredReferralAlert = false;
                    ($scope.ExpiredActiveReferrals != null && $scope.ExpiredActiveReferrals.length > 0) ? $scope.bShowActiveExpiredReferralAlert = true : $scope.bShowActiveExpiredReferralAlert = false;
                    $scope.ExpRefquantity = 4;
                    $scope.setTitle("Referrals");
                    $scope.setHash();
                },
                error: function (error) {
                    $scope.bCanZoneJobsLoadingState = false;
                    $scope.setTitle("Referrals");
                    $scope.setHash();
                }
            });
        },
        ExpRefquantityrefresh: function (value) {
            $scope.ExpRefquantity = value.toString();
            setTimeout(function () {
                $scope.$apply();
            }, 0)

        },
        compileInnerHtml: function (el) {
            //method to update scope externally in forms.js
            $compile($(el).contents())($scope);
        },


        education: [],
        educationDetails: {
            IsSchoolModified: false,
            IsDegreeModified: false,
            SchoolName: "",
            EduMajor: "",
            EduDegree: "",
            GradYear: "",
            GPA: "",
            MostRecent: 0,
            Saved: false

        },
        experience: [],
        experienceDetails: {
            PositionTitle: "",
            EmployerName: "",
            Responsibilities: "",
            Skills: "",
            StartDate: "",
            EndDate: "",
            MostRecent: 0,
            Saved: false

        },

        communications: [],
        communicationDeleted: false,
        commHistStartIndex: 1,
        commHistShowMore: false,

        trustedHtml: function (val) {
            return (val.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/\n/g, '<br/>'));
        },

        EditProfileMenu: function (EditProfileView) {
            $scope.candidatezoneEditProfileView = EditProfileView;
            if (EditProfileView == 'profile') {
                $scope.editProfileView();
            } else if (EditProfileView == 'myFiles') {
                $scope.FileManagerAjax();
            }
        },

        resetProfileImportStatus: function () {
            $scope.profileImportStatus = 0;
        },

        reloadProfile: function (status) {
            $scope.profileImportStatus = (typeof status === 'undefined') ? 1 : status;
            $scope.editProfileView();
            $scope.CloseDialogs();
        },

        editProfileView: function () {

            if ($scope.applyPreloadJSON && $scope.applyPreloadJSON.WBMode) {
                return;
            }
            $scope.setTitle("Profile");
            var editProfileRequest = {};
            editProfileRequest.PartnerId = $("#partnerId").val();
            editProfileRequest.SiteId = $("#siteId").val();
            editProfileRequest.EncryptedSessionId = $("#CookieValue").val();
            url = '/TgNewUI/CandidateZone/Ajax/ViewEditProfile';
            $scope.bInitialLoad = false;

            $http.post(url, editProfileRequest).success(function (data, status, headers, config) {

                _.forEach(data.Responses, function (info) {
                    switch (info.Name) {
                        case "firstname":
                            $scope.ProfileFirstName = info.Code;
                            $scope.ProfileDetails.FirstName = info.Code;
                            break;
                        case "middlename":
                            $scope.ProfileMiddleName = info.Code;
                            break;
                        case "lastname":
                            $scope.ProfileLastName = info.Code;
                            $scope.ProfileDetails.LastName = info.Code;
                            break;
                        case "address1":
                            $scope.ProfileAddress1 = info.Code;
                            break;
                        case "address2":
                            $scope.ProfileAddress2 = info.Code;
                            break;
                        case "countryname":
                            $scope.ProfileCountryName = info.Code;
                            break;
                        case "country":
                            $scope.ProfileCountryCode = info.Code;
                            break;
                        case "city":
                            $scope.ProfileCity = info.Code;
                            break;
                        case "state":
                            $scope.ProfileState = info.Code;
                            break;
                        case "fullstate":
                            $scope.ProfileFullState = info.Code;
                            break;
                        case "zip":
                            $scope.ProfileZip = info.Code;
                            break;
                        case "homephone":
                            $scope.ProfileHomePhone = info.Code;
                            break;
                        case "workphone":
                            $scope.ProfileWorkPhone = info.Code;
                            break;
                        case "fax":
                            $scope.ProfileFax = info.Code;
                            break;
                        case "cellphone":
                            $scope.ProfileCellPhone = info.Code;
                            break;
                        case "homepage":
                            $scope.ProfileWebAddress = info.Code;
                            if (info.Code.indexOf('.') > 0) {
                                if (info.Code.toLowerCase().indexOf('http:') == 0)
                                    $scope.ProfileURL = info.Code;
                                else
                                    $scope.ProfileURL = 'http://' + info.Code;
                            } else {
                                $scope.ProfileURL = '';
                            }
                            break;
                        case "CandidateStackingField":
                            $scope.ProfileCandStackField = info.Code;
                            break;
                        case "email":
                            $scope.ProfileEmailAddress = info.Code;
                            break;
                        case "lnpronunciationkey":
                            $scope.ProfileLNPronunKey = info.Code;
                            break;
                        case "fnpronunciationkey":
                            $scope.ProfileFNPronunKey = info.Code;
                            break;

                    }
                    $scope.ProfileFields = data.ProfileFields;
                })


                var showFields = $.grep($scope.ProfileFields, function (e) { return e.hide == 0 && e.ReadOnly == 0 });
                $scope.bProfileContactEditable = false;
                $scope.bEnableInportProfile = false;
                if (showFields.length > 0) {
                    $scope.bProfileContactEditable = true;

                    var importableFields = $.grep(showFields, function (e) { return e.Id != 16 && e.Id != 17 });
                    if (importableFields.length > 0)
                        $scope.bEnableInportProfile = true;
                }
                $scope.fileStatus = 0;
                $scope.ProfileAdressString = "";
                ProfileAdressStringStart = "";
                if ($scope.ProfileAddress1)
                    ProfileAdressStringStart += $scope.ProfileAddress1 + "\n";
                if ($scope.ProfileAddress2)
                    ProfileAdressStringStart += $scope.ProfileAddress2 + "\n";
                if ($scope.ProfileCity)
                    $scope.ProfileAdressString += $scope.ProfileCity + ", ";
                if ($scope.ProfileState)
                    $scope.ProfileAdressString += $scope.ProfileState + " ";
                if ($scope.ProfileZip)
                    $scope.ProfileAdressString += $scope.ProfileZip;
                if ($scope.ProfileCountryName)
                    $scope.ProfileAdressString += "\n" + $scope.ProfileCountryName;

                if ($scope.ProfileAdressString.indexOf(",") == 0)
                    $scope.ProfileAdressString = $scope.ProfileAdressString.substring(2);
                if ($scope.ProfileAdressString.indexOf(", ") == $scope.ProfileAdressString.length)
                    $scope.ProfileAdressString = $scope.ProfileAdressString.substring(0, $scope.ProfileAdressString.length - 2);

                if (!$scope.ProfileFullState && $scope.ProfileState != '')
                    $scope.ProfileFullState = $scope.ProfileState;

                $scope.ProfileAdressString = ProfileAdressStringStart + $scope.ProfileAdressString
                $scope.hasProfileDetails = false;


                $scope.education = data.Education;
                $scope.experience = data.Experience;

                $scope.resumeReadOnly = false;
                if (data.ResumeCoverLetters.length > 0 && data.ResumeCoverLetters[0].ReadOnly)
                    $scope.resumeReadOnly = true;

                if ($scope.ProfileFirstName || $scope.ProfileLastName || $scope.ProfileAdressString || $scope.ProfileEmailAddress || $scope.ProfileHomePhone || $scope.education.length > 0 || $scope.experience.length > 0) {
                    $scope.hasProfileDetails = true;
                    $scope.enterProfileEditMode(false, false);
                }
                $scope.LoadedTGSettings = data.Settings;
                var settings = JSON.parse(data.Settings);
                $scope.CustomStackingLabel = settings['customstackinglabel'];
                var requiredFields = settings['requiredfields'];
                if (requiredFields == '')
                    requiredFields = "1,3,11";
                $scope.profileRequiredFields = requiredFields.split(',');
                $scope.CandStackingEditable = settings['tgreadonlystackinglogic'] == "0" ? false : true;
                $scope.HideProfileEdu = settings['hideeducation'].toLowerCase() == "yes" ? true : false;
                $scope.HideProfileExp = settings['hideexperience'].toLowerCase() == "yes" ? true : false;
                $scope.HideProfileGPA = settings['hidegpaeducationinputfield'].toLowerCase() == "yes" ? true : false;
                $scope.MetaData = "{\"partnerid\":\"" + config.data.PartnerId + " \",\"siteid\":\"" + config.data.SiteId + "\"}";
                $scope.stackingPattern = settings['stackingpattern'];
                $scope.stackingErrorMessage = settings['customstackingerrormessage'];
                $scope.stackingType = settings['stackingtype'];
                $scope.stackingUpYears = settings['stackingupyears'];
                $scope.stackingDownYears = settings['stackingdownyears'];
                if ($scope.stackingType == 'date') {
                    if ($scope.stackingUpYears == '')
                        $scope.stackingUpYears = '1';
                    if ($scope.stackingDownYears == '')
                        $scope.stackingUpYears = '75';
                }
                
                if (!$scope.HideProfileEdu && ($scope.education.length == 0 || !$scope.education[0].ReadOnly)) {
                    $scope.bEnableInportProfile = true;
                } else if (!$scope.HideProfileExp && ($scope.experience.length == 0 || !$scope.experience[0].ReadOnly)) {
                    $scope.bEnableInportProfile = true;
                }

                $scope.subViewInitialized = true;
                if (!$scope.utils.isNewHash('profile', $scope))
                    $scope.utils.updateHistory('profile');
                $scope.setHash();

                setTimeout(function () {
                    initFormsMethods();
                    if ($scope.googleLoggedIn == "googledrive") {
                        $scope.googleLoggedIn = "";
                        ngDialog.open({
                            preCloseCallback: function (value) {
                                $.restoreFocus();
                            },
                            template: 'GoogleLogOutTemplate', scope: $scope, className: 'ngdialog-theme-default', showClose: false, closeByDocument: false, ariaRole: "dialog"
                        });
                    }

                }, 0)
            });

        },

        promptGoogleLogout: function (googleLoggedIn) {

            $scope.googleLoggedIn = googleLoggedIn;
        },

        setEduExpValidator: function (formSelector) {
            $(formSelector).validate({
                errorClass: 'error',
                validClass: 'success',
                errorElement: 'span',
                onfocusout: false,
                highlight: function (element, errorClass, validClass) {
                    $(element).closest(".fieldcontain").addClass("invalid");
                    $(element).attr("aria-invalid", "true");
                },
                unhighlight: function (element, errorClass, validClass) {
                    var $parentElem = $(element).removeAttr("aria-describedby").closest(".fieldcontain");
                    $parentElem.removeClass("invalid");
                    $(element).removeAttr("aria-invalid");
                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element.closest(".fieldcontain").children().last());
                }
            });
        },

        hasRequiredFields: function () {
            return !!$('.requiredFieldIndicator').not(".requiredFieldsDescription span").length;
        },

        isProfileFieldHidden: function (fieldId) {
            var field = $.grep($scope.ProfileFields, function (e) { return e.Id == fieldId; });
            if (field.length > 0 && field[0].hide == "1")
                return true;
            else
                return false;
        },

        isProfileFieldReadOnly: function (fieldId) {
            var field = $.grep($scope.ProfileFields, function (e) { return e.Id == fieldId; });
            if (field.length > 0 && field[0].ReadOnly == "1")
                return true;
            else
                return false;
        },

        getProfileFieldLabel: function (fieldId) {
            var field = $.grep($scope.ProfileFields, function (e) { return e.Id == fieldId; });
            if (field.length > 0)
                return field[0].Label;
            else
                return "";
        },

        enterProfileEditMode: function (mode, fromEmptyProfile) {
            ngDialog.closeAll();
            $scope.editProfileErrormsgs = [];
            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
            if (mode) {
                $scope.returnToEmptyProfile = fromEmptyProfile;
                $scope.hasProfileDetails = true;
                if (fromEmptyProfile) {
                    $scope.ProfileCountryInputCode = $scope.tgSettings.DefCountryId;
                    $scope.ProfileCountryInputName = $scope.tgSettings.DefCountryName;
                } else {
                    $scope.ProfileCountryInputCode = $scope.ProfileCountryCode;
                    $scope.ProfileCountryInputName = $scope.ProfileCountryName;
                }
            }
            else {
                if (!($scope.ProfileFirstName || $scope.ProfileLastName))
                    $scope.hasProfileDetails = !$scope.returnToEmptyProfile;
            }

            $scope.bEditProfileEditMode = mode;
            setTimeout(function () {
                initFormsMethods();
            }, 0)
            $scope.scrolltop();
            $scope.CallApply();
            if (mode) {
                _.delay(function () {
                    $('#profile_9_0_country_slt_0_0-input').autocomplete({
                        change: function (event, ui) {
                            if (this.value == '') {
                                var $stateSelector = $(document.querySelector('.profile select[id*="_state_"]'));
                                var $stateClearbtn = $("#" + $stateSelector.attr("name") + "-input").parent().find("a");
                                $("#" + $stateSelector.attr("name") + "-input").val("");
                                $stateSelector.find("option:selected").each(function () { $(this).removeAttr("selected"); $(this).prop("selected", false); });
                                $stateClearbtn.removeClass("icon-remove");
                            }
                        }
                    });
                    $('#editProfileForm').validate({
                        rules: {
                            firstname: { nameformat: true, required: $scope.profileRequiredFields.indexOf('1') > -1 },
                            middlename: { nameformat: true, required: $scope.profileRequiredFields.indexOf('2') > -1 },
                            lastname: { nameformat: true, required: $scope.profileRequiredFields.indexOf('3') > -1 },
                            email: { emailformat: true, required: $scope.profileRequiredFields.indexOf('4') > -1 },
                            address1: { nohtml: true, required: $scope.profileRequiredFields.indexOf('5') > -1 },
                            address2: { nohtml: true, required: $scope.profileRequiredFields.indexOf('6') > -1 },
                            city: { required: $scope.profileRequiredFields.indexOf('7') > -1 },
                            zip: { zipformat: true, required: $scope.profileRequiredFields.indexOf('8') > -1 },
                            country: { required: $scope.profileRequiredFields.indexOf('9') > -1 },
                            state: { required: $scope.profileRequiredFields.indexOf('10') > -1 },
                            homephone: { phoneformat: true, required: $scope.profileRequiredFields.indexOf('11') > -1 },
                            workphone: { phoneformat: true, required: $scope.profileRequiredFields.indexOf('12') > -1 },
                            cellphone: { phoneformat: true, required: $scope.profileRequiredFields.indexOf('13') > -1 },
                            fax: { phoneformat: true, required: $scope.profileRequiredFields.indexOf('14') > -1 },
                            webaddress: { urlformat: true, required: $scope.profileRequiredFields.indexOf('15') > -1 },
                            lnpronouncekey: { nohtml: true, required: $scope.profileRequiredFields.indexOf('16') > -1 },
                            fnpronouncekey: { nohtml: true, required: $scope.profileRequiredFields.indexOf('17') > -1 },
                            stacking: { required: $scope.profileRequiredFields.indexOf('18') > -1, customvalidation: true }
                        },
                        messages: { stacking: { customvalidation: $scope.stackingErrorMessage } },
                        errorClass: 'contactError',
                        validClass: 'success',
                        errorElement: 'span',
                        onfocusout: false,
                        highlight: function (element, errorClass, validClass) {
                            $(element).closest(".fieldcontain").addClass("invalid");
                            $(element).attr("aria-invalid", "true");
                        },
                        unhighlight: function (element, errorClass, validClass) {
                            var $parentElem = $(element).removeAttr("aria-describedby").closest(".fieldcontain");
                            $parentElem.removeClass("invalid");
                            $(element).removeAttr("aria-invalid");
                        },
                        errorPlacement: function (error, element) {
                            error.insertAfter(element.closest(".fieldcontain").children().last());
                        },
                        invalidHandler: function (form, validator) {
                            var validerrors = validator.numberOfInvalids();

                            if (validerrors) {

                                $scope.editProfileErrormsgs = [];
                                if (validator.errorList.length > 0) {
                                    var fobj, fcontainer, $errorLabel, $errorSpan, $control;
                                    for (x = 0; x < validator.errorList.length; x++) {
                                        $control = $(validator.errorList[x].element);
                                        fcontainer = $control.closest(".fieldcontain");
                                        if (fcontainer.length > 0) {
                                            fobj = $control.prev().is("label") ? $control.prev() : fcontainer.find("label").first();
                                            $scope.editProfileErrormsgs.push({ label: $.trim(fobj.text().replace("*", "").replace("Click for tool tip.", "")), error: validator.errorList[x].message, field: $control.attr("name") });
                                        }
                                    }
                                }

                            }
                        }
                    });
                });
            }
        },

        uploadServices: function (calledFrom, AttachmentCat) {
            if (this.wbpreview == "true" || this.wbpagepreview == "true") {
                return;
            }
            ngDialog.open({

                preCloseCallback: function (value) {
                    var $iframe = $("#profileBuilder"),
                         frameWindow = $iframe.prop("contentWindow");

                    if (frameWindow != undefined) {
                        frameWindow.blur();
                        document.body.focus();
                        $iframe.remove();
                    }
                },
                template: "<iframe scrolling='no' allowtransparency='true' id='profileBuilder' title='Profile Builder' style='border:0px' src='/TGNewUI/Profile/Home/ProfileBuilder?encryptedSessionId=" + $("#CookieValue").val() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&calledFrom=" + calledFrom + "&AttachmentCat=" + encodeURI(AttachmentCat) + "&NoOfAttachments=" + $scope.NoOfAttachments + "' tabindex='0'> </iframe>",
                //template: "<iframe scrolling='no' allowtransparency='true' id='profileBuilder' title='Profile Builder' style='border:0px' src='/TGNewUI/Profile/Home/ProfileBuilder?encryptedSessionId=" + $("#CookieValue").val() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&calledFrom=addfile&FileType=" + fileType + "&AttachmentCat=" + encodeURI(AttachmentCat) + "' tabindex='0'> </iframe>",
                //template: "<iframe 'scrolling=no' allowtransparency='true' id='profileBuilder' height='100%' width='100%' src='../../Profile/Home/ProfileBuilder?partnerId=11713&siteId=6786&encryptedSessionId=^BtwhqVBm/UVWG7f3Yjw2svJgCnSNA7NnRySV08WQSKEMqjVi4dGlZOfwUvw3D1DAm0qvkLv1x0jm0EGxpdnWSUPzOpPqOkVUC6XEjJ3En18='></iframe>",
                plain: true,
                className: 'ngdialog-theme-default dialogWithIFrame',
                showClose: false,
                closeByDocument: false
            });
        },

        noThanks: function (googleLoggedIn) {
            $('#AttachementCatagory').val('');
            $("#AttachementCatagory-button").children("span.ui-selectmenu-text").text(appScope.dynamicStrings.PlaceHolder_Choose);
            //By default focus will be reset to current Active Element on parent window. 
            //if the TG hosted on iframe, the focus will be just on parent window.
            if (window.location == window.parent.location) {
                window.parent.$.restoreFocus();
            }
            ngDialog.closeAll();
            if (googleLoggedIn == "googledrive") {
                ngDialog.open({
                    preCloseCallback: function (value) {
                        $.restoreFocus();
                    },
                    template: 'GoogleLogOutTemplate', scope: $scope, className: 'ngdialog-theme-default', showClose: false, closeByDocument: false, ariaRole: "dialog"
                });
            }
        },

        GoogleLogOut: function () {
            $scope.googleLoggedIn = "";
            win = window.open("https://www.google.com/accounts/Logout", "something", "width=550,height=570");
            setTimeout("win.close();", 3000);
            parent.$.restoreFocus();
            ngDialog.closeAll();
            if ($scope.SubmitAfterGoogleLogout) {
                $scope.SubmitAfterGoogleLogout = !$scope.SubmitAfterGoogleLogout;
                page.showSuccessMessage = true;
            }
        },

        noThanksGoogleOut: function () {
            parent.$.restoreFocus();
            ngDialog.closeAll();
            if ($scope.SubmitAfterGoogleLogout) {
                $scope.SubmitAfterGoogleLogout = !$scope.SubmitAfterGoogleLogout;
                page.showSuccessMessage = true;
            }

        },

        addRemoveEducation: function (mode, $index, $event, confirmed) {
            if (mode == "add") {
                if (!this.education)
                    this.education = [];

                this.education.unshift(_.assign({ updateMode: true }, this.educationDetails));
                $timeout(function () {
                    $("html,body").animate({ scrollTop: $(".edu0").offset().top - 50 }, 500);
                });

                _.delay(function () {
                    $scope.setEduExpValidator('#editEduForm');
                });
            }
            else {
                if (!confirmed) {

                    this.openProfileWarningDialog($index, 'edu', $event, this);
                }
                else {
                    this.education.splice($index, 1);
                    this.submitEducationExperience();
                    if ($("#addEdu") != undefined && $("#addEdu").length > 0) {
                        setTimeout(function () { $("#addEdu").focus(); })
                    }
                    else {
                        setTimeout(function () { $($event.target).focus(); })
                    }
                }
            }
            $scope.education = this.education;
        },
        addRemoveExperience: function (mode, $index, $event, confirmed) {

            if (mode == "add") {
                if (!this.experience)
                    this.experience = [];

                this.experience.unshift(_.assign({ updateMode: true }, this.experienceDetails));
                $timeout(function () {
                    $("html,body").animate({ scrollTop: $(".exp0").offset().top - 50 }, 500);
                });

                _.delay(function () {
                    $scope.setEduExpValidator('#editExpForm');
                });
            }
            else {
                if (!confirmed) {

                    this.openProfileWarningDialog($index, 'exp', $event, this);
                }
                else {
                    this.experience.splice($index, 1);
                    this.submitEducationExperience();
                    if ($("#addExp") != undefined && $("#addExp").length > 0) {
                        setTimeout(function () { $("#addExp").focus(); })
                    }
                    else {
                        setTimeout(function () { $($event.target).focus(); })
                    }

                }
                $scope.experience = this.experience;
            }
        },

        openProfileWarningDialog: function ($index, mode, $event, scope) {
            ngDialog.open({
                template: mode + "RemoveTemplate",
                className: "ngdialog-theme-default profileWarningDialog",
                scope: scope,
                controller: ['$scope', function ($scope) {
                    $scope.mode = mode;
                    $scope.currentProfileIndex = $index;
                    $scope.scope = scope;
                    $scope.removeProfileData = function () {
                        if ($scope.mode == "edu") {
                            $scope.scope.addRemoveEducation('remove', $scope.currentProfileIndex, $event, true)
                        }
                        else {
                            $scope.scope.addRemoveExperience('remove', $scope.currentProfileIndex, $event, true)

                        }
                        $scope.cancelDialog($scope.mode);
                    }
                    $scope.cancelDialog = function (mode) {
                        ngDialog.closeAll();
                        if (mode == "edu" && $("#addEdu") != undefined && $("#addEdu").length > 0) {
                            $("#addEdu").focus();
                        }
                        else if (mode == "exp" && $("#addExp") != undefined && $("#addExp").length > 0) {
                            $("#addEdu").focus();
                        }
                        else {
                            $($event.target).focus();
                        }
                    }

                }]

            });

        },

        saveEducation: function ($index) {
            var validEdu = true;
            var invalidElement;

            $(".edu" + $index + " input").each(function (i, e) {
                if (!$(e).valid()) {
                    validEdu = false;
                    if (!invalidElement) {
                        invalidElement = $(e);
                    }
                }

            });
            if (validEdu) {
                this.education[$index].updateMode = false;
                this.education[$index].Saved = true;
                $.htmlEncodeSpecial(this.education[$index]);
                for (var k in this.education[$index]) {
                    if (typeof this.educationDetails[k] != "undefined") {
                        this.education[$index][k + "_default"] = this.education[$index][k];
                    }
                }

                this.education[$index].IsSchoolModified = false;
                this.education[$index].IsDegreeModified = false;
                this.submitEducationExperience();
                $timeout(function () { $("html,body").animate({ scrollTop: $(".edu0").offset().top - 50 }, 500); });
                if ($("#addEdu") != undefined && $("#addEdu").length > 0) {
                    setTimeout(function () {
                        $("#addEdu").focus();
                    })
                }
                else {
                    setTimeout(function () { $("#updateEdu" + $index).focus(); })
                }
            }
            else {
                $("html,body").animate({ scrollTop: invalidElement.offset().top - 100 }, 500);
                invalidElement.valid();
                invalidElement.focus();
            }
        },
        updateEducation: function ($index, $event) {
            this.education[$index].updateMode = true;
            $.htmlDecodeSpecial(this.education[$index]);
            if (this.education[$index].Saved == null) {
                for (var k in this.education[$index]) {
                    if (typeof this.educationDetails[k] != "undefined") {
                        this.education[$index][k + "_default"] = this.education[$index][k];
                    }

                }
            }
            $($event.target).closest(".widgetinner").setFocus();
            _.delay(function () {
                $scope.setEduExpValidator('#editEduForm');
            });
        },
        updateSchoolModified: function ($index) {
            this.education[$index].IsSchoolModified = true;
            $("#education_" + $index + "_0_schoolname_slt_0-hidden").val("");
        },
        updateDegreeModified: function ($index) {
            this.education[$index].IsDegreeModified = true;
            $("#education_" + $index + "_0_degree_slt_0-hidden").val("");
        },
        cancelEducation: function ($index) {
            if (!this.education[$index].Saved && this.education[$index].Saved != null) {
                this.education.splice($index, 1);
            }
            else {
                this.education[$index].updateMode = false;
                for (var k in this.education[$index]) {
                    if (typeof this.educationDetails[k] != "undefined") {
                        this.education[$index][k] = this.education[$index][k + "_default"];
                    }

                }
            }
            if ($("#addEdu") != undefined && $("#addEdu").length > 0) {
                setTimeout(function () { $("#addEdu").focus(); })
            }
            else {
                setTimeout(function () { $("#updateEdu" + $index).focus(); })
            }
        },
        saveExperience: function ($index) {
            var validExp = true;
            var invalidElement;

            $(".exp" + $index + " input,.exp" + $index + " textarea").each(function (i, e) {
                if (!$(e).valid()) {
                    validExp = false;
                    if (!invalidElement) {
                        invalidElement = $(e);
                    }
                }
            });
            if (validExp) {
                this.experience[$index].updateMode = false;
                this.experience[$index].Saved = true;
                $.htmlEncodeSpecial(this.experience[$index]);
                for (var k in this.experience[$index]) {
                    if (typeof this.experienceDetails[k] != "undefined") {
                        this.experience[$index][k + "_default"] = this.experience[$index][k];
                    }

                }
                this.submitEducationExperience();
                $timeout(function () { $("html,body").animate({ scrollTop: $(".exp0").offset().top - 50 }, 500); });
                if ($("#addExp") != undefined && $("#addExp").length > 0) {
                    setTimeout(function () { $("#addExp").focus(); })
                }
                else {
                    setTimeout(function () { $("#updateExp" + $index).focus(); })
                }
            }
            else {
                $("html,body").animate({ scrollTop: invalidElement.offset().top - 100 }, 500);
                invalidElement.valid();
                invalidElement.focus();

            }
        },
        updateExperience: function ($index, $event) {
            this.experience[$index].updateMode = true;
            $.htmlDecodeSpecial(this.experience[$index]);
            if (this.experience[$index].Saved == null) {
                for (var k in this.experience[$index]) {
                    if (typeof this.experienceDetails[k] != "undefined") {
                        this.experience[$index][k + "_default"] = this.experience[$index][k];
                    }

                }
            }
            _.delay(function () {
                $scope.setEduExpValidator('#editExpForm');
            });
            $($event.target).closest(".widgetinner").setFocus();
        },
        cancelExperience: function ($index) {
            if (!this.experience[$index].Saved && this.experience[$index].Saved != null) {
                this.experience.splice($index, 1);
            }
            else {
                this.experience[$index].updateMode = false;
                for (var k in this.experience[$index]) {
                    if (typeof this.experienceDetails[k] != "undefined") {
                        this.experience[$index][k] = this.experience[$index][k + "_default"];
                    }

                }

            }
            if ($("#addExp") != undefined && $("#addExp").length > 0) {
                setTimeout(function () { $("#addExp").focus(); })
            }
            else {
                setTimeout(function () { $("#updateExp" + $index).focus(); })
            }
        },
        isUpdateEdu: function ($index) {
            return this.education[$index].updateMode;
        },
        isUpdateExp: function ($index) {
            return this.experience[$index].updateMode;
        },

        showMostRecent: function (mode, $index) {
            var recordIndex = -1;

            if (mode == "edu") {
                recordIndex = _.findIndex(this.education, function (n) {
                    return n.MostRecent == 1 || n.MostRecent;
                });

            }
            else {
                recordIndex = _.findIndex(this.experience, function (n) {
                    return n.MostRecent == 1 || n.MostRecent;
                });

            }
            return recordIndex == -1 || recordIndex == $index;
        },

        blanketSearch: function (e) {
            var $target = $(e.target),
                $input = ($target.is("input") ? $target : $target.siblings("input")),
                oAuto;

            if (!$input.is(":focus"))
                $input.focus();

            _.delay(function () {
                //wait for autcomplete widget creation
                oAuto = $input.data().uiAutocomplete;

                if (oAuto == undefined)
                    oAuto = $target.prevAll("input:visible").data().uiAutocomplete;

                if ($target.is(".icon-remove")) {
                    $input.val("");
                    return;
                }


                if (oAuto) {
                    var nMilisecondsSincedClosed = new Date() - oAuto.lastClosedTime,
                        bMenuWasOpen = nMilisecondsSincedClosed < 200;

                    if (bMenuWasOpen) {
                        //menu was open but has closed based on second click of the show menu button or similar keyboard action
                        //nothing more to do
                        return;
                    } else {
                        //otherwise blanket search
                        oAuto.pageIndex = 0;
                        oAuto.requestIndex = 0;
                        oAuto.search("-1");
                    }
                }

            });
        },

        submitEditProfileForm: function (editProfileForm, scope) {
            if (!$('#editProfileForm').valid())
                return false;

            var editProfileRequest = {};
            if (editProfileForm.firstname)
                editProfileRequest.FirstName = editProfileForm.firstname.$modelValue;
            if (editProfileForm.middlename)
                editProfileRequest.MiddleName = editProfileForm.middlename.$modelValue;
            if (editProfileForm.lastname)
                editProfileRequest.LastName = editProfileForm.lastname.$modelValue;
            if (editProfileForm.address1)
                editProfileRequest.Address1 = editProfileForm.address1.$modelValue;
            if (editProfileForm.address2)
                editProfileRequest.Address2 = editProfileForm.address2.$modelValue;
            if (editProfileForm.city)
                editProfileRequest.City = editProfileForm.city.$modelValue;

            if ($('#profile_9_0_country_slt_0_0-input')) {
                editProfileRequest.Country = $('#profile_9_0_country_slt_0_0-input').val();
                if (editProfileRequest.Country != '') {
                    editProfileRequest.CountryCode = $('#profile_9_0_country_slt_0_0').val();
                } else {
                    editProfileRequest.CountryCode = '';
                }
            }
            if ($('#profile_10_0_state_slt_0_0-input')) {
                editProfileRequest.State = $('#profile_10_0_state_slt_0_0-input').val();
                if (editProfileRequest.State != '') {
                    editProfileRequest.StateCode = $('#profile_10_0_state_slt_0_0').val();
                } else {
                    editProfileRequest.StateCode = '';
                }
            }
            if (editProfileForm.zip)
                editProfileRequest.Zip = editProfileForm.zip.$modelValue;
            if (editProfileForm.homephone)
                editProfileRequest.HomePhone = editProfileForm.homephone.$modelValue;
            if (editProfileForm.workphone)
                editProfileRequest.WorkPhone = editProfileForm.workphone.$modelValue;
            if (editProfileForm.fax)
                editProfileRequest.Fax = editProfileForm.fax.$modelValue;
            if (editProfileForm.cellphone)
                editProfileRequest.CellPhone = editProfileForm.cellphone.$modelValue;
            if (editProfileForm.email)
                editProfileRequest.email = editProfileForm.email.$modelValue;
            if (editProfileForm.webaddress)
                editProfileRequest.WebAddress = editProfileForm.webaddress.$modelValue;
            if (editProfileForm.lnpronouncekey)
                editProfileRequest.LNPronunKey = editProfileForm.lnpronouncekey.$modelValue;
            if (editProfileForm.fnpronouncekey)
                editProfileRequest.FNPronunKey = editProfileForm.fnpronouncekey.$modelValue;
            if (editProfileForm.stacking)
                editProfileRequest.CandidateStacking = editProfileForm.stacking.$modelValue;
            else if ($scope.stackingType == 'date')
                editProfileRequest.CandidateStacking = $scope.ProfileCandStackField;

            editProfileRequest.Education = $scope.education;
            editProfileRequest.Experience = $scope.experience;

            editProfileRequest.PartnerId = $("#partnerId").val();
            editProfileRequest.SiteId = $("#siteId").val();
            editProfileRequest.EncryptedSessionId = $("#CookieValue").val();
            $scope.scope = this;
            url = '/TgNewUI/CandidateZone/Ajax/SaveEditProfileChanges';
            $http.post(url, editProfileRequest).success(function (result) {
                $scope.ProfileDetails.FirstName = editProfileForm.firstname.$modelValue;
                $scope.ProfileDetails.LastName = editProfileForm.lastname.$modelValue;
                $scope.ProfileCountryCode = editProfileRequest.CountryCode;
                $scope.ProfileCountryName = editProfileRequest.CountryName;

                $scope.editProfileView();
            });
        },

        submitEducationExperience: function () {

            var editProfileRequest = {};
            editProfileRequest.FirstName = $scope.ProfileFirstName;
            editProfileRequest.MiddleName = $scope.ProfileMiddleName;
            editProfileRequest.LastName = $scope.ProfileLastName;
            editProfileRequest.Address1 = $scope.ProfileAddress1;
            editProfileRequest.Address2 = $scope.ProfileAddress2;
            editProfileRequest.Zip = $scope.ProfileZip;
            editProfileRequest.HomePhone = $scope.ProfileHomePhone;
            editProfileRequest.WorkPhone = $scope.ProfileWorkPhone;
            editProfileRequest.Fax = $scope.ProfileFax;
            editProfileRequest.CellPhone = $scope.ProfileCellPhone;
            editProfileRequest.WebAddress = $scope.ProfileWebAddress;

            editProfileRequest.Education = $scope.education;
            editProfileRequest.Experience = $scope.experience;

            editProfileRequest.PartnerId = $("#partnerId").val();
            editProfileRequest.SiteId = $("#siteId").val();
            editProfileRequest.EncryptedSessionId = $("#CookieValue").val();
            $scope.scope = this;
            url = '/TgNewUI/CandidateZone/Ajax/SaveEditProfileChanges';
            $http.post(url, editProfileRequest);

        },

        moveToNextPage: function (redirectUrl, event, calledFrom) {
            if (calledFrom == 'JobCart') {
                $scope.ViewJobCartAjax();
            }
            else {
                if (redirectUrl.indexOf("SocialNetworkReferral") > -1) {
                    SocialNetworkReferral(this, event);
                } else if (redirectUrl.indexOf("TGSocialNetworking.aspx") > -1) {
                    window.open(redirectUrl, '_blank', 'height=550,width=750,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,alwaysRaised');
                } else {
                    window.location = redirectUrl;
                }
            }


        },
        Collapse: function (myclass) {
            $("div." + myclass).slideToggle("slow", function () {
                if ($(this).is(':visible')) {
                    $(this).css('display', 'inline-block');
                    $scope.alignCards(myclass, "jobCard");
                }

                myclass == 'CollapsedUnfinishedApplications' ? ($("#UnfinishedAppArrow").hasClass('fa-chevron-down') ? $("#UnfinishedAppArrow").removeClass('fa-chevron-down').addClass('fa-chevron-up') : $("#UnfinishedAppArrow").removeClass('fa-chevron-up').addClass('fa-chevron-down')) : ($("#FinishedAppArrow").hasClass('fa-chevron-down') ? $("#FinishedAppArrow").removeClass('fa-chevron-down').addClass('fa-chevron-up') : $("#FinishedAppArrow").removeClass('fa-chevron-up').addClass('fa-chevron-down'));
            });
            if (myclass == 'CollapsedUnfinishedApplications') {
                $("div.CollapsedUnfinishedAppEmpty").slideToggle("slow", function () { });
            }
            else {
                $("div.CollapsedAppliedAppEmpty").slideToggle("slow", function () { });
            }
            $("." + myclass + " .jobCard").css("height", "auto").find('.cardFooter').removeClass('cardFooterPosition');

        },
        CollapseReferrals: function (myclass) {
            if ($("div." + myclass).length == 0)
                myclass = "Empty" + myclass;
            $("div." + myclass).slideToggle("slow", function () {
                if ($(this).is(':visible')) {
                    $(this).css('display', 'inline-block');
                    $scope.alignCards(myclass, "jobCard");
                }

                (myclass == 'ActiveReferrals' || myclass == 'EmptyActiveReferrals') ? ($("#ActiveReferralArrow").hasClass('fa-chevron-down') ? $("#ActiveReferralArrow").removeClass('fa-chevron-down').addClass('fa-chevron-up') : $("#ActiveReferralArrow").removeClass('fa-chevron-up').addClass('fa-chevron-down')) : ($("#SentReferralArrow").hasClass('fa-chevron-down') ? $("#SentReferralArrow").removeClass('fa-chevron-down').addClass('fa-chevron-up') : $("#SentReferralArrow").removeClass('fa-chevron-up').addClass('fa-chevron-down'));
            });
            $("." + myclass + " .jobCard").css("height", "auto").find('.cardFooter').removeClass('cardFooterPosition');

        },

        viewHRStatus: function () {
            if ($scope.bresponsiveCandidateZone) {
                $scope.bCandidateZone = true;
                appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                $scope.bJobDetailsShown ? $scope.DashboardPrevPage = ["JobDetails"] : $scope.DashboardPrevPage = ["SearchResults"];
                $scope.ViewDashBoardData("Applications", $scope.enumForDashBoardActiveSection.FinishedApplications);
            }
            else
                document.location.href = "/tgwebhost/statuscheck.aspx?sid=" + $("#SIDValue").val();
        },

        logOutCandidate: function () {

            if ($scope.applyPreloadJSON && $scope.applyPreloadJSON.WBMode) {
                return;
            }
            var logOutCandidateRequest = {};
            logOutCandidateRequest.PartnerId = $("#partnerId").val();
            logOutCandidateRequest.SiteId = $("#siteId").val();
            logOutCandidateRequest.EncryptedSessionId = $("#CookieValue").val();
            var redirectURL = "/TGnewUI/Search/Home/Home?partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val();
            url = '/TgNewUI/Search/Ajax/LogOutCandidate';
            $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/LogoutCandidate");
            $http.post(url, logOutCandidateRequest).success(function (data, status, headers, config) {
                $scope.bLoggedIn = false;
                sessionStorage.setItem('showAssessmentsCompletionMessage', true);
                if ($scope.bJobCart) {
                    $scope.bJobCart = false;
                    $scope.jobs = $scope.jobsCache;
                }
                $("#CookieValue").val(data.NewEncryptedSessionId);
                $("#smlid").val(data.IdForSocialLogin);
                $scope.LoginChangeSecQuestion = false;
                $scope.LoginChangePassword = false;
                $scope.encryptedBruid = "";
                if ($scope.response)
                    $scope.response.encryptedBruid = "";

                $scope.oHistory = _.pick($scope.oHistory, ['home']);
                $scope.$root.oHistory = _.pick($scope.$root.oHistory, ['home']);
                previousHashes = [];
                previousHashes[previousHashes.length] = "home";

                $scope.ProfileDetails = {};
                if ($scope.updateAccount.updated == 'delete')
                    $scope.updateAccount = { updated: 'delete' };
                else
                    $scope.updateAccount = {};
                $scope.UserName = '';
                $scope.password = '';
                $scope.InActivityWarning = null;
                $scope.ProfileFirstName = "";
                $scope.ProfileMiddleName = "";
                $scope.ProfileLastName = "";
                $scope.ProfileAddress1 = ""
                $scope.ProfileAddress2 = ""
                $scope.ProfileCountryName = "";
                $scope.ProfileCity = "";
                $scope.ProfileState = "";
                $scope.ProfileFullState = "";
                $scope.ProfileCountryCode = "";
                $scope.ProfileZip = "";
                $scope.ProfileHomePhone = "";
                $scope.ProfileWorkPhone = "";
                $scope.ProfileFax = "";
                $scope.ProfileCellPhone = "";
                $scope.ProfileWebAddress = "";
                $scope.ProfileURL = "";
                $scope.ProfileCandStackField = "";
                $scope.ProfileEmailAddress = "";
                $scope.hasProfileDetails = false;

                $scope.bFileManager = false;
                $scope.savedResumes = {};
                $scope.savedCoverLetters = {};
                $scope.savedAttachments = {};
                $scope.savedCategories = {};
                $scope.attachmentCategories = {};
                $scope.candidatezoneEditProfileView = "";
                $scope.candidatezoneSubView = "dashBoard";
                $scope.communications = [];
                $scope.messages = [];

                $scope.SocialReferral_READY = "no";
                $scope.SocialReferral_FirstName = "";
                $scope.SocialReferral_LastName = "";
                $scope.SocialReferral_ProfileId = "";

                if (data.RedirectURLForSSO != null && data.RedirectURLForSSO != "") {
                    window.location = data.RedirectURLForSSO;
                }
                else if ($scope.tgSettings.SSOGateway == "1") {
                    //@GlobalResources.InactiveTooLong
                    if ($scope.ShowTimeoutMessage)
                        document.write("<HTML><HEAD><TITLE>" + $scope.dynamicStrings.LogoutTitle + "</TITLE></HEAD><BODY><TABLE width='100%' align=center cellPadding=0 cellSpacing=0><TBODY><TR><TD align='center' valign='top'><span class='TEXT'>" + $scope.dynamicStrings.InactiveTooLong + "</span></TD></TR></TBODY></TABLE></BODY></HTML>");
                    else
                        document.write("<HTML><HEAD><TITLE>" + $scope.dynamicStrings.LogoutTitle + "</TITLE></HEAD><BODY><TABLE width='100%' align=center cellPadding=0 cellSpacing=0><TBODY><TR><TD align='center' valign='top'><span class='TEXT'>" + $scope.tgSettings.LogoutConfirmationMessage + "</span></TD></TR></TBODY></TABLE></BODY></HTML>");
                    document.close();
                }
                else {
                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "candidateZone";
                    $scope.bWelcome = !($scope.bWelcome);

                    $scope.homeView();

                    $scope.welcomeTitle = $scope.tgSettings.LandingNonLoggedWelcomePageTitle;
                    setTimeout(function () { $scope.welcomeText = $scope.tgSettings.CandLandPageText; $scope.bWelcome = !($scope.bWelcome); $scope.$apply(); }, 10);
                    $scope.jobApplyUrl = "";

                    if (window.location.href.indexOf("ApplyWithPreLoad") > -1 && $scope.ShowTimeoutMessage) {
                        window.location = redirectURL + "#InactivityLogout";
                    }
                    else if (window.location.href.indexOf("ApplyWithPreLoad") > -1)
                        window.location = redirectURL;
                }
            });

        },
        applyPreload: function () {
            if (typeof $.queryParams().jobSiteId != 'undefined' && $.queryParams().jobSiteId != '' && $.queryParams().jobSiteId != $("#siteId").val()) {
                var origSiteId = $("#siteId").val();
                var switchSiteRequest = {};
                switchSiteRequest.PartnerId = $("#partnerId").val();
                switchSiteRequest.SwitchToSiteId = $.queryParams().jobSiteId;
                switchSiteRequest.FromSiteId = origSiteId;
                switchSiteRequest.CookieValue = $("#CookieValue").val();
                $.ajax({
                    success: function (data, status, jqxhr) {
                        if (data.Success == true) {
                            var bruid = $scope.encryptedBruid != "" ? $scope.encryptedBruid : decodeURIComponent($.queryParams().bruid);
                            window.location = "/TgNewUI/Search/Home/ApplyWithPreLoad?partnerid=" + $("#partnerId").val() + "&siteid=" + $.queryParams().jobSiteId + "&TQId=" + $.queryParams().tqid + "&bruid=" + encodeURIComponent(bruid) + "&reqid=" + $.queryParams().reqid + "&aipid=" + $.queryParams().aipid + "&pageid=" + $.queryParams().pageid + "&gqsessionId=" + $.queryParams().gqsessionId;
                        }

                    },
                    error: function (jqxhr, status, error) {
                    },
                    url: '/TgNewUI/Search/Ajax/SwitchSite',
                    data: switchSiteRequest,
                    type: 'POST'
                });
                return;
            }


            var rft = $("[name='__RequestVerificationToken']").val();
            $http.post(
                   "/gqweb/" + ($scope.applyPreloadJSON.WBMode ? "wbpreview" : "apply") + "?partnerid=" + $scope.applyPreloadJSON.PartnerId + "&siteid=" + ($scope.applyPreloadJSON.JobSiteId ? $scope.applyPreloadJSON.JobSiteId : $scope.applyPreloadJSON.SiteId) + "&localeid=" + $scope.applyPreloadJSON.LocaleId, { bruid: ($scope.applyPreloadJSON.BRUID), tqid: $scope.applyPreloadJSON.TQId, pageid: $scope.applyPreloadJSON.PageId, aipid: $scope.applyPreloadJSON.AIPID, localeid: $scope.applyPreloadJSON.LocaleId, reqid: $scope.applyPreloadJSON.ReqId, partnerid: $scope.applyPreloadJSON.PartnerId, siteid: $scope.applyPreloadJSON.SiteId, wbmode: $scope.applyPreloadJSON.WBMode, guid: $scope.applyPreloadJSON.GUID, gqsessionid: $scope.applyPreloadJSON.GQSessionId, loadingViaAjax: true },
                   { headers: { 'Content-Type': 'application/json', 'RFT': rft }, }

               ).success(function (result) {
                   appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                   $scope.$root.applyResponse = result;
                   $scope.bLoggedIn = true;
                   $scope.bShowBackButton = $("#noback").val() == "0" ? false : true;
                   $scope.applyPreLoad = false;
                   $scope.bJobDetailsShown = true;
               });
        },
        ////Change Security Question starts
        ResetChangeSecQuestfunction: function (scope) {
            scope.ChangeSecQuest.InvalidQuestions = [];
            scope.ChangeSecQuest.InvalidAnswers = [];
            scope.ChangeSecQuest.ErrorMsg = '';
            scope.ChangeSecQuest.errorID = '';
            scope.ChangeSecQuest.submitted1 = false;
            scope.ChangeSecQuest.submitted2 = false;
            scope.ChangeSecQuest.submitted3 = false;
            scope.ChangeSecQuest.noOfSecurityQuestions = (response.ClientSettings.TGSecurityQuestionOverride == '' || response.ClientSettings.TGSecurityQuestionOverride == null) ? (response.ClientSettings.LoginDetailsManagement && response.ClientSettings.LoginDetailsManagement.toLowerCase() == 'default' ? 1 : 3) : response.ClientSettings.TGSecurityQuestionOverride;
            scope.ChangeSecQuest.securityQuestion.value1 = '';
            scope.ChangeSecQuest.securityQuestion.value2 = '';
            scope.ChangeSecQuest.securityQuestion.value3 = '';
            scope.ChangeSecQuest.securityQuestion.answer1 = '';
            scope.ChangeSecQuest.securityQuestion.answer2 = '';
            scope.ChangeSecQuest.securityQuestion.answer3 = '';
            scope.ChangeSecQuest.securityQuestion.errorValue1 = false;
            scope.ChangeSecQuest.securityQuestion.errorValue2 = false;
            scope.ChangeSecQuest.securityQuestion.errorValue3 = false;
            scope.ChangeSecQuest.securityQuestion.errorAnswer1 = false;
            scope.ChangeSecQuest.securityQuestion.errorAnswer2 = false;
            scope.ChangeSecQuest.securityQuestion.errorAnswer3 = false;
            setTimeout(function () { $scope.$apply(); }, 0);
        },
        ChangeSecQuest:
            {
                InvalidQuestions: [],
                InvalidAnswers: [],
                ErrorMsg: '',
                errorID: '',
                submitted1: false,
                submitted2: false,
                submitted3: false,
                noOfSecurityQuestions: (response.ClientSettings.TGSecurityQuestionOverride == '' || response.ClientSettings.TGSecurityQuestionOverride == null) ? (response.ClientSettings.LoginDetailsManagement && response.ClientSettings.LoginDetailsManagement.toLowerCase() == 'default' ? 1 : 3) : response.ClientSettings.TGSecurityQuestionOverride,
                //noOfSecurityQuestions: response.ClientSettings.LoginDetailsManagement && response.ClientSettings.LoginDetailsManagement.toLowerCase() == 'default' ? 1 : response.ClientSettings.TGSecurityQuestionOverride,
                securityQuestion: {
                    value1: '',
                    value2: '',
                    value3: '',
                    answer1: '',
                    answer2: '',
                    answer3: '',
                    errorValue1: false,
                    errorValue2: false,
                    errorValue3: false,
                    errorAnswer1: false,
                    errorAnswer2: false,
                    errorAnswer3: false
                },
            },
        CommonErrorMessage: function (scope) {
            scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.Errormessage_SecurityQuestionsAndAnswersMustBeUnique;
            return scope;
        },
        ChangeSecQAfocusAt: function (ID, Submit) {
            if (ID != ("optSecurityQuestion1") && ID != ("optSecurityQuestion2") && ID != ("optSecurityQuestion3"))
                $("#" + ID).focus();
            else
                $('[id="' + ID + '-button"]').focus();

            setTimeout(function () { $scope.$apply(); }, 0);
        },
        ChangeSecurityQuestionAjax: function (scope) {
            var ChangeSecQuestRequest = {};
            ChangeSecQuestRequest.partnerId = $("#partnerId").val();
            ChangeSecQuestRequest.siteId = $("#siteId").val();
            ChangeSecQuestRequest.SQuestionOne = (scope.ChangeSecQuest.securityQuestion.value1 == '') ? '' : scope.ChangeSecQuest.securityQuestion.value1;
            ChangeSecQuestRequest.SQuestionTwo = (scope.ChangeSecQuest.securityQuestion.value2 == '') ? '' : scope.ChangeSecQuest.securityQuestion.value2;
            ChangeSecQuestRequest.SQuestionThree = (scope.ChangeSecQuest.securityQuestion.value3 == '') ? '' : scope.ChangeSecQuest.securityQuestion.value3;
            ChangeSecQuestRequest.SAnswerOne = (scope.ChangeSecQuest.securityQuestion.answer1 == '') ? '' : scope.ChangeSecQuest.securityQuestion.answer1;
            ChangeSecQuestRequest.SAnswerTwo = (scope.ChangeSecQuest.securityQuestion.answer2 == '') ? '' : scope.ChangeSecQuest.securityQuestion.answer2;
            ChangeSecQuestRequest.SAnswerThree = (scope.ChangeSecQuest.securityQuestion.answer3 == '') ? '' : scope.ChangeSecQuest.securityQuestion.answer3;
            ChangeSecQuestRequest.cookievalue = $("#CookieValue").val();
            var url = "/TgNewUI/Search/Ajax/ChangeSecurityQuestion"
            $http.post(url, ChangeSecQuestRequest).success(function (data, status, headers, config) {
                if (data.Success == true) {

                    $scope.encryptedBruid = data.EncryptedBruId;
                    $scope.hashCode = data.HashCode;
                    $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/Login");
                    $timeout(function () { $scope.$apply(); }, 0);
                    if (data.NewSessionId != null || data.NewSessionId != "") {
                        $("#CookieValue").val(data.NewSessionId);
                    }
                    if ($scope.jobApplyUrl != "") {
                        if ((data.ApplyStatus != null && data.ApplyStatus[0].Applied) || data.ApplyDiff <= 0) {
                            $scope.bLoggedIn = true;
                            $scope.bSignInView = false;
                            $scope.ApplyDifference = data.ApplyDiff;
                            $scope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus[0].AllowReApply : true;
                            $scope.Applied = data.ApplyStatus != null ? data.ApplyStatus[0].Applied : false;
                            $scope.LimitExceededMessage = data.LimitExceededMessage;
                            $scope.LoginChangeSecQuestion = false;
                            if (window.location.href.toLowerCase().indexOf("al=1") > -1)
                                $scope.bJobDetailsAPIError = true;
                            else
                                $scope.bJobDetailsAPIError = false;

                            $timeout(function () {
                                $scope.$apply();
                            }, 0);
                        }
                        else {
                            var rft = $("[name='__RequestVerificationToken']").val();
                            $http.get("/gqweb/apply?bruid=" + encodeURIComponent(data.EncryptedBruId) + $scope.jobApplyUrl + "&RFT=" + rft)
                                .success(function (result) {
                                    appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "apply";
                                    $scope.$root.applyResponse = result;
                                    $scope.bLoggedIn = true;
                                    $scope.bSignInView = false;
                                    $scope.showInFullView = false;
                                    $scope.LoginChangeSecQuestion = false;
                                    setTimeout(function () {
                                        $(".pageFooter").pinToFold();
                                    }, 10);
                                    scope.loginField = "";
                                    scope.password = "";
                                });
                        }
                    } else if (appScope.bJobDetailsShown || appScope.bSearchResults) {
                        $scope.bLoggedIn = true;
                        $scope.bSignInView = false;
                        $scope.LoginChangeSecQuestion = false;
                        $scope.bCreateAccount = false;


                        if (appScope.bJobDetailsShown) {
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "jobDetails";
                            $scope.login.ForgotPass = false;
                            $scope.SingleJobApplyDupCheckAjax();
                            //if ($scope.calledFrom == "save")
                            //    $scope.postToNextPageFromDetails('', $scope, $scope.calledFrom);
                        }
                        else if ($scope.bSearchResults && $scope.SearchResultsJobsSelectedScope != undefined && $scope.SearchResultsJobsSelectedScope.jobIds != undefined) {
                            ngDialog.closeAll();
                            appScope.$root.workFlow = $scope.$root.workFlow = $scope.workFlow = "searchResults";
                            var SMLoginjobids = $scope.SearchResultsJobsSelectedScope.jobIds.split(",").length > 0 ? $scope.SearchResultsJobsSelectedScope.jobIds : "";
                            $scope.SelectJobs = $scope.dynamicStrings.Button_Cancel;
                            _.each(appScope.jobs, function (job) {
                                if (SMLoginjobids.split(',').indexOf(_.pluck(_.where(job.Questions, { "QuestionName": "reqid" }), "Value").toString()) > -1) {
                                    job.Selected = true;
                                }
                            });
                            if ($scope.calledFrom == "save") {
                                $scope.postToNextPage("", $scope.SearchResultsJobsSelectedScope, $scope.calledFrom);
                            }
                            else {
                                $scope.postToNextPage('', appScope, 'mulapplyvald');
                            }
                        }
                    } else if ($scope.bresponsiveCandidateZone) {
                        $scope.bCandidateZone = true;
                        $scope.LoginChangeSecQuestion = false;
                        $scope.ViewDashBoardData("SavedJobs");
                    }
                    else {
                        var candidateZoneRequest = {};
                        candidateZoneRequest.PartnerId = $("#partnerId").val();
                        candidateZoneRequest.SiteId = $("#siteId").val();
                        candidateZoneRequest.EncryptedSessionId = $("#CookieValue").val();
                        candidateZoneRequest.SIDValue = $("#SIDValue").val();
                        url = '/TgNewUI/Search/Ajax/CandidateZone';
                        $http.post(url, candidateZoneRequest).success(function (data, status, headers, config) {
                            $scope.bCandidateZone = true;
                            $scope.CandidateZoneData = data;
                            $scope.TranslateCandidateZoneLinks($scope.CandidateZoneData);
                            $scope.bLoggedIn = true;
                            $scope.LoginChangeSecQuestion = false;
                            $scope.bSignInView = false;
                            $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                            $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                            $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                            if (data.LoggedInSettings.GeneralSocialReferral == "yes") {
                                $scope.SocialReferral_READY = data.LoggedInSettings.SocialReferralIsAuthenticated == "true" ? "yes" : "no";
                                $scope.SocialReferral_FirstName = encodeURIComponent(data.CandidateFirstName);
                                $scope.SocialReferral_LastName = encodeURIComponent(data.CandidateLastName);
                                $scope.SocialReferral_ProfileId = data.LoggedInSettings.profileId;
                            }
                            setTimeout(function () { $(".pageFooter").pinToFold() }, 10);

                        });
                        $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/CandidateZone");
                    }
                }
                //$timeout(function () {
                //    $scope.$apply();
                //}, 0);
            });
        },

        ThrottleSecurityQAValidation: function () {
            if ($scope.ChangeSecQuest.securityQuestion.value1 != $("#optSecurityQuestion1").val() && $("#optSecurityQuestion1").val() != null) {
                $scope.ChangeSecQuest.securityQuestion.value1 = $("#optSecurityQuestion1").val();
                $scope.ChangeSecQuest.submitted1 = false;
            }
            if ($scope.ChangeSecQuest.securityQuestion.value2 != $("#optSecurityQuestion2").val() && $("#optSecurityQuestion2").val() != null) {
                $scope.ChangeSecQuest.securityQuestion.value2 = $("#optSecurityQuestion2").val();
                $scope.ChangeSecQuest.submitted2 = false;
            }
            if ($scope.ChangeSecQuest.securityQuestion.value3 != $("#optSecurityQuestion3").val() && $("#optSecurityQuestion3").val() != null) {
                $scope.ChangeSecQuest.securityQuestion.value3 = $("#optSecurityQuestion3").val();
                $scope.ChangeSecQuest.submitted3 = false;
            }
        },
        SubmitSecurityQuestion: function (scope) {
            $scope.ValidateSecurityQuestion(scope);
            if (scope.SecurityQuestionsForm.$valid && scope.ChangeSecQuest.ErrorMsg == '') {
                $scope.ChangeSecurityQuestionAjax(scope);
            }
        },
        ValidateSecurityQuestion: function (scope) {
            scope.ChangeSecQuest.errorValue1 = false;
            scope.ChangeSecQuest.errorValue2 = false;
            scope.ChangeSecQuest.errorValue3 = false;
            scope.ChangeSecQuest.errorAnswer1 = false;
            scope.ChangeSecQuest.errorAnswer2 = false;
            scope.ChangeSecQuest.errorAnswer3 = false;
            scope.ChangeSecQuest.errorID = '';
            scope.ChangeSecQuest.InvalidAnswers = [];
            scope.ChangeSecQuest.InvalidQuestions = [];
            scope.ChangeSecQuest.ErrorMsg = '';

            //Validation Starts here
            if (scope.SecurityQuestionsForm.$invalid) {

                if (scope.ChangeSecQuest.submitted1 && (!angular.isDefined(scope.ChangeSecQuest.securityQuestion.value1) || scope.ChangeSecQuest.securityQuestion.value1 == '')) {
                    scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    scope.ChangeSecQuest.InvalidQuestions.push({
                        "Question": "Question1",
                        "QuestionID": 'optSecurityQuestion1',
                    });
                    if (scope.ChangeSecQuest.errorID == "")
                        scope.ChangeSecQuest.errorID = "optSecurityQuestion1";

                }
                if (scope.ChangeSecQuest.noOfSecurityQuestions >= 2 && scope.ChangeSecQuest.submitted2 && (!angular.isDefined(scope.ChangeSecQuest.securityQuestion.value2) || scope.ChangeSecQuest.securityQuestion.value2 == '')) {
                    scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    scope.ChangeSecQuest.InvalidQuestions.push({
                        "Question": "Question2",
                        "QuestionID": 'optSecurityQuestion2',
                    });
                    if (scope.ChangeSecQuest.errorID == "")
                        scope.ChangeSecQuest.errorID = "optSecurityQuestion2";

                }
                if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && scope.ChangeSecQuest.submitted3 && (!angular.isDefined(scope.ChangeSecQuest.securityQuestion.value3) || scope.ChangeSecQuest.securityQuestion.value3 == '')) {
                    scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    scope.ChangeSecQuest.InvalidQuestions.push({
                        "Question": "Question3",
                        "QuestionID": 'optSecurityQuestion3'
                    });
                    if (scope.ChangeSecQuest.errorID == "")
                        scope.ChangeSecQuest.errorID = "optSecurityQuestion3";
                }
                if (scope.ChangeSecQuest.submitted1 && (!angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer1) || scope.ChangeSecQuest.securityQuestion.answer1 == '')) {
                    scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    scope.ChangeSecQuest.InvalidAnswers.push({
                        "Answer": "Answer1",
                        "AnswerID": 'txtSecurityQuestion1Answer',
                        "QuestionValue": scope.ChangeSecQuest.securityQuestion.value1
                    });
                    if (scope.ChangeSecQuest.errorID == "")
                        scope.ChangeSecQuest.errorID = "txtSecurityQuestion1Answer";
                }

                if (scope.ChangeSecQuest.noOfSecurityQuestions >= 2 && scope.ChangeSecQuest.submitted2 && (!angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer2) || scope.ChangeSecQuest.securityQuestion.answer2 == '')) {
                    scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    scope.ChangeSecQuest.InvalidAnswers.push({
                        "Answer": "Answer2",
                        "AnswerID": 'txtSecurityQuestion2Answer',
                        "QuestionValue": scope.ChangeSecQuest.securityQuestion.value2
                    });
                    if (scope.ChangeSecQuest.errorID == "")
                        scope.ChangeSecQuest.errorID = "txtSecurityQuestion2Answer";
                }

                if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && scope.ChangeSecQuest.submitted3 && (!angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer3) || scope.ChangeSecQuest.securityQuestion.answer3 == '')) {
                    scope.ChangeSecQuest.ErrorMsg = $scope.dynamicStrings.ErrorMessage_AttentionRequired;
                    scope.ChangeSecQuest.InvalidAnswers.push({
                        "Answer": "Answer3",
                        "AnswerID": 'txtSecurityQuestion3Answer',
                        "QuestionValue": scope.ChangeSecQuest.securityQuestion.value3
                    });
                    if (scope.ChangeSecQuest.errorID == "")
                        scope.ChangeSecQuest.errorID = "txtSecurityQuestion3Answer";
                }
            }
            //End of Validation
            //start of Duplicate QA
            if (scope.ChangeSecQuest.noOfSecurityQuestions != 1 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value1) && scope.ChangeSecQuest.securityQuestion.value1 != '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value2) && scope.ChangeSecQuest.securityQuestion.value2 != '') {
                if (scope.ChangeSecQuest.securityQuestion.value1 == scope.ChangeSecQuest.securityQuestion.value2) {
                    scope.ChangeSecQuest.errorValue1 = true;
                    scope.ChangeSecQuest.errorValue2 = true;
                    $scope.CommonErrorMessage(scope);
                }
            }
            if (scope.ChangeSecQuest.noOfSecurityQuestions != 1 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer1) && scope.ChangeSecQuest.securityQuestion.answer1 != '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer2) && scope.ChangeSecQuest.securityQuestion.answer2 != '') {
                if (scope.ChangeSecQuest.securityQuestion.answer1 == scope.ChangeSecQuest.securityQuestion.answer2) {
                    scope.ChangeSecQuest.errorAnswer1 = true;
                    scope.ChangeSecQuest.errorAnswer2 = true;
                    $scope.CommonErrorMessage(scope);
                }
            }
            if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value1) && scope.ChangeSecQuest.securityQuestion.value1 != '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value2) && scope.ChangeSecQuest.securityQuestion.value2 != '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.value3) && scope.ChangeSecQuest.securityQuestion.value3 != '') {
                if (scope.ChangeSecQuest.securityQuestion.value1 == scope.ChangeSecQuest.securityQuestion.value3) {
                    scope.ChangeSecQuest.errorValue1 = true;
                    scope.ChangeSecQuest.errorValue3 = true;
                    $scope.CommonErrorMessage(scope);
                }
                if (scope.ChangeSecQuest.securityQuestion.value2 == scope.ChangeSecQuest.securityQuestion.value3) {
                    scope.ChangeSecQuest.errorValue2 = true;
                    scope.ChangeSecQuest.errorValue3 = true;
                    $scope.CommonErrorMessage(scope);
                }
            }
            if (scope.ChangeSecQuest.noOfSecurityQuestions == 3 && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer1) && scope.ChangeSecQuest.securityQuestion.answer1 != '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer2) && scope.ChangeSecQuest.securityQuestion.answer2 != '' && angular.isDefined(scope.ChangeSecQuest.securityQuestion.answer3) && scope.ChangeSecQuest.securityQuestion.answer3 != '') {
                if (scope.ChangeSecQuest.securityQuestion.answer1 == scope.ChangeSecQuest.securityQuestion.answer3) {
                    scope.ChangeSecQuest.errorAnswer1 = true;
                    scope.ChangeSecQuest.errorAnswer3 = true;
                    $scope.CommonErrorMessage(scope);
                }
                if (scope.ChangeSecQuest.securityQuestion.answer2 == scope.ChangeSecQuest.securityQuestion.answer3) {
                    scope.ChangeSecQuest.errorAnswer2 = true;
                    scope.ChangeSecQuest.errorAnswer3 = true;
                    $scope.CommonErrorMessage(scope);
                }
            }
            return;
        },
        ////Change Security Question Ends here


        LoginWithSocialMedia: function (socialMedia) {
            if ($scope.bSearchResults && !$scope.bJobDetailsShown && $scope.calledFrom == 'refer') {
                $("#RedirectToAfterSMLogin").val("referfromsearchresults");
            }
            else if ($scope.bSearchResults && !$scope.bJobDetailsShown && $scope.calledFrom == 'save') {
                $("#RedirectToAfterSMLogin").val("savefromsearchresults");
            }
            else if ($scope.bSearchResults && !$scope.bJobDetailsShown && $scope.calledFrom == 'savesearch') {
                $scope.SaveSearchCriteriaToLocalSession();
                $("#RedirectToAfterSMLogin").val("savesearchfromsearchresults");
            }
            else if ($scope.bJobDetailsShown && $scope.calledFrom == 'refer') {
                $("#RedirectToAfterSMLogin").val("referfromjobdetails");
            }
            else if ($scope.bJobDetailsShown && $scope.calledFrom == 'save') {
                $("#RedirectToAfterSMLogin").val("savefromjobdetails");
            }
            else if ($scope.bSearchResults && !$scope.bJobDetailsShown && $scope.$root.workFlow == "searchResults") {
                $("#RedirectToAfterSMLogin").val("searchresults");
            }
            var socialMediaUrl = "../../../tgwebhost/SocialMediaIntegration.aspx?action=login&smsid=" + socialMedia + "&clientid=" + $("#partnerId").val() + "&lid=" + $("#smlid").val() + "&callee=TG&tgsiteid=" + $("#siteId").val() + "&invokedBy=responsive";
            window.open(socialMediaUrl, "_blank", "resizable=yes,scrollbar=yes, top=200, left=200");
        },

        SaveSearchCriteriaToLocalSession: function () {
            sessionStorage.setItem("jobs", JSON.stringify($scope.jobs));
            sessionStorage.setItem("facets", JSON.stringify($scope.facets));
            sessionStorage.setItem("powersearchquestions", JSON.stringify($scope.powerSearchQuestions));
            sessionStorage.setItem("latitude", $scope.SaveSearchCriteria.Latitude ? $scope.SaveSearchCriteria.Latitude : $scope.latitude);
            sessionStorage.setItem("longitude", $scope.SaveSearchCriteria.Longitude ? $scope.SaveSearchCriteria.Longitude : $scope.longitude);
            sessionStorage.setItem("keyword", $scope.SaveSearchCriteria.Keyword ? $scope.SaveSearchCriteria.Keyword : $scope.keyWordSearch.text);
            sessionStorage.setItem("location", $scope.SaveSearchCriteria.Location ? $scope.SaveSearchCriteria.Location : $scope.locationSearch.text);
            $scope.sortby = ($scope.sortby == null && $scope.sortby == undefined) ? $("#sortBy").val() : $scope.sortby;
            sessionStorage.setItem("sortby", $scope.sortby);
            sessionStorage.setItem("jobsheading", $scope.jobsHeading);
            sessionStorage.setItem('savesearchaftersocialmedialogin', true);
        },

        ClearSaveSearchCriteriaToLocalSession: function () {
            try {
                sessionStorage.setItem("jobs", null);
                sessionStorage.setItem("facets", null);
                sessionStorage.setItem("powersearchquestions", null);
                sessionStorage.setItem("latitude", null);
                sessionStorage.setItem("longitude", null);
                sessionStorage.setItem("keyword", null);
                sessionStorage.setItem("location", null);
                sessionStorage.setItem("sortby", null);
                sessionStorage.setItem("jobsheading", null);
                sessionStorage.setItem('savesearchaftersocialmedialogin', false);
            }
            catch (error) {

            }
        },

        TranslateCandidateZoneLinks: function (data) {
            if ($scope.bresponsiveCandidateZone) {
                _.forEach(data.Links, function (link) {
                    //debugger;
                    switch (link.CandidateZoneLinkId) {
                        case "dashBoard":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Lbl_DashBoard;
                            break;
                        case "jobProfile":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Profile;
                            break;
                        case "accountSettings":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Lbl_AccountSettings;
                            break;
                        case "viewAssessment":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_Assessments;
                            break;
                        case "candidatePortal":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_CandidatePortal;
                            break;
                        case "eventManager":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_Events;
                            break;
                        case "communicationHistory":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_Communications;
                            break;
                        case "submitGeneralReferral":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_SubmitGeneralReferral;
                            break;
                        case "socialReferralStatus":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_SocialReferralStatus;
                            break;
                        case "ResponsiveAssessment":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_Assessments;
                            break;
                        case "messageArchive":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Heading_Message_Archives;
                            break;
                        case "ResponsiveReferrals":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Link_ResponsiveReferrals;
                            break;
                    }
                })

            }
            else {
                _.forEach(data.Links, function (link) {
                    switch (link.CandidateZoneLinkName) {
                        case "Edit your profile":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Edit_Profile_Menu;
                            break;
                        case "Resume/CV manager":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Resume_CV_Menu;
                            break;
                        case "Search agent manager":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Search_Agent_Menu;
                            break;
                        case "Job cart":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Job_Cart_Menu;
                            break;
                        case "Saved drafts":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Saved_Draft_Menu;
                            break;
                        case "Social networking information":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Social_Config_Menu;
                            link.CandidateZoneLinkDescriptionText = $scope.dynamicStrings.Social_Config_Description;
                            break;
                        case "Submit General Referral":
                            link.CandidateZoneLinkName = $scope.dynamicStrings.Submit_Socio_Referral_Menu;
                            link.CandidateZoneLinkDescriptionText = $scope.dynamicStrings.Submit_Socio_Referral_Description;
                            break;
                    }
                })
            }
        },

        TranslatePowerSearchQuestions: function (questions) {
            _.forEach(questions, function (question) {
                switch (question.QuestionDescription) {
                    case "Post Date":
                        question.QuestionDescription = $scope.dynamicStrings.Post_Date
                        break;
                    case "Language":
                        question.QuestionDescription = $scope.dynamicStrings.Language
                        break;
                }
            })
        },

        RefreshSession: function () {
            $scope.bRefreshSession = true;
            if (window.location.href.toLowerCase().indexOf("al=1") > -1)
                $scope.bJobDetailsAPIError = true;
            else
                $scope.bJobDetailsAPIError = false;


            if ($scope.tgSettings.CandRemainsLoggedIn.toLowerCase() == "yes" || (!$scope.bShowBackButton && $scope.bJobDetailsAPIError)) {

                var refreshSessionRequest = {}
                refreshSessionRequest.PartnerId = $("#partnerId").val();
                refreshSessionRequest.SiteId = $("#siteId").val();
                refreshSessionRequest.EncryptedSessionId = $("#CookieValue").val();
                if ($scope.jobDetailsJobShown != "") {
                    refreshSessionRequest.JobIDs = $scope.jobDetailsJobShown;
                }
                $scope.bWelcome = !($scope.bWelcome);
                url = '/TgNewUI/Search/Ajax/RefreshSession';
                $http.post(url, refreshSessionRequest).success(function (data, status, headers, config) {
                    $scope.ApplyDifference = data.ApplyDiff;
                    $scope.AllowReApply = data.ApplyStatus != null ? data.ApplyStatus.AllowReApply : true;
                    $scope.Applied = data.ApplyStatus != null ? data.ApplyStatus.Applied : false;
                    $scope.LimitExceededMessage = data.LimitExceededMessage;
                    $scope.bLoggedIn = true;
                    if (data.RefreshedSession != null)
                        $("#CookieValue").val(data.RefreshedSession);
                    $scope.encryptedBruid = data.EncryptedBruId;
                    $scope.welcomeTitle = data.LoggedInSettings.LandingLoggedWelcomePageTitle;
                    $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText;
                    $scope.SearchOpeningsSummaryText = data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText != "" ? data.LoggedInSettings.LandingLoggedSearchOpeningsSummaryText : $scope.dynamicStrings.CandidateZone_SearchOpeningsSummaryText;
                    if ($scope.bSelectedGroup) {
                        $scope.SelectedGroupAjax($("#partnerId").val(), $("#siteId").val());
                        $scope.bLoggedIn = true;
                    }
                    setTimeout(function () { $scope.welcomeText = data.LoggedInSettings.LandingLoggedWelcomeText; $scope.bWelcome = !($scope.bWelcome); $scope.$apply(); }, 10);

                });
            }
            else {
                $scope.logOutCandidate();
            }
        },
        //Clones the given facets and returns the filtered facets collection without modifying input facets collection.
        GetFilteredFacets: function (facets) {
            var clonedFilteredFacets = _.cloneDeep(facets);
            _.remove(clonedFilteredFacets, function (facet) {
                facet.Options = _.filter(facet.Options, { Selected: true });
                return facet.Options.length > 0 ? false : true;
            });
            return clonedFilteredFacets;
        },

        updateSaveSearchCritetia: function (smartSearchRequest) {
            $scope.SaveSearchCriteria = {
                KeyWord: smartSearchRequest.keyword,
                Location: smartSearchRequest.location,
                Latitude: smartSearchRequest.Latitude,
                Longitude: smartSearchRequest.Longitude
            };
        },

        getSavedSearchesMetaDataAndOpenDialog: function () {
            if (!$scope.bLoggedIn && $scope.tgSettings.SSOGateway != "1") {
                $scope.calledFrom = "savesearch";
                $scope.showMobileSignInDialog($scope);
                return;
            }
            var SavedSearchesRequest = {
                ClientId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionValue: $("#CookieValue").val()
            };
            var url = '/TgNewUI/CandidateZone/Ajax/GetSavedSearchesMetaData';
            $http.post(url, SavedSearchesRequest).success(function (data, status, headers, config) {
                $scope.SavedSearchesMetaData = data;
                $scope.openSaveSearchDialog();
            });
        },

        openSaveSearchDialog: function (existingSavedSearch) {

            $scope.bSearchSaved = false;
            $scope.SaveSearchDialog = {};
            $scope.SaveSearchDialog.isEditFromSavedSearchesTab = false;
            $scope.SaveSearchDialog.bExistingSavedSearch = false;
            if (typeof existingSavedSearch != "undefined") {
                $scope.SaveSearchDialog.isEditFromSavedSearchesTab = true;
                $scope.SaveSearchDialog.InitialSearchName = existingSavedSearch.SearchName;
            }

            if (typeof existingSavedSearch == "undefined" && $scope.searchResultsFromSavedSearch != null) {
                existingSavedSearch = $scope.searchResultsFromSavedSearch;
            }

            if (typeof existingSavedSearch != "undefined") {
                $scope.SaveSearchDialog.SearchName = existingSavedSearch.SearchName;
                $scope.SaveSearchDialog.SearchFrequency = existingSavedSearch.Frequency;
                $scope.SaveSearchDialog.EmailAddress = existingSavedSearch.Email;
                $scope.SaveSearchDialog.SavedSearchId = existingSavedSearch.SavedSearchId;
            }
            else {
                $scope.SaveSearchDialog.SearchName = "";
                $scope.SaveSearchDialog.SearchFrequency = "7";
                $scope.SaveSearchDialog.EmailAddress = "";
            }
            if ($scope.SavedSearchesMetaData != null && typeof existingSavedSearch == "undefined") {
                if (typeof $scope.SavedSearchesMetaData.EmailAddress != "undefined") {
                    $scope.SaveSearchDialog.EmailAddress = $scope.SavedSearchesMetaData.EmailAddress;
                }
            }

            $scope.SaveSearchDialog.Submitted = false;

            $scope.CallApply();
            setTimeout(function () {
                ngDialog.open({
                    preCloseCallback: function (value) {
                    },
                    template: 'SaveSearchDialog', scope: $scope, className: 'ngdialog-theme-default customDialogue', showClose: true, closeByDocument: false, ariaRole: "dialog"
                });
            }, 0);

        },

        isExistingSavedSearch: function (scope) {
            var existingSearch = _.find(scope.SavedSearchesMetaData.SavedSearches, function (s) {
                return (typeof scope.SaveSearchDialog.SearchName != "undefined" && s.Name.toLowerCase() == scope.SaveSearchDialog.SearchName.toLowerCase() && (!scope.SaveSearchDialog.isEditFromSavedSearchesTab || (scope.SaveSearchDialog.isEditFromSavedSearchesTab && s.Name.toLowerCase() != scope.SaveSearchDialog.InitialSearchName.toLowerCase())));
            });
            if (typeof existingSearch != "undefined") {
                scope.SaveSearchDialog.bExistingSavedSearch = true;
                $scope.SaveSearchDialog.bSavedSearchesError = true;
            }
            else
                scope.SaveSearchDialog.bExistingSavedSearch = false;
            $scope.CallApply();
        },

        SaveSearch: function (scope) {
            $scope.SaveSearchDialog.Submitted = true;
            if ($scope.SaveSearchDialog.SearchFrequency == 0) {
                $scope.SaveSearchDialog.EmailAddress = '';
            }
            $timeout(function () {
                if (scope.SaveSearchForm.$valid && ($scope.SaveSearchDialog.SearchFrequency == 0 || ($scope.SaveSearchDialog.EmailAddress != null && $scope.SaveSearchDialog.EmailAddress.trim() != '' && !scope.SaveSearchForm.SaveSearchEmailAddress.$error.pattern)) && (!$scope.SaveSearchDialog.isEditFromSavedSearchesTab || ($scope.SaveSearchDialog.isEditFromSavedSearchesTab && !$scope.SaveSearchDialog.bExistingSavedSearch))) {
                    if (!$scope.SaveSearchDialog.bExistingSavedSearch && !$scope.SaveSearchDialog.isEditFromSavedSearchesTab && $scope.SavedSearchesMetaData.SavedSearches.length >= 10) {
                        $scope.SaveSearchDialog.MaxLimitExceeded = true;
                    }
                    else {
                        $scope.SaveSearchDialog.bSavedSearchesError = false;
                        scope.oActiveLaddaButton.start();
                        if ($scope.SaveSearchDialog.isEditFromSavedSearchesTab) {
                            $scope.UpdateSavedSearchAjax(scope);
                        }
                        else {
                            $scope.SaveSearchAjax(scope);
                        }
                    }
                }
                else {
                    $scope.SaveSearchDialog.bSavedSearchesError = true;
                }
            }, 0);

        },

        SaveSearchAjax: function (scope) {
            var SaveSearchRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionValue: $("#CookieValue").val(),
                SearchName: $scope.SaveSearchDialog.SearchName,
                Frequency: $scope.SaveSearchDialog.SearchFrequency,
                Email: $scope.SaveSearchDialog.EmailAddress,
                Latitude: $scope.SaveSearchCriteria.Latitude ? $scope.SaveSearchCriteria.Latitude : $scope.latitude,
                Longitude: $scope.SaveSearchCriteria.Longitude ? $scope.SaveSearchCriteria.Longitude : $scope.longitude,
                Keyword: $scope.SaveSearchCriteria.Keyword ? $scope.SaveSearchCriteria.Keyword : $scope.keyWordSearch.text,
                Location: $scope.SaveSearchCriteria.Location ? $scope.SaveSearchCriteria.Location : $scope.locationSearch.text,
                KeywordCustomSolrFields: $scope.keywordFields,
                LocationCustomSolrFields: $scope.locationFields,
                SavedSearchId: 0
            };

            //Find out, if its an existing search 
            if ($scope.SaveSearchDialog.bExistingSavedSearch) {
                var existingSearch = _.find(scope.SavedSearchesMetaData.SavedSearches, function (s) {
                    return (s.Name.toLowerCase() == scope.SaveSearchDialog.SearchName.toLowerCase());
                });
                if (typeof existingSearch != "undefined") {
                    SaveSearchRequest.SavedSearchId = existingSearch.Value;
                }
            }

            var powerSearchOptions = [];
            if ($scope.powerSearchQuestions != "") {
                _.forEach($scope.powerSearchQuestions, function (aQuestion) {
                    var obj = {};
                    obj.VerityZone = aQuestion.VerityZone;
                    obj.Type = aQuestion.QuestionType;
                    obj.QuestionId = aQuestion.QId;
                    obj.QuestionName = aQuestion.QuestionName;
                    if (aQuestion.IsAutoComplete) {
                        obj.OptionCodes = _.pluck(aQuestion.selectedOptions, "data");
                    }
                    else if (aQuestion.QuestionType == "text" || aQuestion.QuestionType == "textarea" || aQuestion.QuestionType == "date" || aQuestion.QuestionType == "email" || aQuestion.QuestionType == "numeric") {
                        obj.Value = aQuestion.Value;
                    }
                    else {
                        obj.Options = _.where(aQuestion.Options, { Selected: true });
                    }
                    if ((obj.Value != "" && obj.Value != null) || (obj.Options != null && obj.Options.length > 0) || ((obj.OptionCodes != null && obj.OptionCodes.length > 0))) {
                        powerSearchOptions.push(obj);
                    }
                });
            }
            SaveSearchRequest.PowerSearchOptions = powerSearchOptions;
            SaveSearchRequest.Facets = $scope.GetFilteredFacets(appScope.facets);
            $scope.sortby = ($scope.sortby == null && $scope.sortby == undefined) ? $("#sortBy").val() : $scope.sortby;
            SaveSearchRequest.SortType = "";
            if (typeof $scope.sortby != "undefined") {
                SaveSearchRequest.SortType = $scope.sortFields[$scope.sortby].Name;
            }

            var url = '/TgNewUI/CandidateZone/Ajax/SaveSearch';
            $http.post(url, SaveSearchRequest).success(function (data, status, headers, config) {
                scope.oActiveLaddaButton.stop();
                $scope.SaveSearchDialog.MaxLimitExceeded = false;
                $scope.SaveSearchDialog.SearchNameExists = false;
                if (data.Success) {
                    $scope.searchResultsFromSavedSearch = {
                        SearchName: $scope.SaveSearchDialog.SearchName,
                        Frequency: $scope.SaveSearchDialog.SearchFrequency,
                        Email: $scope.SaveSearchDialog.EmailAddress,
                        SavedSearchId: data.SavedSearchId
                    }
                    $scope.bSearchSaved = true;
                    $scope.CloseDialogs();
                    $scope.adjustHeaderStickers();
                }
                else if (data.MaxLimitExceeded) {
                    $scope.SaveSearchDialog.MaxLimitExceeded = true;
                }
                else if (data.SearchNameExists) {
                    appScope.dynamicStrings.Label_SaveSearchUniqueNameUpdated = appScope.dynamicStrings.Label_SaveSearchUniqueName.replace('[SearchName]', SaveSearchRequest.AgentName);
                    $scope.SaveSearchDialog.SearchNameExists = true;
                    $scope.SaveSearchDialog.bSavedSearchesError = true;
                }
            }).error(function (data, status, headers, config) {
                scope.oActiveLaddaButton.stop();
            });
        },

        UpdateSavedSearchAjax: function (scope) {
            var UpdateSavedSearchRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionValue: $("#CookieValue").val(),
                SearchName: $scope.SaveSearchDialog.SearchName,
                Frequency: $scope.SaveSearchDialog.SearchFrequency,
                Email: $scope.SaveSearchDialog.EmailAddress,
                SavedSearchId: $scope.SaveSearchDialog.SavedSearchId
            };

            var url = '/TgNewUI/CandidateZone/Ajax/UpdateSavedSearch';
            $http.post(url, UpdateSavedSearchRequest).success(function (data, status, headers, config) {
                scope.oActiveLaddaButton.stop();
                if (data.Success) {
                    $scope.savedSearchActionCompletion = $scope.enumForSavedSearchActions.Configure;
                    $scope.CloseDialogs();
                    _.find($scope.SavedSearchesMetaData.SavedSearches, { 'Value': UpdateSavedSearchRequest.SavedSearchId }).Name = $scope.SaveSearchDialog.SearchName;
                    var existingSavedSearch = _.find($scope.SavedSearches, { 'SavedSearchId': UpdateSavedSearchRequest.SavedSearchId });
                    existingSavedSearch.SearchName = UpdateSavedSearchRequest.SearchName;
                    existingSavedSearch.Frequency = UpdateSavedSearchRequest.Frequency;
                    existingSavedSearch.Email = UpdateSavedSearchRequest.Email;
                    $scope.CallApply();
                    $scope.adjustHeaderStickers();
                }
            });
        },

        RenewSavedSearchAjax: function (savedSearch) {
            var RenewSavedSearchRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionValue: $("#CookieValue").val(),
                SavedSearchId: savedSearch.SavedSearchId
            };

            var url = '/TgNewUI/CandidateZone/Ajax/RenewSavedSearch';
            $http.post(url, RenewSavedSearchRequest).success(function (data, status, headers, config) {
                if (data.Success) {
                    $scope.savedSearchActionCompletion = $scope.enumForSavedSearchActions.Renew;
                    var existingSavedSearch = _.find($scope.SavedSearches, { 'SavedSearchId': RenewSavedSearchRequest.SavedSearchId });
                    existingSavedSearch.NoOfDaysToExpire = 90;
                    $scope.CallApply();
                    $scope.adjustHeaderStickers();
                }
            });
        },

        DeleteSavedSearchAjax: function (savedSearch) {
            var DeleteSavedSearchRequest = {
                PartnerId: $("#partnerId").val(),
                SiteId: $("#siteId").val(),
                EncryptedSessionValue: $("#CookieValue").val(),
                SavedSearchId: savedSearch.SavedSearchId
            };

            var url = '/TgNewUI/CandidateZone/Ajax/DeleteSavedSearch';
            $http.post(url, DeleteSavedSearchRequest).success(function (data, status, headers, config) {
                if (data.Success) {
                    $scope.savedSearchActionCompletion = $scope.enumForSavedSearchActions.Delete;
                    _.remove($scope.SavedSearches, function (savedSearch) {
                        return savedSearch.SavedSearchId == DeleteSavedSearchRequest.SavedSearchId;
                    });
                    _.remove($scope.SavedSearchesMetaData.SavedSearches, function (savedSearchMeta) {
                        return savedSearchMeta.Value == DeleteSavedSearchRequest.SavedSearchId;
                    });
                    $scope.CandZoneSearchCount = $scope.SavedSearches.length;

                    $scope.CallApply();
                    $scope.adjustHeaderStickers();
                }
            });
        }


    });

    $scope.powerSearchKeyWordSearch = _.clone($scope.keyWordSearch, true);

    $scope.powerSearchKeyWordSearch.prompt = null;

    $scope.powerSearchLocationSearch = _.clone($scope.locationSearch, true);

    $scope.powerSearchLocationSearch.prompt = null;

    $scope.$root.historyStateCallback = $scope.historyStateCallback || _.noop;
    $scope.$root.historyApplyCallback = $scope.historyApplyCallback || _.noop;

    $scope.$root.storeHistoryState = $scope.storeHistoryState || _.noop;

    $scope.$root.setPrevHash = $scope.setPrevHash || _.noop;

    $scope.showInitialJobs(false);

    if (sessionStorage.getItem('showAssessmentsCompletionMessage') == null) {
        sessionStorage.setItem('showAssessmentsCompletionMessage', true);
    }

    $scope.updateCandidateZoneData();

    if ($.queryParams().fromSM && $scope.bLoggedIn && !(window.location.href.toLowerCase().indexOf("reqid") >= 0 && $.queryParams().reqid != "") && !(window.location.href.toLowerCase().indexOf("jobid") >= 0 && $.queryParams().jobid != "") && $.queryParams().actiontype != "savesearchfromsearchresults") {
        $location.hash("home");

        setTimeout(function () {
            $scope.bresponsiveCandidateZone == true ? ($scope.bcandidatezoneSubmenu = true && $scope.responsivecandidateZoneView({ CandidateZoneLinkId: "dashBoard" })) : $scope.candidateZoneView();
        }, 1000);
        $scope.loadwebtrackerscript($("#partnerId").val(), $("#siteId").val(), "/TGNewUI/Login");


    }

    if ($scope.applyPreloadJSON) {
        if ($scope.searchResponse) {
            if (!$scope.applyPreloadJSON.WBMode && $scope.searchResponse.ApplyStatus != null && ($scope.searchResponse.ApplyStatus.Applied || $scope.searchResponse.ApplyDiff <= 0)) {
                $scope.ApplyDifference = $scope.searchResponse.ApplyDiff;
                $scope.AllowReApply = $scope.searchResponse.ApplyStatus != null ? $scope.searchResponse.ApplyStatus.AllowReApply : true;
                $scope.Applied = $scope.searchResponse.ApplyStatus != null ? $scope.searchResponse.ApplyStatus.Applied : false;
                $scope.LimitExceededMessage = $scope.searchResponse.LimitExceededMessage;
                $scope.bWelcome = false;
                $scope.bJobDetailsShown = true;
                $scope.bSearchResults = false;
                $scope.bSidebarVisible = false;


                if ($scope.tgSettings.SMLoginFlow.toLowerCase() != "yes")
                    $scope.bJobDetailsAPIError = true;
                else
                    $scope.bJobDetailsAPIError = false;

                //Job Detail redirection
                $scope.bInitialLoad = false;
                if ($scope.searchResponse.Jobdetails != null) {
                    $scope.jobDetailsFieldsToDisplay = $scope.searchResponse.JobDetailFieldsToDisplay;
                    $scope.jobDetailFields = $scope.searchResponse.Jobdetails;
                    $scope.isHotJob = _.pluck(_.where($scope.searchResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "hotjob" }), "AnswerValue").toString().toLowerCase() == "yes";
                    $scope.searchResultsURL = "";
                    $scope.enableJobDetailsSendToFriend = $scope.tgSettings.SendToFriend.toLowerCase() == "yes" ? true : false;
                    $scope.enablePostToMySocialNetwork = $scope.tgSettings.EnablePostToMySocialNetworkLink.toLowerCase() == "yes" && $scope.tgSettings.SocialMedia != "" ? true : false;
                    $scope.jobDetailsUrlForSocialMedia = $scope.searchResponse.Jobdetails == null ? "" : $("#pageURL").val() + "/tgwebhost/jobdetails.aspx?jobid=" + _.pluck(_.where($scope.searchResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "reqid" }), "AnswerValue").toString() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&type=mail&JobReqLang=" + $scope.tgSettings.DefLanguageId + "&JobSiteId=" + $("#siteId").val() + "&gqid=" + _.pluck(_.where($scope.searchResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "gqid" }), "AnswerValue").toString(),
                    //$scope.jobDetailsUrlForSocialMedia = $("#pageURL").val() + "/tgwebhost/jobdetails.aspx?jobid=" + _.pluck(_.where($scope.searchResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "reqid" }), "AnswerValue").toString() + "&partnerid=" + $("#partnerId").val() + "&siteid=" + $("#siteId").val() + "&type=mail&JobReqLang=" + $scope.tgSettings.DefLanguageId + "&JobSiteId=" + _.pluck(_.where(scope.job.Questions, { "QuestionName": "siteid" }), "Value") + "&gqid=" + _.pluck(_.where($scope.searchResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "gqid" }), "AnswerValue").toString();
                    $scope.jobDetailsButtonText = $scope.tgSettings.JobDetailsSendToFriendButtonText != "" ? $scope.tgSettings.JobDetailsSendToFriendButtonText : $scope.dynamicStrings.JobDetails_SendToFriend;
                }
                $scope.searchResultsURL = "";
                $("#title").nextAll('meta').remove();
                setTimeout(function () {
                    $scope.$apply();
                }, 0);
                var metaTag = $scope.tgSettings.JobDetailsMetaTagText.replace(/#ClientName#/g, $scope.tgSettings.PartnerName);
                var jobdesc = "";
                var jobtitl = "";
                if ($scope.searchResponse.Jobdetails != null) {
                    jobdesc = _.pluck(_.where($scope.searchResponse.Jobdetails.JobDetailQuestions, { "VerityZone": "jobdescription" }), "AnswerValue").toString();
                    jobdesc = jobdesc.replace(/<(.|\n)*?>/g, "").replace("\"", "&quot;");
                    if (jobdesc.length > 50) {
                        jobdesc = jobdesc.substring(0, 50);
                    }
                    jobtitl = $scope.searchResponse.Jobdetails.Title.toString();
                    jobtitl = jobtitl.replace(/<(.|\n)*?>/g, "").replace("\"", "&quot;");
                    if (jobtitl.length > 50) {
                        jobtitl = jobtitl.substring(0, 50);
                    }
                }
                $scope.ErrorMessageJobTitle = $scope.searchResponse.ApplyStatus.JobTitle != null ? $scope.searchResponse.ApplyStatus.JobTitle : jobtitl;

                metaTag = metaTag.replace("#JobDescription#", jobdesc);
                $("#title").after(metaTag.replace("#JobTitle#", jobtitl));
                $scope.JobDetailQuestionsSocialShare = $scope.searchResponse.Jobdetails.JobDetailQuestions;
                //$scope.handlers.JobdetailSocialShare();
                //
                $scope.ShowJobAlert = true;
                setTimeout(function () {
                    $scope.$apply();
                }, 0);
            }
            else {
                $scope.applyPreLoad = true;
                $scope.applyPreload();
            }
        }
    }
    $scope.getReqId = function (value) {
        return value.Value;
    };

    $scope.closeAssessmentCompletionStatus = function (value) {
        if (value) {
            if (sessionStorage.getItem('showAssessmentsCompletionMessage') == "false") {
                sessionStorage.setItem('showAssessmentsCompletionMessage', true);
            }
            else {
                sessionStorage.setItem('showAssessmentsCompletionMessage', false);
            }
        }
        else {
            $scope.currentAssessmentCompleted = false;
        }
    };


    //Track User's Inactivity

    $(window).resize(function () {
        if ($scope.bLoggedIn) {
            $scope.ResetInactivityTimer();
            if (typeof $scope.candidateZoneSubView != 'undefined' && $scope.candidatezoneSubView.toLowerCase() == "messagearchive")
                $scope.equalheight(".cardList .jobCard");
        }
        $scope.mobileScreen = $(window).width() <= 768;
        if (appScope.$root.uiBooleans['bPhoneViewLinksVisible'] && $scope.mobileScreen) {
            $("#headerLinkContainer").css("visibility", "visible");
        }
        if ($(".responsiveCandZoneMenu").is(":visible") && $(window).width() >= 768) {
            $scope.responsivecandidateZoneView();
        }

        if (window.appScope) {
            setTimeout(function () {
                appScope.$apply();
            }, 0);
        }

        if ($scope.bresponsiveCandidateZone && $scope.bCandidateZone) {

            if ($scope.candidatezoneDashBoardView == 'SavedSearches') {
                $scope.alignCards("SavedSearchesContainer", "jobCard");
            }
            else if ($scope.candidatezoneDashBoardView == 'SavedJobs') {
                $scope.alignCards("SavedJobsContainer", "jobCard");
            }
            else if ($scope.candidatezoneDashBoardView == 'Applications') {
                $scope.alignCards("ApplicationsContainer", "jobCard");
            }

            if ($scope.candidatezoneSubView == 'ResponsiveAssessment') {
                $scope.alignCards("AssessmentsContainer", "jobCard");
            }
            else if ($scope.candidatezoneSubView == 'ResponsiveReferrals') {
                $scope.alignCards("ReferralsContainer", "jobCard");
            }
            else if ($scope.candidatezoneSubView == 'applicationDetail') {
                $('select').selectmenu('close');
            }
        }
    });
    $(document).on('click scroll mousedown', function (e) {
        if ($scope.bLoggedIn) {
            $scope.adjustHeaderStickers();
            $scope.ResetInactivityTimer();
        }
    });
    $scope.mobileScreen = $(window).width() <= 768;
    $scope.Inactivitytimer = null;
    $scope.updateCounter = function () {
        $scope.counter--;
        $scope.TimeoutWarning = $scope.dynamicStrings.IdleWarningSeconds;
        if ($scope.TimeoutWarning.indexOf("[no of seconds]") > -1)
            $scope.TimeoutWarning = $scope.TimeoutWarning.replace("[no of seconds]", $scope.counter);
        else
            $scope.TimeoutWarning = $scope.dynamicStrings.IdleWarningSeconds + $scope.counter + $scope.dynamicStrings.IdleWarningSeconds2;
        $scope.Inactivitytimer = $timeout($scope.updateCounter, 1000);
        if ($scope.counter == 0) {
            $scope.counter = 0;
            $timeout.cancel($scope.countdown);
            $scope.Inactivitytimer = null;
            ngDialog.closeAll();
            $scope.logOutCandidate();
            if ($scope.tgSettings.SSOGateway != "1" && $scope.tgSettings.TimeOutSec > 0 && !(window.location.href.indexOf("ApplyWithPreLoad") > -1))
                $scope.showMobileSignInDialog($scope);
            if ($scope.tgSettings.TimeOutSec > 0)
                $scope.ShowTimeoutMessage = true;
        }
    };
    $scope.$on('IdleStart', function () {
        if ($scope.Inactivitytimer == null) {
            $log.debug('IdleStart started.with counter' + $scope.counter);
            $timeout.cancel($scope.countdown);
            $scope.counter = 30;
            //ngDialog.closeAll();
            $scope.updateCounter();
            $scope.InActivityWarning = ngDialog.open({
                preCloseCallback: function (value) {
                    $.restoreFocus();
                },
                template: 'InActivityWarning', scope: $scope, className: 'ngdialog-theme-default', showClose: false, closeByDocument: false, ariaRole: "dialog"
            });
        }
    });
    $scope.ResetInactivityTimer = function () {
        $timeout.cancel($scope.Inactivitytimer);
        $scope.Inactivitytimer = null;
        Idle.unwatch();
        setTimeout(function () {
            Idle.watch();
            $scope.$apply();
        }, 0);
        if ($scope.InActivityWarning != undefined)
            $scope.InActivityWarning.close();
    };

    $scope.adjustHeaderStickers = function () {
        $timeout(function () {
            if ($(window).scrollTop() > $(".pageHeader").height()) {
                $(".jobSavedStatus, .headerStatusSticker:not(.float)").css('top', 0);
            }
            else if ($(window).scrollTop() < $(".pageHeader").height()) {
                $(".jobSavedStatus, .headerStatusSticker:not(.float)").css('top', $(".pageHeader").height() - $(window).scrollTop());
            }
        }, 10);
    };

    $scope.$watch(
        function ($scope) {
            return $scope.bLoggedIn
        },
     function (newValue, oldValue) {
         if (newValue && $scope.tgSettings.TimeOutSec > 0) {
             $scope.ShowTimeoutMessage = false;
             _.each($scope.oHistory, function (oPriorScope, sName) {
                 oPriorScope.ShowTimeoutMessage = $scope.ShowTimeoutMessage;
             });
             $timeout.cancel($scope.Inactivitytimer);
             $scope.Inactivitytimer = null;
             Idle.setIdle(($scope.tgSettings.TimeOutSec - 30));
             Idle.setTimeout(30);
             Idle.watch();
             $log.debug('Activity track started.');
         }
         else {
             Idle.unwatch();
             $log.debug('Activity track stopped.');
         }
     });
    if ($location.$$absUrl.indexOf("#InactivityLogout") > -1) {
        $location.$$path = "";
        $location.hash("home");
        ngDialog.closeAll();
        $scope.ShowTimeoutMessage = true;
        if ($scope.tgSettings.SSOGateway != "1")
            $scope.showMobileSignInDialog($scope);
        else
            $scope.ShowTimeoutMessage = false;
    } else
        $scope.ShowTimeoutMessage = false;

    //End Track User's Inactivity
});
searchApp.config(['$locationProvider', function ($locationProvider) {
    if (typeof $("#AssessQString") != undefined && $("#AssessQString").val() != undefined && $("#AssessQString").val() != "")
        $locationProvider.html5Mode(false);
    else
        $locationProvider.html5Mode(true);
}]);
searchApp.config(function (IdleProvider, KeepaliveProvider) {
    KeepaliveProvider.interval(1);
});
function SocialNetworkReferral(scope, event) {
    if (appScope.SocialReferral_READY == "yes") {
        appScope.jobIds = scope.jobIds;
        scope.LaunchSocialReferralMenu(scope, event.target);
    }
    else {
        if (appScope.tgSettings.EnableResponsiveSocialReferralQuestions == "true") {
            appScope.renderReferralQuestions();
        }
        else {
            appScope.jobIds = scope.jobIds;
            redirectPage = "socialnetworkreferral.aspx";
            postValues = { ButtonId: "SubmitGeneralReferral", hdRft: $("#rfToken").val() }
            $.form(url = '../../../TGwebhost/' + redirectPage + '?SID=' + $("#SIDValue").val(), data = postValues, method = 'POST', "_self").submit();
        }
    }
}

searchApp.controller('viewassessments', function ($scope, $http, $timeout, $window, $compile, $location) {

    $scope.alignCards = function (container, elementClass) {

        $("." + container + " ." + elementClass).css("height", "auto").find('.cardFooter').removeClass('cardFooterPosition');
        $timeout(function () {
            var heights = $("." + container + " ." + elementClass).map(function () {
                return $(this).height();
            }).get();
            var maxHeight = _.max(heights);
            $("." + container + " ." + elementClass).height(maxHeight).find('.cardFooter').addClass('cardFooterPosition');
        }, 0);

    };

    $scope.renderAssessments = function () {
        $scope.PendingAssessmentsUrl = "/TgNewUI/CandidateZone/Ajax/ViewAssessments?q=" + $("#AssessQString").val();
        window.location.reload();

    };
    $scope.OpenCloseAssessments = function (hrefUrl) {
        var Assesmentwindow = window.open(hrefUrl, "Assessments");

        Assesmentwindow.onunload = function () {
            $scope.renderAssessments();
        };
    };
    $timeout(function () {
        $(".title").css("padding-top", "30px");
    }, 1000);
    $scope.bStandAloneAssessView = true;
    $scope.PendingAssessments = $scope.assessresponse.PendingAssessments;
    $scope.BrandingConfiguration = $scope.assessresponse.BrandingConfiguration;
    $scope.AutoLaunchAssessUrl = $scope.assessresponse.AutoLaunchAssessUrl;
    $timeout(function () {
        $scope.alignCards("AssesmentsCards", "jobCard");
    }, 1000);
    window.AssessmentScope = $scope;
    $scope.$root.AssessmentScope = $scope;
    if ($scope.AutoLaunchAssessUrl != null && $scope.AutoLaunchAssessUrl != "") {
        $scope.OpenCloseAssessments($scope.AutoLaunchAssessUrl);
    }
});

function refreshAssess() {
    if (typeof window.appScope != 'undefined')
    { window.appScope.renderAssessments(""); }
    else if (typeof window.AssessmentScope != 'undefined')
    { window.AssessmentScope.renderAssessments(); }
}
//<!-- This is to refresh the responsive page after a classic GQ apply-->
function reload() { window.appScope.RefreshSession(); }
