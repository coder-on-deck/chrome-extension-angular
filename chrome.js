angular.module('chrome-extension-angular', [])

angular.module('chrome-extension-angular').service('chrome', ['$timeout', '$q', function ChromeService ($timeout, $q) {
  // use callback because multiple times
  this.onMessage = function (callback) {
    try {
      chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
          $timeout(function () {
            callback(request, sender, sendResponse)
          }, 0)
        }
      )
    } catch (e) {
      console.log('added listener', e)
    }
  }

  this.setBadgeText = function (opts) {
    try {
      if (opts.text !== null && typeof (opts.text) !== 'undefined') {
        opts.text = '' + opts.text // convert to string
      }
      chrome.browserAction.setBadgeText(opts)
    } catch (e) {
      console.log('setting badge', opts, e)
    }
  }

  this.sendMessage = function (opts) {
    try {
      chrome.runtime.sendMessage(opts)
    } catch (e) {
      console.log('sending message', opts)
    }
  }

  this.readConfig = function () {
    var deferred = $q.defer()
    try {
      // Use default value color = 'red' and likesColor = true.
      chrome.storage.sync.get(null, function (data) {
        $timeout(function () {
          deferred.resolve(data)
        }, 0)
      })
    } catch (e) {
      deferred.resolve(null)
    }
    return deferred.promise
  }
}])
