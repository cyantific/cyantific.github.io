//////////////////////////////////////////////////////////////////////////
// PlugDat - Some tools and fun stuff for plug.dj
//////////////////////////////////////////////////////////////////////////
//
// Main script!
/* ----------------------------------------------------------------------
													Object Structures
-------------------------------------------------------------------------

*/
//////////////////////////////////////////////////////////////////////////
// Constructor
function PlugDat() {
	// Some member variables
	this.chatHistory = [];
	this.iCurrentHistoryItem = 0;

	// Setup various components
	this.startAutoWoot();
	this.setupChatHandlers();
	this.setupChatHistory();

	// Inject something into the page to mark that we're here
	$("#room-name").append("ENABLED");
}


PlugDat.prototype.setupChatHistory = function() {
	var _this = this;

	var updateChatFromHistory = function() {
		$('#chat-txt-message').val( _this.chatHistory[_this.iCurrentHistoryItem] );
	};

	$("#chat-txt-message").keydown(function(event){
		if( event.keyCode != 38 && event.keyCode != 40 )
			return;

		if( _this.isDisabled )
			return true;

		if( event.keyCode == 38 && _this.iCurrentHistoryItem > 0) {
			_this.iCurrentHistoryItem -= 1;
		}

		if( event.keyCode == 40 && _this.iCurrentHistoryItem < _this.chatHistory.length ) {
			_this.iCurrentHistoryItem += 1;
		}

		updateChatFromHistory();
	});
}


PlugDat.prototype.startAutoWoot = function() {
	// Press the button immediately so the user can see the effects
	$("#dubup").click();

	// Start a timer to press the button every 45 seconds
	this.autoWootTimer = setInterval( function() {
		$("#dubup").click();
	}, 45000);
}

PlugDat.prototype.stopAutoWoot = function() {
	// Stop our auto-woot timer if it exists
	if( this.autoWootTimer != undefined )
		clearInterval( this.autoWootTimer );
}

PlugDat.prototype.cleanUp = function() {
	console.log( "Cleaning up PlugDat" );
	this.stopAutoWoot();
	this.stopAutoSkip();

	this.isDisabled = true;

	$("ENABLED").remove();
}


PlugDat.prototype.setupChatHandlers = function() {
	var _this = this;

	if( this.justHandledTimers === undefined )
		this.justHandledTimers = {};

	API.on( API.CHAT, function(value) {
		// If we're disabled, that means this is a callback sitting around from
		// who knows when. Just do nothing.
		if( _this.isDisabled || value.fromID == API.getUser() )
			return;

		_this.chatHistory.push( value.message );
		_this.iCurrentHistoryItem = _this.chatHistory.length;
	});


	API.on( API.CHAT_COMMAND, function(value) {
		// If we're disabled, that means this is a callback sitting around from
		// who knows when. Just do nothing.
		if( _this.isDisabled )
			return;

		// Look through each command
		for( var iCommand in commands ) {

			// Create a new handler timer if we don't have one already
			// This will set an all clear flag in two seconds to continue on with the command
			_this.justHandledTimers[iCommand] = _this.justHandledTimers[iCommand] || {
				isClear: true,
				resetTimeout: function( handler ) {
					setTimeout( function() {
						handler.isClear = true;
					}, 2000);
				}
			};

			// Create a closure so that we can preserve variables while we loop
			(function(){

				// Preserve this template for closure
				var thisHandler = _this.justHandledTimers[iCommand];

				// If this command contains a keyword, go forward
				if( value.indexOf(iCommand) != -1 ) {

					// Now, if we're clear to respond to the command, go for it
					if( thisHandler.isClear ) {
						// Start the timer so we don't accidentally launch a second one immediately
						thisHandler.isClear = false;
						thisHandler.resetTimeout( thisHandler );

						if( typeof(commands[iCommand]) == "string" ) {
							console.log( "Spitting out some ascii or something" );
							API.sendChat( commands[iCommand] );
						} else {
							console.log( "Calling handler function" );
							commands[iCommand]( value );
						}
					}
				}
			})(); // end anonymous function
		} // end for each command
	}); // end API.on( API.CHAT_COMMAND )
} // end setupChatHandlers()


var commands = {
	"/whatever": 			"¯\\_(?)_/¯",
	"/tableflip": 			"(?°?°)?? ???",
	"/tablefix": 			"\-\-\-? ?( ?-??)",
	"/seriousface": 		"?_?",
	"/cat": 				"(=???=)",
	"/fastcat": 			"(???)?³?3",
	"/deadcat": 			"(=x?x=)",
	"/sleepycat": 			"(???)z?",
	"/happycat": 			"?(=^???^=)?",
	"/pootcat": 			"(???)?³?3",
	"/jazzhands": 			"?(=???=)?",
	"/woof": 				"(U·x·U)",
	"/squid": 				"<?:?",
	"/fish": 				"??)?????",
	"/snowman": 			"??????????????",
	"/wizard": 				"(n`-´)????.*???",
	"/raiseyourdongers": 	"?? ??? ??",
	"/fuckyou": 			"?(???)?",
};


// -----------------------------------------------------------------
// Create or destroy ourselves depending on the current situation
// -----------------------------------------------------------------
if( document.PlugDat === undefined ) {
	console.log( "Creating PlugDat" );
	document.PlugDat = new PlugDat();
} else {
	console.log( "Destroying PlugDat" );
	document.PlugDat.cleanUp();
	document.PlugDat = undefined;
}
// -----------------------------------------------------------------