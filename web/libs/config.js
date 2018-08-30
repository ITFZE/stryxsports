/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function(config) {
	// 	config.width = 1040;
	config.placeholder_select = {
		placeholders: [],
		format: '[[%placeholder%]]'
	};
	config.wordcount = {

		// Whether or not you want to show the Paragraphs Count
		showParagraphs: true,

		// Whether or not you want to show the Word Count
		showWordCount: true,

		// Whether or not you want to show the Char Count
		showCharCount: false,

		// Whether or not you want to count Spaces as Chars
		countSpacesAsChars: false,

		// Whether or not to include Html chars in the Char Count
		countHTML: false,

		// Maximum allowed Word Count, -1 is default for unlimited
		maxWordCount: -1,

		// Maximum allowed Char Count, -1 is default for unlimited
		maxCharCount: -1
	};
	
	config.extraPlugins = 'richcombo,placeholder_select,wordcount,notification,image2';

	config.removePlugins = 'forms';
};