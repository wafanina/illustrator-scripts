/* 

  Author: Alexander Ladygin (i@ladygin.pro)
  Program version: Adobe Illustrator CC+ (presumably in Adobe Illustrator CS6 - did not test)
  Name: compoundFix.jsx;

  Copyright (c) 2018
  www.ladygin.pro

*/
if (app.executeMenuCommand instanceof Function) {
    var win = new Window('dialog', 'CompoundFix \u00A9 www.ladygin.pro', undefined);
        win.orientation = 'column';
        win.alignChildren = ['fill', 'fill'];

    var globalGroup = win.add('group'),
        panel = globalGroup.add('panel');
        panel.orientation = 'column';
        panel.alignChildren = 'fill';
        panel.margins = 20;

    var radioSelection = panel.add('radiobutton', undefined, 'Selection'),
        radioAll = panel.add('radiobutton', undefined, 'All Compounds');
    radioAll.value = true;

    var winButtons = globalGroup.add('group');
        winButtons.orientation = 'column';
        winButtons.alignChildren = 'fill';

    var ok = winButtons.add('button', undefined, 'Run fix');
        ok.helpTip = 'Press Enter to Run';
        ok.onClick = compoundFixAction;
        ok.active = true;

    var cancel = winButtons.add('button', [0, 0, 30, 25], 'Cancel');
        cancel.helpTip = 'Press Esc to Close';
        cancel.onClick = function () { win.close(); }

    var progressBar = win.add('progressbar', [0, 0, 110, 5]),
        progressBarCounter = 100;
        progressBar.value = 0;
        progressBar.minvalue = 0;
        progressBar.maxvalue = progressBarCounter;

    function compoundFixAction() {
        globalGroup.enabled = false;
        function __ungroup (__items) {
            var l = __items.length;
            for (var i = 0; i < l; i++) {
                if (__items[i].typename === 'GroupItem') {
                    var j = __items[i].pageItems.length;
                    while (j--) { __items[i].pageItems[0].moveBefore(__items[i]); }
                    __items[i].remove();
                }
            }
        }

        function compoundFix (item) {
            selection = [item];
            app.executeMenuCommand('noCompoundPath');
            __ungroup(selection);
            app.executeMenuCommand('compoundPath');
            selection = null;
        }

        function compoundPathItemsNormalize (items) {
            var i = items.length;
            progressBarCounter /= i;
            while (i--) {
                if (items[i].typename === 'GroupItem') {
                    compoundPathItemsNormalize(items[i].pageItems);
                }
                    else if (items[i].typename === 'CompoundPathItem') {
                        compoundFix(items[i]);
                    }
                progressBar.value += progressBarCounter;
                win.update();
            }
        }

        var selectionBak = selection;
        compoundPathItemsNormalize(radioSelection.value ? selection : activeDocument.compoundPathItems);
        selection = selectionBak;
        win.close();
    }

    win.center();
    win.show();
}
    else {
        alert('This version of illustrator is not supported!');
    }