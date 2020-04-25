const deaths = [
  /\[(\d{2}:\d{2}):\d{2}\] \[Server thread\/.*?\]: (.*?) (fell .*)/
];

exports.getDeathInfo = (logMessage) => {
  for (const death of deaths) {
    let filteredLogMessage = logMessage.match(death);

    if (filteredLogMessage != null) {
      return {
        timestamp: filteredLogMessage[1],
        playerName: filteredLogMessage[2],
        causeOfDeath: filteredLogMessage[3]
      };
    }
  }
  
  return {}
}