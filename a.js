function PlugDat() {
	this.chatHistory = [];
	this.iCurrentHistoryItem = 0;

	this.startAutoWoot();
	this.setupChatHistory();

	// Inject something into the page to mark that we're here
	$("#header-global").append("<font id='DUBTRACK-TEXT' size='2'><font color='red'>ENABLED</font></font>");
}

PlugDat.prototype.setupChatHistory = function() {
	var _this = this;

	var updateChatFromHistory = function() {
		$('#chat-txt-message').val( _this.chatHistory[_this.iCurrentHistoryItem] );
	};

	$("#chat-txt-message").keydown(function(event){
		if( event.keyCode != 38 && event.keyCode != 40 )
			return;

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
	 $(".dubup").click();

	// Start a timer to press the button every 45 seconds
	this.autoWootTimer = setInterval( function() {
		 $(".dubup").click();
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
	this.isDisabled = true;
	$("DUBTRACK-TEXT").remove();
}


if( document.PlugDat === undefined ) {
	console.log( "Creating PlugDat" );
	document.PlugDat = new PlugDat();
} else {
	console.log( "Destroying PlugDat" );
	document.PlugDat.cleanUp();
	document.PlugDat = undefined;
}
// -----------------------------------------------------------------