<?php

/**************************************************************
"Learning with Texts" (LWT) is free and unencumbered software 
released into the PUBLIC DOMAIN.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a
compiled binary, for any purpose, commercial or non-commercial,
and by any means.

In jurisdictions that recognize copyright laws, the author or
authors of this software dedicate any and all copyright
interest in the software to the public domain. We make this
dedication for the benefit of the public at large and to the 
detriment of our heirs and successors. We intend this 
dedication to be an overt act of relinquishment in perpetuity
of all present and future rights to this software under
copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE 
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.

For more information, please refer to [http://unlicense.org/].
***************************************************************/

/**************************************************************
Call: mobile.php?...
			...action=1&lang=[langid] ... Language menu
			...action=2&lang=[langid] ... Texts in a language
			...action=3&lang=[langid]&text=[textid] ... Sentences of a text
			...action=4&lang=[langid]&text=[textid]&sent=[sentid] ... Terms of a sentence
			...action=5&lang=[langid]&text=[textid]&sent=[sentid] ... Terms of a sentence (next sent)
LWT Mobile 
***************************************************************/

require_once( 'settings.inc.php' );
require_once( 'connect.inc.php' );
require_once( 'dbutils.inc.php' );
require_once( 'utilities.inc.php' );




?>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta http-equiv="content-language" content="en" />
<title>
<?php
/**************************************************************/

if (isset($_REQUEST["action"])) {  // Action

	$action = $_REQUEST["action"] + 0; // Action code

	/* -------------------------------------------------------- */

	if ($action == 1) { 
	
		$lang = $_REQUEST["lang"];
		$langname = getLanguage($lang);

		echo $langname;
	
	} // $action == 1
	
	/* -------------------------------------------------------- */
	
	elseif ($action == 2) { 
	
		$lang = $_REQUEST["lang"];
		$langname = getLanguage($lang);
		
        echo $langname;
	
	} // $action == 2
	
	/* -------------------------------------------------------- */
	
	elseif ($action == 3) { 
			$text = $_REQUEST["text"];
		$texttitle = get_first_value('select TxTitle as value from ' . $tbpref . 'texts where TxID = ' . $text);

		echo tohtml($texttitle); 
	} // $action == 3
	
	/* -------------------------------------------------------- */
	
	
} // isset($_REQUEST["action"])

/**************************************************************/

?>
</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="apple-touch-icon" href="img/apple-touch-icon-57x57.png" />
<link rel="apple-touch-icon" sizes="72x72" href="img/apple-touch-icon-72x72.png" />
<link rel="apple-touch-icon" sizes="114x114" href="img/apple-touch-icon-114x114.png" />
<link rel="apple-touch-startup-image" href="img/apple-touch-startup.png">
<meta name="apple-touch-fullscreen" content="YES" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<style type="text/css" media="screen">
@import "./iui/iui.css";
span.status1 {
	background-color: #F5B8A9;
}
span.status2 {
	background-color: #F5CCA9;
}
span.status3 {
	background-color: #F5E1A9;
}
span.status4 {
	background-color: #F5F3A9;
}
span.status5 {
	background-color: #DDFFDD;
}

.word, .mword
{
    display: inline-block;
    position: relative;
    max-width: 240px;
    text-align: center;
    font-size: 26px;
    margin-right: 5px;
    font-weight: bold;
    vertical-align: top;
}
:after
{
    display: block !important;
    text-align: center;
    overflow-x: hidden;
    font-size: 14px;
    font-weight: normal;
    max-width: 240px !important;
}

.texttags span
{
    color: #888;
    margin-right: 10px;
}
</style>

</head>
<body>

<div class="toolbar">
	<h1 id="pageTitle"></h1>
	<a id="backButton" class="button" href="#"></a>
	<a class="button" href="mobile.php" target="_self">Home</a>
</div>


<?php
/**************************************************************/

