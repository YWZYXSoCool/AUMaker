const temple = new Image();
temple.src = "./image/模板.png";

const soul = new Image();
soul.src = "./image/red.png";

const option = {
    fight: {
        x: 32,
        y: 432,
        url_0: './image/fight_0.png',
        url_1: './image/fight_1.png',
    },

    act: {
        x: 184,
        y: 432,
        url_0: './image/act_0.png',
        url_1: './image/act_1.png',
    },

    item: {
        x: 344,
        y: 432,
        url_0: './image/item_0.png',
        url_1: './image/item_1.png',
    },

    mercy: {
        x: 496,
        y: 432,
        url_0: './image/mercy_0.png',
        url_1: './image/mercy_1.png',
    }
}

//FB : FightBox战斗框
const FB = {
    x: 320,
    y: 240,
    width: 100,
    height: 100,
    stroke: 4
};

const FIGHTER_INFO = {
    PLAYER: {
        hp: 1,
        hp_image: './image/HP.png',
        maxHp: 92,
        lv: 19,
        KR: 92,
        KR_color: '#ff00ff',
        KR_image: './image/KR.png',
        SOUL: {
            x: 320,
            y: 240
        },
        playerName: "chara",
    },
    MONSTER_0: {

    },
}

let round = 0;
let totalRound = 0;

let downKeys = [];

let data;

window.onload = function () {
    const canvas = document.getElementById('Main');
    const ctx = canvas.getContext('2d');

    ReadConfigFile();
    ChangeChoiceList();
    SyncData();

    Update(ctx);
}

function ReadConfigFile() {
    data = $.parseJSON($.ajax({
        url: "./config/index.json",//json文件位置，文件名
        dataType: "json", //返回数据格式为json
        async: false
    }).responseText);
}

function SyncData() {
    for (let element in data.option) {
        option[element] = data.option[element];
        console.log(option[element]);
    }
}

function ChangeChoiceList() {
    $('#ChoiceList').children().remove();

    for (let element in data.option) {
        let context =
            element +
            ' 未选中: ' + data.option[element].url_0 +
            ' 选中时: ' + data.option[element].url_1 +
            ' 初始x: ' + data.option[element].x +
            ' 初始y: ' + data.option[element].y

        $('#ChoiceList').append('<li>' + context + '</li>');
    }
}

function AddNewChoice() {
    ReadConfigFile();

    let ChoiceName = prompt("输入选项名字:", "");
    let ChoiceUrl_0 = prompt("输入未选中选项时的图片url:", "");
    let ChoiceUrl_1 = prompt("输入选中选项时的图片url:", "");
    let ChoiceX = prompt("输入选项初始X:", "");
    let ChoiceY = prompt("输入选项初始Y:", "");

    if (
        ChoiceName != "" &&
        ChoiceUrl_0 != "" &&
        ChoiceUrl_1 != "" &&
        ChoiceX != "" &&
        ChoiceY != ""
    ) {
        data['option'][ChoiceName] = {
            x: parseInt(ChoiceX),
            y: parseInt(ChoiceY),
            url_0: ChoiceUrl_0,
            url_1: ChoiceUrl_1
        }

        ChangeChoiceList();
        SyncData();

        $.ajax({
            url: "http://localhost:8090/SaveJson",      //请求接口的地址
            type: "GET",                                   //请求的方法GET/POST
            data: {                                        //需要传递的参数
                context: data
            },
            success: function (res) {                      //请求成功后的操作
                console.log(res);                          //在控制台输出返回结果
            },
            error: function (err) {                       //请求失败后的操作
                console.log(err);                          //请求失败在控制台输出22
            }
        })
    }
}

function SaveJSON() {
    let a = JSON.stringify(data);

    var fs = require();
    fs.writeFile('./config/index.json', a);
}

