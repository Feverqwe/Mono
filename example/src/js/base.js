/**
 * Created by Anton on 20.06.2016.
 */
var initBase = function (pageId) {
    var log = function () {
        var msg = [].slice.call(arguments);
        log.list.push(msg);
        var text = JSON.stringify(msg);
        output.textContent += (output.textContent.length ? '\n' : '') + text;
        mono.sendMessage({action: 'inLog', text: msg});
    };
    log.list = [];

    var panelCode = function () {/*
     <span>{pageId}</span>
     <textarea style="width: 620px; height: 410px" id="output"></textarea>
     <br/>
     <input type="text" id="message"/>
     <input type="button" id="send" value="Send"/>
     <input type="button" id="sendToActiveTab" value="Send2tab"/>
     <input type="button" id="sendAndReply" value="Send&reply"/>
     <input type="button" id="sendAsBg" value="SendAsBg"/>
     <input type="button" id="ping" value="Ping"/>
     <input type="button" id="getBgLog" value="Log"/>
     <input type="button" id="autoTest" value="Test"/>
     <input type="button" id="storageTest" value="sTest"/>
     */
    }.toString().replace(/\{pageId\}/g, pageId);

    var panel = document.createElement('div');
    var style = {
        zIndex: 9999,
        width: '640px',
        height: '480px',
        backgroundColor: '#fff',
        position: 'absolute',
        left: 0,
        top: 0,
        boxShadow: '0 0 2px rgba(0,0,0,0.5)',
        padding: '5px',
        overflow: 'auto'
    };
    for (var key in style) {
        panel.style[key] = style[key];
    }

    var start = panelCode.indexOf('/*') + 2;
    var end = panelCode.lastIndexOf('*/');
    panel.innerHTML = panelCode.substr(start, end - start);

    document.body.appendChild(panel);

    var message = panel.querySelector('#message');
    var send = panel.querySelector('#send');
    var sendToActiveTab = panel.querySelector('#sendToActiveTab');
    var sendAndReply = panel.querySelector('#sendAndReply');
    var sendAsBg = panel.querySelector('#sendAsBg');
    var ping = panel.querySelector('#ping');
    var getBgLog = panel.querySelector('#getBgLog');
    var autoTest = panel.querySelector('#autoTest');
    var storageTest = panel.querySelector('#storageTest');
    var output = panel.querySelector('#output');

    var sendMessage = function (msg) {
        log(pageId, 'send:', msg);
        mono.sendMessage.apply(this, arguments);
    };

    var onSubmit = function () {
        var text = message.value;
        message.value = '';
        sendMessage(text);
    };

    send.addEventListener('click', onSubmit);
    message.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            onSubmit();
        }
    });
    sendToActiveTab.addEventListener('click', function() {
        var text = message.value;
        message.value = '';
        sendMessage({action: 'sendToActiveTab', msg: text});
    });
    sendAndReply.addEventListener('click', function() {
        var text = message.value;
        message.value = '';
        sendMessage({action: 'reply', reply: text}, function(msg) {
            log(pageId, 'reply:', msg);
        });
    });
    sendAsBg.addEventListener('click', function() {
        var text = message.value;
        message.value = '';
        sendMessage({action: 'send', msg: text});
    });
    ping.addEventListener('click', function() {
        sendMessage({action: 'ping'}, function(response) {
            log(pageId, 'reply:', response);
        });
    });
    getBgLog.addEventListener('click', function() {
        sendMessage({action: 'getLog'}, function(response) {
            output.textContent = '>\n' + response.map(function(item) {
                    return JSON.stringify(item);
                }).join('\n') + '\n<';
        });
    });
    autoTest.addEventListener('click', function() {
        sendMessage({action: 'autoTest'}, function(result) {
            output.textContent = '>\n' +result + '\n<';
        });
    });
    storageTest.addEventListener('click', function() {
        sendMessage({action: 'storageTest'}, function(result) {
            output.textContent = '>\n' +result + '\n<';
        });
    });

    setTimeout(function() {
        "use strict";
        message.focus();
    }, 100);

    var actionList = {
        reply: function (msg, response) {
            response(msg.reply);
        },
        send: function (msg, response) {
            sendMessage(msg.msg, response);
        },
        storage: function(msg, response) {
            var args = msg.args || [];
            args.push(response);
            mono.storage[msg.subAction].apply(mono.storage, args);
        }
    };

    mono.onMessage.addListener(function (message, response) {
        log(pageId, 'receive:', message);
        var func = actionList[message.action];
        func && func(message, function (msg) {
            log(pageId, 'reply:', msg);
            response(msg);
        });
    });
};