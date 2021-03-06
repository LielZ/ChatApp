//gonna use date next
var date = new Date();
//setting var to check if the user already chosed name and color
var set = false;
//array of random names if user don't pick a name
var randomNames = ["מים קופצים","פרעה","עץ מנגו מחייך","תפוז מעצבן","אנטיוכוס","בופי","משה","שמשון","דוק","זרובבל","תפוח","אגס","בננה","חומוס","דוד","שלמה","מוחמד","ישו","יזרעאל","מלכיאל","בוריטו","מר.תפודי","גברת תפודי","נזלת","חומוס","ספגטי","עגבנייה","חציל","מללפון","מיסטר נייס גאי","אבוקדו","תפוח אדמה","צ'יפס","שטריימל","בוטנים אמריקאים","666","שטן","מלאך","אריה","נמר","גויאבה","דג","ג'קי לוי","בובספוג","פטריק","סקווידוויד","קופיקו","שושנה","גר צדק","גלדיאטור","אביר","חתול","חתולה","דר.סוס","נמלה","אנטילופה","עמוד חשמל","שיניים תותבות","ידית","פסטה","אדון שוקו","גלגל ירוק","מוכר אוגרים","דילר","קופסת הפתעות","אזדרכת","עז"];
//get the url that the client used to connect the server
var url = window.location.href;
//loading message sound file
var newMsgAudio = new Audio('/audio/definite.mp3');
var clickAudio = new Audio('/audio/click.mp3');
//setting the name because if user typs it's will not show undefined
var name = "ללא שם";
//setting color at top for scope(to use in all this file)
var color;
//if user replay on message the data of the message will saved here
var replayData = "";
//array of names of typers
var typers = [];
//YouTubeAPI link
var ytLink = '';
//setting function to send system messages
var systemMsg = (msg, rt) => {
    socket.emit('sysmsg', msg , rt);
}
var names = [];
var nindex = 2;
var getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
var colors = {
    'כחול': '0000ff',
    'אדום': 'ff0000',
    'צהוב': 'ffff00',
    'ירוק': '008000',
    'ליים': '00ff00',
    'סגול': '800080',
    'שחור': '000000',
    'לבן': 'ffffff',
    "מגנטה": 'ff00ff',
    'כתום': 'ffa500',
    'אפור': '808080',
    'תכלת': '3399ff',
    'זהב': 'ffd700',
    'כסף': 'c0c0c0',
    'חום': 'a52a2a'
};
var getPosition = (string, subString, index) => {
    return string.split(subString, index).join(subString).length;
}
// initializing socket, connection to server
var socket = io.connect(url);
systemMsg(`כל ההודעות נמחקות אחרי רענון הדף`);
systemMsg(`שליחת תמונות אפשרית על ידי קישורים, <br> אם תרצה/י להעלות תמונה משלך השתמש/י באתר כמו <a href="http://www.interload.co.il/" target="_blank">זה</a> ,כדי להעלות תמונה ולקבל קישור. <b><br>סימני קודים:<br> </b>#תמונת טקסט {עוד: #טקסט=צהוב+כחול - רקע צהוב טקסט כחול}<br>כדי לשלוח תמונה רנדומלית:<br>@<br>כדי לחפש תמונה:<br>@מלל חיפוש<br>כדי לשלוח הודעה פרטית למישהו מסויים או כמה,<br> ניתן לכתוב בשורת ההודעות:<br>(שם של האדם הראשון,עוד שם)הודעה פה<br>כדי לשלוח הודעה לכול חוץ מאדם מסויים או כמה,<br> ניתן להשתמש בנוסח הבא:<br>[שם,עוד שם]הודעה<br>ניתן לרשום בסוגריים רק שם אחד או להוסיף כמה שרוצים.`,true);
socket.on("connect", data => {
  socket.emit("join",url);
});
if ($(window).width() < 340) {
    //remove text and show only icon on button on small screens
    $('#send').html('<i class="fa fa-send"></i>');
}
//load name that existed since the server started
socket.on('nameList', nameList => {
    names = nameList;
});
//system message function
socket.on("sendsys", (msg , rtl) => {
 if (rtl) {
  $("#thread").append(`<li dir="rtl"><span class="system">מערכת</span><br>${msg}<br> <span style="font-size: 10px;">${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</span> </li>`);
 } else {
  $("#thread").append(`<li dir="ltr"><span class="system">מערכת</span><br>${msg}<br> <span style="font-size: 10px;">${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</span> </li>`);
 }
});
function isEven(n) {
    return n % 2 == 0;
 }
 
 function isOdd(n) {
    return Math.abs(n % 2) == 1;
 }
