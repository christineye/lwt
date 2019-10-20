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
<?xml version='1.0' encoding='utf-8'?>
<html xmlns="http://www.w3.org/1999/xhtml">
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
<style type="text/css" media="screen">

@import "./iui/iui.css";

.t1  { border-bottom: 5px solid rgba(252,199,189,.8); } .t2  { border-bottom: 5px solid rgba(252, 230, 176, .8); } .t3  {border-bottom: 5px solid rgba(188, 252, 176, .8); } .t4  { border-bottom: 5px solid rgba(176, 246, 252, .8); } .t1.s1, .s1 .t1 { background-color: #fcc7bd; } .t2.s1, .s1 .t2 { background-color: #fce6b0; } .t3.s1, .s1 .t3 { background-color: #bcfcb0; } .t4.s1, .s1 .t4 { background-color: #b0f6fc; } .mword:after {margin-top:10px;}
#thetext{
   font-size: 32px;
   font-weight: 400;
       font-family:  "Lucida Grande",Arial,"Microsoft YaHei", mingLiu;
}
.wsty
{
    display: inline-block;
    position: relative;
    max-width: 400px;
    text-align: center; 
    margin-right: 5px;
    vertical-align: top;
    margin-bottom: 5px;
}
:after
{
    display: block !important;
    text-align: center;
    overflow-x: hidden;
    font-size: 14px;
    font-weight: normal;
    max-width: 400px !important;
}

.texttags span
{
    color: #888;
    margin-right: 10px;
}

.tword.content1:after{color:rgba(0,0,0,0)}
.tword:after,.wsty:after{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:inline-block;vertical-align:-25%;}
.hide{display:none !important;}.tword:after,.wsty:after{max-width:15em;}



<?php

$sql = 'select distinct WoID, WoText, WoStatus, WoTranslation, WoRomanization from (' . $tbpref . 'textitems2 left join ' . $tbpref . 'words on (Ti2WoID = WoID)) where Ti2TxID = ' . $_REQUEST['text'];

$res = do_mysqli_query($sql);
while ($record = mysqli_fetch_assoc($res)) {  // MAIN LOOP

	if ($record['WoStatus'] == 1)
	{
		echo ".w" . $record['WoID'] .  ":after{content: '" . "[" . $record['WoRomanization'] . ']' . str_replace("'", "\'", tohtml($record['WoTranslation'])). "';}";
	}
	
} // while ($record = mysql_fetch_assoc($res))  -- MAIN LOOP
?>

</style>

</head>
<body>

<div class="toolbar">
	<h1 id="pageTitle"></h1>
	<a id="backButton" class="button" href="#"></a>
	<a class="button" href="index.php" target="_self">Home</a>
</div>
<div>

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
	
		$print = false;
		if (isset($_REQUEST["print"])) 
		{
			$print = $_REQUEST["print"];
		}
	
		$lang = $_REQUEST["lang"];
		$text = $_REQUEST["text"];
		$texttitle = get_first_value('select TxTitle as value from ' . $tbpref . 'texts where TxID = ' . $text);
		$textaudio = get_first_value('select TxAudioURI as value from ' . $tbpref . 'texts where TxID = ' . $text);
        $sourceuri = get_first_value('select TxSourceURI as value from ' . $tbpref . 'texts where TxID = ' . $text);
		$sql = 'select SeID, SeText from ' . $tbpref . 'sentences where SeTxID = ' . $text . ' order by SeOrder';
		$res = do_mysqli_query($sql);

		?>

		
		
		<h1><?php echo tohtml($texttitle); ?></h1>
        <br /><a class="source" href="<?php echo $sourceuri; ?>"><?php echo $sourceuri; ?></a>
        <?php echo getPreviousAndNextTextLinks($text, 'mobile.php?action=3&text=', FALSE, '&nbsp; | &nbsp;'); ?>
		
        <br />
        <?php echo getTextTags($text); ?>
   
		<?php

		if (isset($textaudio) && trim($textaudio) != '') {

		?>


        
		<li class="group">Audio</li>
		Play: <audio src="<?php echo trim($textaudio); ?>" controls></audio>

		<?php

		}

		?>

		<hr />

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
// echo "<style>\n";
// $stat_arr = array(1,2,3,4,5,98,99);
// foreach ($stat_arr as $value) {
	// if(checkStatusRange($value, $displaystattrans))echo '.wsty.status',$value,':',$pseudo_element,',.tword.content',$value,':',$pseudo_element,'{content: attr(',$data_trans,');}',"\n",'.tword.content',$value,':',$pseudo_element,'{color:rgba(0,0,0,0)}',"\n";
