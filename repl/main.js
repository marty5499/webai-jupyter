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

  repl.addListener(function (msg) {
    msg = msg.replace('\u0004\u0004>', '');
    console.log(msg);
  })

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
          await repl.connectBoard();
          var clearId = blink();
          await repl.enterRAWREPL();
          setTimeout(async function () {
            var output = '';
            repl.addListener(function (msg) {
              output += msg;
              if (output.indexOf('#repl start...#') >= 0) {
                clearInterval(clearId);
                setTimeout(function () {
                  usbBtn.style.backgroundColor = '#aaffaa';
                }, 300)
              }
            })
            var cmd1 = "from webai import *";
            var cmd2 = "webai.init()\nwebai.clear()\nwebai.lcd.init()";
            var cmd3 = "webai.img = image.Image()"
            var cmd4 = "webai.img.draw_rectangle(0,0,320,240, 0xffeaea, 1,fill=True)";
            var cmd5 = "webai.lcd.display(webai.img)";
            var cmd6 = "webai.draw_string(60,100,'REPL Ready...',scale=2,x_spacing=3)";
            var cmd7 = "webai.img = None"
            var cmd8 = "gc.collect()"
            await repl.sendCmd(cmd1);
            await repl.sendCmd(cmd2);
            await repl.sendCmd(cmd3);
            await repl.sendCmd(cmd4);
            await repl.sendCmd(cmd5);
            await repl.sendCmd(cmd6);
            await repl.sendCmd(cmd7);
            await repl.sendCmd(cmd8);
            await repl.sendCmd("print('#repl start...#')");
          }, 500);
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
          repl.addListener(function (msg) {
            output += msg;
            if (output.indexOf(startMsg) >= 0) {
              output = output.replace(startMsg, '');
              startFlag = true;
            } else if (startFlag) {
              output = output.replace('\u0004\u0004>', '');
              cell.output_area.clear_output();
              output = output.replace('\n', '<br>');
              cell.output_area.append_output({
                "output_type": "display_data",
                "metadata": {}, // included to avoid warning
                "data": { "text/html": output }
              });
            }
          })
          await repl.sendCmd(code);
        }
      }, 'usb-run', 'usbrun'),
    ]);

    usbBtn = btns.find('button')[0];
    runBtn = btns.find('button')[1];
    usbBtn.style.backgroundColor = '#ffaaaa';
    repl.ondisconnect = function () {
      usbBtn.style.backgroundColor = '#ffaaaa';
    }
  };

  var extension = {
    load_jupyter_extension: load_extension,
    load_ipython_extension: load_extension
  };
  return extension;
});