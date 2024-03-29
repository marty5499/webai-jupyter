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

  var usbBtn, runBtn;

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function blink() {
    return setInterval(async function () {
      usbBtn.style.backgroundColor = '#ffffaa';
      await sleep(250);
      usbBtn.style.backgroundColor = '#aaaaaa';
      await sleep(250);
    }, 500)
  }

  var load_extension = function () {
    var btns = Jupyter.toolbar.add_buttons_group([
      Jupyter.keyboard_manager.actions.register({
          'help': 'connect to Web:AI',
          'icon': 'fa-usb',
          'handler': async function () {
            await repl.usbConnect();
            repl.port.ondisconnect = function () {
              usbBtn.style.backgroundColor = '#ffaaaa';
              this.port = null;
            }            
            var clearId = blink();
            await repl.enter();
            await repl.write(`
from webai import *
webai.init()
webai.clear()
webai.lcd.init()
webai.img = image.Image()
webai.img.draw_rectangle(0,0,320,240, 0xffeaea, 1,fill=True)
webai.lcd.display(webai.img)
webai.draw_string(60,100,'REPL Ready...',scale=2,x_spacing=3)
webai.img = None
gc.collect()
`);
            clearInterval(clearId);
            setTimeout(function () {
              usbBtn.style.backgroundColor = '#aaffaa';
            }, 300)
          }
        },
        'usb-connect',
        'usbconnect'),
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
          cell.output_area.clear_output();
          await repl.write(code, function (value) {
            cell.output_area.append_output({
              "output_type": "display_data",
              "metadata": {}, // included to avoid warning
              "data": { "text/html": (value + "<br>") }
            });
            return { value: "", done: false }
          });
        }
      }, 'usb-run', 'usbrun'),
    ]);

    usbBtn = btns.find('button')[0];
    runBtn = btns.find('button')[1];
    usbBtn.style.backgroundColor = '#ffaaaa';
  };

  var extension = {
    load_jupyter_extension: load_extension,
    load_ipython_extension: load_extension
  };
  return extension;
});