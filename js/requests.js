(function(suite) {
  "use strict";

  var RESTAPI = suite.RESTAPI;

  // this task gets the current user and prints out their name
  function getCurrentUser(callback) {
    yam.platform.request({
      url: RESTAPI.CURRENT_USER,
      method: 'GET',
      success: function(user) {
        suite.log("Got current user: " + user.full_name);
        callback();
      },
      error: function() {
        callback(true);
      }
    });
  }

  // this task hits the completie for 1 user and prints them out
  function getFrequentUsers(callback) {
    yam.platform.request({
      url: RESTAPI.AUTOCOMPLETE,
      method: 'GET',
      data: {
        models: 'user:1'
      },
      success: function(results) {
        suite.log("Got a user result: " + results.user[0].full_name);
        callback();
      },
      error: function() {
        callback(true);
      }
    });
  }

  // this task hits the feed endpoint and prints out a thread id
  function getTheFeed(callback) {
    yam.platform.request({
      url: RESTAPI.MESSAGES,
      method: 'GET',
      success: function(results) {
        suite.log("Got a result with " + results.messages.length + " messages");
        callback();
      },
      error: function() {
        callback(true);
      }
    });
  }

  function deleteMessage(id, callback) {
    yam.platform.request({
      url: RESTAPI.DELETE_MESSAGES + '/' + id + '.json',
      method: 'DELETE',
      dataFilter: function(data, type) {
        if (type === "json" && data.trim() === "") {
          data = null;
        }
        return data;
      },
      success: function() {
        suite.log("Deleted the message");
        callback();
      },
      error: function() {
        suite.log("Failed to deleted the message", true);
        callback(true);
      }
    });
  }

  function postToFeed(callback) {
    yam.platform.request({
      url: RESTAPI.MESSAGES,
      method: 'POST',
      data: {
        body: "test message from the js sdk"
      },
      success: function(results) {
        var messageId = results.messages[0].id;
        suite.log("Posted  a message to all company");
        deleteMessage(messageId, callback);
      },
      error: function() {
        callback(true);
      }
    });
  }


  function search(callback) {
    yam.platform.request({
      url: RESTAPI.SEARCH,
      method: 'GET',
      data: {
        search: 'batman'
      },
      success: function(results) {
        suite.log("Got a result with " + results.messages.messages.length + " messages");
        callback();
      },
      error: function() {
        callback(true);
      }
    });
  }

  function networks(callback) {
    yam.platform.request({
      url: RESTAPI.NETWORKS,
      method: 'GET',
      success: function(results) {
        suite.log("Got a result with " + results.length + " networks");
        callback();
      },
      error: function() {
        callback(true);
      }
    });
  }

  suite.addTask("get current user", getCurrentUser);
  suite.addTask("get networks for user", networks);
  suite.addTask("get autocomplete results", getFrequentUsers);
  suite.addTask("get the general feed", getTheFeed);
  // suite.addTask("post to the feed", postToFeed);
  suite.addTask("search for batman", search);
})(window.suite);