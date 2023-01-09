/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function(config) {
  config.toolbarGroups = [
    { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
    { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
    { name: 'forms', groups: [ 'forms' ] },
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
    { name: 'links', groups: [ 'links' ] },
    { name: 'insert', groups: [ 'insert' ] },
    { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
    { name: 'styles', groups: [ 'styles' ] },
    { name: 'colors', groups: [ 'colors' ] },
    { name: 'tools', groups: [ 'tools' ] },
    { name: 'others', groups: [ 'others' ] },
    { name: 'about', groups: [ 'about' ] }
  ];

  config.defaultLanguage = 'en';
  config.enterMode = CKEDITOR.ENTER_DIV;
  config.extraPlugins = 'ajax,button,clipboard,contextmenu,dialogui,dialog,floatpanel,justify,menu,notification,panel,pastefromword,pastetools,sourcearea,tab,table,tableresize,tabletools,toolbar,xml';
  config.height = 200;
  config.language = 'en';
  config.pasteFromWordRemoveFontStyles = true;
  config.removeButtons = 'Undo,Redo,Anchor,Strike,Subscript,Superscript,About,Link,Unlink,Outdent,Indent';
  config.startupFocus = true;
  config.tabSpaces = 5; // tab plugin

  // @ https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html#cfg-coreStyles_bold
  config.coreStyles_bold = { element: 'b', overrides: 'strong' };

  // @ https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html#cfg-coreStyles_italic
  config.coreStyles_italic = { element: 'i', overrides: 'em' };
};