function Update(ctx) {
    ctx.clearRect(0, 0, 640, 480);

    ctx.globalAlpha = 0.5;
    ctx.drawImage(temple, 0, 0, 640, 480);
    ctx.globalAlpha = 1;
    DrawFB(ctx);
    DrawPlayerHP(ctx);
    DrawSoul(ctx);
    DrawOption(ctx);
    DrawPlayerInfo(ctx);

    if (FIGHTER_INFO.PLAYER.KR != FIGHTER_INFO.PLAYER.hp)
        FIGHTER_INFO.PLAYER.KR -= 1;

    if (round == 0) {
        PlayerRoundEvent();
    } else {
        MonsterRoundEvent();
    }

    if (downKeys.indexOf('ArrowRight') > -1) FIGHTER_INFO.PLAYER.SOUL.x += 4;
    if (downKeys.indexOf('ArrowLeft') > -1) FIGHTER_INFO.PLAYER.SOUL.x -= 4;
    if (downKeys.indexOf('ArrowDown') > -1) FIGHTER_INFO.PLAYER.SOUL.y += 4;
    if (downKeys.indexOf('ArrowUp') > -1) FIGHTER_INFO.PLAYER.SOUL.y -= 4;

    requestAnimationFrame(function () {
        Update(ctx);
    });
}

function PlayerRoundEvent() {
    
}

function MonsterRoundEvent() {
    
}

window.addEventListener('keydown', e => {
    if (downKeys.indexOf(e.key) == -1) downKeys.push(e.key);
});

window.addEventListener('keyup', e => {
    downKeys.splice(e.key);
});

function DrawFB(ctx) {
    let BLACK = {
        x: FB.x - FB.stroke - 1,
        y: FB.y - FB.stroke - 1,
        width: FB.width + FB.stroke * 2 + 2,
        height: FB.height + FB.stroke * 2 + 2
    };

    let WHITE = {
        x: FB.x - 2,
        y: FB.y - 2,
        width: FB.width + 4,
        height: FB.height + 4
    };

    //绘制黑色部分
    ctx.fillStyle = '#000000';
    ctx.fillRect(BLACK.x, BLACK.y, BLACK.width, BLACK.height);

    //绘制白色描边部分
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = FB.stroke;
    ctx.strokeRect(WHITE.x, WHITE.y, WHITE.width, WHITE.height);

    BLACK = null;
    WHITE = null;
    p = null;
}

function DrawPlayerHP(ctx) {
    //红色底色 #bf0000 
    //黄色正常色 #ffff00
    //紫色KR #ff00ff

    ctx.fillStyle = '#bf0000';
    ctx.fillRect(256, 399, FIGHTER_INFO.PLAYER.maxHp * 1.2, 22);

    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(256, 399, FIGHTER_INFO.PLAYER.KR * 1.2, 22);

    ctx.fillStyle = '#ffff00';
    ctx.fillRect(256, 399, FIGHTER_INFO.PLAYER.hp * 1.2, 22);
}

function DrawPlayerInfo(ctx) {
    ctx.font = "24px 'MNC'";
    ctx.fillStyle = '#FFFFFF';

    ctx.fillText(
        FIGHTER_INFO.PLAYER.playerName +
        "   lv " +
        FIGHTER_INFO.PLAYER.lv,
        32,
        419
    );

    if (FIGHTER_INFO.PLAYER.KR != FIGHTER_INFO.PLAYER.hp) {
        ctx.fillStyle = '#ff00ff';
    }
    else { ctx.fillStyle = '#ffffff'; }

    ctx.fillText(
        FIGHTER_INFO.PLAYER.KR + " / " + FIGHTER_INFO.PLAYER.maxHp,
        256 + FIGHTER_INFO.PLAYER.maxHp + 68,
        417
    );

    let HP_sprite = new Image();
    HP_sprite.src = FIGHTER_INFO.PLAYER.hp_image;
    ctx.drawImage(HP_sprite, 224, 405);

    let KR_sprite = new Image();
    KR_sprite.src = FIGHTER_INFO.PLAYER.KR_image;
    ctx.drawImage(KR_sprite, 256 + FIGHTER_INFO.PLAYER.maxHp + 29, 405);
}

function DrawSoul(ctx) {
    let _soulX = FIGHTER_INFO.PLAYER.SOUL.x;
    let _soulY = FIGHTER_INFO.PLAYER.SOUL.y;

    ctx.drawImage(soul, _soulX, _soulY);
}

function DrawOption(ctx) {
    for (let element in option) {
        let _sprite = new Image();
        _sprite.src = option[element].url_0;
        ctx.drawImage(_sprite, option[element].x, option[element].y);
    }
}
