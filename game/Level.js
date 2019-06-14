function manageLevel() {
    if (!lastWave) {
        wave++;
        loadLevel();
        levelDuration = setTimeout(manageLevel, runTime * 1000);
    }
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

                    runTime = 12;															// REFACTOR RUNTIME
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
                    spawnPoints[0].addMinions(1, 0, 0);
                    spawnPoints[1].addMinions(1, 0, 0);

                    returnTime = 20;
                    lastWave = true;
                    break;
            }
            break;

        case 1:
            console.log("level 1");
            switch (wave) {
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
                case 2:
                    console.log("2nd Wave");
                    spawnPoints[0].manyWaves = 1;
                    spawnPoints[1].manyWaves = 1;
                    spawnPoints[0].addMinions(0, 0, 1);
                    spawnPoints[1].resetInterval;
                    runtime = 15;
                    break;

                case 3:
                    console.log("3rd Wave");
                    spawnPoints[0].addMinions(1, 0, 0);
                    spawnPoints[1].addMinions(1, 0, 0);
                    spawnPoints[2].resetInterval();
                    spawnPoints[3].resetInterval();

                    runTime = 20;
                    lastWave = true;
                    break;
            }
            break;

        case 2:
            console.log("level 1");
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

                    runTime = 12;
                    console.log("4th Wave");
                    spawnPoints[0].addMinions(0, 1, 0);
                    spawnPoints[1].addMinions(0, 1, 0);
                    break;

                case 2:
                    console.log("2nd Wave");
                    spawnPoints[0].manyWaves = 1;
                    spawnPoints[1].manyWaves = 1;
                    spawnPoints[0].addMinions(0, 0, 1);
                    spawnPoints[1].resetInterval;
                    runtime = 5;
                    lastWave = true;
                    break;
            }
            break;

        default:

    }
}