// }
// if($ruby){echo '.wsty {',($mode_trans==4?'margin-top: 0.2em;':'margin-bottom: 0.2em;'),'text-align: center;display: inline-block;',($mode_trans==2?'vertical-align: top;':''),'}',"\n";}
// if($ruby)echo '.wsty:',$pseudo_element,'{display: block !important;',($mode_trans==2?'margin-top: -0.05em;':'margin-bottom:         -0.15em;'),'}',"\n";
// $ann_textsize=array(100 => 50, 150 => 50,200 => 40, 250 => 25);
// echo '.tword:',$pseudo_element,',.wsty:',$pseudo_element,'{',($ruby?'text-align: center;':''),($mode_trans==1?'margin-left: 0.2em;':''),($mode_trans==3?'margin-right: 0.2em;':''),($ann_exists?'':'overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:inline-block;vertical-align:-25%;'),'}',"\n",'.hide{display:none !important;}.tword:',$pseudo_element,($ruby?',.word:':',.wsty:'),$pseudo_element,'{max-width:15em;}</style>';

echo '<div id="thetext" ' .  ($rtlScript ? 'dir="rtl"' : '') . '><p style="' . ($removeSpaces ? 'word-break:break-all;' : '') . 
'line-height: ',($ruby?'1':'1.4'),'; margin-bottom: 10px;">';

$currcharcount = 0;

$sql = 'select CASE WHEN `Ti2WordCount`>0 THEN Ti2WordCount ELSE 1 END as Code, CASE WHEN CHAR_LENGTH(Ti2Text)>0 THEN Ti2Text ELSE `WoText` END as TiText, CASE WHEN CHAR_LENGTH(Ti2Text)>0 THEN lower(Ti2Text) ELSE `WoTextLC` END as TiTextLC, Ti2Order as TiOrder,Ti2SeID as TiSeID,CASE WHEN `Ti2WordCount`>0 THEN 0 ELSE 1 END as TiIsNotWord, CASE WHEN CHAR_LENGTH(Ti2Text)>0 THEN CHAR_LENGTH(Ti2Text) ELSE CHAR_LENGTH(`WoTextLC`) END as TiTextLength, WoID, WoText, WoStatus, WoTranslation, WoRomanization from (' . $tbpref . 'textitems2 left join ' . $tbpref . 'words on (Ti2WoID = WoID)) where Ti2TxID = ' . $_REQUEST['text'] . ' order by Ti2Order asc, Ti2WordCount desc';

$hideuntil = -1;
$hidetag = false;
$cnt = 1;
$sid = 0;

$res = do_mysqli_query($sql);