//update user connected count from the server
socket.on("updateCount",  usco => {
    $("#uc").text(Math.floor(usco / 2) + "~");
});

//get volume and play message sound
socket.on('sound',  vol => {
 newMsgAudio.volume = vol;
 newMsgAudio.play();
});

//function that verify url and make from it a link
var urlify = text => {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, url => {
        return `<a target="_blank" rel="noopener noreferrer" href="${url}">${url.replace("http://","").replace("https://","").replace(/\/$/,"")}</a>`;
    })
}
socket.on('upVid', link => {
    ytLink = link;
});
var youtubeVideoId = '00000000000';
var youtubeVideoTitle = 'NULL';
/*socket.on('upIdT' , (id,title) => {
    console.log(`ID: ${id} | Title: ${title}`);
    youtubeVideoId = id;
    youtubeVideoTitle = title;
});*/
// listener for 'thread' event, which updates messages
socket.on("thread", (color, name, msg, rtl, type, you, msgid, replayData,tocopy,tit,id) => {
    if (type == 'ifr' && id !== null) {
        msg = `<h1>${tit}</h1><br><iframe value="${id}}" class="video w100" width="640" height="360" src="//www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`;
        type = 'code';
    }
    //update date
    date = new Date();
    //prevent xss
    if (type !== 'code') {
      msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    //if message is url
    if(type == "url") {
        rtl = false;
        msg = `<a target="_blank" rel="noopener noreferrer" href="${msg}">${msg.replace("http://","").replace("https://","").replace(/\/$/,"")}</a>`;//<br><iframe src="${msg}"></iframe>
    }
    //if message is img
    if(type == "img") {
        rtl = false;
        msg = `<div class="imgbox"><img id="img-${msgid}" class="center-fit" src="${msg}"></div>`;
    }
    if(!rtl) {
        var str = 'dir="ltr"';
    } else {
        var str = 'dir="rtl"';
    }
    //diffrent between your message to other's
    if(!you) {
        var trash = "";
        var replayBtn = `<button id="replay-btn-(${msgid}" onClick="replay(${msgid})" class="replay-btn"><i class="fa fa-reply"></i></button>`
        var likeBtn = `<div id="cont-like-${msgid}"><button id="like-btn-${msgid}" onClick="like(${msgid})" class="like-btn"><i class="fa fa-heart"></i> <span id="count-${msgid}">0</span></button></div>`;
    } else {
        var trash = `<button class="trash-btn" onClick="deleteMsg(${msgid})"><i class="fa fa-trash"></i></button>`;
        var likeBtn = `<p class="p-like"><i class="fa fa-heart"></i> <span id="count-${msgid}">0</span></p>`;
        var replayBtn = "";
    }
    //if message type is text
    if(type == "msg") {
        //checks for urls in message and convert them to links
        msg = urlify(msg);
        //bold text
        var asterisks = msg.match(/\*([^\s*](?:(?: \* |[^*])+[^\s*])?)\*/gm);
        if (asterisks !== null) {
            if (asterisks.length > 0) {
                for (let i = 0; i < asterisks.length; i++) {
                    msg = msg.replace(`${asterisks[i]}`,`<b>${asterisks[i].substring(1,asterisks[i].length - 1)}</b>`);
                }
            }
        }
        //if name of a color in message
        for (let i = 0; i < Object.keys(colors).length; i++) {
            if (msg.includes(Object.keys(colors)[i])) {
                let re = new RegExp(Object.keys(colors)[i], "g");
                msg = msg.replace(re,`<span style="color: #${Object.values(colors)[i]}">${Object.keys(colors)[i]}</span>`);
            }
        }
        //צבע מזמן צבע רנדומלי לגמרי ואקראי מהרשימה של השמות של הצבעים
        //give random to color
        var ckw = 'אקראי';
        var re = new RegExp(ckw, "g");
            var i = 0, rndm = Math.floor((Math.random() * Object.keys(colors).length) + 0),
                str = "This is a simple string to test regex.",
            // result holds the resulting string after modification
            // by String.prototype.replace(); here we use the
            // anonymous callback function, with Arrow function
            // syntax, and return the match (the 's' character)
            // along with the index of that found character:
            result = msg.replace(re, (match) => {
                rndm = rndm = Math.floor((Math.random() * Object.keys(colors).length) + 0);
                return `<span style="color: #${Object.values(colors)[Number(rndm)]}">${ckw}</span>`;
            });
            msg = result;
        //give random to colors
        ckw = 'צבעים';
        re = new RegExp(ckw, "g");
        i = 0, rndm = Math.floor((Math.random() * Object.keys(colors).length) + 0),
        str = "This is a simple string to test regex.",
        result = msg.replace(re, (match) => {
            var str = ckw;
            var split = str.split(""); //Split out every char
            var recombinedStr = "";
            var count = 0;
            for(let i = 0; i < split.length; i++) {
                rndm = rndm = Math.floor((Math.random() * Object.keys(colors).length) + 0);
                recombinedStr += `<span style="color: #${Object.values(colors)[Number(rndm)]}">${split[i]}</span>`;
                count++;
            }
            console.log(recombinedStr);
            return recombinedStr;
        });
        msg = result;
        //give random to color
        ckw = 'צבע';
        re = new RegExp(ckw, "g");
            i = 0, rndm = getRandomColor(),
                str = "This is a simple string to test regex.",
            result = msg.replace(re, (match) => {
                rndm = getRandomColor();
                return `<span style="color: ${rndm}">${ckw}</span>`;
            });
            msg = result;
    }
    //set copy button
    //TODO: fix the bug when enterted ' and `
    if (tocopy.includes("'")) {
        tocopy = tocopy.replace(/"/,'&#34;').replace(/`/,'&#96;').replace(/'/,'&#39;');
        var copy = `<button class="copy" onClick="copy(${msgid},${'`'+tocopy+'`'})"><i class="fa fa-copy"></i></button>`;
    } else {
        tocopy = tocopy.replace(/"/,'&#34;').replace(/`/,'&#96;');
        var copy = `<button class="copy" onClick="copy(${msgid},'${tocopy}')"><i class="fa fa-copy"></i></button>`;
    }
    //adding the message to the user view
    $("#thread").append(`<li id="${msgid}">${replayData}<span id="name-span-${msgid}" class="names" style="color: ${color};">${name}</span><br><span id="msg-span-${msgid}" ${str}>${msg}</span><br><span style="font-size: 10px;">${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</span>${likeBtn+trash+replayBtn+copy}</li>`);
    //scroll the view down the page
    document.getElementById('end').scrollIntoView();
    //resets the replay data
    replayData = "";
});
var replay = mId => {
	var nam = $('#name-span-'+mId).text();
	var namClr = $('#name-span-'+mId).css('color');
	var msgTxt = $('#msg-span-'+mId).html();
    /*if (msgTxt.includes('img')) {
        var regex = /<img id="img-" src='(.*?)'/;
        var src = regex.exec(msgTxt)[1];
        var img = document.getElementById('img-'+mId);
            if (img.src === src) {
                console.log("Same image");
            } else {
                console.log("Diffrent image");
            }
    }*/
    msgTxt = msgTxt.replace('center-fit','rpcn');
    
	replayData = `<div style="height:5px;font-size:1px;">&nbsp;</div><div class="replay-div"><span class="names" style="color: ${namClr};">${nam}</span><br>${msgTxt}<div style="height:2px;font-size:1px;">&nbsp;</div></div>`;
}
var copy = (mId,str) => {
    // Create new element
    String(str);
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
    return mId;
}
var deleteMsg = mId => {
	socket.emit("trash",mId);
}
var like = mId => {
	socket.emit("like",mId);
}
socket.on('delThis', messId => {
	$('#'+messId).remove();
});
socket.on('likePu', messId => {
	var count = Number(document.getElementById("count-"+messId).innerHTML);
	count = count + 1;
	$('#count-'+messId).text(String(count));
});
socket.on('likePr', messId => {
	var count = Number(document.getElementById("count-"+messId).innerHTML);
	$('#cont-like-'+messId).replaceWith(`<p class="p-like"><i class="fa fa-heart"></i> <span id="count-${messId}">${count}</span></p>`);
});
socket.on('replay',replay = mId => {
	var nam = $('#name-span-'+mId).text();
	var namClr = $('#name-span-'+mId).css('color');
	var msgTxt = $('#msg-span-'+mId).html();
    /*if (msgTxt.includes('img')) {
        var regex = /<img id="img-" src='(.*?)'/;
        var src = regex.exec(msgTxt)[1];
        var img = document.getElementById('img-'+mId);
            if (img.src === src) {
                console.log("Same image");
            } else {
                console.log("Diffrent image");
            }
    }*/
    msgTxt = msgTxt.replace('center-fit','rpcn');
    
	replayData = `<div style="height:5px;font-size:1px;">&nbsp;</div><div class="replay-div"><span class="names" style="color: ${namClr};">${nam}</span><br>${msgTxt}<div style="height:2px;font-size:1px;">&nbsp;</div></div>`;
    socket.emit('upReplay', replayData);
});
socket.on('type', name => {
	typers.push(name);
	var theTypes = typers.join(', ');
	$('#typing').text(` ,${theTypes} מקליד/ה...`);
});

socket.on('stype', name => {
	typers.splice(typers.indexOf(name),1);
	if (typers.length <= 0) {
		$('#typing').text(' .');
	} else {
		var theTypes = typers.join(', ');
		$('#typing').text(` ,${theTypes} מקליד/ה...`);
	}
});

// sends message to server, resets & prevents default form action
socket.on('upNindex', i => {

    nindex = i;
});
var msgVal = $("#message").val();
var msgArr = ['#ברוך הבא !=3399ff+000099'];
var msgI = 0;

var typing = false;
var timeout = undefined;

var timeoutFunction = () => {
  typing = false;
  socket.emit('stopType',name);
}
//פונקציה כדאי לעשות רעש של קליקים שמקלידים
var playP = (p,e) => {
    //youtube api
    /*if (e !== 107) {
        e.preventDefault();
        //prepare the request
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent(msgVal.replace(/%20/g), "+"),
            maxResult: 7,
            order: "viewCount",
            publishedAfter: "2015-01-01T"

        });
    }*/
    var audio = document.getElementById('clickP');
    audio.volume = 0.5;
    if (audio.paused) {
        audio.play();
    } else if (audio.currentTime <= 0.1) {
        audio.currentTime = 0.2;
        audio.play();
    } else if (audio.currentTime >= 0.2) {
        audio.currentTime = 0.1;
        audio.play();
    }
}
    //כאשר נלחץ אות
    $("#message").keyup(e => {
        //ניגון צליל הקלדה
        playP(clickAudio,e);

        var msgVal = $("#message").val();
        var msgColr = document.getElementById("message");
        if (msgVal.startsWith('+') && msgVal.length == 1) {
            $('#youtube').css('width: 100% !important; height: 50% !important;)');
            $('#youtube').html(`<iframe class="ui-widget-content" style="width: 100% !important; height: 50% !important; resize: vertical;" src="${url}youtube" frameborder="0" allowfullscreen></iframe>`);
        } else {
            $('#youtube').css('width: 0 !important; height: 0 !important;)');
            $('#youtube').empty();
        }
        if (msgVal.startsWith('[') || msgVal.startsWith('(')) {
            if (msgVal.endsWith(')') || msgVal.endsWith(']')){
                $(msgColr).css({"background-color":"Black"});
                $(msgColr).css({"color":"Lime"});
                if (msgVal.startsWith('(')) {
                    var mayName = msgVal.split('(').pop().split(')')[0];
                    mayName = mayName.split(/\s+/);
                    var array = mayName.filter(function (el) {
                        return el != null;
                    });
                    socket.emit('saveName',null);
                    if (!mayName.includes(null)) {
                        $(msgColr).css({"background-color":"RoyalBlue"});
                        $(msgColr).css({"color":"white"});
                    } else {
                        $(msgColr).css({"background-color":"black"});
                        $(msgColr).css({"color":"white"});
                    }
                    console.log(names);
                    console.log(mayName);    
                    if (mayName.length >= 0) {
                        for (var i = 0; i < names.length; i++) {
                            let re = new RegExp(names[i], "g");
                            let match = msgVal.match(re);
                        }
                    }
                  } else if (msgVal.startsWith('[')) {
                    var mayName = msgVal.split('[').pop().split(']')[0];
                    mayName = mayName.split(/\s+/);
                    array = mayName.filter(function (el) {
                        return el != null;
                    });
                    socket.emit('saveName',null);
                    if (!mayName.includes(null)) {
                        $(msgColr).css({"background-color":"RoyalBlue"});
                        $(msgColr).css({"color":"white"});
                    } else {
                        $(msgColr).css({"background-color":"black"});
                        $(msgColr).css({"color":"white"});
                    }
                    console.log(names);
                    console.log(mayName);    
                    if (mayName.length >= 0) {
                        for (var i = 0; i < names.length; i++) {
                            let re = new RegExp(names[i], "g");
                            let match = msgVal.match(re);
                        }
                    }
                }
            }
            $(msgColr).css({"background-color":"black"});
            $(msgColr).css({"color":"white"});
        } else if (msgVal.startsWith('#') || msgVal.startsWith('+') || msgVal.startsWith('@')) {
            $(msgColr).css({"background-color":"black"});
            $(msgColr).css({"color":"white"});
        } else if (msgVal.startsWith('http://') || msgVal.startsWith('https://')) {
            $(msgColr).css({"background-color":"RoyalBlue"});
            $(msgColr).css({"color":"white"});
        } else {
            $(msgColr).css({"background-color":"gainsboro"});
            $(msgColr).css({"color":"darkblue"});
        }
        //ביטול המקליד/ה... כאשר פרטי
        if(typing == false && !msgVal.startsWith('[') && !msgVal.startsWith('(')) {
            typing = true;
            socket.emit('typing',name);
            timeout = setTimeout(timeoutFunction, 1000);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 200);
        }
        if (e.keyCode == 13) {//enter
            sendMsg();
            //$('#message').val(msgVal + '<br>');
        }
        //מאפשר לעלות ולרדת עם החצים כדי לטעון הודעות קודמות
        if (e.keyCode == 40) {//down
            if (msgI >= 0 && msgArr.length >= msgI) {
                $("#message").val(msgArr[msgI]);
                console.log("Index "+msgI);
                msgI--;
            } else {
                msgI = msgArr.length - 1;
                $("#message").val(msgArr[msgI]);
                console.log("Index "+msgI);
                msgI--;
            }
        } else if (e.keyCode == 38) {//up
            if (msgI >= 0 && msgArr.length > msgI) {
                $("#message").val(msgArr[msgI]);
                console.log("Index "+msgI);
                msgI++;
            } else {
                msgI = 0;
                $("#message").val(msgArr[msgI]);
                console.log("Index "+msgI);
                msgI++;
            }
        }
    });
var sendMsg = () => {
    if (!set) {
            name = $("#name").val();
        if (name.length > 25) {
            name = name.substring(0, 25);
            alert('שם ארוך מידי !');
        }
        if ( name == "" || !name.replace(/\s/g, '').length) {
        name = randomNames[Math.floor(Math.random()*randomNames.length)];
        $("#name").text(name);
        }
        if (names.indexOf(name) > -1) {
        console.log('this name is already exist');
        socket.emit('updateI');
        name = name + String(nindex);
        console.log('yournew name');
        }
        name = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if($("#color").val() == "#e6ffff") {
        color = getRandomColor();
        } else {
        color = $("#color").val();
        }
        socket.emit('saveName',name);
    }
    var message = $("#message").val();
    var msgVal = document.getElementById("message").value;
    if (!msgArr.length == 0 && !msgVal.includes('#ברוך הבא !=3399ff+000099')) {    
        msgArr.push(String(msgVal));
        console.table(msgArr);
        msgI = msgArr.length;
        console.log('i: '+msgI);
    }
    if (message == "" || !message.replace(/\s/g, '').length) {
        alert("אין לשלוח הודעה ריקה");
        return false;
    } else {
        socket.emit('messages',color ,name ,message,replayData);
        $("#message").val('');
        replayData = "";
    }
    console.log(date.getHours()+''+date.getMinutes());
    var expendedMinutes = expendedTime(date.getMinutes());
    var expendedHours = expendedTime(date.getHours());
    var time = expendedHours +''+ expendedMinutes
    console.log(time);
    if (!set) {
        if (time >= 500 && time <= 1200) {
         systemMsg(`בוקר טוב ${name} !` , true);
        } else if (time >= 1200 && time <= 1700) {
         systemMsg(`צהריים טובים ${name} !`, true);
        } else if (time >= 1700 && time <= 2100) {
         systemMsg(`ערב טוב ${name} !`,  true);
        } else if (time >= 2100 || time >= 0 && time <= 100) {
         systemMsg(`ערב-לילה טוב ${name} !`, true);
        } else if (time >= 100 && time <= 500) {
         systemMsg(`ליל מנוחה ${name} !`, true);
        }
    }
    if (!set) {
        $("#name").remove();
        $("#color").remove();
        $("#send").css("cssText",`width: -webkit-calc(30% - 10px) !important; width: -moz-calc(30% - 10px) !important; width: calc(30% - 10px) !important;`);
        $("#message").css("cssText",'width: -webkit-calc(70% - 10px) !important; width: -moz-calc(70% - 10px) !important; width: calc(70% - 10px) !important;');
        set = true;
    }
}
socket.on();
$("#send").click(() => {
    var msgStr = $("#message").val();
    if (msgStr.startsWith('+') && msgStr.length > 1 && msgStr.includes('=')) {
        var vId,vTit;
        vId = msgStr.substring(msgStr.indexOf("=") + 1, msgStr.length);
        vTit = msgStr.substring(msgStr.indexOf("+") + 1, msgStr.indexOf("="));
        youtubeVideoId = vTit ;
        youtubeVideoTitle = vId;
    } else {
        sendMsg();
    }
});
var expendedTime = num => {
    num = String(num);
    if(num.length == 1) {
        num = '0' + num;
    }
    return num;
}