const { Builder, By, until } = require('selenium-webdriver');

async function runTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:3000/');

    await driver.findElement(By.id('player1Name')).sendKeys('Jogador1');
    await driver.findElement(By.id('player2Name')).sendKeys('Jogador2');
    await driver.findElement(By.id('startGameBtn')).click();

    await driver.wait(until.elementIsVisible(driver.findElement(By.id('gameSection'))), 10000);

    let gameEnded = false;

    while (!gameEnded) {
      const rollDiceBtn = await driver.findElement(By.id('rollDiceBtn'));
      await driver.wait(until.elementIsVisible(rollDiceBtn), 5000);
      await rollDiceBtn.click();

      await driver.sleep(100);
      const gameInfo = await driver.findElement(By.id('gameInfo')).getText();
      console.log("Mensagem do Jogo:", gameInfo);

      if (gameInfo.includes("venceu a partida")) {
        gameEnded = true;
        console.log(`Partida encerrada! ${gameInfo}`);
      }
    }
  } finally {
    await driver.quit();
  }
}

runTest().catch(console.error);
