// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

     column: function() {
      var self = this;

      return _(_.range(this.get('n'))).map(function(rowIndex, i) {
        return self.get(0).map(function(rowIndex, j) {
          return self.get(j)[i];
        });
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var currentRow  = this.get(rowIndex);  
      var foundOne = 0; 

      for (var i = 0; i < currentRow.length; i++) {
        if (currentRow[i] === 1) {
          foundOne++;
        }
      }
      if (foundOne > 1) {
        return true;
      }
      return false; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var numRows = this.get('n'); 

      for (var i = 0; i < numRows; i++) {
        if (this.hasRowConflictAt(i)) {
          return true; 
        }
         
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var columns  = this.column();
      var currentCol  = columns[colIndex];  
      var foundOne = 0; 

      for (var i = 0; i < currentCol.length; i++) {
        if (currentCol[i] === 1) {
          foundOne++;
        }
      }
      if (foundOne > 1) {
        return true;
      }
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var numRows = this.get('n'); 

      for (var i = 0; i < numRows; i++) {
        if (this.hasColConflictAt(i)) {
          return true; 
        }
         
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var rowIndex, colIndex; 
      var board = this.rows(); 
      var size = this.get('n'); 
      var input = majorDiagonalColumnIndexAtFirstRow; 
      var count = 0; 

      if (input < 0) {
        colIndex = 0; 
        rowIndex = Math.abs(input); 
        for (rowIndex; rowIndex < size; rowIndex++) {
          if (board[rowIndex][colIndex] === 1) {
            count++; 
          }
          colIndex++; 
        } 
      } else {
        rowIndex = 0; 
        colIndex = input; 
        for (colIndex; colIndex < size; colIndex++) {
          if (board[rowIndex][colIndex] === 1) {
            count++; 
          }
          rowIndex++; 
        }
      }
      if (count > 1) {
        return true; 
      }
      return false; 
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var numOfMajorDiags = this.get('n');
      // start at smallest negative value for row index 
      // for n = 4 start would be - 3 
      var start = -numOfMajorDiags + 1;
      for (var i = start; i < numOfMajorDiags; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true; 
        } 
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var rowIndex, colIndex; 
      var board = this.rows(); 
      var size = this.get('n');
      var input = minorDiagonalColumnIndexAtFirstRow;
      var count = 0;  

      if (input < size) {
        rowIndex = 0; // sub for i
        colIndex = input; //sub for j
        for (colIndex; colIndex >= 0; colIndex--) {
          if (board[rowIndex][colIndex] === 1) {
            count++; 
          }
          rowIndex++; 
        }
      } else {
        rowIndex = (input - size) + 1; 
        colIndex = size - 1; 
        for (rowIndex; rowIndex < size; rowIndex++) {
          if (board[rowIndex][colIndex] === 1) {
            count++; 
          }
          colIndex--; 
        }
      }



      if (count > 1) {
        return true; 
      }
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var numOfMinorDiags = this.get('n');
      var length = (numOfMinorDiags - 1) * 2;

      for (var i = 0; i < length; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true; 
        } 
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
