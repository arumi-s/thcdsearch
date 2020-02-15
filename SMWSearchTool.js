(function () {

/** SMW搜索表单脚本 **/

/** 同音CD搜索表格 by 囧仙 **/

/** 同音CD搜索脚本 by 桜有海 **/

if ( $('div#OptInputs').length == 0 ) return;
$('#useNotice').remove();

if ( $ == null ) alert( '无法加载jQuery，请重新整理页面' ); // 检查jQuery

/** 开始 **/


/** 参数配置 **/

var Conf = { // 设定主要参数
	'Api' : 'https://thwiki.cc/api.php', // 搜寻器Api根地址
	'SApi' : 'https://thwiki.cc/ajax.php', // 输入建议Api根地址
	'CommonLimit' : 12, // 设定常用项目列表内最大项目数量
	'Sort' : [ 'a', 'd' ], // 设定允许的排序值
	'Currency' : [ '日元', '人民币', '韩圆', '新台币', '港币', '美元', '港元', '英镑', '波兰兹罗提' ], // 设定可选取的货币列表
	'NoOption' : '请定义至少一个筛选条件', // 设定没有提交任何合法搜索条件时的提示文字
	'NoConnect' : '连接出错', // 设定链接Api出错时的提示文字
	'NoResult' : '请检查是否输入了多余的字符或是使用了未实装的条件，仍然不行的话可以试试减少搜索条件', // 设定搜索结果为空时的提示文字
	'SidebarSpeed' : 300, // 设定侧选项栏显示隐藏速度
	'Speed' : 400, // 设定输入栏显示隐藏速度
};

var OutputConf = [ // 设定各类查询结果允许的属性
	[ '专辑', [
		'event',
		'circle',
		'date',
		'year',
		'rate',
		'number',
		'disc',
		'track',
		'time',
		'property',
		'style',
		'only',
		'price',
		'eventprice',
		'shopprice',
		'cover',
		'coverchar'
	], [
		'alname',
		'event',
		'circle',
		'date',
		'time',
		'track',
		'number',
		'cover'
	] ],
	[ '曲目', [
		'circle',
		'type',
		'time',
		'ogmusic',
		'ogmusicno',
		'noth',
		'ogwork',
		'ogworkno',
		'original',
		'arrange',
		'vocal',
		'lyric',
		'compose',
		'script',
		'dub',
	], [
		'alname',
		'name',
		'circle',
		'time',
		'arrange',
		'vocal',
		'lyric',
		'ogmusic',
		'discno',
		'trackno',
		'ogwork',
		'cover'
	] ],
	[ '社团', [
		'region',
		'establish',
		'work',
		'state',
	], [
		'region',
		'establish',
		'work',
		'state',
	] ],
];

var OptionConf = { // 设定属性对应的类
// 设定类型为范围的属性
	'establish' : 'Range',
	'year' : 'Range',
	'disc' : 'Range',
	'track' : 'Range',
	'ogmusicno' : 'Range',
	'ogworkno' : 'Range',

// 设定类型为允许多值的属性
	'event' : 'Mltor',
	'circle' : 'Mltor',
	'number' : 'Mltor',
	'ogmusic' : 'Mltor',
	'ogwork' : 'Mltor',
	'style' : 'Mltor',
	'arrange' : 'Mltor',
	'vocal' : 'Mltor',
	'lyric' : 'Mltor',
	'compose' : 'Mltor',
	'script' : 'Mltor',
	'dub' : 'Mltor',
	'coverchar' : 'Mltor',

// 设定类型为允许非的属性
	'region' : 'Sgnot',
	'work' : 'Sgnot',
	'state' : 'Sgnot',
	'property' : 'Sgnot',
	'rate' : 'Sgnot',
	'only' : 'Sgnot',
	'type' : 'Sgnot',
	'noth' : 'Sgnot',
	'original' : 'Sgnot',

// 设定类型为价格的属性
	'price' : 'Price',
	'eventprice' : 'Price',
	'shopprice' : 'Price',

// 设定类型为时间范围的属性
	'date' : 'Durat',
	'time' : 'Durat',
};

var InputConf = { // 设定属性的输入框内容
// 设定类型为范围的属性
	'establish' : [ 1970, '2012', 2020, '2015' ],
	'year' : [ 1996, '2012', 2020, '2015' ],
	'disc' : [ 1, '1', 99, '2' ],
	'track' : [ 1, '6', 500, '12' ],
	'ogmusicno' : [ 1, '1', 500, '6' ],
	'ogworkno' : [ 1, '1', 500, '6' ],

// 设定类型为允许多值的属性
	'event' : false,
	'circle' : false,
	'number' : false,
	'ogmusic' : false,
	'ogwork' : false,
	'style' : false,
	'arrange' : false,
	'vocal' : false,
	'lyric' : false,
	'compose' : false,
	'script' : false,
	'dub' : false,
	'coverchar' : false,

// 设定类型为允许非的属性
	'region' : [ false, '日本', '中国', '韩国', '台湾', '美国', '英国', '德国', '澳大利亚' ],
	'work' : [ false, '同人音乐', '同人游戏', '同人志', '同人动画', '周边', '其他' ],
	'state' : [ false, '活动', '休止', '解散' ],
	'property' : [ false, '单曲', 'Demo', '合作', '精选集', 'B面', '盒装', 'Live', '混音集', '原声集', '印象集' ],
	'rate' : [ false, 'R18', 'R15', '一般向' ],
	'only' : { 'type' : 'text', 'placeholder' : '东方红魔乡' },
	'type' : [ false, 'Arrange', 'Vocal', '再编曲', '翻唱', '配音', '合唱', '纯东方', '混合' ],
	'noth' : [ false, '非东方' ],
	'original' : [ false, '原创' ],

// 设定类型为价格的属性
	'price' : false,
	'eventprice' : false,
	'shopprice' : false,

// 设定类型为时间范围的属性
	'date' : [
		{ 'type' : 'date', 'placeholder' : '2009-01-01' },
		{ 'type' : 'date', 'placeholder' : '2010-01-01' }
	],
	'time' : [
		{ 'type' : 'text', 'class' : 'Duration', 'maxlength' : '12', 'placeholder' : '20:00' },
		{ 'type' : 'text', 'class' : 'Duration', 'maxlength' : '12', 'placeholder' : '40:00' }
	],
}

var PropList = [ // 设定所有可作为输出的属性，必须与服务器端一致
	'event',
	'circle',
	'date',
	'year',
	'rate',
	'number',
	'disc',
	'track',
	'time',
	'property',
	'style',
	'only',
	'price',
	'eventprice',
	'shopprice',
	'type',
	'ogmusic',
	'ogmusicno',
	'noth',
	'ogwork',
	'ogworkno',
	'original',
	'arrange',
	'vocal',
	'lyric',
	'compose',
	'script',
	'dub',
	'perform',
	'alname',
	'name',
	'discno',
	'trackno',
	'region',
	'establish',
	'work',
	'state',
	'cover',
	'coverchar'
];

var SuggestionConf = { // 设定属性建议列表对应的映射方案名称
	'circle' : '制作方建议',
	'event' : '发售展会建议',
	'style' : '风格类型建议',
	'ogmusic' : '曲目原曲建议',
	'ogwork' : '曲目来源建议',
	'arrange' : '编曲建议',
	'lyric' : '作词建议',
	'compose' : '作曲建议',
	'script' : '剧本建议',
	'vocal' : '演唱建议',
	'dub' : '配音建议',
	'coverchar' : '封面角色建议',
};

var CommonConf = { // 设定常用项目列表预设计数
	'circle' : 6,
	'ogmusic' : 6,
	'arrange' : 5,
	'vocal' : 5,
	'event' : 3,
	'time' : 3,
	'coverchar': 4,
	'type' : 1,
	'property' : 1
};

var SwitchConf = { // 设定转换按钮的内容
	'modeval' : [
		[ '与条件', 'AND', '或条件', '输入多值时套用 与条件 （搜索包含全部值的项目）' ],
		[ '或条件', 'OR', '非条件', '输入多值时套用 或条件 （搜索包含任一值的项目）' ],
		[ '非条件', 'N', '与条件', '输入多值时只有首项有效' ]
	],
	'sortval' : [ [ '不排序', '', '降序' ], [ '降序', 'd', '升序' ], [ '升序', 'a', '不排序' ] ],
	'notval' : [
		[ '含条件', '', '非条件', '搜索含有此值的项目' ],
		[ '非条件', 'N', '含条件', '搜索不含此值的项目' ]
	],
	'rangeval' : [ [ '到', 'TO', '加减' ], [ '加减', 'PM', '到' ] ],
}

var ItemConf = [ // 设定各类查询结果显示属性名称
{
	'region' : '社团地区',
	'establish' : '社团成立',
	'work' : '社团作品',
	'state' : '社团状态',
	//'event' : '首发展会',
	//'date' : '首发日期',
	'year' : '发布年份',
	'number' : '专辑编号',
	'circle' : '制作社团',
	'price' : '发售价格',
	'eventprice' : '会场售价',
	'shopprice' : '通贩售价',
	'disc' : '碟数',
	'track' : '音轨数',
	//'time' : '总时长',
	'property' : '专辑属性',
	'rate' : '分级指定',
	'only' : '特定选材',
	'style' : '风格类型',
	'type' : '曲目类型',
	'ogmusic' : '曲目原曲',
	'ogwork' : '曲目出处',
	'noth' : '含非东方',
	'original' : '含原创曲',
	'arrange' : '曲目编曲',
	'lyric' : '曲目作词',
	'compose' : '曲目作曲',
	'vocal' : '曲目演唱',
	'script' : '曲目剧本',
	'dub' : '曲目配音',
	'coverchar' : '封面角色'
},
{
	'region' : '社团地区',
	'establish' : '社团成立',
	'work' : '社团作品',
	'state' : '社团状态',
	'event' : '首发展会',
	'date' : '首发日期',
	'year' : '发布年份',
	'number' : '专辑编号',
	'circle' : '制作社团',
	'price' : '专辑价格',
	'eventprice' : '会场售价',
	'shopprice' : '通贩售价',
	'disc' : '专辑碟数',
	'track' : '专辑轨数',
	//'time' : '曲目时长',
	'property' : '专辑属性',
	'rate' : '专辑分级',
	'only' : '专辑选材',
	'style' : '专辑风格',
	'type' : '曲目类型',
	'ogmusic' : '使用原曲',
	'ogwork' : '原曲出处',
	'noth' : '非东方曲',
	'original' : '原创曲',
	'arrange' : '编曲',
	'lyric' : '作词',
	'compose' : '作曲',
	'vocal' : '演唱',
	'script' : '剧本',
	'dub' : '配音',
	'coverchar' : '封面角色'
},
{
	'region' : '所在地区',
	'establish' : '成立年份',
	'work' : '作品类别',
	'state' : '活动状态',
	'event' : '新谱展会',
	'date' : '新谱日期',
	'year' : '新谱年份',
	'number' : '专辑编号',
	'circle' : '合作社团',
	'price' : '专辑价格',
	'eventprice' : '会场售价',
	'shopprice' : '通贩售价',
	'disc' : '专辑碟数',
	'track' : '专辑轨数',
	'time' : '专辑时长',
	'property' : '专辑属性',
	'rate' : '专辑分级',
	'only' : '专辑选材',
	'style' : '专辑风格',
	'type' : '曲目类型',
	'ogmusic' : '曲目原曲',
	'ogwork' : '曲目出处',
	//'noth' : '非东方曲',
	//'original' : '原创曲',
	'arrange' : '曲目编曲',
	'lyric' : '曲目作词',
	'compose' : '曲目作曲',
	'vocal' : '曲目演唱',
	'script' : '曲目剧本',
	'dub' : '曲目配音',
	'coverchar' : '封面角色'
}
];

var JoinConf = { // 设定多值属性连接符
	'disc' : ',',
	'track' : ',',
	'time' : ',',
};

var DisplayConf = [ // 设定各类查询结果显示处理函数
	function ( outp, raw ) {
		return '<table class="ResultItem" cellpadding="4">'+
		'<tr><th class="head" colspan="3"><a href="http://thwiki.cc'+raw.link+'" target="_blank">'+raw.data.alname+'</a> '+
		'<span>'+(raw.data.time=='00:00'?'':'['+raw.data.time+'] ')+'('+(raw.data.event==''?'非展会':raw.data.event)+'@'+raw.data.date+')</span></th></tr>'+
		'<tr><td class="empt">'+(raw.data.cover?'<a href="http://thwiki.cc'+raw.link+'" target="_blank"><img src="'+$(raw.data.cover).html()+'" /></a>':raw.idno)+'</td><td class="info"><table class="list">'+outp+'</table></td><td class="more"></td></tr>'+
		'</table>';
	},
	function ( outp, raw ) {
		return '<table class="ResultItem" cellpadding="4">'+
		'<tr><th class="head" colspan="3"><a href="http://thwiki.cc'+raw.link+'" target="_blank">'+raw.data.name+'</a> '+
		'<span>'+(raw.data.time=='00:00'?'':'['+raw.data.time+'] ')+'('+raw.data.alname+'#'+raw.data.discno+'.'+raw.data.trackno+')</span></th></tr>'+
		'<tr><td class="empt">'+(raw.data.cover?'<a href="http://thwiki.cc'+raw.link+'" target="_blank"><img src="'+$(raw.data.cover).html()+'" /></a>':raw.idno)+'</td><td class="info"><table class="list">'+outp+'</table></td><td class="more"></td></tr>'+
		'</table>';
	},
	function ( outp, raw ) {
		return '<table class="ResultItem" cellpadding="4">'+
		'<tr><th class="head" colspan="3"><a href="http://thwiki.cc'+raw.link+'" target="_blank">'+raw.text+'</a></th></tr>'+
		'<tr><td class="empt">'+raw.idno+'</td><td class="info"><table class="list">'+outp+'</table></td><td class="more"></td></tr>'+
		'</table>';
	}
];

/** 主要函数 **/

function getData( mode ) { // 处理查询
	if ( ban ) return;
	ban = true;
	var req = new Request( mode );
	if ( !req.getQuery( $('div#OptInputs>table.OptSelected'), parseInt( $('#limitval').val() ) ) ) {
		alert( Conf['NoOption'] );
		ban = false;
	} else {
		if ( ( curResult = findResult( req ) ) != false ) curResult.dump(0);
		else {
			req.getTotal( function () {
				curResult = new Result( this );
				Resultlist.push( curResult );
				curResult.post();
			} );
		}
	}
}
function findResult ( req ){ // 检查是否已查询过的查询
	req = req.hash;
	for ( var i = 0, len = Resultlist.length; i < len; ++i ) if ( Resultlist[i].hash == req ) return Resultlist[i];
	return false;
}
function makeInputBox ( attr ) { // 创建输入框
	var text = '';
	for ( var a in attr ) text += ' ' + a + '="' + attr[a] + '"';
	return '<input' + text + ' />';
}
function makeSelectBox ( attr ) { // 创建下拉选单
	var text = '';
	for ( var a in attr ) text += attr[a] === false ? '<option value="">不限' : ( '<option>' + attr[a] );
	return '<select>' + text + '</select>';
}
function makeButtonBox ( attr ) { // 创建按钮
	return '<button class="' + attr + '"></button>';
}
function initInput () { // 初始化项目的输入框及事件
	$('#OptSubmit')
	.append( $('<input value="查询所需专辑" type="button" />').click( function () { getData(0); } ) )
	.append( $('<input value="查询所需曲目" type="button" />').click( function () { getData(1); } ) )
	.append( $('<input value="查询所需社团" type="button" />').click( function () { getData(2); } ) );
	$('#OptLimit').append('每页显示结果数：<select id="limitval"><option>25<option>50<option>100</select>');
	$('#blank td:nth-child(3)').hide().next().html( '新<br /><br /><br />增' ).click( function () {
		showSidebar();
		curInput = { 'name' : 'blank' };
		OptName.html( '' ).addClass( 'New' );
	} );

	CommonConf = getCommonCookie();

	for ( var k in OptionConf ) Inputlist[k] = newInput( k );

	var frame = $('#OptInputs');
	frame.find('input.Duration').on( 'input propertychange', function () {
		if ( /[^0-9:\.]/.test( $(this).val() ) ) $(this).val( $(this).val().replace( /[^0-9:\.]/g, ':' ) );
	} );
	frame = frame.find('button');
	for ( var k in SwitchConf ) {
		frame.filter( '.' + k ).setSwitch( SwitchConf[k] );
	}
	$(window).resize(function () {
		if ( curSuggestion ) curSuggestion.moveList();
	});

	getURLParam();
	updateInputSelect();
}
function updateInputSelect () { // 更新当前项目列表
	for ( var k in Inputlist ) {
		if ( Inputlist[k].sele == 0 ) {
			Inputlist[k].list.removeClass('OptSelected');
			Inputlist[k].tabl.removeClass('OptSelected');
		}
	}
	var curopt = $('#OptPage-selected');
	curopt.children('li[id]').remove();
	var form = $('div#OptInputs>table.OptSelected');
	for ( var l = 0, len = form.length, input; l < len; ++l ) {
		input = form.eq(l).data('returnSelf');
		if ( input == null ) {
			form.eq(l).removeClass('OptSelected');
			continue;
		}
		input.list.addClass('OptSelected');
		input.tabl.addClass('OptSelected');
		input.sele = l + 1;
		input.setNumber();
		input.list.clone(true).appendTo(curopt);
	}
	updateInputCommon();
}
function updateInputCommon() { // 更新常用项目列表
	var comrank = Commonlist.slice();
	var lim = Conf['CommonLimit'];
	var comopt = $('#OptPage-common');
	comopt.children('li[id]').remove();
	for ( var k in Inputlist ) {
		k = Inputlist[k];
		if ( k.coun > 0 ) {
			CommonConf[k.name] = k.coun;
			if ( k.coun > comrank[0][0] ) {
				var cur = comrank[0] = [k.coun, k];
				for ( var i = 1; i < lim; ++i ){
					if ( cur[0] > comrank[i][0] ) {
						comrank[i-1] = comrank[i];
						comrank[i] = cur;
					} else break;
				}
			}
		}
	}
	comrank.reverse();
	for ( var l = 0, len = comrank.length, input; l < len; ++l ) {
		if ( comrank[l][0] == 0 ) break;
		comrank[l][1].list.clone(true).appendTo(comopt);
	}
	setCommonCookie();
}
function fillArray( len, val ) { // 填满阵列
	var rv = new Array( len );
	while ( --len >= 0 ) rv[len] = val;
	return rv;
}
function wrapSort( arr, joi ) { // 高级排序及包裹
	if ( arr === false ) return false;
	if ( arr.length > 1 ) arr = $.isNumeric(arr[0]) ? arr.sort(function(a,b){return a-b}) : arr.sort();
	return arr.map(function(a){return '<span>' + a + '</span>';}).join( joi );
};
function encodeProp ( code ) {
	code = PropList.indexOf( code );
	if ( code == -1 ) return false;
	if ( code > 51 ) return String.fromCharCode( code - 4 );
	else if ( code > 25 ) return String.fromCharCode( code + 71 );
	return String.fromCharCode( code + 65 );
}
function decodeProp ( code ) {
	code = code.charCodeAt( 0 );
	if ( code > 96 ) return PropList[code - 71] || false;
	else if ( code > 64 ) return PropList[code - 65] || false;
	return PropList[code + 4] || false;
}
function setCommonStorage () { // 更新常用项目Storage
	setStorage( 'CommonUsed', getObjectJson( CommonConf ) );
}
function getCommonStorage () { // 获取常用项目Storage
	var json = getStorage( 'CommonUsed' );
	if ( json == null ) return CommonConf;
	for ( var k in CommonConf ) if ( json[k] == null ) json[k] = CommonConf[k];
	return json;
}
function setCommonCookie () { // 更新常用项目Cookie
	setCookie( 'SMWCDSCommonUsedInput', getObjectJson( CommonConf ), 30 );
}
function getCommonCookie () { // 获取常用项目Cookie
	var json = getJsonObject( getCookie( 'SMWCDSCommonUsedInput' ) );
	if ( json == null ) return CommonConf;
	for ( var k in CommonConf ) if ( json[k] == null ) json[k] = CommonConf[k];
	return json;
}
function getObjectJson ( obj ) { // 获取物件的Json
	var res = '';
	var sep = '';
	for ( var k in obj ) {
		res += sep + '"' + k + '":' + obj[k];
		sep = ',';
	}
	return '{'+res+'}';
}
function getJsonObject ( json ) { // 从Json获取物件
	return $.parseJSON( json );
}
function setStorage ( name, value ) { // 设定Storage
	if ( Storage == null || localStorage == null ) return false;
	localStorage.setItem( name, value );
	return true;
}
function getStorage ( name ) { // 获取Storage
	if ( Storage == null || localStorage == null ) return null;
	return localStorage[name];
}
function delStorage ( name ){ // 删除Storage
	if ( Storage == null || localStorage == null ) return false;
	localStorage.removeItem( name );
	return true;
}
function setCookie ( name, value, day ) { // 设定Cookie
	var date = new Date();
	date.setTime( date.getTime() + (day * 86400000) );
	$.cookie( name, value, { expires: day } );
	return true;
}
function getCookie ( name ) { // 获取Cookie
	return $.cookie( name );
}
function delCookie ( name ){ // 删除Cookie
	$.cookie( name, null, { expires: 'Thu, 01-Jan-70 00:00:01 GMT' } );
	return true;
}
function getURLParam () {
	var url = window.location.search.substring(1);
	var chunks = url.split('&');
	var inp;
	for ( var i = 0, l = chunks.length; i < l; i++ ) {
		var chunk = chunks[i].split( '=' );
		if ( ( inp = Inputlist[chunk.shift()] ) != null ) inp.addBefore().addVal( decodeURIComponent( chunk.join( '=' ) ).trim() );
	}
}

function foldOptions () { // 折叠搜索输入框
	$('#OptTitle').addClass('Folded')
	$('#OptFrame,#OptSubmit').slideUp();
	ban = true;
}
function unfoldOptions () { // 展开搜索输入框
	$('#OptTitle').removeClass('Folded')
	$('#OptFrame,#OptSubmit').slideDown();
	ban = false;
}
function showSidebar() { // 显示侧选项栏
	Sidebar.animate( {width:'show'}, Conf['SidebarSpeed'], function () {
		$(document).on( 'click', function ( e ) {
			if ($(e.target).parents('#OptBtns').length == 0 ) hideSidebar();
		} );
	} );
}
function hideSidebar( speed ) { // 隐藏侧选项栏
	Sidebar.animate( {width:'hide'}, Conf['SidebarSpeed'], function () {
		$(document).off( 'click' );
	} );
}
function startQuery () { // 请求开始时的显示处理
	setResult( '' );
	loading.show();
}
function endQuery () { // 请求结束时的显示处理
	loading.hide();
	ban = false;
}
function setResult ( str ) { // 显示结果
	Display.html( str );
}
function noResult () { // 显示无结果
	setResult( '<div id="NoResult">' + Conf['NoResult'] + '</div>' );
}

function newInput ( name ) { // 辅助新建Input物件
	var ninp = new Input[OptionConf[name]]();
	ninp.init( name );
	return ninp;
}

function newPage ( type, raw ) { // 辅助新建Page物件
	if ( raw.tota == null || raw.tota == 0 ) return false;
	return new Page( type, raw );
}


/** 扩展函数 **/

String.prototype.norm = function () { // 去除非法字元
	return this.replace( /[\[\]\|\{\}]+/g, '' ).replace( /^[><≥≤!~= ]+/, '');
}
String.prototype.escape = function () { // 转义特殊字元
	return this.replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' );
};
$.fn.setDisable = function () { // 禁用按钮
	return this.addClass( 'greyscale' ).attr( 'disabled', '' );
};
$.fn.unDisable = function () { // 解禁按钮
	return this.removeClass( 'greyscale' ).removeAttr( 'disabled' );
};
$.fn.startMarquee = function ( speed ) { // 开始走马灯
	speed = speed == null ? 1500 : speed;
	if ( this.innerWidth() >= this[0].scrollWidth ) return this;
	this.css('position', 'relative');
	return this.Marquee( (this.innerWidth() - this[0].scrollWidth)*(speed<0?-1:1), Math.abs(speed) );
}
$.fn.endMarquee = function () { // 结束走马灯
	return this.stop( true ).css('left', '0px').css('position', 'static');
}
$.fn.Marquee = function ( len, speed ) { // 运行走马灯
	this.animate({left:len+'px'},speed, 'linear');
	return this.animate({left:'0px'},speed, 'linear', function () {$(this).Marquee( len, speed );});
}
$.fn.selectText = function () { // 选取文字
	var element = this.get(0);
	if ( document.body.createTextRange ) {
		var range = document.body.createTextRange();
		range.moveToElementText( element );
		range.select();
	} else if ( window.getSelection ) {
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents( element );
		selection.removeAllRanges();
		selection.addRange( range );
	}
}
$.fn.hoverDelay = function ( fn, delay, out ) { // 鼠标悬停、移开冒泡
	return this.hover( function () {
			$(this).data(
				'timeout',
				setTimeout(
					(function (_this) {return function () {fn.apply( _this );}})(this),
					delay == null ? 1000 : delay
				)
			);
		}, function () {
			clearTimeout( $(this).data( 'timeout' ) );
			if ( out != null ) out.apply( this );
		}
	);
}
$.fn.setSwitch = function ( list ) { // 设置按钮
	return this.after( '<span></span>' ).data( 'SwitchList', list ).resetSwitch().click( function () { $(this).nextSwitch(); } );
}
$.fn.resetSwitch = function () { // 重置按钮内容
	var len = this.length;
	for ( var i = 0; i < len; ++i ) this.eq(i).gotoSwitch( 0 );
	return this;
}
$.fn.gotoSwitch = function ( pos ) { // 设置按钮内容
	pos = pos || 0;
	var list = this.data( 'SwitchList' );
	if ( pos != 0 && list[pos] == null ) return this.gotoSwitch( 0 );
	this.data( 'SwitchPos', pos );
	var para = list[pos];
	if ( para[3] != null ) this.next().html( ' ' + para[3] );
	return this.html( para[0] ).val( para[1] ).attr( 'title', '单击切换为 ' + para[2] );
}
$.fn.nextSwitch = function () { // 显示下一内容
	return this.gotoSwitch( this.data( 'SwitchPos' ) + 1 );
}


/** 物件定义 **/
var Input = (function () { // 输入项物件
	var Input = function () {};
	Input.prototype.init = function ( name ) {
		this.name = name;
		this.sele = 0;
		this.coun = CommonConf[name] == null ? 0 : CommonConf[name];
		this.list = $( 'li#' + name );
		this.tabl = $( 'table#' + name );
		this.sugg = false;
		this.text = this.tabl.find('th').html();
		this.tabl.find('th').append( '<br />' + makeButtonBox( 'sortval' ) )
		.next().html( this.makeInputText( InputConf[name] ) )
		.next().html('清<br /><br /><br />空').click( (function(_this) {
			return function () {
				_this.clear();
			}
		})(this) )
		.next().html('变<br /><br /><br />更').click( (function(_this) {
			return function () {
				showSidebar();
				curInput = _this;
				OptName.html( _this.text ).removeClass( 'New' );
			}
		})(this) );
	
		this.inpu = this.tabl.find('input');
		this.opti = this.tabl.find('option');
		this.butt = this.tabl.find('button[class]');
	
		if ( SuggestionConf[name] != null ) this.sugg = new Suggestion( this );
		this.list.click( (function(_this) {
			return function () {
				if ( curInput.name == 'blank' ) _this.addBefore();
				else curInput.exchange( _this );
				hideSidebar();
			}
		})(this) );
		this.tabl.data( 'returnSelf', this );
	}
	Input.prototype.clear = function () {
		this.inpu.val('');
		this.opti.filter('[value=""]').attr('selected','selected');
		this.butt.resetSwitch();
		return this;
	}
	Input.prototype.addBefore = function ( inp ) {
		inp = inp || false;
		if ( inp && this.name == inp.name ) return this;
		this.sele = 1;
		if ( !this.tabl.hasClass('OptSelected') ) ++this.coun;
		this.list.addClass('OptSelected');
		this.tabl.addClass('OptSelected').insertBefore( inp === false ? $('#blank') : inp.tabl ).css('left','100%').animate({left:'0%'}, Conf['Speed'], updateInputSelect);
		$('#OptInputs').scrollTop( $('#OptInputs').prop('scrollHeight') );
		return this;
	}
	Input.prototype.removeChange = function ( inp ) {
		inp = inp || false;
		if ( inp && this.name == inp.name ) return;
		this.sele = 0;
		this.list.removeClass('OptSelected');
		if ( inp !== false ) {
			if ( this.name == inp.name ) return;
			var ori = this.tabl;
		}
		this.tabl.css('left','0%').animate({left:'-100%'}, Conf['Speed'], function () {
			$(this).removeClass('OptSelected').css('left','0%');
			if ( inp !== false ) {
				inp.sele = 1;
				++inp.coun;
				inp.list.addClass('OptSelected');
				inp.tabl.addClass('OptSelected').insertBefore( ori ).css('left','100%').animate({left:'0%'}, Conf['Speed'], updateInputSelect);
			} else updateInputSelect();
		});
	}
	Input.prototype.exchange = function ( inp ) {
		if ( this.name == inp.name ) return;
		var ori = this.tabl;
		var nop = inp.tabl;
		if ( inp.sele != 0 ) {
			ori.css('left','0%').animate({left:'-100%'}, Conf['Speed'], function () {
				var tmp = $('<span>').hide();
				tmp.insertBefore(ori);
				ori.insertBefore(nop);
				tmp.replaceWith(nop);
			}).animate({left:'100%'}, 0).animate({left:'0%'}, Conf['Speed'], updateInputSelect);
			nop.css('left','0%').animate({left:'-100%'}, Conf['Speed']).animate({left:'100%'}, 0).animate({left:'0%'}, Conf['Speed']);
		} else this.removeChange( inp );
	}
	Input.prototype.setNumber = function () {
		if ( this.sele == 0 ) return;
		this.list.attr( 'value', this.sele );
	}
	Input.prototype.getCode = function () {
		return encodeProp( this.name );
	}
	Input.prototype.getData = function () {
		this.valu = this.tabl.find('td[id]').find('input,select,button');
		if ( this.valu.length == 0 ) return false;
		this.orde = this.tabl.find('button.sortval');
		this.sort = '';
		if ( this.orde.length == 0 || ( this.orde = this.orde.val() ) == '' || Conf['Sort'].indexOf( this.orde ) == -1 ) {
			this.orde = '';
		}
		this.mode = 0;
		this.empt = false;
		this.quer = '';
		this.valu = this.valu.map( function () {return $(this).val().trim();} ).get();
		this.parseInput();
		return this;
	}
	Input.prototype.makeInputText = function ( para ) { return ''; }
	Input.prototype.addVal = function ( val ) { return false; }
	Input.prototype.parseInput = function () {};
	Input.prototype.isIn = function ( type ) {
		return type.prop.indexOf( this.name ) != -1;
	};
	Input.prototype.getSort = function () {
		if ( this.orde !== '' ) this.sort = this.prop;
	};
	Input.prototype.getVal = function ( type ) {
		if ( ( this.isIn( type ) ) === false || !( this.prop = this.getCode() ) ) return false;
		this.getSort();
		if ( this.empt ) return true;
		if ( !( this.valu instanceof Array ) ) this.quer = this.valu === '' ? '' : this.prop + this.mode + this.valu + '\n';
		else if ( this.mode instanceof Array ) {
			for ( var i = 0; i < this.valu.length; i++ ) {
				this.quer += this.prop + this.mode[i] + this.valu[i] + '\n';
			}
		}
		return true;
	};
	return Input;
})();
Input.Sgnot = (function () {
	var InputSgnot = function () {};
	InputSgnot.prototype = new Input();
	InputSgnot.prototype.makeInputText = function ( para ) {
		if ( para != false ) return ( para instanceof Array ? makeSelectBox( para ) : makeInputBox( para ) ) + makeButtonBox( 'notval' );
		return makeButtonBox( 'notval' );
	}
	InputSgnot.prototype.addVal = function ( val ) {
		if ( this.sele == 0 ) this.clear().addBefore();
		if ( val.charAt(0) == '!' ) {
			this.butt.eq(1).gotoSwitch( 1 );
			val = val.slice(1);
		}
		if ( typeof InputConf[this.name] == 'string' ) this.inpu.val( val );
		else this.opti.eq( Math.max( InputConf[this.name].indexOf( val ), 0 ) ).attr('selected','selected');
		return true;
	}
	InputSgnot.prototype.parseInput = function () {
		this.valu = this.valu[0].norm();
		if ( this.valu === '' ) return this.empt = true;
		var inot = this.tabl.find('button.notval');
		if ( inot.length != 0 && inot.val() == 'N' ) this.mode = 2;
	};
	return InputSgnot;
})();
Input.Mltor = (function () {
	var InputMltor = function () {};
	InputMltor.prototype = new Input();
	InputMltor.prototype.makeInputText = function ( para ) {
		if ( para != false ) return makeInputBox( para ) + makeButtonBox( 'modeval' );
		return makeInputBox( { 'class' : 'wide', 'type' : 'text', 'placeholder' : '可用全角逗号分隔多个' } ) + makeButtonBox( 'modeval' );
	}
	InputMltor.prototype.addVal = function ( val ) {
		if ( this.sele == 0 ) this.clear().addBefore();
		var oldval = this.inpu.val();
		if ( ( '，' + oldval + '，' ).indexOf( '，' + val + '，' ) != -1 ) return true;
		if ( oldval !== '' && oldval.slice( -1 ) != '，' ) oldval += '，';
		this.inpu.val( oldval + val + '，' );
		return true;
	}
	InputMltor.prototype.parseInput = function () {
		if ( this.valu[1] == 'AND' ) this.mode = 1;
		else if ( this.valu[1] == 'N' ) this.mode = 2;
		this.valu = this.valu[0];
		if ( this.valu === '' ) return this.empt = true;
		this.valu = $.unique(
			$.map( this.valu.split( '，' ) ,function ( n ) {
				if ( ( n = n.trim() ) !== '' && ( n = n.norm() ) !== '' ) return n;
			} )
		);
		if ( this.valu.length == 0 ) return this.empt = true;
		if ( this.mode == 2 ) {
			this.valu = this.valu[0];
		} else this.valu = this.valu.join('\t');
	};
	return InputMltor;
})();
Input.Range = (function () {
	var InputRange = function () {};
	InputRange.prototype = new Input();
	InputRange.prototype.makeInputText = function ( para ) {
		if ( para != false ) {
			return makeInputBox( { 'type' : 'number', 'min' : para[0], 'max' : para[2], 'placeholder' : para[1] } ) +
			makeButtonBox( 'rangeval' ) +
			makeInputBox( { 'type' : 'number', 'min' : 0, 'max' : para[2], 'placeholder' : para[3] } );
		}
		return makeInputBox( { 'type' : 'number', 'min' : 0 } ) +
		makeButtonBox( 'rangeval' ) +
		makeInputBox( { 'type' : 'number', 'min' : 0 } );
	}
	InputRange.prototype.addVal = function ( val ) {
		if ( this.sele == 0 ) this.clear().addBefore();
		val = /^([\d\.]+)([-+]?)([\d\.]+)$/.exec( val );
		if ( val == null ) return false;
		this.inpu.eq(0).val( val[1] );
		this.inpu.eq(1).val( val[3] || 0 );
		this.butt.eq(1).gotoSwitch( val[2] == '+' || val[3] == null ? 1 : 0 );
		return true;
	}
	InputRange.prototype.parseInput = function () {
		this.parseNumber();
		if ( this.equa && this.valu[0] !== '' ) {
			this.mode = 0;
			this.valu = this.valu[0];
			return true;
		}
		if ( this.valu[0] === '' && this.valu[2] === '' ) return this.empt = true;
		this.mode = 3;
		this.valu = this.valu[0] + '\t' + this.valu[2];
	};
	InputRange.prototype.parseNumber = function () {
		this.valu[0] = /[\d\.]+/.exec( this.valu[0] );
		this.valu[2] = /[\d\.]+/.exec( this.valu[2] );
		this.valu[0] = ( this.valu[0] == null ? '' : this.valu[0].toString() );
		this.valu[2] = ( this.valu[2] == null ? '' : this.valu[2].toString() );
		this.equa = false;
		if ( this.valu[1] == 'PM' ) {
			var val = [];
			val[0] = parseFloat( this.valu[0] ) || 0;
			val[1] = parseFloat( this.valu[2] ) || 0;
			if ( val[1] == 0 ) {
				this.equa = true;
			} else if ( val[0] >= val[1] ) {
				this.valu[0] = val[0] - val[1];
				this.valu[2] = val[0] + val[1];
			}
		}
		this.valu[0] = this.valu[0] === 0 ? '' : this.valu[0];
	}
	return InputRange;
})();
Input.Price = (function () {
	var InputPrice = function () {};
	InputPrice.prototype = new Input.Range();
	InputPrice.prototype.makeInputText = function ( para ) {
		if ( para != false ) return makeInputBox( para );
		return makeInputBox( {
			'type' : 'number',
			'min' : 0,
			'max' : 99999999,
			'placeholder' : '1000'
		} ) + makeButtonBox( 'rangeval' ) + makeInputBox( {
			'type' : 'number',
			'min' : 0,
			'max' : 99999999,
			'placeholder' : '1200'
		} ) + makeSelectBox( Conf['Currency'] );
	}
	InputPrice.prototype.addVal = function ( val ) {
		if ( this.sele == 0 ) this.clear().addBefore();
		val = /^([\d\.]+)(.+)$/.exec( val );
		if ( val == null || val.length < 3 ) return false;
		this.inpu.eq(0).val( val[1] );
		this.inpu.eq(1).val( 0 );
		this.butt.eq(1).gotoSwitch( 1 );
		this.opti.eq( Math.max( Conf['Currency'].indexOf( val[2] ), 0 ) ).attr( 'selected', 'selected' );
		return true;
	}
	InputPrice.prototype.parseInput = function () {
		this.parseNumber();
		if ( this.equa && this.valu[0] !== '' ) {
			this.mode = 4;
			this.valu = this.valu[0] + this.valu[3];
			return true;
		}
		if ( this.valu[0] === '' && this.valu[2] === '' ) return this.empt = true;
		this.mode = 3;
		this.valu = ( this.valu[0] === '' ? '' : this.valu[0] + this.valu[3] ) + '\t' + ( this.valu[2] === '' ? '' : this.valu[2] + this.valu[3] );
	};
	return InputPrice;
})();
Input.Durat = (function () {
	var InputDurat = function () {};
	InputDurat.prototype = new Input.Range();
	InputDurat.prototype.makeInputText = function ( para ) {
		if ( para != false ) return makeInputBox( para[0] ) + makeButtonBox( 'rangeval' ) + makeInputBox( para[1] );
		return '';
	}
	InputDurat.prototype.parseInput = function () {
		this.valu[0] = /[\d\.\:\-\/]+/.exec( this.valu[0] );
		this.valu[2] = /[\d\.\:\-\/]+/.exec( this.valu[2] );
		this.valu[0] = ( this.valu[0] == null ? '' : this.valu[0].toString() );
		this.valu[2] = ( this.valu[2] == null ? '' : this.valu[2].toString() );
		this.equa = false;
		if ( this.valu[1] == 'PM' ) {
			var val = [];
			val[0] = /[1-9]/.exec( this.valu[0] ) == null ? 0 : this.valu[0];
			val[1] = /[1-9]/.exec( this.valu[2] ) == null ? 0 : this.valu[2];
			if ( val[1] == 0 ) {
				if ( val[0] !== 0 ) {
					this.mode = 0;
					this.valu = this.valu[0];
				}
				return this.empt = true;
			}
			if ( val[0] != 0 ) {
				this.valu[0] = val[0] + '--' + val[1];
				this.valu[2] = val[0] + '++' + val[1];
			}
		} else if ( this.valu[0] === '' && this.valu[2] === '' ) return this.empt = true;
		this.mode = 3;
		this.valu = this.valu[0] + '\t' + this.valu[2];
	};
	return InputDurat;
})();

var Suggestion = (function () { // 输入建议物件
	var Suggestion = function ( inpu ) {
		this.name = inpu.name;
		this.list = $('<div></div>').addClass('SugContainer');
		this.inpu = inpu.tabl.find(':text').attr( 'autocomplete', 'off' ).after(this.list);
		if ( Conf['Font'] == null ) Conf['Font'] = this.inpu.css('font-family');
		this.size = $('<div></div>').addClass('sizer').insertAfter(this.inpu).css( 'font-family', Conf['Font'] );
		this.valu = '';
		this.sche = SuggestionConf[this.name];
		this.cach = {};
		this.inpu.focus( (function(_this) {
			return function () {
				curSuggestion = _this;
				curSuggestion.list.show();
				curSuggestion.inpu.on( 'input propertychange', function () {curSuggestion.getVal();} );
				curSuggestion.getVal();
			}
		})(this) ).focusout( function () {
			if ( hold ) {
				hold = false;
				var ival = $(this).focus().val();
				$(this).val( '' ).val( ival );
				return;
			}
			$('div.SugContainer').hide();
			curSuggestion.inpu.off( 'input propertychange' );
		});
	}
	Suggestion.strip = function ( val ) {
		return ( val == null || ( val = val.toString().trim() ) === '' ) ? '' : val.replace( /[\[\]]/g, '' ).replace( '_', ' ' );
	}
	Suggestion.prototype.getVal = function () {
		var val = /[^，]*$/.exec( this.inpu.val() );
		this.moveList( val == null ? 0 : val.index );
		this.valu = val = Suggestion.strip( val );
		if ( val === '' ) this.dump( '' );
		else if ( this.cach[val.toLowerCase()] == null ) {
			this.cach[val.toLowerCase()] = false;
			this.post( val );
		} else if ( this.cach[val.toLowerCase()] !== false ) {
			this.dump( val.toLowerCase() );
		}
	}
	Suggestion.prototype.post = function ( val ) {
		this.list.show().html( '<div class="SugLoading"></div>' );
		$.ajax( {
			url: Conf['SApi'],
			data: {
				'action' : 'inopt',
				'title' : this.sche,
				'value' : val.replace( /&/g, '%26' )
			},
			type: 'POST',
			dataType: 'text',
			success: (function(_this) {
				return function ( req ) {
					_this.check( req, val );
				}
			})(this),
		} );
	}
	Suggestion.prototype.check = function ( req, val ) {
		val = val.toLowerCase();
		this.cach[val] = req;
		if ( this.valu.toLowerCase() === val ) this.dump( val );
	}
	Suggestion.prototype.dump = function ( val ) {
		if ( val === '' || this.cach[val] === '' ) return this.list.html('<div class="SugNone">- 无结果 -</div>');
		var pattern = this.getRegex();
		this.list.html( this.cach[val] ).children().hover( function () {
			var t = $(this);
			t.startMarquee();
			if ( t.data( 'value' ) != null ) return;
			t.data( 'value', t.text() );
			this.innerHTML = t.text().replace( pattern, '<span>$1</span>' );
		}, function () {
			$(this).endMarquee();
		}).mousedown( (function(_this) {
			return function () {
				_this.select( $(this).data( 'value' ) );
			}
		})(this) );
	}
	Suggestion.prototype.select = function ( text ) {
		hold = true;
		this.inpu.val( this.inpu.val().replace( /[^，]*$/, text ) + '，' );
		this.dump( '' );
	}
	Suggestion.prototype.getRegex = function () {
		var str = this.valu;
		var str2 = false;
		var sp = /[^a-z]/i.test( str ) ? '' : ' ';
		var len = str.length;
		if ( len > 1 ) {
			mat = str.match( /\d+|\D/g );
			len = mat.length;
		}
		switch ( len ) {
			case 2:
				str2 = '^' + mat[0].escape() + '|' + sp + mat[1].escape();
			case 1:
				str = ( sp ? '^' : '' ) + str.escape();
				break;
			case 3:
				str2 = '^' + mat[0].escape() + '|' + sp + mat[1].escape() + '|' + sp + mat[2].escape();
			default :
				str = str.escape();
				break;
		}
		return new RegExp( '(' + str + ( str2 ? '|' + str2 : '' ) + ')', 'gi' );;
	}
	Suggestion.prototype.moveList = function ( pos ) {
		this.list.css( 'margin-left', Math.min(this.size.text( this.inpu.val().substr( 0, pos ) ).width(), this.inpu.width()-152) );
	}
	return Suggestion;
})();

var Output = (function () { // 输出项物件
	var Output = function ( tyid ) {
		this.tyid = tyid;
		this.prop = OutputConf[tyid][1];
		this.para = [];
		this.quer = this.orde = this.sort = '';
	}
	Output.prototype.addVal = function ( opt, tyid ) {
		this.para.push( opt );
		this.quer += opt.quer;
		this.orde += opt.orde;
		this.sort += opt.sort;
		if ( OutputConf[tyid][2].indexOf( opt.name ) != -1 || ItemConf[tyid][opt.name] == null ) return '';
		return opt.getCode();
	};
	Output.prototype.getInner = function ( tyid ) {
		if ( this.quer !== '' ) return '{' + this.tyid + this.quer + '}';
		return '';
	};
	Output.prototype.getOuter = function () {
		return this.quer;
	};
	Output.prototype.getReqs = function () {
		return $.map( OutputConf[this.tyid][2], encodeProp ).join( '' );
	};
	return Output;
})();

var Request = (function () { // 查询请求物件
	var Request = function ( mode ) {
		this.quer = this.reqs = this.sort = this.orde = this.hash = '';
		this.tota = -1;
		this.mode = mode;
		this.pred = OutputConf[mode][0];
		this.outp = [ new Output( mode ) ];
		for ( var k in OutputConf ) if ( k != mode ) this.outp.push( new Output( k ) );
	}
	Request.prototype.getQuery = function ( form, perp ) {
		this.perp = Math.min( Math.max( perp, 1 ), 100 );
		for ( var i = 0, l = form.length, inp; i < l; ++i ) {
			inp = form.eq(i).data( 'returnSelf' ).getData();
			if ( inp === false ) continue;
			for ( var type in this.outp ){
				type = this.outp[type];
				if ( inp.getVal( type ) === false ) continue;
				this.reqs += type.addVal( inp, this.mode );
				break;
			}
		}
		for ( var k in this.outp ) if ( k != 0 ) this.quer += this.outp[k].getInner( this.mode );
		this.quer += this.outp[0].getOuter();
		if ( this.quer !== '' ) {
			this.quer = this.quer.replace( /&/g, '%26' );
			this.reqs = this.outp[0].getReqs() + this.reqs;
			this.sort = this.outp[0].sort;
			this.orde = this.outp[0].orde;
			this.tota = 0;
			this.hash = this.quer + '|' + this.reqs + '|' + this.pred + '|' + this.sort + '|' + this.orde + '|limit=' + this.perp;
			return true;
		}
		return false;
	}
	Request.prototype.getTotal = function ( fn ) {
		startQuery();
		$.ajax( {
			url: Conf['Api'],
			data: {
				'action' : 'uask',
				'pre' : this.pred,
				'query' : this.quer,
				'sort' : this.sort
			},
			type: 'POST',
			dataType: 'text',
			success: (function(_this) {
				return function ( req ) {
					_this.check( req, fn );
				}
			})(this),
			error: function () { 
				alert( Conf['NoConnect'] );
				endQuery();
			}
		} );
	}
	Request.prototype.check = function ( req, fn ) {
		if ( req != '' ) {
			var param = req.split( ' ' );
			this.tota = parseInt( param[0] || 0 );
			this.toke = param[1] || '';
		} else this.tota = 0;
		fn.apply( this );
	}
	Request.prototype.getFullQuery = function () {
		return {
			'action' : 'uask',
			'pre' : this.pred,
			'query' : this.quer,
			'result' : this.reqs,
			'token' : this.toke,
			'sort' : this.sort,
			'order' : this.orde,
			'limit' : this.perp,
			'offset' : 0
		};
	}
	return Request;
})();

var Result = (function () { // 查询结果物件
	var Result = function ( main ) {
		this.requ = main;
		this.cach = [];
		this.page = 0;
		this.mode = main.mode;
		this.perp = main.perp;
		this.tota = main.tota;
		this.hash = main.hash;
		this.quer = main.getFullQuery();
	}
	Result.setPageText = function ( page, from, to, total ) {
		paged.html( '第' + page + '页 （第'+ from +'-'+ to +'项'+'，共'+ total +'项）' );
	}
	Result.prototype.post = function ( disp ) {
		disp = disp == false ? false : true;
		if ( this.tota == 0 ) {
			if ( disp ) this.dump();
			endQuery();
			return;
		}
		this.quer['offset'] = this.page * this.perp;
		$.ajax( {
			url: Conf['Api'],
			data: this.quer,
			type: 'POST',
			dataType: 'json',
			success: (function(_this) {
				return function ( req ) {
					_this.check( req, disp );
				}
			})(this),
			error: function () {
				alert( Conf['NoConnect'] );
				endQuery();
			}
		} );
		if ( disp ) startQuery();
	}
	Result.prototype.check = function ( req, disp ) {
		if ( req.length == 0 ) this.cach[this.page] = false;
		else this.cach[this.page] = newPage( this.mode, req );
		if ( disp ) this.dump();
	}
	Result.prototype.dump = function ( page ) {
		foldOptions();
		endQuery();
		if ( page != null ) this.page = page;
		Shifter.show();
		loading.hide();
		if ( this.tota == 0 ){
			prevd.setDisable();
			nextd.setDisable();
			Result.setPageText( 1, 0, 0, 0 );
			noResult();
			return;
		}
		var cache;
		if ( cache = this.cach[this.page] ){
			cache.display();
			Result.setPageText( this.page + 1, cache.from, cache.till, this.tota );
			if ( this.page == 0 ) prevd.setDisable();
			else prevd.unDisable();
			if ( cache.till >= this.tota ) nextd.setDisable();
			else nextd.unDisable();
			$('.ResultItem .list td>span').dblclick( function () {
				$(this).selectText();
			} ).hoverDelay( function () {
				curWord = [this.parentNode.getAttribute('name'), this.innerHTML.replace( '&amp;', '&' )];
				var pos = $(this).position();
				HoverBox.css( { left:pos.left + $(this).width(), top:pos.top + ($(this).height() - HoverBox.height()) / 2 } ).stop( true ).fadeIn(0);
			}, 500, function () {
				HoverBox.fadeOut( 500 );
			} );
			$('.ResultItem .list th').dblclick( function () {
				$(this).next().selectText();
			} );
		} else {
			prevd.setDisable();
			nextd.setDisable();
			noResult();
		}
	}
	Result.prototype.shiftPage = function ( dir ) {
		ban = true;
		if ( this.page + dir >= 0 && ( dir < 0 || ( this.page + 1 ) * this.perp < this.tota ) ) {
			this.page += dir;
			if ( this.cach[this.page] == null ) this.post();
			else this.dump();
		}
	}
	return Result;
})();

var Page = (function () {
	var Page = function ( type, raw ) { // 结果页面物件
		var i, j, k, tr, data, name, outp;
		this.conf = ItemConf[type];
		this.type = type;
		this.tota = raw.tota;
		this.from = raw.from;
		this.till = raw.till;
		this.symb = raw.symb.split('');
		this.coun = this.symb.length;
		for ( k = 0; k < this.coun; ++k ) this.symb[k] = decodeProp( this.symb[k] );
		this.outp = '';
		this.getTable = DisplayConf[type];

		for ( i = 0; i < this.tota; ++i ) {
			data = '', name = '', outp = '';
			tr = { data: [], idno: this.from + i };
			for ( var j in raw.resu ) if ( j != 'data' ) tr[j] = raw.resu[j][i];
			for ( k = 0; k < this.coun; ++k ) {
				name = this.symb[k];
				data = wrapSort( raw.resu.data[k][i], ( JoinConf[name] || '，' ) + ' ' );
				if ( this.conf[name] != null && data !== false ) outp += '<tr><th>' + this.conf[name] + '</th><td name="'+name+'">' + data + '</td></tr>';
				else tr.data[name] = data === false ? '' : data;
			}
			this.outp += this.getTable( outp, tr );
		}
		delete raw;
		lastPage = this;
	}
	Page.prototype.display = function () {
		setResult( this.outp );
	}
	return Page;
})();


/** 主程序 **/

// 定义全局变量
var lastPage = false;
var Display = $('div#SearchResult'); // 结果显示方块
var Sidebar = $('div#OptBtns'); // 侧选项栏方块
var Shifter = $('div#PageShift'); // 翻页方块
var OptName = $('div#CurOptName');
var hold = false; // 禁止失焦，点击建议列表时维持对输入框的焦点
var ban = false; // 禁止搜索，搜索进行途中禁止再次进行搜索
var curInput = { 'name' : 'blank' }; // 当前输入项物件
var curSuggestion = false; // 当前输入建议物件
var curPage = $('li#OptSwitch-common'); // 当前侧选项栏页面
var curResult = false; // 当前查询结果物件
var curWord = [];
var Inputlist = {}; // 输入项物件列表
var Resultlist = []; // 查询结果物件列表
var Commonlist = fillArray( Conf['CommonLimit'], [0] ); // 常用项目基础列表

// 初始化
initInput();

// 加载图标及翻页控制
var loading = $('div#Loading').attr('title', '正在载入...').hide();

var prevd = $('<input id="PrevPage" type="image" src="http://upload.wikimedia.org/wikipedia/commons/8/87/Gtk-go-back-ltr.svg" alt="上一页 /">').click( function () { 
	if ( curResult ) curResult.shiftPage(-1);
} );
var nextd = $('<input id="NextPage" type="image" src="http://upload.wikimedia.org/wikipedia/commons/b/b9/Gtk-go-forward-ltr.svg" alt="下一页 /">').click( function () { 
	if ( curResult ) curResult.shiftPage(1);
} );
var paged = $('<span id="PageNumber">第1页</span>');
Shifter.append(prevd).append(nextd).append(paged).hide();

var HoverBox = $('<span class="HoverBox"></span>').append(
	$('<button title="增加此值为搜索条件">+</button>').click( function () { 
		if ( Inputlist[curWord[0]].addVal( curWord[1] ) ) unfoldOptions();
		HoverBox.hide();
	} )
).append(
	$('<button title="使用此值为搜索条件">=</button>').click( function () { 
		if ( Inputlist[curWord[0]].clear().addVal( curWord[1] ) ) unfoldOptions();
		HoverBox.hide();
	} )
).hover( function () {
	$(this).stop( true ).fadeIn(0);
}, function () {
	$(this).fadeOut( 1000 );
} );
Display.before( HoverBox );

// 折叠控制
$('#MenuTitle').click( function () {
	if ( $(this).toggleClass('Folded').hasClass('Folded') ) $('#MenuContent').slideUp();
	else $('#MenuContent').slideDown();
} ).addClass('Folded');
$('#OptTitle').click( function () {
	if ( $(this).hasClass('Folded') ) unfoldOptions();
	else foldOptions();
} );

// 侧选项栏控制
Sidebar.hide();
$.each( $('li[id^="OptSwitch-"]'), function () {
	var i = $(this);
	i.data( 'OptPage', $( 'ol#OptPage-'+ i.attr( 'id' ).slice( 10 ) ) );
} )
.on( 'mouseover click', function () {
	curPage.removeClass('OptSwitchSelected').data( 'OptPage' ).removeClass('OptPageSelected')
	curPage = $(this).addClass('OptSwitchSelected');
	curPage.data( 'OptPage' ).addClass('OptPageSelected');
} );

$('.OptClass-remove').click( function () {
	if ( curInput.name != 'blank' ) curInput.removeChange();
	hideSidebar();
} );

curPage.click();

/** 结束 **/

})();