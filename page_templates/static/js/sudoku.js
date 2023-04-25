class Sudoku {
    constructor() {
        this.blank_board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.board = Helper.clone(this.blank_board);
        this.set_original_board(this.blank_board);
    }

    set_as_start_point() {
        this.set_original_board(this.board);
    }

    set_board(board_string) {
        if ( ! board_string ) {
            return false;
        }

        if ( ! board_string.match(/^[0-9*_.]{81}$/m) ) {
            return false;
        }

        // TODO: foreach getBoardSquares
        for ( let row = 0; row <= 8; row++ ) {
            for ( let column = 0; column <= 8; column++ ) {
                let char = board_string.charAt(row * 9 + column);
                if ( char == '*' || char == '_' || char == '.' ) {
                    char = 0;
                }
                this.board[row][column] = parseInt(char);
            }
        }

        this.set_original_board(this.board);

        return true;

        /*
        if ( ! this.puzzle_is_valid() ) {
            this.board = Helper.clone(this.blank_board);
            return;
        }
        */
    }

    get_board() {
        return this.board;
    }

    get_original_board() {
        return this.original_board;
    }

    get_string() {
        let str = '';
        for ( let row = 0; row <= 8; row++ ) {
            for ( let col = 0; col <= 8; col++ ) {
                str += this.board[row][col];
            }
        }
        return str;
    }

    // Method for debugging purposes
    set_original_board(obj) {
        this.original_board = Helper.clone(obj);
    }

    restart_puzzle() {
        this.board = Helper.clone(this.original_board);
    }

    make_move(row, col, value) {
        if ( value === '' ) {
            value = 0;
        }
        this.board[row][col] = value;
    }

    add_note(inputEl, newDigit) {
        // Get notes container for current cell input
        const notesDiv = inputEl.nextElementSibling;

        // Get current notes for cell
        const currentNotes = inputEl.getAttribute("data-notes");

        if ( currentNotes.includes(newDigit) ) {
            inputEl.setAttribute("data-notes", currentNotes.replace(newDigit, ""));
        } else {
            inputEl.setAttribute("data-notes", currentNotes + newDigit);
        }

        // Update notes container with new notes
        const notesArray = inputEl.getAttribute("data-notes").split("");
        // Clear notes container
        notesDiv.innerHTML = "";

        notesArray.forEach((note, index) => {
            const noteElem = document.createElement("div");
            // Set text content of note element
            noteElem.textContent = note;
            noteElem.classList.add("note" + note);
            // Add note element to notes container
            notesDiv.appendChild(noteElem);
        });

        // Clear input value of cell
        inputEl.value = "";
    }
    
    clear_notes(inputEl) {
        // Get notes container for current cell input
        const notesDiv = inputEl.nextElementSibling;

        inputEl.setAttribute("data-notes", "");

        // Clear notes container
        notesDiv.innerHTML = "";
    }
    // Input to another cell clears all highlights 
    clear_mistakes(sudoku_squares, invalid_tag) {
        for ( let row = 0; row <= 8; row++ ) {
            for ( let col = 0; col <= 8; col++ ) {
                sudoku_squares[row][col].classList.remove(invalid_tag);

            }
        }
    }

    is_valid_input(value) {
        const regex = new RegExp('^[1-9]$');
        if ( ! regex.test(value) ) {
            console.log("not number")
            return false;
        }
        return true;
    }

    is_legal_move(row, col, value) {
        var strvalue = toString(value);
        const regex = new RegExp('^[1-9]$');

        // Check for non-numbers
        if ( ! regex.test(value) ) {
            console.log("not number")
            return false;
        }

        // Check row
        // TODO: foreach getRowSquares
        for ( let i = 0; i <= 8; i++ ) {
            if ( value == this.board[row][i] ) {
                console.log("duplicate row")
                return false;
            }
        }

        // Check column
        // TODO: foreach getColumnSquares
        for ( let i = 0; i <= 8; i++ ) {
            if ( value == this.board[i][col] ) {
                console.log("duplicate col")
                return false;
            }
        }

        // Check 3x3 grid
        // TODO: foreach getBoxSquares
        const row_offset = Math.floor(row / 3) * 3;
        const col_offset = Math.floor(col / 3) * 3;
        for ( let i = 0 + row_offset; i <= 2 + row_offset; i++ ) {
            for ( let j = 0 + col_offset; j <= 2 + col_offset; j++ ) {
                if ( value == this.board[i][j] ) {
                    console.log("duplicate square")
                    return false;
                }
            }
        }

        return true;
    }

    board_state(sudoku_squares, invalid_tag) {
        const regex = new RegExp('^[1-9]$');
        var is_legal = true;
        var is_finished = true;

        // Run check for every cell
        for ( let row = 0; row <= 8; row++ ) {
            for ( let col = 0; col <= 8; col++ ) {

                // Check if any squares are blank
                if ( this.board[row][col] == 0 ) {
                    is_finished = false;
                }

                // Zeros are non-entries and should not be compared
                else {
                    // Clear any previous flags
                    sudoku_squares[row][col].classList.remove(invalid_tag);

                    // Check row
                    for (let i = 0; i <= 8; i++) {
                        if ( this.board[row][col] == this.board[row][i] && col != i ) {
                            sudoku_squares[row][col].classList.add(invalid_tag);
                            is_legal = false;
                        }
                    }

                    // Check column
                    // TODO: foreach getColumnSquares
                    for ( let i = 0; i <= 8; i++ ) {
                        if ( this.board[row][col] == this.board[i][col] && row != i ) {
                            sudoku_squares[row][col].classList.add(invalid_tag);
                            is_legal = false;
                        }
                    }

                    // Check 3x3 grid
                    // TODO: foreach getBoxSquares
                    const row_offset = Math.floor(row / 3) * 3;
                    const col_offset = Math.floor(col / 3) * 3;
                    for ( let i = 0 + row_offset; i <= 2 + row_offset; i++ ) {
                        for ( let j = 0 + col_offset; j <= 2 + col_offset; j++ ) {
                            if ( this.board[row][col] == this.board[i][j] && !(row == i && col == j) ) {
                                sudoku_squares[row][col].classList.add(invalid_tag);
                                is_legal = false;
                            }
                        }
                    }
                }
            }
        }
        // Returns object with is_legal and is_finished as attributes
        return { is_legal, is_finished };
    }

}

