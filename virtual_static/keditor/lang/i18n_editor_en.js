(function(_global_key){
 function I18N(){
	this.words = this.init();
	this.regexp = /%\((\d+)\)s/g;
	this.reg_format = /\{\{([^\}]+)\}\}/g;
	this.language = "en";
}
I18N.prototype={
	"get":function(){
		var args = [];
		for(var i = 0; i < arguments.length; i++) args.push(arguments[i]);
		var key = args.shift();
		var val = this.words[key];
		if(val == null) val = "";
		if(typeof val != 'string') return val;
		if(args.length > 0){
			val = val.replace(this.regexp, function($1, $2){return args[$2 - 1];});
		}
		return val;
	}
	,"format":function(template, iswrite){
		var html = template;
		var _self = this;
		html = html.replace(this.reg_format, function($1, $2){
			var keys = $2.split('|');
			var val = _self.words[keys[0]];
			if(val) return val;
			else return keys[1]||keys[0];
		})
		if(iswrite) document.write(html);
		else return html;
	}
	,"write":function(){
		document.write(this.get.apply(this, arguments));
	}
	,"get_string":function(key){
		var val = this.words[key];
		if(val == null) val = key;
		return val;
	}
	,"write_string":function(key){
		document.write(this.get_string(key));
	}
};
I18N.prototype.g = I18N.prototype.get;
I18N.prototype.f = I18N.prototype.format;
I18N.prototype.w = I18N.prototype.write;
I18N.prototype.gs = I18N.prototype.get_string;
I18N.prototype.ws = I18N.prototype.write_string;
I18N.prototype.init = function(){
	return {
"tx_fontfamily-title":"Font"
,"tx_fontsize-title":"Font Size"
,"tx_bold-title":"Bold (Ctrl+B)"
,"tx_bold":"Bold"
,"tx_underline-title":"Underline (Ctrl+U)"
,"tx_underline":"Underline"
,"tx_italic-title":"Italic (Ctrl+I)"
,"tx_italic":"Italic"
,"tx_strike-title":"Strike (Ctrl+D)"
,"tx_strike":"Strike"
,"tx_forecolor":"Font Color"
,"tx_forecolor-arrow":"Select Font Color"
,"tx_backcolor":"Text Background"
,"tx_backcolor-arrow":"Select Text Background"
,"tx_alignleft-title":"Align left"
,"tx_alignleft":"Align left"
,"tx_aligncenter-title":"Align center"
,"tx_aligncenter":"Align center"
,"tx_alignright-title":"Align right"
,"tx_alignright":"Align right"
,"tx_alignfull":"Align both"
,"tx_indent-title":"Indent"
,"tx_indent":"Indent"
,"tx_outdent-title":"Outdent"
,"tx_outdent":"Outdent"
,"tx_lineheight":"Line Spacing"
,"tx_lineheight-arrow":"Select Line Spacing"
,"tx_styledlist":"List"
,"tx_styledlist-arrow":"Select List"
,"tx_link-title":"Link"
,"tx_link":"Link"
,"tx_specialchar":"Special Character"
,"tx_table":"Create Table"
,"tx_horizontalrule":"Dividing line"
,"tx_richtextbox":"Text Box"
,"tx-menu-simple":"Simple Selection"
,"tx-menu-advanced":"Select directly"
,"tx_quote-title":"Quote"
,"tx_quote":"Quote"
,"tx_undo-title":"Undo (Ctrl+Z)"
,"tx_undo":"Undo"
,"tx_redo-title":"Re-run (Ctrl+Y)"
,"tx_redo":"Re-run"
,"tx_switchertoggle-title":"Editor Type"
,"tx_switchertoggle-editor":"Editor"
,"tx_switchertoggle-html":"HTML"
,"tx_fullscreen-title":"Wide Screen"
,"tx_fullscreen":"Wide Screen"
,"tx_advanced":"View Toolbar"
,"tx_mergecells":"Merge"
,"tx_insertcells":"Insert"
,"tx_deletecells":"Delete"
,"tx_cellslinepreview":"Line Preview"
,"tx_cellslinecolor":"Line Color"
,"tx_cellslineheight":"Thickness"
,"tx_cellslinestyle":"Line Type"
,"tx_cellsoutline":"Outline"
,"tx_tablebackcolor":"Table Background Color"
,"tx_tabletemplate":"테이블 서식"
,"menu.pallete.revert":"Default color"
,"adoptor.label":"ABC"
,"adoptor.transparent":"Transparency"
,"menu.pallete.enter":"Enter"
,"menu.pallete.more":"More"
,"setDataByJSONToEditor_error":"\r\nSwitching to the source view mode.\r\nPlease make sure the HTML is correct."
,"changeMode_error":"\r\nFailed to change the editor type.\r\nPlease make sure that HTML is valid."
,"attacher.only.wysiwyg.alert":"You can insert a text only in edit"
,"attacher.ins":"Insert"
,"attacher.del":"Delete"
,"attacher.delete.confirm":"삭제하시면 본문에서도 삭제됩니다. 계속하시겠습니까?"
,"attacher.delete.all.confirm":"모든 첨부 파일을 삭제하시겠습니까? 삭제하시면 본문에서도 삭제됩니다."
,"attacher.exist.alert":"이미 본문에 삽입되어 있습니다."
,"attacher.can.modify.alert":"기존에 등록된 #{title}을(를) 수정할 수 있는 화면으로 이동합니다."
,"attacher.can.modify.confirm":"#{title}은(는) 하나만 등록이 가능합니다.\r\n다시 올리시면 기존의 #{title}이(가) 삭제됩니다. 계속하시겠습니까?"
,"attacher.insert.alert":"You can insert only in edit"
,"attacher.capacity.alert":"용량을 초과하였습니다."
,"attacher.size.alert":"용량을 초과하여 더이상 등록할 수 없습니다."
,"embeder.alert":"You can insert only in edit"
,"switcher.wysiwyg":"Editor"
,"switcher.source":"HTML"
,"switcher.text":"Text"
,"font-size-l7":"ABCDEFG %(1)s"
,"font-size-l3":"ABC %(1)s"
,"font-size-l5":"ABCDEF %(1)s"
,"backcolor":"ABC"
,"insertcells-addRowUpper":"Add upper row"
,"insertcells-addRowBelow":"Add row below"
,"insertcells-addColLeft":"Add left"
,"insertcells-addColRight":"Add right"
,"deletecells-deleteRow":"Delete row"
,"deletecells-deleteCol":"Delete column"
,"mergecells-merge":"Merge"
,"mergecells-cancelmerge":"Split"
,"cellslinestyle.subtitle1":"No borders"
,"cellslinestyle.subtitle2":"Solid line"
,"cellslinestyle.subtitle3":"Dotted line"
,"cellslinestyle.subtitle4":"Small dotted line"
,"cellsoutline-all":"All border"
,"cellsoutline-out":"Outer border"
,"cellsoutline-in":"Inner border"
,"cellsoutline-top":"Top border"
,"cellsoutline-bottom":"Bottom border"
,"cellsoutline-left":"Left border"
,"cellsoutline-right":"Right border"
,"cellsoutline-none":"No borders"
,"styledlist.subtitle1":"Cancel"
,"styledlist.subtitle2":"Circle"
,"styledlist.subtitle3":"Square"
,"styledlist.subtitle4":"Number"
,"styledlist.subtitle5":"Roman numerals"
,"styledlist.subtitle6":"Alphabet"
,"insertlink.invalid.url":"Please enter the URL"
,"insertlink.link.alt":"Go to [#{title}]"
,"insertlink.title":"In the selected area, please enter the URL address"
,"insertlink.onclick.target":"Click target"
,"insertlink.target.blank":"New window"
,"insertlink.target.self":"Current window"
,"richtextbox.add":"Plus"
,"richtextbox.sub":"Minus"
,"richtextbox.alert":"Only the number of 1 to 20 can be entered."
,"richtextbox.bg.color":"Background color"
,"richtextbox.border.color":"Border color"
,"richtextbox.border.style":"Border style"
,"richtextbox.border.width":"Border width"
,"table.alert":"Only the number of 1 to 30 can be entered."
,"table.title.insert":"Insert table &nbsp;"
,"table.title.setDirectly":"Set the table directly"
,"table.title.col":"Columns"
,"table.title.row":"Rows"
,"emoticon.subtitle.person":"사람"
,"emoticon.subtitle.animal":"동식물"
,"emoticon.subtitle.thing":"사물"
,"emoticon.subtitle.etc":"기타"
,"specialchar.subtitle1":"Basic symbols"
,"specialchar.subtitle2":"Mathematical operator, Currency Symbols"
,"specialchar.subtitle3":"Circle symbol, bracket"
,"specialchar.subtitle4":"Japanese"
,"specialchar.subtitle5":"Roman and Greek"
,"file.title":"파일"
,"media.title":"Multimedia"
,"canvas.unload.message":"The written information was not saved. Do you wish to leave the page?"
,"canvas.unload.message.at.modify":"The written information was not saved. Do you wish to leave the page?"
,"align.image.align.center":"Align center"
,"align.image.align.full":"Align right posts"
,"align.image.align.left":"Align left"
,"align.image.align.right":"Align left posts"
,"align.text.align.center":"Align center"
,"align.text.align.full":"Align both"
,"align.text.align.left":"Align left"
,"align.text.align.right":"Align right"
,"table.noselect.alert":"You can use after selecting the table"
,"contextmenu.table.insertrowabove":"Insert Rows Above"
,"contextmenu.table.insertrowbelow":"Insert Rows Below"
,"contextmenu.table.insertcolleft":"Insert Columns to the Left"
,"contextmenu.table.insertcolright":"Insert Columns to the Right"
,"contextmenu.table.deleterow":"Delete row"
,"contextmenu.table.deletecol":"Delete column"
,"contextmenu.table.cellmerge":"Merge cells"
,"contextmenu.table.cellsplit":"Split cells"
,"contextmenu.table.samewidth":"Distribute Columns Evenly"
,"contextmenu.table.sameheight":"Distribute Rows Evenly"
,"contextmenu.table.samewh":"Distribute Columns/Rows Evenly"
,"contextmenu.table.propcell":"Cell Properties"
,"contextmenu.table.proptable":"Table Properties"
,"table-insert":"Insert"
,"table-sepa":"구분"
,"table-delete":"Delete"
,"table-merge":"Merge"
,"table-split":"Split"
,"table-same":"조정"
,"table-attr":"속성"
,"table.merge.confirm":"Merging into one cell will keep the upper-left most data only. "
,"table.merge.more.select.cells":"Please select two or more cells."
,"resetMerge_error":"You can only divide merged cells"
,"exitEditor_desc":"Editor area: Press Shift+Esc to exit the editor area"
,"fullscreen.attach.close.btn":"파일첨부박스"
,"fullscreen.noti.btn":"By general writing"
,"fullscreen.noti.span":"Pressing the Wide Write button again will return to the original writing window size. "
,"specialchar.title":"Selected symbols"
,"tx_image":"Picture"
,"tx_media":"External Contents"
,"error_editor_load":"Editor is not loaded. Please try again later"
,"error_editor_load_fail":"Failed to execute editor"
,"multimedia_popup_title":"Attach multimedia"
,"multimedia_popup_error":"\"You have accessed the wrong path."
,"multimedia_addr_error":"Please enter the correct address to the multimedia attachment."
,"multimedia_title":"Insert external content."
,"multimedia_desc":"Enter address after selecting inserting method below <span>multimedia </span>"
,"multimedia_html":"html(embed, object)"
,"multimedia_link":"Multimedia Link"
,"multimedia_source":"Source &nbsp;"
,"multimedia_input_link":"Enter Link"
,"multimedia_close":"<a href=\"#\" onclick=\"closeWindow();\" title=\"Close\" class=\"close_en\">Close</a>"
,"multimedia_reg":"<a href=\"#\" onclick=\"done();\" title=\"Register\" class=\"btnlink\">Register</a>"
,"image.title":"Picture"
,"image_paste_confirm":"Would you like to paste it as an image? \r\n( If you select Cancel, the local image is deleted.)"
,"_FONT_LIST":[
{ label: '<span f-style>맑은 고딕</span> (<span class="tx-txt">가나다라</span>)', title: '맑은 고딕', data: "'Malgun Gothic','맑은 고딕'", klass: '' },
{ label: '<span f-style>굴림</span> (<span class="tx-txt">가나다라</span>)', title: '굴림', data: 'Gulim,굴림', klass: '' },
{ label: '<span f-style>굴림체</span> (<span class="tx-txt">가나다라</span>)', title: '굴림체', data: '굴림체', klass: '' },
{ label: '<span f-style>돋움</span> (<span class="tx-txt">가나다라</span>)', title: '돋움', data: 'Dotum,돋움,sans-serif', klass: '' },
{ label: '<span f-style>돋움체</span> (<span class="tx-txt">가나다라</span>)', title: '돋움체', data: '돋움체', klass: '' },
{ label: '<span f-style>바탕</span> (<span class="tx-txt">가나다라</span>)', title: '바탕', data: 'Batang,바탕', klass: '' },
{ label: '<span f-style>궁서</span> (<span class="tx-txt">가나다라</span>)', title: '궁서', data: 'Gungsuh,궁서', klass: '' },
{ label: '<span f-style>궁서체</span> (<span class="tx-txt">가나다라</span>)', title: '궁서체', data: '궁서체', klass: '' },
{ label: '<span f-style>YoonGothic130</span> (<span class="tx-txt">가나다라</span>)', title: 'YoonGothic130', data: 'YoonGothic130', klass: '' },
{ label: '<span f-style>YoonGothic150</span> (<span class="tx-txt">가나다라</span>)', title: 'YoonGothic150', data: 'YoonGothic150', klass: '' },
{ label: '<span f-style>Arial</span> (<span class="tx-txt">abcde</span>)', title: 'Arial', data: 'Arial', klass: '' },
{ label: '<span f-style>Arial narrow</span> (<span class="tx-txt">abcde</span>)', title: 'Arial narrow', data: "'Arial narrow'", klass: '' },
{ label: '<span f-style>Courier new</span> (<span class="tx-txt">abcde</span>)', title: 'Courier new', data: "'Courier new'", klass: '' },
{ label: '<span f-style>Century gothic</span> (<span class="tx-txt">abcde</span>)', title: 'Century gothic', data: "'Century gothic'", klass: '' },
{ label: '<span f-style>Comic sans ms</span> (<span class="tx-txt">abcde</span>)', title: 'Comic sans ms', data: "'Comic sans ms'", klass: '' },
{ label: '<span f-style>Tahoma</span> (<span class="tx-txt">abcde</span>)', title: 'Tahoma', data: 'Tahoma', klass: '' },
{ label: '<span f-style>Segoe UI</span> (<span class="tx-txt">abcde</span>)', title: 'Segoe UI', data: "'Segoe UI'", klass: '' },
{ label: '<span f-style>Trebuchet MS</span> (<span class="tx-txt">abcde</span>)', title: 'Trebuchet MS', data: "'Trebuchet MS'", klass: '' },
{ label: '<span f-style>Verdana</span> (<span class="tx-txt">abcde</span>)', title: 'Verdana', data: 'Verdana', klass: '' },
{ label: '<span f-style>MS GOTHIC</span> (<span class="tx-txt">abcde</span>)', title: 'MS GOTHIC', data: "'MS GOTHIC'", klass: '' },
{ label: '<span f-style>MS PGOTHIC</span> (<span class="tx-txt">abcde</span>)', title: 'MS PGOTHIC', data: "'MS PGOTHIC'", klass: '' },
{ label: '<span f-style>宋体</span> (<span class="tx-txt">ABCDE</span>)', title: '宋体', data: 'SimSun', klass: '' }
]
,"_FONT_DEFAULT":{
color: "#000000",
fontFamily: "Segoe UI",
fontSize: "10pt",
backgroundColor: "#fff",
lineHeight:'normal ',
padding: "12px"
}
,"_FONT_SAMPLE":"(<span class=\"tx-txt\">ABCD</span>)"
,"image_popup_title":"Insert Picture"
,"image_popup_error":"You have accessed the wrong path."
,"image_popup_close":"<a href=\"#\" onclick=\"closeWindow();\" title=\"Close\" class=\"close\">Close</a>"
,"image_popup_submit":"<a href=\"#\" onclick=\"imageUpload();\" title=\"Register\" class=\"btnlink\">Register</a>"
,"image_popup_cancel":"<a href=\"#\" onclick=\"closeWindow();\" title=\"Cancel\" class=\"btnlink\">Cancel</a>"
,"tx-more-down":"tx-more-down"
,"tx-more-up":"tx-more-up"
,"btn_cancel":"#iconpath/btn_cancel_en.gif?open&v=2"
,"btn_confirm":"#iconpath/btn_confirm_en.gif?open&v=2"
,"btn_confirm_img":"btn_confirm_en.gif"
,"btn_cancel_img":"btn_cancel_en.gif"
,"tx-btn-confirm":"tx-btn-confirm en"
,"tx-btn-cancel":"tx-btn-cancel en"
,"tx-btn-confirm_txt":"Confirm"
,"tx-btn-cancel_txt":"Cancel"
,"tx-more-button":"tx-more-button en"
,"btn_l_cancel":"#iconpath/btn_l_cancel_en.gif?open&v=2"
,"btn_l_confirm":"#iconpath/btn_l_confirm_en.gif?open&v=2"
,"tx-enter":"tx-enter en"
,"btn_remove":"#iconpath/btn_remove_en.gif?open&v=2"
,"citation_img":"#iconpath/quote/citation%(1)s_en.gif?open&v=2"
,"popup_footer":"<div class=\"footer en\">"
,"table.detail.menual":"Direct input"
,"table.detail.style":"Choose style"
,"table.detail.cell_bg":"Background"
,"table.detail.border_style":"Border style"
,"table.detail.border_line":"Border width"
,"table.detail.border_color":"Border color"
,"table.detail.ok":"Confirm"
,"table.detail.cancel":"Cancel"
,"btn_down_arrow1":"More"
,"btn_up_arrow":"Insert"
,"btn_down_arrow":"Delete"
,"btn_down_arrow2":"More"
,"table.popup.ok":"Confirm"
,"table.popup.cancel":"Cancel"
,"table.popup.cellsplit.rowinsert":"Insert Rows"
,"table.popup.cellsplit.columninsert":"Insert Columns"
,"table.popup.cellattr.lineselect":"Select Border"
,"table.popup.cellattr.h_align":"Horizontal"
,"table.popup.cellattr.v_align":"Vertical"
,"cellattr_width":"너비"
,"cellattr_height":"높이"
,"cellattr.align.left":"Left"
,"cellattr.align.center":"Center"
,"cellattr.align.right":"Right"
,"cellattr.align.top":"Top"
,"cellattr.align.middle":"Center"
,"cellattr.align.bottom":"Bottom"
,"num_validation":"This is not a valid number. The number must be between 2 and 10."
,"num_validation_2-10":"The number must be between 2 and 10."
,"cellattr.btn_border1":"No borders"
,"cellattr.btn_border2":"All border"
,"cellattr.btn_border3":"Outer border"
,"cellattr.btn_border4":"Inner border"
,"cellattr.btn_border1.txt":"None"
,"cellattr.btn_border2.txt":"All"
,"cellattr.btn_border3.txt":"Out"
,"cellattr.btn_border4.txt":"In"
,"cellattr.align.default":"None"
,"table.detail.cell_padding":"Cell margins"
,"tx_spellcheck_dic":"Select spell check dictionary language"
,"tx_spellcheck":"Check spelling"
,"number.alert":"Only the number of %(1)s to %(2)s can be entered."
,"tx_switchertoggle-title-html":"HTML Type"
,"url_message":"Click to open in new window"
,"tx_fullscreen-title-2":"Original size"
,"image.image":"Image"
,"image.width":"Width"
,"image.height":"Height"
,"image.align":"Align"
,"image.ratio":"Keep the ratio"
,"image.select_image":"Please select an image."
,"image.property.title":"Image property"
,"image.origin_size":"Revert to Original"
,"image.layer.opacity":"Transparently"
,"image.paste.image":"Insert as image"
,"image.paste.html":"Insert as HTML"
,"jre_win32_install":"Reopen the form after checking available download. "
,"jre_win64_install":"Reopen the form after checking available download. "
,"contextmenu.table.cellcopy":"Copy table"
,"contextmenu.table.cellpaste":"Paste table contents"
,"tx_applet-title":"Advance"
,"image_editor.import":"Open"
,"image_editor.save.pc":"PC저장"
,"image_editor.insert.body":"Insert Image"
,"image_editor.font_list":"<option value=\"Arial\">Arial</option>\r\n<option value=\"Segoe UI\">Segoe UI</option>\r\n<option value=\"Tahoma\">Tahoma</option>\r\n<option value=\"맑은 고딕\">맑은 고딕</option>\r\n<option value=\"굴림\">굴림</option>\r\n<option value=\"LG스마트체 Bold\">LG스마트체 Bold</option>\r\n<option value=\"나눔고딕\">나눔고딕</option>\r\n<option value=\"나눔명조\">나눔명조</option>"
,"image_editor.alert_not_image":"This is not image files"
,"image_editor.paste_disc":"Available to open image file with paste or drag.<br>Images in Mail editing windows can be edited via the right mouse click."
,"image_editor.paste_disc.ie":"Available to open image file with paste or drag.<br>Images in Mail editing windows can be edited via the right mouse click."
,"image_editor.paste_disc.chrome":"Available to open image file with paste.<br>Images in Mail editing windows can be edited via the right mouse click."
,"image_editor.drop_alert":"Only one image can be processed."
,"image.jpeg_quality":"Adjusting image quality"
,"image.size":"Size"
,"image.upload_limit_canvas":"Image upload allowed capacity exceeded.(%(2)s).\r\nAttach the image after adjusting image quality."
,"image.upload_limit":"Image upload allowed capacity exceeded.(%(2)s)"
,"image_editor.selection_tool":"Selection Tool"
,"image_editor.crop_tool":"Crop Tool"
,"image_editor.rotate_tool":"Rotate Tool"
,"image_editor.resize_tool":"Resize Tool"
,"image_editor.resize_tool_ratio":"Keep the ratio"
,"image_editor.type_tool":"Type Tool"
,"image_editor.type_tool_font":"Font"
,"image_editor.type_tool_size":"Font Size"
,"image_editor.type_tool_bold":"Bold"
,"image_editor.type_tool_italic":"Italic"
,"image_editor.type_tool_underline":"Underline"
,"image_editor.type_tool_forecolor":"Font Color"
,"image_editor.type_tool_backcolor":"Text Background"
,"image_editor.ractangle_tool":"Ractangle Tool"
,"image_editor.rounded_ractangle_tool":"Rounded Ractangle Tool"
,"image_editor.ellipse_tool":"Ellipse Tool"
,"image_editor.line_tool":"Line Tool"
,"image_editor.border_color":"Border color"
,"image_editor.background_color":"Background color"
,"image_editor.pencil_tool":"Pencil Tool"
,"image_editor.marker_tool":"Marker Tool"
,"image_editor.crayon_tool":"Crayon Tool"
,"image_editor.draw_color":"Color"
,"image_editor.undo":"Undo"
,"image_editor.redo":"Redo"
,"image.paste.html_min":"HTML"
,"image.paste.image_min":"Image"
,"image.paste.plain_min":"Text"
,"image.paste.title":"Paste : "
,"image_editor.title":"Image editor"
,"tx_image_edit":"Image edit"
,"image.paste.popup.title":"Paste options"
,"image.paste.title2":"Paste"
,"tx_translate":"Translate"
	};
};
window[_global_key] = new I18N();
})(window._I18N_KEY?window._I18N_KEY:'_i18n_e');