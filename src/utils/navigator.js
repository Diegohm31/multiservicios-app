export class Navigator {
  goto(path) {
    // se cambia la URL
    window.history.pushState({}, '', path);
    // se dispara el evento popstate, simulando que se hizo enter para que el router pueda actualizar la vista
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

export const navigator = new Navigator();