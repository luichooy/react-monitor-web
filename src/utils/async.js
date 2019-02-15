export function setStateAsync(nextState) {
  return new Promise(resolve => {
    this.setState(nextState, resolve);
  });
}
