void function($){
    chrome.extension.sendMessage('loaded');

    var URL = 'http://127.0.0.1:8189';
    var $body = $('body');
    var CTRL = 17;
    var started = false;
    var inited = false;
    var rangeModel = false;

    function sendMsg(data){
        $.post(URL, data, function(data){
            if(data && data.status == 'success'){
                console && console.log('success');
            } else {
                console && console.log('fail');
            }
        })
    }

    function keyHandler(ev) {
        if(ev.ctrlKey) {
            if(rangeModel = !rangeModel) {
                $body.xxRangeSelect().xxOverSelect('disable');
            } else {
                $body.xxRangeSelect('disable').xxOverSelect();
            }

        }
    }

    chrome.extension.onMessage.addListener(function(command){
        if(command == 'start') {
            if(started) {
                return;
            }
            started = true;

            $body.on('keydown', keyHandler);

            $body.xxOverSelect().on('xxselect:select', function(ev, el){
                if(confirm("是否发送消息？")){
                    sendMsg(XX.path(el));
                }
            }).on('xxRangeSelect:selectend', function(ev, point, $mask){
                    $body.xxRangeSelect('disable');
                    if(confirm("是否发送消息？")){
                        var elems = XX.getElementsByRange(point.x1, point.y1, point.x2, point.y2, this);
                        var pathes = [];
                        for(var i = 0, len = elems.length; i < len; ++i) {
                            pathes.push(XX.path(elems[i]));
                        }
                        sendMsg(pathes.join(';'));
                        $body.xxRangeSelect();
                    }
                });
        } else {
            started = false;
            $body.xxRangeSelect('disable').xxOverSelect('disable').off('keydown xxselect:select xxRangeSelect:selectend');
        }
    });
}(jQuery);