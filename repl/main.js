define([
  'base/js/namespace',
  'jquery',
  'require',
  'base/js/events',
  'base/js/utils',
  './repl'
], function (Jupyter, $, requirejs, events, configmod, utils) {
  "use strict";
  var repl = new REPL();

  repl.addListener(function(msg){
    msg = msg.replace('\u0004\u0004>','');
    console.log(msg);
  })
  console.log("repl>>>>:",repl);

  var usbBtn,runBtn;

  var load_extension = function () {    
    var btns = Jupyter.toolbar.add_buttons_group([
      Jupyter.keyboard_manager.actions.register({
        'help': 'connect to Web:AI',
        'icon': 'fa-usb',
        'handler': async function () {
          await repl.connectBoard();
          await repl.enterRAWREPL();
          setTimeout(async function(){
            await repl.sendCmd('from webai import *');
            await repl.sendCmd('webai.init()');
            await repl.sendCmd('webai.lcd.init()');
            usbBtn.style.backgroundColor='#aaffaa';
          },500);          
        }
      }, 'usb-connect', 'usbconnect'),
      /*
      Jupyter.keyboard_manager.actions.register({
        'help': 'enter REPL',
        'icon': 'fa-cog',
        'handler': async function () {
            await repl.enterRAWREPL();
            setTimeout(async function(){
              await repl.sendCmd('from webai import *');
              await repl.sendCmd('webai.init()');
              await repl.sendCmd('webai.lcd.init()');
              usbBtn.style.backgroundColor='#aaffaa';
            },500);
        }
      }, 'usb-repl', 'usbrepl'),
      */
      Jupyter.keyboard_manager.actions.register({
        'help': 'Run code',
        'icon': 'fa-play',
        'handler': async function () {
          var nb = Jupyter.notebook;
          var idx = nb.get_anchor_index();
          var cell = nb.get_cell(idx);
          var code = cell.get_text();
          var output = '';
          var startMsg = 'raw REPL; CTRL-B to exit\r\n>OK';
          var startFlag = false;
          repl.addListener(function(msg){
            output += msg;
            if(output.indexOf(startMsg)>=0){
              output = output.replace(startMsg,'');
              startFlag = true;
            }
            else if(startFlag){
              output = output.replace('\u0004\u0004>','');
              cell.output_area.clear_output();
              cell.output_area.append_output({
                  "output_type": "display_data",
                  "metadata": {}, // included to avoid warning
                  "data": {"text/plain": output}
              });
              //console.log(output);
            }
          })
          await repl.sendCmd(code);
        }
      }, 'usb-run', 'usbrun'),
    ]);

    var usbBtn = btns.find('button')[0];
    var runBtn = btns.find('button')[1];
    usbBtn.style.backgroundColor='#ffaaaa';
    repl.ondisconnect = function(){
      usbBtn.style.backgroundColor='#ffaaaa';
    } 
  };

  var extension = {
    load_jupyter_extension: load_extension,
    load_ipython_extension: load_extension
  };
  return extension;
});
