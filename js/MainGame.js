/*
MainGame state - represents the campaign viewport

Upkeep functions after MainGame
*/
var MainGame = {

	preload: function () {

	},

	create: function () {

		//set world bounds and ad canvas image
		game.world.setBounds(0, 0, 2048, 672);
		game.add.image(0, 0, 'canvas');

		//add UI objects
		this.HUDbar = game.add.sprite(0, 0, 'HUD_bar');
		this.HUDbar.fixedToCamera = true;
		this.btnMenu = game.add.button(10, 10, 'btnMenu');
		this.btnMenu.fixedToCamera = true;

		//add level buttons
		lvlManager.placeButtons();

		//track pointer position on input
		game.input.onDown.add(function() {
			console.log('pointer is down');
			this.lastposX = game.input.activePointer.x;
		}, this);
	},

	update: function () {

		//set camera movement
		var pointer = game.input.activePointer;
		if (pointer.isDown) {
			game.camera.x += this.lastposX-pointer.x;
			this.lastposX = pointer.x;
		}
		
	}
};

function callPopUp (btn) {


	lvlManager.loadLevel(btn.name);
}



