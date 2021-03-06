/**
 * Created by Pais on 23.05.2015.
 *
 * This function searches for all occurrences of
 * macros calls in given code string and replaces
 * it with corresponding code.
 */

var MACRO_TURN_ON_SEC_BLOCK = "#ENGINE_ON_SEC(";
var MACRO_LOOP_REPEAT = "#loop";

function processCodeMacro(code) {

    code = engineMacroProcessing(code);
    code = loopMacroProcessing(code);
    return code;

    // Replace macro with corresponding code
    function engineMacroProcessing(code) {
        var turnOnBlocksIndices;

        turnOnBlocksIndices = searchOccurrences(code, MACRO_TURN_ON_SEC_BLOCK);

        var lastOccurrence;
        var time;
        var innerCode;
        var outerCode;
        var closingBracket;
        var generatedCode;

        while (turnOnBlocksIndices.length) {
            // Take indices of first and last symbol of current macro name
            lastOccurrence = turnOnBlocksIndices.pop();
            closingBracket = code.indexOf(')', lastOccurrence + MACRO_TURN_ON_SEC_BLOCK.length);

            // Take macro argument
            time = code.substring(lastOccurrence + MACRO_TURN_ON_SEC_BLOCK.length, closingBracket);
            // Take code after macro
            outerCode = code.substring(closingBracket + 1);
            // Code that will be executed after engine_on_sec
            innerCode = "";

            //Processing code may be defined in if statement or function
            var bracketIndex;
            if (~(bracketIndex = indexOfClosingBracket(outerCode))) {
                // If macro is in parent block
                innerCode = outerCode.slice(0, bracketIndex);
                outerCode = outerCode.substring(bracketIndex);
            } else {
                // If there is no parent block
                innerCode = outerCode;
                outerCode = "";
            }

            generatedCode =
                "global_blockly.engine(\"5\");\n" +
                "var id = setTimeout(function(){\n" +
                "\tglobal_blockly.engine(\"0\");\n" +
                "\t{0}\n".format(innerCode) +
                "}, {0});\n".format(time) +
                "global_blockly.main_program_timeoutIDs.push(id)\n" +
                outerCode;

            // Take part that wasn't change
            code = code.slice(0, lastOccurrence);
            // And add generated part
            code = code.concat(generatedCode);
        }

        return code;
    }

    // Insert after loop code in setTimeout call
    function loopMacroProcessing(code) {
        var loopMacroIndices;

        loopMacroIndices = searchOccurrences(code, MACRO_LOOP_REPEAT);

        var lastOccurrence;
        var outerCode;
        var innerCode;
        var closingBracket;
        var openBracket;

        while (loopMacroIndices.length) {
            lastOccurrence = loopMacroIndices.pop();

            // Parsing of macro in format #loop/n/(/repeats/);
            // Delete # sing
            var tempString = code.substring(lastOccurrence + 1);
            code = code.slice(0, lastOccurrence);
            code = code.concat(tempString);

            // Take code after macro
            closingBracket = code.indexOf(')', lastOccurrence + MACRO_LOOP_REPEAT.length);
            openBracket = code.indexOf('(', lastOccurrence + MACRO_LOOP_REPEAT.length);
            outerCode = code.substring(closingBracket + 1);
            innerCode = "";

            //Processing code may be defined in if statement or function
            var bracketIndex;
            if (~(bracketIndex = indexOfClosingBracket(outerCode))) {
                // If macro is in parent block
                innerCode = outerCode.slice(0, bracketIndex);
                outerCode = outerCode.substring(bracketIndex);
            }
            else {
                // If there is no parent block
                innerCode = outerCode;
            }

            // Find "function loop/n/(..." string
            var loopName = code.substring(lastOccurrence, openBracket);
            var indexOfLoopFunction = code.indexOf('function ' + loopName);
            var insertIndex = code.indexOf('return;', indexOfLoopFunction);
            // Delete innerCode from original position
            tempString = code.substring(closingBracket + innerCode.length);
            code = code.slice(0, closingBracket + 2);
            code = code.concat(tempString);
            // Insert innerCode in 'if' statement of loop function
            tempString = code.substring(insertIndex);
            code = code.slice(0, insertIndex);
            code = code.concat(innerCode);
            code = code.concat(tempString);

            loopMacroIndices = searchOccurrences(code, MACRO_LOOP_REPEAT);
        }

        return code;
    }

    function searchOccurrences(code, substr) {
        var indices = [];
        var lastIndex;
        var startIndex = 0;
        var substr_length = substr.length;

        while(~(lastIndex = code.indexOf(substr, startIndex))) {
            indices.push(lastIndex);
            startIndex = lastIndex + substr_length;
        }

        return indices;
    }

    function indexOfClosingBracket(code) {
        var openBrCount = 0;
        var closingBrCount = 0;
        var index = 0;
        var char;

        while (openBrCount - closingBrCount >= 0) {
            char = code.charAt(index++)
            if (char == '{') {
                openBrCount++;
            } else if (char == '}') {
                closingBrCount++;
            }

            if (index == code.length + 1) {
                if (openBrCount == closingBrCount) {
                    return -1;
                } else {
                    //ERROR!
                    return -1;
                }
            }
        }

        return --index;
    }
}