class SudokuSquare {
    constructor(row, col, value = 0) {
        this.row = parseInt(row);
        this.col = parseInt(col);
        this.value = parseInt(value);
    }

    getSquare() {
        return [this.row, this.col];
    }

    getRow() {
        return this.row;
    }

    getCol() {
        return this.col;
    }

    getValue() {
        return this.value;
    }

    setValue(row, col) {
        this.row = row;
        this.col = col;
    }
}

class SudokuDOM {
    static display_board(
        sudoku_object,
        sudoku_squares,
        change_square_color = true
    ) {
        const board = sudoku_object.get_board();
        this.clear_board(sudoku_squares, change_square_color);
        for ( let row = 0; row <= 8; row++ ) {
            for ( let col = 0; col <= 8; col++ ) {
                const input = sudoku_squares[row][col];
                input.classList.remove('hint');
                input.classList.remove('invalid');
                input.disabled = false;

                if ( board[row][col] != 0 ) {
                    input.value = board[row][col];
                    if ( change_square_color ) {
                        input.classList.add('imported-square');
                        input.disabled = true;
                    }
                }
            }
        }
        //SudokuDOM.display_string(sudoku_object, string_box, sudoku_wiki_link);
    }

    // static display_string(sudoku_object, string_box, sudoku_wiki_link) {
    //     string_box.value = sudoku_object.get_string();
    //     sudoku_wiki_link.href = 'https://www.sudokuwiki.org/sudoku.htm?bd=' + sudoku_object.get_string();
    // }

