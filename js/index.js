$("document").ready(function() {
    
    // screen selector
    var screen = $("#screen");
    
    /*
     * functions
     *
     **/
    
    function reset(val) {
        screen.val(val);
        screen.removeClass("current-operation");
        screen.data("isOperationChosen", false); 
        screen.data("operationToExecute", ""); 
        screen.data("setFirstVal", false); 
        screen.data("setSecondVal", false); 
        screen.data("firstVal", val); 
        screen.data("secondVal", 0);
        screen.data("fromPreviousCalc", false);
        screen.data("canChainOperation", false);
    }
    
    
    function equal(){
        if ((screen.data("setFirstVal") == true) && (screen.data("setSecondVal") == true)) { 

            if (screen.data("operationToExecute") == "+") { 
                var result = parseFloat(screen.data("firstVal")) +  parseFloat(screen.data("secondVal")); 

            } else if (screen.data("operationToExecute") == "-") { 
                var result = parseFloat(screen.data("firstVal")) - parseFloat(screen.data("secondVal"));

            } else if (screen.data("operationToExecute") == "x") { 
                var result = parseFloat(screen.data("firstVal")) * parseFloat(screen.data("secondVal"));

            } else if (screen.data("operationToExecute") == "/") { 
                var result = parseFloat(screen.data("firstVal")) / parseFloat(screen.data("secondVal"));
            } 

            screen.val(result); 
            reset(result);
            screen.data("fromPreviousCalc", true);
            screen.data("canChainOperation", true);

            } 
    }
    
    function chainOperations() {
        equal();
        screen.data("fromPreviousCalc", false);
    }
    
    function shouldReactOnBackSpace() {
        var currentVal = screen.val();
        if (currentVal.length > 1) {
            return true;
        }
    }
    
    function deleteLastDigit() {
        var currentVal = screen.val();
        var withoutLastDigit = currentVal.slice(0, currentVal.length - 1);
        screen.val(withoutLastDigit);               
    }
    
    function shouldReactOnDot() {
         var currentVal = screen.val();
         var containDot = currentVal.indexOf(".");
         if(containDot === -1) {
             return true;
         }
    }
    
    /**
      * functionality
      *
      **/
    $(function() {
        // reset calculator when document is ready
        reset("0");
        
        // handle click on numbers
        $(".key").click(function(){
            
            if (screen.data("fromPreviousCalc") == true) {
                reset($(this).text());
            
            // click on number after operator
            } else if ((screen.data("isOperationChosen") == true) && (screen.data("setFirstVal") == false)) {
                if(screen.val() == "") {
                   screen.data("firstVal", 0);
                } else {
                  screen.data("firstVal", $("#screen").val());  
                }
                
                screen.data("setFirstVal", true);
                
                screen.val($(this).text());
                screen.data("secondVal", $("#screen").val());
                screen.data("setSecondVal", true);
                screen.data("canChainOperation", true);
                
            // handle repeated click on number, when first value is already ready
            } else if ((screen.data("isOperationChosen") == true) && (screen.data("setFirstVal") == true)) {
                var currentVal = screen.val();
                var toConcat = $(this).text();
                var moreThanOneDigit = currentVal + toConcat;
                screen.val(moreThanOneDigit);
                screen.data("secondVal", screen.val());
                screen.data("setSecondVal", true);
  
            } else { 
                
                // click on number before operators (firstValue)
                var currentVal = screen.val();
                if(currentVal == "0") {
                    currentVal = "";
                }
                
                var toConcat = $(this).text();
                var moreThanOneDigit = currentVal + toConcat;
                screen.val(moreThanOneDigit);

            }
        });
        
        // handle click on operators
        $(".operator").click(function(){
            
            if(screen.data("fromPreviousCalc") == true) {
                reset(screen.val());
            }
            
            // handle chained operations
            if (screen.data("isOperationChosen") == true && screen.data("setFirstVal") == true && screen.data("setSecondVal") == true && screen.data("canChainOperation") == true) {
               chainOperations();
            }
                
            var operationToExecute = $(this).text();
            screen.data("isOperationChosen", true);
            screen.data("operationToExecute", operationToExecute);        
            $(".operator").removeClass("current-operation");
            $(this).addClass("current-operation");
        });
        
        // handle click on equal
        $(".equal").click(function(){ 
            equal();
        });
        
        // handle click on clear
        $(".clear").click(function(){ 
            reset("0");
        });
        
        // handels click on backspace
        $(".back").click(function() {
            if (shouldReactOnBackSpace()) {
                deleteLastDigit();
            } else {
                // do nothing, value is one digit number
            }
        });
        
        // handle click on dot
        $(".dot").click(function() {
            if(shouldReactOnDot()) {
                var currentVal = screen.val();
                var concatDot = currentVal + ".";
                screen.val(concatDot);             
            } else {
                // do nothing, value already contains dot
            }
        });
    });
});