export type LoginCorrect = {
  isCorrect: true,
  id: string
}

export type LoginIncorrect = {
  isCorrect: false
}

export type LoginResult = LoginCorrect | LoginIncorrect;