    static clear_board(sudoku_squares, change_square_color = true) {
        for ( let row = 0; row <= 8; row++ ) {
            for ( let col = 0; col <= 8; col++ ) {
                sudoku_squares[row][col].value = "";
                if ( change_square_color ) {
                    sudoku_squares[row][col].classList.remove('imported-square');
                }
            }
        }
    }

    static highlight_illegal_move(obj) {
        // obj.classList.remove("selected-square");
        obj.classList.add('invalid');
        setTimeout(function () {
            obj.classList.remove('invalid');
        }, 2000);
    }

    static highlight_hint(obj) {
        obj.classList.add('hint');
        setTimeout(function () {
            obj.classList.remove('hint');
        }, 2000);
    }

}

// DOMContentLoaded event occurs when all HTML is loaded and scripts are executed
window.addEventListener('DOMContentLoaded', (e) => {
    // DOM elements stored as constants
    const sudoku_table = document.getElementById('sudoku-board');
    // const solve_button = document.getElementById('solve');
    const restart_button = document.getElementById('restart-button');
    const hint_button = document.getElementById('hints-button');
    // const import_button = document.getElementById('import');
    const new_button = document.getElementById('new-game-button');
    // const string_box = document.getElementById('string-box');
    // const puzzle_picker = document.getElementById('puzzle_picker');
    // const sudoku_wiki_link = document.getElementById('sudoku-wiki-link');
    // const set_button = document.getElementById('set');
    // const algorithm = document.getElementById('algorithm');
    // const validate_button = document.getElementById('validate');
    // const legal_moves_button = document.getElementById('legal-moves');
    const xbutton = document.querySelector(".x-button");
    
    
    const mistakes_counter = false // Temporary value to insure that the Mistakes feature has Two diffrent modes 
                                  // Will be fixed with implementation of the Settings database 
    
    
    const mistakes_button = document.getElementById('mistakes-button');
    const notes_button = document.getElementById('notes-button');
    const game1 = new Sudoku();
    const sudoku_squares = Helper.createArray(9, 9);
    const keypad = Helper.createArray(9);
    // Real constants (MACRO_CASE)
    // const CUSTOM_PUZZLE_SELECTEDINDEX = 3;
    // const DEFAULT_PUZZLE_SELECTEDINDEX = 6;
    const PUZZLE_SIZE = 9;
    
    // Begins timer 
    const callback = () => {
            console.log('timer initiated');
        }

    const timer = new Timer();
        timer.set(0, 'timer1', callback);
        // set limit after which callback function should be called, 12 hours = 43200 seconds 
        timer.setTimeLimit(43200); 
        // start the timer 
        timer.start('COUNT_UP');

    // Tags can be edited based on "Mistakes"/"Hint" button flags to 
    // add/remove CSS
    let invalid_tag = "null" 
    const hint_tag = "invalid"

    // Flag for turning notes mode on and off
    let notes_mode = false;
    
    // Flag for turning mistakes mode on and off
    let mistakes_mode = false;

    // Store all the Sudoku square <input type="text"> elements in variables for 
    // quick access
    for ( let row = 0; row < PUZZLE_SIZE; row++ ) {
        for ( let col = 0; col < PUZZLE_SIZE; col++ ) {
            sudoku_squares[row][col] = sudoku_table.children[col + row * PUZZLE_SIZE].children[0];
        }
    }

    // Store all the keypad button elements in variables for quick access
    // Note: index off by 1 relative to value
    for ( let i = 1; i < 10; i++ ) {
        keypad[i - 1] = document.getElementById('digit-' + i)
    }

    // Simple version of Sudoku Cell Listener that adds input to board
    for ( let row = 0; row < PUZZLE_SIZE; row++ ) {
        for ( let col = 0; col < PUZZLE_SIZE; col++ ) {
            sudoku_squares[row][col].addEventListener('input', function (e) {
                // Clear highlights when you select cell
                e.target.classList.remove(invalid_tag);
                e.target.classList.remove(hint_tag);


                // target.value tracks all inputs since page load unless cleared
                let str_input = e.target.value.toString()
                if ( str_input.length > 1 ) {
                    e.target.value = str_input[1]
                }

                var input = e.target.value
                console.log('input', input)

                // Check whether input is valid number and check entire 
                // board state
                if ( game1.is_valid_input(input) ) {

                    if ( notes_mode ) {
                        game1.add_note(e.target, input);
                    } else {
                        game1.clear_notes(e.target);
                        game1.make_move(row, col, input);
                        console.log(game1.board);
                        let state = game1.board_state(sudoku_squares, invalid_tag)
                        
                        // clear all highlighted mistakes 
                        game1.clear_mistakes(sudoku_squares, invalid_tag)
                        
                        // If the mistakes toggle is on, highlight invalid cells 
                        if (!state.is_legal && mistakes_counter == false && mistakes_mode == true)  {
                            let state = game1.board_state(sudoku_squares, "invalid");
                            console.log("Default Mistakes Mode On"); 
                        }
                        else if (state.is_legal && mistakes_counter == false && mistakes_mode == true) {
                            
                            game1.clear_mistakes(sudoku_squares, "invalid")
                            console.log("Clear All mistakes");

                        }
                            
                        // If the mistakes toggle is off, clear all highlights   
                        if (!state.is_legal && mistakes_counter == false && mistakes_mode == false) {
                            game1.clear_mistakes(sudoku_squares, "invalid");
                            console.log("Default Mistakes Mode Off"); 
                        }
                        
                         

                        console.log("Legal", state.is_legal);
                        console.log("Complete", state.is_finished);
                        // Check to see if game is completed correctly
                        if ( state.is_legal && state.is_finished ) {
                            // Do game end actions
                            console.log("game complete");
                            completedmodal();
                            console.log("timer ended"); 
                            timer.stop(); //ends timer at game completion
                        }
                        
                    }
                }
                else {
                    // clear input and update board state with non-entry
                    e.target.value = "";
                    game1.make_move(row, col, 0)
                    console.log(game1.board);
                    game1.board_state(sudoku_squares, invalid_tag)
                }

                // if ( ! game1.is_legal_move(row, col, input) && e.target.value != "" ) {
                //     e.target.value = "";
                //     SudokuDOM.highlight_illegal_move(e.target);
                //     } 
                // else {
                //         game1.make_move(row, col, input);
                //         console.log(game1.board);
                // }
            })

            sudoku_squares[row][col].addEventListener("mousedown", function (e) {
                // Search for old highlited cell and remove it if it exists
                let element = document.querySelector(".selected-square");
                if ( element ) {
                    element.classList.remove("selected-square");
                }
                // Add highlight css for clicked cell
                sudoku_squares[row][col].classList.add('selected-square');

            });

            // Check whether key pressed is backspace, and if in notes mode, 
            // delete notes
            sudoku_squares[row][col].addEventListener('keydown', function (e) {
                let element = document.querySelector(".selected-square");

                if ( element ) {
                    const key = e.keyCode || e.charCode;

                    if ( (key == 8 || key == 46) && notes_mode ) {
                        game1.clear_notes(element);
                    }
                }
            });
        }
    }

    // Create listener for each keypad button and input value in display and array 
    // Note: index off by 1 relative to value
    for ( let i = 1; i < 10; i++ ) {
        keypad[i - 1].addEventListener('click', function (e) {
            let key_num = this.getAttribute('data-digit')
            let element = document.querySelector('.selected-square');
            if ( element ) {
                element.value = key_num
                let cell_name = element.id
                let cell_num = cell_name.split('-')[1]
                let row = Math.floor(cell_num / PUZZLE_SIZE)
                let col = cell_num % PUZZLE_SIZE

                if ( notes_mode ) {
                    game1.add_note(element, key_num);
                } else {
                    game1.make_move(row, col, this.getAttribute('data-digit'));
                    game1.clear_notes(element);
                    console.log(game1.board)
                }
            }
        })
    }

    // Keypad Backspace
    xbutton.addEventListener('click', function (e) {
        let element = document.querySelector('.selected-square');
        if ( element ) {
            element.value = ""
            let cell_name = element.id
            let cell_num = cell_name.split('-')[1]
            let row = Math.floor(cell_num / PUZZLE_SIZE)
            let col = cell_num % PUZZLE_SIZE

            if ( notes_mode ) {
                game1.clear_notes(element);
            } else {
                game1.make_move(row, col, 0);
            }
        }
    })

    /*
     // Create New Game (temporarily read from string)
     new_button.addEventListener('click', function(e) {
         beginner = "080100007000070960026900130000290304960000082502047000013009840097020000600003070"
         game1.set_board(beginner);
         SudokuDOM.display_board(game1, sudoku_squares, true);
         // Reset mistakes counter
         document.getElementById('strike-counter').innerHTML = " 0 / 10";
         m = 0
     })
     */

    // Toggle notes mode when notes button is clicked
    notes_button.addEventListener('click', function (e) {
        e.target.classList.toggle('active');
        notes_mode = !notes_mode;
    });
    
 
    
    
    
    /* Code for default mistakes feature */ 
    if(mistakes_counter == false) {
        
        mistakes_button.addEventListener('click', function (e) {
               e.target.classList.toggle('active');
               mistakes_mode = !mistakes_mode; 
               console.log("mistakes_mode", mistakes_mode)
        });
    }
    
    
   
    
    
    /* Code for mistakes limit modal window */

    if(mistakes_counter == true) {
        
        
        
    // Mistakes button shows users all invalid squares 
         mistakes_button.addEventListener('click', function (e) {
            invalid_tag = "invalid" 
            e.target.classList.add('active');
            game1.board_state(sudoku_squares, invalid_tag)
            mistakes_mode = !mistakes_mode;


            setTimeout(function () {
                e.target.classList.remove('active');
                mistakes_mode = !mistakes_mode;

            }, 100);



        });
    
        var m = 0;

        // Increment m by 1 each time the "Mistakes" button is clicked
        mistakes_button.addEventListener('click', function (e) {
            m = m + 1

            if ( m < 10 ) {
                document.getElementById('strike-counter').innerHTML = m + " / 10";
            }
            else if ( m == 10 ) {
                document.getElementById('strike-counter').innerHTML = m + " / 10";

                rendermodal()
            }
        })

        // Render modal window for the mistakes counter warning     
        function rendermodal(event) {
            // Show modal window when page loads
            var modal_mistakes = document.getElementById('mistake-limit-model');
            modal_mistakes.style.display = 'block';

            modal_mistakes.addEventListener('click', hidemistakes)
        }

        // Code for clicking out of mistakes modal window
        function hidemistakes(event) {
            // Get modal window element by ID
            var modal_mistakes = document.getElementById('mistake-limit-model');
            // Get content of modal window
            var content_mistakes = document.querySelector('.modal-mistakes-content');

            // Check if element that is clicked on is either modal window background 
            // or not a child of content
            if ( event.target == modal_mistakes || !content_mistakes.contains(event.target) ) {
                // Hide modal window
                modal_mistakes.style.display = 'none';
                m = 0

                // Reset mistakes counter
                document.getElementById('strike-counter').innerHTML = " 0 / 10";
                // Taker users back to New Game Difficulty Menu
                openModal() 

            }


        }
    }
    /* Code for End of Game Notification Modal Window */
    
    // Render modal window for completed game
    function completedmodal(event) {
        // Show modal window when page loads
       
        var modal = document.getElementById('completed-game-model');
        
        modal.style.display = 'block';
        modal.addEventListener('click', hidecompleted)
    }
    // Code for clicking out of the Completed game modal
    function hidecompleted(event) {
        // Get modal window element by ID
        var modal = document.getElementById('completed-game-model');
        // Get content of modal window
        var content = document.querySelector('.modal-completed-content');

        // Check if element that is clicked on is either modal window background 
        // or not a child of content
        if ( event.target == modal || !content.contains(event.target) ) {
            // Hide modal window
            modal.style.display = 'none';
            

            if (mistakes_counter == true) { // TODO: Implement Database 
                // Reset mistakes counter
                m = 0
                document.getElementById('strike-counter').innerHTML = " 0 / 10";
            }
            
            
            // Takes users back to New Game
            openModal() 
        
        }
        
    }
    
    /* Code for difficulty modal window */

    // Get difficulty modal window and its elements
    const modal = document.getElementById('difficultyModal');
    const closeButton = document.querySelector('.close');
    const expertButton = document.getElementById('expert');
    const easyButton = document.getElementById('easy'); 
  
    
    // Get any parameters from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const newGame = urlParams.get('new');
  
    if (newGame)
      openModal();
    
    // Hard Code Easy Sudoku Games 
    const easy_game_1 = "000004028406000005100030600000301000087000140000709000002010003900000507670400000";
            // Solution: 735164928426978315198532674249381756387256149561749832852617493914823567673495281  
    
    const easy_game_2 = "309000400200709000087000000750060230600904008028050041000000590000106007006000104";
            // Solution: 369218475215749863487635912754861239631924758928357641173482596542196387896573124
    
    const easy_game_3 = "690000140700080000002070060400703000001000300000901004050010600000040002073000058";
            // Solution: 698532147715684923342179865486723591921458376537961284254817639869345712173296458
    
    const easy_game_4 = "401000600700601000095000000140050820800409006032060057000000780000907002004000903";
            // Solution: 421375698783691245695284371146753829857429136932168457219536784368947512574812963
    
    const easy_game_5 = "000081074000304900400200501090040060000605000070090010907008006008502000320760000";
            // Solution: 532981674761354982489276531895147263143625897276893415957418326618532749324769158
    
    // Opens difficulty modal window
    function openModal() {
        modal.style.display = 'block';
    }

    // Closes difficulty modal window
    function closeModal() {
        modal.style.display = 'none';
    }

    // Add event listener to open difficulty modal window on click
    new_button.addEventListener('click', openModal);

    // Add event listener to close difficulty modal window
    closeButton.addEventListener('click', closeModal);
    
    // Add event listener to "Easy" Button 
    let easy = 0 
    easyButton.addEventListener('click', function (e) {
        closeModal();
        var easy_arr = [easy_game_1, easy_game_2, easy_game_3, easy_game_4, easy_game_5];
        game1.set_board(easy_arr[easy]);
        SudokuDOM.display_board(game1, sudoku_squares, true);
        
        if (easy < 4) {
        easy = easy + 1;
        }
        else {
            easy = 0;
        }
        


        if (mistakes_counter == true) { // TODO: Implement Database 
          
            // Reset mistakes counter
            document.getElementById('strike-counter').innerHTML = " 0 / 10";
            m = 0;
        }
    });

    // Add event listener to "Expert" button
    expertButton.addEventListener('click', function (e) {
        closeModal();
        beginner = "080100007000070960026900130000290304960000082502047000013009840097020000600003070";
        game1.set_board(beginner);
        SudokuDOM.display_board(game1, sudoku_squares, true);
        
        if (mistakes_counter == true) { // TODO: Implement Database 
          
            // Reset mistakes counter
            document.getElementById('strike-counter').innerHTML = " 0 / 10";
            m = 0;
        }
    });
    
    /* Code for Restart Button */ 
    restart_button.addEventListener('click', function(e) {
            game1.restart_puzzle();
            SudokuDOM.display_board(game1, sudoku_squares, true);
            
            if (mistakes_counter == true) { // TODO: Implement Database 
        
                // Reset mistakes counter
                document.getElementById('strike-counter').innerHTML = " 0 / 10";
                m = 0;
                
            }
    });
    
    

    /* Full functinoality below:

    // Sudoku Cell Listener
    for ( let row = 0; row <= 8; row++ ) {
        for ( let col = 0; col <= 8; col++ ) {
            sudoku_squares[row][col].addEventListener('input', function(e) {
               e.target.classList.remove("invalid");
               e.target.classList.remove("hint");

               // Listen for illegal moves; if illegal, delete input and 
               // turn square red for 2 seconds
               if ( ! game1.is_legal_move(row, col, e.target.value) && e.target.value != "" ) {
                   e.target.value = "";
                   SudokuDOM.highlight_illegal_move(e.target);
               } else {
                   game1.make_move(row, col, e.target.value);
               }

               // SudokuDOM.display_string(game1, string_box, sudoku_wiki_link);
            });
        }
    }
    */

    //     solve_button.addEventListener('click', function(e) {
    //         const t1 = performance.now();
    //         game1.solve_puzzle();
    //         const t2 = performance.now();
    //         document.querySelector('#algorithm span').innerHTML = (t2 - t1).toFixed(1);
    //         SudokuDOM.display_board(game1, sudoku_squares, string_box, sudoku_wiki_link, false);
    //         algorithm.style.display = 'block';
    //     });

    //     /*
    //     set_button.addEventListener('click', function(e) {
    //         game1.set_as_start_point();
    //         puzzle_picker.selectedIndex = CUSTOM_PUZZLE_SELECTEDINDEX;
    //         SudokuDOM.display_board(game1, sudoku_squares, string_box, sudoku_wiki_link, true);
    //     });
    //     */

    //     validate_button.addEventListener('click', function(e) {
    //         const t1 = performance.now();
    //         const numberOfSolutions = game1.getNumberOfSolutions();
    //         const t2 = performance.now();
    //         document.querySelector('#algorithm span').innerHTML = (t2 - t1).toFixed(1);
    //         algorithm.style.display = 'block';
    //         if ( numberOfSolutions === 1 ) {
    //             window.alert('PASS - Puzzle is valid');
    //         } else {
    //             window.alert('FAIL - Puzzle is invalid');
    //         }
    //     });

    //     legal_moves_button.addEventListener('click', function(e) {
    //         // TODO
    //         const t1 = performance.now();
    //         const numberOfSolutions = game1.getNumberOfSolutions();
    //         const t2 = performance.now();
    //         document.querySelector('#algorithm span').innerHTML = (t2 - t1).toFixed(1);
    //         algorithm.style.display = 'block';
    //         if ( numberOfSolutions === 1 ) {
    //             window.alert('PASS - Puzzle is valid');
    //         } else {
    //             window.alert('FAIL - Puzzle is invalid');
    //         }
    //     });

    //     restart_button.addEventListener('click', function(e) {
    //         game1.restart_puzzle();
    //         SudokuDOM.display_board(game1, sudoku_squares, string_box, sudoku_wiki_link);
    //     });

    //     hint_button.addEventListener('click', function(e) {
    //         const hint = game1.get_hint();
    //         if ( hint ) {
    //             const row = hint.getRow();
    //             const col = hint.getCol();
    //             SudokuDOM.highlight_hint(sudoku_squares[row][col]);
    //         }
    //     });

    //     import_button.addEventListener('click', function(e) {
    //         const board = window.prompt('Please enter a sequence of 81 numbers, with 0 representing an empty square.');
    //         const board_changed = game1.set_board(board);
    //         if ( board_changed ) {
    //             puzzle_picker.selectedIndex = CUSTOM_PUZZLE_SELECTEDINDEX;
    //         }
    //         SudokuDOM.display_board(game1, sudoku_squares, string_box, sudoku_wiki_link);
    //     });

    //     puzzle_picker.addEventListener('change', function(e) {
    //         if ( puzzle_picker.value == 'import' ) {
    //             import_button.click();
    //         } else if ( puzzle_picker.value == 'random' ) {
    //             new_button.click();
    //         } else {
    //             game1.set_board(puzzle_picker.value);
    //             SudokuDOM.display_board(game1, sudoku_squares, string_box, sudoku_wiki_link);
    //         }
    //     });

    //     // Pick the default puzzle. Trigger the <select>.change listener so the puzzle gets loaded.
    //     // selectedIndex starts from 0
    //     puzzle_picker.selectedIndex = DEFAULT_PUZZLE_SELECTEDINDEX;
    //     puzzle_picker.dispatchEvent(new Event('change'));
});

