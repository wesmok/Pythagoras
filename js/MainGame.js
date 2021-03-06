/*
MainGame state - represents the campaign viewport

Upkeep functions after MainGame
*/
var MainGame = {

	create: function() {

		//add display objects in z order
		//set world bounds and ad canvas image
		game.world.setBounds(0, 0, 2048, 672);
		game.camera.position = lvlManager.getCameraPos();
		game.add.image(0, 0, 'canvas');
		this.cameraEnabled = true;

		//add level buttons
		this.addLevelButtons();
		//add area overlay
		this.overlay = addAreaOverlay();

		//add objects to HUD group
		this.HUD = game.add.group();
		this.HUD_panel = game.add.image(0, 0, 'HUDpanel', null, this.HUD);
		this.HUD_menu = game.add.button(10, 35, 'btnMenu', this.callMenu, this, 0, 1, 2, 0, this.HUD);
		this.HUD_menu.anchor.setTo(0, 0.5);
		this.HUD_menu.scale.set(0.5);
		this.HUD_score = game.add.image(game.width-10, 35, 'HUDscore', null, this.HUD);
		this.HUD_score.anchor.setTo(1, 0.5);
		this.HUD_text = game.add.text(this.HUD_score.centerX+12, this.HUD_score.centerY+3, scrManager.getScore(), null, this.HUD);
		this.HUD_text.anchor.setTo(0.5);
		//add lifes
		this.lifes = game.add.group(this.HUD);
		this.lifes.createMultiple(3, 'lifeToken', null, true);
		this.lifes.align(-1, 1, this.HUD_menu.height, this.HUD_menu.height, Phaser.CENTER);
		this.lifes.position.setTo(this.HUD_score.left-200, this.HUD_menu.top);
		//fix HUD to camera
		this.HUD.fixedToCamera = true;

		//add objects to level popup group
		this.lvlPopup  = game.add.group();
		this.lvl_panel = game.add.image(0, 0, 'lvlPanel', null, this.lvlPopup);
		this.lvl_coin  = game.add.image(286, 47, 'coin', null, this.lvlPopup);
		this.lvl_token = game.add.sprite(82, 59, 'tokens', 0, this.lvlPopup);
		this.lvl_text  = game.add.text(this.lvl_coin.centerX, 105, '000'+'/'+'XXX', null, this.lvlPopup);
		this.lvl_text.anchor.setTo(0.5, 0);
		this.lvl_start = game.add.button(39, 183, 'btnStart', start, this, 0, 1, 2, 1, this.lvlPopup);
		this.lvl_start.scale.setTo(0.7);
		this.lvl_close = game.add.button(229, 183, 'btnClose', this.closePopUp, this, 0, 1, 2, 1, this.lvlPopup);
		this.lvl_close.scale.setTo(0.7);
		this.lvl_close.data.popup = this.lvlPopup;
		this.lvlPopup.visible = false;

		//add objects to complete popup group
		this.cmpPopup  = game.add.group();
		this.cmp_panel = game.add.image(0, 0, 'cmpPanel', null, this.cmpPopup);
		this.cmp_bar   = game.add.image(this.cmp_panel.centerX-12, 80, 'cmpBar', null, this.cmpPopup);
		this.cmp_bar.anchor.setTo(0.5, 0);
		this.cmp_life  = game.add.sprite(this.cmp_bar.right, this.cmp_bar.centerY, 'lifeToken', null, this.cmpPopup);
		this.cmp_life.anchor.setTo(0.5);
		this.cmp_gold  = game.add.sprite(this.cmp_life.centerX, this.cmp_life.top, 'tokens', 3, this.cmpPopup);
		this.cmp_gold.scale.setTo(0.66);
		this.cmp_gold.anchor.setTo(0.5, 1);
		this.cmp_silver = game.add.sprite(0, this.cmp_bar.bottom-3, 'cmpTokens', 1, this.cmpPopup);
		this.cmp_silver.x = this.cmp_bar.left+3+480*0.8;
		this.cmp_silver.anchor.setTo(0.5, 1);
		this.cmp_bronze = game.add.sprite(0, this.cmp_bar.bottom-3, 'cmpTokens', 0, this.cmpPopup);
		this.cmp_bronze.x = this.cmp_bar.left+3+480*0.6;
		this.cmp_bronze.anchor.setTo(0.5, 1);
		this.cmp_coin  = game.add.image(this.cmp_panel.centerX-90, this.cmp_bar.bottom+20, 'coin', null, this.cmpPopup);
		this.cmp_text  = game.add.text(this.cmp_coin.right+10, this.cmp_coin.centerY, '000'+'/'+'XXX', null, this.cmpPopup);
		this.cmp_text.anchor.setTo(0, 0.5);
		this.cmp_close = game.add.button(this.cmp_panel.centerX, 300, 'btnClose', this.closePopUp, this, 0, 1, 2, 1, this.cmpPopup);
		this.cmp_close.anchor.setTo(0.5, 0);
		this.cmp_close.scale.setTo(0.7);
		this.cmp_close.data.popup = this.cmpPopup;
		this.cmp_score = game.add.image(this.cmp_close.centerX, this.cmp_close.top-20, 'cmpScore', null, this.cmpPopup);
		this.cmp_score.anchor.setTo(0.5, 1);
		this.cmp_scrText = game.add.text(this.cmp_score.centerX+12, this.cmp_score.centerY+3, '+9999', null, this.cmpPopup);
		this.cmp_scrText.anchor.setTo(0.5);
		this.cmpPopup.visible = false;
		//show popup if a level is completed
		if(scrManager.getCompleted()) this.callComplete();

		//add objects to menu popup group
		this.mnPopup = game.add.group();
		this.mn_panel = game.add.image(10, 80, 'menuPanel', null, this.mnPopup);
		//add 4 buttons
		var delim = 60;
		this.mn_pause = game.add.button(this.mn_panel.centerX, this.mn_panel.y+delim+20, 'btnPause', function(){}, this, 0, 1, 2);
		this.mn_pause.hitArea = new Phaser.Circle(0, 0, this.mn_pause.width);
		this.mn_pause.anchor.setTo(0.5);
		this.mn_pause.scale.setTo(0.7);
		this.mn_sound = game.add.button(this.mn_panel.centerX, this.mn_pause.bottom+delim, 'btnSound', function(){}, this, 0, 1);
		this.mn_sound.hitArea = new Phaser.Circle(0, 0, this.mn_sound.width);
		this.mn_sound.anchor.setTo(0.5);
		this.mn_sound.scale.setTo(0.7);
		this.mn_ladder = game.add.button(this.mn_panel.centerX, this.mn_sound.bottom+delim, 'btnLadder', function(){}, this, 0, 1, 2);
		this.mn_ladder.hitArea = new Phaser.Circle(0, 0, this.mn_ladder.width);
		this.mn_ladder.anchor.setTo(0.5);
		this.mn_ladder.scale.setTo(0.7);	
		this.mn_home = game.add.button(this.mn_panel.centerX, this.mn_ladder.bottom+delim, 'btnHome', function(){}, this, 0, 1, 2);
		this.mn_home.hitArea = new Phaser.Circle(0, 0, this.mn_home.width);
		this.mn_home.anchor.setTo(0.5);
		this.mn_home.scale.setTo(0.7);
		this.mnPopup.addMultiple([this.mn_pause, this.mn_sound, this.mn_ladder, this.mn_home]);
		this.mnPopup.visible = false;
		this.mnPopup.fixedToCamera = true;
		//add data to menu button
		this.HUD_menu.data.popup = this.mnPopup;

		//assign events
		//track pointer position on input
		game.input.onDown.add(function() {
			console.log('pointer is down');
			this.lastposX = game.input.activePointer.x;
		}, this);
	},

	update: function() {

		//camera movement
		var pointer = game.input.activePointer;
		if (pointer.isDown && this.cameraEnabled) {
			game.camera.x += this.lastposX-pointer.x;
			this.lastposX = pointer.x;
		}
	},

	//show and close popups
	//level complete popup
	callComplete: function () {

		this.Buttons.setAll('inputEnabled', false);
		this.cmpPopup.position.setTo(game.camera.x+(game.width-this.cmp_panel.width)/2, (game.height-this.cmp_panel.height)/2);
		this.cmpPopup.visible = true;
		this.cameraEnabled = false;

		//reset score manager
		scrManager.reset();
	},
	//menu popup
	callMenu: function (btn) {

		if(btn.data.popup.visible) {

			btn.data.popup.visible = false;
		}
		else {

			btn.data.popup.visible = true;
		}
	},
	//level popup
	callLevel: function(btn) {

		this.lvl_text.setText(btn.data.score+'/'+'XXX');
		this.lvl_token.frame = statusToInt(btn.data.status);
		this.lvl_start.name = btn.data.label;
		this.Buttons.setAll('inputEnabled', false);
		this.lvlPopup.position.setTo(game.camera.x+(game.width-this.lvl_panel.width)/2, (game.height-this.lvl_panel.height)/2);
		this.lvlPopup.visible = true;
		this.cameraEnabled = false;
	},
	//close popup
	closePopUp: function(btn) {
		this.Buttons.setAll('inputEnabled', true);
		btn.data.popup.visible = false;
		this.cameraEnabled = true;
	},

	//add level buttons to MainGame
	addLevelButtons: function() {

		this.Buttons = game.add.group();
		var button = null;
		var level = null;
		var f = null;
		for (var i in Levels) {
			//create the button, set its hitArea to a circle and set its name to the level label
			level = Levels[i];
			f = statusToInt(level.status);
			//check if the button is locked
			if (f==null) {
				button = game.add.image(level.btnX+60, level.btnY+60, 'btnLocked');
			}
			else {
				button = game.add.button(level.btnX+60, level.btnY+60, 'btn'+level.difficulty, this.callLevel, this, f+4, f, f+8, f);
				button.hitArea = new Phaser.Circle(0, 0, button.width);
			}
			button.anchor.setTo(0.5);
			button.data = level;
			if(level.difficulty!='Boss') button.scale.set(0.7);
			this.Buttons.add(button);
		}
	}
};