while ($record = mysqli_fetch_assoc($res)) {  // MAIN LOOP
	
	$actcode = $record['Code'] + 0;
	$spanid = 'ID-' . $record['TiOrder'] . '-' . $actcode;

	if ( $hideuntil > 0  ) {
		if ( $record['TiOrder'] <= $hideuntil )
			$hidetag = true;
		else {
			$hideuntil = -1;
			$hidetag = false;
		}
	}				
	
	if($cnt<$record['TiOrder']){
		$cnt++;
	}
	if ($record['TiIsNotWord'] != 0) {  // NOT A TERM
	
		echo  
			str_replace(
			"¶",
			'<br />',
			tohtml($record['TiText']));
			
	}  // $record['TiIsNotWord'] != 0  --  NOT A TERM
	
	/////////////////////////////////////////////////
	
	else {   // $record['TiIsNotWord'] == 0  -- A TERM
	
		if ($actcode > 1) {   // A MULTIWORD FOUND
		
			//$titext[$actcode] = $record['TiText'];
			
			if (isset($record['WoID']) and 
				(!$print or $record['WoStatus'] == 1)) {  // MULTIWORD FOUND - DISPLAY (Status 1, display)
			
				if (! $showAll) {
					if ($hideuntil == -1) {
						$hideuntil = $record['TiOrder'] + ($record['Code'] - 1) * 2;
					}
				}
								
								if (!$hidetag)
{
?><span class="<?php echo $hidetag; ?> mword <?php echo ($showAll ? 'mwsty' : 'wsty'); ?> <?php echo 'w'. $record['WoID']; ?> <?php echo 's'. $record['WoStatus']; ?>"><?php 

if ($showAll)
{
	echo '&nbsp;' . $record['Code'] . '&nbsp;';
}
else
{
	$chrArray = preg_split('//u', $record['TiText'], -1, PREG_SPLIT_NO_EMPTY);
	$pinyins = explode(" ", $record['WoRomanization']);
	
	foreach($chrArray as $i => $item) {
			$tone = 0;
			
			if (preg_match("/[āēīōūǖĀĒĪŌŪǕ1]/u",$pinyins[$i] ))
			{
				$tone = 1;
			}
			else if (preg_match("/[áéíóúǘÁÉÍÓÚǗ2]/u", $pinyins[$i]))
			{
				$tone = 2;
			}
			else if (preg_match("/[ǎěǐǒǔǚǍĚǏǑǓǙ3]/u", $pinyins[$i]))
			{
				$tone = 3;
			}
			else if (preg_match("/[àèìòùǜÀÈÌÒÙǛ4]/u", $pinyins[$i]))
			{
				$tone = 4;
			}
			
	echo "<span class='t" . $tone . "'>" . $item . "</span>";
	}
}

 ?></span><?php	
}
			}
						
		} // ($actcode > 1) -- A MULTIWORD FOUND

		////////////////////////////////////////////////
		
		else {  // ($actcode == 1)  -- A WORD FOUND
		
			if (isset($record['WoID']) and 
			(!$print or $record['WoStatus'] == 1)) {  // WORD FOUND STATUS 1-5,98,99
			
			$tone = 0;
			
			if (preg_match("/[āēīōūǖĀĒĪŌŪǕ1]/u", $record['WoRomanization']))
			{
				$tone = 1;
			}
			else if (preg_match("/[áéíóúǘÁÉÍÓÚǗ2]/u", $record['WoRomanization']))
			{
				$tone = 2;
			}
			else if (preg_match("/[ǎěǐǒǔǚǍĚǏǑǓǙ3]/u", $record['WoRomanization']))
			{
				$tone = 3;
			}
			else if (preg_match("/[àèìòùǜÀÈÌÒÙǛ4]/u", $record['WoRomanization']))
			{
				$tone = 4;
			}
				
if (!$hidetag)
{
?><span class="wsty <?php echo 'w'. $record['WoID']; ?> <?php echo 't'. $tone . ' s'. $record['WoStatus']; ?>"><?php echo tohtml($record['TiText']) ?></span><?php	
}
			}   // WORD FOUND STATUS 1-5,98,99
			
			////////////////////////////////////////////////
			
			else {    // NOT A WORD AND NOT A MULTIWORD FOUND - STATUS 0
			if (!$hidetag)
			{
			 echo tohtml($record['TiText']); 
			}?><?php	

			}  // NOT A WORD AND NOT A MULTIWORD FOUND - STATUS 0
			
			//$titext = array('','','','','','','','','','','');
			
		}  // ($actcode == 1)  -- A WORD FOUND
		
	} // $record['TiIsNotWord'] == 0  -- A TERM
	
	if ($actcode == 1){ $currcharcount += $record['TiTextLength']; $cnt++;}
	
} // while ($record = mysql_fetch_assoc($res))  -- MAIN LOOP

		?>
		

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

</div>
</body>
</html>