class Helper {
    static createArray(length) {
        var arr = new Array(length || 0), i = length;
        if ( arguments.length > 1 ) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--) {
                arr[length - 1 - i] = Helper.createArray.apply(this, args);
            }
        }
        return arr;
    }

    static delete_value_from_array(arr2, value_to_delete) {
        let array = arr2;
        const index = array.indexOf(value_to_delete);
        if ( index !== -1 ) {
            array.splice(index, 1);
        }
        return array;
    }

    static clone(arr) {
        return JSON.parse(JSON.stringify(arr));
    }

    static get_current_time() {
        return Math.round((new Date()).getTime() / 1000);
    }
}

//TIMER_FUNCTION~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// This class and implementation is inspired by the following repository: https://github.com/ishwar2303/Timer
//notes indicated changes made from source version 

class Timer {

    Timer() {
        this.time = 0;
        this.element = null;
        this.control = true;
        this.callback = null;
        this.timeLimit = 10;
    }

    set(time, id, callback = null) {
        this.time = time;
        this.element = document.getElementById(id);
        this.callback = callback;
    }

    setTimeLimit(time) {
        this.timeLimit = time;
    }

    start(type = 'COUNT_UP') { //default changed from 'COUNT_DOWN' to 'COUNT_UP'
        this.control = true;

        setTimeout(() => {
            if(type == 'COUNT_DOWN')
                this.countDown();
            else if(type == 'COUNT_UP') 
                this.countUp();
        }, 1000);                       //TODO?: change from 1000 to 9999
    }

