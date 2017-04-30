/**
 * Created by ajayguptapnp on 29-04-2017.
 */
angular.module('myApp').controller('homeController', function ($scope, $window,$timeout) {



    var cardClass = function (desc, userName, status) {
        this.id = cardClass.prototype.pointer++;
        this.description = desc||'Blank Description';
        this.userName = userName||'Unknown Username';
        this.status = status||'Not Done';

    };

    //maintain a counter of cards added so that it can help in assigning card a unique number
    cardClass.prototype.pointer = 0;

    //Define method to edit any property in the card
    cardClass.prototype.editCard = function (c) {
        //cannot change the id
        this.description = c.description||'Blank Description';
        this.userName = c.userName||'Unknown Username';
        this.status = c.status||'Not Done';
    };

    //method to parse plain object to cardClass object
    cardClass.prototype.parse = function (obj) {
        //var obj=JSON.parse(str)
        return new cardClass(obj.description, obj.userName, obj.status)
    }

    //Constructor function for a list
    var taskList = function (title) {
        this.id = taskList.prototype.counter++;
        this.title = title;
        this.cards = []
    };

    //Counter to maintain no of list created and assigning unique id to list
    taskList.prototype.counter = 0;
    taskList.prototype.editList = function (title) {
        this.title = title;
    };

    //add existing card in list at a specified position
    taskList.prototype.addCard = function (card, pos) {
        this.cards.splice(pos, 0, card)
    };


    //remove card from the list
    taskList.prototype.removeCard = function (index) {

        this.cards.splice(index,1)


    }

   //method to parse plain object to taskList object
    taskList.prototype.parse = function (obj) {
        //var obj=JSON.parse(str)
        var taskListObj = new taskList(obj.title)
        obj.cards.forEach(function (data) {
            var cardObj = cardClass.prototype.parse(data)
            taskListObj.addCard(cardObj, taskListObj.cards.length)
        })
        return taskListObj;
    }

    //Constructor function for making new dashboard
    var dashboard = function () {
        this.id = dashboard.prototype.counter++;
        this.listArray = [];

    }
    dashboard.prototype.counter = 0;

    //Add list to the dashboard
    dashboard.prototype.addList = function (list) {
        this.listArray.push(list)
    }
    //remove list from the dashboard
    dashboard.prototype.removeList = function (listId) {
        var it
        this.listArray.forEach(function (l, index) {
            if (l.id == listId) {
               it=index;
            }
        })
        this.listArray.splice(it,1)
    }

    //method to parse string to dashboard object
    dashboard.prototype.parse = function (str) {
        var obj = JSON.parse(str)
        var myDashboard = new dashboard()
        obj.listArray.forEach(function (data) {
            var la = taskList.prototype.parse(data)
            myDashboard.addList(la)
        })
        return myDashboard

    }


    $scope.listCounter = 0




    //function to make a list
    $scope.addList = function () {
        var list = new taskList("untitled")
        $scope.myDashboard.addList(list)
    }


    //function to add card to specified list
    $scope.addCardToList = function (list, desc, userName, status) {
        var card = new cardClass(desc, userName, status)
        list.addCard(card, list.cards.length)

    }

    //Make a new card in specified list
    $scope.submitCard=function(c){
        $("#addCardModal").modal("hide")
        $scope.addCardToList($scope.selectedList, c.description, c.name, c.status)
    }

    //open a popup to make a new card
    $scope.openAddCardPopup=function(list){
        $scope.selectedList=list
        $scope.newCard={}
        $("#addCardModal").modal("show")
    }

    console.log($scope.dash1)


    //To prevent data loss, storing it in localstorage before page refresh
    window.onbeforeunload = function() {
        localStorage.clear()
        var str=JSON.stringify($scope.myDashboard)
        localStorage.setItem("savedData",str)
        return null;
    }

    $timeout(function(){

        //Check when the controller loads if there is data stored in localstorage,if so retrieve it and parse in the dashboard object
        var storedData = localStorage.getItem("savedData");
        if (storedData !== null)
        {
            $scope.myDashboard=dashboard.prototype.parse(storedData)
            $scope.str = JSON.stringify($scope.myDashboard)
            console.log(JSON.parse($scope.str))
        }else{
            $scope.myDashboard = new dashboard();
            $scope.addList()
        }

    },100)

    //Code to edit some card
    $scope.showCard=[]

    $scope.showEdit=function(c){
        if(!$scope.showCard[c.id]){
            $scope.newCard=JSON.parse(JSON.stringify(c));
            $scope.showCard[c.id]=true
        }else{
            $scope.newCard={};
            $scope.showCard[c.id]=false
        }

    }


    //Drag and drop events
    $scope.dropSuccessHandler = function($event,index,listObj){
        listObj.removeCard(index,1);
    };

    $scope.onDrop = function($event,$data,listObj){
        listObj.addCard($data,listObj.cards.length);
    };

})