if (isset($_REQUEST["action"])) {  // Action

	$action = $_REQUEST["action"] + 0; // Action code

	/* -------------------------------------------------------- */

	if ($action == 1) { 
	
		$lang = $_REQUEST["lang"];
		$langname = getLanguage($lang);

		?>
		
		<ul id="<?php echo $action . '-' . $lang; ?>" title="<?php echo tohtml($langname); ?>" selected="true" class="listing">
			<li class="group"><?php echo tohtml($langname); ?> Texts</li>
			<li><a href="mobile.php?action=2&amp;lang=<?php echo $lang; ?>">All <?php echo tohtml($langname); ?> Texts</a></li>					
			<li><a href="mobile.php#notyetimpl">Text Tags</a></li>					
			<li class="group"><?php echo tohtml($langname); ?> Terms</li>
			<li><a href="mobile.php#notyetimpl">All <?php echo tohtml($langname); ?> Terms</a></li>					
			<li><a href="mobile.php#notyetimpl">Term Tags</a></li>					
		</ul>
		
		<?php
	
	} // $action == 1
	
	/* -------------------------------------------------------- */
	
	elseif ($action == 2) { 
	
		$lang = $_REQUEST["lang"];
		$langname = getLanguage($lang);
		$sql = 'select TxID, TxTitle from ' . $tbpref . 'texts where TxLgID = ' . $lang . 
		' order by TxID';
		$res = do_mysqli_query($sql);

		?>

		<ul id="<?php echo $action . '-' . $lang; ?>" title="All <?php echo tohtml($langname); ?> Texts" selected=true class="listing">

		<?php

		while ($record = mysqli_fetch_assoc($res)) {
			echo '<li><a href="mobile.php?action=3&amp;lang=' . 
				$lang . '&amp;text=' . $record["TxID"] . '">' .
				tohtml($record["TxTitle"]) . '</a>' . getTextTagsAsFlatLine($record["TxID"]) .'</li>';	
		}

		?>

		</ul>
		<?php
		mysqli_free_result($res);
	
	} // $action == 2
	
	/* -------------------------------------------------------- */
	
	elseif ($action == 3) { 
	
		$lang = $_REQUEST["lang"];
		$text = $_REQUEST["text"];
		$texttitle = get_first_value('select TxTitle as value from ' . $tbpref . 'texts where TxID = ' . $text);
		$textaudio = get_first_value('select TxAudioURI as value from ' . $tbpref . 'texts where TxID = ' . $text);
        $sourceuri = get_first_value('select TxSourceURI as value from ' . $tbpref . 'texts where TxID = ' . $text);
		$sql = 'select SeID, SeText from ' . $tbpref . 'sentences where SeTxID = ' . $text . ' order by SeOrder';
		$res = do_mysqli_query($sql);

		?>

		<ul id="<?php echo $action . '-' . $text; ?>" title="<?php echo tohtml($texttitle); ?>" selected="true">
		<li class="group">Title</li>
		<li><?php echo tohtml($texttitle); ?>
        <br /><a href="<?php echo $sourceuri; ?>"><?php echo $sourceuri; ?></a></li>
        
        <li class="group">Tags:</li>
        <li>
        <?php echo getTextTags($text); ?>
        </li>
		<?php

		if (isset($textaudio) && trim($textaudio) != '') {

		?>


        
		<li class="group">Audio</li>
		<li>Play: <audio src="<?php echo trim($textaudio); ?>" controls></audio></li>

		<?php

		}

		?>

		<li class="group">Text</li>

		<?php
		
		// while ($record = mysqli_fetch_assoc($res)) {
			// if (trim($record["SeText"]) != '¶')
			 // echo '<li><a href="mobile.php?action=4&amp;lang=' . 
				// $lang . '&amp;text=' . $text . 
				// '&amp;sent=' . $record["SeID"] . '">' .
				// tohtml($record["SeText"]) . '</a></li>';	
		// }
        
        $data_trans=$ann_exists?'data_ann':'data_trans';
$pseudo_element=($mode_trans<3)?'after':'before';
$ruby=($mode_trans==2 || $mode_trans==4)?1:0;
$displaystattrans=getSettingWithDefault('set-display-text-frame-term-translation');
echo "<style>\n";
$stat_arr = array(1,2,3,4,5,98,99);
foreach ($stat_arr as $value) {
	if(checkStatusRange($value, $displaystattrans))echo '.wsty.status',$value,':',$pseudo_element,',.tword.content',$value,':',$pseudo_element,'{content: attr(',$data_trans,');}',"\n",'.tword.content',$value,':',$pseudo_element,'{color:rgba(0,0,0,0)}',"\n";
}
if($ruby){echo '.wsty {',($mode_trans==4?'margin-top: 0.2em;':'margin-bottom: 0.2em;'),'text-align: center;display: inline-block;',($mode_trans==2?'vertical-align: top;':''),'}',"\n";}
if($ruby)echo '.wsty:',$pseudo_element,'{display: block !important;',($mode_trans==2?'margin-top: -0.05em;':'margin-bottom:  -0.15em;'),'}',"\n";
$ann_textsize=array(100 => 50, 150 => 50,200 => 40, 250 => 25);
echo '.tword:',$pseudo_element,',.wsty:',$pseudo_element,'{',($ruby?'text-align: center;':''),'font-size:' . $ann_textsize[$textsize] . '%;',($mode_trans==1?'margin-left: 0.2em;':''),($mode_trans==3?'margin-right: 0.2em;':''),($ann_exists?'':'overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:inline-block;vertical-align:-25%;'),'}',"\n",'.hide{display:none !important;}.tword:',$pseudo_element,($ruby?',.word:':',.wsty:'),$pseudo_element,'{max-width:15em;}</style>';

echo '<div id="thetext" ' .  ($rtlScript ? 'dir="rtl"' : '') . '><p style="' . ($removeSpaces ? 'word-break:break-all;' : '') . 
'font-size:' . $textsize . '%;line-height: ',($ruby?'1':'1.4'),'; margin-bottom: 10px;">';

$currcharcount = 0;

$sql = 'select CASE WHEN `Ti2WordCount`>0 THEN Ti2WordCount ELSE 1 END as Code, CASE WHEN CHAR_LENGTH(Ti2Text)>0 THEN Ti2Text ELSE `WoText` END as TiText, CASE WHEN CHAR_LENGTH(Ti2Text)>0 THEN lower(Ti2Text) ELSE `WoTextLC` END as TiTextLC, Ti2Order as TiOrder,Ti2SeID as TiSeID,CASE WHEN `Ti2WordCount`>0 THEN 0 ELSE 1 END as TiIsNotWord, CASE WHEN CHAR_LENGTH(Ti2Text)>0 THEN CHAR_LENGTH(Ti2Text) ELSE CHAR_LENGTH(`WoTextLC`) END as TiTextLength, WoID, WoText, WoStatus, WoTranslation, WoRomanization from (' . $tbpref . 'textitems2 left join ' . $tbpref . 'words on (Ti2WoID = WoID)) where Ti2TxID = ' . $_REQUEST['text'] . ' order by Ti2Order asc, Ti2WordCount desc';

$hideuntil = -1;
$hidetag = '';
$cnt = 1;
$sid = 0;

$res = do_mysqli_query($sql);

while ($record = mysqli_fetch_assoc($res)) {  // MAIN LOOP
	if($sid != $record['TiSeID']){
		if($sid != 0){
			echo '</span>';
		}
		$sid = $record['TiSeID'];
		echo '<span id="sent_',$sid,'">';
	}
	$actcode = $record['Code'] + 0;
	$spanid = 'ID-' . $record['TiOrder'] . '-' . $actcode;

	if ( $hideuntil > 0  ) {
		if ( $record['TiOrder'] <= $hideuntil )
			$hidetag = ' hide';
		else {
			$hideuntil = -1;
			$hidetag = '';
		}
	}				
	
	if($cnt<$record['TiOrder']){
		echo '<span id="ID-' . $cnt++ . '-1"></span>';
	}
	if ($record['TiIsNotWord'] != 0) {  // NOT A TERM
	
		echo '<span id="' . $spanid . '" class="' . 
			$hidetag . '">' . 
			str_replace(
			"¶",
			'<br />',
			tohtml($record['TiText'])) . '</span>';
			
	}  // $record['TiIsNotWord'] != 0  --  NOT A TERM
	
	/////////////////////////////////////////////////
	
	else {   // $record['TiIsNotWord'] == 0  -- A TERM
	
		if ($actcode > 1) {   // A MULTIWORD FOUND
		
			//$titext[$actcode] = $record['TiText'];
			
			if (isset($record['WoID'])) {  // MULTIWORD FOUND - DISPLAY (Status 1-5, display)
			
				if (! $showAll) {
					if ($hideuntil == -1) {
						$hideuntil = $record['TiOrder'] + ($record['Code'] - 1) * 2;
					}
				}
								
?><span id="<?php echo $spanid; ?>" class="<?php echo $hidetag; ?> click mword <?php echo ($showAll ? 'mwsty' : 'wsty'); ?> <?php echo 'order'. $record['TiOrder']; ?> <?php echo 'word'. $record['WoID']; ?> <?php echo 'status'. $record['WoStatus']; ?> TERM<?php echo strToClassName($record['TiTextLC']); ?>" data_pos="<?php echo $currcharcount; ?>" data_order="<?php echo $record['TiOrder']; ?>" data_wid="<?php echo $record['WoID']; ?>" data_trans="<?php echo tohtml(repl_tab_nl("["                                                  . $record['WoRomanization'] . "] " .$record['WoTranslation'])); ?>" data_rom="<?php echo tohtml($record['WoRomanization']); ?>" data_status="<?php echo $record['WoStatus']; ?>"  data_code="<?php echo $record['Code']; ?>" data_text="<?php echo tohtml($record['TiText']); ?>"><?php echo ($showAll ? ('&nbsp;' . $record['Code'] . '&nbsp;') : tohtml($record['TiText'])); ?></span><?php	

			}
						
		} // ($actcode > 1) -- A MULTIWORD FOUND

		////////////////////////////////////////////////
		
		else {  // ($actcode == 1)  -- A WORD FOUND
		
			if (isset($record['WoID'])) {  // WORD FOUND STATUS 1-5,98,99

?><span id="<?php echo $spanid; ?>" class="<?php echo $hidetag; ?> click word wsty <?php echo 'word'. $record['WoID']; ?> <?php echo 'status'. $record['WoStatus']; ?> TERM<?php echo strToClassName($record['TiTextLC']); ?>" data_pos="<?php echo $currcharcount; ?>" data_order="<?php echo $record['TiOrder']; ?>" data_wid="<?php echo $record['WoID']; ?>" data_trans="<?php echo tohtml(repl_tab_nl( "[". $record['WoRomanization'] . "] " . $record['WoTranslation'])); ?>" data_rom="<?php echo tohtml($record['WoRomanization']); ?>" data_status="<?php echo $record['WoStatus']; ?>"><?php echo tohtml($record['TiText']); ?></span><?php	

			}   // WORD FOUND STATUS 1-5,98,99
			
			////////////////////////////////////////////////
			
			else {    // NOT A WORD AND NOT A MULTIWORD FOUND - STATUS 0
			
?><span id="<?php echo $spanid; ?>" class="<?php echo $hidetag; ?> click word wsty status0 TERM<?php echo strToClassName($record['TiTextLC']); ?>" data_pos="<?php echo $currcharcount; ?>" data_order="<?php echo $record['TiOrder']; ?>" data_trans="" data_rom="" data_status="0" data_wid=""><?php echo tohtml($record['TiText']); ?></span><?php	

			}  // NOT A WORD AND NOT A MULTIWORD FOUND - STATUS 0
			
			//$titext = array('','','','','','','','','','','');
			
		}  // ($actcode == 1)  -- A WORD FOUND
		
	} // $record['TiIsNotWord'] == 0  -- A TERM
	
	if ($actcode == 1){ $currcharcount += $record['TiTextLength']; $cnt++;}
	
} // while ($record = mysql_fetch_assoc($res))  -- MAIN LOOP

		?>
		
		</ul>

		<?php
		
		mysqli_free_result($res);
	
	} // $action == 3
	
	/* -------------------------------------------------------- */
	
	elseif ($action == 4 || $action == 5) { 
	
		$lang = $_REQUEST["lang"];
		$text = $_REQUEST["text"];
		$sent = $_REQUEST["sent"];
		$senttext = get_first_value('select SeText as value from ' . $tbpref . 'sentences where SeID = ' . $sent);
		$nextsent = get_first_value('select SeID as value from ' . $tbpref . 'sentences where SeTxID = ' . $text . ' and trim(SeText) != \'¶\' and SeID > ' . $sent . ' order by SeID limit 1');
		$sql = 'select CASE WHEN Ti2WordCount>0 THEN Ti2WordCount ELSE 1 END as Code, CASE WHEN CHAR_LENGTH(Ti2Text)>0 THEN Ti2Text ELSE WoText END as TiText, Ti2Order, CASE WHEN Ti2WordCount > 0 THEN 0 ELSE 1 END as TiIsNotWord, WoID, WoTranslation, WoRomanization, WoStatus from (' . $tbpref . 'textitems2 left join ' . $tbpref . 'words on (Ti2WoID = WoID) and (Ti2LgID = WoLgID)) where Ti2SeID = ' . $sent . ' order by Ti2Order asc, Ti2WordCount desc';
		$res = do_mysqli_query($sql);
		
		if ($action == 4) {
		?>

		<ul id="<?php echo $action . '-' . $sent; ?>" title="<?php echo tohtml($senttext); ?>">
		
		<?php
		
		}
		
		?>
		
		<li class="group">Sentence</li>
		<li><?php echo tohtml($senttext); ?></li>
		<li class="group">Terms</li>

		<?php
		
		$saveterm = '';
		$savetrans = '';
		$saverom = '';
		$savestat = '';
		$until = 0;
		while ($record = mysqli_fetch_assoc($res)) {
			$actcode = $record['Code'] + 0;
			$order = $record['Ti2Order'] + 0;
			
			if ( $order <= $until ) {
				continue;
			}
			if ( $order > $until ) {
				if (trim($saveterm) != '') {
					$desc = trim(($saverom != '' ? '[' . $saverom . '] ' : '') . $savetrans);
					echo '<li><span class="status' . $savestat . '">' . tohtml($saveterm) . '</span>' . 
						tohtml($desc != '' ? ' → ' . $desc : '') . '</li>';	
				}
				$saveterm = '';
				$savetrans = '';
				$saverom = '';
				$savestat = '';
				$until = $order;
			}
			if ($record['TiIsNotWord'] != 0 && trim($record['TiText']) != '') {
				echo '<li>' . tohtml($record['TiText']) . '</li>';
			}
			else {
				$until = $order + 2 * ($actcode-1);                
				$saveterm = $record['TiText'];
				$savetrans = '';
				if(isset($record['WoID'])) {
					$savetrans = $record['WoTranslation'];
					if ($savetrans == '*') $savetrans = '';
				}
				$saverom = trim(isset($record['WoRomanization']) ?
					$record['WoRomanization'] : "");
				$savestat = $record['WoStatus'];
			}
		} 
		mysqli_free_result($res);
		if (trim($saveterm) != '') {
			$desc = trim(($saverom != '' ? '[' . $saverom . '] ' : '') . $savetrans);
			echo '<li><span class="status' . $savestat . '">' . tohtml($saveterm) . '</span>' . 
				tohtml($desc != '' ? ' → ' . $desc : '') . '</li>';	
		}
		
		if (isset($nextsent)) {
			echo '<li><a target="_replace" href="mobile.php?action=5&amp;lang=' . 
				$lang . '&amp;text=' . $text . 
				'&amp;sent=' . $nextsent . '">Next Sentence</a></li>';
		}

		if ($action == 4) {
		
		?>
		
		</ul>

		<?php
		
		}
		
	} // $action == 4 / 5
	
	/* -------------------------------------------------------- */
	
} // isset($_REQUEST["action"])