    format() {
        let hours = parseInt(this.time / 3600);
        let timeLeft = this.time - hours * 3600;
        let minutes = parseInt(timeLeft / 60);
        timeLeft = timeLeft - minutes * 60;
        let seconds = timeLeft;
        
        hours = hours.toString();
        minutes = minutes.toString();
        seconds = seconds.toString();
    
        if (hours.length == 1)
            hours = '0' + hours;
        if (minutes.length == 1)
            minutes = '0' + minutes;
        if (seconds.length == 1)
            seconds = '0' + seconds;
        
        return hours + ':' + minutes + ':' + seconds;
    }

    countDown() {
        if(!this.control)
            return;
        let timerblock = this.element;
        timerblock.innerHTML = this.format();
        timerblock.style.display = 'block';

        if (this.time <= 59) {
            timerblock.style.color = 'red';
        }
    
        if (this.time <= 0) {
            timerblock.innerHTML = 'Time end!';
            this.callback();
            this.stop();
        }
        else {
            setTimeout(() => {
                this.countDown();
            }, 1000);
            this.time--;
        }
    }

    countUp() {
        if(!this.control)
            return;
        let timerblock = this.element;
        timerblock.innerHTML = this.format();
        timerblock.style.display = 'block';
    
        if(this.time >= this.timeLimit) {
            timerblock.innerHTML = 'Timer Limit Exceed!';
            this.callback();
            this.stop();
        }
        else {
            setTimeout(() => {
                this.countUp();
            }, 1000); //TODO?: change from 1000 to 9999
            this.time++;
        }
    }

    stop() {
        this.control = false;
    }
}