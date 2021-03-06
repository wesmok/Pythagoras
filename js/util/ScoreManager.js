//score manager
function ScoreManager() {

	const maxEasy 	= 300,
		  maxMedium = 400,
		  maxHard 	= 500;

	var totalScore = 0,
		roomScore = 0,
		oldScore = 0,
		newScore = 0,
		lvlCompleted = false,
		areaReq = new Array();
	areaReq.fill(0);

	this.cumulateNumbers = function(level) {

		//calculate area requirements
		var points = 0;
		switch (level.difficulty) {
			case 'Easy': 	points = 1*maxEasy; 	break;
			case 'Medium': 	points = 0.5*maxMedium; break;
			case 'Hard': 	points = 0.2*maxHard; 	break;
			default: break;
		}
		areaReq[level.area+1] += points;

		//calculate totalScore
		totalScore += level.score;
	};

	this.calcRoomScore = function(prc_score) {

	}

	this.calcLevelScore = function() {


		//update TotalScore
		totalScore += newScore - oldScore;

		//level completed
		lvlCompleted = true;
	}

	this.reset = function () {

		roomScore = 0;
		oldScore = 0;
		newScore = 0;
		lvlCompleted = false;
	}

	this.getScore = function() {
		return totalScore;
	}
	this.getLvlScore = function() {
		return lvlScore;
	}
	this.getCompleted = function() {
		return lvlCompleted;
	}
}