/**************************************************************/

else
{

?>
<ul id="home" title="Mobile LWT" selected="true" >
	<li class="group">Languages</li>
<?php
	$sql = 'select LgID, LgName from ' . $tbpref . 'languages where LgName<>"" order by LgName';
	$res = do_mysqli_query($sql);
	while ($record = mysqli_fetch_assoc($res)) {
		echo '<li><a href="mobile.php?action=2&amp;lang=' . $record["LgID"] . '">' .
			tohtml($record["LgName"]) . '</a></li>';	
	}
	mysqli_free_result($res);
?>
	<li class="group">Other</li>
	<li><a href="#about">About</a></li>
	<li><a href="index.php" target="_self">LWT Standard Version</a></li>

</ul>
<?php
	
} // No Action = Start screen

?>


<div id="about" title="About">
	<p style="text-align:center; margin-top:50px;">
This is "Learning With Texts" (LWT) for Mobile Devices<br />Version <?php echo get_version(); ?><br /><br />"Learning with Texts" (LWT) is released into the Public Domain. This applies worldwide. In case this is not legally possible, any entity is granted the right to use this work for any purpose, without any conditions, unless such conditions are required by law.<br /><br /> Developed with the <a href="http://iui-js.org" target="_self">iUI Framework</a>.<br /><br /><b>Back to<br/><a href="index.php" target="_self">LWT Standard Version</a></b>
	</p>
</div>

<div id="notyetimpl" title="Sorry...">
	<p style="text-align:center; margin-top:50px;">Not yet implemented!</p>
</div>

</body>
</html>

