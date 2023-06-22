function abc(e, s) {
  return (
    HTMLFormElement.prototype.addEventListener.call(e, 'submit', s),
    {
      destroy() {
        HTMLFormElement.prototype.removeEventListener.call(e, 'submit', s)
      },
    }
  )
}
