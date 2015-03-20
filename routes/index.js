var express = require('express');
var router = express.Router();

/* GET home page. */
var bootstrapCss = "bootstrap/css/bootstrap.min.css";
var bootstrapJs = "bootstrap/js/bootstrap.min.js";
var blocklyJs = "blockly/blockly_compressed.js";
var jsCompressedJs = "blockly/javascript_compressed.js";
var blocksJs = "blockly/blocks_compressed.js";
var messagesRUS = "blockly/msg/js/ru.js";
var messagesEN = "blockly/msg/js/en.js";
var jquery = "scripts/jquery-1.11.2.min.js";
var blocklyInit = "scripts/blockly_init.js";

router.get('/', function (req, res) {
    res.render('workflow',
        {
            title: 'Express',
            jsFiles: [jquery,bootstrapJs, blocklyJs, jsCompressedJs, blocksJs,messagesRUS,blocklyInit],
            cssFiles: [bootstrapCss]
        });
});

module.exports = router;