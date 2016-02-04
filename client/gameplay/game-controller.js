/**
 * Created by rohitk on 03-Feb-16.
 */
app.controller('gameController', ['$scope', function ($scope) {

    $scope.board = Object.create(null);
    $scope.winStatus = null;
    $scope.matrix = {rows: 9, columns: 9};
    $scope.bombs = 12;
    $scope.firstStart = false;
    $scope.getEncloser = function (i, j, rows, columns) {
        var tempBox = [];
        var rowOutflow = i + 1 >= rows;
        var rowInflow = i - 1 < 0;
        var columnOutflow = j + 1 >= columns;
        var columnInflow = j - 1 < 0;
        if (!rowInflow) {
            if (!columnInflow) tempBox.push([i - 1, j - 1]);
            if (!columnOutflow) tempBox.push([i - 1, j + 1]);
            tempBox.push([i - 1, j]);
        }
        if (!rowOutflow) {
            if (!columnInflow) tempBox.push([i + 1, j - 1]);
            if (!columnOutflow) tempBox.push([i + 1, j + 1]);
            tempBox.push([i + 1, j]);
        }
        if (!columnOutflow) {
            tempBox.push([i, j + 1]);
        }
        if (!columnInflow) {
            tempBox.push([i, j - 1]);
        }
        return tempBox;
    };

    $scope.checkGameWinStatus = function(){
        var winStatus = true;
        for(var i=0;i<$scope.matrix.rows;i++){
            for(var j = 0; j< $scope.matrix.columns; j++){
                var cell = $scope.board.rows[i][j];
                if(cell.isCovered && cell.value != -1)
                    winStatus = false;
            }
        }
        if(winStatus){
            $scope.uncoverAll();
            $scope.winStatus = true;
            $scope.gameRunStatus = false;
        }
    };

    $scope.uncoverAll = function (){
        for(var i =0;i<$scope.matrix.rows; i++){
            for(var j =0;j<$scope.matrix.columns;j++){
                var cell = $scope.board.rows[i][j];
                cell.isCovered = false;
            }
        }
    };

    $scope.checkRevealUncover = function (arr) {
        var firstElement = arr.splice(0, 1);
        if (firstElement && firstElement.length) {
            var tempArr = $scope.getEncloser(firstElement[0].row, firstElement[0].column, $scope.matrix.rows, $scope.matrix.columns);
            var separateArrObject = $scope.filterCells(tempArr);
            arr = arr.concat(separateArrObject.empty);
            $scope.checkRevealUncover(arr);
        }
    };

    $scope.filterCells = function (arr) {
        var separateArrObject = {empty: [], numbered: [], mine: []};

        for (var i = 0; i < arr.length; i++) {
            var tempRow = arr[i][0];
            var tempCol = arr[i][1];
            var cell = $scope.board.rows[tempRow][tempCol];
            if (cell.value == 0) {
                if(cell.isCovered){
                    cell.isCovered = false;
                    separateArrObject.empty.push({row : tempRow, column : tempCol});
                }

            }
            else if (cell.value == -1) {
                separateArrObject.mine.push({row : tempRow, column : tempCol});
            }
            else {
                cell.isCovered = false;
                separateArrObject.numbered.push({row : tempRow, column : tempCol});
            }
        }
        return separateArrObject;
    };

    $scope.initBoard = function (matrix) {
        var board = Object.create(null);
        board.rows = [];


        for (var i = 0; i < matrix.rows; i++) {
            var row = [];
            for (var j = 0; j < matrix.columns; j++) {
                var cell = {isCovered: true, value: 0};
                row.push(cell);
            }
            board.rows.push(row);
        }
        for (var i = 0; i < $scope.bombs; i++) {
            var row = Math.floor(Math.random() * (matrix.rows - 1) + 0);
            var column = Math.floor(Math.random() * (matrix.columns - 1) + 0);
            board.rows[row][column].value = -1;
        }

        for (var i = 0; i < matrix.rows; i++) {
            for (var j = 0; j < matrix.columns; j++) {
                if (board.rows[i][j].value != -1) {
                    var enclosingBoxArray = $scope.getEncloser(i, j, matrix.rows, matrix.columns);
                    for (var k = 0; k < enclosingBoxArray.length; k++) {
                        var enclosingCellRow = enclosingBoxArray[k][0];
                        var enclosingCellColumn = enclosingBoxArray[k][1];
                        if (board.rows[enclosingCellRow][enclosingCellColumn].value == -1)
                            board.rows[i][j].value++;
                    }
                }
            }
        }
        return board;
    };


    $scope.startNewGame = function () {
        $scope.board = $scope.initBoard($scope.matrix);
        $scope.gameRunStatus = true;
    };
    $scope.startNewGame();

    $scope.cellClick = function (row, col) {
        if ($scope.gameRunStatus) {
            var cell = $scope.board.rows[row][col];
            if (cell.value > 0) {
                cell.isCovered = false;
                $scope.checkGameWinStatus();
            }
            else if (cell.value == -1) {
                cell.isCovered = false;
               $scope.uncoverAll();
                $scope.gameRunStatus = false;
                $scope.winStatus = false;
            }
            else {
                cell.isCovered = false;
                $scope.checkRevealUncover([{row : row, column : col}]);
                $scope.checkGameWinStatus();
            }
        }

    };






}]);