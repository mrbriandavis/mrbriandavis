var $content, $loginPanel, $formPanel;
var localStorageSupport = (function () {
  try { return 'localStorage' in window && window['localStorage'] !== null; }
  catch (e) { return false; }
})();

var RESTAPI = (function(baseURL) {
  return {
    CURRENT_USER: baseURL + '/users/current.json',
    AUTOCOMPLETE: baseURL + '/autocomplete/ranked.json'
  };
})('https://api.staging.yammer.com/api/v1');

function loadUser() {
  yam.request({
    url: RESTAPI.CURRENT_USER,
    method: 'GET',
    success: function(user) {
      console.log(user);
      $('.username').text(user.full_name);
      $('.mugshot').attr('src', user.mugshot_url);
    },
    error: function(err) {
      alert('failed to get the current user');
      console.error(err);
    }
  });
}

function yammerUserAutoComplete(str, callback) {
  yam.request({
    url: RESTAPI.AUTOCOMPLETE,
    data: { prefix: str, models:['user'] },
    method: 'GET',
    success: function(result) {
      console.log(result);
      callback(null);
    },
    error: function(err) {
      console.error(err);
    }
  });
}

function rememberUser(token) {
  if(localStorageSupport) {
    localStorage['yammer-token'] = token;
  }
}

function onAuthCheck(result) {
  if(result.status === 'connected') {
    console.log('user is connected');
    if($('#remember-me').is(':checked')) {
      rememberUser(result.access_token.token);
    }
    $loginPanel.hide();
    $formPanel.show();
    loadUser();
  } else {
    console.log('need to log the user in');
    $loginPanel.show();
    $formPanel.hide();
  }
}

function _init(token) {
  $content = $('#content');
  $loginPanel = $content.children('.login-panel');
  $formPanel = $content.children('.form-panel');
  $formPanel.find('#userpicker').typeahead
  if(token) {
    // if we have a token then set and validate that token
    yam.platform.setAuthToken(token, onAuthCheck);
  } else {
    // otherwise check if the user is logged in
    yam.platform.getLoginStatus(onAuthCheck);
  }
}

$(function() {
  if(!localStorageSupport) {
    return _init();
  }
  var token = localStorage['yammer-token'];
  _init(token);
});

function loginButtonClicked() {
  yam.platform.login(onAuthCheck);
}
