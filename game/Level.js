function manageLevel() {
    if (!lastWave) {
        wave++;
        loadLevel();
        levelDuration = setTimeout(manageLevel, runTime * 1000);
    }
    else clearTimeout(coinInterval);
}

function loadLevel() {
    let randomP;
    switch (level) {
        case 0:
            console.log("level 0");
            switch (wave) {
                case 0:
                    break;

                case 1:
                    console.log("1st Wave");
                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(randomP, 0, 3, 3, 1, 0, 0));
                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(randomP, height, 3, 3, 1, 0, 0));

                    runTime = 12;
                    break;

                case 2:
                    console.log("2nd Wave");
                    spawnPoints[0].period += 2000;
                    spawnPoints[1].period += 2000;
                    spawnPoints[0].resetInterval();
                    spawnPoints[1].resetInterval();
                    randomP = random(height);
                    spawnPoints.push(new SpawnPoint(0, randomP, 5, 3, 1, 0, 0));
                    randomP = random(height);
                    spawnPoints.push(new SpawnPoint(width, randomP, 5, 3, 1, 0, 0));

                    runTime = 15;
                    break;

                case 3:
                    console.log("3rd Wave");
                    spawnPoints[2].resetInterval();
                    spawnPoints[3].resetInterval();
                    spawnPoints[0].addMinions(1, 0, 0);
                    spawnPoints[1].addMinions(1, 0, 0);
                    returnTime = 20;
                    lastWave = true;
                    break;
            }
            break;//__________________________________________________________________________

        case 1:
            console.log("level 1");
            switch (wave) {
                case 1:
                    console.log("1st Wave");
                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(randomP, 0, 3, 3, 2, 0, 0));
                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(randomP, height, 3, 3, 2, 0, 0));

                    runTime = 12;
                    break;

                case 2:
                    console.log("2nd Wave");
                    spawnPoints[0].period += 2000;
                    spawnPoints[1].period += 2000;
                    spawnPoints[0].resetInterval();
                    spawnPoints[1].resetInterval();
                    randomP = random(height);
                    spawnPoints.push(new SpawnPoint(0, randomP, 5, 3, 1, 0, 0));
                    randomP = random(height);
                    spawnPoints.push(new SpawnPoint(width, randomP, 5, 3, 1, 0, 0));

                    runTime = 15;
                    break;

                case 3:
                    console.log("3rd Wave");
                    spawnPoints[0].addMinions(0, 1, 0);
                    spawnPoints[1].addMinions(0, 1, 0);
                    lastWave = true;
                    break;
            }
            break; //____________________________________________________________________________

        case 2:
            console.log("level 2");
            switch (wave) {
                case 1:
                    console.log("1st Wave");
                    let barrierO = createVector(width / 4, height / 2);
                    let barrierE = createVector(width / 2, height / 4);
                    barriers.push(new Barrier(barrierO, barrierE));
                    barrierO = createVector(width * 3 / 4, height / 2);
                    barrierE = createVector(width / 2, height * 3 / 4);
                    barriers.push(new Barrier(barrierO, barrierE));

                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(randomP, 0, 3, 3, 2, 0, 0));
                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(randomP, height, 3, 3, 2, 0, 0));

                    runTime = 15;
                    break;

                case 2:
                    spawnPoints[0].period += 2000;
                    spawnPoints[1].period += 2000;
                    spawnPoints[0].resetInterval();
                    spawnPoints[1].resetInterval();
                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(0, randomP, 7, 2, 0, 1, 0));
                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(width, randomP, 7, 2, 0, 1, 0));
                    runTime = 20;
                    break;

                case 3:
                    console.log("3rd Wave");
                    spawnPoints[0].resetInterval();
                    spawnPoints[1].resetInterval();
                    spawnPoints[2].addMinions(1, 0, 0);
                    spawnPoints[3].addMinions(1, 0, 0);
                    lastWave = true;
                    break;
            }
            break;//_________________________________________________________________________

        case 3:
            console.log("level 3");
            switch (wave) {
                case 1:
                    console.log("1st Wave");
                    let barrierO = createVector(width / 4, height / 2);
                    let barrierE = createVector(width / 2, height / 4);
                    barriers.push(new Barrier(barrierO, barrierE));
                    barrierO = createVector(width * 3 / 4, height / 2);
                    barrierE = createVector(width / 2, height * 3 / 4);
                    barriers.push(new Barrier(barrierO, barrierE));

                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(randomP, 0, 3, 3, 2, 0, 0));
                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(randomP, height, 3, 3, 2, 0, 0));
                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(0, randomP, 7, 1, 0, 1, 0));
                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(width, randomP, 7, 1, 0, 1, 0));
                    runTime = 15;
                    break;

                case 2:
                    console.log("2nd Wave");
                    spawnPoints[0].period += 2000;
                    spawnPoints[1].period += 2000;
                    spawnPoints[0].resetInterval();
                    spawnPoints[1].resetInterval();
                    spawnPoints[2].addMinions(1, 0, 0);
                    spawnPoints[3].addMinions(1, 0, 0);
                    runTime = 15;
                    break;

                case 3:
                    console.log("3rd Wave");
                    spawnPoints[0].resetInterval();
                    spawnPoints[1].resetInterval();
                    spawnPoints[2].period -= 2000;
                    spawnPoints[3].period -= 2000;
                    spawnPoints[1].resetInterval();
                    spawnPoints[2].manyWaves += 2;
                    spawnPoints[3].manyWaves += 2;
                    spawnPoints[2].resetInterval();
                    spawnPoints[3].resetInterval();
                    lastWave = true;
                    break;
            }
            break;//__________________________________________________________________________

        case 4:
            console.log("level 4");
            switch (wave) {
                case 0:
                    break;

                case 1:
                    console.log("1st Wave");
                    let barrierO = createVector(width / 4, height / 4);
                    let barrierE = createVector(width / 4, height * 3 / 4);
                    barriers.push(new Barrier(barrierO, barrierE));
                    barrierO = createVector(width * 3 / 4, height / 4);
                    barrierE = createVector(width * 3 / 4, height * 3 / 4);
                    barriers.push(new Barrier(barrierO, barrierE));

                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(randomP, 0, 3, 3, 3, 0, 0));
                    randomP = random(width);
                    spawnPoints.push(new SpawnPoint(randomP, height, 3, 3, 3, 0, 0));

                    runTime = 12;
                    break;

                case 2:
                    console.log("2nd Wave");
                    spawnPoints[0].period += 2000;
                    spawnPoints[1].period += 2000;
                    spawnPoints[0].resetInterval();
                    spawnPoints[1].resetInterval();
                    randomP = random(height);
                    spawnPoints.push(new SpawnPoint(0, randomP, 5, 3, 1, 1, 0));
                    randomP = random(height);
                    spawnPoints.push(new SpawnPoint(width, randomP, 5, 3, 1, 1, 0));

                    runTime = 20;
                    break;

                case 3:
                    console.log("3rd Wave");
                    spawnPoints[0].manyWaves = 1;
                    spawnPoints[0].addMinions(0, 0, 1);
                    
                    lastWave = true;
                    break;
            }
            break;//__________________________________________________________________________

        default:
            mode = 1;
            break;

    }
}