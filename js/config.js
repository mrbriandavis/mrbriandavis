
window.suite = (function(suite, window, $) {
  "use strict";

  // config things so that we can easily move between environments
  var BASEURI = yam.config().apiBaseURI;

  function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
  }


  suite.RESTAPI = (function(baseURL) {
    return {
      CURRENT_USER: baseURL + '/api/v1/users/current.json',
      AUTOCOMPLETE: baseURL + '/api/v1/autocomplete/ranked',
      MESSAGES: baseURL + '/api/v1/messages.json',
      DELETE_MESSAGES: baseURL + '/api/v1/messages',
      SEARCH: baseURL + '/api/v1/search.json',
      NETWORKS: baseURL + '/api/v1/networks/current.json'
    };
  })(BASEURI);

  suite.LOCALSTORAGESUPPORT = (function () {
    try { return 'localStorage' in window && window['localStorage'] !== null; }
    catch (e) { return false; }
  })();

  var outelem = null;
  $(function(){ outelem = $("#output"); });
  suite.log = function(str, error) {
    if(outelem) {
      outelem.append('<p style="color:' + (error ? 'red' : 'black') + '">' + htmlEscape(str) + '</p>');
    }
    if(console && console.log) {
      console.log(str);
    }
  };

  suite.ready = function(callback) {
    function _checkReady() {
      if(typeof(yam) !== "undefined" && outelem !== null) {
        callback();
      } else {
        setTimeout(_checkReady, 1000);
      }
    }
    _checkReady();
  };

  var taskStack = [];
  suite.addTask = function(desc, callback) {
    taskStack.push({
      desc: desc,
      callback: callback
    });
  };
  function nextTask() {
    if(taskStack.length === 0) {
      suite.log("All tasks complete");
      return;
    }
    var task = taskStack.shift();
    suite.log("Running: " + task.desc);
    task.callback(function(err) {
      if(err) {
        suite.log("TASK FAILED: " + task.desc, true);
      }
      setTimeout(nextTask, 10);
    });
  }
  suite.runTasks = function() {
    suite.log("Starting tasks");
    nextTask();
  };

  return suite;
})({}, window, window.jQuery);
