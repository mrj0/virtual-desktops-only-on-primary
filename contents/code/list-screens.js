for (let i = 0; i < workspace.screens.length; i++) {
  const screen = workspace.screens[i];
  console.log(
    `Screen #${i}: Name: ${screen.name}, Brand: ${screen.manufacturer}, Model: ${screen.model}`,
  );
}
