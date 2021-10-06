
function TimeDate() {
    var THIS = this,
        DOM = {
            time: document.getElementById('time'),
            date: document.getElementById('date'),
            content: document.getElementById('quotes-content'),
            author: document.getElementById('quotes-author'),
            refresh: document.getElementById('refresh')
        },
        months = ["January",
            "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November",
            "December"],
        interval = 1000;

    THIS.renderTimeDate = function () {
        var hr, min, sec, day, month, year, date;
        setInterval(function () {
            date = new Date();
            hr = date.getHours();
            min = date.getMinutes();
            sec = date.getSeconds();
            hr = hr <= 9 ? "0" + hr : hr;
            min = min <= 9 ? "0" + min : min;
            sec = sec <= 9 ? "0" + sec : sec;
            day = date.getDate();
            month = months[date.getMonth()];
            year = date.getFullYear();
            DOM.time.textContent = hr + ":" + min;
            
            DOM.date.textContent = day + " " + month + " " + year;
        }, interval);
    }
    THIS.getRandomArbitrary = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    THIS.getQoutesPos = function (range) {
        return THIS.getRandomArbitrary(0, range)
    }
    THIS.loadQuotes = function(){
        fetch('./js/quotes.json')
        .then((response) => {
            // console.log(response);
             return response.json()
        })
        .then((data) => {
            // Work with JSON data here
            // console.log(data)
            THIS.setQoutesInDom(data)
        })
        .catch((err) => {
            // Do something for an error here
        })
    }
    THIS.setQoutesInDom = function(data){
        
        var pos = THIS.getQoutesPos(data.length);
        // console.log(" pos "+pos);
        // console.log(qoutes[pos].content);
        // console.log(qoutes[pos].author);
        if(!!pos && !!data[pos]){
            DOM.content.textContent = data[pos].content;
            DOM.author.textContent = data[pos].author;
        }
    }
    THIS.renderQoutes = function () {
        THIS.loadQuotes();
        
    }

    THIS.refreshQoutes = function () {
        DOM.refresh.addEventListener('click', function (e) {    
            e.preventDefault();
            THIS.renderQoutes();
        })
    }
    return {
        init: function () {
            THIS.renderTimeDate();
            THIS.renderQoutes();
            THIS.refreshQoutes();
        }
    }


}


