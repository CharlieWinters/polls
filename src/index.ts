export async function init() {
  miro.board.ui.on('icon:click', async () => {
    await miro.board.ui.openPanel({url: 'app.html'});
  });

  miro.board.events.on('OPEN_MODAL', async(message) => {
    await miro.board.ui.openModal({url: 'poll-participant.html'});
  });
}

init();
