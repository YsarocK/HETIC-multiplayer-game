export interface Player {
  id: string
  position: {
    x: number
    y: number
  }
}

export interface Game {
  players: Player[]
  state: 'waiting' | 'playing' | 'finished'
}