function CountDown() {
    var THIS=this,
        DOM = {
            add: $('#add'),
            overlay:$('#overlay'),
            cross:$("#cross"),
            title:$("#title"),
            timedate:$("#timedate"),
            submit:$("#submit"),
            sampele:$('#countdown-sample'),
            countdownlist:$('#countdown-list'),
            datetimepicker:$('#datetimepicker1')
        },
        CLASS = {
            btnDisabled: 'disable-cm',
            day:'countdown-day',
            time:'countdown-time',
            daystxt:'countdown-days',
            enddate:'countdown-endate',
            title:'countdown-title'
        },
        CountDownList = "countdownList",
        countDownObj =[] ,
        STATE = {
            errorMsg: {
                title: 'Enter goal title',
                date: 'please select date',
            }
        };

    THIS.uuidv4 = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    THIS.trackEmptyFields = function () {
        DOM.title.on('input', function () { THIS.EnableBtnFunc() });
        DOM.datetimepicker.on('dp.change', function() { THIS.EnableBtnFunc() });
    }
    THIS.EnableOverlay = function(){
        DOM.add.on('click',function(){
            THIS.ShowOverlay();
        });

        DOM.cross.on('click',function(){
            THIS.HideOverlay();
        })
    }

    THIS.ShowOverlay = function(){
        DOM.overlay.show();
    }

    THIS.HideOverlay = function(){
        DOM.overlay.hide();
    }

    THIS.SubmitForm = function(){
        DOM.submit.on('click',function(ev){
            ev.preventDefault();
            var valuesFromForm = THIS.getValuesFromForm();
            if(!countDownObj) countDownObj = [];
            countDownObj.push(valuesFromForm);
            THIS.updateToLocalData(valuesFromForm);
            THIS.makeCountDown(valuesFromForm);
            THIS.HideOverlay();
        });
    }

    THIS.EnableBtnFunc = function (ev) {
        try {
            // THIS.removeErrorField();
            if (THIS.checkEmptyField()) DOM.submit.removeClass(CLASS.btnDisabled);
            else DOM.submit.addClass(CLASS.btnDisabled);
        } catch (error) {
            console.log(error);
        }
    }

    THIS.checkEmptyField = function(){
        var _title = DOM.title.val().trim(),_timedate = DOM.timedate.val().trim();
        return !!_title && !!_timedate;
    }

    
    THIS.getValuesFromForm = function () {
        var formData = {},
            _title = DOM.title.val().trim(),
            _timedate = DOM.timedate.val().trim();

        if (_title) formData['title'] = _title;
        if (_timedate) formData['endon'] = _timedate;
        formData['id'] = THIS.uuidv4();
        formData['createdon'] = new Date();


        console.log(formData);
        return formData;
    }
    
    THIS.updateToLocalData = function(data){
            var prevData = THIS.getLocalData(CountDownList);
            if(prevData == null) prevData = [];
            prevData.push(data);

            THIS.setLocalData(CountDownList,prevData);
    }

    THIS.getLocalData = function(label){
        return JSON.parse(localStorage.getItem(label));
    }
    THIS.setLocalData = function(label,data){
        localStorage.setItem(label,JSON.stringify(data));
    }
    THIS.setLocalObj = function(){
        countDownObj = THIS.getLocalData(CountDownList);
        if(countDownObj == null){
            countDownObj = [];
        }
    }
    THIS.getLocalObj = function(){
        return countDownObj;
    }
    THIS.initCountDown = function(){
        var localdata = this.getLocalObj();
        for (let i = 0; i < localdata.length; i++) {
            THIS.makeCountDown(localdata[i])
        }
    }
    THIS.makeCountDown = function(data){
        var countdown = THIS.makeCountDownDom(data);
        DOM.countdownlist.append(countdown);
        THIS.initIndividualCountDown(data);

    }
    THIS.makeCountDownDom = function(data){
        var cloneEl = '<div class="countdown" data-id="'+data["id"]+'" ><div class="countdown-top"><div class="countdown-left"><span class="countdown-day">--</span></div><div class="countdown-right"><span class="countdown-time">--:--:--</span><span class="countdown-days">days</span></div></div><div class="countdown-bottom"><span class="countdown-enddate">'+data["endon"]+'</span></div><div class="countdown-info"><div class="countdown-contaienr"><div class="countdown-title">'+data["title"]+'</div><div class="countdown-btn"><span class="edit">edit</span><span class="delete"><svg width="12px" height="15px" viewBox="0 0 8 10" version="1.1"> <g id="Final" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="1626.-App-Science-Maps-1.1-(Topsites)" transform="translate(-547.000000, -296.000000)" fill="#ABABAB" fill-rule="nonzero"> <g id="Group-3" transform="translate(471.000000, 288.000000)"> <g id="rubbish-bin" transform="translate(76.000000, 8.000000)"> <path d="M0.87403423,9.50572127 C0.885305623,9.77491443 1.10682152,9.98735941 1.37621027,9.98735941 L6.06841076,9.98735941 C6.33779951,9.98735941 6.5593154,9.77491443 6.5705868,9.50572127 L6.90567237,2.43198044 L0.538948655,2.43198044 L0.87403423,9.50572127 Z M4.78374083,4.18897311 C4.78374083,4.07625917 4.87513447,3.98484108 4.98789731,3.98484108 L5.31442543,3.98484108 C5.42711491,3.98484108 5.51858191,4.07623472 5.51858191,4.18897311 L5.51858191,8.23036675 C5.51858191,8.34310513 5.42718826,8.43449878 5.31442543,8.43449878 L4.98789731,8.43449878 C4.87518337,8.43449878 4.78374083,8.34315403 4.78374083,8.23036675 L4.78374083,4.18897311 Z M3.35491443,4.18897311 C3.35491443,4.07625917 3.44630807,3.98484108 3.55904645,3.98484108 L3.88557457,3.98484108 C3.99826406,3.98484108 4.0897066,4.07623472 4.0897066,4.18897311 L4.0897066,8.23036675 C4.0897066,8.34310513 3.99833741,8.43449878 3.88557457,8.43449878 L3.55904645,8.43449878 C3.44633252,8.43449878 3.35491443,8.34315403 3.35491443,8.23036675 L3.35491443,4.18897311 L3.35491443,4.18897311 Z M1.92603912,4.18897311 C1.92603912,4.07625917 2.01743276,3.98484108 2.13017115,3.98484108 L2.45672372,3.98484108 C2.56943765,3.98484108 2.66085575,4.07623472 2.66085575,4.18897311 L2.66085575,8.23036675 C2.66085575,8.34310513 2.5694621,8.43449878 2.45672372,8.43449878 L2.13017115,8.43449878 C2.01745721,8.43449878 1.92603912,8.34315403 1.92603912,8.23036675 L1.92603912,4.18897311 Z" id="Shape"></path> <path d="M7.12877751,0.514498778 L4.96410758,0.514498778 L4.96410758,0.105256724 C4.96410758,0.0471393643 4.91699267,0 4.85885086,0 L2.58572127,0 C2.52760391,0 2.480489,0.0471393643 2.480489,0.105256724 L2.480489,0.514474328 L0.315794621,0.514474328 C0.141589242,0.514474328 0.000391198044,0.655696822 0.000391198044,0.8299022 L0.000391198044,1.8207824 L7.44418093,1.8207824 L7.44418093,0.82992665 C7.44418093,0.655721271 7.30298289,0.514498778 7.12877751,0.514498778 Z" id="Path"></path> </g> </g> </g> </g> </svg></span></div></div></div></div>'

        return cloneEl;
    } 

    THIS.initIndividualCountDown = function(countDownObj){
        if(!!countDownObj["id"] && !!countDownObj["endon"] ){
            var interal = setInterval(function(){
                
                var eleM1 = $('[data-id='+countDownObj['id']+']')
                var agoObj = THIS.dateAgoCalculate(countDownObj['endon']);
                if(!!agoObj["done"] && agoObj["done"]){
                    clearInterval(interal);
                }
                eleM1.find('.countdown-day').text(agoObj['day']);
                eleM1.find('.countdown-time').text(agoObj['hour']+":"+agoObj['min']+":"+agoObj['sec']);
            },1000);

        }
    }


    THIS.dateAgoCalculate = function(date){
        const second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;
        var diffDate = new Date(date) - new Date(),agoObj={};
        if(diffDate <= 0){
            agoObj.done = true;
            return agoObj;
        }
        agoObj.done = false;
        agoObj.sec = THIS.roundOf((diffDate % minute)/(second));
        agoObj.min = THIS.roundOf((diffDate % hour)/(minute));
        agoObj.hour = THIS.roundOf((diffDate % day)/(hour));
        agoObj.day = THIS.roundOf(diffDate/day);
        return agoObj;

    }
    THIS.roundOf = function(num){
        var rounded = Math.floor(num);
        return rounded > 9 ? rounded :"0"+rounded;
    }
    THIS.initalRender = function(){
        THIS.setLocalObj();
        THIS.initCountDown();
    }
    THIS.initDate = function(){
        DOM.datetimepicker.datetimepicker({
            dayViewHeaderFormat: 'MMMM YYYY' ,
            keepInvalid:true,
            minDate: moment()
        });
        $('#datetimepicker1 input').on('focus',function() {
            $('#datetimepicker1').data("DateTimePicker").show();
        });
        // $("#datetimepicker1").on("dp.change", function(e) {
        //     alert('hey');
        // });
    }




    return {
        init : function(){
            THIS.initDate();
            THIS.trackEmptyFields();
            THIS.EnableOverlay();
            THIS.SubmitForm();
            THIS.initalRender();
        }
    }
}

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        try {

            
            var timeDate = new TimeDate();
            timeDate.init();
            var countDown = new CountDown();
            countDown.init();

            
        } catch (error) {
            console.log(error);
        }

    })
})();