// Utility
var utils = (() => {
    function dom(selector) {
        if (selector[0] === "#") {
            return document.getElementById(selector.slice(1));
        }
        return document.querySelectorAll(selector);
    }

    function copyJSON(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function isTouchDevice() {
        return navigator.userAgent.match(
            /(iPhone|iPod|iPad|Android|BlackBerry)/
        );
    }

    function getWorkerURLFromElement(selector) {
        var element = dom(selector);
        var content = babel.transform(element.innerText).code;
        var blob = new Blob([content], { type: "text/javascript" });
        return URL.createObjectURL(blob);
    }

    var cursorManager = (function () {
        var cursorManager = {};

        var voidNodeTags = [
            "AREA",
            "BASE",
            "BR",
            "COL",
            "EMBED",
            "HR",
            "IMG",
            "INPUT",
            "KEYGEN",
            "LINK",
            "MENUITEM",
            "META",
            "PARAM",
            "SOURCE",
            "TRACK",
            "WBR",
            "BASEFONT",
            "BGSOUND",
            "FRAME",
            "ISINDEX",
        ];

        Array.prototype.contains = function (obj) {
            var i = this.length;
            while (i--) {
                if (this[i] === obj) {
                    return true;
                }
            }
            return false;
        };

        function canContainText(node) {
            if (node.nodeType == 1) {
                return !voidNodeTags.contains(node.nodeName);
            } else {
                return false;
            }
        }

        function getLastChildElement(el) {
            var lc = el.lastChild;
            while (lc && lc.nodeType != 1) {
                if (lc.previousSibling) lc = lc.previousSibling;
                else break;
            }
            return lc;
        }
        cursorManager.setEndOfContenteditable = function (
            contentEditableElement
        ) {
            while (
                getLastChildElement(contentEditableElement) &&
                canContainText(getLastChildElement(contentEditableElement))
            ) {
                contentEditableElement = getLastChildElement(
                    contentEditableElement
                );
            }

            var range, selection;
            if (document.createRange) {
                range = document.createRange();
                range.selectNodeContents(contentEditableElement);
                range.collapse(false);
                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            } else if (document.selection) {
                range = document.body.createTextRange();
                range.moveToElementText(contentEditableElement);
                range.collapse(false);
                range.select();
            }
        };

        return cursorManager;
    })();

    return {
        copyJSON,
        cursorManager,
        dom,
        getWorkerURLFromElement,
        isTouchDevice,
    };
})();

// API Adapter
class SudokuAdapter {
    constructor(url) {
        this.worker = new Worker(url);
        return this;
    }

    _postMessage(options) {
        this.worker.postMessage(JSON.stringify(options));
        return new Promise((resolve, reject) => {
            this.worker.onmessage = (event) => {
                resolve(event.data);
            };
        });
    }

    generate(options) {
        options = Object.assign({}, options, { method: "generate" });

        return this._postMessage(options);
    }

    validate(options) {
        options = Object.assign({}, options, { method: "validate" });

        return this._postMessage(options);
    }
}

// Client Side Settings
const SUDOKU_APP_CONFIG = {
    HINTS: 34,
    TRY_LIMIT: 100000,
    WORKER_URL: utils.getWorkerURLFromElement("#worker"),
    DOM_TARGET: utils.dom("#sudoku-app"),
};

// Client Side
var SudokuApp = ((config) => {
    const { HINTS, TRY_LIMIT, WORKER_URL, DOM_TARGET } = config;

    var sudokuAdapter = new SudokuAdapter(WORKER_URL);

    var state = {
        success: null,
        board: null,
        solution: null,
        solved: null,
        errors: [],
    };

    Object.observe(state, render);

    var history = [state];
    var historyStash = [];

    // Event listeners
    var onClickGenerate = initialize;

    var onClickSolve = function () {
        setState({
            board: state.solution,
            solved: true,
            errors: [],
        });
    };

    var onKeyUpCell = function (event) {
        var key = event.keyCode;
        if (
            // a
            key === 36 || // r
            key === 37 || // r
            key === 38 || // o
            key === 39 || // w
            key === 9 || // tab
            // mod key flags are always false in keyup event
            // keyIdentifier doesn't seem to be implemented
            // in all browsers
            key === 17 || // Control
            key === 16 || // Shift
            key === 91 || // Meta
            key === 19 || // Alt
            event.keyIdentifier === "Control" ||
            event.keyIdentifier === "Shift" ||
            event.keyIdentifier === "Meta" ||
            event.keyIdentifier === "Alt"
        )
            return;

        var cell = event.target;
        var value = cell.innerText;

        if (value.length > 4) {
            cell.innerText = value.slice(0, 4);
            return false;
        }

        var cellIndex = cell.getAttribute("data-cell-index");
        cellIndex = parseInt(cellIndex, 10);
        var rowIndex = Math.floor(cellIndex / 9);
        var cellIndexInRow = cellIndex - rowIndex * 9;

        var board = Object.assign([], state.board);
        board[rowIndex].splice(cellIndexInRow, 1, value);

        validate(board).then((errors) => {
            historyStash = [];
            history.push({});
            var solved = null;
            if (errors.indexOf(true) === -1) {
                solved = true;
                board.forEach((row) => {
                    row.forEach((value) => {
                        if (
                            !value ||
                            !parseInt(value, 10) ||
                            value.length > 1
                        ) {
                            solved = false;
                        }
                    });
                });
            }
            if (solved) {
                board = Object.assign([], board).map((row) =>
                    row.map((n) => +n)
                );
            }
            setState({ board, errors, solved }, (newState) => {
                history[history.length - 1] = newState;
                restoreCaretPosition(cellIndex);
            });
        });
    };

    function keyDown(event) {
        var keys = {
            ctrlOrCmd: event.ctrlKey || event.metaKey,
            shift: event.shiftKey,
            z: event.keyCode === 90,
        };

        if (keys.ctrlOrCmd && keys.z) {
            if (keys.shift && historyStash.length) {
                redo();
            } else if (!keys.shift && history.length > 1) {
                undo();
            }
        }
    }

    function undo() {
        historyStash.push(history.pop());
        setState(utils.copyJSON(history[history.length - 1]));
    }

    function redo() {
        history.push(historyStash.pop());
        setState(utils.copyJSON(history[history.length - 1]));
    }

    function initialize() {
        unbindEvents();
        render();
        getSudoku().then((sudoku) => {
            setState(
                {
                    success: sudoku.success,
                    board: sudoku.board,
                    solution: sudoku.solution,
                    errors: [],
                    solved: false,
                },
                (newState) => {
                    history = [newState];
                    historyStash = [];
                }
            );
        });
    }

    function setState(newState, callback) {
        requestAnimationFrame(() => {
            Object.assign(state, newState);
            if (typeof callback === "function") {
                var param = utils.copyJSON(state);
                requestAnimationFrame(callback.bind(null, param));
            }
        });
    }

    function bindEvents() {
        var generateButton = utils.dom("#generate-button");
        var solveButton = utils.dom("#solve-button");
        var undoButton = utils.dom("#undo-button");
        var redoButton = utils.dom("#redo-button");
        generateButton &&
            generateButton.addEventListener("click", onClickGenerate);
        solveButton && solveButton.addEventListener("click", onClickSolve);
        undoButton && undoButton.addEventListener("click", undo);
        redoButton && redoButton.addEventListener("click", redo);

        var cells = utils.dom(".sudoku__table-cell");
        [].forEach.call(cells, (cell) => {
            cell.addEventListener("keyup", onKeyUpCell);
        });

        window.addEventListener("keydown", keyDown);
    }

    function unbindEvents() {
        var generateButton = utils.dom("#generate-button");
        var solveButton = utils.dom("#solve-button");
        var undoButton = utils.dom("#undo-button");
        var redoButton = utils.dom("#redo-button");
        generateButton &&
            generateButton.removeEventListener("click", onClickGenerate);
        solveButton && solveButton.removeEventListener("click", onClickSolve);
        undoButton && undoButton.removeEventListener("click", undo);
        redoButton && redoButton.removeEventListener("click", redo);

        var cells = utils.dom(".sudoku__table-cell");
        [].forEach.call(cells, (cell) => {
            cell.removeEventListener("keyup", onKeyUpCell);
        });

        window.removeEventListener("keydown", keyDown);
    }

    function restoreCaretPosition(cellIndex) {
        utils.cursorManager.setEndOfContenteditable(
            utils.dom(`[data-cell-index="${cellIndex}"]`)[0]
        );
    }

    function getSudoku() {
        return sudokuAdapter.generate({
            hints: HINTS,
            limit: TRY_LIMIT,
        });
    }

    function validate(board) {
        var map = board
            .reduce((memo, row) => {
                for (let num of row) {
                    memo.push(num);
                }
                return memo;
            }, [])
            .map((num) => parseInt(num, 10));

        var validations = [];

        // Will validate one by one
        for (let [index, number] of map.entries()) {
            if (!number) {
                validations.push(
                    new Promise((res) => {
                        res({ result: { box: -1, col: -1, row: -1 } });
                    })
                );
            } else {
                let all = Promise.all(validations);
                validations.push(
                    all.then(() => {
                        return sudokuAdapter.validate({ map, number, index });
                    })
                );
            }
        }

        return Promise.all(validations).then((values) => {
            var errors = [];
            for (let [index, validation] of values.entries()) {
                let { box, col, row } = validation.result;
                let errorInBox = box.first !== box.last;
                let errorInCol = col.first !== col.last;
                let errorInRow = row.first !== row.last;

                let indexOfRow = Math.floor(index / 9);
                let indexInRow = index - indexOfRow * 9;

                errors[index] = errorInRow || errorInCol || errorInBox;
            }

            return errors;
        });
    }

    function render() {
        unbindEvents();

        DOM_TARGET.innerHTML = `
        <div class='sudoku'>
          ${headerComponent()}
          ${contentComponent()}
        </div>
      `;

        bindEvents();
    }

    function buttonComponent(props) {
        var { id, text, mods, classes } = props;

        var blockName = "button";
        var modifiers = {};
        var modType = toString.call(mods);
        if (modType === "[object String]") {
            modifiers[mods] = true;
        } else if (modType === "[object Array]") {
            for (let modName of mods) {
                modifiers[modName] = true;
            }
        }

        var blockClasses = bem.makeClassName({
            block: blockName,
            modifiers: modifiers,
        });

        var buttonTextClass = `${blockName}-text`;
        if (Object.keys(modifiers).length) {
            buttonTextClass += Object.keys(modifiers).reduce((memo, curr) => {
                return memo + ` ${blockName}--${curr}-text`;
            }, "");
        }

        var lgText = typeof text === "string" ? text : text[0];
        var mdText = typeof text === "string" ? text : text[1];
        var smText = typeof text === "string" ? text : text[2];

        return `
        <button
          id='${id}'
          class='${blockClasses} ${classes || ""}'>
          <span class='show-on-sm ${buttonTextClass}'>
            ${smText}
          </span>
          <span class='show-on-md ${buttonTextClass}'>
            ${mdText}
          </span>
          <span class='show-on-lg ${buttonTextClass}'>
            ${lgText}
          </span>
        </button>
      `;
    }

    function messageComponent(options) {
        var { state, content } = options;

        var messageClass = bem.makeClassName({
            block: "message",
            modifiers: state
                ? {
                      [state]: true,
                  }
                : {},
        });

        return `
        <p class='${messageClass}'>
          ${content}
        </p>
      `;
    }

    function restoreScrollPosComponent() {
        return `<div style='height: 540px'></div>`;
    }

    function headerComponent() {
        return `
        <div class='sudoku__header'>
  
          <h1 class='sudoku__title'>
  
            <span class='show-on-sm'>
              Sudoku
            </span>
  
            <span class='show-on-md'>
              Sudoku Puzzle
            </span>
  
            <span class='show-on-lg'>
              Sudoku Puzzle Project
            </span>
  
          </h1>
  
          ${
              state.success
                  ? `
      
                ${buttonComponent({
                    id: "generate-button",
                    text: ["New Board", "New Board", "New"],
                    mods: "primary",
                })}
      
                ${
                    state.solved
                        ? buttonComponent({
                              id: "solve-button",
                              text: "Solved",
                              mods: ["tertiary", "muted"],
                          })
                        : buttonComponent({
                              id: "solve-button",
                              text: "Solve",
                              mods: "secondary",
                          })
                }
  
              `
                  : `
      
                ${buttonComponent({
                    id: "generate-button",
                    text: ["Generating", "", ""],
                    mods: ["disabled", "loading"],
                })}
      
                ${buttonComponent({
                    id: "solve-button",
                    text: "Solve",
                    mods: "disabled",
                })}
              `
          }
  
          ${
              utils.isTouchDevice()
                  ? `
  
            ${buttonComponent({
                id: "redo-button",
                text: ["&raquo;", "&raquo;", "&gt;", "&gt;"],
                classes: "fr",
                mods: [
                    "neutral",
                    "compound",
                    "compound-last",
                    `${!historyStash.length ? "disabled" : ""}`,
                ],
            })}
            ${buttonComponent({
                id: "undo-button",
                text: ["&laquo;", "&laquo;", "&lt;", "&lt;"],
                classes: "fr",
                mods: [
                    "neutral",
                    "compound",
                    "compound-first",
                    `${history.length > 1 ? "" : "disabled"}`,
                ],
            })}
  
        `
                  : ""
          }
  
        </div>
      `;
    }

    function contentComponent() {
        var _isSeparator = (index) => !!index && !((index + 1) % 3);

        var resultReady = !!state.board;
        var fail = resultReady && !state.success;

        if (!resultReady) {
            return `
          ${messageComponent({
              state: "busy",
              content: `Generating new board...`,
          })}
          ${restoreScrollPosComponent()}
        `;
        }

        if (fail) {
            return `
          ${messageComponent({
              state: "fail",
              content: `Something went wrong with this board, try generating another one.`,
          })}
          ${restoreScrollPosComponent()}
        `;
        }

        var rows = state.board;

        return `
        <table class='sudoku__table'>
  
          ${rows
              .map((row, index) => {
                  let className = bem.makeClassName({
                      block: "sudoku",
                      element: "table-row",
                      modifiers: {
                          separator: _isSeparator(index),
                      },
                  });

                  return `<tr class='${className}'>
  
                ${row
                    .map((num, _index) => {
                        let cellIndex = index * 9 + _index;
                        let separator = _isSeparator(_index);
                        let editable = typeof num !== "number";
                        let error = state.errors[cellIndex];
                        let className = bem.makeClassName({
                            block: "sudoku",
                            element: "table-cell",
                            modifiers: {
                                separator,
                                editable,
                                error,
                                "editable-error": editable && error,
                            },
                        });

                        return `\n\t
                    <td class='${className}'
                        data-cell-index='${cellIndex}'
                        ${editable ? "contenteditable" : ""}>
                          ${num}
                    </td>`;
                    })
                    .join("")}
  
              \n</tr>\n`;
              })
              .join("")}
  
        </table>
      `;
    }

    return { initialize };
})(SUDOKU_APP_CONFIG).initialize();
