/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, $, window */

 /**
  * This is JavaScript API exposed to the native shell when Brackets is run in a native shell rather than a browser.
  */
define(function (require, exports, module) {
    "use strict";

    // Load dependent modules
    var AppInit        = require("utils/AppInit"),
        CommandManager = require("command/CommandManager"),
        Commands       = require("command/Commands");

    var appReady = false; // Set to true after app is fully initialized
    
    /**
     * The native function BracketsShellAPI::DispatchBracketsJSCommand calls this function in order to enable
     * calling Brackets commands from the native shell.
     */
    function executeCommand(eventName) {
        var promise, e = new Error(), stackDepth = e.stack.split("\n").length;
        
        // This function should *only* be called as a top-level function. If the current
        // stack depth is > 2, it is most likely because we are at a breakpoint. 
        if (stackDepth < 3) {
            promise = CommandManager.execute(eventName);
        } else {
            console.error("Skipping command " + eventName + " because it looks like you are " +
                          "at a breakpoint. If you are NOT at a breakpoint, please " +
                          "file a bug and mention this comment. Stack depth = " + stackDepth + ".");
        }
        return (promise && promise.state() === "rejected") ? false : true;
    }

    AppInit.appReady(function () {
        appReady = true;
    });
    
    exports.executeCommand = executeCommand;
});